---
title: Serving Markdown to LLMs with Eleventy
description: A technical walkthrough on how to serve a Markdown version of all pages with Eleventy.
tags:
  - AI
  - Eleventy
  - Liquid
  - Markdown
  - SEO
---

Recently I read Dries Buytaert’s piece, *[Markdown, llms.txt and AI crawlers](https://dri.es/markdown-llms-txt-and-ai-crawlers)*, about how he started serving a Markdown version of every page on his site. He’s not the first, nor is he alone: 
- [WordPress just rolled out something similar](https://www.therepository.email/wordpress-org-now-serves-markdown-output-for-ai-agents-and-developers). 
- [Cloudflare has experimented doing this at the edge](https://blog.cloudflare.com/markdown-for-agents/).
- [Sanity is pushing this too](https://www.sanity.io/blog/how-to-serve-content-to-agents-a-field-guide).

The idea is simple: instead of forcing AI crawlers (and other tools) to chew through all the HTML with all its presentational noise, we give them a clean Markdown version of the same content they can easily digest.

## Why serve Markdown at all

The short version is that AI tokens cost money and HTML is very verbose — Markdown gives you the same content in far fewer tokens. When all you need is the textual content, Markdown is significantly terser and cheaper. 

Every AI pipeline already converts formats internally (Claude, ChatGPT, Perplexity, Gemini…): they all fetch HTML, then spend compute and tokens to turn it into something more like plain text before the model ever sees it. You’re burning context window on cookie banners, nav bars, and `<div>` soup the model doesn’t actually need.

So the case for serving Markdown looks like this:

- Less token waste: Markdown versions are dramatically smaller than full HTML (80–97% reductions in real examples). That means cheaper usage and more room in the context window for *actual* content.
- Less lossy conversion: serving Markdown straight from the source avoids the HTML → heuristics → Markdown round‑trip that can mangle structure or butcher meaning.
- Better for tools and agents: Markdown is trivial to parse, diff, chunk, and feed into RAG systems or coding agents.
- Potentially cheap to add: On a site like this one, where content is written in Markdown to begin with, exposing a Markdown twin per URL is mostly wiring.

{% callout %}
I think it’s worth pointing out that I explicit forbid AI crawlers from going through my website in my [robots.txt](/robots.txt), so this is more of an experiment and an opportunity to learn something than an actual attempt to improve LLMs’ experience with this website.
{% endcallout %}

### Real world data

Cloudflare ran the numbers on their own blog when they launched *[Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/)* and found that the same article weighed 16,180 tokens in HTML vs. 3,150 in Markdown — about an 80% reduction in token usage just by stripping out layout, navigation, and scripts and keeping the content in Markdown instead of HTML.

Sanity saw something similar on their learning platform: a lesson page dropped from ~100K tokens worth of HTML to ~3,300 tokens in Markdown, a 97% reduction when generated from structured content rather than reverse‑engineering the DOM.

I also ran the number for some of my own articles using the rough 4-chars-per-token heuristic:

| Page | HTML | Markdown | Savings |
|:-|:-|:-|:-|
|*[No More Carbon](/2026/03/10/no-more-carbon/)* | 56,654 bytes → ≈ 14,100 tokens | 7,435 bytes → ≈ 1,860 tokens | 87% |
|*[Automatic ToC with Eleventy](/2026/03/04/automatic-toc-with-11ty/)* | 48,060 bytes → ≈ 12,000 tokens | 11,206 bytes → ≈ 2,800 tokens | 77% |
|*[Serving Markdown to LLMs with Eleventy](/2026/03/11/serving-markdown-to-llms-with-11ty/)* | 32,600 bytes → ≈ 8,150 tokens | 12,377 bytes → ≈ 3,100 tokens | 68% |

No matter how you look at it, the results are undeniable: if your content is primarily textual, serving Markdown over HTML to LLMs significantly reduce the amount of tokens necessary for them to use said content.

## The general approach

The idea is not to modify the existing pages at all, and just generate a second version of every blog post using a different template. That template would not render HTML but generate some Markdown instead.

For instance, this article is served at `/2026/03/11/serving-markdown-to-llms-with-11ty/index.html`. We would like to to additionally serve `/2026/03/11/serving-markdown-to-llms-with-11ty/index.md`.

That Markdown file would contain a YAML front matter for metadata, and the original Markdown body of the article (without any HTML). This way, for crawlers and tools, the page would be just:

```md
---
title: "Serving Markdown to LLMs with Eleventy"
date: "2026-03-11T00:00:00Z"
tags:
  - "AI"
  - "Eleventy"
  - "Liquid"
  - "Markdown"
  - "SEO"
canonical_url: "/2026/03/11/serving-markdown-to-llms-with-11ty/"
---

Recently I read Dries Buytaert’s piece, *[Markdown, llms.txt and AI crawlers](https://dri.es/markdown-llms-txt-and-ai-crawlers)*, …
```

## Custom layout

For this website to render {% footnoteref "nice-looking" "I suppose this is subjective, but I find this blog to be nice looking." %}nice looking article pages{% endfootnoteref %}, I currently have an Eleventy layout that renders some HTML, and embellishes the post content with a nice looking title, the date in a human readable format, the reading time, the comment section and more.

We need a new layout that does none of that, and spits out Markdown. Enters `_layouts/post-markdown.liquid`:

{% raw %}
```yaml
{​{ '---' }}
title: "{​{ post.data.title | escape }}"
date: "{​{ post.date | date_to_rfc3339 }}"
{​% if post.data.tags %}
tags:
{​%- for tag in post.data.tags %}
  - "{​{ tag }}"
{​%- endfor %}
{​% endif %}
canonical_url: "{​{ post.url | url }}"
{​{ '---' }}

# {​{ post.data.title }}

{​{ post.data.page | to_markdown_content }}
```
{% endraw %}

There is a lot going on, so here are some notes:
- To output a YAML front matter, we need to make these triple-dash fences literal, otherwise Eleventy itself will parse them as a YFM.
- We escape the title to make sure it doesn’t risk breaking the front matter in case it contains some YAML sequence.
- We expose the date in a machine-friendly format (namely RFC3339, which looks like `2026-03-11T00:00:00Z`).
- We also provide the tags and the canonical URL to the original article to provide additional context to the LLM.
- Finally, we output the title (mine is not part of the page content itself), as well as the page content {% footnoteref "to-raw-markdown" "The <code>to_markdown_content</code> filter is a custom Liquid filter I added to my configuration to strip out the YAML front matter. I briefly touched on something similar in <em><a href='/2026/03/02/stats-page-with-11ty/#dealing-with-the-front-matter'>Stats Page with Eleventy</a></em>." %}**without** its original YAML front matter{% endfootnoteref %} since we write our own.

### Cleaning and optimizing content

Out of curiosity and in order to improve the results, I asked Cursor…

**What is the best format for YAML lists?**  
It seems to imply that using a multi-line list is unambiguous and “better for tooling”, so that LLMs and scripts do not have to guess or split on commas. I am skeptical, but who am I to judge.
  
**Whether Liquid shortcodes should be removed?**  
I sometimes use things like `{​% callout %}` in my articles and I was wondering if I had to strip these out, since they’re not actually Markdown. It said that they’re generally fine for LLMs and typically treated as a semantic hint if 
anything.  

**Whether HTML entities like `&shy;` are a problem?**  
It said they’re “fine” in the sense that everything will still work, and most LLMs will decode them correctly. But for Markdown twins aimed at agents, stripping layout-only entities like `&shy;` entirely could be worth it since they just add 
noise and can hurt tokenization. I’ve implemented a small solution with the formidable [he](https://github.com/mathiasbynens/he) package.

```js
function to_markdown_content(page) {
  try {
    const inputPath = page?.inputPath
    if (!inputPath) return ''

    const source = fs.readFileSync(inputPath, 'utf8')
    const content = stripFrontMatter(source)

    return he
      .decode(content)
      .replace(/[\u00AD\u200B\u200C\uFEFF]|\u200D/g, '')
  } catch {
    return ''
  }
}

function stripFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  return match ? match[2].trim() : raw.trim()
}
```

### Using the new layout

To understand how to make this happen, I had to dig back into how Eleventy works in the first place. Right now, here how blog posts are generated.

My Eleventy configuration defines the whole repository as an input directory. It also defines `.md` as a supported template format. This means Eleventy finds all my blog posts authored as Markdown in `./_posts`. Then, it applies the [data cascade](https://www.11ty.dev/docs/data-cascade/), and finds the JSON file at `./_posts/_posts.11tydata.json` which contains: 

```json
{
  "layout": "post",
  "permalink": "/{​{ page.date | date: '%Y/%m/%d' }}/{​{ page.fileSlug }}/"
}
```

This essentially *supercharges* the existing metadata from each post with which template it should use to render them, and where it should render them. This is just to avoid having to specify these 2 fields manually in every single post page.

Now, we cannot easily tell Eleventy to render a page twice with different layouts and permalinks. We need to create a complete other entry point that instructs Eleventy to process the whole posts collection in a different way again. 

To do so, I have created a Liquid file which contains this:

```yaml
---
layout: post-markdown
permalink: "{​{ post.url }}index.md"
pagination:
  data: collections.posts
  size: 1
  alias: post
eleventyExcludeFromCollections: true
---
```

When Eleventy finds this file, it iterates over the `posts` collection (`1` post at a time) and renders each entry using our new `post-markdown` layout (passing the post itself as `post`), and a permalink that simply appends `index.md` to the existing post URL.

The end result:

- `/YYYY/MM/DD/slug/index.html` for human-facing HTML.
- `/YYYY/MM/DD/slug/index.md` for the machine-friendly Markdown twin.

### Development performance

All of this is nice, but doing a bunch of extra file reads and writes in development is not. I have 400 articles on this website, which means an additional {% footnoteref "external-posts" "About a quarter of all articles were written for external publications like CSS-Tricks, so their content doesn’t actually live on this website directly. There is a technically a page with a <code>&lt;meta http-equiv='refresh'&gt;</code> for these, but they don’t need their own Markdown version, so I’ve discarded them as well." %}400 files to write{% endfootnoteref %} with every save. It can get slow (although I haven’t measured, so maybe this is premature optimization).

To disable it while in development, we can tell Eleventy to ignore our new page processor:

```js
// .eleventy.js
export default function (config) {
  // …

  if (process.env.NODE_ENV !== 'production') {
    config.ignores.add('_pages/blog/index-markdown.liquid');
  }

  return { dir: { /* … */ } };
}
```

No entry point, no Markdown variants.

## SEO and discoverability

### Alternate links 

Right now, nothing links to the Markdown files. Crawlers would have to guess the `index.md` pattern or stumble across them. To make them easier to discover (and slightly more “official” so to speak), we can advertise them from the HTML pages with a `rel="alternate"` link — not unlike RSS feeds.

In our HTML post layout, we can render the following `<link>` element in the `<head>` of the page:

```html
<link
  rel="alternate"
  type="text/markdown"
  href="{​{ page.url | url }}index.md"
/>
```

We can do the same thing in the `sitemap.xml` page:

```xml
<link href="{{ post.url | prepend: site.url }}" />
<link
  rel="alternate"
  type="text/markdown"
  href="{{ post.url | prepend: site.url }}index.md" />
```

This basically says “there is an alternate Markdown representation of this HTML page at this URL”. The canonical page is still the HTML one (we also export it as `canonical_url` in the Markdown front matter).

Will every bot respect it? Hard to say, but most likely no. But for the ones that care or that can infer meaning from it, it’s a very cheap signal to provide.

### Deindexing Markdown files

I don’t particularly want users to land on the raw Markdown pages via search. They’re meant as a machine‑readable representation, not for public consumption. Since this site is hosted on Netlify, I can control indexation via [headers in the `_headers` file](https://docs.netlify.com/manage/routing/headers/).

A minimal rule to discourage search engines from indexing Markdown variants is:

```text
/*.md
  X-Robots-Tag: noindex
  Content-Type: text/markdown; charset=utf-8
```

This tells crawlers that respect [`X-Robots-Tag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Robots-Tag) to treat `*.md` URLs as usable but not indexable — which is what we want for LLMs / tools.

{% callout %}
While inspecting the [Markdown version of this page in the browser](/2026/03/11/serving-markdown-to-llms-with-11ty/index.md), I noticed some [mojibake](https://en.wikipedia.org/wiki/Mojibake) like `56,654 bytes â†’ â‰ˆ 14,100 tokens`. This is because without the usual `<meta charset="utf-8">`, content gets interpreted as ISO‑8859‑1&shy;/&shy;Windows‑1252 instead of UTF‑8 by the browser. 

This shouldn’t happen to LLMs and crawlers, but just in case we can force encoding to UTF-8 by returning the `Content-Type: text/markdown; charset=utf-8` HTTP header for these Markdown versions.
{% endcallout %}

### What about content negotiation

[Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation) is a mechanism for serving different representations of the same resource at the same URL depending on the context. It’s not a novel idea, and is used all over the place, from image formats to internationalization purposes.

So there is this idea that LLMs could be requesting Markdown by sending a `Accept: text/markdown` HTTP header. There are two main problems with this approach:

1. According to [Dries Buytaert](https://dri.es/markdown-llms-txt-and-ai-crawlers#:~:text=No%20AI%20crawler%20uses%20content%20negotiation.%20Not%20one.%20They%20only%20discover%20the%20Markdown%20pages%20through%20the%20dedicated%20URLs%2C%20and%20only%20via%20the%20auto%2Ddiscovery%20link.%20To%20be%20fair%2C%20the%20auto%2Ddiscovery%20link%20points%20to%20the%20.md%20version.), no AI crawler uses content negotiation at this point (see full quote below). 
2. This is a statically generated website, so there is no real server-side logic that can detect that header to send the Markdown version. Netlify is hosting, so I suppose an [edge function](https://docs.netlify.com/build/edge-functions/overview/) would be doable, but given point #1, this seems rather moot.

> No AI crawler uses content negotiation. Not one. They only discover the Markdown pages through the dedicated URLs, and only via the auto-discovery link. To be fair, the auto-discovery link points to the .md version.

## Closing thoughts

I don’t know. At some point I was thinking “why are we optimizing the web for machines?” and then realised we’ve been doing it for decades already — we just called it SEO.

I guess the difference is that we did that to improve our ranking in search results. This time around, we are optimizing *our* websites to make it cheaper for machines that *steal our content* to send it to other people. It feels weird.

Nevertheless, this was a fun experiment, which was made surprisingly easy thanks to Eleventy and Netlify. It’s very low-effort to set up, and it’s basically transparent: there is virtually nothing needed for the Markdown version to be automatically generated and provided with any new article.

So that’s that.