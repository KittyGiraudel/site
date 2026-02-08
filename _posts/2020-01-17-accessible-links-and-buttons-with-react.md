---
title: Accessible links and buttons with React
description: A guide on building accessible links and buttons in React
keywords:
  - accessibility
  - a11y
  - react
  - component
---

An age old problem of the web platform when it comes to accessibility has been to confuse links and buttons. A link (`<a>`) leads to somewhere. A button (`<button>`) performs an action. It’s important to respect that convention.

Now, in single page applications, things are bit more blurry because we no longer follow links which cause a page to reload entirely. Links, while still changing the URL, tend to replace the part of the page that changed. Sometimes, they might be replaced entirely by an inline action.

At N26, we have a pretty unique challenge: we support almost all of our features with and **without** JavaScript (thanks to server-side rendering). This implies that a lot of links should become buttons when JavaScript is enabled and running. To avoid authoring ternaries all over the place, we have a single component capable of rendering both links and buttons depending on the given props. We call it `Action`.

- [What component to render](#what-component-to-render)
- [Open a tab for me, will you?](#open-a-tab-for-me-will-you)
- [No opener, no referrer](#no-opener-no-referrer)
- [Is this your type?](#is-this-your-type)
- [One component, many outfits](#one-component-many-outfits)
- [Wrapping up](#wrapping-up)

## What component to render

Our line of reasoning to determine what to render is as follow: if we have an `href` prop, we should render a link (`<a>` element), otherwise we should render a button. It would look like this:

```jsx
const Action = props => {
  const Component = props.href ? 'a' : 'button'

  return <Component {...props} />
}
```

If like us, you use client-side routing such as `react-router`, you might also want to render a `Link` component to render router links when the `to` prop is provided.

```jsx
import { Link } from 'react-router-dom'

const Action = props => {
  const Component = props.to ? Link : props.href ? 'a' : 'button'

  return <Component {...props} />
}
```

Then, we can have a link changing into a `<button>` when JavaScript eventually kicks in:

```jsx
const MyComponent = props => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => setIsMounted(true), [])

  return (
    <Action
      href={isMounted ? undefined : '/about'}
      onClick={isMounted ? props.displayAboutDialog : undefined}
    >
      Learn more about us
    </Action>
  )
}
```

## Open a tab for me, will you?

The [technique G201](https://www.w3.org/TR/WCAG20-TECHS/G201.html) of the <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> asks that each link opens in a new tab has:

- a warning spoken in assistive technology that this link opens to a new tab,
- a visual warning in text that this link opens to a new window.

To achieve that, we can render a small icon with an associated label stating “(opens in a new tab)”. The resulting markup would look like this:

```html
<a href="/about" target="_blank" class="link">
  Learn more about us
  <svg aria-hidden="true" focusable="false" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 32 32" ><path d="M22 11L10.5 22.5M10.44 11H22v11.56" fill="none"></path></svg>
  <span class="sr-only">(opens in new tab)</span>
</a>
```

For the sake of simplicity, let’s assume we have an `Icon` component that rends a SVG, and a [`VisuallyHidden` component](/2020/01/16/accessible-visibility-react-component/) that renders hidden accessible text.

```jsx
const Action = props => {
  const Component = props.to ? Link : props.href ? 'a' : 'button'

  return (
    <Component {...props}>
      {props.children}
      {props.target === '_blank' && (
        <>
          <Icon icon='new-tab' />
          <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
        </>
      )}
    </Component>
  )
}
```

We can also extract this logic into its own little component to make the JSX of our `Action` component a little easier to read:

```jsx
const NewTabIcon = props => (
  <>
    <Icon icon='new-tab' />
    <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
  </>
)
```

## No opener, no referrer

When following a link using `target='_blank'`, the other page can access the `window` object of the original page through the `window.opener` property. This exposes an attack surface because the other page can potentially redirect to a malicious URL.

The solution to this problem has been around for pretty much ever and is to add `rel='noopener'` or `rel='noreferrer'` (or both) to the links opening in a new tab so the `window.opener` object is not accessible.

To make sure never to forget these attributes, we can bake this logic in our `Action` component.

```jsx
const Action = props => {
  const Component = props.to ? Link : props.href ? 'a' : 'button'
  const rel = props.target === '_blank'
    ? 'noopener noreferrer'
    : undefined

  return (
    <Component {...props} rel={rel}>
      {props.children}
      {props.target === '_blank' && <NewTabIcon />}
    </Component>
  )
}
```

If we want to be able to pass a custom `rel` attribute as well, we can extract this logic in a small function:

```js
const getRel = props => {
  if (props.target === '_blank') {
    return (props.rel || '') + ' noopener noreferrer'
  }

  return props.rel
}
```

## Is this your type?

The default value for the `type` attribute on a `<button>` element is `submit`. This decision comes from a time where buttons were almost exclusively used in forms. And while this is no longer the case, the default value remains. Therefore, it is recommended to always specify a `type` to all `<button>` elements: `submit` if their purpose is to submit their parent form, `button` otherwise.

As this can be a little cumbersome, we can bake that logic in our component once again:

```jsx
const Action = props => {
  const Component = props.to ? Link : props.href ? 'a' : 'button'
  const rel = getRel(props)
  const type = Component === 'button' ? props.type || 'button' : undefined

  return (
    <Component {...props} rel={rel} type={type}>
      {props.children}
      {props.target === '_blank' && <NewTabIcon />}
    </Component>
  )
}
```

## One component, many outfits

One of the reasons why people tend to use links when they should use a button, or buttons when they should use a link is because they think in terms of styles, rather than semantics.

If the design in place instructs to render a link to another page as a button, an uninformed (or sloppy) developer might decide to use a button, and then use some JavaScript ~~magic~~ voodoo to redirect to the new page.

By making our component themable, we can provide a styling API without injuring the underlying semantics. For our example, we’ll consider two HTML classes, `button` and `link`, styling like a button and like a link respectively.

```jsx
const Action = props => {
  const Component = props.to ? Link : props.href ? 'a' : 'button'
  const rel = getRel(props)
  const type = Component === 'button' ? props.type || 'button' : undefined
  const className = [
    props.className,
    props.theme === 'LINK' ? 'link' : 'button'
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component {...props} rel={rel} type={type} className={className}>
      {props.children}
      {props.target === '_blank' && <NewTabIcon />}
    </Component>
  )
}
```

Then we can render a button, styled as a link:

```jsx
const MyComponent = props => (
  <Action theme='LINK' type='button' onClick={toggle}>Toggle</Action>
)
```

Or a link, styled as a button:

```jsx
const MyComponent = props => (
  <Action theme='BUTTON' href='/about'>Learn more about us</Action>
)
```

Note how we preserve any provided `className` so it becomes possible to give our component a class name on top of the one used by the component itself for styling.

```jsx
const MyComponent = props => (
  <Action theme='BUTTON' href='/about' className='about-link'>
    Learn more about us
  </Action>
)
```

## Wrapping up

Our `Action` component holds even more logic (especially around webviews), but that is no longer relevant for our article. I guess the point is that anything that is important for accessibility or security reasons should be abstracted in a React component. This way, it no longer becomes the responsibility of the developer to remember it.
