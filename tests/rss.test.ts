import assert from 'node:assert/strict'
import test from 'node:test'
import { XMLParser } from 'fast-xml-parser'
import { readText } from './helpers/site-paths.ts'

function assertParsesAsDate(value: string): number {
	const ms = Date.parse(value)
	assert.ok(Number.isFinite(ms), `should parse as a date: ${value}`)
	return ms
}

function assertNoBareAmpersands(xml: string) {
	// `fast-xml-parser` is permissive with invalid entities, so enforce this
	// XML well-formedness rule explicitly for feed text/attribute nodes.
	const withoutCdata = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
	const bareAmpersand = /&(?!#\d+;|#x[0-9a-fA-F]+;|[A-Za-z][A-Za-z0-9._-]*;)/.exec(withoutCdata)
	assert.equal(
		bareAmpersand,
		null,
		'RSS XML contains an unescaped "&"; use "&amp;" in non-CDATA content',
	)
}

test('RSS feed is valid Atom with correct URLs', async () => {
	const xml = await readText('rss/index.xml')
	const siteUrl = 'https://kittygiraudel.com'
	assertNoBareAmpersands(xml)

	const parser = new XMLParser({ ignoreAttributes: false })
	const doc = parser.parse(xml) as {
		feed: {
			title: unknown
			subtitle: unknown
			id: unknown
			updated: string
			link: unknown
			entry: unknown
		}
	}

	// Top-level feed structure
	assert.ok(doc.feed, 'RSS feed should have a <feed> root element')
	assert.ok(doc.feed.title, 'RSS feed should contain <title>')
	assert.ok(doc.feed.subtitle, 'RSS feed should contain <subtitle>')
	assert.ok(doc.feed.id, 'RSS feed should contain <id>')
	assert.ok(doc.feed.updated, 'RSS feed should contain <updated>')

	const links = Array.isArray(doc.feed.link) ? doc.feed.link : [doc.feed.link]
	const linkByRel = new Map<string, { '@_rel'?: string; '@_href'?: string; '@_type'?: string }>()
	for (const link of links as { '@_rel'?: string; '@_href'?: string; '@_type'?: string }[]) {
		if (link['@_rel']) linkByRel.set(link['@_rel'], link)
	}

	const site = new URL(siteUrl)

	const selfLink = linkByRel.get('self')
	assert.ok(selfLink, 'RSS feed should have a self <link>')
	assert.equal(
		selfLink['@_href'],
		new URL('/rss/index.xml', site.origin).toString(),
		'self link href should match site RSS URL',
	)

	const altLink = linkByRel.get('alternate')
	assert.ok(altLink, 'RSS feed should have an alternate HTML <link>')
	assert.equal(altLink['@_href'], site.origin, 'alternate HTML link href should match site URL')

	const entries = Array.isArray(doc.feed.entry) ? doc.feed.entry : [doc.feed.entry]
	assert.ok(entries.length > 0, 'RSS feed should contain at least one <entry>')

	const entryUpdatedMs: number[] = []
	for (const entry of entries as {
		title: unknown
		id: unknown
		published: string
		updated: string
		summary: unknown
		content?: unknown
		link: unknown
	}[]) {
		// Basic data for each entry
		assert.ok(entry.title, 'entry should have a title')
		assert.ok(entry.id, `entry should have an id (${entry.title})`)
		assert.ok(entry.published, `entry should have a <published> date (${entry.title})`)
		assert.ok(entry.updated, `entry should have an <updated> date (${entry.title})`)
		assert.ok(entry.summary, `entry should have a summary (${entry.title})`)

		const publishedMs = assertParsesAsDate(entry.published)
		const updatedMs = assertParsesAsDate(entry.updated)
		assert.ok(
			updatedMs >= publishedMs,
			`entry <updated> should be >= <published> (same moment is ok) (${entry.title}, ${entry.published}, ${entry.updated})`,
		)
		entryUpdatedMs.push(updatedMs)

		const entryLinks = Array.isArray(entry.link) ? entry.link : [entry.link]
		assert.ok(entryLinks.length > 0, `entry should have at least one link (${entry.title})`)

		const primaryLink = entryLinks[0] as { '@_href': string; '@_rel'?: string; '@_type'?: string }
		const primaryHref = primaryLink['@_href']
		assert.equal(typeof primaryHref, 'string')
		const primaryUrl = new URL(primaryHref)
		assert.ok(primaryUrl.href.length > 0, 'primary entry link href should be a valid URL')

		const pathname = primaryUrl.pathname
		const looksLikeFile = /\.[^/]+$/.test(pathname)
		if (primaryUrl.origin === site.origin && !looksLikeFile) {
			assert.ok(
				pathname.endsWith('/'),
				`internal entry link path should use a trailing slash: ${pathname}`,
			)
		}

		const hasMarkdownAlternate = (entryLinks as { '@_rel'?: string; '@_type'?: string }[]).some(
			l => l['@_rel'] === 'alternate' && l['@_type'] === 'text/markdown',
		)

		const isInternal = primaryUrl.origin === site.origin

		if (isInternal) {
			// Non-external entries: have HTML content and alternate markdown link
			assert.ok(entry.content, 'internal entry should have <content>')
			assert.ok(hasMarkdownAlternate, 'internal entry should have an alternate markdown <link>')
		} else {
			// External entries: no HTML content and no alternate markdown link
			assert.ok(!entry.content, 'external entry should not have <content>')
			assert.ok(
				!hasMarkdownAlternate,
				'external entry should not have an alternate markdown <link>',
			)
		}
	}

	const feedUpdatedMs = assertParsesAsDate(doc.feed.updated)
	const maxEntryUpdatedMs = Math.max(...entryUpdatedMs)
	assert.ok(
		feedUpdatedMs >= maxEntryUpdatedMs - 2000,
		'feed <updated> should be at least the latest entry <updated> (small tolerance for formatting)',
	)
	assert.ok(
		feedUpdatedMs <= maxEntryUpdatedMs + 2000,
		'feed <updated> should match the latest entry <updated> (small tolerance for formatting)',
	)
})
