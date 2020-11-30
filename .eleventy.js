const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginSass = require('eleventy-plugin-sass')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const uslugify = require('uslug')

const FOOTNOTES = new Map()

module.exports = function (config) {
  // Enable compilation plugins
  config.addPlugin(pluginSass, {})
  config.addPlugin(syntaxHighlight)

  // Pass through static files; the CSS file is handled through Sass and
  // therefore not explitly passed through here
  config.addPassthroughCopy('assets/images')
  config.addPassthroughCopy('assets/js')
  config.addPassthroughCopy('_redirects')
  config.addPassthroughCopy('humans.txt')
  config.addPassthroughCopy('manifest.json')

  // Allow Liquid to import nested and dynamic partials
  config.setLiquidOptions({ dynamicPartials: true })

  // Add a filter and a tag to parse content as Markdown in Liquid files
  config.addFilter('markdown', markdown)
  config.addPairedShortcode('markdown', markdown)

  // Add a Liquid filter to format a date and wrap it in a <time> element
  config.addFilter('time', time)

  // Add a Liquid filter to compute the reading time of given content
  config.addFilter('reading_time', readingTime)

  // Provide a tag to register a footnote, and a filter to access the registered
  // footnotes for the page; a global would be better, but that’s not a thing in
  // Liquid so we hack it with a filter
  config.addPairedShortcode('footnote', footnote)
  config.addFilter('footnotes', footnotes)

  // Provide a tag to render info blocks
  config.addPairedShortcode('info', info)

  // Reproduce some Liquid filters, sometimes losely
  config.addFilter('date_to_xmlschema', dateToXmlSchema)
  config.addFilter('group_by', groupBy)
  config.addFilter('number_of_words', numberOfWords)
  config.addFilter('sort_by', sortBy)
  config.addFilter('where', where)

  // Register a collection for the posts and sort them from most to least recent
  config.addCollection('posts', collection =>
    collection.getFilteredByGlob('_posts/*.md').sort((a, b) => b.date - a.date)
  )

  // Override the Markdown renderer to use link anchors
  config.setLibrary(
    'md',
    markdownIt({ html: true }).use(markdownItAnchor, { slugify: uslugify })
  )

  return {
    dir: {
      input: './',
      output: './_site',
      layouts: '_layouts',
    },
  }
}

function markdown(content) {
  return markdownIt().render(content)
}

function numberOfWords(content) {
  return content.split(/\s+/g).length
}

function where(array, key, value) {
  return array.filter(item => {
    const data = item && item.data ? item.data : item
    return typeof value === 'undefined' ? key in data : data[key] === value
  })
}

function sortBy(array, key) {
  return array
    .slice(0)
    .sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0))
}

function dateToXmlSchema(value) {
  return new Date(value).toISOString()
}

function dateToString(value) {
  const date = new Date(value)
  const formatter = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(date)
  const month = parts[0].value
  const day = parts[2].value
  const year = parts[4].value

  return month + ' ' + day + ', ' + year
}

function groupBy(array, key) {
  const map = array.reduce((acc, entry) => {
    if (typeof acc[entry[key]] === 'undefined') {
      acc[entry[key]] = []
    }
    acc[entry[key]].push(entry)
    return acc
  }, {})

  return Object.keys(map).reduce(
    (acc, key) => [...acc, { name: key, items: map[key] }],
    []
  )
}

function footnote(content, id, description) {
  const footnotes = FOOTNOTES.get(this.page.inputPath) || {}

  footnotes[id] = { id, description }
  FOOTNOTES.set(this.page.inputPath, footnotes)

  return `<a href="#${id}-note" id="${id}-ref" aria-describedby="footnotes-label" role="doc-noteref" class="Footnote">${content}</a>`
}

function footnotes(_, page) {
  return Object.values(FOOTNOTES.get(page.inputPath) || {})
}

function info(content) {
  return `<div class="Info">${markdown(content)}</div>`
}

function time(value) {
  return `<time datetime="${dateToXmlSchema(value)}">${dateToString(
    value
  )}</time>`
}

function readingTime(content) {
  return content
    ? '~' +
        Math.ceil(
          (content.match(/[\u0400-\u04FF]+|\S+\s*/g) || []).length / 300
        ) +
        ' minutes'
    : ''
}
