---
title: Folded corner with CSS
description: A technical walkthrough of creating a folding corner effect with CSS.
tags:
  - CSS
  - Design
---

While browsing through my CodePen, I stumbled upon a demo I made for my sister a while ago. She wanted to have this hover effect where the corner of the picture would fold over, as if peeling off a sticker from a flat surface. Try it below or [on CodePen](https://codepen.io/KittyGiraudel/pen/raNoZLr?editors=0100).

{% include "demos/folded-corner.liquid",
  id:          "full-demo",
  with_shadow:        true,
  with_extra_shadows: true,
  with_styles:        true,
  with_fold:          true,
  forced:            false
%}

I remember working on it quite a bit, so I thought it would be worth an technical walkthrough. The idea is to use the `clip-path` property to create the folded corner effect. This also enables us to animate the effect, since `clip-path` work seamlessly with CSS transitions.

We are going to layer 3 different things:

1. The image with a cropped corner.
2. The white triangle representing the back of the image.
3. A triangular shadow below the white triangle to give some depth.

## Cropping the image

The first thing we need is to crop our image so that its corner disappear. In a way, we want to go from having a rectangle to having a 5-sided shape. This is where `clip-path: polygon()` comes in. We are going to go from a polygonal value that doesn’t crop anything, to a value that has 5 points forming our final shape.

```css
.ImageContainer {
  clip-path: polygon(
      0%    0%, /* Top left */
    100%    0%, /* Top right */
    100%  100%, /* Bottom right */
      0%  100%  /* Bottom left */
  );
}
```

Then on hover, we want to actually apply a clip path:

```css
.ImageContainer {
  clip-path: polygon(
     30%    0%, /* Top edge */
    100%    0%, /* Top right */
    100%  100%, /* Bottom left */
      0%  100%, /* Bottom right */
      0%   25%  /* Left edge */
  );
}
```

{% include "demos/folded-corner.liquid",
  id:           "crop-only",
  with_shadow:        false,
  with_extra_shadows: false,
  with_styles:        false,
  with_fold:          false,
  forced:              true
%}

There really are only 2 values that change: {% footnoteref "pinch-values" "These values are totally arbitrary, and they have been defined by trial and error until it looks okay." %}the pinch on the top edge (at 30% of the width), and the pinch on the left edge (at 25% of the height){% endfootnoteref %}. We can use CSS custom properties to avoid authoring the whole clip path twice and to add some meaning behind the values:

```css/2,6,11,12
.ImageContainer {
    clip-path: polygon(
      var(--fold-start-x)  0%, /* Top edge */
      100%                 0%, /* Top right */
      100%               100%, /* Bottom right */
      0%                 100%, /* Bottom left */
      0%  var(--fold-start-y)  /* Left edge */
  );
}

.ImageContainer:hover {
  --fold-start-x: 30%;
  --fold-start-y: 25%;
}
```

## Creating the fold

Now, we need to superimpose a {% footnoteref "fold-color" "It doesn’t actually <em>have</em> to be white. It can be any color you think the back of the image should be. I found out that white gives the most “realistic” effect, but that’s subjective if anything." %}white{% endfootnoteref %} triangle that represents the folded part of the image. We already have 2 of our 3 points: the top and the left pinches. We need a 3rd point that represent the corner of the image, and the lower point of our triangle. Again, we can use CSS properties to make things cleaner.

```css
.ImageContainer {
  --fold-corner-x: 0%;
  --fold-corner-y: 0%;
}

.ImageContainer::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: white;
  z-index: 2;
  clip-path: polygon(
    var(--fold-start-x)                     0%, /* Top edge */
    0%                     var(--fold-start-y), /* Left edge */
    var(--fold-corner-x)  var(--fold-corner-y)  /* Image corner */
  );
}

.ImageContainer:hover::before {
  --fold-corner-x: 15%;
  --fold-corner-y: 31%;
}
```

{% include "demos/folded-corner.liquid",
  id:           "with-fold",
  with_shadow:        false,
  with_extra_shadows: false,
  with_styles:        false,
  with_fold:           true,
  forced:              true
%}

## Adding a shadow

Now, we need to add another triangle below the white one that will be used to create a shadow. Conceptually, it’s the same, but the offset should be a bit further out, and the background should be a shade of black.

```css
.ImageContainer {
  --shadow-corner-x: 0%;
  --shadow-corner-y: 0%;
}

.ImageContainer::after {
  content: '';
  inset: 0;
  z-index: 1;
  background-color: var(--shade);
  clip-path: polygon(
    var(--fold-start-x)                        0%, /* Top edge */
    0%                        var(--fold-start-y), /* Left edge */
    var(--shadow-corner-x) var(--shadow-corner-y)  /* Shadow corner */
  );
}

.ImageContainer:hover::after {
  --shadow-corner-x: 15%;
  --shadow-corner-y: 31%;
}
```

{% include "demos/folded-corner.liquid",
  id:         "with-shadow",
  with_shadow:         true,
  with_extra_shadows: false,
  with_styles:        false,
  with_fold:           true,
  forced:              true
%}

### Nicer shadow

The problem with a shadow like this is that it’s too sharp. It should be a bit more blurry, really. Unfortunately, we cannot use `filter: blur(..)` with `clip-path` as {% footnoteref "blur-filter" "If you manage to make <code>filter: blur(..)</code> work, please do let me know as I’d like to learn." %}it doesn’t work the way we’d expect{% endfootnoteref %}.

I found an ugly workaround, which involves creating a dozen decorative `<div>` elements, each very marginally offset to create a subtle blur effect. 

```html
<div class="ImageContainer__shadow">
  <div></div>
  <!-- … as many more as one wants -->
  <div></div>
</div>
```

Each shadow is also a triangle, placed like the fold and the primary shadow, except its 3rd point is offset by half a pixel or a pixel, based on its index.

```css
.ImageContainer {
  --shadow-offset-x: 0.5px;
  --shadow-offset-y: 1px;
}

.ImageContainer__shadow > * {
  clip-path: polygon(
    var(--fold-start-x) 0%, /* Top edge */
    0% var(--fold-start-y), /* Left edge */
    calc(var(--shadow-corner-x) + var(--shadow-offset-x) * var(--index))
    calc(var(--shadow-corner-y) + var(--shadow-offset-y) * var(--index))
  );
}

.ImageContainer__shadow > :nth-child(1)  { --index:  1; }
.ImageContainer__shadow > :nth-child(2)  { --index:  2; }
.ImageContainer__shadow > :nth-child(3)  { --index:  3; }
.ImageContainer__shadow > :nth-child(4)  { --index:  4; }
.ImageContainer__shadow > :nth-child(5)  { --index:  5; }
.ImageContainer__shadow > :nth-child(6)  { --index:  6; }
.ImageContainer__shadow > :nth-child(7)  { --index:  7; }
.ImageContainer__shadow > :nth-child(8)  { --index:  8; }
.ImageContainer__shadow > :nth-child(9)  { --index:  9; }
.ImageContainer__shadow > :nth-child(10) { --index: 10; }

```

{% include "demos/folded-corner.liquid",
  id:        "with-shadows",
  with_shadow:         true,
  with_extra_shadows:  true,
  with_styles:        false,
  with_fold:           true,
  forced:              true
%}

We can negate the need for this `--index` custom property with the [`sibling-index()` function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/sibling-index). The browser support is good, but Firefox doesn’t yet support it, so that’s not an option for the time being. 

```css
.ImageContainer__shadow > * {
  clip-path: polygon(
    var(--fold-start-x) 0%, /* Top edge */
    0% var(--fold-start-y), /* Left edge */
    calc(var(--shadow-corner-x) + var(--shadow-offset-x) * sibling-index())
    calc(var(--shadow-corner-y) + var(--shadow-offset-y) * sibling-index())
  );
}
```

## Animating the effect

As mentioned at the beginning of this article, the animation really is just a transition between `clip-path` values for all our elements.

```css
.ImageContainer {
  transition: clip-path 400ms;
}

.ImageContainer::after,
.ImageContainer::before,
.ImageContainer__shadow,
.ImageContainer__shadow > * {
  transition: inherit;
}
```

## Wrapping up

It’s far from perfect:

- The `clip-path` values need some manual tweaking to find something that feel nice. 
- Even with that, it still feels a bit rigid (due to lack of curves).
- Folding another corner would require additional work.
- We need a lot of decorative elements because we cannot use a blur filter. 
- We can’t use `sibling-index()` either yet to make things simpler. But still, it works, it does the job quite nicely.

If you find any way to improve it, be sure to let me know! 🚀