---
title: CSS-only bottom-anchored scrolling area
---

Well, that title is a mouthful. This post will be short and sweet though.

Imagine you have a scrollable area that displays chronological content like a feed (but not like LinkedIn, Facebook or Twitter which are reverse-chronological), similar to a chat window. You want the region to be scrolled to the bottom to begin with, which is where the relevant content is.

## With JavaScript

You could do it with JavaScript, like this:

```js
const region = document.querySelector('.my-region')
region.scrollTop = region.scrollHeight
```

But you know, using JavaScript means it can fail, or can take a while to happen, potentially at a point where the user has begun scrolling in that region. Not perfect.

## With CSS

Another approach is to do it with CSS. The idea is to use a _reverse-column_ flex layout so the scroll begins bottom-anchored. Of course, this reverses the order of elements, so they need to be also reversed in the DOM so they are displayed in the right order (elements near the bottom need to appear first in the DOM order).

<p class="codepen" data-height="350" data-default-tab="html,result" data-slug-hash="ZEPgJEM" data-user="KittyGiraudel" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/KittyGiraudel/pen/ZEPgJEM">
  Untitled</a> by Kitty Giraudel (<a href="https://codepen.io/KittyGiraudel">@KittyGiraudel</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## A note on accessibility

One thing worth mentioning is that using `column-reverse` creates a disconnect between the visual order and the DOM order, which can be confusing for screen-reader users. For someone using a screen-reader, the first element in the DOM is now the “latest” element from the feed, which I would argue is better this way since this is the new and relevant content, but it may not be the expected behavior.

Interestingly enough, there has been some movement in that area very recently (as in within the last month) and [Blink is already working on the implementation](https://x.com/intenttoship/status/1761102603683758166?s=20). Some work is being done on a [`reading-order` CSS property](https://github.com/w3c/csswg-drafts/pull/9845) (or perhaps `reading-flow`, name appears to be pending) that would enable developers to help screen-readers figure out the best reading order.

```
reading-order: normal | flex-visual | flex-flow | grid-rows | grid-columns | grid-order
```

In our case, we could use `reading-order: flex-visual` to align the way sighted users and screen-reader users consume our feed.

## About accessible scrollable regions

I feel like this post is a good opportunity to remind everyone that scrollable areas are not accessible by default and need some work.

For starters, they need a `tabindex="0"` attribute so they can be focused and scrolled with the keyboard. This satisfies [2.1.1: Keyboard (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) and [2.1.3: Keyboard (No Exception) (Level AAA)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard-no-exception).

Additionally, they need an accessible name, either via `aria-label` or `aria-labelledby` mapped to a heading element for instance. And for their label to be applied, they need a non-presentational role, such as `role="region"`.

Adrian Roselli has a great [article about scrollable regions](https://adrianroselli.com/2022/06/keyboard-only-scrolling-areas.html).
