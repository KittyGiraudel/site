import assert from 'node:assert/strict'
import test from 'node:test'
import { type CheerioAPI, load } from 'cheerio'
import siteData from '../data/site.js'
import { readText } from './helpers/site-paths.ts'

const siteAuthor = siteData.author
const siteUrl = 'https://kittygiraudel.com'

type OgType = 'article' | 'website'

type HeadSpec = {
	path: string
	title: string
	description: string
	author: string
	ogType: OgType
	ogImage?: string
	keywords?: string | null
	documentTitle?: string
	markdownAlternate?: boolean
}

function metaName($: CheerioAPI, name: string): string | undefined {
	return $(`head meta[name="${name}"]`).attr('content')
}

function metaProperty($: CheerioAPI, property: string): string | undefined {
	return $(`meta[property="${property}"]`).attr('content')
}

function assertCanonicalLink($: CheerioAPI, siteUrl: string, path: string, label = ''): string {
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
	assert.ok(
		canonicalHref && /^https?:\/\//.test(canonicalHref),
		`${prefix}canonical href should be absolute`,
	)
	assert.equal(canonicalHref, expected)
	return expected
}

function assertHeadMetadata($: CheerioAPI, siteUrl: string, spec: HeadSpec): void {
	const documentTitle = spec.documentTitle ?? `${spec.title} | ${siteAuthor}`
	const canonical = assertCanonicalLink($, siteUrl, spec.path)
	const expectedSocialImage = spec.ogImage
		? new URL(spec.ogImage, siteData.url).toString()
		: new URL('/assets/images/og-default.png', siteData.url).toString()

	assert.ok($('head').length, 'document should have a <head>')
	assert.equal($('head meta[charset]').attr('charset'), 'utf-8')

	const viewport = metaName($, 'viewport')
	assert.ok(viewport, 'head should include a viewport meta')
	assert.match(viewport, /width=device-width/)
	assert.match(viewport, /initial-scale=1/)
	assert.equal(metaName($, 'theme-color'), '#dd7eb4')

	const shortcutIcon = $('head link[rel="icon"]')
	assert.equal(shortcutIcon.length, 2, 'head should have two icons (ico + png)')
	assert.equal(shortcutIcon.first().attr('href'), '/favicon.ico')
	assert.equal(shortcutIcon.last().attr('href'), '/assets/images/favicon-192.png')

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
	assert.equal(metaProperty($, 'og:image'), expectedSocialImage)
	if (spec.ogImage) {
		assert.equal(metaProperty($, 'og:image:width'), undefined)
		assert.equal(metaProperty($, 'og:image:height'), undefined)
	} else {
		assert.equal(metaProperty($, 'og:image:width'), '1200')
		assert.equal(metaProperty($, 'og:image:height'), '630')
	}
	assert.equal(metaProperty($, 'og:image:alt'), undefined)
	if (spec.ogType === 'article') {
		assert.ok(metaProperty($, 'article:published_time'))
		assert.equal(metaProperty($, 'article:author'), spec.author)
	} else {
		assert.equal(metaProperty($, 'article:published_time'), undefined)
		assert.equal(metaProperty($, 'article:author'), undefined)
	}

	// Twitter Graph
	assert.equal(metaName($, 'twitter:card'), 'summary_large_image')
	assert.equal(metaName($, 'twitter:creator'), '@KittyGiraudel')
	assert.equal(metaName($, 'twitter:description'), spec.description)
	assert.equal(metaName($, 'twitter:domain'), 'kittygiraudel.com')
	assert.equal(metaName($, 'twitter:image'), expectedSocialImage)
	assert.equal(metaName($, 'twitter:site'), '@KittyGiraudel')
	assert.equal(metaName($, 'twitter:title'), spec.title)

	// RSS
	const rss = $('head link[rel="alternate"][type="application/rss+xml"]')
	assert.ok(rss.length, 'head should link to the RSS feed')
	const rssHref = rss.attr('href')
	const expectedRss = new URL('/rss/index.xml', siteData.url).toString()
	assert.ok(
		rssHref && /^https?:\/\//.test(rssHref),
		'RSS alternate href in <head> should be absolute',
	)
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
	/** Golden: pages/home.liquid */
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
	/** Golden: pages/resume-el.liquid */
	const html = await readText('resume/index.html')
	const $ = load(html)

	assertHeadMetadata($, siteUrl, {
		path: '/resume/',
		title: 'Kitty Giraudel',
		description: 'Engineering and executive leadership resume of Kitty Giraudel.',
		author: siteAuthor,
		ogType: 'website',
		keywords: 'resume,cv,linkedin,engineering,leadership',
		markdownAlternate: false,
	})
})

