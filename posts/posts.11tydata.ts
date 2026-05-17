import { readFileSync } from 'node:fs'
import type { Post, PostTemplateData } from '../build/eleventy.ts'
import utilities from '../build/utilities.ts'

const config = {
	layout: 'post',
	// Although Eleventy supports “Last Modified” and “git Last Modified” magic
	// keywords, it only supports them for the `date` field, and it feels a little
	// wrong to me using that field for an *update* date. So we do not actually
	// define the `date` field which lets Eleventy extract it from the file path
	// if ever used. And on our end, we explicitly compute a creation date (which
	// is extracted from the file path) and an udpate date (which is extracted
	// from the git log if available).
	eleventyComputed: {
		// The creation date is *always* extracted from the post’s file path. It
		// doesn’t matter when the file was created, or modified. What matters is
		// the date from the URL. In another world, post URLs wouldn’t contain the
		// date, but coming from Jekyll, they do, and therefore the creation date
		// should respect that.
		creation_date(data: PostTemplateData) {
			const inputPath = data.page?.inputPath
			return getPostDateFromPath(inputPath) || data.date
		},
		// The update date is extracted from the git log if available. In order to
		// avoid paying a performance penalty with a `git log` call for every post,
		// we build a map of the post paths to their last modified date.
		// See: https://meiert.com/blog/eleventy-git-last-modified/
		update_date(data: PostTemplateData) {
			const inputPath = data.page?.inputPath
			const key = inputPath?.replace(/^\.\//, '')
			const gitDate = key ? data.git?.[key] : undefined
			if (!gitDate) return undefined

			// URL publication date is authoritative; the commit date can predate it
			// for future-dated or in-progress drafts (e.g. filename 2026-05-18, last
			// commit 2026-05-16).
			const creationDate = getPostDateFromPath(inputPath) ?? data.date
			if (!creationDate) return gitDate

			return gitDate > creationDate ? gitDate : creationDate
		},
		reading_time(data: PostTemplateData) {
			function stripNoise(markdown: string): string {
				return markdown
					.replace(/(^|\n)(```|~~~)[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g, '\n') // Code blocks
					.replace(/(^|\n)(?: {4}|\t).+(?=\n|$)/g, '\n') // Tabs
					.replace(/{%\s*render\b[\s\S]*?%}/g, '') // Render blocks
					.replace(/!\[[^\]]*]\([^)]*\)/g, '') // Images
					.replace(/\[([^\]]+)]\([^)]*\)/g, '$1') // Links
					.replace(/`([^`]+)`/g, '$1') // Code
					.replace(/^#{1,6}\s+/gm, '') // Headings
			}

			try {
				const inputPath = data.page?.inputPath
				const raw = readFileSync(inputPath, 'utf8')
				const markdown = utilities.stripFrontMatter(raw)
				const content = stripNoise(markdown)
				const words = (content.match(/[\u0400-\u04FF]+|\S+\s*/g) || []).length
				const minutes = Math.ceil(words / 200)

				return { display: `${minutes}–minute read`, iso: `PT${minutes}M` }
			} catch {
				return null
			}
		},
		/**
		 * 1-based position in publication order: first post ever = 1, latest = N.
		 * Matches the order of `collections.posts` (newest first): index `i` →
		 * number `length - i`.
		 */
		archive_post_number(data: PostTemplateData & { collections?: { posts: Post[] } }) {
			const posts = data.collections?.posts
			const rawPath = data.page?.inputPath
			if (!posts?.length || !rawPath) return undefined
			const needle = rawPath.replace(/^\.\//, '')
			const index = posts.findIndex(p => (p.inputPath ?? '').replace(/^\.\//, '') === needle)
			if (index < 0) return undefined
			return posts.length - index
		},
	},
	permalink(data: PostTemplateData) {
		// Do not generate a permalink (and thus a page) for posts that are not
		// rendered.
		if (!utilities.isPostRendered(data)) return false

		const inputPath = data.page?.inputPath
		const fileSlug = data.page?.fileSlug
		const date = getPostDateFromPath(inputPath)
		if (!date || !fileSlug) return false

		const d = new Date(date)
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')

		return `/${year}/${month}/${day}/${fileSlug}/`
	},
}

const getPostDateFromPath = (inputPath?: string): Date | null => {
	if (!inputPath) return null

	const match = inputPath.match(/\/(\d{4})-(\d{2})-(\d{2})-[^/]+\.md$/)
	if (!match?.[1] || !match[2] || !match[3]) return null

	return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`)
}

export default config
