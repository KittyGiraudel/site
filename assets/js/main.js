;(function(global) {
  var ADS_URL = '//engine.carbonads.com/z/24598/azcarbon_2_1_0_HORIZ'
  var CODEPEN_URL = '//codepen.io/assets/embed/ei.js'
  var SASSMEISTER_URL = '//static.sassmeister.com/js/embed.js'

  function $(selector, context) {
    var nodes = (context || document).querySelectorAll(selector)
    if (!nodes.length) return null
    if (nodes.length === 1) return nodes[0]
    return Array.prototype.slice.call(nodes)
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
  }

  global.loadApp = loadApp
})(window)
