import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

const MIME_TYPES = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
}

export async function GET(request, { params }) {
  try {
    const pathParts = params.path
    const filePath = join(process.cwd(), 'public', 'issues', ...pathParts)
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    const ext = '.' + pathParts[pathParts.length - 1].split('.').pop()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    
    const fileBuffer = readFileSync(filePath)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
