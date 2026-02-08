---
title: Feature toggles with webpack
description: A technical write-up on using Webpack to create feature flags/toggles
---

I originally titled this post “Build flags with webpack”, but then remembered that the term _build flags_ is not as popular as _feature flags_ or _feature toggles_, so I renamed it.

The reason I normally make the difference between _build_ flags and _feature_ flags is because I typically define feature flags in a database to toggle them at runtime, unlike build flags which are defined at, well, build time.

Anyway, in this post we’ll see how to set up flags (boolean variables, really) which can be defined at compile time to turn code paths (typically features) on or off. We’ll use webpack here, but the concept can be transposed to other code bundlers like Rollup or Vite.

## What’s the point?

The idea is to be able to work on a feature without making it available just yet. We _could_ maintain a long-lasting git branch until the feature is ready to go, but that can be difficult to maintain, and even harder to eventually merge due to conflicts. By scoping code behind a specific condition, we can keep merging our new code onto the main branch without risking it impacting production.

Beyond that, it is important to _remove_ that code from the resulting JavaScript bundle. It’s better for performance of course since it avoid shipping unreachable (ergo useless) code to the browser — we call that _Dead Code Elimination_ (or DCE for short). It’s also a bit safer since the code won’t end up in the bundle at all, making it unlikely to have any impact.

