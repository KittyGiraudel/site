import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

export async function getSiteUrl() {
  const pkgRaw = await readFile(path.join(repoRoot, 'package.json'), 'utf8')
  const pkg = JSON.parse(pkgRaw)
  const homepage = typeof pkg.homepage === 'string' ? pkg.homepage : 'https://kittygiraudel.com'
  return homepage.replace(/\/+$/, '')
}

