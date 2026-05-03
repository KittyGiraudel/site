import assert from 'node:assert/strict'
import test from 'node:test'
import { XMLParser } from 'fast-xml-parser'
import { readText } from './helpers/site-paths.mjs'

/** @param {string} value */
function assertParsesAsDate(value) {
	const ms = Date.parse(value)
	assert.ok(Number.isFinite(ms), `lastmod should parse as a date: ${value}`)
	return ms
}

test('sitemap.xml is valid and contains absolute URLs', async () => {
	const xml = await readText('sitemap.xml')
	const siteUrl = 'https://kittygiraudel.com'

	const parser = new XMLParser({ ignoreAttributes: false })
	const doc = parser.parse(xml)

	assert.ok(doc.urlset, 'sitemap should have a <urlset> root element')

	const urls = Array.isArray(doc.urlset.url) ? doc.urlset.url : [doc.urlset.url]
	assert.ok(urls.length > 0, 'sitemap should contain at least one <url> entry')

	const site = new URL(siteUrl)

	const locs = urls.map(entry => entry.loc).filter(Boolean)
	assert.ok(locs.length === urls.length, 'every <url> should have a <loc>')

	for (const loc of locs) {
		assert.equal(typeof loc, 'string')
		assert.ok(!loc.endsWith('.'), `sitemap URL should not end with a dot: ${loc}`)

		const url = new URL(loc)
		const pathname = url.pathname

		assert.equal(url.origin, site.origin, 'sitemap URL should use the correct site domain')

		if (pathname !== '/blog/search/data.json') {
			assert.ok(pathname.endsWith('/'), `sitemap URL path should use a trailing slash: ${pathname}`)
		}
	}

	const expectedPaths = [
		'/',
		'/blog/',
		'/projects/',
		'/snippets/',
		'/talks/',
		'/stats/',
		'/resume/',
		'/about/',
		'/accessibility-statement/',
	]
	for (const path of expectedPaths) {
		const expected = new URL(path, site.origin).toString()
		assert.ok(locs.includes(expected), `sitemap should include ${expected}`)
	}

	const forbiddenPaths = [
		'/blog-markdown/',
		'/README.md',
		'/404.html',
		'/tags/internal-posts/',
		'/tags/projects/',
	]
	for (const path of forbiddenPaths) {
		const forbidden = new URL(path, site.origin).toString()
		assert.ok(!locs.includes(forbidden), `sitemap should not include ${forbidden}`)
	}

	const tagLocs = locs.filter(loc => new URL(loc).pathname.startsWith('/tags/'))
	assert.ok(tagLocs.length > 1, 'sitemap should include multiple tag pages')
	assert.ok(
		tagLocs.includes(new URL('/tags/ai/', site.origin).toString()),
		'sitemap should include /tags/ai/',
	)
	assert.ok(
		tagLocs.includes(new URL('/tags/eleventy/', site.origin).toString()),
		'sitemap should include /tags/eleventy/',
	)

	const withLastmod = urls.filter(entry => Boolean(entry.lastmod))
	assert.ok(
		withLastmod.length / urls.length >= 0.85,
		'most sitemap URLs should include <lastmod> (creation or update date)',
	)
	for (const entry of withLastmod) {
		assertParsesAsDate(entry.lastmod)
	}

	const statsPostUrl = new URL('/2026/03/02/stats-page-with-11ty/', site.origin).toString()
	const statsEntry = urls.find(u => u.loc === statsPostUrl)
	assert.ok(statsEntry, 'sitemap should include the stats Eleventy post')
	assert.ok(statsEntry.lastmod, 'golden post should have <lastmod>')
	assertParsesAsDate(statsEntry.lastmod)
})
