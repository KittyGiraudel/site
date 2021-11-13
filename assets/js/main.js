document.addEventListener('DOMContentLoaded', function () {
  function getLocalValue (key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return null
    }
  }

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

  const savedPreference = getLocalValue('dark-mode')
  const modeToggle = document.querySelector('#dark-mode-toggle')

  // If dark mode has been enabled before (and thus found in local storage), or
  // if there is no stored preference but the operating system is set in dark
  // mode, turn on the dark mode.
  if (
    savedPreference ||
    (
      savedPreference === null &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  ) {
    document.documentElement.classList.add('dark')
    modeToggle.setAttribute('aria-pressed', true)
  }

  // Now that JavaScript is available, make the toggle visible.
  modeToggle.removeAttribute('hidden')

  modeToggle.addEventListener('click', function (event) {
    const toggle = event.target.closest('button')
    const isToggled = JSON.parse(toggle.getAttribute('aria-pressed')) === true

    if (isToggled) {
      document.documentElement.classList.remove('dark')
      toggle.setAttribute('aria-pressed', false)
      localStorage.setItem('dark-mode', false)
    } else {
      document.documentElement.classList.add('dark')
      toggle.setAttribute('aria-pressed', true)
      localStorage.setItem('dark-mode', true)
    }
  })
})
