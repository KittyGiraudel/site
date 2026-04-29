function buildScript(src, onload, attributes = {}) {
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

	if (typeof onload === 'function') {
		script.onload = onload
	}

	return script
}

// biome-ignore lint/correctness/noUnusedVariables: available on the global scope
function loadJS(src, onload, options = {}) {
	const script = buildScript(src, onload, options.attributes)

	if (options.insert) options.insert(script)
	else {
		const firstScript = document.getElementsByTagName('script')[0]
		firstScript.parentNode.insertBefore(script, firstScript)
	}
}
