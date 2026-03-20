import { IdAttributePlugin } from '@11ty/eleventy'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import slugify from '@sindresorhus/slugify'
import * as cheerio from 'cheerio'
import footnotes from 'eleventy-plugin-footnotes'
import emojiRegex from 'emoji-regex'
import emojiShortName from 'emoji-short-name'
import he from 'he'
import htmlmin from 'html-minifier-terser'
import markdownIt from 'markdown-it'
import injectHeadingAnchors from './_plugins/heading-anchors.js'
import postStatsPlugin from './_plugins/post-stats.js'
import tocPlugin from './_plugins/toc.js'

const EMOJI_REGEX = emojiRegex()
const PRODUCTION = process.env.NODE_ENV === 'production'
export const CONFIG = {
  minifyHTML: PRODUCTION,
  wrapEmojis: PRODUCTION,
  splitContent: PRODUCTION,
  syntaxHighlight: true,
  githubStars: PRODUCTION,
  inlineScripts: PRODUCTION,
  inlineStyles: PRODUCTION,
  serviceWorker: PRODUCTION,
  metaRefresh: PRODUCTION,
  helmet: PRODUCTION,
  markdownAlternative: PRODUCTION,
  headingAnchors: true,
}

/** @param {import('@11ty/eleventy/UserConfig').default} config */
export default function (config) {
  // Content post-processing
  // ---------------------------------------------------------------------------
  if (CONFIG.minifyHTML) config.addTransform('htmlmin', minifyHTML)
  if (CONFIG.wrapEmojis) config.addTransform('emoji', a11yEmojis)
  if (CONFIG.helmet) config.addTransform('helmet', helmet)
  if (CONFIG.headingAnchors) config.addTransform('headingAnchors', injectHeadingAnchors)

  // Watch targets
  // ---------------------------------------------------------------------------
  config.addWatchTarget('assets/css/**/*.css')
  config.addWatchTarget('assets/js/**/*.js')

  // Compilation plugins
  // ---------------------------------------------------------------------------
  config.addPlugin(footnotes)
  config.addPlugin(IdAttributePlugin, {
    slugify,
    checkDuplicates: false,
    selector: 'h2,h3,h4',
  })
  config.addPlugin(postStatsPlugin)
  config.addPlugin(tocPlugin)
  if (CONFIG.syntaxHighlight) config.addPlugin(syntaxHighlight, { errorOnInvalidLanguage: true })
  if (!CONFIG.markdownAlternative) config.ignores.add('_pages/blog/index-markdown.liquid')

  // Static file passthrough
  // ---------------------------------------------------------------------------
  config.addPassthroughCopy('assets/images')
  config.addPassthroughCopy('assets/js/vendors')
  config.addPassthroughCopy('_redirects')
  config.addPassthroughCopy('_headers')
  config.addPassthroughCopy('humans.txt')
  config.addPassthroughCopy('manifest.json')
  config.addPassthroughCopy('apple-touch-icon.png')
  config.addPassthroughCopy('favicon.ico')

  // CSS and JavaScript are inlined in HTML for performance reasons. The problem
  // with that is that saving a CSS or JavaScript file during development does
  // not cause HTML files to be recompiled, which makes working on the site
  // significantly more cumbersome. The problem is addressed by linking external
  // stylesheets and scripts in development, and inlining their content in style
  // script tags in production. For the assets to be linked to in development,
  // they need to be passed through to the `_site` directory.
  // See: https://kittygiraudel.com/2020/12/03/inlining-scripts-and-styles-in-11ty/
  if (!CONFIG.inlineScripts) config.addPassthroughCopy('assets/js')
  if (!CONFIG.inlineStyles) config.addPassthroughCopy('assets/css')

  // Liquid filters and shortcodes
  // ---------------------------------------------------------------------------
  config.addFilter('markdown', content => markdown(content, true))
  config.addPairedShortcode('markdown', content => markdown(content, false))
  config.addFilter('time', time)
  config.addFilter('reading_time', readingTime)
  config.addFilter('format_number', formatNumber)
  config.addFilter('date_to_xmlschema', dateToXmlSchema)
  config.addFilter('date_to_rfc3339', dateToRFC3339)
  config.addFilter('group_by', groupBy)
  config.addFilter('number_of_words', numberOfWords)
  config.addFilter('sort_by', sortBy)
  config.addFilter('where', where)
  config.addFilter('emoji_to_text', emojiToText)
  config.addPairedShortcode('callout', callout)
  config.addFilter('strip_html_entities', stripHtmlEntities)

  // Collections
  // ---------------------------------------------------------------------------
  config.addCollection('posts', c =>
    c.getFilteredByGlob('_posts/*.md').sort((a, b) => b.date - a.date),
  )
  config.addCollection('internal_posts', c =>
    c
      .getFilteredByGlob('_posts/*.md')
      .filter(item => !item.data?.external)
      .sort((a, b) => b.date - a.date),
  )
  config.addCollection('snippets', c => c.getFilteredByGlob('_pages/snippets/*.md'))
  config.addCollection('recipes', collection => collection.getFilteredByGlob('_pages/recipes/*.md'))

  return {
    dir: {
      output: './_site',
      layouts: '_layouts',
      includes: '_includes',
      data: '_data',
      templateFormats: ['html', 'liquid', 'md', '11ty.js'],
    },
  }
}

