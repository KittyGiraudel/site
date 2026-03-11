import assert from 'node:assert/strict'
import test from 'node:test'
import { readJson } from './helpers/site-paths.mjs'

test('search data JSON has expected shape', async () => {
  const data = await readJson('blog/search/data.json')

  assert.ok(Array.isArray(data), 'search data should be an array')
  assert.ok(data.length > 0, 'search data should not be empty')

  for (const entry of data) {
    assert.equal(typeof entry.title, 'string')
    assert.ok(entry.title.length > 0)

    assert.equal(typeof entry.lang, 'string')
    assert.ok(entry.lang.length > 0)

    assert.ok(Array.isArray(entry.tags), 'tags should be an array')

    assert.equal(typeof entry.url, 'string')
    assert.ok(entry.url.length > 0, 'url should not be empty')
    assert.ok(
      entry.url.startsWith('http') || entry.url.startsWith('/'),
      `url should be absolute or root-relative: ${entry.url}`,
    )

    if (entry.url.startsWith('/')) {
      const looksLikeFile = /\.[^/]+$/.test(entry.url)
      if (!looksLikeFile) {
        assert.ok(
          entry.url.endsWith('/'),
          `internal search URL should use a trailing slash: ${entry.url}`,
        )
      }
    }

    assert.equal(typeof entry.date, 'string')
    assert.ok(entry.date.length > 0)

    assert.equal(typeof entry.guest, 'string')
    assert.equal(typeof entry.external, 'string')
  }
})
