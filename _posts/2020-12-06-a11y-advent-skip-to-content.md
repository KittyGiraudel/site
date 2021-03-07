---
title: 'A11yAdvent Day 6: Skip to Content'
---

Let’s stay in the topic of navigation and talk about a feature that is too often forgotten: a link to go straight to the main content area of the site—often called “skip-to-content” or “skip-navigation” link.

In traditional websites using hyperlinks the right way, the page is fully reloaded when following a link and the focus is restored to the top of the page. When navigating with the keyboard, that means having to tab through the entire header, navigation, sometimes even sidebar before getting to accesss the main content. This is bad.

Single-page applications are not free from this consideration either. Following a link tends to reload the content area and therefore loses the current focus, which sends it to the top of the document, causing the same issue. So either way, there is work to do.

{% assign skip_link = "As [Hidde rightfully pointed out on Twitter](https://twitter.com/hdv/status/1334435081952309253?s=20), this is a good candidate for the WebWeWant.fyi project. I submitted a [suggestion to have skip links natively implemented](https://webwewant.fyi/wants/5fc8bb41d84cfbab3fb47320/) by browsers instead of relying on developers’ implementation." | markdown %}

To work around the problem, a common design pattern is to {% footnoteref "skip_link" skip_link %}implement a skip link{% endfootnoteref %}, which is an anchor link sending to the main content area. So how shall our skip link work?

- It should be at the top of the page, ideally as the first focusable element. It doesn’t have to be absolute first, but the more focusable elements there are before it, the less discoverable and thus less useful the skip link becomes.
- Ideally it’s always visible, but it’s pretty uncommon that it fits nicely into design so it can be visually hidden and revealed on focus—more on that below.
- It should lead to the main content area of the page.
- It should ideally start with the word “Skip” so it’s easily recognisable (visually and aurally). It can say “Skip navigation”, “Skip to content”, or some similar flavours.

Here is our HTML:

```html
<body>
  <a href="#main" class="sr-only sr-only--focusable">Skip to content</a>
</body>
```

For the styling we can use what we learnt in [day 3 of this calendar](/2020/12/03/a11y-advent-hiding-content/), applying a small twist to undo the hiding styles when the element is focused.

```css
.sr-only.sr-only--focusable:focus,
.sr-only.sr-only--focusable:active {
  clip: auto !important;
  -webkit-clip-path: auto !important;
  clip-path: auto !important;
  height: auto !important;
  overflow: visible !important;
  width: auto !important;
  white-space: normal !important;
}
```

You can play with a [live demo for skip links on CodePen](https://codepen.io/KittyGiraudel/pen/eYdpqoK).
