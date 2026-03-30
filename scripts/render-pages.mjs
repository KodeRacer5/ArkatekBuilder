import { execSync } from 'child_process'
import { writeFileSync, readFileSync, readdirSync, copyFileSync, mkdirSync, unlinkSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

const issueId = process.argv[2]
const projectRoot = '/opt/Peptide_Journal'
const DATA_PATH = join(projectRoot, 'data', 'issues.json')
const issueDir = join(projectRoot, 'public', 'issues', issueId)
const pagesDir = join(issueDir, 'pages')

mkdirSync(pagesDir, { recursive: true })

function getIssues() {
  try { return JSON.parse(readFileSync(DATA_PATH, 'utf8')) } catch { return [] }
}

function saveIssues(issues) {
  writeFileSync(DATA_PATH, JSON.stringify(issues, null, 2))
}

async function run() {
  const pdfPath = join(issueDir, 'document.pdf')
  
  // Use Ghostscript to render PDF pages to PNG at 200 DPI
  console.log('Rendering PDF with Ghostscript...')
  execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r200 -sOutputFile="${pagesDir}/page-%d.png" "${pdfPath}"`, {
    stdio: 'inherit'
  })
  
  // Convert PNG files to WebP using sharp
  const pngFiles = readdirSync(pagesDir).filter(f => f.endsWith('.png')).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0])
    const numB = parseInt(b.match(/\d+/)[0])
    return numA - numB
  })
  
  console.log(`Converting ${pngFiles.length} pages to WebP...`)
  
  for (let i = 0; i < pngFiles.length; i++) {
    const pngPath = join(pagesDir, pngFiles[i])
    const webpPath = join(pagesDir, `${i + 1}.webp`)
    
    await sharp(pngPath)
      .webp({ quality: 90 })
      .toFile(webpPath)
    
    // Remove the PNG file
    unlinkSync(pngPath)
    console.log(`Converted page ${i + 1}/${pngFiles.length}`)
  }
  
  const totalPages = pngFiles.length
  
  // Copy first page as cover
  copyFileSync(join(pagesDir, '1.webp'), join(issueDir, 'cover.webp'))
  
  // Update issues.json
  const issues = getIssues()
  const idx = issues.findIndex(i => i.id === issueId)
  if (idx !== -1) {
    issues[idx].coverPath = `/issues/${issueId}/cover.webp`
    issues[idx].pagesPath = `/issues/${issueId}/pages`
    issues[idx].totalPages = totalPages
    issues[idx].status = 'published'
    saveIssues(issues)
  }
  
  console.log(`Done — ${totalPages} pages rendered`)
}

run().catch(err => {
  console.error('Render failed:', err)
  process.exit(1)
})
