import { IdAttributePlugin } from '@11ty/eleventy'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import slugify from '@sindresorhus/slugify'
import footnotes from 'eleventy-plugin-footnotes'
import injectHeadingAnchors from './plugins/heading-anchors.js'
import postStatsPlugin from './plugins/post-stats.js'
import tocPlugin from './plugins/toc.js'
import utilities from './plugins/utilities.js'

const PRODUCTION = process.env.NODE_ENV === 'production'
export const CONFIG = {
	minifyHTML: PRODUCTION,
	wrapEmojis: PRODUCTION,
	splitContent: PRODUCTION,
	syntaxHighlight: true,
	githubStars: PRODUCTION,
	inlineAssets: PRODUCTION,
	serviceWorker: PRODUCTION,
	metaRefresh: PRODUCTION,
	helmet: PRODUCTION,
	markdownAlternative: PRODUCTION,
	headingAnchors: PRODUCTION,
	renderDrafts: !PRODUCTION,
}

/** @param {import('@11ty/eleventy/UserConfig').default} config */
export default function (config) {
	// Content post-processing
	// ---------------------------------------------------------------------------
	if (CONFIG.minifyHTML) config.addTransform('htmlmin', utilities.minifyHTML)
	if (CONFIG.wrapEmojis) config.addTransform('emoji', utilities.a11yEmojis)
	if (CONFIG.helmet) config.addTransform('helmet', utilities.helmet)
	if (CONFIG.headingAnchors) config.addTransform('headingAnchors', injectHeadingAnchors)
	config.addTransform('smileyFaces', utilities.wrapSmileyFaces)

	// Watch targets
	// ---------------------------------------------------------------------------
	config.addWatchTarget('assets/css/**/*.css')
	config.addWatchTarget('assets/js/**/*.js')

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
	if (CONFIG.syntaxHighlight) config.addPlugin(syntaxHighlight, { errorOnInvalidLanguage: true })
	if (!CONFIG.markdownAlternative) config.ignores.add('pages/blog/index-markdown.liquid')
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
	if (!CONFIG.inlineAssets) {
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
	config.addCollection('posts', c =>
		c
			.getFilteredByGlob('posts/*.md')
			.filter(utilities.isPostVisible)
			.sort((a, b) => b.date - a.date),
	)
	config.addCollection('internal_posts', c =>
		c
			.getFilteredByGlob('posts/*.md')
			.filter(utilities.isPostRendered)
			.sort((a, b) => b.date - a.date),
	)
	config.addCollection('snippets', c => c.getFilteredByGlob('pages/snippets/*.md'))
	config.addCollection('recipes', collection => collection.getFilteredByGlob('pages/recipes/*.md'))

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
