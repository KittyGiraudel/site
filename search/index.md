---
layout: page
theme: t-pink
title: "Looking for something"
excerpt: "Search page for all articles aggregated on the blog."
tags:
  - blog
  - search
  - writing
---

In over 200 posts, I probably have written something at least a bit interesting. What about giving it a search?

<noscript>Unfortunately this site has no server-side search available, so please enable JavaScript in your browser to be able to use the provided search engine. Or you could give <a href="https://cse.google.com/cse/publicurl?cx=009396935484082696627:sfmsndgcu2q" target="_blank">a try</a>.</noscript>

<div class="search-container" id="search-container">
  <label for="search-input" class="search-label visually-hidden">Search</label>
  <input type="text" id="search-input" class="search-input" placeholder="Search..." role="search" autofocus>
  <ul id="results-container" class="search-results  articles  list"></ul>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
  loadJS('{{ "/assets/js/vendors/jekyll-search.js" | prepend: site.baseurl }}', search)
});

function search () {
  SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: 'data.json',
    searchResultTemplate: '<li class="list__item">\
      <div class="list__item-inner">\
        <p class="list__secondary-content">{date}{guest}{external}</p>\
        <p class="list__primary-content">\
          <a href="{url}">{title}</a>\
        </p>\
      </div>\
    </li>',
    noResultsText: '<li class="list__item">Sorry, I could not find any result for your search. :( Hey, if you really wanna have results, I suggest looking for "sass"!</li>'
  });
}
</script>
