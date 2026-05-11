import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
import utilities from './utilities.ts'

// This implementation is heavily inspired from <heading-anchors> by Zach Leat.
// See: https://github.com/zachleat/heading-anchors
function injectHeadingAnchors(content: string, outputPath?: string) {
	if (typeof outputPath !== 'string' || !outputPath.endsWith('.html')) return content
	if (!content.includes('data-heading-anchors')) return content

	const $ = cheerio.load(content)
	const $headings = $(
		'[data-heading-anchors] :where(h2, h3)[id]:not([data-ha-exclude]):not(#footnotes-label)',
	)

	let anchorIndex = 0

	// Inject the relevant stylesheet (if needed)
	if ($headings.length > 0) $('head').append(utilities.styles('components/heading-anchors'))

	$headings.each((_, el: Element) => {
		const $heading = $(el)
		const anchorName = `--ha_0_${anchorIndex++}`

		const placeholder = $(
			`<span class="ha-placeholder" aria-hidden="true" style="anchor-name: ${anchorName};">§</span>`,
		)
		const anchor =
			$(`<a class="ha" href="#${$heading.attr('id')}" style="position-anchor: ${anchorName};">
      <span class="VisuallyHidden">Jump to section titled: ${$heading.text().trim()}</span>
      <span aria-hidden="true">§</span>
    </a>`)

		$heading.append(placeholder)
		$heading.after(anchor)
	})

	return $.html()
}

export default injectHeadingAnchors
