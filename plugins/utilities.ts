import * as cheerio from 'cheerio'
import emojiRegex from 'emoji-regex'
import emojiShortName from 'emoji-short-name'
import he from 'he'
import htmlmin from 'html-minifier-terser'
import markdownIt from 'markdown-it'
import FLAGS from '../flags.json' with { type: 'json' }
import type { DateInput, FrontMatterCarrier, FrontMatterLike } from '../types/eleventy.ts'
import type { FeatureFlags } from '../types/flags.ts'

const ENV = process.env.NODE_ENV
const CONFIG = FLAGS as unknown as FeatureFlags
const EMOJI_REGEX = emojiRegex()
const DATE_FORMATTER = new Intl.DateTimeFormat('en', {
	year: 'numeric',
	month: 'long',
	day: '2-digit',
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

function markdown(content: string, inline = false): string {
	const html = markdownIt({ html: true }).render(content)
	return inline ? html.replace('<p>', '').replace('</p>', '') : html
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

function dateToRFC3339(value: DateInput): string {
	return new Date(value).toISOString().replace(/\.\d+Z$/, 'Z')
}

function callout(content: string, type = 'info', role = 'note'): string {
	if (role === 'note') {
		return `<aside class="Callout Callout--${type}" role="note">${markdown(content, false)}</aside>`
	}
	return `<div class="Callout Callout--${type}">${markdown(content, false)}</div>`
}

function time(value: DateInput, itemprop?: string, id?: string): string {
	const display = DATE_FORMATTER.format(new Date(value))
	const datetime = new Date(value).toISOString()

	return `<time datetime="${datetime}" title="${value}"${itemprop ? ` itemprop="${itemprop}"` : ''}${id ? ` id="${id}"` : ''}>${display}</time>`
}

function readingTime(content: string): { display: string; iso: string } | null {
	if (!content) return null
	const words = (content.match(/[\u0400-\u04FF]+|\S+\s*/g) || []).length
	const minutes = Math.ceil(words / 300)
	return { display: `${minutes}–minute read`, iso: `PT${minutes}M` }
}

function stripHtmlEntities(content: string): string {
	return he.decode(content).replace(/[\u00AD\u200B\u200C\uFEFF]|\u200D/g, '')
}

function ensureValue(value: unknown, message?: string): void {
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

function getFrontMatterData(value: FrontMatterCarrier): Partial<FrontMatterLike> {
	return (value?.data ?? value ?? {}) as Partial<FrontMatterLike>
}

// A post is visible if it is not a draft or if drafts are enabled.
function isPostVisible(value: FrontMatterCarrier): boolean {
	return !getFrontMatterData(value).draft || CONFIG.renderDrafts.includes(ENV)
}

// A post is rendered if it is visible and not an external post.
function isPostRendered(value: FrontMatterCarrier): boolean {
	return isPostVisible(value) && !getFrontMatterData(value).external
}

export default {
	minifyHTML,
	a11yEmojis,
	markdown,
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
	isPostVisible,
	isPostRendered,
}