test('page head: snippet', async () => {
	/** Golden: pages/snippets/get-last-npm-install.md */
	const html = await readText('snippets/get-last-npm-install/index.html')
	const $ = load(html)

	assertHeadMetadata($, siteUrl, {
		path: '/snippets/get-last-npm-install/',
		title: 'Figuring out when modules were last installed',
		description: 'Retrieving the last time npm dependencies were installed',
		author: siteAuthor,
		ogType: 'website',
		keywords: 'npm,Dependencies,Node.js,Debug',
		markdownAlternate: false,
	})
})

test('page head: project', async () => {
	/** Golden: pages/projects/a11y-dialog.liquid */
	const html = await readText('projects/a11y-dialog/index.html')
	const $ = load(html)

	assertHeadMetadata($, siteUrl, {
		path: '/projects/a11y-dialog/',
		title: 'A11y-dialog',
		description:
			'A lightweight script to make modal dialogs accessible to assistive technology users.',
		author: siteAuthor,
		ogType: 'website',
		ogImage: '/assets/images/projects/a11y-dialog.png',
		keywords: 'Accessibility,HTML,Dialog,TypeScript',
		markdownAlternate: false,
	})
})

test('page head: projects index (ItemList)', async () => {
	/** Golden: pages/projects.liquid */
	const html = await readText('projects/index.html')
	const $ = load(html)

	assertHeadMetadata($, siteUrl, {
		path: '/projects/',
		title: 'Side Projects',
		description:
			'A list of all of Kitty Giraudel’s noteworthy open-sourced projects, all hosted on GitHub.',
		author: siteAuthor,
		ogType: 'website',
		keywords: 'projects,open-source,github',
		markdownAlternate: false,
	})
})

test('page head: regular post', async () => {
	/** Golden: _posts/2026-03-02-stats-page-with-11ty.md */
	const html = await readText('2026/03/02/stats-page-with-11ty/index.html')
	const $ = load(html)

	assertHeadMetadata($, siteUrl, {
		path: '/2026/03/02/stats-page-with-11ty/',
		title: 'Stats Page With Eleventy',
		description:
			'A short technical write-up about aggregating blogging stats and displaying them on a page with Eleventy.',
		author: siteAuthor,
		ogType: 'article',
		keywords: 'Eleventy,JavaScript,Liquid',
		markdownAlternate: true,
	})

	const publishedTime = metaProperty($, 'article:published_time')
	const modifiedTime = metaProperty($, 'article:modified_time')
	assert.ok(publishedTime, 'article posts should expose article:published_time')
	if (modifiedTime) {
		assert.ok(
			Date.parse(modifiedTime) >= Date.parse(publishedTime),
			'article:modified_time should be >= article:published_time when present',
		)
	}
})

test('page head: guest post (guest meta author)', async () => {
	/** Golden: _posts/2020-05-18-using-calc-to-figure-out-optimal-line-height.md */
	const html = await readText('2020/05/18/using-calc-to-figure-out-optimal-line-height/index.html')
	const $ = load(html)

	assertHeadMetadata($, siteUrl, {
		path: '/2020/05/18/using-calc-to-figure-out-optimal-line-height/',
		title: 'Using Calc to Figure Out Optimal Line-Height',
		description: 'A guest post by Jesús Ricarte on using calc() to figure out optimal line-height',
		author: 'Jesús Ricarte',
		ogType: 'article',
		ogImage: '/assets/images/using-calc-to-figure-out-optimal-line-height/line-height.png',
		keywords: 'CSS,Typography',
		markdownAlternate: true,
	})
})
