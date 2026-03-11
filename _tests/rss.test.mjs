import assert from 'node:assert/strict'
import test from 'node:test'
import { XMLParser } from 'fast-xml-parser'
import { getSiteUrl, readText } from './helpers/site-paths.mjs'

test('RSS feed is valid Atom with correct URLs', async () => {
  const [xml, siteUrl] = await Promise.all([readText('rss/index.xml'), getSiteUrl()])

  const parser = new XMLParser({ ignoreAttributes: false })
  const doc = parser.parse(xml)

  // Top-level feed structure
  assert.ok(doc.feed, 'RSS feed should have a <feed> root element')
  assert.ok(doc.feed.title, 'RSS feed should contain <title>')
  assert.ok(doc.feed.subtitle, 'RSS feed should contain <subtitle>')
  assert.ok(doc.feed.id, 'RSS feed should contain <id>')
  assert.ok(doc.feed.updated, 'RSS feed should contain <updated>')

  const links = Array.isArray(doc.feed.link) ? doc.feed.link : [doc.feed.link]
  const linkByRel = new Map()
  for (const link of links) {
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
  assert.equal(
    altLink['@_href'],
    site.origin,
    'alternate HTML link href should match site URL',
  )

  const entries = Array.isArray(doc.feed.entry) ? doc.feed.entry : [doc.feed.entry]
  assert.ok(entries.length > 0, 'RSS feed should contain at least one <entry>')

  for (const entry of entries) {
    // Basic data for each entry
    assert.ok(entry.title, 'entry should have a title')
    assert.ok(entry.id, 'entry should have an id')
    assert.ok(entry.published, 'entry should have a published date')
    assert.ok(entry.summary, 'entry should have a summary')

    const entryLinks = Array.isArray(entry.link) ? entry.link : [entry.link]
    assert.ok(entryLinks.length > 0, 'entry should have at least one link')

    const primaryLink = entryLinks[0]
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

    const hasMarkdownAlternate = entryLinks.some(
      l => l['@_rel'] === 'alternate' && l['@_type'] === 'text/markdown',
    )

    const isInternal = primaryUrl.origin === site.origin

    if (isInternal) {
      // Non-external entries: have HTML content and alternate markdown link
      assert.ok(entry.content, 'internal entry should have <content>')
      assert.ok(
        hasMarkdownAlternate,
        'internal entry should have an alternate markdown <link>',
      )
    } else {
      // External entries: no HTML content and no alternate markdown link
      assert.ok(!entry.content, 'external entry should not have <content>')
      assert.ok(
        !hasMarkdownAlternate,
        'external entry should not have an alternate markdown <link>',
      )
    }
  }
}
)
