---
layout: post
title: "Sass mixin for offsets"
---

> **Edit (2014/05/19):** I updated this mixin to improve it, please focus on the [new article](http://hugogiraudel.com/2014/05/19/new-offsets-sass-mixin/).

Over the last months, I have seen a ton of mixins to handle offsets when dealing with absolute / fixed / relative positioning. I also made a lot of them myself. And in the end, none of them really suited me. Either they were far too long or complicated, or the calling didn't feel right to me.

A couple of days ago I came with a fairly new solution (to me) and I must say I am pretty satisfied with it so far. I might stick with this mixin for the next projects. Thus, I wanted to share it with you guys.

But first, let's take a minute to think about what our mixin have to do:

* We shouldn't have to specify offsets we do not want to edit
* We shouldn't be forced to respect a given order (like top - right - bottom - left)
* It should handle errors and invalid inputs responsibly
* What about syntaxic sugar?

## Building the mixin

What I always wanted to be able to is something like this:

```scss
.element {
	absolute: left 1em top 1.5em
}
```

And this should output:

```scss
.element {
	position: absolute;
	left: 1em;
	top: 1.5em;
}
```

Unfortunately, we cannot do something like this in Sass and won't probably ever be able to do so since we have no way to define custom properties. So let's try to do something close.

### The skeleton

First, we will build the skeleton for our mixin. We seem to want to call our mixin with the keyword *absolute* so why not calling it `absolute`? And we pass it a list.

```scss
@mixin absolute($args) {
	/* Mixin stuff here */
}
```

### Assembling the gears

Now how does it work? Basically, you define the name of the offset you want to edit, and the next value is the value you want to assign to this offset. Then you repeat this for as many offsets as you want.

The first thing to do is to tell our mixin what are the keywords we want to check. Easiest thing to do so is to create a list inside our mixin:

```scss
@mixin absolute($args) {
	$offsets: top right bottom left;
	/* Order doesn't matter */
}
```

Now, we will loop through the offsets and make three verifications:

1. Check whether or not the offset is being listed in the `$args` list,
1. Make sure the index of an offset + 1 is lesser than or equal to the length of the list,
1. Make sure the value listed after an offset is a valid length/number.

```scss
@mixin absolute($args) {
	$offsets: top right bottom left;

	@each $o in $offsets {
		$i: index($args, $o);

		@if $i
		and $i + 1 <= length($args)
		and type-of( nth($args, $i + 1) ) == number {
			#{$o}: nth($args, $i + 1);
		}
	}
}
```

Okay, this might look quite complicated. Why don't we simply take it over with comments?

```scss
@mixin absolute($args) {
	/**
	 * List of offsets to check for in $args
 	 */
	$offsets: top right bottom left;

	/**
	 * We loop through $offsets to deal with them one by one
	 */
	@each $o in $offsets {

		/**
		 * If current offset found in $args
		 * assigns its index to $i
		 * Or `false` if not found
		 */
		$i: index($args, $o);

		/**
		 * Now we do the verifications
		 * 1. Is the offset listed in $args? (not false)
		 * 2. Is the offset value within the list range?
		 * 3. Is the offset value valid?
		 */
		@if $i                                      /* 1 */
		and $i + 1 <= length($args)                 /* 2 */
		and type-of( nth($args, $i + 1) ) == number /* 3 */ {

			/**
			 * If everything is okay
			 * We assign the according value to the current offset
			 */
			#{$o}: nth($args, $i + 1);
		}
	}
}
```

I guess this is pretty clear now. Not quite hard in the end, is it?

## Dealing with other position types

We now have to deal with `relative` and `fixed`. I guess we could duplicate the whole mixin 3 times and simple rename it but would it be the best solution? Definitely not.

Why don't we create a *private mixin* instead? Something that isn't meant to be called and only helps us for our internal stuff. To do so, I renamed the mixin `position()` and overloaded it with another argument: the position type.

*Note: you might want to rename it differently to avoid conflict with other mixins of your project. Indeed "position" is a quite common keyword.*

```scss
@mixin position($position, $args) {
	/* Stuff we saw before */
	position: $position;
}
```

And now, we create the 3 mixins we need: `absolute()`, `fixed()` and `relative()`.

```scss
@mixin absolute($args) {
	@include position(absolute, $args);
}

@mixin fixed($args) {
	@include position(fixed, $args);
}

@mixin relative($args) {
	@include position(relative, $args);
}
```

Almost done. To indicate `position()` is a private mixin, I wanted to prefix it with something. I first thought about `private-position()` but it didn't feel great. In the end I went with `_position()`. Since I use hyphens to separate words in CSS, the underscore was unused. No risk of conflicts with anything in a project!

*Note: remember hyphens and underscores are treated the same way in Sass. It means `-position()` will work as well. This is meant to be: "hyphens or underscores" is only a matter of presentational preference.*

## Usage

Using this mixin is pretty simple:

```scss
.element {
	@include absolute(top 1em right 10%);
}
```

Outputs:

```scss
.element {
	position: absolute;
	top: 1em;
	right: 10%;
}
```

Now, what if we try to do bad things like assigning no value to an offset, or an invalid value?

```scss
.element {
	@include absolute(top 1em left "HAHAHA!" right 10% bottom);
}
```

In this case:

* `top` will be defined to `1em`
* `left` won't be set since we gave it a string
* `right` will be defined to `10%`
* `bottom` won't be set since we didn't give it any value

```scss
.element {
	position: absolute;
	top: 1em;
	right: 10%;
}
```

Clean handling of errors and invalid inputs. Nice!

### Hoping for a better include in the future

The only thing that still bother me quite a bit with this is we still have to write `@include` to call a mixin. It might seems ridiculous (especially given the speed at which we're able to press keys) but having to type an extra 8 characters can be annoying.

Hopefully, some day we will see a shorter way to call mixins in Sass. Indeed, someone already [opened the issue](https://github.com/nex3/sass/issues/366) and the idea seems to have taken its way across minds including [Chris Eppstein's](https://github.com/nex3/sass/issues/366#issuecomment-7559687). The `+` operator has been proposed (as in the indented Sass syntax) but this could involve some issues when dealing with mixins with no-arguments + `@content` directive. Have a look at this:

```scss
abcd {
	+efgh {
		property: value;
	}
}
```

Is it supposed to mean *"assign `property: value` to a direct sibling `efgh` of `abcd`"* or *"call mixin `efgh` in `abcd`"*? Thus someone proposed `++` instead and it seems quite good so far. No idea when or if we will ever see this coming though. Let's hope.

## Final words

I'm aware some of you won't like this. Some will say it is overly complicated, some will say it is useless and some will say their mixin is better. In no way this is a better way than an other. It simply suits my tastes. I like the way it works, and I like the way I can use it.

Anyway, you can fork and play around [this pen](http://codepen.io/HugoGiraudel/pen/HDebE) if you feel so. And be sure to hit me if you ever need anything or want to propose something new. :)
