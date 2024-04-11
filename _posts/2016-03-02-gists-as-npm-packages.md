---
title: Gists as npm packages
keywords:
  - gist
  - npm
  - package
  - github
---

Have you ever heard of “bling dot js”? It is a [few lines of JavaScript](https://gist.github.com/paulirish/12fb951a8b893a454b32) code from no one else but [Paul Irish](https://twitter.com/paul_irish) to mimick the most popular features from jQuery (`$()`, `.on` and iterating on `NodeList`) without all the bloat. Pretty rad.

I wanted to use bling dot js in the latest version of [Sass Guidelines](http://sass-guidelin.es), but it only exists as a GitHub Gist. Not a npm package, not a traditional GitHub repository. Just a Gist. And I really dislike copying and pasting third-party libraries inside a project. Losing connection to the source is quite not ideal.

So [I had a look](https://docs.npmjs.com/cli/install), and it turns out that using a Gist as a npm package is surprisingly easy. The same way you can use GitHub repositories as npm packages, you can use a Gist as a package as long as it has a `package.json` file. After all, a Gist is really just a Git repository with a ridiculously simple UI.

So all I had to do is [fork Paul’s Gist](https://gist.github.com/KittyGiraudel/7d867cda127e64d38f28), add a `package.json` file with the only two mandatory keys, and I was basically done.

```json
{
  "name": "blingdotjs",
  "version": "0.1.0"
}
```

Note that the name and the version does not matter here; feel free to pick whatever. Then, it is possible to install this Gist with its ID (found in the URL):

```sh
npm install gist:7d867cda127e64d38f28 --save
```

That’s it! At this point, you can find the files from the Gist in `node_modules/blingdotjs`. Using it can be as easy as copying the file to your assets folder, or something equivalent.

```sh
cp node_modules/blingdotjs/bling.js assets/js/vendor
```

Or if you want to automatically do it after an install, you can have a post-install hook in your `package.json`:

```json
{
  "scripts": {
    "postinstall": "cp node_modules/blingdotjs/bling.js assets/js/vendor"
  },
  "dependencies": {
    "blingdotjs": "gist:7d867cda127e64d38f28"
  }
}
```

That’s it! I hope it helps. :)