function minifyHTML(content, outputPath) {
  return typeof outputPath === 'string' && outputPath.endsWith('.html')
    ? htmlmin.minify(content, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        noNewlinesBeforeTagClose: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      })
    : content
}

function replaceEmoji(match) {
  const label = emojiShortName[match]?.replace(/"/g, '')
  return label ? `<span role="img" aria-label="${label}" title="${label}">${match}</span>` : match
}

function emojiToText(str) {
  if (!str || typeof str !== 'string') return ''
  return str.replace(EMOJI_REGEX, match => emojiShortName[match] || match)
}

function a11yEmojis(content, outputPath) {
  return typeof outputPath === 'string' && outputPath.endsWith('.html')
    ? content.replace(EMOJI_REGEX, replaceEmoji)
    : content
}

function markdown(content, inline = true) {
  const html = markdownIt({ html: true }).render(content)
  return inline ? html.replace('<p>', '').replace('</p>', '') : html
}

function numberOfWords(content) {
  return content.split(/\s+/g).length
}

function formatNumber(amount) {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

function where(array, key, value) {
  return array.filter(item => {
    const data = item?.data ?? item
    return typeof value === 'undefined' ? key in data : data[key] === value
  })
}

function sortBy(array, key) {
  if (!Array.isArray(array)) return array
  return [...array].sort((a, b) => {
    const aVal = a?.[key]
    const bVal = b?.[key]
    if (typeof aVal === 'string' && typeof bVal === 'string')
      return aVal.localeCompare(bVal, undefined, { sensitivity: 'base' })
    if (aVal instanceof Date && bVal instanceof Date) return aVal.getTime() - bVal.getTime()
    return 0
  })
}

function dateToXmlSchema(value) {
  try {
    return new Date(value).toISOString()
  } catch {
    return value
  }
}

function dateToRFC3339(value) {
  const date = new Date(value).toISOString()
  const chunks = date.split('.')
  chunks.pop()
  return `${chunks.join('')}Z`
}

function dateToString(value) {
  try {
    const date = new Date(value)
    const formatter = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    })
    const parts = formatter.formatToParts(date)
    const month = parts[0].value
    const day = Number(parts[2].value)
    const year = parts[4].value
    const suffix = ['st', 'nd', 'rd'][day - 1] || 'th'

    return `${month} ${day}${suffix}, ${year}`
  } catch {
    return value
  }
}

function groupBy(array, key) {
  const get = entry => key.split('.').reduce((acc, key) => acc[key], entry)

  const map = array.reduce((acc, entry) => {
    const value = get(entry)
    if (typeof acc[value] === 'undefined') acc[value] = []
    acc[value].push(entry)
    return acc
  }, {})

  return Object.keys(map).reduce((acc, key) => acc.concat({ name: key, items: map[key] }), [])
}

function callout(content, type = 'info') {
  return `<aside class="Callout Callout--${type}" role="note">${markdown(content, false)}</aside>`
}

function time(value) {
  return `<time datetime="${dateToXmlSchema(value)}" title="${value}">${dateToString(value)}</time>`
}

function readingTime(content) {
  return content
    ? `${Math.ceil((content.match(/[\u0400-\u04FF]+|\S+\s*/g) || []).length / 300)}–minute read`
    : ''
}

function stripHtmlEntities(content) {
  return he.decode(content).replace(/[\u00AD\u200B\u200C\uFEFF]|\u200D/g, '')
}

function helmet(content, outputPath) {
  if (typeof outputPath !== 'string' || !outputPath.endsWith('.html')) return content
  const $ = cheerio.load(content)
  const $head = $('head')
  $('body [data-helmet]').each((_, el) => $head.append($(el).remove()))
  return $.html()
}
