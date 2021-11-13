document.addEventListener('DOMContentLoaded', function () {
  // http://joelcalifa.com/blog/revisiting-visited
  ;(function markVisitedLinks() {
    localStorage.setItem('visited-' + window.location.pathname, true)
    ;($('.Main a') || []).forEach(function (link) {
      if (
        link.host === window.location.host &&
        localStorage.getItem(
          'visited-' + link.pathname + link.pathname.endsWith('/') ? '' : '/'
        )
      )
        link.dataset.visited = true
    })
  })()

  const modeToggle = document.querySelector('#dark-mode-toggle')
  const savedState = JSON.parse(localStorage.getItem('dark-mode') || 'false')

  document.documentElement.classList[savedState ? 'add' : 'remove']('dark')
  modeToggle.setAttribute('aria-pressed', savedState)
  modeToggle.removeAttribute('hidden')

  modeToggle.addEventListener('click', function (event) {
    const target = event.target.closest('button')
    const current = JSON.parse(target.getAttribute('aria-pressed')) === true

    if (current) {
      document.documentElement.classList.remove('dark')
      target.setAttribute('aria-pressed', false)
      localStorage.setItem('dark-mode', false)
    } else {
      document.documentElement.classList.add('dark')
      target.setAttribute('aria-pressed', true)
      localStorage.setItem('dark-mode', true)
    }
  })
})
