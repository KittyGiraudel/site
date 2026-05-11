import { IdAttributePlugin, RenderPlugin } from '@11ty/eleventy'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import slugify from '@sindresorhus/slugify'
import { defineConfig } from '11ty.ts'
import footnotes from 'eleventy-plugin-footnotes'
import { asEleventyFilter } from './build/eleventy.ts'
import { isFeatureEnabled } from './build/features.ts'
import injectHeadingAnchors from './build/heading-anchors.ts'
import imageTransformPlugin from './build/image-transform.ts'
import postStatsPlugin from './build/post-stats.ts'
import tocPlugin from './build/toc.ts'
import utilities from './build/utilities.ts'

export default defineConfig(config => {
	// Content pre-processing
	// See: https://www.11ty.dev/docs/config-preprocessors/#example-drafts
	// ---------------------------------------------------------------------------
	config.addPreprocessor('drafts', '*', data => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === 'build') return false
	})

	// Content post-processing
	// ---------------------------------------------------------------------------
	if (isFeatureEnabled('MINIFY_HTML')) config.addTransform('htmlmin', utilities.minifyHTML)
	if (isFeatureEnabled('WRAP_EMOJIS')) config.addTransform('emoji', utilities.a11yEmojis)
	if (isFeatureEnabled('PROCESS_HELMET')) config.addTransform('helmet', utilities.helmet)
	if (isFeatureEnabled('INJECT_HEADING_ANCHORS'))
		config.addTransform('headingAnchors', injectHeadingAnchors)
	config.addTransform('smileyFaces', utilities.wrapSmileyFaces)

	// Watch targets
	// ---------------------------------------------------------------------------
	config.addWatchTarget('plugins/**/*.ts')
	config.addWatchTarget('pages/**/*.11tydata.{js,ts}')

	// Compilation plugins
	// ---------------------------------------------------------------------------
	config.addPlugin(imageTransformPlugin)
	config.addPlugin(footnotes, { classes: { list: 'NoListMarker' } })
	config.addPlugin(IdAttributePlugin, {
		slugify,
		checkDuplicates: false,
		selector: 'h2,h3,h4',
	})
	config.addPlugin(postStatsPlugin)
	config.addPlugin(tocPlugin)
	config.addPlugin(RenderPlugin)
	if (isFeatureEnabled('HIGHLIGHT_CODE_BLOCKS'))
		config.addPlugin(syntaxHighlight, { errorOnInvalidLanguage: true })

	// Compilation ignores
	// ---------------------------------------------------------------------------
	if (!isFeatureEnabled('RENDER_MARKDOWN_ALTERNATIVE'))
		config.ignores.add('pages/blog-markdown.liquid')
	config.ignores.add('CLAUDE.md')
	config.ignores.add('STYLEGUIDE.md')

	// Static file passthrough
	// ---------------------------------------------------------------------------
	config.addPassthroughCopy({ public: '.' })
	config.addPassthroughCopy('assets/images')
	config.addPassthroughCopy({
		'node_modules/baseline-status/baseline-status.min.js':
			'assets/js/vendors/baseline-status.min.js',
		'node_modules/grid-rows-masonry/dist/masonry.js': 'assets/js/vendors/masonry.js',
		'node_modules/charts.css/dist/charts.min.css': 'assets/css/vendors/charts.css',
	})

	// CSS and JavaScript are inlined in HTML for performance reasons. However,
	// saving a CSS or JavaScript file ends up rebuilding *all* pages which can
	// take several seconds. To work around the problem, we do not inline assets
	// in development and instead hotlink them from the source files using proper
	// stylesheets. This makes working on styles (and scripts) near instant.
	if (!isFeatureEnabled('INLINE_ASSETS')) {
		config.setServerPassthroughCopyBehavior('passthrough')
		config.addPassthroughCopy('assets/js')
		config.addPassthroughCopy('assets/css')
	}

	// Liquid filters and shortcodes
	// ---------------------------------------------------------------------------
	config.addPairedShortcode('callout', utilities.callout)
	config.addShortcode('ensure', asEleventyFilter(utilities.ensureValue))
	config.addShortcode('styles', utilities.styles)
	config.addFilter('time', utilities.time)
	config.addFilter('reading_time', asEleventyFilter(utilities.readingTime))
	config.addFilter('date_to_rfc3339', utilities.dateToRFC3339)
	config.addFilter('where', asEleventyFilter(utilities.where))
	config.addFilter('strip_html_entities', utilities.stripHtmlEntities)
	config.addFilter('rss_content', utilities.rssContent)

	// Collections
	// ---------------------------------------------------------------------------
	config.addCollection('posts', c =>
		c.getFilteredByGlob('posts/*.md').sort((a, b) => b.date.getTime() - a.date.getTime()),
	)
	config.addCollection('internal_posts', c =>
		c
			.getFilteredByGlob('posts/*.md')
			.filter(utilities.isPostRendered)
			.sort((a, b) => b.date.getTime() - a.date.getTime()),
	)
	config.addCollection('snippets', c => c.getFilteredByGlob('pages/snippets/*.md'))
	config.addCollection('recipes', c => c.getFilteredByGlob('pages/recipes/*.md'))
	config.addCollection('projects', c =>
		c
			.getFilteredByGlob('pages/projects/*.liquid')
			.sort((a, b) => a.fileSlug.localeCompare(b.fileSlug)),
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
})
