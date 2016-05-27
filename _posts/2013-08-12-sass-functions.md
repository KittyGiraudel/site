---
layout: post
title: "A couple of Sass functions"
tags:
  - sass
  - function
---

We can do awesome things with Sass. It really pushes CSS to an upper level. More than that, it is so much fun to make Sass mixins and functions. Everytime I do something new, I'm like “whoaaa” even if it's a useless thing.

Mixins are usually quite easy to deal with. Functions are a little more underground in Sass. So what if we go through a couple of functions (including useless ones) to see how we can build an efficient ones?

## Strip unit function

If you build mixins or just like to play around the syntax, you may have already faced a case where you'd need to strip the unit from a number. This is not very complicated:

```scss
@function strip-unit($value) {
	@return $value / ($value * 0 + 1);
}
```

It might look weird at first but it's actually pretty logical: to get a number without its unit, you need to divide it by 1 of the same unit. To get `42` from `42em`, you need to divide `42em` by `1em`.

So we divide our number by the same number multiplied by 0 to which we then add 1. With our example, here is what happen: `42em / 42em * 0 + 1`, so `42em / 0em + 1` so, `42em / 1em` so `42`.

```scss
@function strip-unit($value) {
	@return $value / ($value * 0 + 1);
}

$length : 42em;
$int    : strip-unit($length); // 42
```

There has been [a request](https://github.com/nex3/sass/issues/533) to include this function to Sass core but Chris Eppstein declined it. According to him, there is no good usecase for such a thing, and most of existing usages are bad understanding of how units work. So, no `strip-unit()` into Sass!

## Clamp a number

I found this function in a [Sass issue](https://github.com/nex3/sass/pull/402) and was pretty amazed by its efficiency. All credits to its author.

Anyway, this is a function to clamp a number. Clamping a number means restricting it between min and max values.

* `4` clamped to `1-3` equals `3`.
* `-5` clamped to `1-10` equals `1`.
* `42` clamped to `10-100` equals `42`.

```scss
@function clamp($value, $min, $max) {
  @return if($value > $max, $max, if($value < $min, $min, $value));
}
```

To understand this function, you have to understand the `if()` function. `if()` is a function mimicing the well known one-line conditional statement: `var = condition ? true : false`. The first parameter of the `if()` function is the condition, the second one is the result if condition is true, and the first one is the value if condition is false.

Now back to our clamp function, here is what is going on:

1. If the value is greater than the maximum value, it returns `$max`
1. If the value is lesser than or equals to the maximum value and
    * if the value is lesser than the minimum value, it returns `$min`
    * if the value is greater than or equals to the minimum value, it returns `$value`

What I like with this method is it is very concise and damn efficient. With nested `if()`, there is no need of conditional statements, everything lies in one single line.

Now what's the point of this function? I guess that could be useful when you want to be sure the number you pass to a function is between two values, like a percentage for color functions.

```scss
$pc: percentage(clamp($value, 0, 100));
$darkColor: darken($color, $pc);
```

## Unit conversion

This one is a function by Chris Eppstein himself in order to convert an angle into another unit (because [there are 4 different ways of declaring an angle in CSS](http://codepen.io/HugoGiraudel/pen/rdgse)). This one converts angles but you could probably do this for anything fixed (px, in, cm, mm).

```scss
@function convert-angle($value, $unit) {
  $convertable-units: deg grad turn rad;
  $conversion-factors: 1 10grad/9deg 1turn/360deg 3.1415926rad/180deg;
  @if index($convertable-units, unit($value)) and index($convertable-units, $unit) {
    @return $value
             / nth($conversion-factors, index($convertable-units, unit($value)))
             * nth($conversion-factors, index($convertable-units, $unit));
  } @else {
    @warn "Cannot convert #{unit($value)} to #{$unit}";
  }
}
```

Here is how it works: you give it a value and the unit you want to convert your value into (let's say `30grad` into `turn`). If both are recognized as valid units for the function, the current value is first converted into degrees, then converted from degrees into the asked unit. Damn clever and pretty useful!

```scss
$angle-deg: 30deg;
$angle-rad: convert-angle($angle-deg, rad); // 0.5236rad

```

## Import once

When you are working on very big Sass projects, you sometimes wish there was a `@import-once` directive. As of today, if you import twice the same file, its content is outputed twice. Sounds legit, but still sucks.

While we wait for [Sass 4.0](https://github.com/nex3/sass/issues/353#issuecomment-18626307) which will bring the brand new `@import` (solving this issue), we can rely on this little function I found in [an issue](https://github.com/nex3/sass/issues/156) on Sass' GitHub repo.

```scss
$imported-once-files: ();

@function import-once($filename) {
    @if index($imported-once-files, $filename) {
        @return false;
    }

    $imported-once-files: append($imported-once-files, $filename);
    @return true;
}

@if import-once("_SharedBaseStuff.scss") {
    /* ...declare stuff that will only be imported once... */
}
```

The idea is pretty simple: everytime you import a file, you store its name in a list (`$imported-once-files`). If its name is stored, then you can't import it a second time.

It took me a couple of minutes to get the point of this function. Actually, this is how you should probably use it:

```scss
/* _variables.scss: initialize the list */
$imported-once-files: ();

/* _functions.scss: define the function */
@function import-once($filename) {
    @if index($imported-once-files, $filename) {
        @return false;
    }

    $imported-once-files: append($imported-once-files, $filename);
    @return true;
}

/* styles.scss: import files */
@import "variables"; /* Sass stuff only */
@import "functions"; /* Sass stuff only */
@import "component";

/* _component.scss: wrap content depending on function return */
@if import-once('component') {
  .element {
    /* ... */
  }
}
```

Now if you add another `@import "component"` in `styles.scss`, since the whole content of `_component.scss` is wrapped in a conditional statement calling the function, its content won't be outputed a second time. Clever.

> We cannot import a file in a conditional statement.

You probably wonder what prevents us from doing something like this:

```scss
/* styles.scss - this doesn't work */
@if import-once('component') {
  @import "component";
}
```

Unfortunately, we cannot import a file in a conditional statement, [this just don't work](https://github.com/nex3/sass/issues/451). Here is the reason mentioned by Chris Eppstein:

> It was never intended that `@import` would work in a conditional context, this makes it impossible for us to build a dependency tree for recompilation without fully executing the file -- which would be simply terrible for performance.

## Mapping with nested lists

Sass 3.3 will introduce *maps* which come very close to what we often call *associative arrays*. The point is to have a list of `key => value` pairs. It is already possible to emulate some kind of map workaround with nested lists.

Let's have a look at the following list `$list: a b, c d, e f;`. `a` is kind of mapped of to `b`, `c` to `d`, and so on. Now what if you want to retreive `b` from `a` (the value from the key) or even `a` from `b` (the key from the value, which is less frequent)? This is where our function is coming on stage.

```scss
@function match($haystack, $needle) {
  @each $item in $haystack {
    $index: index($item, $needle);
    @if $index {
      $return: if($index == 1, 2, $index);
      @return nth($item, $return);
    }
  }
  @return false;
}
```

Basically, the function loops through the pairs; if `$needle` you gave is found, it checks whether it has been found as the key or the value, and returns the other. So with our last example:

```scss
$list: a b, c d, e f;
$value: match($list, e); /* returns f */
$value: match($list, b); /* returns a */
$value: match($list, z); /* returns false */
```

## Final words

That's all I got folk. Do you have any cool Sass functions you sometimes use, or even made just for the sake of it?
