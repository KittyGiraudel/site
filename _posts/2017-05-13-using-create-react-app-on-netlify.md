---
title: Using create-react-app on Netlify
tags:
  - netlify
  - create-react-app
  - 404
  - react
---

> **Edit: I missed the fact that there already was [a documented fix](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#netlify) in create-react-app docs using the [redirect feature from Netlify](https://www.netlify.com/docs/redirects/). You might want to prefer that.**

A short article about how to work around the 404 issue with create-react-app on [Netlify](https://www.netlify.com) (and possibly other hosting platforms like [GitHub Pages](https://pages.github.com/)).

## What’s the problem?

When building a client-side React application, routing is usually handled with [React Router](https://github.com/ReactTraining/react-router/). Everything works like a charm until you try to load / refresh a page whose path is not `/`. Then, you hit the 404 wall. Which is just a blank page, really.

This pitfall is documented in [create-react-app README](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#notes-on-client-side-routing). It currently suggests to use a hash router or some very clever yet unfortunate hacks.

## Using a custom 404 file

In their [docs](https://www.netlify.com/docs/redirects/#custom-404), Netlify explains how a `404.html` file can be added so it’s served in case a non-matching URL is requested.

In theory, that works. You can create the file and Netlify will serve it. Except that there is no trace of your JavaScript bundle in this file, and you don’t know its complete file name since it’s being hashed in production (e.g. `main.8626537e.js`).

Indeed, create-react-app dynamically adds the script tag to your bundle (as well as other things) to your `index.html` file when building your project (through `npm run build`). And as far a I know there is no way to tell it to do that on another file or to change the name of this file.

## The solution

The solution ends up being super simple. Duplicate the `index.html` file under `404.html` post-build. To do so, update the `build` task like so:

```json
{
  "build": "react-scripts build && cp build/index.html build/404.html"
}
```

Both files being identical, the app will work the same on the root path or on any path that do not resolve and make Netlify redirect to `404.html`.

That’s it. ✨

PS: I suspect this would work the same on GitHub Pages according to [theirs docs](https://help.github.com/articles/creating-a-custom-404-page-for-your-github-pages-site/). If anyone can confirm, that would be super rad.
