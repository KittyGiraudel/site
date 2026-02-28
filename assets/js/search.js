document.addEventListener('DOMContentLoaded', () => {
  loadJS('/assets/js/vendors/jekyll-search.js', search)
})

function search() {
  var searchInput = document.getElementById('search-input')
  var resultsContainer = document.getElementById('results-container')

  var sjs = SimpleJekyllSearch({
    searchInput: searchInput,
    resultsContainer: resultsContainer,
    json: '/blog/search/data.json',
    limit: 20,
    fuzzy: false,
    templateMiddleware: (prop, value) => {
      if (prop === 'tags') {
        return `<ul class="List__tags">
          ${value
            .sort((a, b) => a.localeCompare(b))
            .map(tag => `<li class="List__tag">
              <a href="/tags/${tag.toLowerCase().replace(/\s/g, '-')}">${tag}</a>
            </li>`)
            .join('')
        }
        </ul>`
      }
    },
    searchResultTemplate:
      '<li class="List__item">\
      <span class="List__secondary-content">{date}{guest}{external}</span>\
      <a href="{url}" class="List__primary-content" lang="{lang}" hreflang="{lang}">{title}</a>\
      {tags}\
    </li>',

    noResultsText:
      '<li class="List__item">Sorry, I could not find any result for your search. :( Hey, if you really wanna have results, I suggest looking for “accessib” or “sass”!</li>',
  })

  function updateURLFromQuery(value) {
    try {
      const url = new URL(window.location.href)
      const trimmed = (value || '').trim()

      if (trimmed) url.searchParams.set('q', trimmed)
      else url.searchParams.delete('q')

      if (url.toString() !== window.location.href) window.history.replaceState({}, '', url)
    } catch (e) {
      // Fail silently if URL / URLSearchParams are not available
    }
  }

  if (searchInput) {
    // Keep the URL in sync with what the user is typing
    searchInput.addEventListener('input', event => {
      updateURLFromQuery(event.target.value)
    })
  }

  // Pre-fill and trigger search from query parameter, e.g. ?q=accessibility
  try {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('q') || params.get('query')

    if (query && searchInput) {
      searchInput.value = query
      updateURLFromQuery(query)
      setTimeout(() => sjs.search(query), 100)
    }
  } catch (e) {
    // Fail silently if URLSearchParams is unavailable or something goes wrong
  }
}
