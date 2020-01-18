---
layout: page
title: Looking for something
excerpt: Search page for all articles aggregated on the blog.
tags:
  - blog
  - search
  - writing
---

In almost 300 posts, I probably have written something at least a bit interesting. What about giving it a search?

{% include components/search.html %}

<script>
document.addEventListener('DOMContentLoaded', function () {
  loadJS('{{ "/assets/js/vendors/jekyll-search.js" | prepend: site.baseurl }}', search)
});

function search () {
  SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: 'data.json',
    searchResultTemplate: '<li class="List__item">\
      <div class="List__item-inner">\
        <span class="List__secondary-content">{date}{guest}{external}</span>\
        <a href="{url}" class="List__primary-content">{title}</a>\
      </div>\
    </li>',
    noResultsText: '<li class="List__item">Sorry, I could not find any result for your search. :( Hey, if you really wanna have results, I suggest looking for “access” or “sass”!</li>'
  });
}
</script>
