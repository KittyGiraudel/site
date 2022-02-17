---
title: Inlining scripts and styles in 11ty
keywords:
- 11ty
- eleventy
- performance
---

I recently got [Harry Robert’s course on CSS performance](https://gumroad.com/l/eihdtmcwf) (you totally should to, it’s a goldmine of information) and worked on improving performance for this site. I quickly spotted 2 performance {% footnoteref "bottleneck" "Although we are playing fast and loose with the world “bottleneck” here because it really wasn’t that bad." %}bottlenecks{% endfootnoteref %}: requesting the stylesheet, and requesting the main script.

I had about 4.7Kb of CSS, and less than 1Kb of JavaScript, so I figured the HTTP requests weren’t that necessary at all and I could inject styles and scripts directly within the page to avoid HTTP roundtrips. [Inlining CSS](https://www.11ty.dev/docs/quicktips/inline-css/) and [inlining JavaScript](https://www.11ty.dev/docs/quicktips/inline-js/) is explained in the 11ty docs, so not really warrant of a blog post I hear you say.

Now the thing is not all styles are necessary on all pages. For instance, the home page have some components that do not exist anywhere else on the site, and an article page like this one has a lot of styles which are not needed anywhere else (code snippets, figures, tables, post date…). So instead of inlining 5Kb of CSS in the head, most of which would not be needed, I decided to split it across pages.

My CSS (formerly authored in Sass) is split by concern, somewhat following the [7-1 pattern](https://sass-guidelin.es/#the-7-1-pattern) (my JavaScript also follows a similar structure but I’m going to drop it from now on for sake of simplicity). That’s good because that mean I didn’t really have to figure out how to break it down—I only needed a way to include specific parts in specific contexts. Namely:

- Including the core styles (such as layout & typography) in every page.
- Including page-specific styles (blog post, home page, resume…) on specific pages.

## Implementation

The implementation concept is relatively simple: in the `<head>` of the document, include all core styles in a `<style>` tag. And in specific layouts and pages, include specific stylesheets within a `<style>` tag as well. No more `<link rel="stylesheet">` and no more monolithic stylesheet with the entire site’s styles. 

Now, including files can be done with the {% raw %}`{% include %}`{% endraw %} tag. From 11ty ≥0.9.0, it is possible to [include relative paths](https://www.11ty.dev/docs/languages/liquid/#supported-features) so files do not have to live in the `_includes` folder. That means we can keep a project structure like this (irrelevant parts omitted):

```
├── _includes/
└── assets/
    ├── css/
    │   ├── base/
    │   ├── components/
    │   ├── layouts/
    │   └── pages/
    └── js/
```

Now, I wanted to minimise the amount of boilerplate needed to include some specific styles or script in a template, and making it easy to maintain. For instance, in my `post.liquid` layout, I wanted to have this include at the top:

{% raw %}
```
{% include "styles.html", partials: "
  components/blockquote,
  components/code,
  components/figure,
  components/footnotes,
  components/post-date,
  components/post-navigation,
  components/table
" %}
```
{% endraw %}

So I came up with this small `_includes/styles.html` Liquid partial:

{% raw %}
```
{% if paths %}
  {% assign paths = paths | split: "," %}

  {% capture css %}
    {% for path in paths %}
      {% include "../assets/css/{{ path | strip }}.css" %}
    {% endfor %}
  {% endcapture %}

  <style>{{ css }}</style>
{% endif %}
```
{% endraw %}

Alright, so there is quite a lot to unpack here. Here is the breakdown:

1. In case the `paths` argument was not provided, we do nothing.
2. We reassign `paths` from a string to an array by splitting it on commas.
3. We open a capture group, which is basically a block-level variable assignment.
4. We loop over every given path.
5. For every path, we import it from the `assets` folder while making sure to trim it with `strip`. This is what allows us to have the `paths` argument authored across multiple lines for clarity.
6. We close our capture group after having imported the last path, yielding a `css` variable containing all our relevant styles.
7. We render our styles within a `<style>` tag.

{% info %}
The `script.html` partial works exactly the same way except it looks into `assets/js` and renders a `<script>` tag. I guess both partials could be abstracted into a single one, but I don’t think it’s particularly necessary.
{% endinfo %}

## Minification

When it comes to minification, there are a few approaches here. One way would be to have a `cssmin` filter based on [clean-css](https://github.com/jakubpawlowicz/clean-css) (or any other CSS minifier). Inside of the `styles.html` partial, we’d apply `| cssmin` to our CSS so it gets optimised. 

I went a slightly different path and have an [11ty transform](https://www.11ty.dev/docs/config/#transforms) to minify HTML with [html-minifier](https://github.com/kangax/html-minifier). The nice thing about it is that it offers a `minifyCSS` and a `minifyJS` option to compress styles and scripts authored in `<style>` and `<script>` tags respectively. Therefore I have a single transform to minify everything.

I decided to run that transform only in production because a) I don’t like to have compressed styles and scripts in development since it can make them harder to debug and b) minification is actually not cheap and can take a few seconds on a site as small as mine which means it would dramatically slow down compilation.

```js
module.exports = function (config) {
  if (process.env.NODE_ENV === 'production') {
    config.addTransform('htmlmin', (content, path) =>
      path.endsWith('.html')
        ? htmlmin.minify(content, { minifyCSS: true, minifyJS: true, })
        : content
    )
  }
}
```

That’s about it, really. To sum up: no more HTTP requests for my styles and scripts, which improves performance by reducing the amount HTTP roundtrips. Of course, we no longer benefit from caching, but I believe the performance gain is worth it. 

I hope this help! ✨
