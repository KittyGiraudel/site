import * as cheerio from 'cheerio'
import emojiRegex from 'emoji-regex'
import emojiShortName from 'emoji-short-name'
import he from 'he'
import htmlmin from 'html-minifier-terser'
import markdownIt from 'markdown-it'

const EMOJI_REGEX = emojiRegex()
const DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
})

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

function a11yEmojis(content, outputPath) {
  return typeof outputPath === 'string' && outputPath.endsWith('.html')
    ? content.replace(EMOJI_REGEX, replaceEmoji)
    : content
}

function markdown(content, inline = false) {
  const html = markdownIt({ html: true }).render(content)
  return inline ? html.replace('<p>', '').replace('</p>', '') : html
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

function dateToRFC3339(value) {
  return new Date(value).toISOString().replace(/\.\d+Z$/, 'Z')
}

function callout(content, type = 'info') {
  return `<aside class="Callout Callout--${type}" role="note">${markdown(content, false)}</aside>`
}

function time(value) {
  const display = DATE_FORMATTER.format(new Date(value))
  const datetime = new Date(value).toISOString()

  return `<time datetime="${datetime}" title="${value}">${display}</time>`
}

function readingTime(content) {
  return content
    ? `${Math.ceil((content.match(/[\u0400-\u04FF]+|\S+\s*/g) || []).length / 300)}–minute read`
    : ''
}

function stripHtmlEntities(content) {
  return he.decode(content).replace(/[\u00AD\u200B\u200C\uFEFF]|\u200D/g, '')
}

function ensureValue(value, message) {
  if (value === null || value === undefined || value === '') {
    const detail =
      typeof message === 'string' && message.trim() !== ''
        ? message
        : 'Required template value is missing'
    throw new Error(detail)
  }
}

function helmet(content, outputPath) {
  if (typeof outputPath !== 'string' || !outputPath.endsWith('.html')) return content
  const $ = cheerio.load(content)
  const $head = $('head')
  $('body [data-helmet]').each((_, el) => $head.append($(el).remove()))
  return $.html()
}

export default {
  minifyHTML,
  a11yEmojis,
  markdown,
  formatNumber,
  where,
  dateToRFC3339,
  callout,
  time,
  readingTime,
  stripHtmlEntities,
  ensureValue,
  helmet,
}
