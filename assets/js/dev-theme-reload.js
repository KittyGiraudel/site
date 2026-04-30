;(function keepThemeAcrossLiveReload() {
	// In Eleventy watch mode, HTML delta updates can replace <html> and drop the
	// theme class (`light`/`dark`). Re-assert the current ThemeManager mode so
	// forced light/dark survives live reloads during development.
	if (typeof MutationObserver !== 'function') return
	if (!window.ThemeManager) return

	const { themes } = window.ThemeManager
	const root = document.documentElement

	const ensureDocumentClass = () => {
		const { theme: mode } = window.ThemeManager
		const resolved =
			mode === themes.AUTO
				? window.matchMedia?.('(prefers-color-scheme: dark)').matches
					? themes.DARK
					: themes.LIGHT
				: mode

		const hasExpectedClass =
			(resolved === themes.DARK && root.classList.contains('dark')) ||
			(resolved === themes.LIGHT && root.classList.contains('light'))

		if (!hasExpectedClass) window.ThemeManager.applyTheme(mode)
	}

	const observer = new MutationObserver(() => ensureDocumentClass())
	observer.observe(root, { attributes: true, attributeFilter: ['class'] })
})()
