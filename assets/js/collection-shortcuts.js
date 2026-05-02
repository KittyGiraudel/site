document.addEventListener('DOMContentLoaded', () => {
	const previousLink = document.querySelector(
		'.CollectionNavigation__item--previous .CollectionNavigation__link',
	)
	const nextLink = document.querySelector(
		'.CollectionNavigation__item--next .CollectionNavigation__link',
	)

	function isInternalLink(link) {
		if (!link) return false

		try {
			const url = new URL(link.getAttribute('href'), window.location.href)
			return url.origin === window.location.origin
		} catch {
			return false
		}
	}

	const previousArticleLink = isInternalLink(previousLink) ? previousLink : null
	const nextArticleLink = isInternalLink(nextLink) ? nextLink : null

	if (!previousArticleLink && !nextArticleLink) return

	function isTypingTarget(target) {
		if (!target || target.nodeType !== Node.ELEMENT_NODE) return false
		const el = target
		const tagName = el.tagName

		if (tagName === 'INPUT' || tagName === 'TEXTAREA' || el.isContentEditable) return true

		return false
	}

	document.addEventListener('keydown', event => {
		if (event.defaultPrevented) return
		if (isTypingTarget(event.target)) return

		if (event.key === 'ArrowLeft' && previousArticleLink) {
			event.preventDefault()
			window.location.href = previousArticleLink.href
		} else if (event.key === 'ArrowRight' && nextArticleLink) {
			event.preventDefault()
			window.location.href = nextArticleLink.href
		}
	})
})
