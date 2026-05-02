---
title: Next.js Link as a Button
description: A technical walkthrough on how to make a generic Button component (such a coming from a library) use Next.js in-page routing.
tags:
  - Next.js
  - TypeScript
---

You’d think it would be simple. And in principle, it can be. The Next.js `Link` component accept both a `className` and `style` prop so you can style it however you want. But what if you *already* have a `Button` component that can render a `<a>` element, and want that component to support router navigation?

In my case, I use Ant Design in a side project, and want to be able to use router navigation with [Ant’s `Button` component](https://ant.design/components/button). Passing a resolved `href` prop technically works, but it will be a browser navigation (including a full page reload), and not a router navigation.

```tsx
import { Button } from 'antd'

// 😐 Kinda works, but triggers full-page navigation
function MyComponent() {
	return <Button href="/item/1234">Jump back</Button>
}
```

## Approach 1: imperative routing

In its documentation, Next.js mentions [“imperating routing”](https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating#imperative-routing). It would look like this:

```tsx
import { Button } from 'antd'
import { useRouter } from 'next/router'

function MyComponent() {
	const router = useRouter()

	return (
		<Button onClick={() => router.push('/item/1234')}>
			Jump back
		</Button>
	)
}
```

The problem with this approach is that it will render a `<button>` element, which is not semantically correct and an accessibility *<span lang="fr">faux-pas</span>*. This is not actually a button, it’s a link to another page, and as such should render an `<a>` element. 

## Approach 2: headless link

The second approach, which I opted for, is to use Next’s `<Link>` as a headless component — that is a component that doesn’t actually render DOM. This is how to do it (and still works in Next.js 16):

```tsx
import { Button } from 'antd'
import Link from 'next/link'

function MyComponent() {
	return (
		<Link href='/item/1234' passHref legacyBehavior>
			<Button>
				Jump back
			</Button>
		<Link>
	)
}
```

There is [a lot going on in Next’s code](https://github.com/vercel/next.js/blob/4ba05cc300cd3f196bdcebe56de2f6811171bb68/packages/next/src/client/link.tsx#L690-L718), so here is the summary:

- The `legacyBehavior` prop resorts to *cloning* the child element. On its own, it basically does nothing.
- The `passHref` prop assigns the `href` prop onto the child.

So if you use only `legacyBehavior`, nothing happens because all it does is clone the child element. And if you use only `passHref`, it renders a `<button>` element (from Ant) within a `<a>` element (from Next), which is not what we want. It’s by combining both that we get it to render an Ant `<Button>` component rendering a `<a>` element, using Next’s routing logic.

{% callout "warning" %}
As you can infer from the prop name, this approach is not future-proof because the `legacyBehavior` will likely be removed in a future Next.js version. I’m unclear what will be the approach in the future. I recall there used to be a `withRouterLink()` <abbr title="Higher-Order Component">HOC</abbr> in older Next.js version, but it’s no longer a thing.
{% endcallout %}

## Making a reusable component

It’s something I’ve used often enough in the project that I resorted to create a small wrapping component for that:

```tsx
import { Button, type ButtonProps } from 'antd'
import Link, { type LinkProps } from 'next/link'

export type RouterButtonProps = Omit<ButtonProps, 'href' | 'htmlType'> & {
  href: LinkProps['href']
  linkProps?: Omit<LinkProps, 'href'>
}

export function RouterButton({ href, linkProps, ...props }: RouterButtonProps) {
  return (
    <Link href={href} {...linkProps} passHref legacyBehavior>
      <Button {...props} />
    </Link>
  )
}
```

And it can be used like this:

{% raw %}
```tsx
<RouterButton
	// The `href` prop is handled by the Next link
	href="/item/1234"
	// Occasional and optional link props can be passed
	// See: https://nextjs.org/docs/app/api-reference/components/link#reference
	linkProps={{ onNavigate: () => track('jump_back_click') }}
	// Everything else goes to the Ant button
	// See: https://ant.design/components/button#api
	type='primary'
	ghost
	block
	className="MyButton"
>
	Jump back
</RouterButton>
```
{% endraw %}

And of course, it renders what we expect: a single `<a>` element, benefiting from Next routing navigation, styled as a button. No invalid DOM, no full page reload. Neat!