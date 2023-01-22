---
title: Webpack aliases with Sanity
edits:
  - date: 2023/01/22
    md: Added another section to explain how to do that in [version 3](#version-3) which is built with Vite and not Webpack.
---

If you store your [Sanity studio](https://www.sanity.io/studio) in the same repository as the application that relies on it, you get to share code between both projects. It can be pretty handy for things like constants and helpers.

Unfortunately, if your project uses [webpack aliases](https://webpack.js.org/configuration/resolve/#resolvealias) or [Next.js module path aliases](https://nextjs.org/docs/advanced-features/module-path-aliases) to avoid the complexity of relative paths, you might be facing this error:

```
Error in ./schema.js
Module not found: Error: Can't resolve '@/constants/something' in '/Users/kitty/Sites/my-project/sanity'
```

## Version 2

Thankfully, Sanity also uses Webpack as a bundler, so you can fix that by creating a `webpack.sanity.js` file in the root of your Sanity project. Populate the file with the following code (you might need to tweak the aliases or paths to suit your project):

```js
const path = require('path')

module.exports = function (config) {
  config.resolve.alias['@'] = path.resolve(__dirname, '..', 'src')

  return config
}
```

I must warn you that this is **an undocumented feature** on purpose, and Sanity cautions against [extending the Webpack configuration](https://github.com/sanity-io/sanity/blob/81c82a9e553734514dbece66d2244c987a775698/packages/%40sanity/server/src/configs/applyLocalWebpackConfig.js#L17):

> NOTE: We do **NOT** encourage or suggest you extend the Sanity webpack config.
>
> It's very easy to break existing functionality like hot module reloading, production build hashing, css module configuration, part resolution and so on.
>
> We're working towards making the bundling of Sanity studios more configurable, but we're not quite there yet. Treat this as a _last resort_, and if you _do_ choose to go this route, remember that Sanity uses Webpack ^3.8, so loaders, plugins and such needs to be compatible with this version.

I have reasons to believe this will not work in the future so we will eventually have to find another solution. In the meantime, this makes it possible to share code between a Next.js or Webpack-bundled project and Sanity!

## Version 3

Thankfully, Sanity uses Vite as a bundler which is built on top of Rollup, which also supports aliases. However they need to be defined in a `sanity.cli.js` file at the root of the Sanity project, and not in the `sanity.config.js` file:

```js
import path from 'path'
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {},

  vite: config => {
    if (!config.resolve) config.resolve = {}
    if (!config.resolve.alias) config.resolve.alias = {}

    config.resolve.alias['@'] = path.resolve(__dirname, '..', 'src')

    return config
  },
})
```
