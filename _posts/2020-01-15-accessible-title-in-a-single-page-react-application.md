---
title: Accessible page title in a single-page React application
tags:
  - accessibility
  - SPA
  - react
---

Over the summer, we, at N26, got the company Temesis to audit the accessibility of our web application. As part of their comprehensive and exhaustive report, we learnt that we were not handling page titles properly.

Traditionally, following a link causes the page to reload with the content of the new page. This makes it possible for screen-readers to pick up on the new page title and announce it.

With single-page applications using a JavaScript-powered routing system, only the content of the page tends to be reloaded in order to improve the perceived performance of the page.

In this article, I will share what I learnt from Temesis and how to make sure the title of your React <abbr title='Single-Page Applications'>SPAs</abbr> is accessible to assistive technologies.

- [Overview](#overview)
- [Boilerplate code](#boilerplate-code)
- [Title announcer](#title-announcer)
- [Wrapping up](#wrapping-up)

## Overview

We will build a teeny-tiny React application with [`react-router`](https://reacttraining.com/react-router) and [`react-helmet`](https://github.com/nfl/react-helmet). Our application will consist of:

- A top-level component rendering a navigation and the router.
- Three different pages served under different paths.
- A “page title announcer”, the core topic of our article.

The main idea is that every page will define its own title. The page title announcer listens for page changes, stores the page title and renders it in a visually hidden paragraph which gets focused. This enables screen-readers to announce the new page title.

You can already [look at the code](https://codesandbox.io/s/accessible-page-title-in-single-page-react-applications-u9e52) on CodeSandbox.

## Boilerplate code

To begin with, let’s create our page components. Each page is a simply React component rendering a `<h1>` element, and a `<title>` element with `react-helmet`.

```jsx
import React from 'react'
import { Helmet } from 'react-helmet'

const Home = () => (
  <>
    <h1>Home</h1>
    <Helmet>
      <title>Home</title>
    </Helmet>
  </>
)

const About = () => (
  <>
    <h1>About</h1>
    <Helmet>
      <title>About</title>
    </Helmet>
  </>
)

const Dashboard = () => (
  <>
    <h1>Dashboard</h1>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>
  </>
)
```

Now, let’s create a top-level component which will handle the routing to these different pages. To keep it simple, let’s take it (almost) as is from [the basic example of `react-router`](https://reacttraining.com/react-router/web/example/basic). It is our [`<TitleAnnouncer>` component](#title-announcer) (described in the next section), a navigation, and a router.

```jsx
const Root = () => (
  <Router>
    <>
      <TitleAnnouncer />

      <nav role='navigation'>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
        <Link to='/dashboard'>Dashboard</Link>
      </nav>

      <hr />

      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/about'>
          <About />
        </Route>
        <Route path='/dashboard'>
          <Dashboard />
        </Route>
      </Switch>
    </>
  </Router>
)
```

## Title announcer

The last missing piece of the puzzle is the actual title announcer. It does a few things:

- It holds the page title in a local state.
- It renders said title in a visually hidden paragraph (here with the [`.sr-only` class](/2016/10/13/css-hide-and-seek/#wrapping-things-up)).
- It listens to Helmet data change to update the local state.
- It listens for page change to focus the hidden paragraph (hence the `tabIndex={-1}`).

```jsx
import React from 'react'
import { useLocation } from 'react-helmet'
import { Helmet } from 'react-helmet'

const TitleAnnouncer = props => {
  const [title, setTitle] = React.useState('')
  const titleRef = React.createRef()
  const { pathname } = useLocation()
  const onHelmetChange = ({ title }) => setTitle(title)

  React.useEffect(() => {
    if (titleRef.current) titleRef.current.focus()
  }, [pathname])

  return (
    <>
      <p tabIndex={-1} ref={titleRef} className='sr-only'>
        {title}
      </p>

      <Helmet onChangeClientState={onHelmetChange} />
    </>
  )
}
```

## Wrapping up

That is all that is needed to handle page titles in an accessible way in a single-page React application. The `react-router` and `react-helmet` libraries are not necessary either, and the same pattern should be applicable regardless of the library (or lack thereof) in use.

Note that if you have a simple application and can guarantee there is always a relevant `<h1>` element (independently of loading states, query errors and such), another, possibly simpler solution arises. It should be possible to skip that hidden element altogether, and focus the `<h1>` element instead (still with `tabIndex={-1}`). This solution could not scale for us as we have hundreds of sometimes complex and dynamic pages, some with a visible `<h1>` element, some with a hidden one, and so on.

Feel free to [play with the code](https://codesandbox.io/s/accessible-page-title-in-single-page-react-applications-u9e52) on CodeSandbox.
