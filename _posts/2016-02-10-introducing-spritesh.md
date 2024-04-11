---
title: Introducing spritesh
keywords:
  - sprite
  - svg
  - bash
  - scropt
---

We at Edenspiekermann are big fans of [Gulp](http://gulpjs.com/). We use it in most of our projects, even Rails ones to replace or rather connect to the assets pipeline. Gulp is usually responsible for most of our build process in basically any project.

But on small projects, like single page websites or tiny websites, we don’t really need Gulp. However, we still need to be able to build our SVG sprites.

Our usual process with icons here is to have a folder containing them all (one per SVG file), then create a SVG sprite out of it by wrapping the content of each file with a `<symbol>` element (more on that choice in [this article on CSS-Tricks](https://css-tricks.com/svg-symbol-good-choice-icons/)). From there, we can display icons using a `<use>` tag (more on that idea [on CSS-Tricks again](https://css-tricks.com/svg-use-external-source/)).

Typically, Gulp is responsible for building this sprite, but I don’t want us to add Gulp and all its dependencies only to do that. Surely we can do it in shell. How hard can it be? It’s only a matter of reading a folder of files, wrapping each one with a tag, concatenating them, and then wrapper the sprite file with another tag. Let’s do that bash-style!

So I built [a tiny script](https://github.com/edenspiekermann/sprite.sh) to do that. Then, I made the script slightly larger to allow options. And then I made it slightly better to have a clean and formal CLI API. And then I packaged it as a npm module so that it is easy to install and use (even if it has nothing to do with JavaScript).

## Installing it

[spritesh](https://github.com/edenspiekermann/sprite.sh) is best installed globally (with `-g`) than locally but feel free to do otherwise.

```sh
npm install spritesh -g
```

_What’s with the name,_ you ask. Well, at first I called it `sprite` but it was way too common. So I named it `sprite.sh` to indicate that it was a Bash script. And then I just removed the dot because heck, why not.

## Using it

Given how little this script does, using it should be pretty straightforward. Also all options have sensible defaults so that you can actually get started without struggling too much.

Basically you give it an input folder (the current one by default), and spritesh will generate the sprite from the SVG files found. You can then specify a custom viewbox, and a prefix for the `id` attribute of each icon. That’s pretty much it. The rough version would be:

```sh
Usage: spritesh [options]
Script to build a SVG sprite from a folder of SVG files.
Options:
  -h, --help             Shows this help
  -q, --quiet            Disables informative output
  -i, --input [dir]      Specifies input dir (current dir by default)
  -o, --output [file]    Specifies output file ("./sprite.svg" by default)
  -v, --viewbox [str]    Specifies viewbox attribute ("0 0 20 20" by default)
  -p, --prefix [str]     Specifies prefix for id attribute (none by default)
```

Let’s consider a project where the icon files would live in `assets/images/icons`, and the sprite file should be generated in `dist/` and named `icons.svg`.

```sh
spritesh --input assets/images/icons --output dist/icons.svg
```

That’s it.

## What’s next?

You tell me. Feel free to drop by the repository and submit an issue or feature request. Always happy to oblige! :)
