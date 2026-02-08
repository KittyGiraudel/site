---
title: An accessible visibility React component
description: A technical write-up on an accessible visibility component in React
keywords:
  - accessibility
  - a11y
  - react
  - component
---

In [Cache-Cache CSS](https://www.ffoodd.fr/cache-cache-css/) (translated by yours truly on this very blog as [CSS hide-and-seek](/2016/10/13/css-hide-and-seek/)), Gaël Poupard offers a bulletproof solution to visually hide some content while keeping it accessible to assistive technologies.

In this post, I want to show a teeny-tiny React component to make it more explicit and convenient to use the original utility class.

```jsx
const VisuallyHidden = ({ as: Component, ...props }) => (
  <Component {...props} className="sr-only" />
)

VisuallyHidden.defaultProps = {
  as: 'span'
}
```

And here is how you would use it (taking the example from [Accessible page title in a single-page React application](/2020/01/15/accessible-title-in-a-single-page-react-application/#title-announcer)).

```jsx
const TitleAnnouncer = props => {
  const [title, setTitle] = React.useState('')
  // More React code…

  return <VisuallyHidden as='p' tabIndex={-1}>{title}</VisuallyHidden>
}
```

A few comments about the component:

Depending on the way you author styles in your application, you could author [the relevant styles](/2016/10/13/css-hide-and-seek#wrapping-things-up) differently (pure CSS, inline styles, CSS-in-JS…).

The `as` prop is intended to provide a way to change the underlying DOM element that is rendered. We found that `span` is a good default in most cases, but you might want a `p` (like we do in our example), a `div` or something else.

Finally, we spread the props so that it is possible to pass other DOM attributes to the underlying element (e.g. `tabIndex`). Note that we spread **before** the `className` prop so we don’t inadvertently override it.

Feel free to [play with the code](https://codesandbox.io/s/accessible-visibility-react-component-o3nbv) on CodeSandbox.

