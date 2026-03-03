import * as cheerio from 'cheerio'
import uslugify from 'uslug'

export default function tocPlugin(eleventyConfig) {
  eleventyConfig.addFilter('toc', html => {
    if (!html || typeof html !== 'string') {
      return []
    }

    const $ = cheerio.load(html, { decodeEntities: false }, false)
    const headings = $('h2, h3, h4').toArray()

    return headings.length < 2 ? [] : buildTocTree($, headings)
  })
}

function buildTocTree($, headingElements) {
  /** @type {{ level: number; id: string; text: string; children: any[] }[]} */
  const root = []
  let currentLevel2 = null
  let currentLevel3 = null

  for (const el of headingElements) {
    const level = getHeadingLevel(el)
    const text = $(el).text().trim()
    if (!text) continue

    const id = getHeadingId(el, text)

    const node = { level, id, text, children: [] }

    if (level === 2) {
      root.push(node)
      currentLevel2 = node
      currentLevel3 = null
    } else if (level === 3) {
      if (currentLevel2) {
        currentLevel2.children.push(node)
      } else {
        root.push(node)
      }
      currentLevel3 = node
    } else {
      // level >= 4: prefer nesting under the last h3, then h2, otherwise root
      if (currentLevel3) {
        currentLevel3.children.push(node)
      } else if (currentLevel2) {
        currentLevel2.children.push(node)
      } else {
        root.push(node)
      }
    }
  }

  return root
}

function getHeadingLevel(el) {
  const name = el?.name || ''
  const match = name.match(/^h([1-6])$/i)
  if (!match) return 2
  const level = Number(match[1])
  if (!Number.isFinite(level)) return 2
  return Math.min(Math.max(level, 1), 6)
}

// Mirror IdAttributePlugin slugification so anchors match generated ids
function getHeadingId(el, text) {
  return el?.attribs?.id ?? uslugify(text)
}
