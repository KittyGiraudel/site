---
title: From Create-React-App to Next
description: A retrospective post on moving a website from the now deprecated Create-React-App to Next.js
---

I recently moved a significant codebase from [Create-React-App](https://create-react-app.dev/) (CRA for short) to [Next](https://nextjs.org/docs) and thought I would share my experience, because believe me or not, it was quite a journey (and not necessarily a pleasant one).

There are plenty reasons why you might want to move to Next from a CRA app. It provides server-side rendering (SSR), and even [incremental static regeneration](https://vercel.com/docs/next.js/incremental-static-regeneration) (ISR) when hosted on Vercel. It’s an encompassing framework with built-in routing, image optimization, development environment, and more.

This post is a high-level walkthrough of things to deal with to finalized the migration from CRA to Next. Here’s what we’ll cover:

- [HTML boilerplate](#html-boilerplate)
- [Head content](#head-content)
- [Routing](#routing)
- [Code splitting](#code-splitting)
- [Styling](#styling)
- [CSR/SSR](#csr-ssr)
- [Linting](#linting)
- [Running both systems](#running-both-systems)
- [Wrapping up](#wrapping-up)

## HTML boilerplate

[CRA uses an `index.html` file in the `public` folder](https://create-react-app.dev/docs/using-the-public-folder/) to configure the HTML document surrounding the app. Next handles everything in React via the `_document.js` file, so it needs to be moved manually. Fortunately, it’s relatively easy to do, and [Next documentation provides some pointers](https://nextjs.org/docs/migrating/from-create-react-app#static-assets-and-compiled-output).

## Head content

For custom head management on a per-page basis, Next comes with its own solution, [next/head](https://nextjs.org/docs/api-reference/next/head), while CRA doesn’t. The usual suspects are [react-helmet](https://github.com/nfl/react-helmet) (or its clean version, [react-helmet-async](https://github.com/staylor/react-helmet-async)) or the more recent [hoofd](https://github.com/JoviDeCroock/hoofd). Either way, I’d recommend abstracting usages of the library to certain components or hooks, so there is only one place to update when switching to Next.

For instance, instead of importing `Head` from react-helmet in every page, import your own `Head` component which wraps the react-helmet one. This way, you can update the implementation detail to make it work with Next without having to touch any other component.

## Routing

CRA does not have built-in routing capability, so is often coupled with [react-router-dom](https://reactrouter.com/web/guides/quick-start). You’d usually have a router component which declares all your routes, and for each route, which component to render. For instance:

```js
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PostPage from '../PostPage'
import HomePage from '../HomePage'

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/'>
        <HomePage />
      </Route>
      <Route path='/post/:slug'>
        <PostPage />
      </Route>
    </Switch>
  </BrowserRouter>
)

export default Router
```

[Next comes with its own router](https://nextjs.org/docs/api-reference/next/router). More than that: the [routing is inferred by the `pages` folder structure](https://nextjs.org/docs/basic-features/pages), so there is no router/routes declaration per se. To move that to Next, you would have to create `pages/index.js` and `pages/post/[slug]/index.js`, which would look like this:

```js
// pages/index.js
import HomePage from '../components/HomePage'

export default HomePage
```

```js
// pages/post/[slug]/index.js
import PostPage from '../../../components/PostPage'

export async function getStaticPaths() {
  // If you can compute possible paths ahead of time, feel free to, but you
  // shouldn’t need to do it to complete the migration to Next.
  return { paths: [], fallback: true }
}

export async function getStaticProps(context) {
  // If you want to resolve the whole post data from the slug at build time
  // instead of runtime, feel free to, but you shouldn’t need to do it to
  // complete the migration to Next.
  return { props: { slug: context.params.slug } }
}

export default PostPage
```

Then in the `PostPage` component, instead of reading the slug from the router with `useRouteMatch` from react-router-dom, you’d expect it to come from the props. You could handle both ways like this:

```js
const match = useRouteMatch()
const slug = props.slug || match.params.slug
```

Beyond the route definition itself, I think a healthy way to migrate that part is to abstract away anything about the router into components and hooks, so it’s just a matter of updating these parts when switching over to Next. For instance, have a link component which wraps `Link` from react-router-dom, so it’s just matter of updating that component with next/link. Same thing for `useRouter` and the like.

Note that [Next gives some interesting pointers to migrate from react-router](https://nextjs.org/docs/migrating/from-react-router).

## Code splitting

There again, Next has a solution for manual code-splitting, [next/dynamic](https://nextjs.org/docs/api-reference/next/dynamic), while CRA doesn’t. The industry standard — as far as I can tell — is [@loadable/component](https://github.com/gregberge/loadable-components) (also [implied by Next docs](https://nextjs.org/docs/migrating/from-react-router#code-splitting)). Both libraries work basically the same though, so the migration should be a few search-and-replace away:

```diff
- import loadable from '@loadable/component'
+ import dynamic from 'next/dynamic'

- const MyComponent = loadable(() => import('./MyComponent'))
+ const MyComponent = dynamic(() => import('./MyComponent'))
```

## Styling

[CRA has native support for plain CSS](https://create-react-app.dev/docs/adding-a-stylesheet). That means you can import a CSS file inside a React component, and CRA will bundle CSS seamlessly. Unfortunately, [Next does not beyond global stylesheets](https://nextjs.org/docs/basic-features/built-in-css-support). The only place where Next allows importing stylesheets is in the `_app.js`. So if your codebase uses CSS files all over, you’re in for a painful migration (which is [basically what the docs say as well](https://nextjs.org/docs/migrating/from-create-react-app#styling)).

The easy-but-dirty way out is to import all your CSS files within `_app.js`, but that kind of breaks separation of concerns since your components are no longer responsible for their own styles. If you end up deleting a component, you need to remember to delete its imported styles in `_app.js`. Not great overall.

A better approach would be to do a proper migration. Fortunately, both systems support CSS modules, so one approach might be to manually convert every CSS file to a CSS module. Another approach would be to move the styling layer to a CSS-in-JS solution such as [styled-components](https://styled-components.com/), [Fela](https://fela.js.org/), or whatever floats your boat. Either way, that’s going to be a manual migration and a cumbersome one. By far the hardest part.

## CSR/SSR

Because CRA doesn’t have server-side rendering (SSR) and only uses client-side rendering (CSR), it’s easy to have authored code that won’t work in Next (during pre-rendering). For instance, accessing browser APIs in the render (such as `window`, `localStorage` and the like), or initializing states with client-specific info instead of doing so on mount.

For this part, an intimate knowledge of the codebase will help making things SSR-friendly. It should be relatively easy to do, and a good test suite will help spot cases where Next fails to pre-render a page. A more brutalist approach is to run `next build` and see where it fails.

## Linting

Both Next and CRA come with integrated linting as part of the development environment and the build step. Unfortunately, the configuration is not quite the same. Fortunately, the CRA linting is a bit more strict than Next, so it shouldn’t be too difficult to migrate. I suspect the other way around to be more complex.

You might want to turn of the `@next/next/no-img-element` rule though, because it expects every image to be authored with `next/image`, which a) seems awfully dogmatic and b) is unrealistic for the migration.

```json
{
  "extends": "next",
  "rules": {
    "@next/next/no-img-element": "off"
  }
}
```

## Running both systems

One thing I realized only once I was done (insert sad face emoji) is that you could actually run both systems on the same codebase with minimal effort if you cannot one-shot your migration.

CRA uses a single entry point (usually `src/index.js`), while Next relies on the `pages` directory, so there is no conflict there. CRA will ignore `pages`, and Next will ignore the entry file.

If you abstracted into hooks and components everything about routing and head management, you can use an environment variable within said components to use the right libraries. Small proof of concept (not tested, please tread carefully):

```js
import NextLink from 'next/link'
import { Link as RRLink } from 'react-router-dom'

// See: https://nextjs.org/docs/basic-features/environment-variables
// See: https://create-react-app.dev/docs/adding-custom-environment-variables
const FRAMEWORK =
  process.env.NEXT_PUBLIC_FRAMEWORK || process.env.REACT_APP_FRAMEWORK

const Link = props => {
  return FRAMEWORK === 'next' ? (
    <NextLink href={props.to} passHref>
      <a>{props.children}</a>
    </NextLink>
  ) : (
    <RRLink to={props.to}>{props.children}</RRLink>
  )
}

export default Link
```

This way, you can run `REACT_APP_FRAMEWORK=cra react-scripts build` and deploy that in production while you slowly migrate your codebase to Next. And you can do staging/beta builds with `NEXT_PUBLIC_FRAMEWORK=next next build` until you’re happy to put that live.

If you had a custom ESLint configuration for CRA, you might need to make the file a JavaScript file instead of JSON, and pass and use that environment variable to it as well so you can pick the right configuration.

## Wrapping up

I’m not going to lie: this will take time and effort and will not be painless. While both frameworks share a lot of similarities, they are also fundamentally different in the way they approach rendering (which is kind of the benefit of Next), so a lot of things will have to be updated. The most annoying part definitely is the CSS migration, if your CRA app uses plain CSS.

Be sure to read the [Next migration from CRA guide](https://nextjs.org/docs/migrating/from-create-react-app) as it provides a lot of helpful information on how to move from one system to the other that I haven’t covered in this article.

But with careful planning and incremental work while running both systems on the same code base (one for staging, one for production) until the migration is over, I’d say this is something that’s doable, especially for a team of people. And the results are rewarding, so that’s nice.
