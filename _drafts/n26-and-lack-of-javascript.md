---
title: N26 and lack of JavaScript
tags:
  - accessibility
  - a11y
  - JavaScript
---

- [Why bother?](#why-bother)
- [Tailoring the experience](#tailoring-the-experience)
- [Detecting JavaScript](#detecting-javascript)
- [Avoiding mounting flash](#avoiding-mounting-flash)
- [Minimising failure](#minimising-failure)

## Why bother?

JavaScript is fickle. It can fail to load. It can be disabled. It can be blocked. It can fail to run. It probably is fine most of the time, but when it fails, everything tends to go bad. And having such a hard point of failure is not ideal.

In the last few years, we have seen more and more ways to build highly interactive web applications relying almost exclusively on JavaScript. To the point where we almost wonder whether we forgot from where we come from. Not so long ago was a time was JavaScript was just sprinkled on top of web pages to have custom cursors and cool sound hover effects. But I digress.

The N26 web platform is built on React. One interesting thing about React as a library is that it can run seamlessly on the client as well as the server. In other word, generating HTML to send to the client is not only feasible, it’s also relatively easy.

So here is the gist: we render the React tree on the server as a string, sends it to the client. Once the browser is done downloading, parsing and executing the JavaScript bundles, the web page behaves as a single page application: HTTP calls are performed with AJAX, links are simulated with the History API and everything should work without having to refresh the browser at all.

## Tailoring the experience

Here is the thing though: we cannot expect the experience to be the same with and without JavaScript. That’s just not possible. JavaScript enables so many possibilities that the JavaScript-less experience will *always* feel worse in some ways.

Therefore it’s important not to try making the no-JS experience work like the full one. The interface has to be revisited. Some features might even have to be removed, or dramatically reduced in scope. That’s also okay. As long as the main features are there and things work nicely, it should be fine that the experience is not as polished.

## Detecting JavaScript

This title is a bit of a misnomer, because we don’t really want to detect whether JavaScript is enabled. We want to detect that all the following events have successfully happened:

1. JavaScript is enabled.
2. The page has been loaded.
3. The browser has downloaded the JavaScript bundle.
4. The browser has parsed the JavaScript bundle.
5. The browser has executed the JavaScript bundle.
6. The React tree has been rendered and is ready to be interacted with.

Thankfully, React makes it trivial to detect all that: when a component has mounted, we can store on the state that it is ready, and from there we know that JavaScript is available since components don’t actually mount on the server.

```jsx
const MyComponent = props => {
  const [hasJavaScript, setHasJavaScript] = React.useState(false)

  React.useEffect(() => setHasJavaScript(true), [])

  return (
    <>
      {hasJavaScript ? (
        <p>This will not render on the server, only on the client when JavaScript is finally available.</p>
      ) : (
        <p>This will render on the server, and on the client until JavaScript is finally available.</p>
      )}
    </>
  )
}
```

To avoid using a local state and a `useEffect` hook in every component that needs to know whether JavaScript is available, my amazing colleague [Juliette Pretot](https://twitter.com/JuliettePretot) suggested we do it at the top-level, and then provide that information through the React context.

```jsx
const HasJavaScriptContext = React.useContext(false)

const App = props => {
  const [hasJavaScript, setHasJavaScript] = React.useState(false)
  React.useEffect(() => setHasJavaScript(true), [])

  return (
    <HasJavaScriptContext.Provider value={hasJavaScript}>
      {props.children}
    </HasJavaScriptContext.Provider>
  )
}
```

Then components can read that value from the context:

```jsx
const MyComponent = props => {
  const hasJavaScript = React.useContext(HasJavaScriptContext)

  return (
    <>
      {hasJavaScript ? (
        <p>This will not render on the server, only on the client when JavaScript is finally available.</p>
      ) : (
        <p>This will render on the server, and on the client until JavaScript is finally available.</p>
      )}
    </>
  )
}
```

## Avoiding mounting flash

One slight inconvenience with the aforementionned solution, is that the no-JavaScript version is visible while the JavaScript bundles get downloaded, parsed and executed. In a way, that’s the entire point, so that if they fail to be, the page remains usable. However, that’s sometimes a little awkward when the no-JavaScript and the JavaScript versions are visually quite different.

To try improving the user experience, my other amazing colleague [Alina Dzhepparova](https://github.com/dge808) started experimenting with an addition to our solution, still making no asumption whether the user wants JavaScript, let alone whether they are a good enough network to download it.

When a user visits one of our web pages for the first time, and provided their browser is executing JavaScript properly, we set a flag in a cookie. During subsequent visits, we retrieve that cookie on the server and prefill the `HasJavaScriptContext` with the correct value. This way, we can render the JavaScript version right away, although it only becomes fully usable once bundles finally kick in.

For users with JavaScript turned off, but with the cookie flag set somehow (from a former visit), a `<meta http-equiv='refresh' />` with a `<noscript>` tag gets added to the document `<head>`.

```js
${props.hasJavascriptCookie
  ? `
    <noscript>
      <meta http-equiv='refresh' content='0; url=/js' />
    </noscript>
    `
  : ''}
```

This meta tag redirects to an Express route (simplified below), where the cookie is deleted and the user is redirected back to the page they were on, thus causing the process to start again.

```js
server.get('/js', () => {
  response.clearCookie('expects_javascript').redirect('back')
})
```

## Minimising failure

We track all JavaScript errors by sending some logs to our aggregator. Over the months, we realised we had an impressively high amount of errors coming from Internet Explorer 11, despite using [Polyfill.io](https://polyfill.io/v3/) to provide unsupported features.

Eventually, we decided to route our Internet Explorer traffic to our no-JS version. On the server, we use [ua-parser-js](https://www.npmjs.com/package/ua-parser-js) to (hopefully) detect the browser; if it is Internet Explorer, we no longer render JavaScript bundles, effectively simulating the no-JavaScript experience.

We realise it is an arbitrary and opinionated decision to make on behalf of the user, but we also believe a basic working experience is better than a fully broken one.
