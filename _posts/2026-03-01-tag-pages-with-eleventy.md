---
title: Tag pages with Eleventy
description: A short technical write-up about the introduction of tag pages on this blog.
tags:
  - Liquid
  - 11ty
---

{% include "styles.html", partials: "
  components/tags
" %}

Nothing too fancy! Just a short article to share that it is now possible to list all posts tagged with a certain keyword. For instance, to list all posts I’ve written about accessibility, simply head to [this page](/tags/accessibility).

This is not groundbreaking. Eleventy even has [documentation about tag pages](https://www.11ty.dev/docs/quicktips/tag-pages/), which is essentially what I’ve implemented.

## Using variables in the front-matter

On this website, the layout file is responsible for rendering the page title. In the case of the tag page, I wanted to render the name of the tag in the title. My first attempt didn’t work:

```liquid
---
title: "{​{ tag }}"
description: All the posts that are tagged with “{​{ tag }}”.
---
```

This ended up rendering `{{ tag }}` as a literal string, which is not what we want. Instead, we need to use the [`eleventyComputed` special property](https://www.11ty.dev/docs/data-computed/#using-a-template-string). This instructs Eleventy to resolve and inject our variables before returning the content.

```liquid
---
eleventyComputed:
  title: "{​{ tag }}"
  description: All the posts that are tagged with “{{ tag }}”.
---
```

## Removing the “all” page

Eleventy exposes a [special “all” collection](https://www.11ty.dev/docs/collections/#the-special-all-collection), which contains all the content regardless of collection assignment. I didn’t want to end up with a tag page for that special collection, so I filtered it out.

```liquid
---
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
---
```

{% info %}I also noticed that some other collections ended up with their tag page due to the way it’s built, like `recipes`, `snippets`… I’ve updated the filter to remove them as well.
{% endinfo %}

## Including snippets

At some point, I added a [snippets](/snippets/) section to this website, inspired by [Josh W. Comeau](https://www.joshwcomeau.com/snippets/).

I realised it would be nice to also tag snippets, and have them listed in the tag pages as well. The great thing about this is that it just works out of the box since collections are just based on the `tags` property of the front-matter.

## Actually tagging content

If I’m honest, the most difficult part of this whole thing was tagging the content. I have about 400 pages on that website, spanning back all the way to 2012 when I started writing. I made several attempts at tagging the content over the years, and every time I gave up because it was just too much of a chore.

I tried to instruct an AI to do it, and it also failed. It extracted keywords from page titles, slugs and content, but ended up with very awkward results. Take this old [Bringing configuration objects to Sass](/2014/05/05/bring-configuration-objects-to-sass/) article from 2014 for instance. The AI agent would tag it with `configuration`, `objects`, `sass`. And although it’s not wrong per se, it’s also not helpful: I don’t want a “configuration” tag, let alone an “objects” one.

So I eventually accepted I had to bite the bullet and do it by hand. I’ve done several passes on it, and got to a satisfying result. There are very few lonely tags, which is something I wanted to avoid. Here are the top 20 tags:

{% include 'tags.html', tags: collections.postStats.popularTags %}

## Wrapping up

Do we need tag pages? I’m not sure if I’m honest. I can’t imagine many people use them. That being said, I recently wished I had a way to link to _all_ articles I’ve written about a certain topic such as accessibility while writing cover letters for applications. I had hacked something together with query parameters on my [search page](/blog/search/) but this is definitely better since it works without JavaScript. These pages can also be indexed, which I guess is a good thing.

Anyway, that’s about it. ✨
