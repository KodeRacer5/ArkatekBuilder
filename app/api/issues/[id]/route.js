import { NextResponse } from 'next/server'
import { getIssues, saveIssues } from '@/app/_lib/issues'

export async function PUT(request, { params }) {
  const { id } = params
  const body = await request.json()
  const issues = getIssues()
  const idx = issues.findIndex(i => i.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  issues[idx] = { ...issues[idx], ...body, updatedAt: new Date().toISOString() }
  saveIssues(issues)
  return NextResponse.json(issues[idx])
}

export async function DELETE(request, { params }) {
  const { id } = params
  const issues = getIssues()
  const issue = issues.find(i => i.id === id)
  if (!issue) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const { rmSync } = await import('fs')
    const { join } = await import('path')
    rmSync(join(process.cwd(), 'public', 'issues', id), { recursive: true, force: true })
  } catch {}
  const updated = issues.filter(i => i.id !== id)
  saveIssues(updated)
  return NextResponse.json({ success: true })
}
