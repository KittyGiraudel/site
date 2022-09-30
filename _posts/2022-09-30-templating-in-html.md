---
title: Templating in HTML
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

## Wrapping up

Long story short, templates are good to avoid creating complex DOM structures by hand. For a single node, using the built in manipulation methods is fine, but for anyting more complex, you probably want to store the HTML blob as is and just clone and fill it when needed.

As always, I hope it helps!
