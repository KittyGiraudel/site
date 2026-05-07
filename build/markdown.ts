import { createRequire } from 'node:module'
import markdownIt from 'markdown-it'
import { isFeatureEnabled } from './features.ts'

const require = createRequire(import.meta.url)

let markdownRenderer: ReturnType<typeof markdownIt> | undefined

export function getMarkdownRenderer(): ReturnType<typeof markdownIt> {
	if (markdownRenderer) return markdownRenderer

	const options: ConstructorParameters<typeof markdownIt>[0] = { html: true }

	if (isFeatureEnabled('HIGHLIGHT_CODE_BLOCKS')) {
		const markdownPrismJs =
			require('@11ty/eleventy-plugin-syntaxhighlight/src/markdownSyntaxHighlightOptions.js') as (opts?: {
				errorOnInvalidLanguage?: boolean
			}) => (str: string, language: string) => string

		options.highlight = markdownPrismJs({ errorOnInvalidLanguage: true })
	}

	markdownRenderer = markdownIt(options)
	return markdownRenderer
}
