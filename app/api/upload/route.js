export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { writeFileSync, mkdirSync, readFileSync, copyFileSync } from 'fs'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const DATA_PATH = join(process.cwd(), 'data', 'issues.json')

function getIssues() {
  try { return JSON.parse(readFileSync(DATA_PATH, 'utf8')) } catch { return [] }
}

function saveIssues(issues) {
  writeFileSync(DATA_PATH, JSON.stringify(issues, null, 2))
}

async function renderPdfPages(pdfBuffer, issueDir, pagesDir, issueId) {
  try {
    // Lazy require — keeps native modules out of build-time analysis
    const sharp = (await import('sharp')).default
    const { createCanvas } = await import('canvas')
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    })
    const pdf = await loadingTask.promise
    const totalPages = pdf.numPages
    const SCALE = 2.0

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: SCALE })
      const width = Math.floor(viewport.width)
      const height = Math.floor(viewport.height)
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise
      const rawBuffer = canvas.toBuffer('raw')
      const webpBuffer = await sharp(rawBuffer, {
        raw: { width, height, channels: 4 }
      }).webp({ quality: 90 }).toBuffer()
      writeFileSync(join(pagesDir, `${pageNum}.webp`), webpBuffer)
      console.log(`[${issueId}] Rendered page ${pageNum}/${totalPages}`)
    }

    copyFileSync(join(pagesDir, '1.webp'), join(issueDir, 'cover.webp'))
    const issues = getIssues()
    const idx = issues.findIndex(i => i.id === issueId)
    if (idx !== -1) {
      issues[idx].coverPath = `/issues/${issueId}/cover.webp`
      issues[idx].pagesPath = `/issues/${issueId}/pages`
      issues[idx].totalPages = totalPages
      issues[idx].status = 'published'
      saveIssues(issues)
    }
    console.log(`[${issueId}] Render complete — ${totalPages} pages`)
  } catch (err) {
    console.error(`[${issueId}] Render failed:`, err)
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const title = formData.get('title') || 'Untitled'
    const subtitle = formData.get('subtitle') || ''
    const volume = formData.get('volume') || ''
    const issueDate = formData.get('issueDate') || new Date().toISOString().split('T')[0]
    const tags = formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : []

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const id = uuidv4()
    const issueDir = join(process.cwd(), 'public', 'issues', id)
    const pagesDir = join(issueDir, 'pages')
    mkdirSync(pagesDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    writeFileSync(join(issueDir, 'document.pdf'), buffer)
    const fileSizeMb = (buffer.byteLength / 1024 / 1024).toFixed(1) + ' MB'

    const issue = {
      id, title, subtitle, volume, issueDate, tags,
      status: 'processing',
      pdfPath: `/issues/${id}/document.pdf`,
      coverPath: null, pagesPath: null, totalPages: null,
      fileSize: fileSizeMb,
      createdAt: new Date().toISOString(),
      canvasTemplate: null
    }

    const issues = getIssues()
    issues.unshift(issue)
    saveIssues(issues)

    renderPdfPages(buffer, issueDir, pagesDir, id)

    return NextResponse.json(issue)
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
