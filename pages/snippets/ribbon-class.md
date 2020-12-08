---
layout: snippet
tags: snippets
title: .ribbon {}
permalink: /snippets/ribbon-class/
language: CSS
related: /2020/01/22/corner-ribbon-with-trigonometry/
---

Placing a small piece of text as a corner ribbon of a box is a little tricky as it involves some trigonometry. The following class should work, provided it is inserted in a parent with `position: relative`.

```html
<div class="parent">
  <span class="ribbon">Free</span>
</div>
```

The following styles only included the required declarations for the ribbon positioning. Any aesthetic concern is left to the author.

```css
/**
 * 1. Start absolutely positioned in the top right corner of the
 *    container.
 * 2. Horizontal padding is considered in the ribbon placement.
 *    The larger the ribbon (text + padding), the lower in the
 *    container it might have to be.
 * 3. Make sure the content is centered within the ribbon itself.
 * 4. Position the ribbon correctly based on its width, as per
 *    the following formula: `cos(45 * π / 180) * 100%`.
 */
.ribbon {
  position: absolute; /* 1 */
  top: 0; /* 1 */
  right: 0; /* 1 */
  padding: 0 2em; /* 2 */
  text-align: center; /* 3 */
  transform:
    translateY(-100%)
    rotate(90deg)
    translateX(70.71067811865476%)
    rotate(-45deg); /* 4 */
  transform-origin: bottom right; /* 4 */
}
```
