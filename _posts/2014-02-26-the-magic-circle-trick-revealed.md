---
title: "The Magic Circle: trick revealed"
keywords:
  - css
  - riddle
---

{% info %}
Spoilers! This post is the solution of a CSS riddle proposed in [a previous article](/2014/02/19/the-magic-circle-a-css-brain-teaser/).
{% endinfo %}

Time’s up people! First, thanks for playing. There have been quite a few proposals, all of them very interesting in their own way. In the end, I think the riddle was slightly easier than expected but it’s pretty cool to dig into your code to see how you’ve worked around the problem.

Among the possible solutions, I thought about:

* Pseudo-elements with box-shadows/borders (what I &mdash; and most of you &mdash; came up with)
* Pseudo-elements with duplicated background
* Clip-path
* Radial-gradients
* SVG?

In this post I will be explaining my solution step by step and I’ll end the article by talking about some of the clever proposals you sent me.

## My solution

First, let’s give to Caesar what belongs to Caesar: the original idea comes from [Ana Tudor](https://twitter.com/thebabydino) which I then revisited to make it backward-compatible, decent on small screens, easily maintainable with Sass and so on. So thanks Ana!

Then, be sure to know there is nothing magic in this trick. As a proof, some of you came up with a very similar solution. The main idea behind it is to use pseudo-elements to draw the invisible circle **and** apply a background color to the cropped sections. So for each box, the not-cropped part is colored with a background-color rule, while the cropped part is made of a huge box-shadow (`55em` spread, no blur) on an absolutely positioned pseudo-element.

### Customizing the markup

```html
<ul class="boxes">

  <li class="box  box--top  box--left  box--alpha">
    <section class="box__content">
      <header class="box__header"></header>
      <footer class="box__footer  box__cut"></footer>
    </section>
  </li>

  <li class="box  box--top  box--right  box--beta">
    <section class="box__content">
      <header class="box__header"></header>
      <footer class="box__footer  box__cut"></footer>
    </section>
  </li>

  <li class="box  box--bottom  box--left  box--gamma">
    <section class="box__content">
      <header class="box__header  box__cut"></header>
      <footer class="box__footer"></footer>
    </section>
  </li>

  <li class="box  box--bottom  box--right  box--delta">
    <section class="box__content">
      <header class="box__header  box__cut"></header>
      <footer class="box__footer"></footer>
    </section>
  </li>

</ul>
```

As you can see I added a couple of classes to make the code DRYer:

* `.box--left` to left boxes,
* `.box--right` to right boxes,
* `.box--top` to top boxes
* `.box--bottom` to bottom boxes,
* `.box__cut` to the cropped section of each box (`.box__footer` for top boxes, `.box__header` for bottom boxes).

Also every box has its own name like `.box--alpha`. This is meant to be able to apply color based on a Sass map.

### Setting up Sass variables

Using Sass really helped me achieving such a tricky component. Thanks to Sass variables, it’s getting easy to maintain support for small screens, old browsers or simply update the gutter size or the invisible circle radius.

```scss
$gutter: 2em;
$mask-size: 12em; // Invisible circle
$circle-size: 5em; // Inner disk
$breakpoint: 700px;
$border-radius: 0.25em; // Boxes radius
$colors: (
  alpha: #1abc9c,
  beta: #2ecc71,
  gamma: #3498db,
  delta: #9b59b6
);
```

Everything is computed from there. There will be absolutely no magic number anywhere.

### Styling the container

Let’s start with applying some default styles to our element (`.boxes`, `.box`…).

```scss
// Boxes wrapper
// 1. Clearing inner float
// 2. Enabling position context for pseudo-element
.boxes {
  list-style: none;
  padding: 0 $gutter;
  margin: 0;
  overflow: hidden; // 1
  position: relative; // 2

  // Central dark disk
  &:after {
    content: '';
    position: absolute;
    width: $circle-size;
    height: $circle-size;
    top: 50%;
    left: 50%;
    margin: -$circle-size/2 (0 0) -$circle-size/2;
    border-radius: 50%;
    border: 0.5em solid #2c3e50;
    background: #34495e;

    // Hiding it on small screens
    @media (max-width: $breakpoint) {
      content: none;
    }

    // Hiding it on browsers not supporting box-shadow/border-radius/pseudo-elements
    // Thanks to Modernizr
    .no-boxshadow & {
      content: none;
    }
  }
}
```

I think the code kind of speaks for itself until there. The `:after` pseudo-element is used to create the central dark disk. It is absolutely centered, sized according to Sass variables and so on. We remove it on small screens and unsupported browsers.

### Gutters

One of the rules of the game was to keep the same gutter between left and right boxes and top and bottom boxes. Let’s start with the easiest of both: vertical gutter.

```scss
.box {
  float: left;
  width: 50%;
  margin: $gutter 0;

  // Moving them back to a single column on small screens
  @media (max-width: $breakpoint) {
    width: 100%;
    float: none;
  }
}
```

Boxes spread across half the width of the parent. Some of you people did use `calc` to handle the gutter between left and right boxes right away but it lowers the browser support so we’ll do it differently. For horizontal gutter, here is how we can handle it:

```scss
// Inner box wrapper
.box__content {
  // Adding a right padding on left boxes for the central gutter
  .box--left & {
    padding-right: $margin;
  }

  // Adding a left padding on right boxes for the central gutter
  .box--right & {
    padding-left: $margin;
  }

  // Removing padding on small screens
  @media (max-width: $breakpoint) {
    padding: 0 !important;
  }
}
```

There we go. Since we are using a clean box model (i.e. `box-sizing: border-box`), we can add a padding to the inner wrapper (`section`) &mdash; left or right depending on their position &mdash; in order to simulate the horizontal gutter. No need for calc.

If you want to get rid of the sections at all cost, you can use `calc` however you end up hacking around for Internet Explorer 8 to have gutters. Not an interesting trade-off in my opinion, but that would make the code lighter and more elegant for sure.

### The magic circle

Yes, finally. As I explained at the beginning of the article, the idea consists on simulating background on cropped parts with an absolutely positioned pseudo-element spreading a huge box-shadow.

```scss
// Part that is being truncated by the circle
// 1. Removing background color
// 2. Making sure the box-shadow from pseudo-element doesn’t leak outside the container
// 3. Enabling position context for pseudo-element
.box__cut {
  background: none !important; // 1
  overflow: hidden; // 2
  position: relative; // 3

  // Transparent circle
  // 1. Moving it on a lower plan
  // 2. Applying a very large box-shadow, using currentColor as color
  &:after {
    content: '';
    position: absolute;
    width: $mask-size;
    height: $mask-size;
    z-index: -1; // 1
    border-radius: 50%;
    margin: -($mask-size / 2 + $margin);
    box-shadow: 0 0 0 55em; // 2

    // Hiding it on small screens
    @media (max-width: $breakpoint) {
      content: none;
    }
  }

  // Positioning transparent circle for left boxes
  .box--left &:after {
    right: 0;
  }

  // Positioning transparent circle for right boxes
  .box--right &:after {
    left: 0;
  }

  // Positioning transparent circle for top boxes
  .box--top &:after {
    bottom: 0;
  }

  // Positioning transparent circle for bottom boxes
  .box--bottom &:after {
    top: 0;
  }
}
```

### Dealing with colors

Last but not least, we have to apply colors all over our code like some sort of rainbow unicorn on extasy. Thankfully we made a map binding each box to a fancy color from [FlatUIColors](flatuicolors.com).

```scss
// Applying colors by looping on the color map
@each $key, $value in $colors {
  // Targeting the box
  .box--#{$key} {
    // Applying background colors
    .box__header,
    .box__footer {
      background: $value;
    }

    // Will be used a color for box-shadow
    .box__cut {
      &:after {
        color: darken($value, 10%);
      }

      // Applying background for small screens
      // since the pseudo-element will be hidden
      @media (max-width: $breakpoint) {
        background: darken($value, 10%) !important;
      }

      // Applying background on browsers not supporting box-shadow/border-radius/pseudo-elements
      .no-boxshadow & {
        background: darken($value, 10%) !important;
      }
    }
  }
}
```

We could have used advanced CSS selectors (e.g. `:nth-of-type`) to avoid having to name boxes however that would require either a polyfill for Internet Explorer 8, or another way to select box one by one. Not much point in using fancy selectors then.

### Why box-shadows and not borders?

Some of you used the same trick with borders instead of box-shadows. I think the main pro of using box-shadows is it doesn’t conflict with the box-model since it’s being rendered on its own layer. When you’re dealing with borders, you have to make sure you include the border in the width/height if you’re using `box-sizing: border-box`. And if you don’t… well that’s stupid, this property is golden.

However the major downside of box-shadows is they can be quite intensive for the CPU/GPU, causing expensive repaint when scrolling, especially on older browsers like Internet Explorer 9.

### What about Internet Explorer 8?

When it comes to Internet Explorer 8, or actually any browser not supporting any of the 3 major properties (pseudo-elements, box-shadow, border-radius, pick the lowest common denomitor which happens to be box-shadow), we simply apply a appropriate background color to the `.box__cut` elements. No circle, no big deal.

## Your clever solutions

[Giulia Alfonsi](https://codepen.io/electric_g/pen/tyAcn), [Lokesh Suthar](https://codepen.io/magnus16/pen/sadEg), [One div](https://codepen.io/onediv/pen/Krypb), [mh-nichts](https://codepen.io/mh-nichts/pen/Giokl) and [Hugo Darby-Brown](https://codepen.io/hugo/pen/mIvfz) made it either with borders or box-shadows. Some of them did use `calc` for positioning/sizing although that wasn’t necessary. Good job people.

[Rafał Krupiński](https://codepen.io/rkrupinski/pen/psrBm) came up with a solution using radial-gradients. Even better, he used `calc` **in** the radial-gradients declaration to keep things fluid. You’ve to admit that’s clever. His solution is probably the one involving the lowest amount of code, at the price of browser support though. Anyway, congratulations Rafał!

I was hoping for one, [Gaël Poupard](https://codepen.io/ffoodd/pen/xHFjg) did it: a solution with `clip-path`. Plus his code is fully commented so be sure to have a look at this beauty. Nice one Gaël!

Last but not least, [Vithun Kumar Gajendra](https://codepen.io/vithun/full/gazbD) made an interesting demo animating the pseudo-elements to show the trick. Note he used duplicated background-image on pseudo-elements rather than box-shadows/borders, that’s a cool one too!

Anyway, you can have a look at my fully commented pen here:

<p data-height="520" data-theme-id="0" data-slug-hash="b8e914a2caf8090a9fffa7cf194afc18" data-default-tab="result" class='codepen'>See the Pen <a href='https://codepen.io/HugoGiraudel/pen/b8e914a2caf8090a9fffa7cf194afc18'>b8e914a2caf8090a9fffa7cf194afc18</a> by Kitty Giraudel (<a href='https://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='https://codepen.io'>CodePen</a>.</p>
