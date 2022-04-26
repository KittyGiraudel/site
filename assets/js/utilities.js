'use strict'

function loadJS(src, onload) {
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
