---
title: Templating in HTML
edits:
  - date: 2022/10/05
    md: Some people on HackerNews pointed out that this is actually not “templating” the way Handlebars, Mustache, Twig or whatever else is. Okay? It’s just a title, that doesn’t invalidate the rest of the piece. 🤷‍♀️
  - date: 2022/10/05
    md: A lot of people asked about the differences with using a hidden DOM element (like a `<div>` for instance), so I added [a section about it](#why-not-a-hidden-element).
---

After a nice discussion on Twitter following [a recent article from Manuel Matuzović](https://web.dev/website-navigation/), I thought it would be worth writing some quick thoughts here. Today, we have a quick look at the `<template>` element and how it can come in handy.

So to put it simply, the `<template>` HTML element is intended to store HTML that is not yet used. The element itself and all its content are invisible, so it can be basically anywhere in the document without much risk. Although you’d typically have your templates at the root level.

## What for

Let’s start with the fact that `<template>` do not enabling you to do anything that’s not possible otherwise. In that way, it’s more of a convenience tool really. If you have significant HTML structures that need to be injected at runtime, it might be very cumbersome to do so manually with `document.createElement` and `element.setAttribute`.

In [Manuel’s case](https://web.dev/website-navigation/#adding-a-burger-button), he uses a template to hold a button that needs to be injected when JavaScript is finally available, as it wouldn’t work before that. Creating that button manually in JS with the SVG and all with be quite cumbersome. It would also violate proper separation of concerns by moving HTML into the JS logic.

```js
<template id="burger-template">
  <button type="button" aria-expanded="false" aria-label="Menu" aria-controls="mainnav">
    <svg width="24" height="24" aria-hidden="true">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z">
    </svg>
  </button>
</template>
```

## How to use it

Once you have a `<template>` element in your HTML, you can access it in JavaScript and clone it to render it wherever you want.

```js
const template = document.querySelector('#id-of-template')
const content = template.content.cloneNode(true)

container.append(content)
```

It’s also not limited to a single use. You can create as many clones as you want. The [MDN page](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) has a good example of storing a table row in a template so you can easily clone and add a new row on demand.

For instance, Sass Guidelines use templates to inject links to edit view or edit each chapter on GitHub directly. In an ideal world these links would be there all the time, but because Sass-Guidelines is built from plain ol’ Markdown files, these links are generated in JS. This is [the pull-request that implemented templates](https://github.com/KittyGiraudel/sass-guidelines/commit/03a5abb931026b5a4997fdf5ef43ba029e612d89).

## Browser support

The browser support is surprisingly good. Almost 98% of the current landscape supports it, so feel free to go nuts. And if you have to support older agents, you can test for support like this:

```js
if ('content' in document.createElement('template')) {
  // `<template>` is supported.
}
```

## Why not a hidden element?

Following this article, some people asked what would be the difference with using a hidden DOM element, such as a `<div>` to hold our template content. After all, it feels similar?

```html
<!-- Don’t do that, it’s just not as good or safe. -->
<div id="template" style="display: none;">
  <!-- Template content here -->
</div>
```

There are a few reasons why using a `<template>` is better—some better than others ([thanks to Spankalee](https://news.ycombinator.com/item?id=33089975) for outlining a few I didn’t think of)—so pick what is most convincing to you:

- Unlike content within a hidden container, the content of a `<template>` is _inert_: images and scripts do not load, styles do not apply, elements are not queried, etc.
- The content model validation is turned off; a `<template>` can safely contain a `<td>`, `<li>` or `<dd>` without a validator complaining. Similarly, a `<template>` can be rendered virtually anywhere, which may not be the case for a `<div>`.
- CSS can fail, be disabled or customized, so using a CSS declaration to hide a `<div>` is not really bulletproof. On the other hand, chances are that the `<template>` element will always be hidden, even without CSS. The `hidden` HTML attribute is probably a better choice if you go that route.
- Search engines may be indexing content that’s hidden with CSS. Or maybe not. It’s unclear since their indexing algorithm is notoriously opaque. You probably don’t want meaningless templating data to be indexed.
- `<template>` is just more semantic and obvious in intent that a hidden container if you ask me, which may be particularly relevant for third-party tools, extensions et al.

## Wrapping up

Long story short, templates are good to avoid creating complex DOM structures by hand. For a single node, using the built in manipulation methods is fine, but for anyting more complex, you probably want to store the HTML blob as is and just clone and fill it when needed.

As always, I hope it helps!
