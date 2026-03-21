// biome-ignore lint/correctness/noUnusedVariables: available on the global scope
function loadJS(src, onload, attributes = {}) {
  const firstScript = document.getElementsByTagName('script')[0]
  const script = document.createElement('script')

  script.src = src
  script.async = true

  for (const [key, value] of Object.entries(attributes)) {
    if (value === null || value === undefined) continue

    // Some attributes need to be assigned as properties rather than setAttribute.
    if (key === 'crossOrigin' || key === 'crossorigin') {
      script.crossOrigin = String(value)
      continue
    }

    script.setAttribute(key, String(value))
  }

  firstScript.parentNode.insertBefore(script, firstScript)

  if (typeof onload === 'function') {
    script.onload = onload
  }

  return script
}
