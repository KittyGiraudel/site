import { IdAttributePlugin } from '@11ty/eleventy'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import slugify from '@sindresorhus/slugify'
import { defineConfig } from '11ty.ts'
import footnotes from 'eleventy-plugin-footnotes'
import projects from './data/projects.json' with { type: 'json' }
import features from './features.json' with { type: 'json' }
import injectHeadingAnchors from './plugins/heading-anchors.ts'
import imageTransformPlugin from './plugins/image-transform.ts'
import postStatsPlugin from './plugins/post-stats.ts'
import tocPlugin from './plugins/toc.ts'
import utilities from './plugins/utilities.ts'
import { asEleventyFilter } from './types/eleventy.ts'
import type { Features } from './types/features.ts'

const ENV = process.env.NODE_ENV
const FEATURES = features as unknown as Features

export default defineConfig(config => {
	// Content post-processing
	// ---------------------------------------------------------------------------
	if (FEATURES.minifyHTML.includes(ENV)) config.addTransform('htmlmin', utilities.minifyHTML)
	if (FEATURES.wrapEmojis.includes(ENV)) config.addTransform('emoji', utilities.a11yEmojis)
	if (FEATURES.helmet.includes(ENV)) config.addTransform('helmet', utilities.helmet)
	if (FEATURES.headingAnchors.includes(ENV))
		config.addTransform('headingAnchors', injectHeadingAnchors)
	config.addTransform('smileyFaces', utilities.wrapSmileyFaces)

	// Watch targets
	// ---------------------------------------------------------------------------
	config.addWatchTarget('assets/css/**/*.css')
	config.addWatchTarget('assets/js/**/*.js')
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
	if (FEATURES.syntaxHighlight.includes(ENV))
		config.addPlugin(syntaxHighlight, { errorOnInvalidLanguage: true })

	// Compilation ignores
	// ---------------------------------------------------------------------------
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
	config.addShortcode('ensure', asEleventyFilter(utilities.ensureValue))
	config.addFilter('time', utilities.time)
	config.addFilter('reading_time', asEleventyFilter(utilities.readingTime))
	config.addFilter('date_to_rfc3339', utilities.dateToRFC3339)
	config.addFilter('where', asEleventyFilter(utilities.where))
	config.addFilter('strip_html_entities', utilities.stripHtmlEntities)

	// Collections
	// ---------------------------------------------------------------------------
	config.addCollection('posts', c =>
		c
			.getFilteredByGlob('posts/*.md')
			.filter(utilities.isPostVisible)
			.sort((a, b) => b.date.getTime() - a.date.getTime()),
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
			.getFilteredByGlob('pages/projects/*/index.liquid')
			.sort((a, b) => a.fileSlug.localeCompare(b.fileSlug)),
	)
	config.addCollection('internal_projects', c =>
		c
			.getFilteredByGlob('pages/projects/*/index.liquid')
			.filter(p => {
				const fm = utilities.getFrontMatterData(p)
				const project = projects.find(pa => pa.name === fm.title)
				return project.detail_url
			})
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
