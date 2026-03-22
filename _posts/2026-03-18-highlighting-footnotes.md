---
title: Highlighting Footnotes
description: A short piece on using CSS to highlight the active footnote of a document.
tags:
  - Design
  - CSS
  - UI
  - UX
  - Accessibility
---

{% assign footnote_footnotes_usage = "Nothing disappoints me more when reading non-fiction than footnotes being used to cite sources. Don’t get me wrong: it’s a totally legitimate use case for footnotes, but what I always hope for is tangential or anecdotal information, like little nuggets of content aside of the main course — not citations." %}

I love {% footnoteref "footnotes-usage" footnote_footnotes_usage %}footnotes{% endfootnoteref %}.

I wrote about creating [accessible footnotes with CSS](https://www.sitepoint.com/accessible-footnotes-css/) on {% footnoteref "sitepoint" "As someone who has written so much for SitePoint (and even recommended new authors), it deeply saddens me to see how it turned out. Code blocks are messy and not highlighted, there are ads everywhere, the design has gone downhill… It’s very unfortunate." %}SitePoint{% endfootnoteref %}. And [how to do it in Eleventy](/2020/12/02/footnotes-in-eleventy/). I’ve also created an [Eleventy plugin](https://github.com/KittyGiraudel/accessible-footnotes/tree/main/packages/eleventy-plugin-footnotes) to make it easy. I’ve written [how to do it in React](https://kittygiraudel.com/2020/11/24/accessible-footnotes-and-a-bit-of-react/) as well. And open-sourced a [React component](https://github.com/KittyGiraudel/accessible-footnotes/tree/main/packages/react-a11y-footnotes). What I’m trying to say is that if you like footnotes as much as I do, there are no excuses for not making them accessible.

But I digress, because that is not the point of today’s article. The point of today’s article is to share a teeny tiny improvement I’ve made to the footnotes on this blog — something simple that makes me happy. I’m here to share the joy.

---

I noticed that when following a link to a footnote at the bottom of the page, there is no visual indication about which footnote is being referenced. It’s not a problem when there is only one or even two footnotes, but when there are a lot of them, it can be confusing to figure out which one is relevant.

## Simplest approach

We can use the good ol’ [`:target` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:target) to highlight the referenced footnote:

```css/0
.Footnotes li:target {
  background-color: rgb(255 255 0 / 0.25);
}
```

{% include "demos/highlighting-footnotes.liquid"
  id: "just-background",
  with_styles: true
%}

## Polishing the design

The simple approach does the job, but it’s not the prettiest. There are a few things I don’t love about the highlight:

1. It doesn’t encompass the number — only the text itself is highlighted.
2. It sticks very close to the edges of the text (which looks worse in dark mode).

To fix that, I decided to use a pseudo-element which I can extend in the outer directions as much as I need. The code now looks like this:

```css
/**
 * 1. Provide relative context for the pseudo-element.
 * 2. Ensure the text appears *above* the highlight.
 */
.Footnotes li {
  position: relative; /* 1 */
  z-index: 0; /* 2 */
}

/**
 * 1. Expand the highlight in the list gutter to encompass the number.
 * 2. Ensure the text appears *above* the highlight.
 */
.Footnotes li::before {
  inset: 0;
  left: -1.5em; /* 1 */
  position: absolute;
  background-color: rgb(255 255 0 / 0.25);
  border-radius: 1em;
  corner-shape: squircle;
  z-index: -1; /* 2 */
}

/**
 * 1. Actually display the highlight when the footnote is targeted.
 */
.Footnotes li:target::before {
  content: ''; /* 1 */
}
```

{% include "demos/highlighting-footnotes.liquid"
  id: "with-pseudo-element",
  with_styles: false
%}

Note how this approach also allows us to apply rounded corners ([squircles](/2026/02/26/nerdy-design-details/#squircle-corners) even!) to the highlight. It’s more noticeable in dark mode.

Another thing I don’t love is that the targeted footnote ends up sticking to the top edge of the window, which I think can hinder readability. To solve this, we can use the [`scroll-margin-top` property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-margin-top).

```css/1
.Footnotes li {
  scroll-margin-top: 1em;
}
```

## Fading out the highlight

I was thinking: the highlight doesn’t need to persist. It’s needed when following a reference in the first place, to visually know which one to read. But when scrolling up and down the page later on, we don’t need whatever last footnote we followed to remain highlighted.

We can use a CSS animation to fade-out the highlight:

```css
/**
 * 1. Make sure the animation’s final state persists.
 */
.Footnotes li:target::before {
  animation: fade-out 1s 5s ease-in-out;
  animation-fill-mode: forwards; /* 1 */
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}
```

There is no real right or wrong approach here: I’ve decided to keep it up for 5 seconds, and then fade-out within 1 second — which I thought were good enough values. You can restart the animation to see it again: <button id="restart-animation" type="button" class="RestartAnimationButton">Restart animation</button>

{% include "demos/highlighting-footnotes.liquid"
  id: "with-animation",
  with_styles: false
%}

## Wrapping up

It’s not ground-breaking, but it’s the sort of small design work I enjoy. It makes things a bit nicer, one littl tweak at a time.

If you haven’t set up a proper way to have accessible footnotes on your websites, here is some materials for you to get started:

- _[Accessible Footnotes with CSS](https://www.sitepoint.com/accessible-footnotes-css/)_
- _[Accessible Footnotes and a bit of React](https://kittygiraudel.com/2020/11/24/accessible-footnotes-and-a-bit-of-react/)_
- _[Footnotes in Eleventy](/2020/12/02/footnotes-in-eleventy/)_
- [eleventy-plugin-footnotes](https://github.com/KittyGiraudel/accessible-footnotes/tree/main/packages/eleventy-plugin-footnotes)
- [react-a11y-footnotes](https://github.com/KittyGiraudel/accessible-footnotes/tree/main/packages/react-a11y-footnotes)

I was even thinking of creating a web component for that. I’ve never created web components before, so maybe it would be a good occasion to learn something new!
