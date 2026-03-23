---
title: Heading Anchors with Eleventy
description: A technical walkthrough about replacing runtime JavaScript to create heading anchors.
tags:
  - Eleventy
  - UX
---

When working on the design of this site a few weeks ago, I [added back heading anchors](https://kittygiraudel.com/2026/02/26/nerdy-design-details/#heading-anchors). Not wanting to think too much about it in the midst of all the things I was doing at the time, I decided to use the fantastic [heading-anchors](https://github.com/zachleat/heading-anchors) web component by Zach Leat, the creator of Eleventy.

I was working on something else the other day, and realised I didn’t really need to execute runtime JavaScript to create automatic link for each heading. Everything is available at build time: the headings, their `id` attribute, the DOM, etc. Surely I could do it with Eleventy directly.

{% callout %}
This post is by no means a diss on `<heading-anchors>`. As I said, it’s a very well put together component. It works a charm, it’s well thought through, and it’s very lightweight overall. If you’re going to remove a run time dependency from your website, this one shouldn’t be at the top of your list.
{% endcallout %}

## Overview

I knew the insertion of HTML had to happen as a post-build transform. It’s not something I want to handle manually in my Markdown files, so it needs to be done automatically during a build. This is what [Eleventy Transforms](https://www.11ty.dev/docs/transforms/) are for.

The core logic for the transform is relatively straightforward: only process blog posts; in each blog post, find all the headings (using [cheerio](https://cheerio.js.org/)), and insert the relevant markup — the same way `<heading-anchors>` does.

## Eleventy transform

This is the code for the transform, extracted in its own file for clarity and convenience.

```js
import * as cheerio from 'cheerio'

// This implementation is heavily inspired from <heading-anchors>
// See: https://github.com/zachleat/heading-anchors
function injectHeadingAnchors(content, outputPath) {
  if (typeof outputPath !== 'string' || !outputPath.endsWith('.html'))
    return content

  // This is a little fragile, but it’s also okay. It’s just intended as
  // a heuristic to avoid loading the content in cheerio if we’re not in
  // an article. It’s purely a performance optimization.
  if (
    !content.includes('class="Post"') &&
    !content.includes('itemprop="articleBody"')
  ) {
    return content
  }

  // Load the HTML content into a virtual DOM with cheerio
  const $ = cheerio.load(content, { decodeEntities: false }, true)

  // Keep an internal index for anchors
  let anchorIndex = 0

  // Find all headings we want an anchor for
  $('.Post :is(h2, h3, h4)[id]:not([data-ha-exclude])').each((_, el) => {
    const $heading = $(el)
    const text = $heading.text().trim()
    const anchorName = `--ha_0_${anchorIndex++}`
    const id = $heading.attr('id')

    const anchor = $(
      `<a
        class="ha"
        href="#${id}"
        style="position-anchor: ${anchorName};">
        <span class="visually-hidden">Jump to section titled: ${text}</span>
        <span aria-hidden="true">§</span>
      </a>`,
    )
    const placeholder = $(
      `<span
        class="ha-placeholder"
        aria-hidden="true"
        style="anchor-name: ${anchorName};">§</span>`,
    )

    $heading.append(placeholder)
    $heading.after(anchor)
  })

  return $.html()
}

export default injectHeadingAnchors
```

That’s basically all it takes. Find all the headings, inject the placeholder for the anchor, and then the actual anchor after the heading. Check the following sources to better understand the core logic for positioning and anchoring:

- [heading-anchors by Zach Leat](https://github.com/zachleat/heading-anchors)
- [heading-anchors by David Darnes](https://github.com/daviddarnes/heading-anchors)
- _[Are your Anchor Links Accessible?](https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/)_ by Amber Wilson (with whom I worked for many years may I add — hi Amber! 😊)

## Styling and fallback

A benefit of rolling it out on my own is that there is a lot of logic I no longer need. For instance `<heading-anchors>` would look into stylesheets to find font styles of the headings in order to apply them to the anchor element. Being in full control of the styles, I don’t need any of this and can just apply what’s needed only:

```css
.ha { font-weight: bold }
h2 + .ha { font-size: 1.5em }
h3 + .ha { font-size: 1.17em }
```

One thing this solution _cannot_ do is an exact fallback when the `anchor-name` property is not supported. The `<heading-anchors>` component does that very elegantly: if the browser lacks support, it falls back to absolutely positioning the element based on the top and left offset of the heading on the page. This only works when you can access these offsets, which is not possible with cheerio which is a headless virtual DOM.

As a fallback, I came up with some styles that work _for this website specifically_ since it’s all that matters and I’m not building a generic solution:

```css
@supports (anchor-name: none) {
  .ha {
    left: anchor(left);
    top: anchor(top);
  }
}

@supports not (anchor-name: none) {
  /**
   * 1. Fallback positioning in the gutter for browsers
   *    that don’t support CSS anchor positioning.
   */
  .ha {
    transform: translate(-1.1em, -2.05em); /* 1 */
    opacity: 0.5;
    position: absolute;
  }

  .ha-placeholder {
    display: none;
  }
}
```

This is how it looks in a browser that doesn’t support anchor positioning:

<p style="font-size: 1.17em; font-weight: bold; margin-bottom: var(--vb-third);" id="demo-title">Demo title</p>
<a class="ha" href="#demo-title" style="transform: translate(-1.1em, -2.05em);opacity: 0.5; font-size: 1.17em;">
  <span class="visually-hidden">Jump to section titled: Demo title</span>
  <span aria-hidden="true">§</span>
</a>

It’s not perfect, but it’s definitely good enough. Moreover, CSS Anchor Positioning is now [available across major browsers](https://caniuse.com/css-anchor-positioning) ([Baseline 2026](https://web-platform-dx.github.io/web-features/)) — and given the audience for this blog, chances are high that your browser handles CSS anchors just fine.

## Wrapping up

What I appreciate about having a small li’l personal website is that it can be lightweight and fast. A typical blog post clocks at about 25Kb _in total_. I need so little CSS and JavaScript that I actually [inline them instead of linking scripts and stylesheets](/2020/12/03/inlining-scripts-and-styles-in-11ty/).

I’m happy getting to remove one more dependency, even if it was genuinely a good one.
