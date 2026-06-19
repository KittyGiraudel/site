---
title: Typed Polymorphic React Component
description: A technical piece about creating a typed polymorphic component in React, and the few hurdles I stumbled upon while getting there.
tags:
  - TypeScript
  - React
  - Component
image: /assets/images/typed-polymorphic-react-component/typed-polymorphic-react-component-generated.jpg
--- 

While working on the design system at Duna, I faced some difficulties trying to make a component polymorphic while also preserving type safety. Here is a short article to share what I learned.

## Starting with an example

Consider a `Text` component which renders a piece of text on screen, using one or more class names to carry its styles (could be normal CSS or Tailwind or whatever). Now, we don’t want to force a specific HTML element for that, because there are plenty of use cases we want to support: it could be a paragraph, a link, a span, a figcaption, you name it. So we allow passing the element to render with the `as` prop, and default to `span`.

```jsx
function Text({ as: As, children, ...props }) {
	const Component = As ?? 'span'
	return (
		<Component {...props} className="some class names">
			{children}
		</Component>
	)
}
```

Some elements though need or want additional attributes. For instance, a `<a>` needs `href`, a `<time>` needs `datetime`, a `<data>` needs `value`, and so on. That’s why we accept arbitrary props, and pass them through, so they reach the underlying DOM node. 

At the same time, we do not want to be able to pass `href` to a `<span>`, or `datetime` to `<a>`. We want the allowed props to be based off of the type of element we render.

To verify whether it works, I created a small smoke test like this:

```tsx
function Test () {
	return <>
		Should work:
		<Text as="p">Hello</Text>
		<Text as="a" href="https://www.google.com">Google</Text>
		<Text as="time" dateTime="2026-06-19">June 19, 2026</Text>
		<Text as="data" value="123">123</Text>

		Should fail type-checking:
		<Text as="p" href="https://www.google.com">Google</Text>
		<Text as="a" datetime="2026-06-19">June 19, 2026</Text>
	</>
}
```

## Typing the component

Now, onto TypeScript. We can get which attributes are allowed on which HTML element using the [`ComponentProps` type](https://www.totaltypescript.com/react-component-props-type-helper) from React. For instance, `ComponentProps<'a'>` gets us all the props allowed on a `<a>`. 

My first attempt went like this:

```ts
// Important: does *not* work
type TextProps<E extends React.ElementType> = {
	as: E
} & React.ComponentProps<E>
```

This means “considering the `as` prop, which is an element type, the allowed props are all the props that are valid for that value of `as`.” Unfortunately, this didn’t work: any prop became valid, even in cases where they obviously shouldn’t be. TypeScript doesn’t narrow the intersection when `E` is inferred from `as`.

After some fiddling around with another colleague, we discovered that this works:

```ts
// Works, but is a bit weird
type TextProps<E extends React.ElementType> = {
	as: E
} & Omit<React.ComponentProps<E>, 'meow'>
```

Interestingly, it virtually doesn’t matter what key we decide to omit — it can be anything, including something that doesn’t exist at all. 

Digging into `Omit`, it turns out it’s built on top of `Pick`, which is nothing more than:

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

That means a more idiomatic approach to write our type would be:

```ts
// Works, but is not obvious
type TextProps<E extends React.ElementType> = {
	as: E
} & {
	[K in keyof React.ComponentProps<E>]: React.ComponentProps<E>[K]
}
```

Honest disclaimer: I don’t know *why* it works. [This StackOverflow poster](https://stackoverflow.com/questions/74734365/understanding-a-react-polymorphic-component-generic-types) shares the same workarounds, and also admits they don’t have full understanding of why this works.

My naive understanding is that it basically “unfolds” the type. When asked to explain it, Cursor suggested the loop “forces TypeScript to materialize the type — walk the keys and build a concrete object type after `E` has been inferred from `as`.”

## Wrapping up

Here is the final implementation:

```tsx
type TextProps<E extends React.ElementType> = {
	as: E
} & {
	[K in keyof React.ComponentProps<E>]: React.ComponentProps<E>[K]
}

function Text<E extends React.ElementType>({ as: As, children, ...props }: TextProps<E>) {
	const Component = As ?? 'span'
	return (
		<Component {...props} className="some class names">
			{children}
		</Component>
	)
}
```

Another day, another humbling moment from TypeScript. Still, we got what we wanted in the end: a polymorphic component with strict type checking on what props it can accept. Huzzah!

{% callout %}
Side note: if you’re interested in polymorphism in React, I recently wrote *[Next.js Link as a Button](/2026/05/02/nextjs-link-as-a-button/)* which goes into how to handle this in Next.js.
{% endcallout %}
