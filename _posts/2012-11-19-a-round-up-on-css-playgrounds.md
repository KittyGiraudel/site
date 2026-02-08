---
title: A round-up on CSS playgrounds
description: A look into what CSS playgrounds are and what are the main contenders
keywords:
  - css
  - playground
edits:
  - date: 2014/11/16
    md: This article is quite old. Information might be incorrect.
---

## What is a code playground?

A code playground is an online tool allowing you to do some code, then save and share it. It’s often used for quick demos and reduced testcases. It’s a good alternative to the old .html file with its embedded `<style>` and `<script>` tags.

Playgrounds are becoming more and more popular and there are a bunch of options when you want to use one. Let me introduce you the most popular ones:

- [CodePen](https://codepen.io) from Chris Coyier, Tim Sabat and Alex Vasquez
- [Dabblet](https://dabblet.com) from Lea Verou
- [CSSDeck](https://cssdeck.com) from Rishabh
- [JSFiddle](https://jsfiddle.net) from Oskar Krawczyk

Basically, they all do more or less the same stuff but each one has its own strengths and weaknesses. So in the end the choice is up to the user. I’d like to give you my opinion on this stuff but first, let’s make a little round-up.

## Dabblet

Dabblet is an amazing playground, ~~however it doesn’t support JavaScript. That being said, its author presented Dabblet as a pure CSS playground, so it’s not very surprising JavaScript isn’t supported~~.

What is a little bit more surprising however is that Dabblet doesn’t provide any support for preprocessors, especially CSS ones. Nowadays, it’s a pretty big deal when a playground doesn’t allow users to code with preprocessors.

Plus, it seems to be very buggy sometimes. Shortcuts don’t work as expected, cursor is boucing to the top of your document, etc. It’s too bad because it has a minimalist and cute interface.

### Pros

- Live reload
- Prefixfree by default (removable)
- Modulable interface
- User accounts via GitHub: gallery

### Cons

- <span style="text-decoration: line-through">No JS support</span> JS tab now in alpha stage
- No preprocessors support
- Cloned GitHub user accounts (followers/following GitHub users)
- Sometimes very buggy

### Resources

- [Dabblet](https://dabblet.com)
- [Blog](https://blog.dabblet.com/)
- [Dabblet](https://twitter.com/dabblet) on Twitter

## JSFiddle

JSFiddle is a wonderful playground when it comes to JavaScript development since it provides a wide range of JavaScript libraries, probably more than you’ll ever need. Problem is it doesn’t use a live reload system meaning you have to hit “Run” everytime you make a change. It’s kind of annoying, but for JavaScript prototyping, it’s amazing.

### Pros

- 22 JavaScript libraries available + multiple versions: Mootools, jQuery, Prototype, YUI, Glow, Dojo, Processing.js, ExtJS, Raphael, RightJS, Three.js, Zepto, Eny, Shipyard, Knockout, The X Toolkit, AngularJS, Ember, Underscore, Bonsai, KineticJS, FabricJS
- Highly customizable for JS development
- Built-in options for Normalize.css
- Preprocessors: SCSS (CSS), CoffeeScript (JS), JavaScript 1.7 (JS)
- Easy embedding of external stylesheets / JS scripts
- Doctype accessible
- Numbers versions of your work
- User accounts: gallery
- Mobile debugger

### Cons

- No live reload
- No HTML preprocessors support
- No built-in option for Prefixfree and Modernizr
- Interface somewhat a bit fixed

### Resources

- [JSFiddle](https://jsfiddle.net)
- [JSFiddle](https://twitter.com/jsfiddle) and [JSFiddleSupport](https://twitter.com/jsfiddlesupport) on Twitter

## CSSDeck

CSSDeck is fairly new in the playground scene but it’s the only one providing the ability to record your code while you type it in order to have some kind of video. Basically, you can make video tutorial with CSSDeck, which you can’t do with other playgrounds.

### Pros

- Live reload
- Codecast feature (video coding)
- 11 JavaScript libraries available: MooTools, jQuery, jQuery Mobile, Prototype, YUI, Underscore, Backbone, Modernizr, Sencha Touch, Dojo, Bootstrap
- Preprocessors: ZenCoding (HTML), Markdown (HTML), Slim (HTML), Jade (HTML), HAML (HTML), LESS (CSS), Stylus (CSS), SCSS (CSS), Sass (CSS), Compass (CSS), CoffeeScript (JS)
- Built-in options for Prefixfree and Normalize.css
- User accounts via Twitter or GitHub: gallery, likes & follow
- Possibility to make private stuff

### Cons

- Small community
- Interface sometimes a bit messy

### Resources

- [CSSDeck](https://cssdeck.com)
- [CSSDeck](https://twitter.com/cssdeck) on Twitter

## CodePen

CodePen is one hell of a playground. It provides very strong tools for each of the 3 supported languages and provides awesome features for registered users like personal gallery, tags, forks, likes and follows, various themes, etc.

Plus, authors pick best pens on the site and feature them on the front page. This way you can have a look at best frontend works outhere without having to search in thousands of pages.

### Pros

- Live reload
- 8 JavaScript libraries available: jQuery, jQuery UI, Zepto, MooTools, Prototype, YUI, ExtJS, Dojo
- Preprocessors: ZenCoding (HTML), Markdown (HTML), Slim (HTML), HAML (HTML), LESS (CSS), SCSS (CSS), Sass (CSS), CoffeeScript (JS)
- Built-in options for Prefixfree, Normalize.css, Reset.css and Modernizr
- `<head>` accessible
- Easy embedding of external stylesheets / JS scripts
- User accounts via GitHub: gallery, likes & follow
- Various themes available
- Tags
- Possibility to fork
- Homepage featuring coolest pens
- A PRO version with special features (teach mode, pair programming and much more)

### Cons

- Interface somewhat a bit fixed (preview with small height)
- Everything is public without PRO version
- Not registered pens are quickly deleted
- Sometimes buggy with for loops

### Resources

- [CodePen](https://codepen.io)
- [Blog](http//blog.codepen.io)
- [CodePen](https://twitter.com/codepen) on Twitter

## What’s my opinion

Honestly, I think **CodePen is far ahead of any other playground out there**. All in all, it provides more options than others, it’s more stable, less buggy, and far more popular even if it’s only 6 months old.

I used to work a lot in Dabblet but I’ve always found those tiny little bugs very annoying. Then I switched to JSFiddle but the lack of a live reload was bothering me. Then came CodePen and it was kind of a revelation.

Shortly after the launch, I spent a huge amount of time on CodePen to play with CSS. Back in the days, I did between 1 and 5 pens a day (inspired from Dribbble), most of them hitting the front page. It was very amusing. Now, I’m not doing much anymore because I use my free time for Codrops as part of articles.

Anyway, if you’d like to have a glance behind the scenes of CodePen, [David Walsh recently interviewed Chris Coyier about it](https://davidwalsh.name/codepen-interview). They talk about challenges to get there, technical details and of course what’s planned for the future.

I’ve made a comparison of these 4 playgrounds as a table for more clarity. Here is [the JSFiddle](https://jsfiddle.net/FDDed/13/embedded/result/). Yeah, I made a **JSFiddle**, because on CodePen everything is public, and I don’t want to drop those kind of things there. It’s probably one of the only bad sides of CodePen, which will be soon gone.

<iframe style="width: 100%; height: 500px; margin: 20px 0;" src="https://jsfiddle.net/FDDed/13/embedded/result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

What about you? What’s your favorite CSS playground?
