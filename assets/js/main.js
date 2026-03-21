document.addEventListener('DOMContentLoaded', () => {
  // https://joelcalifa.com/blog/revisiting-visited
  ;(function markVisitedLinks() {
    localStorage.setItem(`visited-${window.location.pathname}`, true)

    Array.from(document.querySelectorAll('.Main a')).forEach(link => {
      if (
        link.host === window.location.host &&
        localStorage.getItem(`visited-${link.pathname}${link.pathname.endsWith('/') ? '' : '/'}`)
      )
        link.dataset.visited = true
    })
  })()

  ;(function setupThemeButton() {
    const { themes } = window.ThemeManager
    const themeButton = document.querySelector('.js-theme-button')
    if (!themeButton) return

    // Show the button now that JavaScript is loaded
    themeButton.removeAttribute('hidden')

    // Update the button when the theme changes
    window.ThemeManager.onThemeChanged(theme => {
      const isDark = theme === themes.DARK
      const isLight = theme === themes.LIGHT
      const isAuto = theme === themes.AUTO

      const ariaPressed = isDark ? 'true' : isLight ? 'false' : 'mixed'
      const label = isAuto
        ? 'Theme: automatic (follows system setting)'
        : isDark
          ? 'Theme: dark'
          : 'Theme: light'

      themeButton.setAttribute('aria-pressed', ariaPressed)
      themeButton.setAttribute('title', label)
    })

    // Toggle the theme when the button is clicked
    themeButton.addEventListener('click', event => {
      const button = event.target.closest('.js-theme-button')
      if (!button) return

      const ariaPressed = button.getAttribute('aria-pressed')
      const theme =
        ariaPressed === 'true' ? themes.DARK : ariaPressed === 'false' ? themes.LIGHT : themes.AUTO
      const nextTheme = window.ThemeManager.getNextTheme(theme)

      window.ThemeManager.saveTheme(nextTheme)
      window.ThemeManager.applyTheme(nextTheme)
    })
  })()

  window.ThemeManager.mount()
})
