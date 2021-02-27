---
title: Template engines and JavaScript
keywords:
  - template
  - javascript
templateEngineOverride: md
---

I couldn’t find an appropriate title. I recently moved my site from Jekyll to Mixture and took the time to rethink the way I dealt with JavaScript. In this article, I will give you my opinion regarding this topic and show you how I managed to execute conditional JavaScript depending on global variables.

## Template what..?

A template engine is some kind of tool helping you writing markup. [Twig](https://twig.symfony.com/) is the template engine coming with Symfony. Both Jekyll and Mixture uses [Liquid](https://help.shopify.com/themes/liquid/basics), the template engine from Shopify. You may also have heard of Smarty, Mustache.js or Handlebars.js.

The idea behind any template engine is to have template files that can be used and reused, imported and extended in order to have a dynamic, DRY and reusable HTML architecture. In this article, I will mostly talk about Liquid because it is the one used by Jekyll and Mixture, as well as Twig which I heavily use at work.

## What’s the matter?

Template engines expose global variables. In Liquid, those are mostly the ones declared in your YAML Front Matter (the header from every post). In Twig, they can be data passed from the controller, or super-global variables, whatever.

Sometimes, you need to access such variables in your JavaScript code. Let me make this as clear as possible: writing JavaScript in a template file just because you need a variable from a template is not a clean solution. At work, we had developers writing huge chunks of JavaScript in `.html.twig` files because they needed some data from the controller in their JavaScript application. This sucks.

JavaScript should mostly go in `.js` file. Markup should go in template files. Not the other way around. Especially not when it’s getting bigger than a couple of lines.

## Back to the problem

Let’s get back to the initial topic: on my blog, I need to execute some JavaScript snippets depending on the variables declared in the YAML Front Matter from the page I am in. For instance if the article includes a CodePen, I should be able to tell JavaScript to include CodePen JS file. If the article allows comments (which is usually the case), then JavaScript should include Disqus. If I want the article to include a table of contents at the top, then JavaScript should be aware of that and do what needs to be done.

Before moving to Mixture, I handled the problem in a rather drastic (and dirty) way: all templates included a `scripts.liquid` file at the bottom. In this file, I wrapped JavaScript snippets with Liquid conditions. For instance:

```html
{% if post.codepen %}
<script src="… source to CodePen JS file …"></script>
{% endif % } {% if post.comments %} … Disqus JavaScript snippet … {% endif %} {%
if post.tableOfContents %} … Table of contents JavaScript snippet … {% endif %}
```

As you can see, this is not ideal. First, JavaScript lays in a template file. We could work around the issue by moving JavaScript snippets to separate `.js` files, then only include them when needed but we would possibly do several HTTP requests while a single one could be enough. Secondly, it is ugly. Very ugly.

## A possible solution

When moving to Mixture, I took the time to think of how I would solve this issue to end up with a clean and DRY solution. The first thing I wanted to do was putting the JavaScript in a `.js` file, so let’s start with that.

```javascript
// app.js
;(function (global) {
  var App = function (conf) {
    this.conf = global.extend(
      {
        codepen: false,
        sassmeister: false,
        tableOfContent: false,
        tracking: true,
        ad: true,
        comments: false,
        layout: 'default',
      },
      conf || {}
    )

    this.initialize()
  }

  App.prototype.initialize = function () {
    /* … */
  }

  global.App = App
})(window)
```

So what’s going on here? In a JavaScript file, in a closure, we define a new class called `App`, that can be instantiated with an object of options (`conf`). This one is extended with an object of default parameters. When instantiated, it automatically calls the `initialize()` method. Let’s see what it does.

```javascript
App.prototype.initialize = function () {
  if (this.conf.tracking === true) {
    this.tracking()
  }

  if (this.conf.ad === true) {
    this.ad()
  }

  if (this.conf.comments === true) {
    this.comments()
  }

  if (this.conf.codepen === true) {
    this.codepen()
  }

  if (this.conf.sassmeister === true) {
    this.sassmeister()
  }

  // …
}
```

No magic here, the `initialize()` method simply calls other methods based on the configuration. We could simplify the code even more by calling the methods based on the configuration key names:

```javascript
;['tracking', 'ad', 'comments', 'codepen', 'sassmeister'].forEach(
  function (key) {
    if (this.conf[key] === true) {
      this[key]()
    }
  }.bind(this)
)
```

But it’s no big deal, we don’t really need this. And now, the other methods:

```javascript
App.prototype.tracking = function () {
  global._gaq = [['_setAccount', 'UA-XXXXXXXX-X'], ['_trackPageview']]

  this._inject('//www.google-analytics.com/ga.js')
}

App.prototype.ad = function () {
  this._inject('//engine.carbonads.com/z/24598/azcarbon_2_1_0_HORIZ')
}

App.prototype.codepen = function () {
  this._inject('//codepen.io/assets/embed/ei.js')
}

App.prototype.sassmeister = function () {
  this._inject('//static.sassmeister.com/js/embed.js')
}

App.prototype._inject = function (url) {
  var d = document,
    s = 'script',
    g = d.createElement(s),
    z = d.getElementsByTagName(s)[0]

  g.async = true
  g.src = url
  z.parentNode.insertBefore(g, z)
}
```

All resources are loaded asynchronously thanks to the `_inject` (pseudo-)private function.

## So what?

We still haven’t really solved the problem yet. How are we going to pass our Liquid variables to the JavaScript? Well, this is the moment we need to get back to `scripts.liquid` file. No more conditional JavaScript snippets; instead, we instanciate the `App` class.

```html
<script src="/assets/js/main.min.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    var app = new App({
      codepen: {{ post.codepen }},
      sassmeister: {{ post.sassmeister }},
      layout: '{{ post.layout }}',
      tracking: true,
      ad: true
    });
  });
</script>
```

This is the only chunk of JavaScript in a template file. It is called on every page, once the DOM has been fully loaded. It grabs data from the YAML Front Matter in a clean and dynamic way. Than, JavaScript deals with the rest.

## Final thoughts

There you have it. A clean JavaScript application running on template variables, yet not using engine’s conditional tags or being written in a template file.

If you think of anything to improve it, be sure to share. In any case, I hope you liked it. :)
