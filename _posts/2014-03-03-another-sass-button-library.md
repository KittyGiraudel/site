---
title: Another Sass button library
keywords:
  - sass
  - button
  - library
---

If you enjoy reading about Sass, you may have stumbled upon Stuart Robson’s [recent article promoting BEM](http://www.alwaystwisted.com/post.php?s=2014-02-27-even-easier-bem-ing-with-sass-33) syntax with new Sass 3.3 features. Pretty cool article; if you haven’t read it, you definitely should.

Anyway, I had a couple of minutes to kill the other day so I opened new [pen](https://codepen.io) and started writing a little button library. Yes, another one! Actually my point wasn’t to improve anything, I just wanted to code some Sass, just for the sake of it.

Anyway, I came up with some interesting things and Stuart suggested I wrote a little something about it so here we are.

## Main principles

My point was to create a base class and a couple of modifiers to be used along with the base class using the brand new `&--modifier` syntax. Then you can stack as many modifiers as you want as long as they don’t conflict with each others (multiple color schemes for instance).

Also the code should be DRY and the CSS output well optimized. As light as it can be! And last but not least, the most important pieces of configuration should be handled with a couple of variables to avoid digging into the code.

## Configuration

Let’s start with the configuration, shall we?

```scss
// Configuration
$btn-name: 'button' !default;
$btn-size-ratio: 1.2 !default;
$btn-hover: saturate 25% !default;
$btn-border: darken 20% !default;
$btn-background: (
  'default': #565656,
  'success': #468847,
  'danger': #b94a48,
  'warning': #c09853,
  'info': #3a87ad
) !default;
```

<figure class="figure">
<img src="https://i.imgur.com/shEzy8H.jpg" alt="Variable all the things!" />
<figcaption>Variable all the things!</figcaption>
</figure>

Everything might not be intuitive so let me explain what each variable is for:

- `$btn-name` is the name of the module (e.g. the base class).
- `$btn-size-ratio` is the ratio used for small and large modifiers. Basically large is `$btn-size-ratio` times bigger than usual, while small is `$btn-size-ratio` smaller than usual.
- `$btn-hover` is a 2 items long list, the first item being the Sass color manipulation function used, while the second is the argument for this function (e.g. `saturate 25%`).
- `$btn-border` kind of works the same way; if not false, it defines the function used to compute the border-color based on the button color. If `false`, it just disables the border.
- `$btn-background` is a map of all color schemes; every color is mapped to a name so a modifier like `.button--default` will make a grey button.

Also note the 2 measures we take to avoid conflicts with user’s code:

- the `!default` flag for each variable,
- namespacing all variables with `$btn-`

## The module

```scss
.#{$btn-name} {
  // Default styles
  padding: 0.5em;
  margin-bottom: 1em;
  color: #fff;

  // Some sex appeal!
  transition: background 0.15s;
  border-radius: 0.15em;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.15);

  // Border or not border?
  border: if($btn-border, 1px solid, none);

  // Modifiers
  &--large {
    font-size: 1em * $btn-size-ratio;
  }

  &--small {
    font-size: 1em / $btn-size-ratio;
  }

  &--bold {
    font-weight: bold;
  }

  &--upper {
    text-transform: uppercase;
  }

  &--block {
    display: block;
    width: 100%;
  }

  // Color schemes
  @each $key, $value in $btn-background {
    &--#{$key} {
      @include button-color($value);
    }
  }
}
```

Here is how it works: we define everything inside a unique CSS selector named after the `$btn-name` variable. For each modifier, we use `&--modifier` which outputs a `.button--modifier` rule at CSS root. I have made a couple of simple modifiers but you could make as many as you want of course.

You can see we make the border conditional thanks to the ternary `if()` function. If `$btn-border` is set to false, then we hide the border, else we add a 1px solid border without specifying any color for now.

Regarding color schemes, we simply loop through the `$btn-background` map, and call a `button-color` mixin passing the color as unique argument. Elegant.

## The color mixin

The `button-color` mixin aims at dealing with color schemes. We have set up quite a few color schemes in the `$btn-background` map over which we’ve iterated to apply those color to the classes they belong to.

Now the mixin will actually apply the background-color to the button, as well as the hover/active state, and the border if not set to false.

```scss
@mixin button-color($color) {
  background-color: $color;

  &:hover,
  &:active {
    background: call(nth($btn-hover, 1), $color, nth($btn-hover, 2));
  }

  @if $btn-border != false {
    border-color: call(nth($btn-border, 1), $color, nth($btn-border, 2));
  }
}
```

Remember what our `$btn-hover` and `$btn-border` variables look like? First a color function, then a percentage. To apply this function to the color, we can use the `call` feature from Sass 3.3.

`call` function calls the function named after the first argument if it exists, passing it all the remaining arguments in the same order. So in our case, the first `call` will be `saturate($color, 25%)`. Meanwhile the second one works the same except it first checks whether the variable is not false. In case `$btn-border` is set to `false`, we should not output the border-color.

### Smart error handling

I don’t know for you, but I don’t like letting the compiler fail. I’d rather handle the potential errors myself; I feel like it’s better for the end user.

So we should probably make a couple of checks to make sure everything’s right before dumping our CSS in the `button-color` mixin. Here is how I did it:

```scss
@mixin button-color($color) {
  $everything-okay: true;

  // Making sure $color is a color
  @if type-of($color) != color {
    @warn "`#{$color}` is not a color for `button-color`";
    $everything-okay: false;
  }

  // Making sure $btn-hover and $btn-border
  // are 2 items long
  @if length($btn-hover) != 2 or length($btn-border) != 2 {
    @warn "Both `$btn-hover` and `$btn-border` should be two items long for `button-color`.";
    $everything-okay: false;
  }

  // Making sure first items from $btn-hover and $btn-border
  // are valid functions
  @if not
    function-exists(nth($btn-hover, 1)) or not
    function-exists(nth($btn-border, 1))
  {
    @warn "Either `#{nth($btn-hover, 1)}` or `#{nth($btn-border, 1)}` is not a valid function for `button-color`.";
    $everything-okay: false;
  }

  // Making sure second items from $btn-hover and $btn-border
  // are percentages
  @if type-of(nth($btn-hover, 2)) !=
    number or
    type-of(nth($btn-border, 2)) !=
    number
  {
    @warn "Either `#{nth($btn-hover, 2)}` or `#{nth($btn-border, 2)}` is not a valid percentage for `button-color`.";
    $everything-okay: false;
  }

  // If there is no mistake
  @if $everything-okay == true {
    // Mixin content
  }
}
```

Always validate user input in your custom functions. Yes, it takes a decent amount of space. Yes, it makes the mixin longer. Yes, it’s a pain in the ass to write. On the other hand, if the user makes a mistake with one of the arguments, he’ll know what’s going on, or why the mixin didn’t output anything.

Note how we use the new `function-exists` from Sass 3.3 to make sure the functions set in `$btn-border` and `$btn-hover` variables actually exists. We could push the tests further by making sure it’s one of `saturate`, `desaturate`, `darken`, `lighten`, `adjust-hue`, `grayscale`, `complement` or `invert` but I feel like we already do a pretty good job covering potential mistakes here.

## Final thoughts

The module is quite simple right now but I feel like it introduces a couple of often overlooked and/or new notions like `call`, `function-exists`, `@warn`, `map`, BEM 3.3…

You can have a look at the final code here:

<p data-height="320" data-theme-id="0" data-slug-hash="Dezad" data-default-tab="result" class='codepen'>See the Pen <a href='https://codepen.io/HugoGiraudel/pen/Dezad'>(Another) Sass button lib</a> by Kitty Giraudel (<a href='https://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='https://codepen.io'>CodePen</a>.</p>
