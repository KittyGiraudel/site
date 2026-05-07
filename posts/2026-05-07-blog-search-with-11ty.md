---
title: Blog Search with Eleventy
description: A technical walkthrough into the rework of my Eleventy website search, with a strong focus on semantic markup and accessibility.
image: /assets/images/blog-search-with-eleventy/blog-search-with-11ty-generated.png
tags:
  - Eleventy
  - Accessibility
---

I’ve recently reworked my [search page](/blog/search/), and realised I never wrote about how it works. So let’s have a look into how to set up a blog search in Eleventy.

## Data source

The first thing we need is a data source, which is to say a big list with all our articles, which we can execute our search against. There is no built-in way to do that, but we can have Eleventy generate a JSON file, which we’ll be able to fetch in our frontend.

{% raw %}
```liquid
---
permalink: /blog/search/data.json
eleventyExcludeFromCollections: true
---
{% assign empty_array = '' | split: '' %}
[
  {% for post in collections.posts %}
    {
      "title" : {{ post.data.title | jsonify }},
      "tags"  : {{ post.data.tags | default: empty_array | jsonify }},
      "url"   : {{ post.url | jsonify }},
      "date"  : {{ post.date | date: '%B %e, %Y' | jsonify }}
    } {% unless forloop.last %},{% endunless %}
  {% endfor %}
]
```
{% endraw %}

