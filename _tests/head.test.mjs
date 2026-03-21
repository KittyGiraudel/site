import assert from 'node:assert/strict'
import test from 'node:test'
import { load } from 'cheerio'
import siteData from '../_data/site.js'
import { getSiteUrl, readText } from './helpers/site-paths.mjs'

const siteAuthor = siteData.author
const siteUrl = getSiteUrl()

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {string} name
 */
function metaName($, name) {
  return $(`head meta[name="${name}"]`).attr('content')
}

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {string} property
 */
function metaProperty($, property) {
  return $(`head meta[property="${property}"]`).attr('content')
}

/**
 * @param {string} [label] built output path (for assertion messages)
 * @returns {string} resolved canonical URL (for og:url etc.)
 */
function assertCanonicalLink($, siteUrl, path, label = '') {
  const origin = new URL(siteUrl)
  const expected = new URL(path, origin.origin).toString()
  const prefix = label ? `${label}: ` : ''
  const canonicalLinks = $('head link[rel="canonical"]')
  assert.equal(
    canonicalLinks.length,
    1,
    `${prefix}should have exactly one <link rel="canonical"> in <head>`,
  )
  const canonicalHref = canonicalLinks.attr('href')
  assert.ok(/^https?:\/\//.test(canonicalHref), `${prefix}canonical href should be absolute`)
  assert.equal(canonicalHref, expected)
  return expected
}

/**
 * Asserts global `<head>` elements from `head.liquid`, page metadata, plus
 * optional checks outside `<head>` (e.g. post layout markdown `alternate`).
 *
 * @param {import('cheerio').CheerioAPI} $
 * @param {string} siteUrl homepage URL without trailing slash (`_data/site.js`)
 * @param {{
 *   path: string
 *   title: string
 *   description: string
 *   author: string
 *   ogType: 'article' | 'website'
 *   keywords?: string | null
 *   documentTitle?: string
 *   markdownAlternate?: boolean
 * }} spec
 */
function assertHeadMetadata($, siteUrl, spec) {
  const documentTitle = spec.documentTitle ?? `${spec.title} | ${siteAuthor}`
  const canonical = assertCanonicalLink($, siteUrl, spec.path)

  assert.ok($('head').length, 'document should have a <head>')
  assert.equal($('head meta[charset]').attr('charset'), 'utf-8')

  const viewport = metaName($, 'viewport')
  assert.ok(viewport, 'head should include a viewport meta')
  assert.match(viewport, /width=device-width/)
  assert.match(viewport, /initial-scale=1/)
  assert.equal(metaName($, 'theme-color'), '#dd7eb4')

  const shortcutIcon = $('head link[rel="shortcut icon"]')
  assert.equal(shortcutIcon.length, 1, 'head should have exactly one shortcut icon')
  assert.equal(shortcutIcon.attr('href'), '/assets/images/favicon.jpg')

  const appleTouch = $('head link[rel="apple-touch-icon"]')
  assert.equal(appleTouch.length, 1, 'head should have exactly one apple-touch-icon')
  assert.equal(appleTouch.attr('href'), '/apple-touch-icon.png')

  const manifest = $('head link[rel="manifest"]')
  assert.equal(manifest.length, 1, 'head should have exactly one web manifest link')
  assert.equal(manifest.attr('href'), '/manifest.json')
  assert.equal($('head title').text(), documentTitle)
  assert.equal(metaName($, 'description'), spec.description)
  assert.equal(metaName($, 'author'), spec.author)
  assert.equal(metaName($, 'robots'), 'index,follow')
  assert.ok(
    metaName($, 'generator')?.includes('Eleventy'),
    'generator meta should mention Eleventy',
  )

  // Keywords
  if (spec.keywords === null) {
    assert.equal(
      $('head meta[name="keywords"]').length,
      0,
      'should not emit meta keywords when there are no tags/keywords',
    )
  } else if (spec.keywords !== undefined) {
    assert.equal(metaName($, 'keywords'), spec.keywords)
  }

  // Open Graph
  assert.equal(metaProperty($, 'og:title'), spec.title)
  assert.equal(metaProperty($, 'og:type'), spec.ogType)
  assert.equal(metaProperty($, 'og:url'), canonical)
  assert.equal(metaProperty($, 'og:description'), spec.description)
  assert.equal(metaProperty($, 'og:site_name'), 'kittygiraudel.com')

  // Twitter Graph
  const expectedTwitterImage = new URL('/assets/images/favicon-192.jpg', siteData.url).toString()
  assert.equal(metaName($, 'twitter:card'), 'summary')
  assert.equal(metaName($, 'twitter:creator'), '@KittyGiraudel')
  assert.equal(metaName($, 'twitter:description'), spec.description)
  assert.equal(metaName($, 'twitter:domain'), 'kittygiraudel.com')
  assert.equal(metaName($, 'twitter:image'), expectedTwitterImage)
  assert.equal(metaName($, 'twitter:site'), '@KittyGiraudel')
  assert.equal(metaName($, 'twitter:title'), spec.title)

  // RSS
  const rss = $('head link[rel="alternate"][type="application/rss+xml"]')
  assert.ok(rss.length, 'head should link to the RSS feed')
  const rssHref = rss.attr('href')
  const expectedRss = new URL('/rss/index.xml', siteData.url).toString()
  assert.ok(/^https?:\/\//.test(rssHref), 'RSS alternate href in <head> should be absolute')
  assert.equal(rssHref, expectedRss, 'RSS alternate href should match site URL + /rss/index.xml')

  // Markdown Alternate
  if (spec.markdownAlternate === true) {
    const basePath = spec.path.endsWith('/') ? spec.path : `${spec.path}/`
    const expectedHref = `${basePath}index.md`
    const md = $('link[rel="alternate"][type="text/markdown"]')
    assert.equal(md.length, 1, 'post page should expose exactly one markdown alternate link')
    assert.equal(md.attr('href'), expectedHref)
  } else if (spec.markdownAlternate === false) {
    assert.equal(
      $('link[rel="alternate"][type="text/markdown"]').length,
      0,
      'page should not expose a markdown alternate',
    )
  }
}

test('page head: home', async () => {
  /** Golden: _pages/home/index.liquid */
  const html = await readText('index.html')
  const $ = load(html)

  assertHeadMetadata($, siteUrl, {
    path: '/',
    title: 'Kitty says hi.',
    description:
      'Transfeminine web engineer and engineering leader based in Berlin, focused on accessibility, diversity and inclusion.',
    author: siteAuthor,
    ogType: 'website',
    keywords: 'author,speaker,developer,accessibility,diversity,trans',
    markdownAlternate: false,
  })
})

test('page head: resume', async () => {
  /** Golden: _pages/resume/index.liquid */
  const html = await readText('resume/index.html')
  const $ = load(html)

  assertHeadMetadata($, siteUrl, {
    path: '/resume/',
    title: 'Kitty Giraudel',
    description: 'Resume and work history of Kitty Giraudel, engineering and executive leadership.',
    author: siteAuthor,
    ogType: 'website',
    keywords: 'resume,cv,linkedin',
    markdownAlternate: false,
  })
})

test('page head: snippet', async () => {
  /** Golden: _pages/snippets/get-last-npm-install.md */
  const html = await readText('snippets/get-last-npm-install/index.html')
  const $ = load(html)

  assertHeadMetadata($, siteUrl, {
    path: '/snippets/get-last-npm-install/',
    title: 'getLastNpmInstall()',
    description: 'Retrieving the last time npm dependencies were installed',
    author: siteAuthor,
    ogType: 'website',
    keywords: 'npm,Dependencies,Node.js,Debug',
    markdownAlternate: false,
  })
})

test('page head: project', async () => {
  /** Golden: _pages/projects/a11y-dialog/index.liquid */
  const html = await readText('projects/a11y-dialog/index.html')
  const $ = load(html)

  assertHeadMetadata($, siteUrl, {
    path: '/projects/a11y-dialog/',
    title: 'A11y-dialog',
    description: siteData.description,
    author: siteAuthor,
    ogType: 'website',
    keywords: null,
    markdownAlternate: false,
  })
})

test('page head: regular post', async () => {
  /** Golden: _posts/2026-03-02-stats-page-with-11ty.md */
  const html = await readText('2026/03/02/stats-page-with-11ty/index.html')
  const $ = load(html)

  assertHeadMetadata($, siteUrl, {
    path: '/2026/03/02/stats-page-with-11ty/',
    title: 'Stats Page with Eleventy',
    description:
      'A short technical write-up about aggregating blogging stats and displaying them on a page with Eleventy.',
    author: siteAuthor,
    ogType: 'article',
    keywords: 'Eleventy,JavaScript,Liquid',
    markdownAlternate: true,
  })
})

test('page head: guest post (guest meta author)', async () => {
  /** Golden: _posts/2020-05-18-using-calc-to-figure-out-optimal-line-height.md */
  const html = await readText('2020/05/18/using-calc-to-figure-out-optimal-line-height/index.html')
  const $ = load(html)

  assertHeadMetadata($, siteUrl, {
    path: '/2020/05/18/using-calc-to-figure-out-optimal-line-height/',
    title: 'Using calc to figure out optimal line-height',
    description: 'A guest post by Jesús Ricarte on using calc() to figure out optimal line-height',
    author: 'Jesús Ricarte',
    ogType: 'article',
    keywords: 'CSS,Typography',
    markdownAlternate: true,
  })
})
