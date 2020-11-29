---
guest: Daniel Guillan
title: Modernizr Sass mixin
keywords:
  - sass
  - mixin
  - modernizr
---

> The following is a guest post by Daniel Guillan. Daniel is the co-founder and chief design officer at Vintisis. I am very glad to have him here today, writing about a clever mixin to ease the use of Modernizr with Sass.

I use [Modernizr](https://modernizr.com/) on every single project I work on. In a nutshell, it’s a JS library that helps us take decisions based on the capabilities of the browser accessing our site. Modernizr quickly performs tests to check for browser support of modern CSS and HTML implementations like CSS 3d Transforms, HTML5 Video or Touch Events among [many many others](https://modernizr.com/download/).

Once it has checked for the features we intend to use, Modernizr appends classes to the `<html>` tag. We can then provide a set of CSS rules to browsers that support those features and another set of fallback rules to browsers that don’t support them.

I created a Sass mixin that helps us write those rules in a _DRYer_ and more comprehensive way, reducing the amount of code needed and making it less error-prone and far easier to read and maintain.

Before jumping into the code for the actual mixin, let’s see how we actually write Modernizr tests in plain CSS.

## Plain CSS

This is how we can write a rule-set to add a CSS3 gradient background:

```css
.cssgradients .my-selector {
  background-image: linear-gradient(to bottom, #fff, #000);
}
```

For browsers that don’t support CSS gradients or for those where Javascript is not available or disabled and thus we can’t test for support, we will need a fallback rule-set:

```css
.no-js .my-selector,
.no-cssgradients .my-selector {
  background-image: url('gradient.png');
  background-repeat: repeat-x;
}
```

## Making it Sassier

Sass allows selectors and rules to be [nested](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#nested_rules) so we can make that code prettier and much more organized, avoiding repetition of the selector:

```scss
.my-selector {
  .cssgradients & {
    background-image: linear-gradient(to bottom, #fff, #000);
  }

  .no-js &,
  .no-cssgradients & {
    background-image: url('gradient.png');
    background-repeat: repeat-x;
  }
}
```

## Even better with a mixin

> Easy? Yep and Nope.

Having written a lot of selectors and rules like the above, I got a bit tired of that code. It’s not a complicated code at all, but it’s a bit messy, it isn’t that easy to read and maintain and I tend to forget to add the `.no-js &` bit. So I thought a couple of mixins would do the job.

One mixin would write the rule-set for available features. I called it `yep`. The other one, `nope`, would add the fallback rule-set. We use them like so:

```scss
.my-selector {
  @include yep(cssgradients) {
    // …
  }

  @include nope(cssgradients) {
    // …
  }
}
```

That’s extremely easy, I thought. This is all the code we actually need to make those two mixins work:

```scss
@mixin yep($feature) {
  .#{$feature} & {
    @content;
  }
}

@mixin nope($feature) {
  .no-js &,
  .no-#{$feature} & {
    @content;
  }
}
```

## Multiple features at once

Ouch! What if we need to test for multiple features at the same time?

It isn’t as straightforward as I first thought. The `yep` mixin should not produce the same kind of selectors as the `nope` mixin. Take this example: we want to test for `csstransforms` **and** `opacity` and declare a specific rule-set. But if one of those features isn’t supported, we need to fall back on another rule-set.

This is the compiled CSS we are looking for:

```scss
.csstransforms.opacity .my-selector {
  // …
}

.no-js .my-selector,
.no-csstransforms .my-selector,
.no-opacity .my-selector {
  // …
}
```

One thing I strived for was to keep the code as DRY as possible using some of the newness in Sass 3.3. As I worked through the logic I found that a single mixin could handle both cases.

## Aliases

I created a main `modernizr` mixin to handle both situations. You won’t use it directly on your Sass stylesheet, but it’s used internally by `yep` and `nope`. In fact, `yep` and `nope` are merely aliases of this more complex mixin. They only do one thing: call the `modernizr` mixin with the set of features you’re passing, and set a `$supports` variable you won’t need to remember.

That’s it, they’re meant to be easier to remember because they require only one parameter: `$features...`, faster to write because they are shorter and make the whole thing extremely easy to read because you instantly know what the intention of the code is.

```scss
// `yep` is an alias for modernizr($features, $supports: true)
@mixin yep($features...) {
  @include modernizr($features, $supports: true) {
    @content;
  }
}

// `nope` is an alias for modernizr($features, $supports: false)
@mixin nope($features...) {
  @include modernizr($features, $supports: false) {
    @content;
  }
}
```

## The ultimate mixin

The `modernizr` mixin expects two arguments: `$features` which is our `argList`, a comma-separated list of features and `$supports`, a boolean which will be used to output the yep or the nope rules.

```scss
@mixin modernizr($features, $supports) {
  // Sass magic
}
```

Inside the mixin I set three variables to handle everything we need to generate.

### The prefix

We need to use the `no-` prefix if checking for unsupported features (e.g. `.no-opacity`). If checking for supported features we need no prefix at all so we’ll use an empty string in this case:

```scss
$prefix: if($supports, '', 'no-');
```

### The selector

To generate our feature selector (e.g. `.opacity.csstransforms` or `.no-opacity, .no-csstransforms`), we need two different strategies. We have to create a string if checking for supported features and we’ll concatenate the class names later on. Or create a list if checking for unsupported features. We’ll append class names later on too.

```scss
$selector: if($supports, '', unquote('.no-js'));
```

### The placeholder

You’ll see that all the magic that handles this thing is done by a placeholder. We’ll need to give it a name that will look something like `%yep-feature` or `%nope-feature`.

```scss
$placeholder: if($supports, '%yep', '%nope');
```

### Error handling

I also set a variable `$everything-okay: true` which is meant for error handling. More on this later on.

### Generating the placeholder and selectors

Now it’s time to create our feature selectors and our placeholder names. We’ll loop through the passed `$features` to do so:

```scss
@each $feature in $features {
  // …
}
```

Within that loop we just need three lines of code. They’re a bit heavy, but what they accomplish is quite simple:

### Generate our placeholder name

```scss
$placeholder: $placeholder + '-' + $feature;
```

The resulting `$placeholder` variables will look something like `%yep-opacity-csstransforms` or `%nope-opacity-csstransforms`

### Generate our selector name

```scss
$new-selector: #{'.' + $prefix + $feature};
$selector: if(
  $supports,
  $selector + $new-selector,
  append($selector, $new-selector, comma)
);
```

`$new-selector` will look something like `.csstransforms` or `.no-csstransforms`. We then concatenate `$new-selector` or append it to the list (e.g. `.opacity.csstransforms` or `.no-opacity, .no-csstransforms`).

That’s it for generating our placeholder and selector names. Take the `opacity` and `csstransforms` example. This is the result of using `@include yep(opacity, csstransforms)`;

```scss
@debug $placeholder; // %yep-opacity-csstransforms
@debug $selector; // .opacity.csstransforms
```

And this the result of using `@include nope(opacity, csstransforms)`:

```scss
@debug $placeholder; // %nope-opacity-csstransforms
@debug $selector; // .no-js, .no-opacity, .no-csstransforms
```

### The placeholder and @content

It’s time to write our placeholder. We use [Sass interpolation](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#interpolation_) to write the name we’ve generated within the loop and then print the declaration block (`@content`) we’ve passed within the `yep` or `nope` mixin.

```scss
#{$placeholder} & {
  @content;
}
```

### Extending with @at-root

Now we’ll print our features `$selector`(s) and extend the placeholder. But, there’s a little problem here, if we extend the placeholder as-is:

```scss
#{$selector} {
  @extend #{$placeholder};
}
```

we’ll get an unexpected CSS output:

```scss
.my-selector .opacity.csstransforms .my-selector {
  // …
}
```

We need something to fix this. Sass 3.3's @at-root directive comes to the rescue:

```scss
@at-root #{$selector} {
  @extend #{$placeholder};
}
```

Now our features selector isn’t placed before the actual selector because `@at-root` cancels the selector nesting.

## Error handling

```scss
@if type-of($feature) != 'string' {
  $everything-okay: false;
  @warn '`#{$feature}` is not a string for `modernizr`';
} @else {
  // proceed …
}
```

Within the previous loop we’ll also check if every `$feature` is a `string`. As Hugo Giraudel explains in their [introduction to error handling in Sass](https://webdesign.tutsplus.com/tutorials/an-introduction-to-error-handling-in-sass--cms-19996) we shouldn’t let the Sass compiler fail and punch us in the face with an error. That’s why we should prevent things like `10px` or even nested lists like `(opacity csstransforms), hsla` to stop our stylesheet from successfully compiling.

If a wrong parameter is passed, the compilation won’t fail, but nothing will be generated and you’ll be warned of the problem.

If `$everything-okay` is still `true` after we iterate through the list of features, we’re ready to generate the output code.

## Final thoughts

It all started as a small Sass experiment and ended up being an incredibly interesting challenge. I came up with a piece of code that I never thought would make me push the Sass syntax as far as I did. It was really interesting to develop a solution that uses so many different Sass features like the `@at-root` directive, loops (`@each`), the ampersand (`&`) to reference parent selectors, the `if()` function, placeholders, list manipulation, … and also stuff like mixin aliases and error handling.

That’s it, you can play with the code on [SassMeister](https://www.sassmeister.com/gist/10578910) or [view the documentation and download on Github](https://github.com/danielguillan/modernizr-mixin). The Modernizr mixin is available as a [Compass extension](https://rubygems.org/gems/modernizr-mixin) too.

<p class="sassmeister" data-gist-id="10578910" data-height="480"><a href="https://www.sassmeister.com/gist/10578910">Play with this gist on SassMeister.</a></p><script src="https://static.sassmeister.com/js/embed.js" async></script>

> Daniel Guillan is the co-founder and chief design officer at Vintisis. Not only designer but also front-end developer, Daniel likes using Sass to make his life easier. You should catch him on [Twitter](https://twitter.com/danielguillan).
