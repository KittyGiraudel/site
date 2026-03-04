import * as cheerio from 'cheerio'
import slugify from 'slugify'

export default function tocPlugin(eleventyConfig) {
  eleventyConfig.addFilter('table_of_contents', html => {
    if (!html || typeof html !== 'string') {
      return []
    }

    const $ = cheerio.load(html, { decodeEntities: false }, false)
    const headings = $('h2, h3, h4').toArray()

    return headings.length < 2 ? [] : buildTocTree($, headings)
  })
}
function buildTocTree($, headings) {
  const tree = []
  let currentL2 = null
  let currentL3 = null

  for (const heading of headings) {
    const data = getHeadingData($, heading)
    if (!data) continue
    const node = { ...data, children: [] }

    if (node.level === 2) {
      tree.push(node)
      currentL2 = node
      currentL3 = null
    } else if (node.level === 3) {
      if (currentL2) currentL2.children.push(node)
      else tree.push(node)
      currentL3 = node
    } else {
      if (currentL3) currentL3.children.push(node)
      else if (currentL2) currentL2.children.push(node)
      else tree.push(node)
    }
  }

  return tree
}

function getHeadingData($, heading) {
  const text = $(heading).text().trim()
  if (!text) return null

  const element = heading?.name ?? ''
  const level = Number(element.match(/^h([1-6])$/i)?.[1] ?? 2)
  const id = heading?.attribs?.id ?? slugify(text)

  return { id, level, text }
}
