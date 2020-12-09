---
title: Accessible icon links
keywords:
  - a11y
  - accessibility
  - react
  - icon
  - link
---

<style>
a.demo-link.demo-link {
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5em;
  border: 1px solid;
  color: rgb(29, 161, 242);
  display: inline-block;
  border-radius: 50%;
  background: none;
  text-align: center;
  padding: 0.2em;
  transition: 250ms;
  vertical-align: middle;
}

a.demo-link.demo-link:focus {
  box-shadow: 0 0 0 3px white, 0 0 0 4px  #dd7eb4;
}

.demo-link > svg {
  width: 1em;
  height: 1em;
  display: block;
  fill: currentcolor;
}
</style>

In modern web design, it is not uncommon to have a link (or a button) that visually has no text, and is just an icon. Think about social icons, or items in a compact navbar. Relying solely on iconography can be tricky, but it can work, especially when icons are clear and well known.

Yet, even if no text is technically displayed, it is important to provide alternative content for people using screen-readers. It turns out making an accessible *icon link* is not that straightforward and I thought it would deserve its own little article.

## Implementation

As an example, let’s consider a Twitter icon link using the iconic bird. We will use SVG for the icon itself since it’s a scalar format that does not require an additional HTTP request.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">
  <path
    d="M16 3.538a6.461 6.461 0 0 1-1.884.516 3.301 3.301 0 0 0 1.444-1.816 6.607 6.607 0 0 1-2.084.797 3.28 3.28 0 0 0-2.397-1.034 3.28 3.28 0 0 0-3.197 4.028 9.321 9.321 0 0 1-6.766-3.431 3.284 3.284 0 0 0 1.015 4.381A3.301 3.301 0 0 1 .643 6.57v.041A3.283 3.283 0 0 0 3.277 9.83a3.291 3.291 0 0 1-1.485.057 3.293 3.293 0 0 0 3.066 2.281 6.586 6.586 0 0 1-4.862 1.359 9.286 9.286 0 0 0 5.034 1.475c6.037 0 9.341-5.003 9.341-9.341 0-.144-.003-.284-.009-.425a6.59 6.59 0 0 0 1.637-1.697z"
  />
</svg>
```

Now, let’s start by wrapping it up with a link:

```html
<!-- Incomplete: please do *not* copy and paste this snippet -->
<a href="https://twitter.com/HugoGiraudel">
  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">…</svg>
</a>
```

Unfortunately, at this stage this link contains no accessible name, which is a big problem. Let’s add some descriptive text, that we make [visually hidden yet accessible](/snippets/sr-only-class/).

```html
<!-- Incomplete: please do *not* copy and paste this snippet -->
<a href="https://twitter.com/HugoGiraudel">
  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 16">…</svg>
  <span class="sr-only">Twitter</span>
</a>
```

There is still a bit more we need to do. Since we provided a descriptive text, we can safely remove the SVG markup from the accessibility tree by adding the `aria-hidden` attribute.

```html
<!-- Incomplete: please do *not* copy and paste this snippet -->
<a href="https://twitter.com/HugoGiraudel">
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewbox="0 0 16 16"
  >
    …
  </svg>
  <span class="sr-only">Twitter</span>
</a>
```

Last but not least, `svg` elements can be focused on Internet Explorer, which is becoming less and less of a problem overall—still, we should correct that with the `focusable` attribute.

```html
<a href="https://twitter.com/HugoGiraudel">
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewbox="0 0 16 16"
  >
    …
  </svg>
  <span class="sr-only">Twitter</span>
</a>
```

As a last touch, I would recommend adding the text content in the `title` attribute on the link as well. This does not enhance accessibility per se, but it emits a small tooltip when hovering the link, which can be handy for non-obvious iconography.

```html
<a href="https://twitter.com/HugoGiraudel" title="Twitter">
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewbox="0 0 16 16"
  >
    …
  </svg>
  <span class="sr-only">Twitter</span>
</a>
```

<p>Our final link (with some additional styles to make it easier on the eye): <a href="https://twitter.com/HugoGiraudel" title="Twitter" class="demo-link">
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewbox="0 0 16 16"
  >
    <path d='M16 3.538a6.461 6.461 0 0 1-1.884.516 3.301 3.301 0 0 0 1.444-1.816 6.607 6.607 0 0 1-2.084.797 3.28 3.28 0 0 0-2.397-1.034 3.28 3.28 0 0 0-3.197 4.028 9.321 9.321 0 0 1-6.766-3.431 3.284 3.284 0 0 0 1.015 4.381A3.301 3.301 0 0 1 .643 6.57v.041A3.283 3.283 0 0 0 3.277 9.83a3.291 3.291 0 0 1-1.485.057 3.293 3.293 0 0 0 3.066 2.281 6.586 6.586 0 0 1-4.862 1.359 9.286 9.286 0 0 0 5.034 1.475c6.037 0 9.341-5.003 9.341-9.341 0-.144-.003-.284-.009-.425a6.59 6.59 0 0 0 1.637-1.697z' />
  </svg>
  <span class="visually-hidden">Twitter</span>
</a></p>

## As a React component

Now that we have sorted out how to make our icon links accessible, we can safely make a little React component for that (out of sight, out of mind), using a [`<VisuallyHidden />` component](/snippets/visually-hidden-component/).

```js
const IconLink = props => (
  <a {...props}>
    {props.children}
    <VisuallyHidden>{props.label}</VisuallyHidden>
  </a>
)
```

Then it can be used like this:

```js
const Twitter = props => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
    <path d='M16 3.538a6.461 6.461 0 0 1-1.884.516 3.301 3.301 0 0 0 1.444-1.816 6.607 6.607 0 0 1-2.084.797 3.28 3.28 0 0 0-2.397-1.034 3.28 3.28 0 0 0-3.197 4.028 9.321 9.321 0 0 1-6.766-3.431 3.284 3.284 0 0 0 1.015 4.381A3.301 3.301 0 0 1 .643 6.57v.041A3.283 3.283 0 0 0 3.277 9.83a3.291 3.291 0 0 1-1.485.057 3.293 3.293 0 0 0 3.066 2.281 6.586 6.586 0 0 1-4.862 1.359 9.286 9.286 0 0 0 5.034 1.475c6.037 0 9.341-5.003 9.341-9.341 0-.144-.003-.284-.009-.425a6.59 6.59 0 0 0 1.637-1.697z' />
  </svg>
)

const MyComponent = props => (
  <IconLink href='https://twitter.com/HugoGiraudel' label='Twitter'>
    <Twitter />
  </IconLink>
)
```

## Further reading

Opening a link in a new tab also comes with accessibility considerations that should not be overlooked. I went over [opening links in a new tab](/2020/01/17/accessible-links-and-buttons-with-react/##open-a-tab-for-me-will-you) in another article. Although it was showcasing a React implementation, the knowledge should be easy to transfer.

Sara Soueidan went through [accessible icon buttons](https://www.sarasoueidan.com/blog/accessible-icon-buttons/) on her blog, and shares interesting tips to debug the accessibility name in the browser developer tools.

Additionally, Florens Verschelde has great content about [working with SVG icons](https://fvsch.com/svg-icons), including composing, spriting, styling and rendering icons. Cannot recommended you enough to read it!
