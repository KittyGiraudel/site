---
title: A new Sass mixin for offsets
keywords:
  - sass
  - mixin
  - offsets
---

> **Edit (2015/06/06)**: One year later, I know think it’s better not to have a mixin for this. Less Sass, more native CSS.

About a year ago, I wrote about how I managed to come up with what I think is [a clever Sass mixin to deal with offset positioning](/2013/08/05/offsets-sass-mixin/) in CSS, also known as `top`, `right`, `bottom` and `left`.

The mixin was directly inspired from [Nib](https://github.com/visionmedia/nib), [Stylus](https://stylus-lang.com/)' most popular framework. The idea is to be able to declare all desired offsets in a single declaration rather than having to write multiple CSS properties.

```scss
// Stylus syntax
selector {
  absolute: top 1em right 100%;
}
```

When looking back at Nib’s documentation a couple of weeks ago, I noticed there are a couple of features I missed when implementing the Sass version of this little gem. Hence the brand new version of the mixin, and the blog post explaining the process.

Unfortunately, Sass in its SCSS syntax doesn’t provide as much abstraction as Stylus does, so we still have to use some extra characters, especially `@include`, parenthesis, colons and semi-colons… That being said, the result is quite good in my opinion.

```scss
// SCSS
selector {
  @include absolute(top 1em right 100%);
}
```

## What we want? Offsets!

Before jumping on the code, it is important to analyze the topic so we can implement things right. There are a few different use cases, but the main idea is always the same: we loop through the 4 offsets to see if they are being passed to our mixin. Then, depending on how it’s going, various things happen. Let’s see each case one by one.

Case 1. **The offset has not been found in the list.** Obviously, we stop there and do not output it.

Case 2. **The offset has been found at the last index of list.** We output it to `0`.

```scss
// SCSS
@include absolute(top);

// CSS
position: absolute;
top: 0;
```

Case 3. **The offset has been found and the next item is another offset.** We output it to `0`.

```scss
// SCSS
@include absolute(top left);

// CSS
position: absolute;
top: 0;
left: 0;
```

Case 4. **The offset has been found and the next item is invalid.** An invalid value could be a string other than `auto`, `initial` and `inherit`, or any value that is not a number, or a unitless number. In any case, we do not output the offset.

```scss
// SCSS
@include absolute(top 'string');

// CSS
position: absolute;
```

Case 5. **The offset has been found and the next item is valid.** Of course then, we output the offset with the next item as a value.

```scss
// SCSS
@include absolute(top 1em);

// CSS
position: absolute;
top: 1em;
```

So if we sum up:

* if offset doesn’t exist or offset exists but is followed by an invalid value, we don’t output it
* if offset exist as last item or offset is followed by another offset, we output it to `0`
* if offset exist and is followed by valid value, we output it to the value

## Starting with the helper

As you may have understood from what we have just seen, we will need to determine if the value directly following the offset is a valid value for an offset property (`top`, `right`, `bottom` or `left`). Nothing better than a little function to do that.

Should be considered as a valid length:

* a number with a unit
* `0`
* `auto`
* `initial`
* `inherit`

```scss
@function is-valid-length($value) {
  @return (type-of($value) == 'number' and not unitless($value)) or (index(auto initial inherit 0, $value) != false);
}
```

The function is as simple as that. First we check if it’s a number with a unit. If it is not, we check whether it is an allowed value. If it is not again, then it is not a valid length for an offset property.

## Building the mixin

Now that we have our helper function and all our use-cases, it is time to move on to the mixin.

```scss
@mixin position($position, $args: ()) {
  $offsets: top right bottom left;
  position: $position;

  @each $offset in $offsets {
    // Doing the magic trick
  }
}
```

From there, we iterate through the offsets list (so 4 times) and for each one, we do the checks we discussed in the first section of this article. I added comments to the code so you can follow along but it is pretty straight forward anyway.

```scss
// All this code happens inside the loop
$index: index($args, $offset);

// If offset is found in the list
@if $index {
  // If it is found at last position
  @if $index == length($args) {
    #{$offset}: 0;
  }

  // If it is followed by a value
  @else {
    $next: nth($args, $index + 1);

    // If the next value is value length
    @if is-valid-length($next) {
      #{$offset}: $next;
    }

    // If the next value is another offset
    @else if index($offsets, $next) {
      #{$offset}: 0;
    }

    // If it is invalid
    @else {
      @warn "Invalid value `#{$next}` for offset `#{$offset}`.";
    }
  }
}
```

Then of course, there are still the 3 extra mixins `absolute`, `relative` and `fixed`. This doesn’t change at all from the previous version.

```scss
@mixin absolute($args: ()) {
  @include position(absolute, $args);
}

@mixin fixed($args: ()) {
  @include position(fixed, $args);
}

@mixin relative($args: ()) {
  @include position(relative, $args);
}
```

## Examples

```scss
.a {
  @include absolute();
}

.a {
  position: absolute;
}
```

```scss
.b {
  @include absolute(top);
}

.b {
  position: absolute;
  top: 0;
}
```

```scss
.c {
  @include absolute(top right);
}

.c {
  position: absolute;
  top: 0;
  right: 0;
}
```

```scss
.d {
  @include absolute(top right bottom);
}

.d {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
}
```

```scss
.e {
  @include absolute(top right bottom left);
}

.e {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
```

```scss
.f {
  @include absolute(top right 1em);
}

.f {
  position: absolute;
  top: 0;
  right: 1em;
}
```

```scss
.g {
  @include absolute(top 1em right);
}

.g {
  position: absolute;
  top: 1em;
  right: 0;
}
```

```scss
.h {
  @include absolute(top 1em right 100%);
}

.h {
  position: absolute;
  top: 1em;
  right: 100%;
}
```

```scss
.i {
  @include absolute(top right mistake);
}

.i {
  position: absolute;
  top: 0;
}
```

```scss
.j {
  @include absolute(top 1em right 1em bottom 1em left 1em);
}

.j {
  position: absolute;
  top: 1em;
  right: 1em;
  bottom: 1em;
  left: 1em;
}
```

## Final thoughts

So here we go with the new version people. It is slightly better than the old since you can now chain offsets to set them to `0`, and extra keywords like `auto`, `initial` and `inherit` are allowed, which wasn’t the case before.

I hope you like it. If you think of anything to improve it, be sure to share!

<p class="sassmeister" data-gist-id="f8ab9cc308b84e37b18d" data-height="480"><a href="https://www.sassmeister.com/gist/f8ab9cc308b84e37b18d">Play with this gist on SassMeister.</a></p>
