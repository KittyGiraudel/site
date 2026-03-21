const T = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark',
}

class ThemeManager {
  #_listeners = []
  #_storageKey = 'dark-mode'

  get themes() {
    return T
  }

  get theme() {
    return this.getPreferredTheme()
  }

  onThemeChanged(callback) {
    this.#_listeners.push(callback)
  }

  getPreferredTheme() {
    const raw = localStorage.getItem(this.#_storageKey)
    if (raw === null) return T.AUTO

    // Backwards compatibility with previous boolean storage
    if (raw === 'true') return T.DARK
    if (raw === 'false') return T.LIGHT

    if (Object.values(T).includes(raw)) return raw
    return T.AUTO
  }

  _resolveToLightOrDark(mode) {
    if (mode === T.AUTO) {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? T.DARK : T.LIGHT
    }
    return mode
  }

  _updateDocumentClass(resolved) {
    const root = document.documentElement

    if (resolved === T.DARK) {
      root.classList.remove('light')
      root.classList.add('dark')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }

  saveTheme(theme) {
    if (theme === null || theme === T.AUTO) {
      localStorage.removeItem(this.#_storageKey)
    } else {
      localStorage.setItem(this.#_storageKey, theme)
    }
  }

  applyTheme(mode) {
    this._updateDocumentClass(this._resolveToLightOrDark(mode))
    this.#_listeners.forEach(listener => {
      listener(mode)
    })
  }

  getNextTheme(theme) {
    if (theme === T.LIGHT) return T.DARK
    if (theme === T.DARK) return T.AUTO
    return T.LIGHT
  }

  handleSystemThemeChange(event) {
    // Only react to OS changes when in automatic mode.
    if (this.theme !== T.AUTO) return

    this._updateDocumentClass(event.matches ? T.DARK : T.LIGHT)
    this.#_listeners.forEach(listener => {
      listener(T.AUTO)
    })
  }

  mount() {
    this.applyTheme(this.theme)

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemThemeChange = this.handleSystemThemeChange.bind(this)

      // Safari < 14 uses addListener/removeListener.
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleSystemThemeChange)
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleSystemThemeChange)
      }
    }
  }
}

window.ThemeManager = new ThemeManager()
