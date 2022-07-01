const htmlmin = require('html-minifier')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const footnotes = require('eleventy-plugin-footnotes')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const uslugify = require('uslug')
const emojiRegex = require('emoji-regex')()
const emojiShortName = require('emoji-short-name')

module.exports = function (config) {
  // Minify HTML and CSS in production
  if (process.env.NODE_ENV === 'production') {
    config.addTransform('htmlmin', minifyHTML)
  }

  // Wrap emojis to give them more semantic meaning.
  config.addTransform('emoji', a11yEmojis)

  // Force 11ty to watch CSS and JS files
  config.addWatchTarget('assets/css/**/*.css')
  config.addWatchTarget('assets/js/**/*.js')

  // Enable compilation plugins
  config.addPlugin(syntaxHighlight)
  config.addPlugin(footnotes)

  // Pass through static files; the CSS file is handled through Sass and
  // therefore not explitly passed through here
  config.addPassthroughCopy('assets/images')
  config.addPassthroughCopy('_redirects')
  config.addPassthroughCopy('_headers')
  config.addPassthroughCopy('humans.txt')
  config.addPassthroughCopy('manifest.json')
  config.addPassthroughCopy('apple-touch-icon.jpg')
  config.addPassthroughCopy('favicon.ico')

  // CSS and JavaScript are inlined in HTML for performance reasons. The problem
  // with that is that saving a CSS or JavaScript file during development does
  // not cause HTML files to be recompiled, which makes working on the site
  // significantly more cumbersome. The problem is addressed by linking external
  // stylesheets and scripts in development, and inlining their content in style
  // script tags in production. For the assets to be linked to in development,
  // they need to be passed through to the `_site` directory.
  // See: https://kittygiraudel.com/2020/12/03/inlining-scripts-and-styles-in-11ty/
  if (process.env.NODE_ENV !== 'production') {
    config.addPassthroughCopy('assets/js')
    config.addPassthroughCopy('assets/css')
  } else {
    config.addPassthroughCopy('assets/js/vendors')
  }

  // Add a filter and a tag to parse content as Markdown in Liquid files
  config.addFilter('markdown', content => markdown(content, true))
  config.addPairedShortcode('markdown', content => markdown(content, false))

  // Add a Liquid filter to format a date and wrap it in a <time> element
  config.addFilter('time', time)

  // Add a Liquid filter to compute the reading time of given content
  config.addFilter('reading_time', readingTime)

  // Add a Liquid filter to format amount of stars
  config.addFilter('stars', stars)

  // Provide a tag to render info blocks
  config.addPairedShortcode('info', info)

  // Reproduce some Liquid filters, sometimes losely
  config.addFilter('date_to_xmlschema', dateToXmlSchema)
  config.addFilter('date_to_rfc3339', dateToRFC3339)
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

function minifyHTML(content, outputPath) {
  return outputPath.endsWith('.html')
    ? htmlmin.minify(content, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      })
    : content
}

function replaceEmoji(match) {
  const label = emojiShortName[match]

  return label
    ? `<span role="img" aria-label="${label}" title="${label}">${match}</span>`
    : match
}

function a11yEmojis(content, outputPath) {
  return outputPath.endsWith('.html')
    ? content.replace(emojiRegex, replaceEmoji)
    : content
}

function markdown(content, inline = true) {
  const html = markdownIt({ html: true }).render(content)

  return inline ? html.replace('<p>', '').replace('</p>', '') : html
}

function numberOfWords(content) {
  return content.split(/\s+/g).length
}

function stars(amount) {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ⭐️`
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
    .sort((a, b) =>
      a[key].toLowerCase() < b[key].toLowerCase()
        ? -1
        : a[key].toLowerCase() > b[key].toLowerCase()
        ? 1
        : 0
    )
}

function dateToXmlSchema(value) {
  return new Date(value).toISOString()
}

function dateToRFC3339(value) {
  let date = new Date(value).toISOString()
  let chunks = date.split('.')
  chunks.pop()

  return chunks.join('') + 'Z'
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
  const day = Number(parts[2].value)
  const year = parts[4].value
  const suffix = ['st', 'nd', 'rd'][day - 1] || 'th'

  return month + ' ' + day + suffix + ', ' + year
}

function groupBy(array, key) {
  const get = entry => key.split('.').reduce((acc, key) => acc[key], entry)

  const map = array.reduce((acc, entry) => {
    const value = get(entry)

    if (typeof acc[value] === 'undefined') {
      acc[value] = []
    }

    acc[value].push(entry)
    return acc
  }, {})

  return Object.keys(map).reduce(
    (acc, key) => [...acc, { name: key, items: map[key] }],
    []
  )
}

function info(content) {
  return `<div class="Info">${markdown(content, false)}</div>`
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
