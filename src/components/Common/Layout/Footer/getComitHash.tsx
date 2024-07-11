// getCommitHash.js
'use server'
import { execSync } from 'child_process'

export async function getCommitHash() {
  const commitHash = execSync('git rev-parse HEAD').toString().trim()
  return commitHash
}
