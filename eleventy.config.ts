import { IdAttributePlugin } from '@11ty/eleventy'
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import slugify from '@sindresorhus/slugify'
import footnotes from 'eleventy-plugin-footnotes'
import features from './features.json' with { type: 'json' }
import injectHeadingAnchors from './plugins/heading-anchors.ts'
import postStatsPlugin from './plugins/post-stats.ts'
import tocPlugin from './plugins/toc.ts'
import utilities from './plugins/utilities.ts'
import type { CollectionApi, EleventyConfig, PostEntry } from './types/eleventy.ts'
import type { Features } from './types/features.ts'

const ENV = process.env.NODE_ENV
const FEATURES = features as unknown as Features

export default function (config: EleventyConfig) {
	// Content post-processing
	// ---------------------------------------------------------------------------
	if (FEATURES.minifyHTML.includes(ENV)) config.addTransform('htmlmin', utilities.minifyHTML)
	if (FEATURES.wrapEmojis.includes(ENV)) config.addTransform('emoji', utilities.a11yEmojis)
	if (FEATURES.helmet.includes(ENV)) config.addTransform('helmet', utilities.helmet)
	if (FEATURES.headingAnchors.includes(ENV))
		config.addTransform('headingAnchors', injectHeadingAnchors)
	config.addTransform('smileyFaces', utilities.wrapSmileyFaces)
	config.addPlugin(eleventyImageTransformPlugin, {
		formats: ['avif', 'webp'],
		// Default widths cap raster output (~80ch column × ~2× DPR). Omit "auto" so
		// full-resolution sources are not duplicated in srcset. Per-image overrides
		// (e.g. card thumbnails) use eleventy:widths in markup.
		widths: [640, 960, 1280, 1600],
		htmlOptions: {
			// Per-img attributes win over these defaults.
			imgAttributes: {
				// Use loading="eager" in HTML or the `lazy` option from the figure
				// partial for above-the-fold images.
				loading: 'lazy',
				decoding: 'async',
				// Default sizes matches .Container (80ch); required when using eager +
				// multiple widths.
				sizes: '(max-width: 48rem) min(100vw - 2em, 100vw), 80ch',
			},
			pictureAttributes: {},
		},
	})

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
	if (FEATURES.syntaxHighlight.includes(ENV))
		config.addPlugin(syntaxHighlight, { errorOnInvalidLanguage: true })
	if (!FEATURES.markdownAlternative.includes(ENV))
		config.ignores.add('pages/blog/index-markdown.liquid')
	config.ignores.add('CLAUDE.md')

	// Static file passthrough
	// ---------------------------------------------------------------------------
	config.addPassthroughCopy({ public: '.' })
	config.addPassthroughCopy('assets/images')
	config.addPassthroughCopy({
		'node_modules/baseline-status/baseline-status.min.js':
			'assets/js/vendors/baseline-status.min.js',
	})
	config.addPassthroughCopy({
		'node_modules/grid-rows-masonry/dist/masonry.js': 'assets/js/vendors/masonry.js',
	})

	// CSS and JavaScript are inlined in HTML for performance reasons. The problem
	// with that is that saving a CSS or JavaScript file during development does
	// not cause HTML files to be recompiled, which makes working on the site
	// significantly more cumbersome. The problem is addressed by linking external
	// stylesheets and scripts in development, and inlining their content in style
	// script tags in production. For the assets to be linked to in development,
	// they need to be passed through to the `_site` directory.
	// See: https://kittygiraudel.com/2020/12/03/inlining-scripts-and-styles-in-11ty/
	if (!FEATURES.inlineAssets.includes(ENV)) {
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
