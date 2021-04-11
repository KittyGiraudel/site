---
title: 'CSS Pie Timer Revisited'
---

Almost 9 years ago, I wrote about making a [pure CSS pie timer on CSS-Tricks](https://css-tricks.com/css-pie-timer/). It’s something I struggled with and was very proud of solving at the time and I’m glad Chris let me write about it on his site.

For some reason, I was thinking about it the other day and was wondering how quickly I could recreate it almost a decade later, without reading the original article. Well, something like 10 minutes, and I managed to remove 3 HTML elements.

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="KittyGiraudel" data-slug-hash="GRrQgYE" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Single element CSS pie timer">
  <span>See the Pen <a href="https://codepen.io/KittyGiraudel/pen/GRrQgYE">
  Single element CSS pie timer</a> by Kitty Giraudel (<a href="https://codepen.io/KittyGiraudel">@KittyGiraudel</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## HTML

In my original approach, I needed a container and 3 child elements. In this version, I managed to sort it out with a single empty HTML element. I used a `<div>` here.

```html
<div class="pie"></div>
```

{% info %}If you intend to use this as a loading state of some sort, please remember that it doesn’t convey any meaning to assistive technologies as is and should be accompanied with actual text content that can be read. Also SVG might be a better choice for such animation.{% endinfo %}

## CSS

Here is how I thought about making it work: we use 2 pseudo-elements. One will serve as a mask, and the other will be the rotating one.

1. Start by laying both pseudo-elements on the left side of the container on top of each other, so that the one on top has the color of the background (e.g. white), and the colorful one lies hidden underneath.
2. Then, rotate the lower element so it begins appearing.
3. Once it has travelled 180 degrees, abruptly move the mask element on the other side to take its place and change its color to the fill color. For a brief instant, both element have the same color and same position.
4. For the 2nd half of the animation, the rotating element will keep moving, thus filling the other half of the circle.
5. Rince and repeat.

Let’s start with our container.

```css
/**
 * 1. Size the pie as a 1em-wide disc, and use `font-size` to scale it
 *    up or down. This is not the only way, and it could be sized manually 
 *    if deemed preferable.
 * 2. Give a position context for the absolutely-positioned pseudo-
 *    elements.
 * 3. Give it a border so it can be visible despite being empty.
 * 4. Assign a color which is used as border-color, as well as 
 *    background-color by pseudo-elements via `currentcolor`.
 */
.pie {
  font-size: 500%; /* 1 */
  width: 1em; /* 1 */
  height: 1em; /* 1 */
  border-radius: 50%; /* 1 */
  position: relative; /* 2 */
  border: 0.05em solid; /* 3 */
  color: deeppink; /* 4 */
}
```

Then, the base styles for our pseudo-elements:

```css
/**
 * 1. Shape both pseudo-elements as half-circles. Hiding overflow on
 *    the container and skipping border-radius on the pseudo-elements
 *    unfortunately produces glitchy results in Safari.
 * 2. Place them both on the left side of the pie.
 * 3. Make them spin from the center right point, not the middle.
 */
.pie::before,
.pie::after {
  content: '';
  width: 50%; /* 1 */
  height: 100%; /* 1 */
  border-radius: 0.5em 0 0 0.5em; /* 1 */
  position: absolute; /* 2 */
  left: 0; /* 2 */
  transform-origin: center right; /* 3 */
}

/**
 * 1. Put the masking pseudo-element on top.
 */
.pie::before {
  z-index: 1; /* 1 */
  background-color: white; /* 1 */
}

/**
 * 1. Give the spinning pseudo-element the pie color.
 */
.pie::after {
  background-color: currentcolor; /* 1 */
}
```

Finally, the animations:

```css
/**
 * 1. Shared animation properties for both pseudo-elements.
 */
.pie::before,
.pie::after {
  animation-duration: 3s; /* 1 */
  animation-iteration-count: infinite; /* 1 */
}

/**
 * 1. Split the animation into 2 steps instead of a smooth transition,
 *    so it jumps to the final step halfway through.
 */
.pie::before {
  animation-name: mask;
  animation-timing-function: steps(2, jump-none); /* 1 */
}

/**
 * 1. Make sure the rotationg is linear for the effort to work.
 */
.pie::after {
  animation-name: rotate;
  animation-timing-function: linear; /* 1 */
}

@keyframes mask {
  to {
    background-color: currentcolor;
    transform: rotate(0.5turn);
  }
}

@keyframes rotate {
  to {
    transform: rotate(1turn);
  }
}
```

## Wrapping up

That’s it! Definitely simpler than the original approach, with less HTML elements, less CSS, more flexibility and a cleaner output.
