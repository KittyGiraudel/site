---
guest: Jesús Ricarte
title: Using calc to figure out optimal line-height
keywords:
  - css
  - gradient
---

> The following is a guest post by [Jesús Ricarte](https://twitter.com/supersimplenet), a frontend developer and volunteer translator for A List Apart in Spanish. I’m very glad to have him writing here today about line heights and using math in CSS!

Although we can apply any CSS Unit to line-height, a [unitless](https://css-tricks.com/almanac/properties/l/line-height/#article-header-id-0) 1.5 value is the most recommended way to handle it. To begin with, an explanatory image on how line-height is applied by the browser:

![Using calc to figure out optimal line-height](/assets/images/using-calc-to-figure-out-optimal-line-height/line-height.png)

As you can see, every line-height is distributed in different areas:

1. A “content area”, that would be ≈1 tall.
2. A “leading area”, that would be the remaining space, halved in top & bottom leadings.

Therefore we could express it as:

```js
lineHeight = leading / 2 + content + leading / 2
```

Or:

```scss
line-height: calc(0.25 + 1 + 0.25);
```

However, this approach has a maitenance downside: as you can note in following demo, it sets too much line height in larger font sizes. In order to establish an optimal readability, we must manually tweak it on every `font-size` increment, down to 1.1 on very large font sizes.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="result" data-user="supersimplenet" data-slug-hash="RwWyjKV" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="calc line-height: demo 1">
  <span>See the Pen <a href="https://codepen.io/supersimplenet/pen/RwWyjKV">
  calc line-height: demo 1</a> by super-simple.net (<a href="https://codepen.io/supersimplenet">@supersimplenet</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## Looking for a formula

To have a clearer way, let's take a look to our demo figures, on a comparison table (computed line-height values are in pixels for easier understanding):

|                 | line-height: 1.5 | line-height: 1.1 |
| :-------------- | :--------------- | :--------------- |
| font-size: 10px | 15px             | ~~11px~~         |
| font-size: 50px | ~~75px~~         | 55px             |

In order get an optimal `line-height` we will need to be as close as possible to **1.5** value (15px), on smaller font sizes, but closer to **1.1** (55px) on larger ones.

Wait… 11px is already pretty close to 15px. We're just a few pixels away.

So, instead of starting on a **1.5** value, why don't we flip it over? We could start down from **1.1**, adding just the few pixels we need, which will make almost no visual difference in larger font sizes, but on smaller ones.

Something like:

```scss
line-height: calc(2px + 1.1 + 2px);
```

Revisiting our computed `line-height` comparison table:

|                 | LH 1.5   | LH (2px + 1.1 + 2px) | LH 1.1   |
| :-------------- | :------- | -------------------- | :------- |
| font-size: 10px | 15px     | 15px                 | ~~11px~~ |
| font-size: 50px | ~~75px~~ | 59px                 | 55px     |

That's better! We nailed it in small font sizes, and get pretty close on larger ones.

Unfortunately, `line-height: calc(2px + 1.1 + 2px)` is invalid CSS, since unit & unitless values can't be mixed. Could we use any relative unit that gets computed to about 1.1?

Kind of: the [`ex`](https://developer.mozilla.org/en-US/docs/Web/CSS/length#ex) unit computes to current font x-height (the height of the lowercase letter “x”), so we just find out the perfect match for our formula.

In fact, any relative unit (`em`, `rem`…) can be used, but since we’re calculating line _height_, it makes sense to use a height unit.

Since every typeface has its own `ex` value, we still need to fine-tune our `px` & `ex` values. Anyway, consider this a good starting point:

```scss
line-height: calc(2px + 2ex + 2px);
```

As you can see in following demo, it sets a very nice line height, in a wide range of different typefaces:

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="result" data-user="supersimplenet" data-slug-hash="vYNjaem" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="calc line-height: demo 2">
  <span>See the Pen <a href="https://codepen.io/supersimplenet/pen/vYNjaem">
  calc line-height: demo 2</a> by super-simple.net (<a href="https://codepen.io/supersimplenet">@supersimplenet</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

That’s valid CSS. Also, [the `ex` unit has very good browser support](https://caniuse.com/#feat=mdn-css_types_length_ex). Hooray!

## Descendant elements

If you apply the formula on a parent element, and `font-size` is a changed on a descendant element, `line-height` would be unafected on the descendant, since it has been calculated based on parent `font-size`:

```css
.parent {
  font-size: 20px;
  line-height: calc(2px + 2ex + 2px);
  /* computed: 2px + (2 * 20px) + 2px = 44px */
}

.parent .descendant {
  font-size: 40px;
  /* desired:  2px + (2 * 40px) + 2px = 84px */
  /* computed: 2px + (2 * 20px) + 2px = 44px (same as .parent) */
}
```

This can be solved by applying the formula to all descendants, with the universal selector:

```scss
.parent * {
  line-height: calc(2px + 2ex + 2px);
}
```

## On responsive typography

Our formula also helps with [reponsive typography](https://www.madebymike.com.au/writing/precise-control-responsive-typography/). Using relative-to-viewport units (`vw`, `vh`, `vmin`, `vmax`) leads to a lack of fine control, so we can't tweak line-height on every font-size change.

This issue was also tackled by [CSS locks technique](https://fvsch.com/css-locks/), which uses relatively complex arithmetic to establish a minimum and maximum line-height.
