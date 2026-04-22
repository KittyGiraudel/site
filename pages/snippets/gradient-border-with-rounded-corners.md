---
layout: snippet
title: Gradient border with rounded corners
description: A way to apply a gradient border to a container with rounded corners.
permalink: /snippets/gradient-border-with-rounded-corners/
language: CSS
date: 2026-02-26
related: /2026/02/26/nerdy-design-details/
tags:
  - CSS
  - Design
---

For some reason it does not seem to be possible to render a gradient border using `border-image` on a container with rounded corners. I have resorted to using [this solution from StackOverflow](https://stackoverflow.com/a/53037637):

```css
/**
 * 1. Use a flat gradient (with no color change) to apply the background, and 
 *    extend it to the outside edge of the padding.
 * 2. Define the actual gradient used for the border, and extend it to the 
 *    outside edge of the border (included).
 * 3. Apply the gradient background all the way to the border, included. 
 */
.container {
  --background-color: light-dark(#f3f8fc, #303132);
  background-color: var(--background-color);
  border: 2px solid transparent;
  background-image:
    linear-gradient(var(--background-color), var(--background-color)), /* 1 */
    linear-gradient(to right, var(--blue), var(--pink)); /* 2 */
  background-clip:
    padding-box, /* 1 */
    border-box; /* 2 */
  background-origin: border-box; /* 3 */
}
```

It’s a very clever approach: it uses a flat gradient (with no color change) applied all the way through the padding box, and the actual gradient applied to the border box, created by a transparent border.
