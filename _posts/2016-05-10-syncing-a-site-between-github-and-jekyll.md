---
title: Syncing a site between GitHub and Jekyll
keywords:
  - jekyll
  - github
  - structure
---

The other day, I built a small Jekyll website for [Simplified JavaScript Jargon](https://jargon.js.org). If you are not familiar with the project, it is a community attempt at explaining JavaScript related buzzwords in simpler words to prevent JavaScript fatigue and ease adoption for new comers.

The project has long lived as a self-sufficient GitHub repository (gaining a bit of traction and a lot of stars in the process), but I wanted to given a nicer way for users to browse it. Hence a small Jekyll website.

The thing is, I did not want to make the GitHub repository non-usable anymore. Basically, I wanted everything to work both on GitHub and on [jargon.js.org](https://jargon.js.org). Tricky! I eventually found a way, not without a struggle though so here are a few lines to explain the process.

## The main problem

SJSJ is community-driven. It means that while I take care of the repository and the technical setup, I do not write entries (anymore). Generous contributors do that. They submit a pull-request to add a new Markdown file in the repository, and voila. I wanted this process to remain as simple.

The main problem is that when contributors want to link to another entry from their content, they do something like this:

```markdown
Redux is an alternative to [Flux](/glossary/FLUX.md) and used a lot together with [React](/glossary/REACT.md), but you can use it with any other view library.
```

When clicking such a link on GitHub, it will head to the file `FLUX.md` file located in the `glossary/` folder for instance. Very good. Except that I needed these links to work the same on the Jekyll website.

**One source of content. Two ways of browsing it. Two URL structures. A lot of troubles.**

## How I tried to solve it

I cannot change the way GitHub works (or can I…?), so if I want the entries to be consumable and linkable from both GitHub and Jekyll, I need to dig on the Jekyll side.

It turns out Jekyll 3 has lovely support for [collections](https://jekyllrb.com/docs/collections/). And the nice things with collections, is that you can output pages, iterate on them and even specify the permalink you want. Neat.

I created a `glossary` collection, containing all the Markdown files, outputting pages at `/glossary/<path>/`:

```yaml
collections:
  glossary:
    output: true
    permalink: /glossary/:path/
```

A few problems there already. For starters, a collection folder has to be prefixed with an underscore (`_`) in Jekyll, so the files would actually live in `/_glossary/` but served over `/glossary/`. Secondly, in-content links are rooting to `/glossary/<path>.md`, not `/glossary/<path>/` so they were broken. Bummer. There has to be a way.

## How I actually solved it

The first issue is easily fixed by tweaking the permalink configuration to serve files over `/_glossary/` to have a 1:1 mapping between the folder structure and the URL routing:

```yaml
collections:
  glossary:
    output: true
    permalink: /_glossary/:path/
```

I thought the second problem would be harder to fix, but it turns out I could simply serve entries with a URL ending in `.md`. I believe under the hood all this is just URL rewriting, so it was not an issue at all.

```yaml
collections:
  glossary:
    output: true
    permalink: /_glossary/:path.md
```

Tada! Files are located at `/_glossary/<path>.md`, served over `/_glossary/<path>.md`. 1:1 mapping, site is browsable in both GitHub and Jekyll seamlessly.

![The “AJAX” entry served over /_glossary/AJAX.md in Jekyll](https://i.imgur.com/HVuKEOr.png)

## Final thoughts

Admittedly enough, this is kind of an odd use case to want content to work on both GitHub and a custom website, but I think SJSJ is a good candidate for that.

Thanks to Jekyll friendly handling of permalinks and a bit of trial and error, it turned out to be quite simple to do.
