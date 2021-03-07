---
title: 'A11yAdvent Day 7: Page Title in SPA'
---

Single-page applications (SPA for short) have been all the hype for the last decade or so. The idea is that we can avoid reloading the entire page when navigating within a site and instead update only the moving parts (usually the content area). This comes from a great premise: faster interactions, no unnecessary HTTP roundtrips, less used bandwidth.

The thing we usually don’t think about is that many assistive technologies such as screen-readers have been initially authored with the “original web” in mind and rely on page (re)loads to announce the page context, namely the page title (hold by the `<title>` element).

When building a SPA—no matter the framework—it is important to do some work to announce the title when following router links. Two things need to happen:

1. The title of the new view/page needs to be announced.
2. The focus needs to be preserved or moved to a proper place.

A nice solution is to have a [visually hidden](/2020/12/03/a11y-advent-hiding-content/) element at the top of the page which receives the new title when navigating, and move the focus on that element so the content is read. Ideally, the [skip link](/2020/12/06/a11y-advent-skip-to-content/) lives right after that node so the flow goes like this:

1. Press a link in the content area that causes a router change.
2. The view gets loaded.
3. The title for that view gets rendered in the invisible node.
4. The focus gets move to that node so its content is announced.
5. Tabbing once gets to the skip link, so getting back to the content area is fast and convenient.

Here is how our HTML should look like:

```html
<body>
  <p tabindex="-1" class="sr-only">…</p>
  <a href="#main" class="sr-only sr-only--focusable">Skip to content</a>
  <!-- Rest of the page -->
</body>
```

And our unflavoured JavaScript. Note that this is no specific framework—it’s just a made-up API to illustrate the concept.

```js
const titleHandler = document.querySelector('body > p')

router.on('page:change', ({ title }) => {
  // Render the title of the new page in the <p>
  titleHandler.innerText = title
  // Focus it—note that it *needs*  `tabindex="-1"` to be focusable!
  titleHandler.focus()
})
```

You can find a more in-depth [tutorial for React with `react-router` and `react-helmet`](https://kittygiraudel.com/2020/01/15/accessible-title-in-a-single-page-react-application/) on this blog. The core concept should be the same no matter the framework.

{% info %} Note that if you have can guarantee there is **always** a relevant `<h1>` element (independently of loading states, query errors and such), another possibly simpler solution would be to skip that hidden element altogether, and focus the `<h1>` element instead (still with `tabindex="-1"`). {% endinfo %}
