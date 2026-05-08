---
title: Optimizing Images with Eleventy on Netlify
description: A short glance at the few steps I’ve taken to optimize images on this website, without compromising on build time.
tags:
  - Eleventy
  - Performance
  - Netlify
image: /assets/images/optimizing-images-with-11ty-on-netlify/optimizing-images-with-11ty-on-netlify-generated.jpg
---

I have been very *<span lang="fr">laissez-faire</span>* with image optimization on this website over the years. I assume I used to manually run them through TinyPNG or something back in the days. I generally use very few images, partly because they are often unnecessary for the kind of technical piece I write. 

The other day, I redesigned my [project portfolio](/projects/) and my [speaker page](/talks/) to be more inviting and visual, and with that I had to look into image optimization again. This short article sums up what I’ve done.

## Eleventy comes in strong

I’m not sure when Eleventy started offering a whole [image pipeline](https://www.11ty.dev/docs/plugins/image/). I don’t remember this being a thing when I moved over from Jekyll in 2020, but I could be wrong. In any case, this does so much of the heavy lifting. Here goes:

```ts
eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
	formats: ['avif', 'webp'],
	widths: [640, 960, 1280, 1600],
	htmlOptions: {
		imgAttributes: {
			loading: 'lazy',
			decoding: 'async',
			sizes: '(max-width: 48rem) calc(100vw - 2em), 80ch',
		},
		pictureAttributes: {},
	},
})
```

I’ve decided to ship nothing but [avif](https://caniuse.com/avif) and [webp](https://caniuse.com/webp), that have 95% and 96% support respectively. If you have a browser from before 2020, then too bad for you.

For the widths, I expose 4 different ones to cover most cases: 
- `640` for small viewports, or a sane smallest candidate when the browser picks conservatively
- `960` as a middle ground (tablet-ish, or between sizes)
- `1280` for the typical large (but not insanely large) retina case
- `1600` as a cap for about 2× my main container

As for the `sizes` attribute, I approximate the width of in-column figures: full viewport (minus gutters) on small screens, then `80ch` (the width of my main content container).

{% callout %}
The `sizes`, `loading` and `decoding` attributes can be overwritten on a per-image basis if needed. For instance, for images that are rendered above-the-fold, or in a specific layout.
{% endcallout %}

## Caching on Netlify

Letting Eleventy optimize images worked a treat, but it also caused builds to be significantly longer: from about 1 minute to 2.5 minutes.

Fortunately, Zach Leat (the author of Eleventy) wrote a piece on [how to cache the output of the image transform](https://www.zachleat.com/web/faster-builds-with-eleventy-img/) to speed up builds. 

The strategy goes like this:
1. We tell Eleventy to output the transformed images in a `.cache` directory, which Netlify automatically preserves across builds.
2. During a build, the image plugin will skip a transform if the output file already exists. So, when building on <abbr title="Continuous Integration">CI</abbr>, the files that were restored in `.cache` won’t be recompiled.
3. When the build ends, we tell Eleventy to copy the images from the cache folder into the output directory.

The code goes like this:

```ts
const CACHE_DIR = '.cache/@11ty/img/'
const URL_PATH = '/img/'

eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
	outputDir: CACHE_DIR,
	urlPath: URL_PATH,
	// … rest of the configuration (from above)
})

eleventyConfig.on('eleventy.after', () => {
	if (process.env.ELEVENTY_RUN_MODE === 'serve') return
	if (!fs.existsSync(CACHE_DIR)) return
	const dest = path.join(
		path.resolve(eleventyConfig.directories.output),
		...URL_PATH.split('/').filter(Boolean),
	)
	fs.mkdirSync(dest, { recursive: true })
	fs.cpSync(CACHE_DIR, dest, { recursive: true })
})
```

This brings the build time back to about 1 minute, which is perfect. Also, 1 minute for over 400 pages and 200 images is genuinely good in my opinion. 

## Wrapping up

Nothing ground-breaking and nothing unique to this website either. Zach Leat is the real <abbr title="Most Valuable Person">MVP</abbr> and did everything with his great work on Eleventy. 

Still, this now deals with all my image optimization needs: out of sight, out of mind. :)