---
title: From Jekyll to 11ty
templateEngineOverride: md
keywords:
- jekyll
- 11ty
- eleventy
- blog
---

Over the weekend, I decided to migrate my website from [Jekyll](https://jekyllrb.com/) to [11ty](https://www.11ty.dev/). If I’m being honest, there was no good reason for me to change blogging systems. I like Jekyll. I have been using Jekyll since 2013 and have built countless sites with it. 

I guess I wanted to try 11ty since it’s all the cool kids talk about nowadays. Additionally, it feels nice leaving Ruby behind because that’s a pain to deal with as far as I’m concerned. 11ty is built on Node.js, which is more up my alley. 

Paul Lloyd wrote [a very good article on migrating from Jekyll](https://24ways.org/2018/turn-jekyll-up-to-eleventy/). [So did Steve Stedman](https://stedman.dev/2020/04/29/make-the-jump-from-jekyll-to-javascript/). [And Alex Pearce](https://alexpearce.me/2020/06/jekyll-to-eleventy/). And probably other smart people. I’d like to add my own contribution to the growing collection of articles about coming from Jekyll.

I’m mostly going to expand on things that took me a while to figure out, hoping to help other poor souls lost in their journey. Find a short table of contents below:

- [TL;DR](#tldr)
- [Posts & permalinks](#posts-permalinks)
- [Heading anchors](#heading-anchors)
- [Markdown & Liquid](#markdown-liquid)
- [Jekyll filters](#jekyll-filters)
- [Production specific code](#production-specific-code)
- [Wrapping up](#wrapping-up)

## TL;DR

Overall, the migration was relatively smooth. It took me about 10 hours spread across a week-end, so I consider it an affordable amount of time for what is essentially changing build systems. 

Here are some things I do like a lot from 11ty:

- The configuration is really enjoyable to use. I like that it does not live in a JSON file which sometimes lacks flexibility, and that it exposes a class with lots of helper utilities to configure compilation.
- I felt helped with templating errors. I don’t now to which extend 11ty customises error reporting to make it friendly, but it’s overall pretty good I would say.
- The pagination is overall better than the Jekyll one I feel, because it can be used on any collection instead of exclusively for the posts. 
- The automatic browser reload is a really nice touch that does not exist in Jekyll. It’s not much, but it’s appreciable during development. 

And some of the things I was either a little frustrated or not super happy with:

- I find the handling of global variables confusing at best. In Jekyll, I knew the difference between variables on the `include`, `page` or `site` objects. Here everything sort of blends together in an opaque way. 
- I personally like YAML over JSON, and it was a little disappointing [not being able to maintain my data files in YAML by default](https://www.11ty.dev/docs/data-custom/#yaml). Not a huge deal, but I find authoring JSON tedious compared to YAML.
- There is a lot of documentation, and the maintainers clearly care a lot about it—yet it did feel like there were some glaring caps somewhat. For instance, it was unclear to me how to issue a production build or how to [maintain dynamic permalinks over a collection](#posts-permalinks)—both of which I’d consider pretty basic things. 

That being said, I am overall pleased with the migration and the tool as a whole. Interesting thing to point out is that the compilation didn’t get much faster for me: both systems take about 2 seconds to compile hundreds of pages. 

Anyway, without further ado let’s dive in.

## Posts & permalinks

I have about 300 articles on this blog, so there was no way I would do anything manually. Even an automated script would have been a pain, so I was really looking forward to preserving everything about the blog as is through the configuration only. I started by configuring a custom collection for posts:

```js
config.addCollection('posts', collection =>
  collection.getFilteredByGlob('_posts/*.md')
    .sort((a, b) => b.date - a.date)
)
```

I use this collection in multiple places: in the blog, but also on the home page to list the most recent articles as well as in the RSS feed. I figured it was easier to sort the collection once in the configuration rather than everywhere I look up `collections.posts` since 11ty sorts it chronologically by default.

Now, Jekyll being a *blogging* system at the core, it treats posts as first-class citizens and expects an article’s date to be in its slug—for instance `2020-11-30-from-jekyll-to-11ty.md` would then be compiled into `/2020/11/30/from-jekyll-to-11ty/index.html`.

In its documentation, 11ty explains pretty extensively how to handle permalinks, but not really how to define a permalink pattern for an entire collection. It took me a while to figure out that I needed to create a `_posts.json` file in the `_posts` directory with the following JSON:

```json
{
  "layout": "post",
  "permalink": "/{{ page.date | date: '%Y/%m/%d' }}/{{ page.fileSlug }}/"
}
```

This way, every article has its permalink defined based on its file name, and it is not necessary to manually author the `permalink` property in every single post. Same thing for the `layout` property.

## Heading anchors

I do not provide an anchor for every single heading, but I do rely on headings having an `id` attribute to create table of contents in long articles like this one. I used to rely on Kramdown and its GFM option for that, but 11ty uses [markdown-it](https://github.com/markdown-it/markdown-it) which [does not come with automatic heading `id` generation](https://github.com/markdown-it/markdown-it/issues/28).

To preserve that behaviour, we need to use our own markdown-it instance, as well as the [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) plugin. The latter comes with unicode support by default, which is not what GFM defaults to, so we also need to use [uslug](https://github.com/jeremys/uslug) [as a slugifier](https://github.com/valeriangalliat/markdown-it-anchor#unicode-support) to come closer to the original behaviour. 

```js
config.setLibrary(
  'md',
  markdownIt({ html: true }).use(markdownItAnchor, { slugify: uslugify })
)
```

The last thing I couldn’t solve was that the GFM slugifier would maintain consecutive hyphens while uslug doesn’t. For instance, “Posts & permalinks” gets slugified as `posts--permalinks` with GFM, but `posts-permalinks` with uslug.

## Markdown & Liquid

Jekyll, for good or for bad, seems to be playing fast and loose with file extensions. You can have Markdown in Liquid files, Liquid in Markdown files, or use the `.html` extension, and Jekyll would process everything mostly how you expected it to.

11ty is a little more conservative with that which is probably a good thing. Liquid files do not compile their content as Markdown, which means everything needs to be authored as HTML in them. That can be a little cumbersome, especially when there are a lot of links within paragraphs, since they are way more convenient to author in Markdown.

To work around the problem, I decided to use the `.liquid` file extension everywhere, and expose a `markdown` Liquid tag which would compile its content to Markdown.

```js
config.addPairedShortcode(
  'markdown',
  content => markdownIt().render(content)
)
```

Then, I can safely author Markdown content within Liquid files:

```
{% markdown %}
My name is Kitty. I’m a non-binary web developer in Berlin. I have led
the web team at [N26](https://n26.com) for over 4 years and am about
to get started at [Gorillas](https://gorillas.io). I specialise in
accessibility and inclusivity. For a longer version, [read more about
me](/about/).
{% endmarkdown %}
```

Surprisingly enough, [11ty compiles Markdown files with Liquid](https://www.11ty.dev/docs/config/#default-template-engine-for-markdown-files) by default which can be pretty annoying in an article like this that contains Liquid syntax in code blocks since it gets evaluated literally. I had to disable the Liquid renderer for this specific article (and similar ones mentioning Liquid syntax in code snippets) by adding this to the YAML front matter:

```yml
templateEngineOverride: md
```

## Jekyll filters

The nice thing about Jekyll is that it comes with [a collection of Liquid filters](https://jekyllrb.com/docs/liquid/filters/) to help with rendering. These filters do not exist in 11ty, so I had to recreate them. Fortunately, it’s relatively easy as they can be authored with JavaScript and injected into the configuration:

```js
config.addFilter('date_to_string', dateToString)
config.addFilter('date_to_xmlschema', dateToXmlSchema)
config.addFilter('group_by', groupBy)
config.addFilter('number_of_words', numberOfWords)
config.addFilter('sort_by', sortBy)
config.addFilter('where', where)
```

If you would like to read the code for these filters, open [the `.eleventy.js` file on GitHub](https://github.com/kittygiraudel/site/tree/main/.eleventy.js).

## Production specific code

I used to have 2 Jekyll configuration files: one for the production site (`_config.yml`), and a development one which overrides some settings during development (`_config.dev.yml`). The first would expose an `environment` global set to `production`, and the second would overwrite it to `development`. Then I would read `site.environment` to know whether to register the service worker for instance.

As far as I understand, 11ty does not have a concept of environment. There is no such thing as a production build vs a development one. If anything, the development environment is just a build with watchers enabled. So it took me a while to come up with a way to know in which environment the code is compiled.

Only the [Nunjucks templater allows injecting globals](https://github.com/11ty/eleventy/pull/1060) and I didn’t originally get that data files could be authored in something else than JSON, so I decided to create a Liquid tag which would only output its content in production. 

```js
config.addPairedShortcode(
  'production',
  content => process.env.NODE_ENV === 'production' ? content : undefined
)
```

Then I used it in my Liquid templates to wrap content that should only be rendered when the `NODE_ENV` environment variable is set to `production`. I don’t set it anywhere locally, and it’s set to `production` when building on Netlify.

```html
{% production %}
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
  }
</script>
{% endproduction %}
```

Browsing the documentation, I eventually found out that [environment variables can be exposed through a `.js` data file](https://www.11ty.dev/docs/data-js/#example-exposing-environment-variables). That’s what I finally opted for:  `environment: process.env.NODE_ENV`.

```html
{% if site.environment == 'production' %}
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
  }
</script>
{% endif %}
```

## Wrapping up

Would I recommend someone to migrate from Jekyll to 11ty? Not necessarily. Once again, Jekyll is still a robust blogging system. For good or for bad, it is pretty opinionated which makes getting started a little easier in my opinion. 11ty feels more flexible which is nice, but can be daunting at the same time.

That being said, 11ty fills a glaring gap in the static site generator landscape: a simple and extensible platform written on Node which does not enforce the usage of single-page applications like Gatsby can do. In the grand scheme of things, it’s still a recent technology, and I can see it flourish in the next year or two. ✨

On my side, I’m going to experiment with a few things now that my site is built in an environment I can control better, namely:

- Inline the entire website’s CSS into the head to avoid an extra HTTP request.
- Moving some templating logic into custom filters to simplify templates.
- Maybe switching templating language entirely for something a little more robust than Liquid. I got used to Liquid because I had to, but it’s objectively a pretter poor templater which is frustratingly opaque.
- I would like to experiment with using React as a templater. It has already been done, but I want to do it myself to get a better feel of how it would work, especially since it’s more about the challenge of doing it.

That’s it for today folks! Stay safe. 💚
