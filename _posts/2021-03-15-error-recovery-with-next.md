---
title: Error recovery with Next
edits:
  - date: 2021/03/16
    md: Thanks to [Maximilian Fellner’s proof of concept](https://twitter.com/mxfellner/status/1371540362662133766), I came up with a way cleaner solution than this original hack. See the [added section for the clean solution](#update-clean-solution).
---

Almost 3 years ago, I wrote about [recovering from runtime JavaScript errors](/2018/08/13/recovering-from-javascript-errors/) thanks to a carefully crafted server-side rendering solution. This is something I was very proud of, and I think a testament of the quality of work that went into the N26 web platform.

The idea is to intercept runtime JavaScript errors, and reload the page with a query parameter which causes the JavaScript bundles not to be rendered, thus simulating a no-JavaScript experience. This way, the user can browse the no-JS version instead of being stuck on a broken page.

I recently announced [Gorillas’ new website](https://gorillas.io) built with Next, which almost fully support JavaScript being disabled. So I was eager to try add a similar error recovery feature.

## The problem

While we do use Next, we do not use the runtime. We essentially use Next as a static site generator. When deploying the site, we build all pages statically (with [Next’ static HTML export](https://nextjs.org/docs/advanced-features/static-html-export)), and serve them via Netlify. There is no Node server or anything like that. It’s just a bunch of HTML files eventually enhanced by a client-side React application.

This means that the HTML files do contain `<script>` tags at the bottom of the body element to execute our bundles. We can’t decide not to render them because, once again, this is all just static files—there is no running server that can modify the response.

So that’s not even really Next’s fault per se. Any static site generator would have the same problem. Once the browser receives the HTML response, it’s done, we can’t modify it. It will read the `<script>` tags, download the files, parse them and execute them. So… rough one to solve I guess.

## Hacking a solution

{% info %} As mentioned in the update at the top of the article, this solution is a hack at best, and I came up with [a better solution](#update-clean-solution) thanks to Maximilian Fellner’s hints. Do not implement this `window.close()` hack and take the `<template>` route instead. {% endinfo %}

If we can’t do anything about the script tags being rendered in the HTML response, maybe we can prevent the browser from executing them? Well, again, not really. Browsers do not offer a fine-grained API into their resources’ system to tell them to ignore or prioritize certain assets.

Did you know about [`window.stop()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/stop) though? ‘Cause I didn’t until today. That’s a method on the `window` object that essentially does what the “Stop” button from the browser does. Quoting MDN:

> The `window.stop()` [function] stops further resource loading in the current browsing context, equivalent to the stop button in the browser. Because of how scripts are executed, this method cannot interrupt its parent document's loading, but it will stop its images, new windows, and other still-loading objects.

What if we called `window.stop()` _before_ the browser reaches the `<script>` tags rendered by `<NextScript />`? Let’s try that by updating `./pages/_document.js` (see [Custom `Document` in Next’s documentation](https://nextjs.org/docs/advanced-features/custom-document)):

```jsx
class MyDocument extends Document {
  static getInitialProps(ctx) {
    return Document.getInitialProps(ctx)
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/* Trying to prevent <script> elements rendered by
              `<NextScript />` from being executed. The proper
              condition will be covered in the next section. */
          <script dangerouslySetInnerHTML={​{ __html: `
            if (true) window.stop()
          ` }} />
          <NextScript />
        </body>
      </Html>
    )
  }
}
```

Performing a [Next export](https://nextjs.org/docs/advanced-features/static-html-export) and serving the output folder before loading any page yields positive results: not only are the `<script>` tags not executed, but they’re not even rendered in the dev tools. That’s because `window.stop()` literally killed the page at this point, preventing the rest of the document from being rendered.

```html
    <script>if (true) window.stop()</script>
  </body>
</html>
```

## Building the thing

Of course, we do not want to always prevent the scripts’ execution. Only when we’ve captured a JavaScript error and reloaded the page with a certain query parameter. To do that, we need an [error boundary](https://reactjs.org/docs/error-boundaries.html).

```js
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    const { pathname, search } = window.location

    window.location.href =
      pathname + search + (search.length ? '&' : '?') + 'no_script'
  }

  render() {
    return this.props.children
  }
}
```

We can render that component around our content in `./pages/_app.js` (see [Custom `App` in Next’s documentation](https://nextjs.org/docs/advanced-features/custom-app)).

```js
function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
```

Finally, in our `./pages/_document.js`, we can check for the presence of this URL parameter. If it is present, we need to stop the execution of scripts.

```js
class MyDocument extends Document {
  static getInitialProps(ctx) {
    return Document.getInitialProps(ctx)
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <script dangerouslySetInnerHTML={​{ __html: `
            if (window.location.search.includes('no_script')) {
              window.stop()
            }
          ` }} />
          <NextScript />
        </body>
      </Html>
    )
  }
}
```

That’s it, job done. Hacky as hell, but heh. It seems to work okay. For the most part at least, as it has some potentially negative side-effects: any ongoing request, such as for lazy loaded images, will be interrupted. That can cause some images not to render. Still better than a broken page due to a JavaScript error in my opinion, but I guess the choice is yours.

Alright people, lay it on me. How bad is this, and how ashamed shall I be?

## [Update] Clean solution

[Maximilian Fellner](https://twitter.com/mxfellner/status/1371540362662133766?s=20) was kind enough to take the time to build a demo of a way to inject Next scripts dynamically. The solution is a little complicated so I won’t go into the details in this article—feel free to check [Maximilian’s proof of concept](https://github.com/mfellner/static-nextjs-without-js). Thanks for the hint Max!

Building on top of his work, I figured out a rather elegant way forward. Instead of rendering `<script>` tags and then trying to remove or not to execute them when the `no_script` parameter is present, let’s turn it around. Let’s _not_ render the `<script>` tags, and only dynamically inject them at runtime when the `no_script` URL parameter is absent.

However, Next does not provide a built-in way to know what scripts should be rendered on a given page, or what are their paths. There is no exposed asset manifest or anything like this. So what we can do is render them within a [template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template). If you are not familiar with the `<template>` HTML element, allow me to quote MDN:

> The HTML Content Template (`<template>`) element is a mechanism for holding HTML that is not to be rendered immediately when a page is loaded but may be instantiated subsequently during runtime using JavaScript.

```jsx
class MyDocument extends Document {
  static getInitialProps(ctx) {
    return Document.getInitialProps(ctx)
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <template id='next-scripts'>
            <NextScript />
          </template>
        </body>
      </Html>
    )
  }
}
```

Perfect. Now, all we need is a little JavaScript snippet to effectivement properly render these `<script>` tags if the `no_script` URL parameter is not present.

```jsx
const scriptInjector = `
if (!window.location.search.includes('no_script')) {
  var template = document.querySelector("#next-scripts")
  var fragment = template.content.cloneNode(true)
  var scripts = fragment.querySelectorAll("script")

  Array.from(scripts).forEach(function (script) {
    document.body.appendChild(script)
  })
}
`.trim()

class MyDocument extends Document {
  static getInitialProps(ctx) {
    return Document.getInitialProps(ctx)
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <template id='next-scripts'>
            <NextScript />
          </template>
          <script dangerouslySetInnerHTML={​{ __html: scriptInjector }} />
        </body>
      </Html>
    )
  }
}

```

Boom, job done. If the `no_script` URL query parameter is present, the script will do nothing, effectively mimicking a no-JavaScript expperience. If it is not, it will load Next bundles, just like normal.
