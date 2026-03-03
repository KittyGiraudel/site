import { IdAttributePlugin } from '@11ty/eleventy'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import * as cheerio from 'cheerio'
import footnotes from 'eleventy-plugin-footnotes'
import emojiRegex from 'emoji-regex'
import emojiShortName from 'emoji-short-name'
import htmlmin from 'html-minifier-terser'
import markdownIt from 'markdown-it'
import uslugify from 'uslug'
import postStatsPlugin from './_plugins/post-stats.js'

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
  helmet: true,
}

/** @param {import('@11ty/eleventy/UserConfig').default} config */
export default function (config) {
  // Content post-processing
  // ---------------------------------------------------------------------------
  if (CONFIG.minifyHTML) config.addTransform('htmlmin', minifyHTML)
  if (CONFIG.wrapEmojis) config.addTransform('emoji', a11yEmojis)
  if (CONFIG.helmet) config.addTransform('helmet', helmet)

  // Watch targets
  // ---------------------------------------------------------------------------
  config.addWatchTarget('assets/css/**/*.css')
  config.addWatchTarget('assets/js/**/*.js')

  // Compilation plugins
  // ---------------------------------------------------------------------------
  config.addPlugin(footnotes)
  config.addPlugin(IdAttributePlugin, {
    slugify: uslugify,
    checkDuplicates: false,
    selector: 'h2,h3,h4',
  })
  config.addPlugin(postStatsPlugin)
  if (CONFIG.syntaxHighlight) config.addPlugin(syntaxHighlight, { errorOnInvalidLanguage: true })

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
  config.addFilter('split_content', splitContent)
  config.addFilter('format_number', formatNumber)
  config.addFilter('date_to_xmlschema', dateToXmlSchema)
  config.addFilter('date_to_rfc3339', dateToRFC3339)
  config.addFilter('group_by', groupBy)
  config.addFilter('number_of_words', numberOfWords)
  config.addFilter('sort_by', sortBy)
  config.addFilter('where', where)
  config.addFilter('emoji_to_text', emojiToText)
  config.addPairedShortcode('info', info)

  // Collections
  // ---------------------------------------------------------------------------
  config.addCollection('posts', c =>
    c.getFilteredByGlob('_posts/*.md').sort((a, b) => b.date - a.date),
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
  return outputPath.endsWith('.html')
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
  return outputPath.endsWith('.html') ? content.replace(EMOJI_REGEX, replaceEmoji) : content
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

function info(content) {
  return `<aside class="Info" role="note">${markdown(content, false)}</aside>`
}

function time(value) {
  return `<time datetime="${dateToXmlSchema(value)}">${dateToString(value)}</time>`
}

function readingTime(content) {
  return content
    ? `${Math.ceil((content.match(/[\u0400-\u04FF]+|\S+\s*/g) || []).length / 300)}–minute read`
    : ''
}

/**
 * Split the content into 2 parts: the first content block on the page, and then the rest of the
 * article. This way, we can inject the ad right between the two.
 * @param {string} html - The HTML string to split (typically `content` variable from Liquid)
 * @returns {[string, string]} A tuple of the first content block and the rest of the article.
 */
function splitContent(html) {
  if (!html || typeof html !== 'string') {
    return ['', '']
  }

  // We don’t really need to bother too much with the ad placement during dev,
  // so we skip the whole Cheerio parsing and just return the HTML as is.
  if (!CONFIG.splitContent) {
    return ['', html]
  }

  // Load the HTML into Cheerio as a *fragment* so we don’t get the implicit `html` and `body`
  // elements. The third argument set to `false` tells Cheerio this is not a full document.
  const $ = cheerio.load(html, { decodeEntities: false }, false)

  // Get the top-level nodes of the fragment and find the first *element* node.
  const nodes = $.root().contents().toArray()
  const splitIndex = nodes.findIndex(node => node.type === 'tag')

  // If we couldn’t find any candidate, we return a tuple so that the ad is injected at the top
  // of the post content.
  if (splitIndex === -1) return ['', html]

  // If we did find a candidate, slice the array of nodes into 2 parts: everything up to and
  // including the candidate (so we inject the ad *after* it), and everything after it.
  const beforeNodes = nodes.slice(0, splitIndex + 1)
  const afterNodes = nodes.slice(splitIndex + 1)

  // Serialize the nodes back into HTML, since this is what Liquid expects.
  const serialize = nodeArray =>
    nodeArray
      .map(node => {
        // $.html works for both element and text/comment nodes
        const out = $.html(node)
        return typeof out === 'string' ? out : ''
      })
      .join('')

  return [serialize(beforeNodes), serialize(afterNodes)]
}

function helmet(content, outputPath) {
  if (!outputPath.endsWith('.html')) return content
  const $ = cheerio.load(content)
  const $head = $('head')
  $('body [data-helmet]').each((_, el) => $head.append($(el).remove()))
  return $.html()
}