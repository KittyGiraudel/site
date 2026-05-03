import assert from 'node:assert/strict'
import test from 'node:test'
import { type CheerioAPI, load } from 'cheerio'
import siteData from '../data/site.js'
import { readText } from './helpers/site-paths.ts'

const siteAuthor = siteData.author
const siteUrl = 'https://kittygiraudel.com'

type JsonLdShape = {
	article?: boolean
	softwareSourceCode?: boolean
	itemList?: boolean
}

function jsonLdScripts($: CheerioAPI) {
	return $('script[type="application/ld+json"]')
}

function joinedJsonLdText($: CheerioAPI): string {
	return jsonLdScripts($)
		.map((_, element) => $(element).text())
		.get()
		.join('\n')
}

function assertJsonLdShape($: CheerioAPI, shape: JsonLdShape): void {
	const scripts = jsonLdScripts($)
	assert.ok(scripts.length >= 2, 'should include structured data scripts')
	const content = joinedJsonLdText($)
	assert.match(content, /"@type":\s*"WebSite"/)
	assert.match(content, /"@type":\s*"Person"/)
	if (shape.article) {
		assert.match(content, /"@type":\s*"BlogPosting"/)
	}
	if (shape.softwareSourceCode) {
		assert.match(content, /"@type":\s*"SoftwareSourceCode"/)
	}
	if (shape.itemList) {
		assert.match(content, /"@type":\s*"ItemList"/)
	}
}

function findJsonLdByType($: CheerioAPI, type: string): Record<string, unknown> | null {
	for (const el of jsonLdScripts($).toArray()) {
		try {
			const data = JSON.parse($(el).text()) as Record<string, unknown>
			if (data['@type'] === type) {
				return data
			}
		} catch {
			// ignore
		}
	}
	return null
}

test('structured data: home', async () => {
	const html = await readText('index.html')
	const $ = load(html)
	assertJsonLdShape($, {})
})

test('structured data: resume', async () => {
	const html = await readText('resume/index.html')
	const $ = load(html)
	assertJsonLdShape($, {})
})

test('structured data: snippet', async () => {
	const html = await readText('snippets/get-last-npm-install/index.html')
	const $ = load(html)
	assertJsonLdShape($, {})
})

test('structured data: project (SoftwareSourceCode)', async () => {
	const html = await readText('projects/a11y-dialog/index.html')
	const $ = load(html)
	assertJsonLdShape($, { softwareSourceCode: true })

	const software = findJsonLdByType($, 'SoftwareSourceCode')
	assert.ok(software, 'project page should include SoftwareSourceCode JSON-LD')
	assert.equal(software.name, 'A11y-dialog')
	assert.equal(software.codeRepository, 'https://github.com/KittyGiraudel/a11y-dialog')
	assert.equal(software.url, 'https://a11y-dialog.netlify.app/')
	assert.equal(
		(software.mainEntityOfPage as Record<string, unknown>)['@id'],
		`${siteUrl}/projects/a11y-dialog/`,
	)
	assert.equal((software.author as Record<string, unknown>)['@type'], 'Person')
	assert.equal((software.author as Record<string, unknown>).name, siteAuthor)
	assert.ok(Array.isArray(software.keywords))
	assert.ok((software.keywords as string[]).includes('TypeScript'))
	assert.equal((software.mainEntityOfPage as Record<string, unknown>)['@type'], 'WebPage')
	assert.equal(
		(software.mainEntityOfPage as Record<string, unknown>)['@id'],
		`${siteUrl}/projects/a11y-dialog/`,
	)
})

test('structured data: projects index (ItemList)', async () => {
	const html = await readText('projects/index.html')
	const $ = load(html)
	assertJsonLdShape($, { itemList: true })

	const itemList = findJsonLdByType($, 'ItemList')
	assert.ok(itemList, 'projects index should include ItemList JSON-LD')
	assert.equal(itemList.name, 'Open-Source Projects')
	assert.ok((itemList.numberOfItems as number) >= 1)
	assert.ok(Array.isArray(itemList.itemListElement))
	assert.equal((itemList.itemListElement as unknown[]).length, itemList.numberOfItems as number)
	const first = (itemList.itemListElement as Record<string, unknown>[])[0]
	assert.equal(first['@type'], 'ListItem')
	assert.equal(first.position, 1)
	assert.equal((first.item as Record<string, unknown>)['@type'], 'WebPage')
	const firstItemId = (first.item as Record<string, unknown>)['@id']
	assert.ok(
		typeof firstItemId === 'string' && firstItemId.startsWith(siteUrl),
		'ListItem URL should be under the site origin',
	)
	assert.ok(
		typeof (first.item as Record<string, unknown>).name === 'string' &&
			((first.item as Record<string, unknown>).name as string).length > 0,
	)
})

test('structured data: regular post (BlogPosting)', async () => {
	const html = await readText('2026/03/02/stats-page-with-11ty/index.html')
	const $ = load(html)
	assertJsonLdShape($, { article: true })

	const blogPosting = findJsonLdByType($, 'BlogPosting')
	assert.ok(blogPosting, 'post page should include BlogPosting JSON-LD')
	assert.ok(blogPosting.datePublished, 'BlogPosting should include datePublished')
	if (blogPosting.dateModified) {
		assert.ok(
			Date.parse(blogPosting.dateModified as string) >=
				Date.parse(blogPosting.datePublished as string),
			'BlogPosting dateModified should be >= datePublished when present',
		)
	}
})

test('structured data: guest post', async () => {
	const html = await readText('2020/05/18/using-calc-to-figure-out-optimal-line-height/index.html')
	const $ = load(html)
	assertJsonLdShape($, { article: true })
})
