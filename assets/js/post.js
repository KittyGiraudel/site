function observe(nodes, handler) {
	const observer = new IntersectionObserver(entries => entries.forEach(handler), {
		root: null,
		threshold: 0.1,
	})
	nodes.forEach(node => {
		observer.observe(node)
	})
	return () => {
		nodes.forEach(node => {
			observer.unobserve(node)
		})
		observer.disconnect()
	}
}

document.addEventListener('DOMContentLoaded', () => {
	function loadCodepen(nodes) {
		let loaded = false
		const unobserve = observe(nodes, entry => {
			if (entry.isIntersecting && !loaded) {
				loaded = true
				loadJS('//codepen.io/assets/embed/ei.js', unobserve)
			}
		})
	}

	function loadGiscus(nodes) {
		let loaded = false
		const unobserve = observe(nodes, entry => {
			if (entry.isIntersecting && !loaded) {
				loaded = true
				loadJS('https://giscus.app/client.js', unobserve, {
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

	function loadBaseline(nodes) {
		let loaded = false
		const unobserve = observe(nodes, entry => {
			if (entry.isIntersecting && !loaded) {
				loaded = true
				loadJS('/assets/js/vendors/baseline-status.min.js', unobserve, {
					attributes: { type: 'module' },
				})
			}
		})
	}

	const codepen = Array.from(document.querySelectorAll('.codepen'))
	const giscus = Array.from(document.querySelectorAll('#giscus-holder'))
	const baselines = Array.from(document.querySelectorAll('baseline-status'))
	if (codepen.length) loadCodepen(codepen)
	if (giscus.length) loadGiscus(giscus)
	if (baselines.length) loadBaseline(baselines)

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
