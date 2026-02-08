---
title: Retrospective on Fela
description: A retrospective on using Fela for CSS-in-JS at N26
keywords:
  - styling
  - CSS-in-JS
  - fela
---

Over the years, I have tweeted about [Fela](https://fela.js.org) a few times. And as I am about to leave N26 and behind me the decisions I made, I want to properly reflect on the choice of going with Fela instead of any other CSS-in-JS library you might have heard of.

- [Discovering Fela in 2016](#discovering-fela-in-2016)
- [What’s Fela?](#whats-fela)
- [What’s good about it?](#whats-good-about-it)
  - [Transparent atomic output](#transparent-atomic-output)
  - [Rich ecosystem](#rich-ecosystem)
  - [Extensive RTL support](#extensive-RTL-support)
- [What are the caveats?](#what-are-the-caveats)
  - [Shorthands and longhands](#shorthand-and-longhands)
  - [Small community](#small-community)
  - [Pattern evolution (solved)](#solved-pattern-evolution)
- [Tips & Tricks](#tips-tricks)
  - [Fela dev utils as devDependencies](#fela-dev-utils-as-devdependencies)
  - [Integrating react-dates with Fela](#integrating-react-dates-with-fela)
  - [Avoid adblockers messing with styles](#avoid-adblockers-messing-with-styles)
  - [Custom processing](#custom-processing)
- [Wrapping up](#wrapping-up)

## Discovering Fela in 2016

The year is 2016. [Mike Smart](https://twitter.com/smartmike) and I just joined N26 in Berlin to revamp their web strategy, hire a team and build a platform that will last longer than the previous one. With but a rough idea in mind of what we wanted to achieve, we had a mountain of decisions to take. Amongst them, how to author our styles.

We originally started with [CSS modules](https://github.com/css-modules/css-modules). This was principally motivated by the fact that I was under a writing contract for a book on the matter at the time. Don’t waste your time looking for it, it was neither written nor published and given CSS modules has lost a lot of its traction in favour of more modern solutions, maybe it’s for the best after all. CSS modules also came with [create-react-app](https://create-react-app.dev/) if I’m not mistaken, which is what we started with (before ejecting literally during our first week).

There were good things and bad things with CSS modules. On one hand, writing plain CSS was nice and we knew it would come with virtually no learning curve for people joining us down the line. On the other, style composition was a little clumsy (probably because we didn’t know how to do it well) and variables were a mix between Sass and JavaScript imports, but neither really.

```css
@value blue, teal from '../../styles/variables.css';

.base {
  composes: base from './index.css';
  background-color: blue;
  border: 2px solid blue;
  color: white;
  padding: 0.5em 1em;
}
```

We were already 2,000 commits in the making at that stage, and our roadmap was getting clearer and clearer: we’d end up with multiple large-scale projects within the same codebase, and I was growing worried of our CSS scaling poorly in the long run. That’s when on February 17th 2017, two weeks before our very first live release, I came to work one morning and told Mike “hear me out… how about CSS-in-JS?”

I had done some research on JS libraries for styling, and while the ecosystem was nowhere near what it is today, there were a few contenders: [styled-components](https://styled-components.com/), [Fela](https://fela.js.org), [Aphrodite](https://github.com/Khan/aphrodite) and [Emotion](https://emotion.sh/) were all in 0.x or v1 at most and [JSS](https://cssinjs.org/?v=v10.5.0) was going strong for over 2 years already. So there were definitely options — or so we thought. Now, we had 2 main constraints (besides obvious aesthetic considerations):

1. We implemented server-side rendering (SSR) from day 1, and completely supported the absence of client-side JavaScript, so we needed an isomorphic solution which would deal properly with rehydration.
2. The main reason to move away from CSS modules was to have critical CSS and most importantly atomic CSS out of the box so we needed a library able to provide that with minor effort.

At that time, styled-components was getting hyped for its elegant syntactic approach so we were really hoping we could get to use it. Unfortunately, [it did not support server-side rendering until v2](https://github.com/styled-components/styled-components/releases/tag/v2.0.0), and it [still does not provide support for atomic CSS output](https://github.com/styled-components/styled-components/issues/351). That meant styled-components was not an option.

Other libraries did offer SSR support, but they didn’t give the ability to get atomic classes. Some were built with atomic CSS in mind, but they did not integrate nicely in a React ecosystem. Long story short, it turns out that we didn’t have _that_ many options in the end.

Fela offered a glimmer of hope though. It did support SSR from its very first version, and was designed in such way that it was possible to author monolithic CSS _and_ get atomic output (more on that later). Bingo, we had a winner and I rewrote our entire styling layer in the few days before launch.

## What’s Fela?

Fastforward late 2020, what is Fela? Fela describes itself as a small, high-performant and framework-agnostic toolbelt to handle state-driven styling in JavaScript. It continues stating it is dynamic by design and renders styles depending on the application state.

If I had to describe it, I would say Fela is an ecosystem of styling utilities to write styles for JavaScript application (from vanilla to React, from Angular to Inferno, from React Native to ReasonML). At the core, it’s a small styling engine, on which can be plugged extensions and enhancers to make it proper to one’s project.

[Robin Weser](https://github.com/robinweser), the developer behind Fela, considers it to be feature-complete. It hasn’t changed too much in a while because it doesn’t need much more by now. It should either provide the tools one needs, or make it possible to author these tools in a straightforward fashion.

## What’s good about it?

Today, Fela is one CSS-in-JS library amongst others, and to some extent they all more or less do the same things: dynamic styling, performant rendering, optimisations… Still, there are a few things where Fela shines.

### Transparent atomic output

I think the main benefit of Fela is the ability to output styles in an atomic way without enforcing authoring styles as such. Authors get to write CSS as they would usually do (in a “monolithic way”), and the tool does the hard job of outputing atomic classes for maximum performance.

Consider the following React components styling two `p` as a coloured squares (Fela integration code omitted for sake of simplicity):

```jsx
const a = () => ({
  width: '5em',
  height: '5em',
  backgroundColor: 'deepskyblue',
})
const b = () => ({
  width: '5em',
  height: '5em',
  backgroundColor: 'deeppink',
})
const SquareA = props => <p className={rule}>I’m deepskyblue!</p>
const SquareB = props => <p className={rule}>I’m pink!</p>
```

Now the output would look like this (prettified for illustration):

```css
.a {
  width: 5em;
}
.b {
  height: 5em;
}
.c {
  background-color: deepskyblue;
}
.d {
  background-color: deeppink;
}
```

```html
<p class="a b c">I’m blue!</p>
<p class="a b d">I’m pink!</p>
```

While this might look like unnecessary optimisation on such a reduced example, it does matter on projects growing fast and large. This effectively caps the amount of CSS that gets shipped to the browser to the amount of different CSS declarations. Of course, there will be quite a lot (every different padding, margin, colour and so on) but there will be an upper limit. Particularly when following a design system or component library where styling is dictated by a strict set of reusable rules.

This is what makes Fela really stand out from other similar CSS-in-JS libraries. Atomic CSS happens silently and out of the box without having to think in an atomic way. No need to remember atomic class names, or force a specific naming convention; keep writing CSS as always (except, well, as JavaScript objects), and benefit from highly performant output.

### Rich ecosystem

To this day, if there is one thing that I always found impressive about Fela is its [rich ecosystem of utilities and plugins](https://github.com/robinweser/fela/tree/master/packages), especially considering they are almost all authored and maintained by Robin Weser, the original creator, and part of the main lerna repo.

Even pretty advanced behaviour such as [responsive properties](https://github.com/robinweser/fela/tree/master/packages/fela-plugin-responsive-value) — properties whose value varies across pre-defined breakpoints — or [extensive testing of state-specific styles](https://github.com/robinweser/fela/tree/master/packages/fela-plugin-simulate) (e.g. hover) are already built and ready to use.

And if something happens to be missing, Fela is very easy to customise with [plugins](http://fela.js.org/docs/advanced/Plugins.html) and [enhancers](http://fela.js.org/docs/advanced/Enhancers.html). Both are essentially functions to customise style processing.

### Extensive RTL support

Having never worked on a project requiring right-to-left support, I unfortunately have very little experience in that area. That being said, [Fela’s support for RTL styling is excellent](https://github.com/robinweser/fela/tree/master/packages/fela-plugin-rtl), especially when compared to other CSS-in-JS libraries (it even has [bidi support](https://github.com/robinweser/fela/tree/master/packages/fela-plugin-bidi)).

What’s particularly interesting about the way Fela handle RTL is that it can be localised to specific sub-trees. This makes it especially relevant for internationalised applications with certain parts of the UI needing right-to-left content. The configuration is not set globally at the root level (although it can), and can be configured at will within the tree.

## What are the caveats?

Nothing is ever perfect, and while Fela has been fantastic looking back at the last 4 years, it also came with some ups and downs along the way. Allow me to paint you a word picture.

### Shorthands and longhands

Shorthand and longhands are somewhat conflicting, which can be messy when not properly enforced with either strict methodology or a plugin. For instance, if you apply `padding` with the shorthand in one component, but the longhand properties in another, these properties could end up conflicting (just like in CSS).

This is actually outlined in [Fela’s documentation](http://fela.js.org/docs/introduction/Caveats.html#2-shorthand--longhand-properties), and recommended to use longhands everywhere to avoid these situations. There is also the [fela-plugin-expand-shorthand](https://github.com/robinweser/fela/tree/master/packages/fela-plugin-expand-shorthand) official package to break down shorthand declarations in their longhand properties.

### Small community

Fela, comparatively to styled-components especially, has a relatively small community. Omitting the occasional minor contributor, Robin Weser is basically the sole maintainer although he is currently sponsored to maintain Fela as part of his full-time work.

On the bright side, it got us to actually invite Robin to come visit the N26 office in Berlin to have a look at our code base and help us diagnose a mismatch issue we were having. And also have some delicious vegan food. ✨

### [Solved] Pattern evolution

Being almost 5 years old, Fela evolved alongside React. When we started using it in 2017, higher-order components were all the hype. So every component needing styles would end up being wrapped with the `connect` higher-order component that would provide resolved classNames.

```jsx
import { connect } from 'react-fela'

const square = () => ({ width: '5em', height: '5em' })
const Square = connect({ square })(props => (
  <p className={props.styles.square}>I’m a square!</p>
))
```

And soon enough, higher-order components were not the way to go anymore, and render functions were supposedly a better approach, so we’d use `FelaComponent` everywhere:

```jsx
import { FelaComponent } from 'react-fela'

const square = () => ({ width: '5em', height: '5em' })
const Square = props => (
  <FelaComponent style={square}>
    {({ className }) => <p className={className}>I’m a square!</p>}
  </FelaComponent>
)
```

And while render functions are great, they also clutter the JSX quite a lot so we turned to creating our styled containers with `createComponent`.

```jsx
import { createComponent } from 'react-fela'

const square = () => ({ width: '5em', height: '5em' })
const Styled = createComponent(styles.square, 'p')
const Square = props => <Styled>I’m a square!</Styled>
```

And it’s pretty great until you start passing a lot of prop to your components for styling purposes, and only want some of them to make their way to the DOM as actual HTML attributes. So there is a hook instead:

```jsx
import { useFela } from 'react-fela'

const square = () => ({ width: '5em', height: '5em' })
const Square = props => {
  const { css } = useFela()
  return <p className={css(square)}>I’m a square!</p>
}
```

As of writing, it seems that this is the way forward. Robin confirmed using the `useFela` hook was the recommended way, and the fact that there are so many approaches to using Fela is a side-effect of it growing alongside React and its evolving design patterns.

> I think most libs had that issue since its kinda linked to how React evolved. In the beginning it was all about HoCs until the render-props pattern emerged just to be dethroned by hooks later on.
>
> So the official recommend way will be hooks for everyone on react > 16.3 these days. I’m going to reflect that in the new docs. It’s the fastest and most simple API of all yet the others are totally fine.
>
> I just don’t like them anymore since you need to be more careful with e.g. the props passthrough where hooks are not tied to the rendering at all — they just provide a nice CSS API just like Emotion has.
>
> — Robin Weser, creator of Fela about the evolution of its API

This API evolution is not Fela’s fault per se. If anything, it is a testament of it keeping up with what the React community wants to use. Nevertheless, it did give us some challenge to keep our code base clean and up to date. Full disclosure, we never migrated to `useFela` and still use `createComponent` everywhere. At least it’s consistent.

## Tips & Tricks

### Fela dev utils as devDependencies

Fela provides a lot of useful plugins to ease development, such as [beautified styles](https://github.com/robinweser/fela/tree/master/packages/fela-beautifier), [Enzyme bindings](https://github.com/robinweser/fela/tree/master/packages/fela-enzyme), [a layout debugger](https://github.com/robinweser/fela/tree/master/packages/fela-layout-debugger), [a verbose logger](https://github.com/robinweser/fela/tree/master/packages/fela-plugin-logger), [performance audits](https://github.com/robinweser/fela/tree/master/packages/fela-perf), [styling statistics](https://github.com/robinweser/fela/tree/master/packages/fela-statistics) to name just a few.

What I wanted was having these dependencies as `devDependencies` since this is what they are: development dependencies. The problem came when importing these dependencies in the file instantiating the Fela renderer: all good in development, but broken in production since these dependencies were not installed.

It took me a bit of fiddling to figure out a solution involving Webpack. I would assume it would work similarly in any bundler able to inject global variables during compilation.

The main idea is to have 2 different files exporting plugins and enhances: one for development (`fela.development.js`), and one for production (`fela.production.js`). The development one could look like this:

```js
import beautifier from 'fela-beautifier'
import validator from 'fela-plugin-validator'
import embedded from 'fela-plugin-embedded'

export const enhancers = [beautifier()]
export const plugins = [validator(), embedded()]
```

And the production one:

```js
import embedded from 'fela-plugin-embedded'

export const enhancers = []
export const plugins = [embedded()]
```

Then in Webpack, provide the content of the correct file as a global variable (e.g. `FELA_CONFIG`) based on the environment:

```js
// Using some Fela plugins/enhancers in development exclusively,
// which are (and should be) `devDependencies`. Relying on Webpack
// to provide them to the application to avoid a crash on production
// environments where `devDependencies` are absent.
new webpack.ProvidePlugin({
  FELA_CONFIG: path.resolve(`src/fela.${process.env.NODE_ENV}.js`),
})
```

Finally, when instantiating the Fela renderer, read the plugins and enhancers from the global `FELA_CONFIG` variable.

```js
/* global FELA_CONFIG */
export default createRenderer({
  plugins: FELA_CONFIG.plugins,
  enhancers: FELA_CONFIG.enhancers,
})
```

### Integrating react-dates with Fela

[react-dates](https://github.com/airbnb/react-dates) is a fantastic date-picker library from AirBnB. It’s built on top of Aphrodite and comes with monolithic class names by default in order to be unopinionated regarding the styling layer.

It took us some time to figure out how to integrate it properly with Fela so styles are applied atomically with Fela (and therefore optimised) instead of through the original CSS classes. Fortunately, react-dates offers a way to customise the rendering process with `react-with-styles` interfaces.

```js
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet'

ThemedStyleSheet.registerInterface(OurFelaInterface)
```

Now we just had to write an interface for Fela. I’m going to save you the trouble and show you how it looks. It needs the Fela renderer as an argument in order to compute resolved class names.

```js
import { StyleSheet } from 'fela-tools'
import { combineRules } from 'fela'

// Custom `react-with-styles` interface for Fela:
// https://github.com/airbnb/react-with-styles
export default renderer => ({
  create(styleHash) {
    return StyleSheet.create(styleHash)
  },

  resolve(stylesArray) {
    const styles = stylesArray.flat()
    const rules = []
    const classNames = []

    // This is run on potentially every node in the tree when rendering,
    // where performance is critical. Normally we would prefer using
    // `forEach`, but old-fashioned `for` loops are slightly faster.
    for (let i = 0; i < styles.length; i += 1) {
      const style = styles[i]

      if (!style) continue
      if (style.ruleName) classNames.push(style.ruleName)
      if (typeof style === 'function') rules.push(style)
      else rules.push(() => style)
    }

    const rule = combineRules(...rules)
    const classes = renderer.renderRule(combineRules(...rules))
    classNames.push(classes)

    return { className: classNames.join(' ') }
  },
})
```

### Avoid adblockers messing with styles

One minor problem with atomic classes is that they tend to be incorrectly flagged by adblockers as elements to be hidden. This is something we learnt the hard way mid-2017 and [that we fixed in Fela directly](https://github.com/robinweser/fela/pull/319) with the `filterClassName` option.

By default, Fela now skips the `.ad` class, but there are more to add to the list to make sure no adblocker mess with the styles.

```js
const SKIPPED_CLASSNAMES = [
  // Short for “advertisment”
  'ad',
  'ads',
  'adv',
  // See: https://github.com/adblockultimate/AdBlocker-Ultimate-for-Chrome/blob/3f07afbffa5c389270abe9ee4dc13333ca35613e/filters/filter_9.txt#L867
  'bi',
  'fb',
  'ig',
  'pin',
  'tw',
  'vk',
]

export default createRenderer({
  filterClassName: className => !SKIPPED_CLASSNAMES.includes(className),
})
```

### Custom processing

Thanks to the [fela-plugin-custom-property](https://github.com/robinweser/fela/tree/master/packages/fela-plugin-custom-property) package, it is possible to add support for custom properties. Not the CSS kind though. In that case, custom properties refers to custom-named object properties and their process towards CSS. This plugin can be leveraged to implement warnings or post-processing when writing specific declarations.

Consider for a moment that you expect all your durations to be authored in milliseconds instead of seconds. By surcharging the duration properties, you can warn or even manipulate their value through Fela. For instance, convertion the values into milliseconds:

```js
import custom from 'fela-plugin-custom-property'

const handleDuration = property => value => ({
  // Convert durations expressed in seconds into milliseconds
  // E.g. 0.2s, 1s -> 200ms, 1000ms
  [property]: value.replace(
    /([\d\.]+)[m^]*s/g,
    (_, a) => Number(a) * 1000 + 'ms'
  ),
})

const renderer = createRenderer({
  plugins: [
    custom({
      transitionDuration: handleDuration('transitionDuration'),
      transitionDelay: handleDuration('transitionDelay'),
      animationDuration: handleDuration('animationDuration'),
      animationDelay: handleDuration('animationDelay'),
    }),
  ],
})
```

## Wrapping up

All in all, Fela is an amazing piece of software. It’s pretty powerful, relatively easy to use and very performant. For small to medium scale projects — especially those based on create-react-app — I would probably stick to plain CSS, or maybe Sass. But for anything large scale, I would highly recommend Fela as a bulletproof styling solution.

Despite its relatively small community, Fela has been around for 4 years, and is still actively maintained and update. The future roadmap includes:

- A brand new documentation platform, with more details and examples.
- A revamp of the plugin system for increased performance.
- Small improvements and minor bugfixes across the board.

Robin Weser has also been working on [Elodin](https://elodin-lang.org/) for a few years now, an experimental universal styling language, usable across platforms. If design languages are your thing, be sure to check it out!
