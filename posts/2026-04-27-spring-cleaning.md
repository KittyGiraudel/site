---
title: Spring Cleaning
description: A walkthrough on all the recent changes to the site, from content to appearance to SEO.
tags:
  - Design
  - UI
  - UX 
  - Eleventy
  - SEO
---

The sun is shining, I have plenty of time as I’m [still looking for a job](https://www.linkedin.com/posts/kitty-giraudel_dear-network-im-still-looking-for-my-next-activity-7451986756494663680-6Br8) so I’ve poured a lot of work into this website to clean up and improve things. I want to share the highlights in this article.

## New navigation

Except for some [recent design tweaks](/2026/02/26/nerdy-design-details/) in February, this website has remained virtually unchanged since as far back as 2020, which is when I [ported it to Eleventy](/2020/11/30/from-jekyll-to-11ty/). I couldn’t find a Wayback Machine snapshot dated earlier than that, so I’m going to assume this is also when I redesigned it.

I’ve finally bitten the bullet and moved the navigation out of the content column. It took me a little while to come up with something I didn’t hate, and I’m still not enamored with it, but I feel it’s better than it used to be. It’s more anchored, it’s more usable, and breaks the centered column flow a little. Also, the skip link fits very nicely within it.

On the plus side, this enabled me to play with the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) for the first time, for the mobile version (thanks to [John Dalesandro for his instructive article on the matter](https://johndalesandro.com/blog/create-a-mobile-menu-with-the-popover-api-and-no-javascript/)). I tried a few approaches where the whole menu was visible at all times before, but there just wasn’t enough room so I decided to switch to a popover menu. It looks nice, I’m happy with it.

{% render "baseline.liquid" feature_id: "popover" %}

## New post head

Moving the navigation out of the way had some unintended design side-effects, and led me to rework the header of blog posts. I’ve made the following changes:

- The title is now start-aligned, instead of being centered. It actually looks better this way (in my opinion that is). On large screens, it’s also pulled into the left margin like other embeds within blog posts, which gives it a nice emphasis that I find aesthetically pleasing.
- There is now an update date below the publication date (see [Update dates](#update-dates) below). 
- The table of contents moved into that header instead of floating to the right of the content, which *really* helped solve a lot of weird layout quirks. It opens like a dropdown on large screens and I think works well enough.

## Update dates

As mentioned above, I’ve added an update date to articles to help figure out how relevant the content still is.

To do that, I wanted to leverage [Eleventy’s built-in support](https://www.11ty.dev/docs/dates/) for `git Last Modified`, which tells Eleventy to extract the date from the last commit touching the file. It has two major downsides though:

1. It only works for a field named `date`. If you want both a publication date and an update date, you end up with `date` being the update date, and have to create a `publication_date` (or whatever) field. This is backward to me: the publication date is the truly important one, and as such should be held in `date`. Not the other way around.

2. It comes with a significant performance hit, due to Eleventy spawning a `git log` subprocess for every single template being rendered, which starts to matter when you have hundreds of files. To be fair, Eleventy mentions that in the docs.

So I’ve shamelessly copied [Jens Oliver Meiert’s approach](https://meiert.com/blog/eleventy-git-last-modified/). The idea is that you compute *all* dates at once in a single pass and store them in a data file so templates can do cheap reads. I’ve made two important changes to their code:


- I’ve recently renamed the directory containing all my posts from `_posts` to `posts`, and of course that caused all posts to be committed. To discard such change, I have used `--diff-filter=M --name-status` and some normalization instead of `--name-only`. This basically ignores file moves which is nice.

{% assign watch_ignore_ref = "I thought I could simply ignore this file from the watcher via <a href='https://www.11ty.dev/docs/watch-serve/#ignore-watching-files'>Eleventy’s <code>watchIgnores</code> API</a> but that’s different: it means “don’t rebuild anything when this file changes”, and not “don’t rebuild this file when anything changes”." %}

- I’ve added caching, because every save {% footnoteref "watch-ignore" watch_ignore_ref %}in watch mode{% endfootnoteref %} causes the data files to be recomputed, which meant re-running the git command, which seemed unnecessary.

I’m pretty happy with the [outcome](https://github.com/KittyGiraudel/site/blob/main/data/git.js), except for the fact that I work so much on this website that most posts end up being marked as recently edited anyway. In principle, this should be helpful for the future. This change also made its way into the sitemap and the RSS feed.

## Deprecation notices

{% assign no_broken_links_ref = "As a testament of that, my <a href='https://github.com/KittyGiraudel/site/blob/main/public/_redirects'><code>_redirects</code> file</a> is almost 100 lines long. I regularly monitor 404 in the Netlify dashboard, and I issue HTTP 301 redirects for most legitimate errors." %}

I {% footnoteref "no-broken-links" no_broken_links_ref %}make a point not to delete content{% endfootnoteref %} from this website, following the [Don’t Break the Web](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/The_web_standards_model#dont_break_the_web) directive. However, not all content ages the same way. So I’ve introduced deprecation notices to old articles. It looks like this:

{% render "post_deprecated.liquid", date: "2012/12/01", role: "flow" %}

## Content improvement

To mark old articles as outdated, I’ve gone through all articles and took this opportunity to clean up a lot of things:

{% assign sitepoint_removal_ref = "It’s not even that they removed articles. It’s that they republished a different article by a different author on top of the old URL, which means I was sending traffic to someone else’s content on someone else’s website unknowingly. Anyway, I brought back these articles onto this site, the way I authored them back then, even if outdated." %}

- Rescued a handful of articles that {% footnoteref "sitepoint-removal" sitepoint_removal_ref %}SitePoint silently removed{% endfootnoteref %}. 
- Fixed a bunch of old typos, broken Markdown and clumsy wording.
- Removed all broken links to the now defunct Sassmeister website and replaced them with links to GitHub Gists where the content was backed up.
- Cleaned up some old HTML still present in Markdown posts.
- Created proper Liquid partials for [CodePen embeds](https://github.com/KittyGiraudel/site/blob/main/includes/codepen.liquid) and [figure elements](https://github.com/KittyGiraudel/site/blob/main/includes/figure.liquid).
- Removed old Twitter embeds and replaced them with simple quotes.

And a few things that are a bit more stylistic:
- Normalized the casing of every article title to use [title case capitalization](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case).
- Used the *&* character where relevant in titles because it just looks gorgeous in Baskerville.
- Replaced a bunch of em dashes with commas or parentheses — apparently the em dash is no longer cool.
- Had some fun with smiley faces. :)

## New lists

As shown in the previous section, I’ve updated the appearance of lists (mostly unordered but also ordered a bit) to be more spacious and provide more breathing room. I used to rely on the default browser styles, and decided to go for something custom instead.

I’ve added a small animation to them so they fade into the viewport as you scroll past them. It was really a pretext to use scroll-driven animations, based on an experiment from [Adam Argyle](https://nerdy.dev/). 

```css
@media (prefers-reduced-motion: no-preference) {
  .Post li {
    animation-fill-mode: both;
    animation-name: fade-in;
    animation-range: entry 25% cover 50%;
    animation-timeline: --item-timeline;
    view-timeline-name: --item-timeline;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

{% render "baseline.liquid" feature_id: "scroll-driven-animations" %}

## Animated theme switcher

I’ve found this other [cool demo by Adam Argyle](https://codepen.io/argyleink/pen/NWZZPLZ) leveraging the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) to animate the change of theme. I’ve tweaked his code a bit to match the design of this website better, and I really love the transition effect. It basically swoops outward from the button in the bottom right corner. Try it!

{% render "baseline.liquid" feature_id: "view-transitions" %}

## Baseline widget

As you can see, I’ve introduced a widget for [baseline support](https://web.dev/baseline). It uses the [baseline-status](https://github.com/web-platform-dx/baseline-status) web component, which I [integrated in Eleventy following Stuart Robson’s article](https://www.alwaystwisted.com/articles/adding-baseline-status-to-my-eleventy-site).

It’s nice overall, but I’m particularly unhappy with the fact that [it weighs 65Kb](https://github.com/web-platform-dx/baseline-status/issues/16), even if I conditionally and asynchronously load it. For reference, my entire home page weighs 75.9kB, and that’s including a stupid 52.9kB `apple-touch-icon.png` file, so 23kB really. This is 3 times as big.

Also, I couldn’t find a way to tweak the focus styles of the `summary` element which lives inside the Shadow DOM. No big deal, the component looks very clean anyway.

## Tabbed code blocks

I was browsing [Roman Komarov’s fantastic website](https://kizu.dev/) when I stumbled upon his write-up about [responsive tab size](https://blog.kizu.dev/responsive-tab-size/) within code blocks. I’ve been thinking about this problem in the past, wanting to have smaller indentation on mobile where there is less room.

Turns out he has some magic up his sleeve:

```css
pre {
	container-type: inline-size;
}

pre code {
	tab-size: round(up, 100cqi / 20ch, 2);
}
```

{% render "baseline.liquid" feature_id: "container-queries" %}

This is lovely and it works like a charm, but none of my code blocks used tab indentation. I thought it would be a nightmare to convert everything, but Cursor absolutely nailed it out of the park. It quickly wrote a solid script, converted all 1,000 or so code blocks to tabs, and that was that. 

Perk of that conversion: [tabs are better for accessibility anyway](https://www.reddit.com/r/javascript/comments/c8drjo/nobody_talks_about_the_real_reason_to_use_tabs/), so I’m glad it’s finally done. The only thing I need to figure out is how to make sure I keep using tabs for new code blocks, because my editor defaults to spaces and I’m likely to forget.

## Logical properties

More as a learning opportunity than anything else, I’ve updated all CSS to use [logical properties and values](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values). That means `padding-left` becomes `padding-inline-start`, `margin-bottom` becomes `margin-block-end` and so on. In the process, I’ve learned a few things:

- The `float` property accepts `inline-start` and `inline-end` in lieu of `left` and `right`. Floats are largely obsolete, but I still use it on the home page for a controlled case. 
- Border logical properties exist: `border-<inline|block>-<start|end>`. There are a few places where I use some specific borders, which I could convert to use these properties.
- Rounded corners logical properties also exist, and they can be a bit wacky. Namely, the `border-start-start-radius` looks funky but makes sense (`start` side on both axis).
- Interestingly, the `linear-gradient()` function *does not* accept logical properties for its angle argument. You cannot use `to end` in place of `to right`. This is a bit of a shame I’d say? I wonder whether there is an open issue somewhere about it.

[Adrian Roselli has a lovely article](https://adrianroselli.com/2019/11/css-logical-properties.html) and diagram to illustrate the differences on CodePen:

{% render "codepen.liquid",
  user: "aardrian",
  slug: "bGGxrvM",
  title: "Logical Properties Mapping",
  height: 640
%}

{% render "baseline.liquid" feature_id: "logical-properties" %}

Of course it doesn’t matter too much for this blog since I write almost exclusively in English, and the few pieces of content that are not in English are still not in languages written right-to-left, but still. It’s nice to know it *would* work flawlessly. Potentially it could be helpful if someone was to use a browser extension to translate content in, say, Persian or Arabic.

You can toggle <abbr title="Right-to-left">RTL</abbr> mode for the whole document with this button, if you just want to try it:

{% render "demos/rtl.liquid" %}

## SEO improvements

While doom-scrolling LinkedIn, I stumbled upon this [GEO/SEO guide for Claude](https://github.com/zubair-trabzada/geo-seo-claude). I didn’t want to blindly install it because I am being cautious with AI and live in fear of prompt injection, so I’ve manually set up some Claude agents the way that plugin does. 

After running them on this website, I came across some opportunities to improve SEO:

- Introduced [JSON-LD structured data](https://json-ld.org/). I was using [microdata](https://schema.org/docs/gs.html) somewhat successfully so far, and now combine both approaches. 
- Tweaked the robots.txt file to be more kind to our AI overlords. 🙄
- Made it so when an article displays an image that can be used for Open Graph purposes, it now does.
- Optimized the favicon mess.

## Final Jekyll extinction

Since I edited most files anyway with all the aforementioned changes, I’ve decided to address one of the last remnants of the Jekyll era and renamed all folders using an underscore prefix (e.g. `_includes` now `includes`). It’s just unnecessary with Eleventy, where we have more granular control over what gets built and how. 

I’ve also replaced the now long defunct [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search) script with a simple homemade one.

The last real testament of this blog having ever used Jekyll is the URL pattern for posts, which is `/YYYY/MM/DD/slug/`. Had I built this website today, I’d drop the date from the URL entirely. Too late now.

## Wrapping up

Overall, I’m very pleased with how it all turned out. I know it’s not super significant, and most people won’t notice any of that, but it feels good, you know. It’s like when you deep-clean your kitchen, or go through your wardrobe. It’s good for the soul.