---
title: Thoughts on Sanity Studio v3
---

I spent the afternoon migrating a pretty large Sanity Studio from version 2 to version 3. I’m glad I managed to see it through, even though it was pretty challenging at times. I thought I’d jot down my thoughts — in case it helps anyone else upgrading.

## Aliases

Last year, I wrote about sharing code between a Sanity studio and the app it relates to by [configuring Webpack aliases](/2022/05/20/webpack-aliases-with-sanity/). Sanity v3 is no longer built on top of Webpack though; it uses Vite which uses Rollup.

It took me a long time to figure out that the path aliasing configuration needs to be defined in the `sanity.cli.js` file and not the `sanity.config.js` file. Admittedly, it’s a pretty niche feature — especially as the Webpack version was not documented on purpose. Still, I feel like this information could be useful in the [migrating from v2 documentation](https://www.sanity.io/docs/migrating-from-v2) as a small recipe.

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

## JSX files

Any file which ends up including JSX — either directly or indirectly — now needs to have the `.jsx` extension. I must say I’m not exactly sure why this is needed. It is probably possible to configure Vite to work around this, but I ended up renaming my files. Fortunately the error was very explicit and easy to address.

## Styling

~~Style overrides are no longer possible besides just replacing some CSS custom properties with a custom theme. This is a bit of a shame because I used to overwrite some styles to make the studio more friendly/accessible.~~

**Edit:** I was wrong about the inability to apply custom styles. One can just import a CSS file in the `sanity.config.js` file and have them applied globally.

```js
import './global.css'

export default defineConfig({
  /* … */
})
```

## Inconsistent context

Unlike other configuration functions (`document.actions`, `document.newDocumentOptions`, `document.productionUrl`), the `studio.components.toolMenu` configuration function does **not** receive the context, which means it is not possible to get the current user.

Ideally we could do:

```js
const isAdmin = currentUser =>
  currentUser?.roles.some(role => role.name === 'administrator') ?? false
```

```js
// This does not work: `context` is undefined.
{
  studio: {
    components: {
      toolMenu: (props, context) => {
        const tools = isAdmin(context.currentUser)
          ? props.tools
          : props.tools.filter(tool => tool.name === 'default')

        return props.renderDefault({ ...props, tools })
      }
    }
  }
}
```

This makes it inconvenient to customize the available tools based on the user’s role. Right now we have to hack things together by storing the current user on the window object in some other function, which is tad awkward and prone to fail.

Similarly, the `schema.types` configuration does not accept a function but an array of types. A function would make it possible to get the context, particularly the current user, to condition the search engine based on the user’s role.

```js
// This does not work: `schema.types` expects an array, not a function.
{
  schema: {
    types: context => {
      return schemaTypes.map(entity => {
        if (entity.type === 'document' && !EDITOR_TYPES.includes(entity.name)) {
          return {
            ...entity,
            __experimental_omnisearch_visibility: isAdmin(context.currentUser),
          }
        }

        return type
      })
    }
  }
}
```

## New order plugin

Sanity never had a built-in way to order documents within the studio. The general expectation is that documents should be programmatically sorted via the API based on their fields instead of manually in the interface.

Fortunately, there was the [sanity-plugin-order-documents](https://github.com/BretCameron/sanity-plugin-order-documents) plugin that did just that. Unfortunately, it was a v2 plugin, however Sanity shipped its [own official plugin for v3](https://github.com/sanity-io/orderable-document-list).

The new plugin documentation is a little thin to start with, which is in stark contrast with the rest of the Sanity environment which is generally exceptionally well documented.

Perhaps more problematic: while the old plugin added another page entirely to reorder certain document lists (as [illustrated here](https://raw.githubusercontent.com/BretCameron/sanity-plugin-order-documents/master/example.gif)), the new one injects new menus within the main desk tool which makes for an awkward experience.

For instance if you have an orderable “Category” entity type, you end up with a second menu called “Ordering Category” below it (or whatever you call it). And I’d be fine with it if that menu was there only to reorder entries, but that’s not the case: you can do full documents edit within that menu as well, which means you now have 2 places to do the same thing. I’m not sure what limitation they were fighting to cause the interface to be skewed like this.

## New media plugin

The [new official media plugin](https://github.com/sanity-io/sanity-plugin-media) which is supposed to replace the [incredible media library community plugin](https://www.sanity.io/plugins/sanity-plugin-media-library) forces the dark theme while the rest of the studio correctly adapts to the current theme. This was [reported in #86](https://github.com/sanity-io/sanity-plugin-media/issues/86) so it will hopefully be addressed.

## Broken readonly fields

As of version 3, the `readOnly` property no longer works if the field lives inside a fieldset — regardless of whether the fieldset is collapsed or not. It used to work fine in version 2. Peculiar bug I must say, because I wouldn’t have imagined a regression on a core form feature like this one.

This is now [reported in #4124](https://github.com/sanity-io/sanity/issues/4124).

## On the bright side

As you can see, it’s sometimes a little rough around the edges when doing things that are not super basic. That being said, version 3 brings a lot of super nice improvements. In no particular order:

- The configuration being authored in JavaScript instead of JSON is so much more enjoyable to work with. I genuinely think JSON is incredibly ill-suited for configuration files (starting with the absence of comments).
- No more weird `part:` import paths, which is so much cleaner, nicer and easier for inter-operability with other tools. This monkey-patching of the Node resolution algorithm was madness, and I’m glad to see it gone.
- The `document.productionUrl` configuration intended to set up previewing systems can now be asynchronous, which was a pretty frustrating drawback in v2 requiring weird hacks.

I’ll keep updating this article as I learn more about v3.
