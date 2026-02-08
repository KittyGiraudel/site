---
title: Sass Guidelines improvements
description: A retrospective on the latest round of improvements to Sass Guidelines and the decisions behind them
---

I authored the very first version of [Sass Guidelines](https://sass-guidelin.es) in the first week of 2015, inspired by Harry Robert’s [CSS guidelines](https://cssguidelin.es/). It went through 3 additional iterations: version 1.1 in April 2015, version 1.2 barely 6 months later in September 2015 and finally version 1.3 in Janvier 2017. Since then, not much, especially since I haven’t written a line of Sass since 2016.

For some reason, I recently came back to Sass Guidelines. Not to update the content, but to work on the site itself. It turns out I learnt a lot in the last few years and found many improvements worth doing. I thought it would be interesting to discuss them in this post. Here are the different topics we’ll go through:

- [Localisation](#localisation)
- [Search engine optimisation](#search-engine-optimisation)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Tooling](#tooling)

## Localisation

I think what I like the most about Sass Guidelines as a project is how I got to collaborate with many people to have it translated in **13 different languages**. On that note, [Sass Guidelines are now available in Dutch](https://sass-guidelin.es/nl/) thanks to [Noah van der Veer](https://github.com/noah-vdv)!

{% info %}If you are interested in translating Sass Guidelines in a language that is currently not supported, please feel free to [get in touch on Twitter](https://twitter.com/KittyGiraudel) so we can discuss feasibility! We are also looking for people to update the Polish version (from v1.2) and the Czech and Danish versions (from v1.1). {% endinfo %}

On any version but the English one, there is an English banner mentioning that this is a translation and therefore might not be 100% accurate. It says (for instance, for the German version):

> You are viewing the German translation from Moritz Kröger of the original Sass Guidelines from Kitty Giraudel.
>
> This version is exclusively maintained by contributors without the review of the main author, therefore might not be completely authentic.

I noticed that this disclaimer was not marked as English, which meant someone using a screen-reader wouldn’t switch to English when reading out this content. Not great! I added `lang="en"` to this container and initiated the process to have this content translated since there is no reason it should be displayed in English at all.

## Search engine optimisation

Something I learnt from working on the international site for Gorillas is that it can be interesting to [list alternate versions](https://developers.google.com/search/docs/advanced/crawling/localized-versions) in the `<head>` of the document for search engines.

```html
<link rel="alternate" href="https://sass-guidelin.es" hreflang="x-default" />
<link rel="alternate" href="https://sass-guidelin.es" hreflang="en" />
<link rel="alternate" href="https://sass-guidelin.es/cz" hreflang="cz" />
<link rel="alternate" href="https://sass-guidelin.es/da" hreflang="da" />
<link rel="alternate" href="https://sass-guidelin.es/de" hreflang="de" />
<link rel="alternate" href="https://sass-guidelin.es/el" hreflang="el" />
<link rel="alternate" href="https://sass-guidelin.es/es" hreflang="es" />
<link rel="alternate" href="https://sass-guidelin.es/fr" hreflang="fr" />
<link rel="alternate" href="https://sass-guidelin.es/it" hreflang="it" />
<link rel="alternate" href="https://sass-guidelin.es/ko" hreflang="ko" />
<link rel="alternate" href="https://sass-guidelin.es/nl" hreflang="nl" />
<link rel="alternate" href="https://sass-guidelin.es/pl" hreflang="pl" />
<link rel="alternate" href="https://sass-guidelin.es/pt" hreflang="pt" />
<link rel="alternate" href="https://sass-guidelin.es/ru" hreflang="ru" />
<link rel="alternate" href="https://sass-guidelin.es/zh" hreflang="zh" />
```

I therefore added a [robots.txt](https://sass-guidelin.es/robots.txt) and a [sitemap.xml](https://sass-guidelin.es/sitemap.xml) so search engines can properly browse and index the site and all its pages.

I’ve also fixed a lot of links yielding a 404 due to pages and sites having disappeared over the years. I don’t know how much this counts for SEO purposes, but that can’t hurt anyway, at least from the user experience standpoint.

## Accessibility

Having spent the last few years focusing on accessibility, I must say I was almost pleased finding accessibility issues on Sass Guidelines as it means I’ve learnt and gotten better.

### Titles

First of all, titles were a little all over the place.

- There were 20+ `<h1>` elements. I think this is a bit of a side-effect of the way the content lives in the codebase, every chapter being in its own Markdown file starting with a top-level title (e.g. `# Title`).
- The baseline describing the site right below the main title was a `<h2>` element despite not being a title at all.
- There were some `<h6>` elements without the intermediary levels. This comes from the first version of the guidelines where we used that in some instances, when it shouldn’t have been titles at all.
- The titles in the options panel were also off.

This has been all fixed, and the document outline should be clean and consistent now.

### Icons

While icons were technically accessible to assistive technologies, I think (I must admit I cannot remember for sure) they caused double vocalisation of the content. I’ve also found an odd bug where they were incorrectly described.

Basically, they all had their own description (with `role="img"` + `aria-labelledby="…"`), but since they are all used within a link/button alongside additional content, the description ended up being read out twice — one for the icon, and one for the text.

Because they are never used on their own and are always displayed alongside textual content (whether visible or not), they can in fact be safely ignored (with `aria-hidden="true"` + `focusable="false"`).

### Code blocks

For some reason, the `highlight` block implementation from Jekyll (the static-site generator Sass Guidelines is built on) uses the `<figure>` element for code blocks. That’s definitely a [questionable choice](https://github.com/jekyll/jekyll/issues/4905), so I moved all code blocks to Markdown fenced blocks (wrapped with triple backticks on both sides) so it no longer uses that HTML element.

### Self-explanatory links

At the bottom of the page, there is a recap of all the guidelines in the form of a few bullet-point lists. It’s a good way to have a digestible summary without having to go through all the content.

At the end of every item, there was an anchor link to go back to the relevant section of the document. Unfortunately, these links all had “↩” for content. That’s handy, but definitely not great for assistive technologies as we ended up with dozens of [links indiscernable from one another](/2020/12/04/a11y-advent-self-explanatory-links/) for having all the same content. Since there was no obvious fix without involving all translators, I decided to remove these links.

## Performance

For something as simple as Sass Guidelines, you’d think there are not many performance improvements that can be done. After all, it’s basically a very long HTML document. Still, I found quite a few cools things to do:

I removed the custom font entirely. We were using Roboto, and while it was responsibly loaded (asynchronously and only a subset, following the Filament Group’s recommendations), it also feels very unnecessary. The site doesn’t become suddenly better because of Roboto (or any font for that matter), so I decided to drop it entirely and use the default font stack instead.

Images also could use some love. First of all, I lazy-loaded them all with `loading="lazy"`, which is pretty interesting to avoid downloading them as soon as the page loads and wait for them to be rendered instead. Secondly, I realised they were not served in optimised formats when available so I added WebP and AVIF support to significantly reduce their file size.

Not that it makes a huge difference performance-wise, but I removed CSS vendor prefixes. I was surprised to see that I used a lot of vendor prefixes like `-webkit-`, `-moz-` and `-ms-` throughout the stylesheet, which is definitely no longer necessary for most declarations.

Finally, I removed Google Analytics. Mostly because I couldn’t care less about the stats, and also because my Netlify plan includes analytics done on the server-side, so it’s better for everyone.

## Tooling

Sass Guidelines is not a complex project, but there are still quite a lot going on all things considered. I didn’t feel like completely revamping it, but I did clean up a few things regarding tooling:

- I updated a lot of dependencies, both Node and Ruby (again, the site is built on Jekyll). Some dependencies hadn’t been updated in years. I also added Dependabot to no longer have to manage dependencies manually.
- I removed nps (some sort of npm scripts on steroids) and went back to basic npm scripts. The simpler the better.
- I was doing some convoluted stuff with storing SVG snippets in `<meta>` tags for runtime usage in JavaScript, and moved them to `<template>` as they should be.

---

I think that’s about it! I find it interesting coming back to a project like this after a few years. I put _a lot_ of work into Sass Guidelines back then (without even considering the time spent authoring the content) and it’s genuinely rewarding looking back and see how far I’ve come. ✨
