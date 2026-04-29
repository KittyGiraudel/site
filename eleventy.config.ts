import { IdAttributePlugin } from '@11ty/eleventy'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import slugify from '@sindresorhus/slugify'
import footnotes from 'eleventy-plugin-footnotes'
import FLAGS from './flags.json' with { type: 'json' }
import injectHeadingAnchors from './plugins/heading-anchors.ts'
import postStatsPlugin from './plugins/post-stats.ts'
import tocPlugin from './plugins/toc.ts'
import utilities from './plugins/utilities.ts'
import type { CollectionApi, EleventyConfig, PostEntry } from './types/eleventy.ts'
import type { FeatureFlags } from './types/flags.ts'

const ENV = process.env.NODE_ENV
const CONFIG = FLAGS as unknown as FeatureFlags

export default function (config: EleventyConfig) {
	// Content post-processing
	// ---------------------------------------------------------------------------
	if (CONFIG.minifyHTML.includes(ENV)) config.addTransform('htmlmin', utilities.minifyHTML)
	if (CONFIG.wrapEmojis.includes(ENV)) config.addTransform('emoji', utilities.a11yEmojis)
	if (CONFIG.helmet.includes(ENV)) config.addTransform('helmet', utilities.helmet)
	if (CONFIG.headingAnchors.includes(ENV))
		config.addTransform('headingAnchors', injectHeadingAnchors)
	config.addTransform('smileyFaces', utilities.wrapSmileyFaces)

	// Watch targets
	// ---------------------------------------------------------------------------
	config.addWatchTarget('assets/css/**/*.css')
	config.addWatchTarget('assets/js/**/*.js')
	config.addWatchTarget('plugins/**/*.ts')

	// Compilation plugins
	// ---------------------------------------------------------------------------
	config.addPlugin(footnotes, { classes: { list: 'NoListMarker' } })
	config.addPlugin(IdAttributePlugin, {
		slugify,
		checkDuplicates: false,
		selector: 'h2,h3,h4',
	})
	config.addPlugin(postStatsPlugin)
	config.addPlugin(tocPlugin)
	if (CONFIG.syntaxHighlight.includes(ENV))
		config.addPlugin(syntaxHighlight, { errorOnInvalidLanguage: true })
	if (!CONFIG.markdownAlternative.includes(ENV))
		config.ignores.add('pages/blog/index-markdown.liquid')
	config.ignores.add('CLAUDE.md')

	// Static file passthrough
	// ---------------------------------------------------------------------------
	config.addPassthroughCopy({ public: '.' })
	config.addPassthroughCopy({
		'node_modules/baseline-status/baseline-status.min.js':
			'assets/js/vendors/baseline-status.min.js',
	})

	// CSS and JavaScript are inlined in HTML for performance reasons. The problem
	// with that is that saving a CSS or JavaScript file during development does
	// not cause HTML files to be recompiled, which makes working on the site
	// significantly more cumbersome. The problem is addressed by linking external
	// stylesheets and scripts in development, and inlining their content in style
	// script tags in production. For the assets to be linked to in development,
	// they need to be passed through to the `_site` directory.
	// See: https://kittygiraudel.com/2020/12/03/inlining-scripts-and-styles-in-11ty/
	if (!CONFIG.inlineAssets.includes(ENV)) {
		config.addPassthroughCopy('assets/js')
		config.addPassthroughCopy('assets/css')
	}

	// Liquid filters and shortcodes
	// ---------------------------------------------------------------------------
	config.addPairedShortcode('markdown', utilities.markdown)
	config.addPairedShortcode('callout', utilities.callout)
	config.addShortcode('ensure', utilities.ensureValue)
	config.addFilter('time', utilities.time)
	config.addFilter('reading_time', utilities.readingTime)
	config.addFilter('date_to_rfc3339', utilities.dateToRFC3339)
	config.addFilter('where', utilities.where)
	config.addFilter('strip_html_entities', utilities.stripHtmlEntities)

	// Collections
	// ---------------------------------------------------------------------------
	config.addCollection('posts', (c: CollectionApi) =>
		c
			.getFilteredByGlob('posts/*.md')
			.filter(utilities.isPostVisible)
			.sort((a: PostEntry, b: PostEntry) => b.date.getTime() - a.date.getTime()),
	)
	config.addCollection('internal_posts', (c: CollectionApi) =>
		c
			.getFilteredByGlob('posts/*.md')
			.filter(utilities.isPostRendered)
			.sort((a: PostEntry, b: PostEntry) => b.date.getTime() - a.date.getTime()),
	)
	config.addCollection('snippets', (c: CollectionApi) => c.getFilteredByGlob('pages/snippets/*.md'))
	config.addCollection('recipes', (collection: CollectionApi) =>
		collection.getFilteredByGlob('pages/recipes/*.md'),
	)

	return {
		dir: {
			output: './_site',
			layouts: 'layouts',
			includes: 'includes',
			data: 'data',
			templateFormats: ['html', 'liquid', 'md', '11ty.js'],
		},
	}
}
