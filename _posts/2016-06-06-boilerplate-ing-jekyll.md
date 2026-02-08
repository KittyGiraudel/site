---
title: Boilerplate-ing Jekyll
description: A technical write-up on creating a boilerplate for Jekyll
keywords:
  - jekyll
  - boilerplate
  - framework
---

I have long been a fan of the static website generator [Jekyll](https://jekyllrb.com/). It is a splendid project, fast and efficient, and I cannot count the number of sites I have built with it.

Still, I realised that I was doing the same thing over and over again for every new Jekyll project. It was way past time to create myself a tiny boilerplate. Which I did. Say hi to [jekyll-boilerplate](https://github.com/KittyGiraudel/jekyll-boilerplate).

## What’s in there?

The goal behind this project was to speed up the beginning of projects using Jekyll. Meanwhile, I wanted not to be too opinionated to avoid finding myself in the exact same situation at the other end of the spectrum; and also so that other people could use this starter pack without having to change much.

I feel like I have done a pretty decent job covering [what jekyll-boilerplate does](https://github.com/KittyGiraudel/jekyll-boilerplate) in the project’s README, so feel free to have a look at it to know what’s up. In case you’re lazy, here’s a sum up:

- All the initial set up has been wiped out (example article and page, extra layouts, partials, initial styles, etc.) to start fresh and clean.
- All the assets (images, stylesheets, scripts, etc.) are gathered in a `assets` folder rather than being spreaded in their individual folders at the root of the project.
- The initial configuration has been cleaned up to remove unnecessary options, and provide some default interesting ones (Markdown, Sass, etc.).
- Two gems have been introduced to automate the generation of an Atom feed (`jekyll-feed`) and a sitemap (`jekyll-sitemap`); both running in safe mode to stay compatible with GitHub Pages.
- Some improvements have been performed in order to improve accessibility (use of `main` element, presence of a `lang` attribute…).

## How to use it?

As of today, this is mostly a personal helper so I did not distribute jekyll-boilerplate in anyway, however you can definitely use it by cloning the repository and wiping out the git folder.

```bash
git clone git@github.com:KittyGiraudel/jekyll-boilerplate <your_project_name>
cd <your_project_name>
rm -rf .git
```

## What’s next

You tell me. Feel free to [open an issue on the repository](https://github.com/KittyGiraudel/jekyll-boilerplate/issues) if you have an idea or highly disagree on a choice made in the boilerplate. I’ll be happy to discuss it!
