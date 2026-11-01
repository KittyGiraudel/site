---
title: Playing with CSS Layers
description: A short piece to share that I’ve implemented CSS layers on my website, and the few things I’ve learned on the way.
tags:
  - CSS
image: /assets/images/playing-with-css-layers/banner.avif
---

I am late. It was already in 2022 that Miriam Suzanne wrote her [_Cascade Layers Guide_](https://css-tricks.com/css-cascade-layers/) for CSS-Tricks. And yet, late 2026 is the first time I give a proper look at CSS layers. Between a few years in upper management, and working on CSS-in-JS codebases, I never really got a good opportunity to pay attention to this relatively recent specification.

So over the weekend, I sat down and took a moment to better understand how CSS layers work, and [implement them on this website](https://github.com/KittyGiraudel/site/pull/325). There was no real need, really. Styles are light, and it’s not like I was constantly fighting specificity. But the nice thing about having a personal website is that I can use it for all sorts of experiments and learnings. :)

## In a nutshell

CSS layers intend to fix one of the oldest CSS problems: all styles exist globally within the same context, and their application relies on the specificity of selectors and the Cascade™ — things a lot of styling frameworks have opted to largely ignore, for better and for worse.

The way I understand CSS layers is like this: you define “buckets” of styles, as well as their order, from weakest to strongest. Then you can add styles to whatever bucket you want using the `@layer` directive.

And within each bucket, the usual specificity algorithm applies, *but not across buckets*. So a weak selector (e.g. `p`) in an upper (*stronger*) bucket will take precedence over a strong selector (e.g. `#foo .bar.baz`) in a lower (*weaker*) bucket.

## About this website

I’ve blogged repeatedly about how I handle styling on this website, [most recently in May of this year](/2026/05/11/styles-in-11ty-again/). I carry leftovers from [Sass Guidelines’ 7-1 architecture](https://sass-guidelin.es/#architecture) (old habits die hard) mixed with tactics from my days working on React codebases. In the end, I have a directory structure like this:

```text
css/
├─ base/
│  ├─ base.css
│  ├─ helpers.css
│  └─ favicons.css
├─ components/
│  ├─ abbr.css
│  ├─ baseline.css
│  ├─ blockquote.css
│  ├─ …
│  ├─ theme-button.css
│  └─ title.css
├─ layout/
│  ├─ container.css
│  ├─ footer.css
│  ├─ header.css
│  ├─ main.css
│  └─ navigation.css
├─ pages/
│  ├─ project.css
│  ├─ recipe.css
│  ├─ resume.css
│  └─ stats.css
```

The loading and stitching strategy for all of these styles is explained in depth in the [_Styles in Eleventy (Again)_](/2026/05/11/styles-in-11ty-again/), so we’ll just skip it.

## Defining layers

Ultimately, I decided to align my layers with my directory structure:

1. `base` for all sorts of generic styles.
2. `layout` for the page layout and its core features.
3. `components` for every individual component and widget.
4. `pages` for page-level overrides (like project, resume…).

I’ve added two additional layers to that:

- `vendors` at the front (before `base`) for third-party stylesheets.
- `helpers` at the back (after `pages`) for utility classes that should always take precedence (e.g. `NoPrint`, `VisuallyHidden`…).

This gives us the following layer declaration, placed at the top of `base/base.css` (which is loaded first and everywhere):

```css
@layer vendors, base, layout, components, pages, helpers;
```

{% callout %}
I no longer use a “CSS reset” on this project (besides a couple rules in `base.css`), but conceptually, you’d probably want this reset stylesheet to be on its own (lower) layer.
{% endcallout %}

## Using layers

Once I’ve defined my layers, it became mostly grunt work: go into every single stylesheet, and wrap its entire content with a `@layer` directive pointing at the right layer.

```diff-css
+ @layer components {
	.Fleuron {
		display: inline-block;
		transform: scale(0.75);
		position: relative;
		opacity: 0.8;
		margin-inline: 0.25ch;
	}
+ }
```

For almost all files, the target layer is just the name of the folder they sit in. In the case of `base/helpers.css`, the target layer is `helpers`, our uppermost layer, so that these utilities always take precedence.

## Dealing with third-party styles

I try to limit my use of runtime third-parties on this website as much as possible, but there are some pages that need stuff I don’t want to build myself, namely [charts](/stats/). The way I used to load these styles was with a `<link>` element pointing to either a CDN, or a CSS file that I moved from the `node_modules` folder to a `css/vendors` folder at build time.

The problem is that there is currently no way to link a stylesheet on a specific layer. There is an [open proposal](https://github.com/whatwg/html/issues/7540) to add a `layer` attribute to the `<link>` element but it’s quiet and not implemented anywhere. 

So I’ve ended up converting these `<link>` elements like this:

```diff-html
- <link rel="stylesheet" href="/css/vendors/charts.css">
+ <style>@import url("/css/vendors/charts.css") layer(vendors);</style>
```

## Interesting tidbits

A couple of interesting things worth pointing out after reading through [Miriam’s guide](https://css-tricks.com/css-cascade-layers/):

- Layers can be nested, which would be severely overkill for this project, but could matter in more complex systems. 
- Unlayered styles take precedence over layered styles.
- There is a `revert-layer` keyword to undo the styles applied within the current layer.
- CSS layers have [~97% global browser support](https://caniuse.com/css-cascade-layers), but you could detect support with `@supports at-rule(@layer)`. Ironically `@supports at-rule()` as a worse browser support so don’t do it, but it’s interesting to point out nonetheless.

## Wrapping up

The introduction of CSS layers allowed me to remove a couple of CSS specificity hacks as well as `!important` flags. There weren’t too many, but there definitely were some, and they could almost all be removed and cleaned up once everything was set up properly through layers. Pretty neat!
