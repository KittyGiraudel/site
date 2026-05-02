const SEARCH_INDEX_URL = '/blog/search/data.json'
const RESULTS_LIMIT = 20
const NO_RESULTS_TEXT = `
  <li class="List__item">
    Sorry, I could not find any result for your search. :( If you really wanna
    have results, I suggest looking for “accessib” or “sass”!
  </li>
`

document.addEventListener('DOMContentLoaded', () => search())

function search() {
	const searchInput = document.getElementById('search-input')
	const resultsContainer = document.getElementById('results-container')

	if (!searchInput || !resultsContainer) return

	const renderTags = tags => {
		if (!Array.isArray(tags)) return ''

		const items = tags
			.slice()
			.sort((a, b) => a.localeCompare(b))
			.map(
				tag => `
        <li class="Tag">
          <a
            class="Tag__link"
            href="/tags/${tag.toLowerCase().replace(/\s/g, '-').replace('.', '-')}/"
          >
            ${tag}
          </a>
        </li>
        `,
			)
			.join('')

		if (!items) return ''
		return `<ul class="Tags NoListMarker">${items}</ul>`
	}

	// Note: the view transition name uses a cheap and bad slugification, which
	// does not match the one used by Liquid/Eleventy. So transitions could defi-
	// nitely fail in that case.
	const renderResult = entry => `
    <li class="List__item">
      <span class="List__secondary-content">${entry.date}${entry.guest}${entry.external}</span>
      <a href="${entry.url}" class="List__primary-content" ${entry.lang ? `lang="${entry.lang}" hreflang="${entry.lang}"` : ''}
				style="view-transition-name: post${entry.url.replace(/\//g, '-').replace(/-$/, '')}">
        ${entry.title}
      </a>
      ${renderTags(entry.tags)}
    </li>
  `

	const entryMatches = (entry, query) => {
		const normalizedQuery = query.trim().toLowerCase()
		if (!normalizedQuery) return false

		const terms = normalizedQuery.split(/\s+/)
		const haystack = [
			entry.title,
			entry.url,
			entry.date,
			entry.guest,
			entry.external,
			...(Array.isArray(entry.tags) ? entry.tags : []),
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase()

		return terms.every(term => haystack.includes(term))
	}

	const performSearch = (entries, query) => {
		if (!query?.trim()) {
			resultsContainer.innerHTML = ''
			return
		}

		const results = entries.filter(entry => entryMatches(entry, query)).slice(0, RESULTS_LIMIT)

		if (!results.length) {
			resultsContainer.innerHTML = NO_RESULTS_TEXT
			return
		}

		resultsContainer.innerHTML = results.map(renderResult).join('')
	}

	function updateURLFromQuery(value) {
		try {
			const url = new URL(window.location.href)
			const trimmed = (value || '').trim()

			if (trimmed) url.searchParams.set('q', trimmed)
			else url.searchParams.delete('q')

			if (url.toString() !== window.location.href) window.history.replaceState({}, '', url)
		} catch {
			// Fail silently if URL / URLSearchParams are not available
		}
	}

	fetch(SEARCH_INDEX_URL)
		.then(response => {
			if (!response.ok) {
				throw new Error(`Failed to load search data from ${SEARCH_INDEX_URL}`)
			}
			return response.json()
		})
		.then(entries => {
			if (!Array.isArray(entries)) return

			// Keep the URL in sync with what the user is typing.
			searchInput.addEventListener('input', event => {
				const query = event.target.value
				updateURLFromQuery(query)
				performSearch(entries, query)
			})

			// Pre-fill and trigger search from query parameter, e.g. ?q=accessibility.
			try {
				const params = new URLSearchParams(window.location.search)
				const query = params.get('q') || params.get('query')

				if (!query) return

				searchInput.value = query
				updateURLFromQuery(query)
				performSearch(entries, query)
			} catch {
				// Fail silently if URLSearchParams is unavailable or something goes wrong.
			}
		})
		.catch(() => {
			resultsContainer.innerHTML = NO_RESULTS_TEXT
		})
}
