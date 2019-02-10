;(function(global) {
  var ANALYTICS_URL = '//www.google-analytics.com/ga.js'
  var ADS_URL = '//engine.carbonads.com/z/24598/azcarbon_2_1_0_HORIZ'
  var CODEPEN_URL = '//codepen.io/assets/embed/ei.js'
  var SASSMEISTER_URL = '//static.sassmeister.com/js/embed.js'
  var ANALYTICS_OPTIONS = [['_setAccount', 'UA-30333387-2'], ['_trackPageview']]

  function $(selector, context) {
    var nodes = (context || document).querySelectorAll(selector)
    if (!nodes.length) return null
    if (nodes.length === 1) return nodes[0]
    return Array.prototype.slice.call(nodes)
  }

  function loadAnalytics(callback) {
    global._gaq = ANALYTICS_OPTIONS
    loadJS(ANALYTICS_URL, callback)
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

  function App(options) {
    loadAnalytics()
    loadAds()
    loadSassMeister()
    loadCodePen()
  }

  global.App = App
})(window)
