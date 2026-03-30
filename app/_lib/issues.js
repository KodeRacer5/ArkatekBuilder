import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_PATH = join(process.cwd(), 'data', 'issues.json')

export function getIssues() {
  try {
    return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    return []
  }
}

export function saveIssues(issues) {
  writeFileSync(DATA_PATH, JSON.stringify(issues, null, 2))
}
