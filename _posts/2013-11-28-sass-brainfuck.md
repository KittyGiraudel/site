---
title: Sass brainfuck
keywords:
  - sass
  - brainfuck
---

After months of experimenting with Sass, making crazy and useless things, hacking aroung the syntax and trying to do things not meant to be done, I have come up with a list of things that still kind of boggle my mind when it comes to Sass. Some of them are rather normal and some are just… plain weird. Please, follow my lead.

## Lengths are numbers

Like… for real. There is no distinction in Sass between what you’d call a number (e.g. `42`) and what you’d call a length (e.g. `1337px`). In a sense, that makes sense (see what I did there?). You want to be able to do something like this:

```scss
$value: 42px;
@if $value > 10 {
  // do something
}
```

You can do this just because lengths are treated as numbers. Else, you would have an error like _"42px is not a number for 42px gt 10"_.

That being said…

```scss
42px == 42; // true
```

I can’t help but to grind my teeth when I see that the previous assertion returns `true`. Yes, both are some kind of a number, but still… One has a unit and one does not. I don’t think the strict equality operator should return true for such a case.

## Strict equality operator

Sometimes I wish Sass would make a distinction between `==` and `===`. As a reminder, the first one checks whether values are equal while the latter makes sure both are of the same type. This is to prevent something like `5 == '5'` from returning `true`. When checking with `===`, it should return `false`.

Anyway, every time you use `==` in Sass, it actually means `===`. So basically there is no way to check whether two values are equal without checking their type as well.

In most cases, this is really not an issue but I came up with a case where I didn’t want to check the type. Please have a look at the following example:

```scss
// Initializing an empty list
$list: ();

// Checking whether the list is true
$check: $list == true; // false, as expected

// Checking whether the list is false
$check: $list == false; // false
```

While we would expect an empty list to be `false`, it turns out it is not. If it’s not false, then it’s true! Right? Seems not. An empty list is neither true nor false because `==` also checks for types. So the previous statement would look like something like this: `[list] === [bool]` which is obviously false, no matter what the boolean is.

Okay so it makes sense that the previous example returns `false` in both cases! Nevertheless, `()` being evaluated to `false` would be quite cool when checking for a valid value to append to a list. Please consider the following code:

```scss
$list: (a, b, c);
$value: ();

@if $value {
  // Short for `$value == true` which is the same as `$value != false`
  $list: append($list, $value);
}
```

If `()` was treated as a falsy value, the condition wouldn’t match and the 4th element of `$list` wouldn’t be an empty list. This is how it works in JavaScript:

```javascript
var array = ['a', 'b', 'c']
var value = []

if (value != false) {
  array.push(value)
}
```

This works because JavaScript makes a difference between `!=` and `!==` while Sass uses the latter no matter what.

We talked about the empty-list case in this section but there is the exact same problem with an empty string `""` or even the `null` value. Anyway, as I said it’s barely an issue, but it has bugged me more than once.

## List append

Even after [many](/2013/07/15/understanding-sass-lists/) [articles](/2013/08/08/advanced-sass-list-functions/) [about](/2013/10/09/advanced-sass-list-functions-again/) [Sass](/2013/10/14/math-sequences-with-sass) lists, they keep surprising me with how messed up they are.

As you may know, most single-values in Sass are considered as one item-long lists. This is to allow the use of `length()`, `nth()`, `index()` and more. Meanwhile, if you test the type of a single-value list, it won’t return `list` but whatever the type is (could it be `bool`, `number` or `string`). Quick example:

```scss
$value: (1337);
$type: type-of($value); // number
```

