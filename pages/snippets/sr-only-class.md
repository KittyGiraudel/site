---
layout: snippet
tags: snippets
title: .sr-only {}
description: CSS utility class to visually content but not for screen-readers
permalink: /snippets/sr-only-class/
language: CSS
related: /2016/10/13/css-hide-and-seek/
---

The `.sr-only` class is a utility class aiming at visually hiding the element while keeping it accessible to assistive technologies such as screen-readers. It relies on a carefully designed combination of declarations for maximum support, and `!important` bangs to make sure to override any more specific CSS.

```css
.sr-only {
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  -webkit-clip-path: inset(50%) !important;
  clip-path: inset(50%) !important;
  height: 1px !important;
  overflow: hidden !important;
  margin: -1px !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
}
```