It’s a bit hacky, but it [does the job well](https://kittygiraudel.com/blog/search/data.json). It renders an array of objects looking like this:

```json
{
	"title" : "Blog Search with Eleventy",
	"tags"  : ["Eleventy", "Accessibility"],
	"url"   : "/2026/05/07/blog-search-with-11ty/",
	"date"  : "May 7, 2026"
}
```

{% callout %}
There is an argument to be made that the data should not contain a formatted date but a serialized date, so that it can be easily parsed and rendered as desired by the consumer. This is a fair point. Letting Liquid do the formatting is just a bit simpler.
{% endcallout %}

## Cooking a search widget

Now, we need a dedicated search widget. You’d think you need nothing but a text field, but there is actually a lot going on to make it semantic and accessible. We’ll go through the code step-by-step to make it more digestible.

### Landmark

We’re going to place it all inside a [`<search>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search) element, which is [widely available](https://caniuse.com/mdn-html_elements_search) in browsers today. To quote Scott O’Hara:

> [O]ne would use the search element to expose the search landmark in the browser’s accessibility API, allowing people using assistive technology, such as screen readers, to discover this content area and allow for quick access to it. Being a “search” landmark, it implicitly indicates that the content one would find within would be related to searching for, or even filtering content (filtering is a ‘searching’ behavior… designers sure do like to use the magnify glass icon interchangeably between these UI controls, at least).  
> — Scott O’Hara in [The search element](https://www.scottohara.me/blog/2023/03/24/search-element.html)

If you are interested in the history behind the `<search>` element and the use of landmark in general, I can recommend reading *[In Quest of Search](https://www.sarasoueidan.com/blog/in-quest-of-search/)* by Sara Soueidan.

### Enforcing JavaScript

First things first, we want to make it clear that JavaScript is necessary to use the search. This can be done with a `<noscript>` element.

```html
<noscript>
	Unfortunately this site has no server-side search available,
	so please enable JavaScript in your browser to be able to
	use the provided search engine.
</noscript>
```

### Search form

Then, we want a proper form with our input. It’s important to remember that the use of the `<search>` element does not negate the need for an actual `<form>`, because that element is really just a landmark for navigational purposes — not a functional container.

```html
<form id="search-form" method="GET">
	<label for="search-input">
		Search blog articles
	</label>
	<input
		type="search"
		id="search-input"
		name="q"
		enterkeyhint="search"
		placeholder="Search blog articles…"
		autofocus
		aria-describedby="search-hint"
		aria-controls="search-region"
	/>
	<p id="search-hint" class="visually-hidden">
		Results appear in the search results section as you type.
	</p>
</form>
```

Note that:

- We use [`type="search"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search) for the `<input>` element.
- We associate the label to the input using the `for` and `id` attributes.
- We name the field `q`, which will be reflected as a query parameter in our URL.
- We use the [`enterkeyhint` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint) to make it more explicit on virtual keyboards.
- We use the `autofocus` attribute, but this is only relevant if the whole point of this page is search.
- We describe the field with an element that mentions results will be filtered as you type, and that element is [visually hidden](/snippets/sr-only-class/) (but doesn’t necessarily have to).
- We use the [`aria-controls` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-controls) to indicate the relationship between the field and our results region, even if support is sparse.

### The results container

Finally, we need a place to render the result of our search.

```html
<section
	id="search-region"
	aria-labelledby="search-title"
	aria-busy="true"
>
	<h2 id="search-title">
		Search results
	</h2>
	<ul
		id="search-results"
		role="list"
		aria-live="polite"
		aria-relevant="additions removals"
	>
		<!-- Results will be inserted here -->
	</ul>
	<p id="search-empty" hidden role="status">
		Unfortunately, no results were found for your search.
	</p>
	<p id="search-error" hidden role="alert">
		The search did not work: refresh the page and try again.
	</p>
</section>
```

Again, note:

- We label the section with a title (which could also be [visually hidden](/snippets/sr-only-class/)).
- We set [`aria-busy="true"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy) by default, and will remove it in JavaScript when the data has loaded.
- We [restore the `list` role on the list](https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html).
- We define [`aria-live="polite"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live) and [`aria-relevant="additions removals"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-relevant) to indicate what is worth announcing to assistive technologies.
- We set up the empty search message as `role="status"` and the error message as `role="alert"`, both hidden. They will be revealed with JavaScript if necessary.

## Wiring it all up with JS

On the JavaScript side, there are quite a few things to do:

1. Fetch all the data from the JSON endpoint, and remove the `aria-busy` attribute once ready, or display the error message if fetching failed.
2. Bind a listener to the field to filter our results as we type (and prevent submitting the form from triggering a page reload).
3. Render the results as desired, or display the empty message if no results were found.

```js
document.addEventListener('DOMContentLoaded', () => {
	// Query all relevant elements
	const $searchRegion = document.querySelector('#search-region')
	const $searchResults = document.querySelector('#search-results')
	const $searchInput = document.querySelector('#search-input')
	const $searchEmpty = document.querySelector('#search-empty')
	const $searchError = document.querySelector('#search-error')

	// Fetch the data
	fetch('/blog/search/data.json')
		.then(response => {
			if (!response.ok)
				throw new Error('Fetching data source failed.')
			else return response.json()
		})
		.then(data => {
			$searchInput.addEventListener('input', event => handleSearch(data, event.target.value))
			// Perform URL sync if desired (see below)
		})
		.catch(error => {
			console.error(error)
			$searchError.removeAttribute('hidden')
		})
		.finally(() => {
			$searchRegion.removeAttribute('aria-busy')
			$searchInput.closest('form')?.addEventListener('submit', event => event.preventDefault())
		})

	function resetState() {
		$searchError.setAttribute('hidden', '')
		$searchEmpty.setAttribute('hidden', '')
		$searchResults.replaceChildren()
	}

	function handleSearch(data, value) {
		resetState()

		const results = filterData(data, value)

		if (value && results.length === 0)
			$searchEmpty.removeAttribute('hidden')
		else
			$searchResults.innerHTML = results.map(renderResult).join('\n')
	}

	function filterData(data, value) {
		if (!value) return []
		// The filtering logic can check more posts and be as simple
		// or complicated as desired
		return data.filter(post => post.title.toLowerCase().includes(value.toLowerCase()))
	}

	function renderResult (result) {
		/* Generate the relevant HTML for a result */
	}
})
```

Here is a small pen to showcase the core functionality in action. Try searching for “Next”, or “Accessible” to produce results, or just gibberish to see the empty state.

{% render "codepen.liquid"
	slug: "yyVYNXX",
	height: 500
%}

### Synchronizing the URL

If we want to be able to link to the search page with a pre-populated search, we can read the query parameter on load and kick off a search based on its value.

```js
const params = new URLSearchParams(window.location.search)
const query = (params.get('q') ?? '').trim()

$searchInput.value = query
updateURLFromQuery(query)
handleSearch(data, query)

function updateURLFromQuery(value) {
	const url = new URL(window.location.href)

	if (value) url.searchParams.set('q', value)
	else url.searchParams.delete('q')

	if (url.toString() !== window.location.href)
		window.history.replaceState({}, '', url)
}
```

## Going further

It works, it’s accessible, but it’s quite rudimentary. There are a few things we can do to make it nicer:

- Configure how many search results should be displayed at most.
- Fine-tune the search so that it yields more accurate predictions (consider more fields, date, etc.). Consider implementing fuzzy matching to catch typos.
- Move the rendering of list items to a [`<template>` element](/2022/09/30/templating-in-html/). Then, instead of defining how a result should be rendered deep inside the JS code, you have the script clone and fill in the template instead. This keeps the view in the view, separated from the logic.
- Split the search engine logic from the DOM binding and manipulation. In my own search page, I use a [`Search` class](https://github.com/KittyGiraudel/site/blob/main/assets/js/search.js), which I interact with in the `DOMContentLoaded` event. This properly separates the actual search engine from the rendering part and DOM interactions.

Anyway, this introduces the core accessible search engine. Up to you to make it yours. :)