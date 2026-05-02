import type { EleventyScope, EleventySuppliedData } from '11ty.ts'

/**
 * Supported front matter for `posts/*.md`. Same shape is flattened onto the
 * Liquid data root for layouts. Eleventy may add extra keys at runtime (e.g.
 * computed data); callers that need those should intersect a wider type locally.
 */
export type PostFrontMatter = {
	title: string
	description: string
	tags: string[]
	deprecated?: boolean
	draft?: boolean
	edits?: { date: string | Date; md: string }[]
	external?: { host: string; url: string }
	guest?: string
	image?: string
	lang?: string
	templateEngineOverride?: string
	toc?: boolean
}

/**
 * Merged data for `permalink` / `eleventyComputed` in `posts/posts.11tydata.*`.
 */
export type PostTemplateData = EleventyScope &
	Partial<PostFrontMatter> & {
		date?: Date
		git?: Record<string, Date>
		creation_date?: Date
		update_date?: Date
	}

/**
 * A post template item (`page` subset + merged `data`). Optional `data` keeps
 * `getFilteredByGlob` results assignable without assertions at every predicate.
 */
export type Post = EleventySuppliedData & {
	data?: PostFrontMatter
}

export type MaybePost = Post | PostTemplateData

export type ProjectFrontMatter = {
	layout: 'project'
	title: string
	project_name: string
	image: string
	screenshot: string
	screenshot_alt: string
	screenshot_caption: string
	permalink: string
}

export type Project = EleventySuppliedData & {
	data?: ProjectFrontMatter
}

export type MaybeProject = Project | ProjectFrontMatter

// biome-ignore lint/suspicious/noExplicitAny: `any[]` matches 11ty’s filter signature; `unknown[]` makes real `(content: string) => …` filters fail assignability checks.
type UniversalFilter = (this: EleventyScope, ...args: any[]) => unknown

/**
 * 11ty.ts types universal `addFilter` as returning only `string`, but
 * Liquid/Eleventy allow arbitrary JSON-like values at runtime (e.g. objects,
 * arrays).
 */
export function asEleventyFilter<T extends UniversalFilter>(
	fn: T,
): (this: EleventyScope, ...args: Parameters<T>) => string | PromiseLike<string> {
	return fn as (this: EleventyScope, ...args: Parameters<T>) => string | PromiseLike<string>
}
