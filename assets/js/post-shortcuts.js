document.addEventListener('DOMContentLoaded', () => {
  const previousLink = document.querySelector(
    '.CollectionNavigation__item--previous .CollectionNavigation__link',
  )
  const nextLink = document.querySelector(
    '.CollectionNavigation__item--next .CollectionNavigation__link',
  )

  if (!previousLink && !nextLink) return

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

    if (event.key === 'ArrowLeft' && previousLink) {
      event.preventDefault()
      window.location.href = previousLink.href
    } else if (event.key === 'ArrowRight' && nextLink) {
      event.preventDefault()
      window.location.href = nextLink.href
    }
  })
})  