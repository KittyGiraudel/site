---
layout: snippet
tags: snippets
title: .ribbon {}
permalink: /snippets/ribbon/
language: CSS
related: /2020/01/22/corner-ribbon-with-trigonometry/
---

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
