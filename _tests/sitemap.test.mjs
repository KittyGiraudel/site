import assert from 'node:assert/strict'
import test from 'node:test'
import { XMLParser } from 'fast-xml-parser'
import { getSiteUrl, readText } from './helpers/site-paths.mjs'

test('sitemap.xml is valid and contains absolute URLs', async () => {
  const [xml, siteUrl] = await Promise.all([readText('sitemap.xml'), getSiteUrl()])

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

    const url = new URL(loc)
    const pathname = url.pathname

    assert.equal(url.origin, site.origin, 'sitemap URL should use the correct site domain')

    if (pathname !== '/blog/search/data.json') {
      assert.ok(
        pathname.endsWith('/'),
        `sitemap URL path should use a trailing slash: ${pathname}`,
      )
    }
  }

  const expectedPaths = ['/', '/blog/', '/projects/', '/snippets/', '/talks/', '/stats/', '/resume/', '/about/', '/accessibility-statement/']
  for (const path of expectedPaths) {
    const expected = new URL(path, site.origin).toString()
    assert.ok(
      locs.includes(expected),
      `sitemap should include ${expected}`,
    )
  }

  const forbiddenPaths = ['/blog/index-markdown/', '/README.md', '/404.html']
  for (const path of forbiddenPaths) {
    const forbidden = new URL(path, site.origin).toString()
    assert.ok(
      !locs.includes(forbidden),
      `sitemap should not include ${forbidden}`,
    )
  }
})
