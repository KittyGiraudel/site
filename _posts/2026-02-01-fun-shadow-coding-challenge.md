---
title: Fun shadow coding challenge
keywords:
  - css
  - codepen
  - challenge
  - shadow
---

[Andy Bell shared a little CSS challenge](https://bell.bz/fun-shadow-coding-challenge/). The idea: a scroll-driven scene where a central light source affects the shadow direction of a box. His original prototype is from 8 years ago, and relies heavily on JavaScript to dynamically adjust the shadow. He wondered what we could do today with modern CSS.

[I gave it a go](https://codepen.io/KittyGiraudel/pen/pvbaKBy?editors=0010). Scroll the demo and the shadow should adjust to where the “light” is.

<p class="codepen" data-height="600" data-default-tab="result" data-slug-hash="pvbaKBy" data-pen-title="Fun shadow coding challenge" data-user="KittyGiraudel" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/KittyGiraudel/pen/pvbaKBy">Fun shadow coding challenge</a> by Kitty Giraudel (<a href="https://codepen.io/KittyGiraudel">@KittyGiraudel</a>) on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## The setup

The scene is minimal: a tall scrollable page, a box (dubbed the “shadow pal” in Andy’s demo) that sits in the middle, and a fixed horizontal orange bar at 50% of the viewport height represents the light source. As we scroll, the box moves past the fixed light: the shadow should flip from below the box (when the light is above it) to above the box (when the light is below it).

```html
<div class="shadow-pal"></div>
<div class="light-source"></div>
```

The light source is just a fixed full-width bar. The box gets a scroll-driven animation so its `box-shadow` interpolates between “shadow below” and “shadow above” based on scroll position.

## Scroll-driven animation

The heavy lifting is done by [scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations): you tie an animation to the scroll timeline with `animation-timeline: scroll()`, and you define the scroll range in which that animation runs with `animation-range`. No scroll event listener, no `requestAnimationFrame` — the browser drives the animation from scroll.

In this demo, the box has a short keyframe animation that goes from one `box-shadow` to another:

```css
@keyframes shadow {
  from {
    box-shadow: 0px 10px 20px rgb(0 0 0 / 0.5);
  }
  to {
    box-shadow: 0px -10px 20px rgb(0 0 0 / 0.5);
  }
}
```

At the start of the range the shadow is below (positive Y offset); at the end it’s above (negative Y offset). The trick is to make that range match “when the box crosses the viewport center” — i.e. when it passes the orange line.

We do that by setting the range in terms of the box’s position. We need two values: the scroll offset at which the box’s top edge reaches the center of the viewport, and the scroll offset at which its bottom edge leaves it. In CSS we can’t read `offsetTop` or `offsetHeight`, so we pass them from JavaScript as custom properties:

```js
const box = document.querySelector('.shadow-pal')
box.style.setProperty('--start', box.offsetTop)
box.style.setProperty('--end', box.offsetTop + box.offsetHeight)
```

Then the animation range is:

```css
animation-range: calc(var(--start) * 1px - 50vh) calc(var(--end) * 1px - 50vh);
```

So the animation runs from scroll position `var(--start)` to `var(--end)`, offseted by half the viewport (`50vh`). When we have scrolled so that the box’s top is at the viewport center, we’re at the start of the range (shadow below); when the box’s bottom is at the viewport center, we’re at the end (shadow above). In between, the shadow interpolates. The light is fixed at 50%, so that’s exactly the “crossing the light” interval.

Note that `animation-duration` is set to `1ms` despite the duration making no sense for a scroll-driven animation because [Firefox requires it](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-duration#:~:text=However%2C%20Firefox%20requires%20an%20animation%2Dduration%20to%20be%20set%20for%20it%20to%20successfully%20apply%20the%20animation.). `animation-fill-mode: both` keeps the from/to states applied at the extremes so the shadow doesn’t jump when you’re outside the range.

## Wrapping up

The approach is not without flaws. For starters, it still needs JavaScript to define the top and bottom offsets of the box element used for the animation range. It also needs quite a bit of fiddling to have a pleasant effect that doesn’t feel too forced.

I’ve tried a version with a collection of boxes, and a light source at 25% height (controlled with a CSS custom property), and it looks pretty good actually:

<p class="codepen" data-height="600" data-default-tab="html,result" data-slug-hash="ZYOxxOB" data-pen-title="Fun shadow coding challenge" data-user="KittyGiraudel" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/KittyGiraudel/pen/ZYOxxOB">Fun shadow coding challenge</a> by Kitty Giraudel (<a href="https://codepen.io/KittyGiraudel">@KittyGiraudel</a>) on <a href="https://codepen.io">CodePen</a>.</span>
</p>

I think this is one of these things where some JavaScript is not only needed, but also probably quite important to craft a solution that makes fewer asumptions and work nicely in more flexible circumstances — even if still relying on scroll-driven animations.

Let me know if you come up with a better solution!
