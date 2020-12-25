---
title: 'A11yAdvent Day 11: Emojis'
---

Emojis are all around nowadays. Besides being cute and silly, they became an essential communication tool to suggest tone in the written world.

As [Léonie Watson explains in her article about accessible emojis](https://tink.uk/accessible-emoji/), emojis are still not very accessible to screen-readers unfortunately, and tend to be poorly or completely undescribed to their users. They are not reported as images in the accessibility tree, and they are not always assigned an accessible name. These are the 2 things to fix.

The `role="img"` attribute can be set to assign imagery semantics to a DOM node. The accessible name can be defined with the `aria-label` attribute. For instance:

```html
<span role="img" aria-label="Sparkly pink heart">💖</span>
```

That’s the strict minimum to make emojis perceivable to all. In [his article about accessible emojis, Adrian Roselli](https://adrianroselli.com/2016/12/accessible-emoji-tweaked.html) expands on Léonie’s solution to include a small tooltip to display the emoji name as well which is a nice touch.

Of course, most web pages are not coded manually, which means the label will have to be dynamically inserted when an emoji is found. Programmatically [finding emojis is just a regular-expression away](https://github.com/mathiasbynens/emoji-regex) so this is the easy part so to say.

Assigning the description programmatically is harder. It turns out [there is no obvious way to retrieve the description for an emoji](https://twitter.com/mathias/status/986921634228527104?lang=en) (also known as “CLDR short name”). Packages like [emoji-short-name](https://github.com/WebReflection/emoji-short-name) or [emojis.json](https://gist.github.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb/) provide a comprehensive map for most emojis to access their English short name, so this could be a solution albeit it has its limits (lack of internationalisation, potential performance cost…).
