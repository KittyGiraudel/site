declare module '@11ty/eleventy' {
	export const IdAttributePlugin: (eleventyConfig: unknown, options?: unknown) => unknown
}

declare module '@11ty/eleventy-img' {
	export const eleventyImageTransformPlugin: (eleventyConfig: unknown, options?: unknown) => unknown
}

declare module '@11ty/eleventy-plugin-syntaxhighlight' {
	const syntaxHighlight: (eleventyConfig: unknown, options?: unknown) => unknown
	export default syntaxHighlight
}

declare module 'eleventy-plugin-footnotes' {
	const footnotes: (eleventyConfig: unknown, options?: unknown) => unknown
	export default footnotes
}

declare module 'emoji-short-name' {
	const emojiShortName: Record<string, string>
	export default emojiShortName
}
