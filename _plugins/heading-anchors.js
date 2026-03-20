import * as cheerio from 'cheerio'

// This implementation is heavily inspired from <heading-anchors> by Zach Leat.
// See: https://github.com/zachleat/heading-anchors
function injectHeadingAnchors(content, outputPath) {
  if (typeof outputPath !== 'string' || !outputPath.endsWith('.html')) return content
  if (!content.includes('class="Post"') && !content.includes('itemprop="articleBody"')) {
    return content
  }

  const $ = cheerio.load(content, { decodeEntities: false }, true)

  const $articleBody = $('article.Post div[itemprop="articleBody"]').first()
  if (!$articleBody.length) return $.html()

  let anchorIndex = 0

  $articleBody.find(':is(h2, h3, h4)[id]:not([data-ha-exclude])').each((_, el) => {
    const $heading = $(el)
    const id = $heading.attr('id')

    // Prevent duplicates in case Eleventy runs transforms more than once.
    if ($heading.find('.ha-placeholder').length || $heading.find('a.ha').length) return

    const headingText = $heading.text().trim()
    const anchorName = `--ha_0_${anchorIndex++}`

    const placeholder = $(
      `<span class="ha-placeholder" aria-hidden="true" style="anchor-name: ${anchorName};">§</span>`,
    )
    const anchor = $(`<a class="ha" href="#${id}" style="position-anchor: ${anchorName};">
      <span class="visually-hidden">Jump to section titled: ${headingText}</span>
      <span aria-hidden="true">§</span>
    </a>`)

    $heading.append(placeholder)
    $heading.after(anchor)
  })

  return $.html()
}

export default injectHeadingAnchors
