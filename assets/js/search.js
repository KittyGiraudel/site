async function loadSearchEntries(source) {
	try {
		const response = await fetch(source)
		if (!response.ok) {
			throw new Error(`Failed to load search data from ${source}`)
		}
		const data = await response.json()
		return Array.isArray(data) ? data : []
	} catch {
		return null
	}
}

class Search {
	static entryMatches(entry, query) {
		const normalizedQuery = query.trim().toLowerCase()
		if (!normalizedQuery) return false

		const terms = normalizedQuery.split(/\s+/)
		const tags = Array.isArray(entry.tags) ? entry.tags : []
		const haystack = [entry.title, entry.url, entry.date, entry.guest, entry.external, ...tags]
			.filter(Boolean)
			.join(' ')
			.toLowerCase()

		return terms.every(term => haystack.includes(term))
	}

	static async from(options) {
		const { source, max = 10, queryParam = 'q', fallbackQueryParam = 'query' } = options
		const entries = await loadSearchEntries(source)
		if (entries === null) return null
		return new Search({ entries, max, queryParam, fallbackQueryParam })
	}

	constructor({ entries, max = 10, queryParam = 'q', fallbackQueryParam = 'query' }) {
		this.entries = entries
		this.max = max
		this.queryParam = queryParam
		this.fallbackQueryParam = fallbackQueryParam
	}

	syncLocationQuery(value) {
		try {
			const url = new URL(window.location.href)
			const trimmed = (value || '').trim()

			if (trimmed) url.searchParams.set(this.queryParam, trimmed)
			else url.searchParams.delete(this.queryParam)

			if (url.toString() !== window.location.href) {
				window.history.replaceState({}, '', url)
			}
		} catch {
			// Fail silently if URL / URLSearchParams / history are unavailable
		}
	}

	readLocationQuery() {
		try {
			const params = new URLSearchParams(window.location.search)
			return params.get(this.queryParam) || params.get(this.fallbackQueryParam) || ''
		} catch {
			return ''
		}
	}

	search(query) {
		const trimmed = String(query ?? '').trim()
		if (!trimmed) return []
		return this.entries.filter(entry => Search.entryMatches(entry, trimmed)).slice(0, this.max)
	}
}

function searchTagHref(tag) {
	return `/tags/${String(tag).toLowerCase().replace(/\s/g, '-').replace(/\./g, '-')}/`
}

function searchViewTransitionName(url) {
	return `post${String(url).replace(/\//g, '-').replace(/-$/, '')}`
}

function formatSearchResultMeta(entry) {
	const date = entry.date ?? ''
	const guest = entry.guest ? ` by ${entry.guest}` : ''
	const externalHost = entry.external ? ` at ${entry.external}` : ''
	return `${date}${guest}${externalHost}`
}

function buildResultFragment(resultTemplate, tagTemplate, entry) {
	const fragment = resultTemplate.content.cloneNode(true)
	const root = fragment.querySelector('li')

	root.querySelector('.List__secondary-content').textContent = formatSearchResultMeta(entry)

	const link = root.querySelector('.List__primary-content')
	link.href = String(entry.url ?? '#')
	link.textContent = String(entry.title ?? '')

	const lang = entry.lang ? String(entry.lang) : ''
	if (lang) {
		link.setAttribute('lang', lang)
		link.setAttribute('hreflang', lang)
	}
	link.style.viewTransitionName = searchViewTransitionName(String(entry.url ?? ''))

	const tagsRoot = root.querySelector('.Tags')
	tagsRoot.replaceChildren()
	const tags = Array.isArray(entry.tags) ? entry.tags : []
	if (tags.length === 0) {
		tagsRoot.hidden = true
	} else {
		tagsRoot.hidden = false
		const sorted = tags.slice().sort((a, b) => a.localeCompare(b))
		for (const tag of sorted) {
			const tagFragment = tagTemplate.content.cloneNode(true)
			const tagLi = tagFragment.querySelector('li')
			const tagLink = tagFragment.querySelector('a')
			tagLink.href = searchTagHref(tag)
			tagLink.textContent = tag
			tagsRoot.appendChild(tagLi)
		}
	}

	return fragment
}

function renderResultRows(resultsList, resultTemplate, tagTemplate, results) {
	const fragment = document.createDocumentFragment()
	for (const entry of results) {
		const built = buildResultFragment(resultTemplate, tagTemplate, entry)
		fragment.appendChild(built.firstElementChild)
	}
	resultsList.replaceChildren(fragment)
}

function showIndexError(indexErrorEl, noResultsEl, resultsList, resultsRegion) {
	resultsRegion.setAttribute('aria-busy', false)
	resultsList.replaceChildren()
	if (indexErrorEl) indexErrorEl.hidden = false
	noResultsEl.hidden = true
}

document.addEventListener('DOMContentLoaded', async () => {
	const input = document.querySelector('#search-input')
	const resultsList = document.querySelector('#search-list')
	const noResultsEl = document.querySelector('#search-empty')
	const indexErrorEl = document.querySelector('#search-error')
	const resultsRegion = document.querySelector('#search-region')
	const resultTemplate = document.querySelector('#search-result-template')
	const tagTemplate = document.querySelector('#search-tag-template')

	if (!input || !resultsList || !noResultsEl || !resultsRegion || !resultTemplate || !tagTemplate) {
		return
	}

	const engine = await Search.from({ source: '/blog/search/data.json', max: 20 })
	if (!engine) return showIndexError(indexErrorEl, noResultsEl, resultsList, resultsRegion)

	resultsRegion.setAttribute('aria-busy', false)

	const applyQuery = query => {
		const raw = String(query ?? '')
		engine.syncLocationQuery(raw)

		if (indexErrorEl && !indexErrorEl.hidden) {
			indexErrorEl.hidden = true
		}

		if (!raw.trim()) {
			resultsList.replaceChildren()
			noResultsEl.hidden = true
			return
		}

		const results = engine.search(raw)

		if (!results.length) {
			resultsList.replaceChildren()
			noResultsEl.hidden = false
			return
		}

		noResultsEl.hidden = true
		renderResultRows(resultsList, resultTemplate, tagTemplate, results)
	}

	// Actually bind the search engine to the input
	input.addEventListener('input', event => {
		applyQuery(/** @type {HTMLInputElement} */ (event.target).value)
	})

	// Prevent submitting the form from reloading the page
	input.closest('form')?.addEventListener('submit', event => event.preventDefault())

	// Restore the initial query from the URL
	const initial = engine.readLocationQuery()
	if (initial) {
		input.value = initial
		applyQuery(initial)
	}
})
