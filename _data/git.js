import { execSync } from 'node:child_process'

// Build a file path to `Date` map from one `git log` call
// See: https://meiert.com/blog/eleventy-git-last-modified/
export default function () {
  const dates = {}
  try {
    // `--name-only` doesn’t capture renames (accepted limitation)
    const log = execSync('git log --format="DATE:%ci" --name-only -- _posts/*.md', {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
    })
    let currentDate = null
    for (const line of log.split('\n')) {
      if (line.startsWith('DATE:')) {
        currentDate = new Date(line.slice(5).trim())
      } else if (line.trim() && currentDate) {
        // Commits are newest-first;
        // first occurrence of a path = its last modification
        if (!dates[line.trim()]) {
          dates[line.trim()] = currentDate
        }
      }
    }
  } catch {
    // Git unavailable or not a repo
  }
  return dates
}
