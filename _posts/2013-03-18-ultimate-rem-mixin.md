---
title: The ultimate PX/REM mixin
keywords:
  - sass
  - px
  - rem
  - mixin
---

> **Edit (2014/11/16):** I have changed my mind again and no longer use Sass to “remify”. In most projects, I’ve noticed it’s better to use a postprocessor such as [px_to_rem](https://github.com/songawee/px_to_rem).

<!-- -->

> **Edit (2014/05/13):** this article is getting old and while it still is perfectly valid, I have kind of changed my mind about this whole px to rem thing. I now use something simpler, like [this mixin](https://css-tricks.com/snippets/css/less-mixin-for-rem-font-sizing/).

## About REM

Everybody loves relative units. They are handy and help us solve daily problems. However the most used one (`em`) presents some issues, especially when it comes to nesting.

As an example, setting both `p` and `li` tags font-size to `1.2em` may seem fine. But if you ever happen to have a paragraph inside a list item, it would result in a font-size 1.44 times (1.2 \* 1.2) bigger than parent font-size, and not 1.2 as wished.

To avoid this, a new unit has been created: [`rem`](https://snook.ca/archives/html_and_css/font-size-with-rem). It stands for _root em_. Basically, instead of being relative to the font-size of its direct parent, it’s relative to the font-size defined for the `html` element.

You may have already seen something like this in frameworks, demo, blog posts and such:

```css
html {
  font-size: 62.5%;
}

body {
  font-size: 1.6rem;
}
```

Because all browsers have a default font-size of `16px`, setting the font-size to 62.5% on the html element gives it a font-size of 10px (10 / 16 \* 100 = 62.5) without explicitely setting it to `10px` which would prevent zooming. Then, setting a font-size of 1.6rem on the body element simply results in a font-size of `16px`, cascading through the whole DOM tree.

Then, if I want an element to have like a `28px` font-size, I simply have to do `.element { font-size: 2.8rem; }`, no matter the size of its parent.

Everything is great, however [rem isn’t supported in all browsers](https://caniuse.com/#feat=rem), especially not in Internet Explorer 8, which is still required in most projects. It means we have to **give a fallback** for this browser.

## Mixin to the rescue!

Having to define twice the font-size property everytime you have to set the size of a text element sucks. This is the moment you’d like to have a wonderful mixin handling everything for you. Well, **WISH GRANTED!**

### About the mixin

There are already many mixins handling `px` fallback for `rem` usage, most of them do it very well. However this one pushes things a step further. It is inspired by [this rem mixin](https://github.com/drublic/Sass-Mixins/blob/master/rem.scss) by [Hans Christian Reinl](https://twitter.com/drublic), revamped by myself to make it even more awesome. Here are the features:

- Accepts either `px` or `rem` as an input value
- Accepts (almost) any property as an input, not only font-size
- Accepts multiple values, like `10px 20px` (for padding or margin as an example)

### Let’s open the beast

```scss
html {
  font-size: 62.5%; /* 1 */
}

@function parseInt($n) {
  /* 2 */
  @return $n / ($n * 0 + 1);
}

@mixin rem($property, $values) {
  $px: (); /* 3 */
  $rem: (); /* 3 */

  @each $value in $values {
    /* 4 */

    @if $value == 0 or $value == auto {
      /* 5 */
      $px: append($px, $value);
      $rem: append($rem, $value);
    } @else {
      $unit: unit($value); /* 6 */
      $val: parseInt($value); /* 6 */

      @if $unit == 'px' {
        /* 7 */
        $px: append($px, $value);
        $rem: append($rem, ($val / 10 + rem));
      }

      @if $unit == 'rem' {
        /* 7 */
        $px: append($px, ($val * 10 + px));
        $rem: append($rem, $value);
      }
    }
  }

  @if $px == $rem {
    /* 8 */
    #{$property}: $px; /* 9 */
  } @else {
    #{$property}: $px; /* 9 */
    #{$property}: $rem; /* 9 */
  }
}
```

This may be a bit rough so let me explain it:

1. The mixin relies on a baseline of `10px`
1. The mixin relies on a function to parse the integer from a value with a unit
1. We define a list of values for both units
1. We iterate through each value in the given parameter `$values`
1. If the value is either `auto` or `0`, we append it to the list as-is
1. If the value has a unit, we split it to get both the unit and the raw value
1. We append according values to the lists depending on the unit of the given value
1. If the two lists are the same, we ouput only one (like `margin-top: 0`)
1. We output the result

_Thanks to [Moving Primates](https://twitter.com/movingprimates) to improve the mixin by adding step 8. ;)_

### Usage

Using it is pretty straightforward:

```scss
html {
  font-size: 62.5%;
}

body {
  @include rem(font-size, 1.6rem);
  @include rem(padding, 20px 10px);
}
```

… outputs:

```css
html {
  font-size: 62.5%;
}

body {
  font-size: 16px; /* Fallback for IE8 */
  font-size: 1.6rem;
  padding: 20px 10px; /* Fallback for IE8 */
  padding: 2rem 1rem;
}
```

### Remaining issues

There are still some issues with this mixin:

- Doesn’t work with all properties (border shorthand among others)
- Doesn’t fallback if you input a wrong value (wrong unit or unitless value as an example)
- Relies on a defined baseline; however this is easily fixed by adding a `$baseline` parameter to the mixin
- Relies on a `parseInt()` function; I’ve proposed it to Compass, let’s hope they add it anytime soon

If you ever happen to find a decent solution to fix one, I’ll be glad to know and add it!

## Final words

That’s pretty much it folks. I’d be glad to hear your opinion on this and improve it with your ideas. :)

If you want a playground to test and hack, please feel free to fork [my pen](https://codepen.io/HugoGiraudel/pen/xsKdH).
