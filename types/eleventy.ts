import type UserConfigType from '@11ty/eleventy/src/UserConfig.js'

export type EleventyConfig = UserConfigType

export type DateInput = Date | string | number
export type ExternalReference = { host: string; url: string }
export type PostEdit = { md: string; date: DateInput }

export type BaseFrontMatter = {
	title: string
	description: string
	tags: string[]
}

export type PostFrontMatter = BaseFrontMatter & {
	layout: 'post'
	deprecated?: boolean
	draft?: boolean
	edits?: PostEdit[]
	external?: ExternalReference
	guest?: string
	image?: string
	templateEngineOverride?: string
	toc?: boolean
}

export type SnippetFrontMatter = BaseFrontMatter & {
	layout: 'snippet'
	language: string
	permalink: string
	date?: DateInput
	related?: string
}

export type FrontMatterLike = (PostFrontMatter | SnippetFrontMatter) & {
	[key: string]: unknown
}

export type FrontMatterCarrier = {
	data?: Partial<FrontMatterLike>
	[key: string]: unknown
}

export type PostEntry = {
	date: Date
	inputPath?: string
	data?: FrontMatterLike
}

export type PostDataContext = {
	date?: Date | string
	git?: Record<string, Date | string | undefined>
	page?: {
		inputPath?: string
		fileSlug?: string
	}
}

export type CollectionApi = {
	getFilteredByGlob: (glob: string) => PostEntry[]
}
