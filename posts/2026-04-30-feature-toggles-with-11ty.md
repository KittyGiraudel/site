---
title: Feature Toggles with Eleventy
description: A short technical walkthrough on setting up feature toggles in Eleventy.
tags:
  - Eleventy
  - Liquid
---

As my website grew, I noticed I started using more and more environment conditionals, like checking whether the site is built for development or production (based on the value of the `NODE_ENV` environment variable). It’s not a code smell per se, and there are certainly many reasons to do so:

- Rendering draft posts (development only).
- Initializing the service worker (production only).
- [Generating Markdown alternates for LLMs](/2026/03/11/serving-markdown-to-llms-with-11ty/) (production only).
- [Inlining or minifying resources](/2020/12/03/inlining-scripts-and-styles-in-11ty/) (production only).
- Optimizing watch performance (development only).

{% assign footnote_terminology = "I tend to call them “feature flags”, just out of habit. But I’ve written about this concept in <a href='/2024/07/22/feature-toggles-with-webpack/' style='font-style:italic'>Feature Toggles with Webpack</a> and I called them “toggles”, so I’ll keep using that word for consistency with the other article." %}

Ultimately, I realized I wanted proper {% footnoteref "terminology" footnote_terminology %}feature toggles{% endfootnoteref %}. Let’s see how to set them up in Eleventy.

## In a nutshell

If you do not use TypeScript in your Eleventy project ([more on the TS approach below](#with-typescript)), and author everything in JavaScript, then the simplest approach is to have an object in a JavaScript file somewhere (or even in your `.eleventy.js` file):

```js
const PRODUCTION = process.env.NODE_ENV === 'production'

export const FEATURES = {
	renderDrafts: !PRODUCTION,
	markdownAlternative: PRODUCTION,
	inlineAssets: PRODUCTION,
	serviceWorker: PRODUCTION,
	minifyHTML: PRODUCTION,
	syntaxHighlight: true
}
```

Then, you can read that object in your bits and bobs of JavaScript logic to toggle features appropriately. For instance:

```js
export default function (config) {
	if (FEATURES.minifyHTML)
		config.addTransform('htmlmin', minifyHTML)

	if (FEATURES.syntaxHighlight)
		config.addPlugin(syntaxHighlight)

	if (!FEATURES.markdownAlternative)
		config.ignores.add('pages/blog/index-markdown.liquid')
}
```

### In data files

If you need to access these toggles in your [data files](https://www.11ty.dev/docs/data-global/), you can just import the features object, even if you defined it in your Eleventy configuration file!

```js
import { FEATURES } from '../.eleventy.js'

// Do something with FEATURES.<yourFeatureName>
```

### In templates

And if you need to access them in your Liquid templates (or whatever template format you use), you can expose them via a data file (e.g. `features.js`). Basically just re-export the configuration object so it can be consumed in the templates.

```js
import { FEATURES } from '../.eleventy.js'

export default FEATURES
```

Alternatively, you can re-export only the ones you actually need in the view (and even rename them if desired):

```js
import { FEATURES } from '../.eleventy.js'

export default {
	initialize_service_worker: FEATURES.serviceWorker
}
```

And then in your templates:

{% raw %}
```liquid
{% if features.initialize_service_worker %}
<script>
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
}
</script>
{% endif %}
```
{% endraw %}

## With TypeScript

If like me, you’ve [converted your Eleventy configuration file to TypeScript](https://www.11ty.dev/docs/languages/typescript/#using-a-type-script-configuration-file), things are a bit dicier. That’s because Eleventy doesn’t really support TypeScript out of the box, and relies on [Node.js’ type stripping feature](https://nodejs.org/api/typescript.html) simply not to choke on it.

{% assign footnote_ts_data_files = "If you are reading this and know a way to author Eleventy data files in TypeScript (without needing to compile them manually), please let me know, as I’d like to learn how. :)" %}

The main problem is that {% footnoteref "ts-data-files" footnote_ts_data_files %}data files cannot be authored in TypeScript{% endfootnoteref %}: they have to use plain JavaScript (unless you want to introduce your own compilation step *prior* to running Eleventy). So you can’t have your feature toggles in a TypeScript file, if you need to read them in a JavaScript file.

I decided to go for an interchangeable and standardized format: JSON. Moving our toggles into a `features.json` file at the root of the project:

```json
{
	"renderDrafts": ["development"],
	"markdownAlternative": ["production"],
	"inlineAssets": ["production"],
	"serviceWorker": ["production"],
	"minifyHTML": ["production"],
	"syntaxHighlight": ["development", "production"]
}
```

We can update our `eleventy.config.ts` file to consume that file:

```ts
import FEATURES from './features.json' with { type: 'json' }

const ENV = process.env.NODE_ENV

// …

export default function (config: UserConfig) {
	if (FEATURES.minifyHTML.includes(ENV))
		config.addTransform('htmlmin', minifyHTML)

	if (FEATURES.syntaxHighlight.includes(ENV))
		config.addPlugin(syntaxHighlight)

	if (!FEATURES.markdownAlternative.includes(ENV))
		config.ignores.add('pages/blog/index-markdown.liquid')
}
```

### Stronger types

The problem with using JSON is that consuming said JSON in TypeScript results in an untyped data structure. We can fix that though! For TypeScript usage, we can wrap the JSON import into something more robust:

```ts
import features from '../features.json' with { type: 'json' }

export type FeatureEnv = 'development' | 'production'
export type FeatureName = keyof typeof features
export type Features = { [K in FeatureName]: [FeatureEnv?, FeatureEnv?] }

const FEATURES = features as unknown as Features

export default FEATURES
```

Then we can update our Eleventy configuration file (and other TypeScript files) to import from the new path, without type assertion or casting:

```ts
import FEATURES from './features.ts'
```

## Wrapping up

Not overly complicated in the end, but I had to fiddle with it for a while before getting it to work. Also it’s worth pointing out that this is not the only approach. You can shape that data structure the way you want, as long as you have a way to know whether feature X is available in environment Y. 

I hope this helps. :)