document.addEventListener('DOMContentLoaded', function () {
  const THEME_STORAGE_KEY = 'dark-mode'
  const Theme = {
    AUTO: 'auto',
    LIGHT: 'light',
    DARK: 'dark',
  }

  // https://joelcalifa.com/blog/revisiting-visited
  ; (function markVisitedLinks() {
    localStorage.setItem('visited-' + window.location.pathname, true)

    Array.from(document.querySelectorAll('.Main a')).forEach(function (link) {
      if (
        link.host === window.location.host &&
        localStorage.getItem(
          'visited-' + link.pathname + (link.pathname.endsWith('/') ? '' : '/')
        )
      )
        link.dataset.visited = true
    })
  })()

  const themeButton = document.querySelector('.js-theme-button')

  if (!themeButton) {
    return
  }

  function getStoredTheme() {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === null) return null

    // Backwards compatibility with previous boolean storage
    if (raw === 'true') return Theme.DARK
    if (raw === 'false') return Theme.LIGHT

    if (raw === Theme.DARK || raw === Theme.LIGHT || raw === Theme.AUTO) {
      return raw
    }

    return null
  }

  function getPreferredTheme() {
    const stored = getStoredTheme()

    if (stored && stored !== Theme.AUTO) {
      return stored
    }

    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    return prefersDark ? Theme.DARK : Theme.LIGHT
  }

  function saveTheme(theme) {
    if (theme === null || theme === Theme.AUTO) {
      // Automatic mode: follow OS preference and do not persist.
      localStorage.removeItem(THEME_STORAGE_KEY)
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
  }

  function applyTheme(theme) {
    const isDark = theme === Theme.DARK

    document.documentElement.classList.toggle('dark', isDark)

    // Represent three states for assistive tech and styling.
    if (theme === Theme.DARK) {
      themeButton.setAttribute('aria-pressed', 'true')
    } else if (theme === Theme.LIGHT) {
      themeButton.setAttribute('aria-pressed', 'false')
    } else {
      themeButton.setAttribute('aria-pressed', 'mixed')
    }

    const label = theme === Theme.AUTO
      ? 'Theme: automatic (follows system setting)'
      : theme === Theme.DARK
        ? 'Theme: dark'
        : 'Theme: light'

    themeButton.setAttribute('title', label)

    setGiscusTheme(isDark ? 'dark' : 'light')
  }

  function getNextTheme(theme) {
    if (theme === Theme.LIGHT) return Theme.DARK
    if (theme === Theme.DARK) return Theme.AUTO
    return Theme.LIGHT
  }

  let currentTheme = getPreferredTheme()
  applyTheme(currentTheme)

  // Now that JavaScript is available, make the toggle visible.
  themeButton.removeAttribute('hidden')

  themeButton.addEventListener('click', function () {
    currentTheme = getNextTheme(currentTheme)
    saveTheme(currentTheme)
    applyTheme(currentTheme)
  })

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleSystemThemeChange(event) {
      const stored = getStoredTheme()

      // Only react to OS changes when in automatic mode.
      if (stored === null || stored === Theme.AUTO) {
        const theme = event.matches ? Theme.DARK : Theme.LIGHT
        currentTheme = theme
        applyTheme(theme)
      }
    }

    // Safari < 14 uses addListener/removeListener.
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleSystemThemeChange)
    }
  }
})


function setGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame');
  const giscus = document.querySelector('[src="https://giscus.app/client.js"]')
  if (giscus) giscus.setAttribute('data-theme', theme)
  if (iframe) iframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
}
