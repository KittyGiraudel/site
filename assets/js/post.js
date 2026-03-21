// Lazy-load embeds when they’re visible.
// See: https://twitter.com/whitep4nth3r/status/1518978629593702403
const EMBEDS = [
  {
    selector: '.sassmeister',
    url: '//cdn.sassmeister.com/js/embed.js',
    loaded: false,
  },
  {
    selector: '.codepen',
    url: '//codepen.io/assets/embed/ei.js',
    loaded: false,
  },
  {
    selector: '.twitter-tweet',
    url: '//platform.twitter.com/widgets.js',
    loaded: false,
  },
  {
    selector: '#giscus-holder',
    url: 'https://giscus.app/client.js',
    loaded: false,
    getAttributes: () => ({
      'data-repo': 'kittygiraudel/site',
      'data-repo-id': 'MDEwOlJlcG9zaXRvcnk4MjUzNjQ0',
      'data-category': 'Announcements',
      'data-category-id': 'DIC_kwDOAH3wzM4ChZC4',
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': giscusThemeFromSiteTheme(),
      'data-lang': 'en',
      'data-loading': 'lazy',
      crossorigin: 'anonymous',
    }),
  },
]

document.addEventListener('DOMContentLoaded', () => {
  EMBEDS.forEach(embed => {
    const node = document.querySelector(embed.selector)
    if (!node) return

    const handler = entry => {
      if (!embed.loaded && entry.isIntersecting) {
        loadJS(embed.url, () => (embed.loaded = true), embed.getAttributes?.())
      }
    }

    const observer = new IntersectionObserver(entries => entries.forEach(handler), {
      root: null,
      threshold: 0.1,
    })

    observer.observe(node)
  })

  window.ThemeManager.onThemeChanged(theme => {
    const iframe = document.querySelector('iframe.giscus-frame')
    if (theme === window.ThemeManager.themes.AUTO) theme = 'preferred_color_scheme'
    iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app')
  })
})

function giscusThemeFromSiteTheme() {
  const stored = window.ThemeManager.theme
  if (stored === window.ThemeManager.themes.AUTO) return 'preferred_color_scheme'
  return stored
}
