'use strict'

function loadJS (src, onload) {
  const firstScript = document.getElementsByTagName('script')[0]
  const script = document.createElement('script')

  script.src = src
  script.async = true

  firstScript.parentNode.insertBefore(script, firstScript)

  if (typeof onload === 'function') {
    script.onload = onload
  }

  return script
}

function $(selector, context) {
  var nodes = (context || document).querySelectorAll(selector)
  if (!nodes.length) return null
  return Array.prototype.slice.call(nodes)
}
