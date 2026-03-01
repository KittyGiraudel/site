---
layout: snippet
title: '&lt;VisuallyHidden /&gt;'
description: React component to visually hide a component but not for screen-readers
permalink: /snippets/visually-hidden-component/
language: React
date: 2020-01-16
related: /2020/01/16/accessible-visibility-react-component/
tags:
  - Component
  - React
  - Accessibility
  - CSS
---

The `<VisuallyHidden />` React component aims at visually hiding a piece of text while leaving it accessible for assistive technologies such as screen-readers.

## Component

```js
const VisuallyHidden = ({ as: Component, ...props }) => (
  <Component {...props} className='sr-only' />
)

VisuallyHidden.defaultProps = {
  as: 'span',
}
```

## Related CSS

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

## Usage

```jsx
const Navigation = props => (
  <a href={`/blog/${props.currentPage + 1}`}>
    Next <VisuallyHidden>page</VisuallyHidden>
  </a>
)
```
