---
layout: snippet
tags: snippets
title: .sr-only {}
permalink: /snippets/sr-only/
language: CSS
related: /2016/10/13/css-hide-and-seek/
---

```css
.sr-only {
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  -webkit-clip-path: inset(50%) !important;
  clip-path: inset(50%) !important;
  height: 1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
}
```
