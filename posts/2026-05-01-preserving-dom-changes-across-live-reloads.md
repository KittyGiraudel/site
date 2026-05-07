---
title: Preserving DOM Changes Across Live Reloads
description: A technical walkthrough about a workaround to preserving client-side DOM changes across live reloads.
image: /assets/images/preserving-dom-changes-across-live-reloads/preserving-dom-changes-across-live-reloads-generated.png
tags:
  - Liquid
  - Eleventy
  - JavaScript
---

As I was working on this website, I stumbled upon a curious little problem: saving a file (like the article I’m working on) caused my theme switcher to be out of sync. 

Rephrased more generically: DOM manipulations that are applied by client-side JavaScript get lost when Eleventy refreshes the page in watch mode.

Of course, it’s a development-only problem, so not a big deal in the grand scheme of things, but still. Here is a quick article about my investigation, and how I fixed it.

## About the theme switcher

The theme switcher is not overly complicated, but there is a bit of logic: it loops between 3 states (light, auto, dark), it stores the preferred theme in local storage, and it respects the OS/browser level preference. This is all neatly packaged in a [`ThemeManager`](https://github.com/KittyGiraudel/site/blob/main/assets/js/theme.js) class for convenience and testability (also very generic, so you could just use it).

Now, on page load, I would resolve the current theme, and assign a `data-theme` attribute to the `<html>` element containing the right theme.

```js
document.addEventListener('DOMContentLoaded', () => {
	// Unfolded code for clarity
	const { theme } = window.ThemeManager
	window.ThemeManager.applyTheme(theme)
	// This resolves auto → light/dark and sets:
	// document.documentElement.dataset.theme = resolveToLightOrDark(theme)
})
```

And on the CSS side:

```css
:root { color-scheme: light dark; }
[data-theme="dark"] { color-scheme: dark }
[data-theme="light"] { color-scheme: light }
```

So far so good.

## About live reloading

{% assign footnote_live_reloading_credits = "Kind thanks to my friend <a href='https://www.moritz.berlin/'>Moritz Kröger</a> for educating me on the topic. :)" %}

Here is how live reloading works {% footnoteref "live-reloading-credits" footnote_live_reloading_credits %}in a nutshell{% endfootnoteref %}: 

1. The server that renders the content injects a small script into the client (e.g. `reload-client.js` or something).
2. That script opens a WebSocket to the dev server that listens to events, and reacts accordingly.
3. From there, it runs the reloading logic (either granular DOM replacements, or full page reloads).

This is not specific to Eleventy — essentially all live reloading solutions work like this. The dev server communicates with the browser via a WebSocket to inform it of changes.

## About Eleventy’s watch mode

Eleventy has [its own development server package](https://www.11ty.dev/docs/dev-server/) for that. When you save a file that’s being watched, it informs the client about it. The client decides what to do based on what was changed.

{% assign footnote_morphdom = "Eleventy’s dev server is <a href='https://www.11ty.dev/docs/dev-server/#options'>surprisingly configurable</a>, and the use of morphdom can be opted-out — although I don’t know why you’d prefer full page reloads to more granular DOM updates." %}

- For external stylesheets, it performs some cache-busting to reload that specific file.
- Otherwise, it {% footnoteref "morphdom" footnote_morphdom %}uses a library called morphdom to perform surgical changes to the DOM{% endfootnoteref %}.
- If all else fails, it performs a full-page reload with `window.location.reload()`. 

There are a lot of reasons why [morphdom](https://github.com/patrick-steele-idem/morphdom) is a great choice here: updating the existing DOM preserves event listeners, scroll position, animations, browser state and more. It makes for a much better developer experience. 

## The problem

Back to our original problem: the file on disk does *not* have the `data-theme` attribute. That attribute is injected with JavaScript.

So when saving a file, Eleventy sends its content (without the attribute) to the client, which compares it with the rendered DOM. Because the existing DOM has the attribute, and the new version coming from the server doesn’t, morphdom removes it.

## ~~The~~ A solution

To address the problem, I decided to insert a small DOM observer watching the `data-theme` attribute. If it disappears, re-apply it with the theme manager. It looks like this:

```js
;(function keepThemeAcrossLiveReload() {
	const root = document.documentElement

	const ensureThemeAttr = () => {
		const { theme } = window.ThemeManager
		const resolved = window.ThemeManager.resolveToLightOrDark(theme)

		if (root.dataset.theme !== resolved) {
			window.ThemeManager.applyTheme(theme)
		}
	}

	const observer = new MutationObserver(() => ensureThemeAttr())
	observer.observe(root, {
		attributes: true,
		attributeFilter: ['data-theme']
	})
})()
```

We don’t want to ship that in production though, so we scope the insertion of that script to development only:

{% raw %}
```liquid
{% if site.environment == "development" %}
<script>
;(function keepThemeAcrossLiveReload() {
	// …
})
</script>
{% endif %}
```
{% endraw %}

Lovely! When saving a file, Eleventy sends its content to the client, which performs DOM diffing, and wipes our `data-theme` attribute. At this point, our observer kicks in, notices the lack of attribute, and re-applies it. Yay! ✨

{% callout %}You can use whatever logic to scope the script insertion to the development environment only. Here, we imagine an `environment` field on a `site` global data object, but it can take another shape. You can also use the [`ELEVENTY_RUN_MODE` environment variable](https://www.11ty.dev/docs/environment-vars/#eleventy-supplied) to detect watch/serve mode.
{% endcallout %}

## A (failed) generic solution

My friend [Moritz Kröger](https://www.moritz.berlin/) and I were out for drinks and discussing this problem, when I voiced what I thought would be a generic solution out loud. What if we had a script that:

1. Applies a unique attribute to the `<html>` element on `DOMContentLoaded`,
2. Observes that attribute to ensure it’s always present,
3. When removed, manually fires the `DOMContentLoaded` event to “remount” the page.

It could look like this:

```js
document.addEventListener('DOMContentLoaded', () => {
	const root = document.documentElement
	root.dataset.hydrated = true

	const hydrate = () => {
		if (!root.dataset.hydrated) {
			window.document.dispatchEvent(new Event('DOMContentLoaded', {
				bubbles: true,
				cancelable: true
			}))
		}
	}

	const observer = new MutationObserver(() => hydrate())
	observer.observe(root, {
		attributes: true,
		attributeFilter: ['data-hydrated']
	})
})
```

From a technical standpoint, it seems relatively sound. Cursor roasted that idea though (and was right to do so). It outlined 3 potential problems:

1. The `DOMContentLoaded` event is not a semantic “re-initialize the DOM” hook. It fires once when the document is parsed, and as such is typically expected to fire only once. Having it fire multiple times could have side-effects on the runtime and tooling.

2. A lot of `DOMContentLoaded` listeners are not safe to run twice. This is typically where we attach event listeners to the DOM (like click or resize listeners). Subsequent synthetic `DOMContentLoaded` events would attach duplicate listeners unless the code is rewritten to be strictly idempotent (remove old listeners, guard with AbortController, once, etc.). 

3. Although you can dispatch an event whose type is `DOMContentLoaded`, it would be distinguishable from the browser’s trusted event (due to `isTrusted: false`). Some code may ignore non-trusted events. This is controllable for first-party code only.

I’ve tried it and sure enough, it wasn’t all rosy. It did fix the original theme problem, because it re-fired the `DOMContentLoaded` event during which we normally apply the theme the first time. But it caused duplicate event listeners to be attached to all sorts of things, which is a big problem.

So conceptually it *could* work if you ensured your scripts are idempotent, which is difficult to do and prone to error without a framework that is designed this way (like React for instance).

## Wrapping up

It was a fun little side quest. The fix is also 10 lines of JavaScript that are only inserted in development, so I’m not unhappy with that. And although the exact circumstances are specific to my setup (the whole theme switcher thing), the problem would actually occur for any client-side applied DOM changes.

I hope this helps!