Indeed &mdash;as explained in [this comment from Chris Eppstein](https://github.com/nex3/sass/issues/837#issuecomment-20429965) &mdash; parens are not what define lists; it’s the delimiter (commas/spaces).

Now what if we append this value to an empty list? Let’s see.

```scss
$value: (1337);
$value: append((), $value);
$type: type-of($value); // list
```

Bazinga! Now that you appended the value to an empty list, the type is a list. To be totally honest with you, I am not entirely sure why this happens. I believe the `append()` function returns a list no matter what, so if you append a single value to a list, it returns a list with a single item. That’s actually the only way I know to cast a single value into a string in Sass. Not that you’re going to need it, but that’s actually good to know!

## Variable scope

Okay let’s put this straight: variable scope has always been my pet hate. I don’t know why, I always got it wrong. I believe variable scope in Sass is good, but for some reason it doesn’t always work the way I’d want it to work. I recall trying to help someone who wanted to do something like this:

```scss
// Initialize a variable
$color: tomato;

// Override it in an impossible @media directive
@media (min-width: 10000em), (-webkit-min-device-pixel-ratio: 42) {
  $color: lightgreen;
}

// Use it
body {
  background: $color; // lightgreen;
}
```

When I read it now, it seems obvious to me that the assignment in the `@media` directive will override the first one. Indeed Sass is compiled to serve CSS, not evaluated on the fly. This means Sass has no idea whether the `@media` will ever match and it doesn’t care. It simpy overrides the variable; there is no scoping involved here. But that would be cool, right?

Okay, let’s take another example with Sass scope in mixin directives shall we?

```scss
// Define a `$size` variable
$size: 1em;

// Define a mixin with an argument named `$size`
@mixin whatever($size: 0.5em) {
  // Include the `@content` directive in the mixin core
  @content;
  margin-bottom: $size * 1.2;
}

// Use the mixin
el {
  @include whatever {
    font-size: $size;
  }
}
```

I want to play a game. In your opinion, what is the CSS rendered by this code (shamelessly stolen from [Mehdi Kabab](https://twitter.com/pioupioum)'s new book - “Advanced Sass and Compass”)?

The correct answer is:

```scss
el {
  font-size: 1em;
  margin-bottom: 0.6em;
}
```

This is actually not fucked up at all: it’s the expected behaviour from correct variable scoping. While it might look silly for an advanced Sass user, I bet it’s not that obvious to the beginner. The declared `$size` variable is used for the font-size while the default value for the `$size` argument is used for the bottom margin since it is inside the mixin, where the variable is scoped.

## If ternary then… Sass error

Since Sass 3.3, this is no longer a bug. It has been [fixed](https://sass-lang.com/documentation/file.SASS_CHANGELOG.html#smaller_improvements).

You all know what a ternary is, right? Kind of a one-line `if`/`else` statement. It’s pretty cool when you need to assign a variable differently depending on a condition. In JavaScript, you’d write something like this:

```javascript
var whatever = condition ? true : false
```

Where the first part would be an expression evaluating to a truthy or falsy value, and the other two parts can be whatever you want, not necessarily booleans. Okay, so technically there is no ternary operator in Sass (even if there is one in Ruby very similar to the one we just used). However there is a function called `if()` which works the same way:

```scss
$whatever: if(condition, true, false);
```

First argument is the condition, second one is the value to return in case the condition is evaluated to `true` and as you may guess the third one is returned when the condition is false. 'til then, no surprise.

Let’s have a try, shall we? Consider a function accepting a list as its only argument. It checks for its length and returns either the 2nd item if it has multiple items, or the only item if it has only one.

```scss
@function f($a) {
  @return if(length($a) > 1, nth($a, 2), $a);
}
```

And this is how to use it:

```scss
$c: f(bazinga gloubiboulga);
// returns `gloubiboulga`
```

And now with a one-item long list:

```scss
$c: f(bazinga);
// List index is 2 but list is only 1 item long for `nth'
```

BAZINGA! The `if()` function returns an error. It looks like it’s trying to access the second item in the list, even if the list is only one item long. _Why_ you ask? Because the ternary function from Sass parses both 2nd and 3rd arguments no matter what.

Hopefully this issue is supposed to be solved in the incoming Sass 3.3 according to [this GitHub issue](https://github.com/nex3/sass/issues/470). Meanwhile, a workaround would be to use a real `@if/@else` statement to bypass the issue. Not ideal but still better than nothing.

## Final words

I love how powerful Sass has become but there are things that keep boggling my mind. [Mehdi Kabab](https://twitter.com/pioupioum), a fellow French developer (and author of a fresh new book called Advanced Sass and Compass) told me it was because I wasn’t using Sass as a preprocessor.

> @KittyGiraudel the main problem is you want use Sass like PHP or Ruby, and not like a CSS preprocessor ;) /cc @kaelig  
> — [Medhi Kabab, Twitter](https://twitter.com/piouPiouM/statuses/401427568592957441)

That’s actually true! I’ve done many things with Sass that are really beycond the scope of CSS. But that’s where I think the fun is: thinking out of box, and hacking around the syntax. That’s how I learnt to use Sass, and that’s how I’ll keep going on. ;)
