---
title: Injecting element in Liquid content
description: A technical write-up on how to find a specific spot within a Liquid post content to inject an element.
tags:
  - JavaScript
  - Liquid
  - HTML
templateEngineOverride: md
---

Yesterday, I published a post on [design tweaks](/2026/02/26/nerdy-design-details/) I have applied to this website. One thing I’ve improved is the ad placement. Yet, I was still not fully satisfied with how it worked, so I spent more time coming up with a better solution.

## Context

Historically, I used to rend the ad right below the page title. It wasn’t very elegant, and it left a weird gap when using an ad-blocker. I’ve embedded the ad in a small UI component that fits nicely within the content of the page instead, so that it’s less jarring and in your face.

In my first pass, I rendered it at the top of the article. It’s fine, it works, but what I wanted was to insert it *after* the first content block (like the first paragraph). As explained in the other article, I found a hacky solution with Liquid:

```liquid
{% assign parts = content | split: "</p>" %}
{{ parts | first }}</p>

{% include "ad.html" %}

{% for part in parts offset: 1 %}
  {{ part }}{% unless forloop.last %}</p>{% endunless %}
{% endfor %}
```

This splits the content on `</p>` closing tags, renders the first one (plus its now missing `</p>` closing tag), then inject the ad component, and then iterate over each remaining content chunk, rendering them one by one with their missing `</p>` closing tag. It works, but it’s a bit ugly.

## The problem

Besides the code smell, there was another problem with this implementation: a lot of articles start with a little callout widget. That widget render an `<aside>` element with content inside. That content can contain (and probably will contain) paragraphs. So what would happen is that it would render the ad within the callout, which looks awkward and is unexpected.

Beyond these cases, articles could also start with something like a table of contents (`<ol>`) or a citation (`blockquote`), or something else. It would be good to have a more generic solution.

I’ve quickly come to realise that sticking to Liquid for that is not going to work. My requirements are a little too complex for such a simple templating language.

## Custom filter

The nice thing about Eleventy is that you can write your own Liquid filters in plain JavaScript. I’m already using [a lot of custom Liquid filters](https://github.com/KittyGiraudel/site/blob/main/.eleventy.js#L55-L83), so I was confident I could make it work.

What if we created a filter that splits the content into 2 parts: the first content block on the page, and then the rest of the article. This way, we can inject the ad right between the two.

```liquid
{% assign parts = content | split_content %}
{{ parts[0] }}
{% include "ad.html" %}
{{ parts[1] }}
```

```js
config.addFilter('split_content', splitContent)
```

So here is the approach: find the first top-level element within the content section, and split there. Return that element on its own, and the rest of the content after it. 

Liquid doesn’t have a concept of HTML or DOM element though. It just renders strings of text. And I really didn’t want to start parsing HTML by hand with regular expressions.

### Cheerio to the rescue!

I am amazed at how many times I’ve reached for [Cheerio](https://cheerio.js.org/) over the years. If you’re not familiar with it, it’s a rock solid library to manipulate HTML with jQuery-style selectors. The cool thing about Cheerio is that it doesn’t need a browser, it can run just fine on Node.js. You feed it a HTML string, it gives you a DOM tree that you can manipulate, and you can spit out some HTML back.

So here is the plan: load our HTML in Cheerio, find the first top-level element, split the top-level collection of nodes there, and serialize both collections back to HTML strings.

```js
/**
 * Split the content into 2 parts: the first content block on the page,
 * and then the rest of the article. This way, we can inject the ad right
 * between the two.
 * @param {string} html - The HTML string to split
 *                        (typically `content` variable from Liquid)
 * @returns {[string, string]} A tuple of the first content block and
 *                             the rest of the article.
 */
function splitContent(html) {
  if (!html || typeof html !== 'string') return ['', '']

  const $ = cheerio.load(html, { decodeEntities: false }, false)

  const nodes = $.root().contents().toArray()
  const index = nodes.findIndex(node => node.type === 'tag')

  if (index === -1) return ['', html]

  const beforeNodes = nodes.slice(0, index + 1)
  const afterNodes = nodes.slice(index + 1)

  return [serialize(beforeNodes), serialize(afterNodes)]
}

function serialize(nodeArray) {
  return nodeArray
    .map(node => $.html(node))
    .map(out => typeof out === 'string' ? out : '')
    .join('')
}
```

It’s important to initialize Cheerio in [fragment mode](https://cheerio.js.org/docs/advanced/configuring-cheerio/#fragment-mode), so that it doesn’t automatically inject `<html>` and `<body>` elements. That’s what the third argument is (`isDocument: false`).

## Wrapping up

I went through about a hundred articles, and it seems fine so I guess it’s a good enough solution. The only drawback I could find out is that the filter takes time, which can add up when compiling hundreds of pages. It’s still acceptable for me, with about 2s for 450 pages.

```
[11ty] Benchmark    228ms  10%   397× (Configuration) "split_content" Liquid Filter
[11ty] Copied 225 Wrote 449 files in 2.18 seconds (4.8ms each, v3.1.2)
[11ty] Benchmark    322ms  14%   397× (Configuration) "split_content" Liquid Filter
[11ty] Copied 225 Wrote 449 files in 2.31 seconds (5.1ms each, v3.1.2)
[11ty] File changed: ./_posts/2026-02-27-injecting-element-in-liquid-content.md
[11ty] Benchmark    247ms  13%   397× (Configuration) "split_content" Liquid Filter
[11ty] Copied 225 Wrote 449 files in 1.92 seconds (4.3ms each, v3.1.2)
[11ty] File changed: ./_posts/2026-02-27-injecting-element-in-liquid-content.md
[11ty] Benchmark    238ms  12%   397× (Configuration) "split_content" Liquid Filter
[11ty] Copied 225 Wrote 449 files in 1.97 seconds (4.4ms each, v3.1.2)
[11ty] File changed: ./_posts/2026-02-27-injecting-element-in-liquid-content.md
[11ty] Benchmark    235ms  12%   397× (Configuration) "split_content" Liquid Filter
[11ty] Copied 225 Wrote 449 files in 1.99 seconds (4.4ms each, v3.1.2)
```

Anyway, I hope it helps in case you need to do something similar. Take care!