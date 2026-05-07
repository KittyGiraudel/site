import { readFileSync } from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio'
import emojiRegex from 'emoji-regex'
import emojiShortName from 'emoji-short-name'
import he from 'he'
import htmlmin from 'html-minifier-terser'
import markdownIt from 'markdown-it'
import type { MaybePost, MaybeProject, PostFrontMatter, ProjectFrontMatter } from './eleventy.ts'
import { isFeatureEnabled } from './features.ts'

const EMOJI_REGEX = emojiRegex()
const DATE_FORMATTER = new Intl.DateTimeFormat('en', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
})

function minifyHTML(content: string, outputPath?: string): string | Promise<string> {
	return typeof outputPath === 'string' && outputPath.endsWith('.html')
		? htmlmin.minify(content, {
				collapseBooleanAttributes: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				decodeEntities: true,
				minifyCSS: true,
				minifyJS: true,
				minifyURLs: true,
				noNewlinesBeforeTagClose: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeOptionalTags: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				sortAttributes: true,
				sortClassName: true,
				useShortDoctype: true,
			})
		: content
}

function replaceEmoji(match: string): string {
	const label = emojiShortName[match]?.replace(/"/g, '')
	return label ? `<span role="img" aria-label="${label}" title="${label}">${match}</span>` : match
}

function a11yEmojis(content: string, outputPath?: string): string {
	return typeof outputPath === 'string' && outputPath.endsWith('.html')
		? content.replace(EMOJI_REGEX, replaceEmoji)
		: content
}

function formatNumber(amount: number): string {
	return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

function where<T extends Record<string, unknown>>(
	array: Array<T | { data?: T }>,
	key: keyof T | string,
	value?: unknown,
): Array<T | { data?: T }> {
	return array.filter(item => {
		const data: Record<string, unknown> = (item?.data ?? item) as Record<string, unknown>
		const normalizedKey = String(key)
		return typeof value === 'undefined' ? normalizedKey in data : data[normalizedKey] === value
	})
}

function dateToRFC3339(value: Date | string | number): string {
	return new Date(value).toISOString().replace(/\.\d+Z$/, 'Z')
}

function callout(content: string, type = 'info', role = 'note'): string {
	const html = markdownIt({ html: true, typographer: true }).render(content)
	if (role === 'note') return `<aside class="Callout Callout--${type}" role="note">${html}</aside>`
	return `<div class="Callout Callout--${type}">${html}</div>`
}

function time(value: Date | string | number, itemprop?: string, id?: string): string {
	const display = DATE_FORMATTER.format(new Date(value))
	const datetime = new Date(value).toISOString()

	return `<time datetime="${datetime}" title="${value}"${itemprop ? ` itemprop="${itemprop}"` : ''}${id ? ` id="${id}"` : ''}>${display}</time>`
}

function readingTime(content: string): { display: string; iso: string } | null {
	if (!content) return null
	const words = (content.match(/[\u0400-\u04FF]+|\S+\s*/g) || []).length
	const minutes = Math.ceil(words / 200)
	return { display: `${minutes}–minute read`, iso: `PT${minutes}M` }
}

function stripHtmlEntities(content: string): string {
	return he.decode(content).replace(/[\u00AD\u200B\u200C\uFEFF]|\u200D/g, '')
}

function ensureValue(value: unknown, message?: string) {
	if (value === null || value === undefined || value === '') {
		const detail =
			typeof message === 'string' && message.trim() !== ''
				? message
				: 'Required template value is missing'
		throw new Error(detail)
	}
}

function helmet(content: string, outputPath?: string): string {
	if (typeof outputPath !== 'string' || !outputPath.endsWith('.html')) return content
	const $ = cheerio.load(content)
	const $head = $('head')
	$('body [data-helmet]').each((_, el) => {
		$head.append($(el).remove())
	})
	return $.html()
}

function wrapEmDashes(content: string, outputPath?: string): string {
	return typeof outputPath === 'string' && outputPath.endsWith('.html')
		? content.replace(
				/—/g,
				'<abbr title="Yes, it’s an em dash. No, it’s not AI. I just enjoy using them — leave me alone.">—</abbr>',
			)
		: content
}

function wrapSmileyFaces(content: string, outputPath?: string): string {
	return typeof outputPath === 'string' && outputPath.endsWith('.html')
		? content.replace(
				/ (:\)|:\(|\(:)/g,
				'<span style="writing-mode: vertical-rl; color: light-dark(var(--blue), var(--pink))">$1</span>',
			)
		: content
}

function rssContent(postUrl: string): string {
	if (!postUrl || !isFeatureEnabled('CLEAN_RSS_FEED')) return ''

	const normalized = postUrl.replace(/^\/+|\/+$/g, '')
	const outputPath = path.join(process.cwd(), '_site', normalized, 'index.html')

	try {
		const html = readFileSync(outputPath, 'utf8')
		const $ = cheerio.load(html)
		const $article = $('article').first()
		const $articleBody = $article.find('[itemprop="articleBody"]').first()

		if (!$articleBody.length) return ''

		// Remove some elements that shouldn’t be rendered in a RSS feed
		$articleBody.find('script, style, noscript, baseline-status, iframe').remove()

		// Restore the footnotes that are not part of the article body
		const $footnotes = $article.find('[role="doc-endnotes"]').first()

		return $articleBody.html() + ($footnotes.length ? $.html($footnotes) : '')
	} catch {
		return ''
	}
}

// Nested `.data` (collection entries) vs flattened cascade (layouts)
// - PostTemplateData is used in posts.11tydata.ts
// - Post is used in eleventy.config.ts
function getFrontMatterData(value: MaybePost): Partial<PostFrontMatter>
function getFrontMatterData(value: MaybeProject): Partial<ProjectFrontMatter>
function getFrontMatterData(
	value: MaybePost | MaybeProject,
): Partial<PostFrontMatter | ProjectFrontMatter> {
	if (value !== null && typeof value === 'object' && 'data' in value) {
		const nested = (value as { data?: Partial<PostFrontMatter> }).data
		return { ...(nested ?? {}) }
	}
	return { ...(value as Partial<PostFrontMatter>) }
}

// A post is visible if it is not a draft or if drafts are enabled.
function isPostVisible(value: MaybePost): boolean {
	return !getFrontMatterData(value).draft || isFeatureEnabled('RENDER_DRAFTS')
}

// A post is rendered if it is visible and not an external post.
function isPostRendered(value: MaybePost): boolean {
	return isPostVisible(value) && !getFrontMatterData(value).external
}

export default {
	minifyHTML,
	a11yEmojis,
	formatNumber,
	where,
	dateToRFC3339,
	callout,
	time,
	readingTime,
	stripHtmlEntities,
	ensureValue,
	helmet,
	wrapEmDashes,
	wrapSmileyFaces,
	rssContent,
	isPostVisible,
	isPostRendered,
	getFrontMatterData,
}
