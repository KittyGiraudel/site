import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import siteData from '../../_data/site.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')
const siteDir = path.join(repoRoot, '_site')

export { siteDir }

export async function readText(relativePath) {
  const fullPath = path.join(siteDir, relativePath)
  return readFile(fullPath, 'utf8')
}

export async function readJson(relativePath) {
  const text = await readText(relativePath)
  return JSON.parse(text)
}

/** Canonical site origin (matches `_data/site.js` `url`, no trailing slash). */
export function getSiteUrl() {
  return siteData.url.replace(/\/+$/, '')
}
