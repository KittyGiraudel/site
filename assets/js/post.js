function observe(node, handler) {
  const observer = new IntersectionObserver(entries => entries.forEach(handler), {
    root: null,
    threshold: 0.1,
  })
  observer.observe(node)
  return observer
}

document.addEventListener('DOMContentLoaded', () => {
  function loadCodepen(node) {
    let loaded = false
    const observer = observe(node, entry => {
      if (entry.isIntersecting && !loaded) {
        loaded = true
        loadJS('//codepen.io/assets/embed/ei.js', () => observer.unobserve(node))
      }
    })
  }

  function loadGiscus(node) {
    let loaded = false
    const observer = observe(node, entry => {
      if (entry.isIntersecting && !loaded) {
        loaded = true
        loadJS('https://giscus.app/client.js', () => observer.unobserve(node), {
          insert: script => document.querySelector('#giscus-holder')?.appendChild(script),
          attributes: {
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
          },
        })
      }
    })
  }

  const codepen = document.querySelector('.codepen')
  const giscus = document.querySelector('#giscus-holder')
  if (codepen) loadCodepen(codepen)
  if (giscus) loadGiscus(giscus)

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
