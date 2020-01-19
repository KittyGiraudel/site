;(function(global) {
  var ADS_URL = '//engine.carbonads.com/z/24598/azcarbon_2_1_0_HORIZ'
  var CODEPEN_URL = '//codepen.io/assets/embed/ei.js'
  var SASSMEISTER_URL = '//cdn.sassmeister.com/js/embed.js'

  function $(selector, context) {
    var nodes = (context || document).querySelectorAll(selector)
    if (!nodes.length) return null
    if (nodes.length === 1) return nodes[0]
    return Array.prototype.slice.call(nodes)
  }


  // http://joelcalifa.com/blog/revisiting-visited
  function markVisitedLinks () {
    localStorage.setItem('visited-' + window.location.pathname, true);
    var links = $('.Main a');

    for (i = 0; i < links.length; i += 1) {
      var link = links[i];
      var trailingSlash = link.pathname.endsWith('/') ? '' : '/'

      if (
        link.host === window.location.host &&
        localStorage.getItem('visited-' + link.pathname + trailingSlash)
      ) {
        link.dataset.visited = true;
      }
    }
  }

  function loadAds(callback) {
    loadJS(ADS_URL, callback)
  }

  function loadCodePen(callback) {
    $('.codepen') && loadJS(CODEPEN_URL, callback)
  }

  function loadSassMeister(callback) {
    $('.sassmeister') && loadJS(SASSMEISTER_URL, callback)
  }

  function loadApp() {
    loadAds()
    loadSassMeister()
    loadCodePen()
    markVisitedLinks()
  }

  global.loadApp = loadApp
})(window)
