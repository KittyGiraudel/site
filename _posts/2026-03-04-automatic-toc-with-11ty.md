---
title: Automatic Table of Contents with Eleventy
description: A technical walkthrough on how to automatically generate a table of contents for articles.
tags:
  - Eleventy
  - JavaScript
  - HTML
  - Liquid
---

{% assign footnote_every_article = "It’s not exactly true. Articles with a single heading do not get a table of contents, and a few articles got opted out for design reasons." %}

Today, I’ve shipped a nice addition to this website: {% footnoteref "every-article" footnote_every_article %}every article{% endfootnoteref %} now has its own table of contents (→ if you’re on desktop, ↑ if you’re on mobile). Of course it would be unthinkable to do that by hand for hundreds of articles, so we’re going to use some Eleventy goodness.

This is not a novel idea. There are already [plugins](https://github.com/jdsteinbach/eleventy-plugin-toc) and [literature](https://stevenwoodson.com/blog/adding-a-table-of-contents-to-dynamic-content-in-11ty/) on the topic. Yet I wasn’t entirely satisfied with them, so I thought I would give it a go myself. If you would like to see the whole code at once, these changes went through a [pull-request](https://github.com/KittyGiraudel/site/pull/205).

## Overview

Off the bat, there are a few challenges to overcome:

- How do we access the content of the page to be able to extract its headings?
- How do we do the actual extraction out of a HTML string?
- How do we render back our table of contents?

Let’s start with the first question. The page content is available to Liquid layouts via the `content` variable. It’s essentially a string that contains everything rendered below the YAML front-matter of the page rendering the layout. We need to be able to feed that variable to some sort of a function. Fortunately, that’s exactly what [Liquid filters](https://liquidjs.com/filters/overview.html) are!

```liquid
{​% assign toc = content | table_of_contents %}
```

So now we know that we will declare a Liquid filter that returns a table of contents (more on what that actually means later). How do we actually do the data extraction? As we’ve established, `content` is a long string of HTML. We could use regular expressions, but [parsing HTML with regular expressions is a bad idea](https://stackoverflow.com/a/1732454).

Once again, we can reach out to our lord and savior [cheerio](https://cheerio.js.org/)! cheerio is a library to parse and manipulate HTML. We can load our HTML to get a DOM representation, query all our titles, and generate our table of contents from there.

```js
eleventyConfig.addFilter('table_of_contents', html => {
  if (!html || typeof html !== 'string') return []

  const $ = cheerio.load(html, { decodeEntities: false }, false)
  const headings = $('h2, h3, h4').toArray()

  return headings.length < 2 ? [] : buildTocTree($, headings)
})
```

## Rendering the markup

In my initial version, the filter would generate and return the expected HTML. It worked a charm! But it bothered me that we ended up with markup inside the Eleventy configuration. And not just a little bit of markup, there is the table of content section, the list, the list items, sub lists… It would be better if this lived in a Liquid partial, and we passed structured data to that partial instead.

So let’s flip the problem on its head, and start from the HTML we _want_ to render.

```liquid
<!-- toc.liquid -->
{​% if items and items.size > 0 %}
  <aside class="ToC" aria-labelledby="toc">
    <h2 class="ToC__title" id="toc">On this page</h2>
    <ol class="ToC__list">
      ​​{​% for item in items %}
        <li class="ToC__item ToC__item--level{​{ item.level }}">
          <a href="#{​{ item.id }}">{​{ item.text }}</a>
        </li>
      ​{​% endfor %}
    </ol>
  </aside>
{​% endif %}
```

This looks great, but it only covers top-level headings. What about nested sections? What we can do is extract our list itself in another Liquid partial, so we can recursively render it. 🤯

```liquid
<!-- toc_list.liquid -->
{​% if items and items.size > 0 %}
  <ol class="ToC__list{​% unless root %} ToC__list--sublist{​% endunless %}">
    {​% for item in items %}
      <li class="ToC__item ToC__item--level{​{ item.level }}">
        <a href="#{​{ item.id }}">{​{ item.text }}</a>

        {​% if item.children and item.children.size > 0 %}
          {​% include "toc_list.liquid", items: item.children, root: false %}
        {​% endif %}
      </li>
    {​% endfor %}
  </ol>
{​% endif %}
```

We can replace it in our top-level partial as well:

```liquid
<!-- toc.liquid -->
{​% if items and items.size > 0 %}
  <aside class="ToC" aria-labelledby="toc">
    <h2 class="ToC__title" id="toc">On this page</h2>
    {​% include "toc_list.liquid", items: items, root: true %}
  </aside>
{​% endif %}
```

{% callout %}The `root` parameter enables us to add a specific class to nested lists (`ToC__list--sublist`) so we can shift them to the right accordingly. It will also be handy to [make sublists smaller](#deeper-and-smaller).
{% endcallout %}

## Generating the data

Now that we know exactly how we want to render our markup, we can have our filter produce the necessary data. It needs to return an array of objects, each of which with `text`, `id`, `level` and optionally an array of `children` which are shaped identically.

I won’t go too deep into the JavaScript code which isn’t incredibly interesting. It simply transforms a cheerio collection of heading elements into the expected tree-like data.

```js
function buildTocTree($, headings) {
  const tree = []
  let currentL2 = null
  let currentL3 = null

  for (const heading of headings) {
    const data = getHeadingData($, heading)
    if (!data) continue
    const node = { ...data, children: [] }

    if (node.level === 2) {
      tree.push(node)
      currentL2 = node
      currentL3 = null
    } else if (node.level === 3) {
      if (currentL2) currentL2.children.push(node)
      else tree.push(node)
      currentL3 = node
    } else {
      if (currentL3) currentL3.children.push(node)
      else if (currentL2) currentL2.children.push(node)
      else tree.push(node)
    }
  }

  return tree
}

function getHeadingData($, heading) {
  const text = $(heading).text().trim()
  const id = heading?.attribs?.id
  if (!text || !id) return null

  const element = heading?.name ?? ''
  const level = Number(element.match(/^h([1-6])$/i)?.[1] ?? 2)

  return { id, level, text }
}
```

### On accessing `id` attributes

In my first attempt, I noticed that my table of contents didn’t show up because it couldn’t find any heading with an `id` attribute. That’s odd, because I use the native `IdAttributePlugin` plugin from Eleventy:

```js
eleventyConfig.addPlugin(IdAttributePlugin, {
  selector: 'h2,h3,h4',
})
```

And then it dawned on me that both that plugin and my `table_of_contents` filter occurred on the same rendering pass, and not one after the other. In other words, they both act on the same HTML of the page. My filter doesn’t happen _after_, it happens in the same compilation step. So by the time Liquid executes my filter, there is no `id` attribute on the headings yet.

{% assign footnote_line_highlighting = "I have been blogging for 14 years, and using Eleventy since 2020, and I <em>just</em> realised I can highlight specific lines in code blocks. What a time to be alive!" %}

To solve the problem, we can make our filter “figure out” what the headings ID will be. All we have to do is use the exact same logic as the `IdAttributePlugin` plugin, and we will end up with the same identifiers. Eleventy gracefully [highlights its dependency](https://www.11ty.dev/docs/filters/slugify/), so we can install the same one. Then, we need to {% footnoteref "line-highlighting" footnote_line_highlighting %}update{% endfootnoteref %} our `getHeadingData` function to generate the ID from the text.

```js/8
import slugify from 'slugify'

function getHeadingData($, heading) {
  const text = $(heading).text().trim()
  if (!text) return null

  const element = heading?.name ?? ''
  const level = Number((element).match(/^h([1-6])$/i)?.[1] ?? 2)
  const id = heading?.attribs?.id ?? slugify(text)

  return { id, level, text }
}
```

In order to avoid a deviation if Eleventy ever changes its dependency (after all, it’s not a contract), we can pass that same `slugify` function to the `IdAttributePlugin` plugin, to ensure both sides always use the same library.

```js/0,3
import slugify from 'slugify'

config.addPlugin(IdAttributePlugin, {
  slugify,
  selector: 'h2,h3,h4',
})
```

## Design considerations

### Avoid a ToC anchor

As shared in [a recent article](/2026/02/26/nerdy-design-details/), I have [automatic heading anchors](https://github.com/zachleat/heading-anchors).

If rendering the table of contents within that `<heading-anchors>` web component, its own title will have an anchor, which is a bit odd? It’s not a problem per se, but I didn’t really want the table of contents to have its own visible anchor — it felt too meta. There are a few ways to solve it: either render the table of contents outside, or do not use a heading inside the table of contents, or exclude the table of contents’ heading from `<heading-anchors>`. I opted for the latter:

```html/0
<heading-anchors selector="h2:not(#toc), h3, h4" content="§">
  {​% assign toc_items = content | table_of_contents %}
  {​% include "toc.liquid", items: toc_items %}
  {​{ content }}
</heading-anchors>
```

### Float into the layout

From a layout perspective, the table of contents should obviously live near the top of the page, but I didn’t really want it to be full-width. After all, by the nature of its content, it tends to be taller than it is wide. I also wished for it to be a bit to the side, as to not obstruct the main content too much. I considered making it absolutely positioned, or even an off-screen drawer, but it felt a bit over-engineering.

In the end, I pulled out a tool from the early 2000s: a float. Our table of contents lets the body flow around it, and when there is enough screen estate to allow it, it shifts into the margin to take even less space.

```css
@media (min-width: 700px) {
  .ToC {
    float: right;
    max-width: 300px;
    margin-left: 1.5em;
  }
}

@media (min-width: 1140px) {
  .ToC {
    margin-right: -150px;
    margin-bottom: 1.5em;
  }
}
```

### Deeper and smaller

Another minor yet interesting CSS aspect of the component is that it makes really good use of the cascade. I wanted every sub-list to render a bit smaller than the list above it, because headings become less and less important as you go deeper into the outline.

```css
.ToC__list--sublist .ToC__item {
  font-size: 90%;
}
```

That’s it! Every non-top-level `.ToC__item` item reduces its font-size by 10%, which is cumulative with every layer.

## Wrapping up

At the end of the day, that’s a pretty simple approach, but there were quite a few things to consider along the way.

I’m not going to publish this as a plugin because a) I don’t think it solves an unsolved problem and b) I risk creating technical debt to people by being a lousy maintainer. But you should be able to duplicate the approach in your own Eleventy website very easily.
