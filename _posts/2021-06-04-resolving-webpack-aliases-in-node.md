---
title: Resolving Webpack aliases in Node
description: A technical write-up on resolving Webpack aliases in Node when you need to reference aliased paths outside the bundle
---

Say you have a project bundled with Webpack. And to avoid playing the relative path game, you use [Webpack aliases](https://webpack.js.org/configuration/resolve/) so you can import files from anywhere, always based on the root of your project. It might look something like this:

```js
import myHelper from '~/helpers/myHelper'
```

{% info %} Sometimes, another prefix is used in place of `~/` such as `@` sign or something more fancy. We used a tilde because it kind of means “home” or “root”, so it felt nice. {% endinfo %}

In our case, we have some Node scripts we use in our continuous deployment pipelines, which need to import modules from the project. Things like helpers or constants. The problem is that these aliased paths only really work because Webpack processes them. When going through Node only, they don’t exist and the whole thing crashes.

```
internal/modules/cjs/loader.js:883
  throw err;
  ^

Error: Cannot find module '~/helpers/myHelper'
Require stack:
```

I played with a few solutions until I stumbled upon the [module-alias](https://github.com/ilearnio/module-alias) npm package, which essentially monkey-patches the Node resolution algorithm to make it understand whatever you like.

So at the top of our scripts (in the `bin` folder in our case), we add the following line:

```js
require('module-alias').addAlias('~', __dirname + '/../src')

const myHelper = require('~/helpers/myHelper').default
```

Job done, now our Node scripts can safely import files from our applications despite them being riddled with aliased paths.

Well, almost. There is still the problem that if you application uses `import` and `export` instead of `require` (which is quite likely when using Webpack), our script might be able to find our application files, but it’s going to chalk in any import statement within them.

```
import anotherHelper from '~/helpers/anotherHelper'
^^^^^^
SyntaxError: Cannot use import statement outside a module
```

To make our Node scripts understand and process `import` and `export` statements, we use the [esm](https://github.com/standard-things/esm#readme) module loader. It’s pretty transparent too: instead of doing `node script.js` we do `node -r esm script.js`.

That’s about it. No more duplicating code within our Node scripts just because they cannot import files from the main application. ✨
