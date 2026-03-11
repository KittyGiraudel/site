import assert from 'node:assert/strict'
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { siteDir } from './helpers/site-paths.mjs'

async function expectFile(relativePath) {
  const full = path.join(siteDir, relativePath)
  const s = await stat(full)
  assert.ok(s.isFile(), `${relativePath} should exist as a file`)
}

async function expectDirectoryWithFiles(relativePath) {
  const full = path.join(siteDir, relativePath)
  const s = await stat(full)
  assert.ok(s.isDirectory(), `${relativePath} should exist as a directory`)
  const files = await readdir(full)
  assert.ok(files.length > 0, `${relativePath} should not be empty`)
}

test('core assets exist in built site', async () => {
  await Promise.all([
    // Text files
    expectFile('robots.txt'),
    expectFile('humans.txt'),
    // Images
    expectFile('apple-touch-icon.png'),
    expectFile('favicon.ico'),
    // JSON files
    expectFile('blog/search/data.json'),
    expectFile('manifest.json'),
    // XML directories
    expectFile('sitemap.xml'),
    expectFile('rss/index.xml'),
    // Netlify configuration
    expectFile('_headers'),
    expectFile('_redirects'),
    expectFile('404.html'),
  ])

  await Promise.all([
    expectDirectoryWithFiles('assets'),
    expectDirectoryWithFiles('assets/css'),
    expectDirectoryWithFiles('assets/js'),
    expectDirectoryWithFiles('assets/images'),
  ])
})
