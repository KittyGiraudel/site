;(function (global) {
  function $(selector, context) {
    var nodes = (context || document).querySelectorAll(selector)
    if (!nodes.length) return null
    return Array.prototype.slice.call(nodes)
  }

  // http://joelcalifa.com/blog/revisiting-visited
  function markVisitedLinks() {
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
  }

  global.loadApp = function () {
    loadJS('//engine.carbonads.com/z/24598/azcarbon_2_1_0_HORIZ')
    $('.sassmeister') && loadJS('//cdn.sassmeister.com/js/embed.js')
    $('.codepen') && loadJS('//codepen.io/assets/embed/ei.js')
    markVisitedLinks()
  }
})(window)