Funny story: back when I was working at N26, we leaked the upcoming new [Metal cards](https://n26.com/en-de/metal) and their colors ahead of official comms because our dead-code elimination did not work on our translation system. Some tech journalist sniffed our frontend code and found translation strings relating to the upcoming announcement. 🙃

## The `NODE_ENV` way

The most straightforward way to scope upcoming code to specific environments is to rely on the `NODE_ENV` environment variable. The reason this is the most common way to go is because [webpack automatically provides the `NODE_ENV` environment variable](https://webpack.js.org/guides/production/#specify-the-mode) for you based on the [`mode` configuration option](https://webpack.js.org/configuration/mode/). So this should be working out of the box.

Under the hood, webpack will replace `process.env.NODE_ENV === 'production'` with `true` when bundling for production, or `false` otherwise. In either case, the code minifier will optimize the output and either remove the condition if truthy, or the whole code branch if falsy.

For instance:

```tsx
import React, { type FC } from 'react'
import { Layout } from './Layout'
import { Main } from './Main'
import { FeatureInProgress } from './FeatureInProgress'

export const MyApp: FC = () => {
  return (
    <Layout>
      <Main />
      {process.env.NODE_ENV === 'development' ? <FeatureInProgress /> : null}
    </Layout>
  )
}
```

{% info %} We are using JSX in this code snippet, but this has nothing to do with React. It’s just for illustration purposes. {% endinfo %}

After bundling our code for production, `process.env.NODE_ENV === 'development'` becomes `false`, which makes the whole ternary moot, and therefore removed entirely. Because `FeatureInProgress` is no longer used, it gets removed from the tree in its entirety and its code will not feature in the bundle.

The main problem with this approach is that it only supports 2 environments: `development` or `production` and nothing in between. So there is no room for things like a staging environment or whatever have you.

## A more sophisticated approach

The reason we cannot (shouldn’t?) just sneak other options using `NODE_ENV` is because most tools rely on the fact that [`NODE_ENV` is either `development` or `production`](https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production) and nothing else. Technically nothing’s stopping you I guess, but it may be safer to use a different environment variable.

Let’s build something similar to what webpack does out of the box: a [`DefinePlugin`](https://webpack.js.org/plugins/define-plugin/) instance that globally exposes some boolean values based on which environment we are in. From the webpack documentation:

> The `DefinePlugin` replaces variables in your code with other values or expressions at compile time. This can be useful for allowing different behavior between development builds and production builds. If you perform logging in your development build but not in the production build you might use a global constant to determine whether logging takes place. That's where `DefinePlugin` shines, set it and forget it rules for development and production builds.

```ts
import { DefinePlugin } from 'webpack'

type Environment = 'local' | 'development' | 'staging' | 'production'

export const getBuildFlags = (environment: Environment) => {
  return new DefinePlugin({
    __MY_NEW_FEATURE__: environment !== 'production',
  })
}
```

This would be our webpack configuration file (`webpack.config.ts`):

```ts
import { getBuildFlags } from './getBuildFlags'

export default env => {
  const environment = env.environment ?? 'local'

  return {
    // Set up the `mode` option based on which environment we passed as a CLI option
    // See: https://webpack.js.org/configuration/mode/
    mode: environment === 'production' ? 'production' : 'development',
    // Define our build flags plugin to expose global flags
    plugins: [getBuildFlags(environment)],
    // … rest of the config
  }
}
```

And then we’d pass the `environment` value to webpack [via the CLI](https://webpack.js.org/api/cli/#env) like this:

```bash
$ webpack build --env environment=development
$ webpack build --env environment=staging
$ webpack build --env environment=production
```

We can update our code from before like this:

```tsx
import React, { type FC } from 'react'
import { Layout } from './Layout'
import { Main } from './Main'
import { FeatureInProgress } from './FeatureInProgress'

export const MyApp: FC = () => {
  return (
    <Layout>
      <Main />
      {__MY_NEW_FEATURE__ ? <FeatureInProgress /> : null}
    </Layout>
  )
}
```

Just like before, `__MY_NEW_FEATURE__` became `false` after bundling our code for production, which makes the whole ternary moot.

## Improving readability

One thing I like to do to improve readability at a glance is having a lot of well-named constants that can be used as values.

```ts
export const getBuildFlags = (environment: Environment) => {
  const EVERYWHERE = true
  const PRODUCTION = environment === 'production'
  const STAGING = environment === 'staging'
  const DEVELOPMENT = environment === 'development'
  const LOCAL = environment === 'local'
  const NOWHERE = false

  return new DefinePlugin({
    // Example of a flag for a feature being actively tested
    __SOFT_DELETION__: !PRODUCTION,
    // Example of a flag for a feature that’s being developed
    __REACT_19__: LOCAL || DEVELOPMENT,
    // Example of a flag that’s not enabled anywhere
    __LEGACY_USERS__: NOWHERE,
    // Example of a flag that’s enabled everywhere and ready to be removed
    __CONFIRMATION_STEP__: EVERYWHERE,
  })
}
```

## Adjusting tooling

Because we rely on globally available variables, we need to adjust our tools to let them know about that.

### TypeScript

There might be smarter way to do it, but I found that just defining them on the global scope works. If some TS pro has a better approach, let me know.

```ts
import { DefinePlugin } from 'webpack'

export const getBuildFlags = (environment: Environment) => {
  return new DefinePlugin({
    __MY_NEW_FEATURE__: environment !== 'production',
  })
}

declare global {
  const __MY_NEW_FEATURE__: boolean
}
```

If using the [additional constants for readability](#improving-readability), you will either need to:

- manually mark any unused variables as `@ts-expect-error`,
- add `@ts-nocheck` to the top of the `getBuildFlags` file,
- or disable `noUnusedLocals` from your TS config specifically for your webpack config package (if possible).

None of it is great, since [`@ts-ignore` doesn’t support specifying a specific rule](https://github.com/microsoft/TypeScript/issues/19139).

### Biome

Same thing with [Biome](/2024/06/01/from-eslint-and-prettier-to-biome/). Unfortunately, Biome only accepts JSON or JSONC configuration, so there is no way to just derive the globals from our build flags configuration. Maybe in the future?

```json
{
  "javascript": {
    "globals": ["__MY_NEW_FEATURE__"]
  }
}
```

If using the [additional constants for readability](#improving-readability), the underscore prefix should be enough as Biome ignore these variables. Another approach is to disable the `noUnusedVariables` for that specific file:

```json
{
  "overrides": [
    {
      "include": ["./path/to/getBuildFlags.ts"],
      "rules": { "correctness": { "noUnusedVariables": "off" } }
    }
  ]
}
```

### ESLint

On the plus side, ESLint allows authoring configuration files in JavaScript so technically we could import our `getBuildFlags` function. On the other hand, ESLint doesn’t allow authoring configuration files in TypeScript, so if we have authored our `getBuildFlags` function in TypeScript, we need to do [some `ts-node` shenanigans](https://github.com/eslint/eslint/discussions/17726#discussioncomment-8165251).

Either way, we can use our function to extract all the feature flag names and expose them as globals to ESLint:

```ts
const { getBuildFlags } = require('./getBuildFlags')
const flags = getBuildFlags('local')
const globals = Object.keys(flags).reduce((acc, flag) => ({ ...acc, [flag]: true }))

module.exports {
  globals,
  // … rest of the config
}
```

## Wrapping up

Build flags are incredibly handy, particularly in growing codebases with multiple engineers collaborating. It’s important to have a good way to bring in new code without impacting the production system, as well as have a way to remove old code that’s no longer used. Build flags help with these challenges.
