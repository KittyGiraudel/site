---
layout: post
title: "SassyMatrix: because one dimension wasn't enough"
tags:
  - sass
  - matrix
  - release
  - sassymatrix
---

> **Edit (2015/06/06)**: this is an experiment, please don't use this code in production.

Sass is much more than just a CSS preprocessor. You can do ton of things you're not supposed to do and won't ever do except in your crazy demos. This is what is amazing about Sass: it can be use for (pseudo-)programming as well!

A while back, I wanted to create a function to calculate the Levenshtein distance between two strings. The [Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance) is the number of manipulations you need to do to string A in order to have string B. If you want Wikipedia's definition, here it is:

> In information theory and computer science, the Levenshtein distance is a string metric for measuring the difference between two sequences. Informally, the Levenshtein distance between two words is the minimum number of single-character edits (insertion, deletion, substitution) required to change one word into the other.

If you wonder whether I succeeded or failed, I succeeded. You can play with [the code](http://sassmeister.com/gist/8334461) directly on SassMeister. So if you ever wanted to calculate the Levenshtein distance between two strings in Sass, now you can. Useless thus essential.

Now back to our main topic: I needed matrices. A matrix is basically a two-dimensional array (or list). For example this is a Sass matrix:

```scss
$matrix: (
  (0 1 2 3)
  (1 0 0 0)
  (2 0 0 0)
  (3 0 0 0)
)
```

Well this was pretty easy. Now what if we want to dynamically create a matrix? Update values? Retreive values? And more stuff? This is getting harder. So I created a couple of functions to ease the pain. 

## Creating a matrix 

JavaScript allows you to instanciate a new array of `n` cells. This makes creating empty matrices quite easy, you only need a single for-loop like this:

```javascript
var matrix = new Array(9);
for (var i = 0; i < matrix.length; i++) {
  matrix[i] = new Array(9);
}
```

This would be enough to create an empty matrix of 9x9 with all cells filled with `undefined`. In Sass, you cannot create a new list of `n` cell. If you do `$list: (9)`, you are basically assigning the number `9` to the `$list` variable which is not what you want.

Thus I found out it's much easier to simply instanciate a new list with dummy values to be updated later than creating a matrix with definitive value right away. Let's do that shall we?

```scss
@function matrix($x, $y: $x) {
  $matrix: ();
  @for $i from 1 through $x {
    $tmp: ();
    @for $j from 1 through $y {
      $tmp: append($tmp, 0); // 0 is the filler value
    }
    $matrix: append($matrix, $tmp);
  }
  @return $matrix;
}
```

See how we make the `$y` parameter optional by defaulting it to `$x`? It makes instanciating squared matrices easier: `matrix(5)`. Little things matter. ;)

## Updating a matrix 

Being able to instanciate an empty matrix is cool but being able to fill it with real values is even better! What if we had a `set-entry` function setting given value at given position on given matrix?

```scss
@function set-entry($matrix, $coords, $value) {
  $x: nth($coords, 1);
  $y: nth($coords, 2);
  $matrix: set-nth(set-nth(nth($matrix, $x), $y, $value), $x, $matrix);
  @return $matrix;
}
```

We could have requested two distinct parameters for `$x` and `$y` but I feel like it's better asking for a 2-items long list `($x $y)`. It keeps the signature cleaner and makes more sense to me. However we need to make sure `$coords` is actually a 2-items long list of coordinates, so why don't we make a little helper for this?

```scss
@function _valid-coords($coords) {
  @if length($coords) != 2 or type-of(nth($coords, 1)) != number or type-of(nth($coords, 2)) != number {
    @return false;
  }
  @return true;
}
```

*Note: I like to prefix private functions with an underscore. By "private" I mean functions that are not supposed to be called from the outside. Unfortunately Sass doesn't provide any way to privatize stuff.*

All we did was checking for the length and the type. This doesn't deal with out of bounds coordinates but that's more than enough for now. Anyway, to set a value in the grid it is nothing easier than:

```scss
$matrix: set-entry($matrix, (1 1), 42);
```

What is also pretty cool is you can use negative indexes to start from the end of columns/rows. So to fill the last entry from the last row of the grid, you'd do something like `set-entry($matrix, (-1 -1), 42)`.

## Reading a matrix 

Now that we are able to easily set values in the grid, we need a way to retrieve those values! Let's build a `get-entry` function working exactly like the one we just did.

