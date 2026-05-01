// When using Eleventy’s watch mode, the `data-theme` attribute gets lost be-
// cause it’s applied on mount by the ThemeManager. This re-asserts the
// current ThemeManager mode so forced light/dark survives live reloads during
// development.
;(function keepThemeAcrossLiveReload() {
	const root = document.documentElement

	const ensureDocumentAttr = () => {
		const { theme } = window.ThemeManager
		const resolved = window.ThemeManager.resolveToLightOrDark(theme)
		if (root.dataset.theme !== resolved) window.ThemeManager.applyTheme(theme)
	}

	const observer = new MutationObserver(() => ensureDocumentAttr())
	observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
})()
