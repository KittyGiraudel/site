---
title: Handy tools for frontend
description: A look into tools that are worth knowing when doing frontend development
tags:
  - Frontend
deprecated: true
---

So I’ve been thinking (yeah, true story). And it occurred to me, it would be a good idea to write a little blog post about some of the cool tools I use almost everyday.

If you’re a webdesigner or developer, you’ve probably already stumbled upon some wonderful online tools / services. Not necessarily complicated things, just things you definitely need. There are really a bunch of them, and Wild Web Watch is pretty much focused on listing them, but I’d like to focus on just a few of them. The ones I use very often.

## CSS Coloratum

- Author: Lea Verou
- Link: [https://css.coloratum.com](https://css.coloratum.com)
- Category: Design

CSS Coloratum is a handful tool helping you convert colors in different syntaxes. It currently supports keywords, hexadecimal, RGB and HSL. Plus, it shows a preview.

Probably one of the best tools I know, especially when you’re working with hexadecimal colors you want to convert to colors accepting an alpha value (RGBa / HSLa).

{% render "figure.liquid",
  src: "/assets/images/tools/css-coloratum.jpg",
  caption: "Screenshot of CSS Coloratum",
  lazy: false
%}

## WeLoveIconFonts

- Author: Tim Pietrusky
- Link: [https://weloveiconfonts.com/](https://weloveiconfonts.com)
- Category: Development

WeLoveIconFonts (yes we do!) is some kind of CDN (Content Delivery Network) for icon fonts, like Google Web Fonts for web fonts. It currently supports Brandico, Entypo, Font Awesome, Fontelico, Maki, OpenWeb Icons, Typicons and Zocial.

It’s very easy to use. You pick one or more fonts, you copy the @import line into your stylesheet and you’re done. You can put icons all over your website. No more struggle with font files.

{% render "figure.liquid",
  src: "/assets/images/tools/weloveiconfonts.jpg",
  caption: "Screenshot of WeLoveIconFonts"
%}

## PageSpeed Insights

- Author: Google
- Link: [https://developers.google.com/speed/pagespeed/insights](https://developers.google.com/speed/pagespeed/insights) (+ [Chrome](https://chrome.google.com/webstore/detail/pagespeed-insights-by-goo/gplegfbjlmmehdoakndmohflojccocli?utm_source=chrome-ntp-icon) and [Firefox](https://developers.google.com/speed/docs/insights/using_firefox) extensions)
- Category: Optimization

PageSpeed Insights is a tool made by Google which analyzes the content of a web page, then generates suggestions to make things faster. What I really like about PSI is it also exists as a Chrome and a Firefox extension, which means you can inspect your page directly from the WebDeveloper Tools / Firebug. Isn’t that awesome?

{% render "figure.liquid",
  src: "/assets/images/tools/page-speed-insights.jpg",
  caption: "Screenshot of PageSpeed Insights"
%}

## Colorzilla

- Author: Colorzilla
- Link: [https://colorzilla.com/](https://colorzilla.com/) (+ [Chrome](https://www.colorzilla.com/chrome/) and [Firefox](https://www.colorzilla.com/firefox/) extensions)
- Category: Design

ColorZilla provides 2 really awesome things: a CSS gradient generator and a Chrome / Firefox extension to deal with colors. I really recommend the 2, so I’ll talk about both.

### Colorzilla Gradient Generator

Colorzilla Gradient Generator is, well, a CSS gradient generator and probably the best you’ll find so far. It provides a bunch of options like gradient orientation, reversing, size, IE support with filters, color adjustments and much more. And of course, you can copy and paste the CSS code for all browsers. Plus, it also provides 137 presets gradients.

{% render "figure.liquid",
  src: "/assets/images/tools/cz-gradient-generator.jpg",
  caption: "Screenshot of ColorZilla Gradient Generator"
%}

### Colorzilla Extension

{% render "figure.liquid",
  src: "/assets/images/tools/cz-extension.jpg",
  caption: "Screenshot of ColorZilla extension"
%}

Colorzilla is also a Chrome / Firefox extension to manage colors. This extension provides a lot of features, including:

- An eyedropper (with copy to clipboard feature)
- An advanced color picker
- A webpage color analyzer
- A palette viewer
- A color history
- Keyboard shortcuts

I know there are a bunch of colorpickers / eyedropper extensions outhere but you want find any like this. Colorzilla is really, really awesome and I wonder how I could work so long without using it.

## CanIUse

- Author: Alexis Deveria
- Link: https://caniuse.com (+ [Chrome extension](https://chrome.google.com/webstore/detail/can-i-use/kinefpelfmogilfkmjlbfkamgmofmedf/reviews?utm_source=chrome-ntp-icon))
- Category: Development

CanIUse.com is the perfect tool when building HTML5 and CSS3 websites or applications. It groups together compatibility tables for most of HTML5, CSS3, SVG and JS API features. From there, you have access to browser support statistics coming from StatCounters for both desktop and mobiles browsers plus some various notes you may want to know about before using a feature.

This awesome tool has quickly become **the reference** when it comes to browser support documentation. I use it almost everyday and I would probably be lost without it. As a front-developer, it’s a really really useful tool.

It also exists as a Chrome extension meaning you can search for features directly into your browser without having to visit caniuse.com but I don’t use it much since the search engine isn’t that good ("border-image" doesn’t give any result while “border image” does for example).

{% render "figure.liquid",
  src: "/assets/images/tools/caniuse.jpg",
  caption: "Screenshot of Can I Use"
%}

## Final words

There are plenty more tools I’d like to talk about but I think it will be for another article. Enough for one day! What about you people, what are the tools you always use? Be sure to share your opinion!
