---
title: Introducing iframify
description: An announcement post for iframify, a small library to encapsulate a widget in an iframe
keywords:
  - iframe
  - styleguide
  - styles
  - javascript
---

_If you want to check the code directly, [be my guest](https://github.com/edenspiekermann/iframify). Also, maybe [a demo](http://codepen.io/KittyGiraudel/pen/vGWpyr?editors=1000)?_

At Edenspiekermann, we like to work with styleguides. We shape our design experiences in a matter of modules that we then expose individually in a document for future reference and documentation.

However, our technical setup is different from project to project, and while we have done [some pretty decent styleguide](http://doc-azdev.lovelysystems.com/styleguide/) with React and a solid Node.js structure… it’s sometimes slightly trickier when working on Rails or Middleman / Jekyll projects.

## The problem with styleguides

The usual problem with living styleguides is that components get displayed in a context that is different from the one they normally live in. And by “context”, I am actually talking about media queries.

Consider this: you have a footer component that is usually full bleed, with some different styling below 1000 pixels. You display it in your styleguide in a 900 pixels wide column. It visually breaks. Why? Because media queries did not fire as your screen is still 1200+ pixels or whatever.

## What’s the solution?

Element queries. Unfortunately, they do not exist natively just yet and while there are a lot of clever polyfills out there, they usually come with large costs (performance, JS dependency, etc.). So we keep building our components with tweaks based on screen sizes through media queries.

Now regarding this styleguide display problem, the solution is to render the element inside an iframe. An iframe being an inner document, media queries fire based on the width of the iframe rather than on the actual screen size. Which is what we want. Yay!

However, it means rendering each component individually in its own page and setting the URL of these pages as `src` attribute on iframes. Works, but that can be tedious to create a page for each component. Could even be unpractical in some cases. Surely there is a way?

## Automating iframe generation

I was curious about this specific issue and came up with a solution. Let me present [iframify](https://gist.github.com/KittyGiraudel/67b65acf64f57bff08cacbc71999f1f2). It is a tiny script that replaces a node with an iframe version of itself, and imports all its necessary styles to perform correctly.

To do so, it relies on the `srcdoc` attribute on iframe which happens to have [a very decent support](http://caniuse.com/#search=srcdoc), or a local data encoded URL as a source when not supported.

It gathers all the styles needed by the node and all its children by parsing the stylesheets and trying styles against the elements to import everything inside the generated iframe.

<p data-height="268" data-theme-id="0" data-slug-hash="vGWpyr" data-default-tab="result" data-user="KittyGiraudel" class="codepen">See the Pen <a href="http://codepen.io/KittyGiraudel/pen/vGWpyr/">vGWpyr</a> by Kitty Giraudel (<a href="http://codepen.io/KittyGiraudel">@KittyGiraudel</a>) on <a href="http://codepen.io">CodePen</a>.</p>

## What’s next?

This is a nice and handy solution but it still lacks a few things. The first being font-face declarations. Right now, only styles used by the component are being imported, but fonts are not. That would be one (not too hard) thing to do.

Also, no JavaScript is being imported at all. We could design a solution to import specific JavaScript code, but right now it did not seem necessary. Living styleguide usually are about visual regression and documentation, and the current problem was really about breakpoints and media queries so JS is kind of out of the scope.

And of course, anything you can think of to improve the beast. Happy coding!