```scss
@function get-entry($matrix, $coords) {
  @if not _valid-coords($coords) {
    @warn "Invalid coords `#{$coords}` for `get-entry`.";
    @return false;
  }

  @return nth(nth($matrix, nth($coords, 1)), nth($coords, 2));
}
```

See how we check for coordinates validity with our brand new helper? I don't know for you, but I think it looks pretty neat! Anyway, to retrieve a value at position (x y), all we have to do is:

```scss
$value: get-entry($matrix, (1 1)); // 42
```

## Displaying a matrix 

What I always found difficult when working with matrices (no matter the language) is actually seeing what's going on. I need a visual representation of the grid to understand what I am doing and whether I'm doing it properly. Unfortunately [my debug function from SassyLists](https://github.com/Team-Sass/SassyLists/blob/master/stylesheets/SassyLists/_debug.scss) isn't quite suited for such a case but the main idea is the same. I just had to revamp it a little bit.

```scss
@function display($matrix) {
  $str: "";
  @each $line in $matrix {
    $tmp: "";
    @each $item in $line {
      $tmp: $tmp + " " + $item;
    }
    $str: $str + $tmp + "\A ";
  }
  @return $str;
}
```

This function returns a string like this: `" 0 0 0\A  0 0 0\A  0 0 0\A "`. As is, it is not very useful but when you couple it with generated content and white-space wrapping, you got something like this:

```
0 0 0
0 0 0
0 0 0
```

... which is pretty nice. Basically I used the mixin from SassyLists which takes a string and displays it in the body pseudo-element with `white-space: pre-wrap`, allowing for line breaks.

```scss
@mixin display($matrix, $pseudo: before) {
  body:#{$pseudo} {
    content: display($matrix)                 !important;

    display: block                            !important;
    margin: 1em                               !important;
    padding: .5em                             !important;

    background: #EFEFEF                       !important;
    border: 1px solid #DDD                    !important;
    border-radius: .2em                       !important;

    color: #333                               !important;
    font: 1.5em/1.5 "Courier New", monospace  !important;
    text-shadow: 0 1px white                  !important;
    white-space: pre-wrap                     !important;
  }
}
```

Since there are two pseudo-elements (`::after` and `::before`), you can watch for 2 matrices at the same time. Pretty convenient when working on complicated stuff or debugging a matrix.

## What's next? 

So far we managed to initialize a matrix, set values in it, retreive those values and display the whole thing as a two dimensional grid directly from CSS. This is quite a lot for a first roll with matrices don't you think?

But what if we want to push things further? While I am not ace with matrices (I never really did extremely well in math), I know someone who is: [Ana Tudor](https://twitter.com/thebabydino). You may be familiar with some of her crazy experiments from CodePen. Anyway, Ana is most certainly a brainiac so she gave me plenty of ideas of functions to ease the pain of having to deal with matrices!

Among other things, there are a couple of functions to swap values and collection of values of position:

* `swap-entries($matrix, $e1, $e2)`: swaps values `$e1` and `$e2` from `$matrix`
* `swap-rows($matrix, $r1, $r2)`: swaps rows `$r1` and `$r2` from `$matrix`
* `swap-columns($matrix, $c1, $c2)`: swaps columns `$c1` and `$c2` from `$matrix`

Some functions to know additional informations on the current matrix:

* `columns($matrix)`: return number of columns in `$matrix`
* `rows($matrix)`: return number of rows in `$matrix`
* `is-square($matrix)`: check wether `$matrix` has as many rows as columns
* `is-diagonal($matrix)`: check wether all values from the main diagonal of `$matrix` are set while all other values are equal to 0
* `is-upper-triangular($matrix, $flag: null)`: check wether all value below `$matrix` diagonal are equal to 0
* `is-lower-triangular($matrix, $flag: null)`: check wether all value above `$matrix` diagonal are equal to 0

... and much more. And because I needed a place to store all those functions I made a [GitHub repository](https://github.com/HugoGiraudel/SassyMatrix) so if you feel like contributing, be sure to have a glance!

Also, there is a Compass extension for SassyMatrix now:

1. `gem install SassyMatrix`
2. Add `require 'SassyMatrix'` in `config.rb`
3. `@import "SassyMatrix"` in your stylesheet

Also, you can play with SassyMatrix directly at [SassMeister](http://sassmeister.com), so be sure to give it a try. Plus, I'd love to have some feedbacks!
