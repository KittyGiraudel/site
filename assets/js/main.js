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
})
