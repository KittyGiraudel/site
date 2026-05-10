document.addEventListener('DOMContentLoaded', () => {
	;(function setupSearchShortcut() {
		const searchPath = '/blog/search/'

		function isTypingTarget(target) {
			return Boolean(target?.closest?.('input, textarea, select, [contenteditable]'))
		}

		document.addEventListener('keydown', event => {
			if (event.defaultPrevented) return
			if (!event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
			if (event.key.toLowerCase() !== 'k') return
			if (isTypingTarget(event.target)) return
			if (window.location.pathname === searchPath) return

			event.preventDefault()
			window.location.href = searchPath
		})
	})()

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

		function toggleTheme(event) {
			const button = event.target.closest('.js-theme-button')
			if (!button) return

			const ariaPressed = button.getAttribute('aria-pressed')
			const theme =
				ariaPressed === 'true' ? themes.DARK : ariaPressed === 'false' ? themes.LIGHT : themes.AUTO
			const nextTheme = window.ThemeManager.getNextTheme(theme)

			window.ThemeManager.saveTheme(nextTheme)
			window.ThemeManager.applyTheme(nextTheme)
		}

		themeButton.addEventListener('click', event => {
			if (!document.startViewTransition) return toggleTheme(event)

			const run = () => toggleTheme(event)

			try {
				document.startViewTransition({ types: ['theme'], update: run })
			} catch {
				// Typed transitions are required for :active-view-transition-
				// type(theme) CSS; callback-only form still runs a transition, without
				// the custom root animation.
				document.startViewTransition(run)
			}
		})
	})()

	;(function setupNavigationNotch() {
		const navigation = document.querySelector('.Navigation')
		if (!navigation) return

		const links = Array.from(navigation.querySelectorAll('.Navigation__item > .Navigation__link'))
		if (!links.length) return

		const getCurrentLink = () =>
			navigation.querySelector('.Navigation__item[aria-current] > .Navigation__link') || links[0]

		let currentLink = getCurrentLink()

		const moveNotchTo = link => {
			if (!link) return

			const navigationRect = navigation.getBoundingClientRect()
			const linkRect = link.getBoundingClientRect()
			const notchOffset =
				parseFloat(getComputedStyle(navigation).getPropertyValue('--notch-offset')) || 0
			const notchWidth = Math.round(linkRect.width + notchOffset * 2)
			const notchScale = navigationRect.width ? notchWidth / navigationRect.width : 0

			navigation.style.setProperty(
				'--notch-start',
				`${Math.round(linkRect.left - navigationRect.left)}px`,
			)
			navigation.style.setProperty('--notch-scale', notchScale.toString())
			navigation.style.setProperty('--notch-opacity', '1')
			currentLink = link
		}

		moveNotchTo(currentLink)

		links.forEach(link => {
			link.addEventListener('pointerenter', () => moveNotchTo(link))
			link.addEventListener('focus', () => moveNotchTo(link))
		})

		navigation.addEventListener('pointerleave', () => moveNotchTo(getCurrentLink()))
		navigation.addEventListener('focusout', event => {
			if (!event.relatedTarget || !navigation.contains(event.relatedTarget)) {
				moveNotchTo(getCurrentLink())
			}
		})

		window.addEventListener('resize', () => moveNotchTo(currentLink))
	})()

	window.ThemeManager.mount()
})
