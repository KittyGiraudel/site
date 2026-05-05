import assert from 'node:assert/strict'
import test from 'node:test'
import { readJson } from './helpers/site-paths.ts'

type SearchEntry = {
	title: string
	lang: string
	tags: unknown[]
	url: string
	date: string
	guest: string | null
	external: string | null
}

test('search data JSON has expected shape', async () => {
	const raw = await readJson('blog/search/data.json')
	assert.ok(Array.isArray(raw), 'search data should be an array')
	const data = raw as SearchEntry[]
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

		assert.ok(entry.guest === null || typeof entry.guest === 'string')
		assert.ok(entry.external === null || typeof entry.external === 'string')
	}
})
