import slugify from '@sindresorhus/slugify'
import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
import type { EleventyConfig } from '../types/eleventy.ts'

type TocNode = {
	id: string
	level: number
	text: string
	children: TocNode[]
}

export default function tocPlugin(eleventyConfig: EleventyConfig) {
	eleventyConfig.addFilter('table_of_contents', (html: string) => {
		if (!html || typeof html !== 'string') {
			return []
		}

		const $ = cheerio.load(html, undefined, false)
		const headings = $('h2, h3, h4').toArray()

		return headings.length < 2 ? [] : buildTocTree($, headings)
	})
}

function buildTocTree($: cheerio.CheerioAPI, headings: Element[]): TocNode[] {
	const tree: TocNode[] = []
	let currentL2: TocNode | null = null
	let currentL3: TocNode | null = null

	for (const heading of headings) {
		const data = getHeadingData($, heading)
		if (!data) continue
		const node = { ...data, children: [] }

		if (node.level === 2) {
			tree.push(node)
			currentL2 = node
			currentL3 = null
		} else if (node.level === 3) {
			if (currentL2) currentL2.children.push(node)
			else tree.push(node)
			currentL3 = node
		} else {
			if (currentL3) currentL3.children.push(node)
			else if (currentL2) currentL2.children.push(node)
			else tree.push(node)
		}
	}

	return tree
}

function getHeadingData($: cheerio.CheerioAPI, heading: Element) {
	const text = $(heading).text().trim()
	if (!text) return null

	const element = heading?.name ?? ''
	const level = Number(element.match(/^h([1-6])$/i)?.[1] ?? 2)
	const id = heading?.attribs?.id ?? slugify(text)

	return { id, level, text }
}
