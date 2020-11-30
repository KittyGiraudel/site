module.exports = (config, options = {}) => {
  const baseClass = options.baseClass || 'Footnotes'
  const title = options.title || 'Footnotes'
  const titleId = options.titleId || 'footnotes-label'
  const backLinkLabel = options.backLinkLabel || ((_, index) => `Back to reference ${index + 1}`)
  const FOOTNOTE_MAP = []

  // Provide a tag to register a footnote, and a filter to access the registered
  // footnotes for the page; a global would be better, but that’s not a thing in
  // Liquid so we hack it with a filter
  config.addPairedShortcode(
    'footnote',
    function footnote(content, id, description) {
      const key = this.page.inputPath
      const footnote = { id, description }

      FOOTNOTE_MAP[key] = FOOTNOTE_MAP[key] || {}
      FOOTNOTE_MAP[key][id] = footnote

      return `<a ${attrs({
        class: baseClass + '__ref',
        href: `#${id}-note`,
        id: `${id}-ref`,
        'aria-describedby': titleId,
        role: 'doc-noteref',
      })}>${content}</a>`
    }
  )

  config.addLiquidShortcode('footnotes', function footnotes(page) {
    const footnotes = Object.values(FOOTNOTE_MAP[page.inputPath] || {})
    const cl = suffix => baseClass + (suffix ? '__' + suffix : '')
    const containerAttrs = attrs({ role: 'doc-endnotes', class: cl() })
    const titleAttrs = attrs({ id: titleId, class: cl('title') })
    const listAttrs = attrs({ class: cl('list') })

    return `
  <footer ${containerAttrs}>
    <h2 ${titleAttrs}>${title}</h2>
    <ol ${listAttrs}>
      ${footnotes.map((footnote, index) => {
        const listItemAttrs = attrs({
          id: `${footnote.id}-note`,
          class: cl('list-item'),
        })
        const backLinkAttrs = attrs({
          class: cl('back-link'),
          href: `#${footnote.id}-ref`,
          'aria-label': backLinkLabel(footnote, index),
          role: 'doc-backlink',
        })

        return `<li ${listItemAttrs}>${footnote.description} <a ${backLinkAttrs}>↩</a></li>`
      })}
    </ol>
  </footer>`
  })
}

function attrs(object) {
  return Object.keys(object).reduce((acc, key, index) => {
    return [acc, `${key}="${object[key]}"`].filter(Boolean).join(' ')
  }, '')
}
