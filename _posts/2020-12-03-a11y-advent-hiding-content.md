---
title: 'A11yAdvent Day 3: Hiding Content'
description: A11yAdvent entry on hiding content responsibly while preserving it for screen-readers
---

Today, let’s dive in a bit more technical topic and discuss how to hide content while keeping it accessible to assistive technologies.

As you might guess, most people browse the web by looking at it, and then tapping or clicking links and buttons to interact with it. This mode of consumption works because most people have a decent eyesight and can look at the page. That being said, some people (including but not limited to blind persons) rely on screen-readers to browse the web. These are softwares reading out loud the content of a page, and provided navigation mechanisms to browse web content without necessarily relying on visual input.

When using a screen-reader, one does not always benefit from the surrounding visual context. For instance, an icon might make sense on its own, but if someone cannot perceive the icon, then they might not understand the role of a button. This is why it is important to provide assistive text, even though it might be visually hidden.

One might think using `display: none` or the `hidden` attribute should be enough, but these techniques also remove the content from the accessibility tree and therefore make it inaccessible.

The quest for a combination of CSS declarations to visually hide an element while keeping it accessible to screen-readers is almost as old as the web, and gets refined every couple of years. The latest research to date on the matter has been conducted by Gaël Poupard in his [CSS hide-and-seek article translated here](https://kittygiraudel.com/2016/10/13/css-hide-and-seek/). The consensus is that the following code snippet is enough to hide an element while making its content still available to assistive technologies:

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

What is important to think through is when to hide content entirely (with `display: none` for instance), and when to hide it visually only. For instance, when providing additional information to an icon, it should be visually hidden since the point is to have it read by screen-readers. But when building tabs, or a content toggle, it should be hidden entirely, because there is an interaction required to access it.

{% info %} In 2020, the `content-visibility` CSS property made its apparition as a way to improve performance by hinting the browser (Chrome, as of writing) to skip rendering of a certain element until it is within the viewport. While it comes from a good place, it is not without shortcomings in terms of accessibility.

Indeed, content made hidden with `content-visibility` will effectively be absent from the accessibility tree entirely (just like with `display: none`) which can be quite an issue for things like landmarks, links or headings (see day 4 and 5 of this calendar). Therefore, reserve this CSS property for things which are neither landmarks nor headings or heading containers.

For more information about the impact of `content-visibility` on content accessibility, I recommend [Content-visibility and Accessible Semantics](https://dev.to/marcysutton/content-visibility-and-accessible-semantics-2994) by Marcy Sutton and [Short note on content-visibility: hidden](https://html5accessibility.com/stuff/2020/08/25/short-note-on-content-visibility-hidden/) by Steve Faulkner. {% endinfo %}
