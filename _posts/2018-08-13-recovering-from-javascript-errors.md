---
title: Recovering from JavaScript errors
tags:
  - accessibility
  - availability
  - javascript
  - errors
  - recovery
---

There are many reasons why making JavaScript optional is a Good Thing™. Some people might disable JavaScript all together or JavaScript could fail to load. However, one reason that is often overlooked is the ability to recover from runtime errors. That’s what this article is about.

## The idea

At N26, we recently discovered a nifty little bug which likely had been around for a few days unnoticed: entering an initial white space in the IBAN field when performing a transfer would cause a JavaScript error. Not ideal I hear you say, and you’re right. In a typical client-side application, this would cause the entire page to fail Because JavaScript™.

What happens in our case is that we immediately reload the page without loading any JavaScript. At this stage, the user is informed they have been redirected to the “basic version”, and are free to continue using it or to go back to the interactive version.

<figure class="figure">
<img alt="Transfer page with an error banner about being redirected to the basic version of the site" src="https://user-images.githubusercontent.com/1889710/44032814-95fc7de0-9f08-11e8-8f10-cc79d95a5b50.png" />
<figcaption>PS: we fixed that bug. 😅</figcaption>
</figure>

## The implementation

So how does this thing work under the hood? Let’s start with the obvious: the app needs to run seamlessly without JavaScript. That’s one thing for sure.

Then, we need:

- A way to catch unhandled exceptions. We use `componentDidCatch` from React, but it could also be using `window.onerror` or something similar.
- A way to load a page without loading JavaScript bundles. In our case, we rely on a query parameter.

A very simple implementation with React might look like this:

```js
class Root extends React.Component {
  componentDidCatch(error) {
    const { href, search, hash } = window.location
    const query = search ? search + '&noscript=1' : '?noscript=1'

    window.location.href = href + query + hash
    // Feel free to log `error` in your error tracker as well.
  }
}
```

Server-side setup is very project specific and tends to be quite complex so it is difficult to provide an adequat code example. Basically your implementation needs to check the query to figure whether bundles should be rendered/loaded or omitted.

In our case, it looks a little bit like this:

```js
Object.keys(webpackBundles).map(bundleName => (
  <script src={webpackBundles[bundleName].js} key={bundleName} defer />
))
```

While the user technically doesn’t have to know they have been redirected to a lite version, it might be more transparent and less confusing to tell them. In our case, we render a fixed message at the bottom of the screen with a link to reload the page with JavaScript enabled.

There has been [an interesting discussion on Twitter around the wording](https://twitter.com/HugoGiraudel/status/1022762218075697152). Something along these lines should work:

> Something went wrong and we switched you to the basic version. You can continue browsing or switch back to the full version.

… with a link on the last part of this sentence linking to the same page but without the query parameter.

## Wrapping up

One would call that “progressive enhancement” but I’d rather talk about “graceful degradation” here, because this is more of a safe check than anything else.

In all honesty, we don’t want to encourage people to use our lite version. It’s there for recovery reasons:

- If JavaScript is disabled by the user or if it fails to load due to connectivity issues.
- For legacy or weak browsers such as Internet Explorer 11, which we force into this mode.
- And as we’ve just seen—in case there is a runtime error.

That’s pretty much it. I hope you like this idea and you’ll consider making your apps working without JavaScript!
