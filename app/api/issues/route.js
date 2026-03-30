import { NextResponse } from 'next/server'
import { getIssues } from '@/app/_lib/issues'

export async function GET() {
  const issues = getIssues()
  return NextResponse.json(issues)
}
