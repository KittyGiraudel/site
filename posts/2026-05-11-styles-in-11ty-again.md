---
title: Styles in Eleventy (Again)
description: A technical walkthrough on how I heavily optimized (and some would argue over-engineered) the CSS loading path on this Eleventy website.
tags: 
  - Eleventy
  - Liquid
image: /assets/images/styles-in-11ty-again/styles-in-eleventy-again.png
---

I have written about how I [load styles on this website](/2020/12/03/inlining-scripts-and-styles-in-11ty/) in the past. I have recently revisited this approach, came up with new questions, new answers and learnt things along the way. I thought this would warrant an article.

## What’s so difficult anyway?

Eleventy has some [documentation on how to load styles](https://www.11ty.dev/docs/assets/#use-an-eleventy-template). A clever approach is to leverage Eleventy as a generator, and have a Liquid template output to a CSS file. Include all your different styles inside that template, and you get one master stylesheet with everything in it — easy peasy.

{% raw %}
```liquid
---
permalink: /assets/css/bundle.css
---
{% include "header.css" %}
{% include "footer.css" %}
{% include "./node_modules/my-fictitious-package-name/package.css" %}
```
{% endraw %}

There are a few things I don’t like about this approach:

1. This ends up loading *all* the styles, regardless of whether they’ll be used at all. Home showcase, CodePen wrappers, resume layout, blockquote, code blocks… Everything goes, even if only a fraction of them are needed on a given page.
2. It uses an external stylesheet. When there are only a few styles — like on this site — it may be beneficial to inline them using `<style>` elements instead, to save on an HTTP request. 

Let’s see how we can address both problems, one at a time.

## Including necessary styles only

Having worked on more complex applications over the last decade, particularly written in React, I have adopted a component-driven architecture for this website as well — even though Liquid is terribly ill-suited for that.

I have a bunch of “components” in my [`includes` folder](https://www.11ty.dev/docs/config/#directory-for-includes), which I can include using the {% raw %}`{% render %}`{% endraw %} shortcode.

{% callout %}
The main difference between {% raw %}`{% render %}`{% endraw %} and {% raw %}`{% include %}`{% endraw %} is that the former is properly encapsulated so that the outer scope doesn’t leak into it. The only values it has access to are the ones you pass to it. As a result, it’s more explicit, and less likely to have side-effects.
{% endcallout %}

For instance, if I want to render an image, I do something like this:

{% raw %}
```liquid
{% render "figure.liquid",
	src: "/assets/images/my-image.png",
	alt: "The alternative text for my image",
	caption: "The visible caption for my image"
%}
```
{% endraw %}

The `figure.liquid` partial looks like this:

{% raw %}
```html
<figure class="Figure">
  <img src="{{ src }}" alt="{{ alt }}" loading="lazy">
  <figcaption>{{ caption }}</figcaption>
</figure>
```
{% endraw %}

Now, onto including the styles for the figure component. The simplest approach is to render a `<link>` element that loads the stylesheet containing the styles for the figure component inside the partial itself.

{% raw %}
```html
<link rel="stylesheet" href="/assets/css/components/figure.css">

<figure class="Figure">
  <img src="{{ src }}" alt="{{ alt }}" loading="lazy">
  <figcaption>{{ caption }}</figcaption>
</figure>
```
{% endraw %}

There are two problems with that approach:

1. It renders a `<link>` element in the `<body>` instead of the `<head>` which is unconventional, if not problematic. You could argue this won’t be a problem when we render `<style>` elements (our problem #2), but still.
2. If you render multiple figures within the same page, the stylesheet will be included multiple times. I am pretty sure browsers will end up loading that stylesheet only once, but a) I didn’t test it and cannot guarantee it and b) this may vary from browser to browser.

## Deduplicating stylesheets

What we’d like to do is to only preserve a single occurrence of each stylesheet. To do that, we can use [Eleventy’s post-processing capabilities](https://www.11ty.dev/docs/transforms/), and [cheerio](https://cheerio.js.org/) to manipulate the HTML. The logic goes like this:

1. Find all the stylesheets rendered in the `<body>`.
2. For each one, consider its `href` attribute.
3. If we haven’t seen it yet, move that stylesheet into the `<head>`, and mark as seen.
4. If we have seen it already, simply remove that duplicate stylesheet.

```js
eleventyConfig.addTransform('styles', (content, outputPath) => {
	if (typeof outputPath !== 'string' || !outputPath.endsWith('.html')) return content

	const $ = cheerio.load(content)
	const $head = $('head')
	const cache = new Set<string>()

	$('body link[rel="stylesheet"]').each((_, el) => {
		const $el = $(el)
		const key = $el.attr('href')
		const $stylesheet = $el.remove()
		
		if (!cache.has(key)) {
			$head.append($stylesheet)
			cache.add(key)
		}
	})

	return $.html()
})
```

This works a charm: for each of our components, like `figure.liquid`, we end up with a single stylesheet in the document `<head>`, whether it was rendered once or multiple times. 

{% assign footnote_base_stylesheet = "You can have a “base” stylesheet with things that are common to all pages, like typography styles, utility classes, theming, and more." %}

Doing that for each of our layout parts and components, we can make sure that we {% footnoteref "base-stylesheet" footnote_base_stylesheet %}only render what’s needed on the page{% endfootnoteref %}. 

That’s our first problem solved. Onto problem #2.

## Inlining styles for performance

Second problem we originally outlined: we want to actually render `<style>` elements instead of external stylesheets to save on HTTP requests. Note that this is only worth it if you have less than ~10Kb worth of styles on a given page. Anything bigger than that and you are better off having an external stylesheet.

It’s not too hard to adapt our existing code: 

- Instead of rendering a `<link>`, we can render a `<style>` element with the relevant styles inside.
- When deduping, we need to consider `<style>` elements, which we can mark with an attribute for clarity.

{% raw %}
```html
{%- capture css -%}
{%- include "../assets/css/components/figure.css" -%}
{%- endcapture -%}

<style data-href="/assets/css/components/figure.css">{{ css }}</style>

<figure class="Figure">
  <img src="{{ src }}" alt="{{ alt }}" loading="lazy">
  <figcaption>{{ caption }}</figcaption>
</figure>
```
{% endraw %}

Let’s update our post-processing function so it handles both external stylesheets and `<style>` elements:

```js
eleventyConfig.addTransform('styles', (content, outputPath) => {
	if (typeof outputPath !== 'string' || !outputPath.endsWith('.html')) return content

	const $ = cheerio.load(content)
	const $head = $('head')
	const cache = new Set<string>()
	const $styles = $('body :is(link[rel="stylesheet"], style[data-href])')

	$styles.each((_, el) => {
		const $el = $(el)
		const key = $el.attr('data-href') || $el.attr('href')
		const $style = $el.remove()
		
		if (!cache.has(key)) {
			$head.append($style)
			cache.add(key)
		}
	})

	return $.html()
})
```

Solved! Now we have colocated styles with each of our interface components *and* inlined styles to only render what’s necessary.

## Optimizing the watch mode

A third bonus problem arose: using inline styles means that Eleventy recompiles *all* your pages when you save a CSS file, which can be quite slow.

A solution I found is to still render external stylesheets in development, and inline styles in production. This way, the Eleventy dev server can just hot-reload linked stylesheets when saving a CSS file instead of needlessly recompiling HTML pages.

This is doable in Liquid, but it’s quite inconvenient. We would need to pass the current environment to every single one of our Liquid partials to decide whether we render a `<link>` or `<style>`. It’s tedious.

I’ve decided to move this logic in JavaScript in a custom Liquid shortcode. It looks like this:

```js
eleventyConfig.addShortcode('styles', (partial) => {
	const href = `/assets/css/${partial}.css`

	if (process.env.NODE_ENV === 'development') {
		return `<link rel="stylesheet" href="${href}">`
	}

	const filePath = path.join(process.cwd(), href)
	const css = readFileSync(filePath, 'utf8')

	return `<style data-href="${href}">${css}</style>`
})
```

We can then use it like this:

{% raw %}
```liquid
{% styles "components/figure" %}
```
{% endraw %}

{% callout %}
An alternative to relying on the `NODE_ENV` environment variable is to use the `ELEVENTY_RUN_MODE` environment variable from Eleventy, and render `<style>` in `build` mode, or stylesheets otherwise (`watch` or `serve`).
{% endcallout %}

## Wrapping up

If you’ve gone this far, well done and thank you! It feels complicated, but ultimately it’s not too bad once you get the hang of it. It was a bit of fiddling and boilerplate to make it work, but once it’s set up, it’s only a matter of using the {% raw %}`{% styles %}`{% endraw %} shortcode everywhere.

Also, this is only really necessary if you want to optimize the heck out of your CSS loading strategy: it’s totally fine to just put all your styles in the stylesheet and load that. 

It’s worth pointing out that the exact same thing can be done for scripts, for the exact same reasons. To make it work, simply duplicate the whole logic for `<script>` elements.

I hope this was interesting and helped. :)