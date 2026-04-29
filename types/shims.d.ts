declare module '@11ty/eleventy' {
	export const IdAttributePlugin: unknown
}

declare module '@11ty/eleventy/src/UserConfig.js' {
	export default class UserConfig {
		addTransform(...args: unknown[]): void
		addWatchTarget(...args: unknown[]): void
		addPlugin(...args: unknown[]): void
		addPairedShortcode(...args: unknown[]): void
		addShortcode(...args: unknown[]): void
		addFilter(...args: unknown[]): void
		addCollection(...args: unknown[]): void
		addPassthroughCopy(...args: unknown[]): void
		addExtension(...args: unknown[]): void
		addTemplateFormats(...args: unknown[]): void
		ignores: Set<string>
	}
}

declare module '@11ty/eleventy-plugin-syntaxhighlight'
declare module 'eleventy-plugin-footnotes'
declare module 'emoji-short-name'
