---
title: "Advanced Sass list functions, again"
tags:
  - sass
  - function
  - SassyLists
---

> In case you have missed my first article about this Advanced Sass List Functions library, I recommand you to read [it](https://hugogiraudel.com/2013/08/08/advanced-sass-list-functions/).

Heys people, it's been a while I haven't posted anything! I have been pretty busy lately but I really miss writing so here it is: a short article about what's new on my Sass list functions library.

Well first of all, it has been added as a [Team-Sass](https://github.com/Team-Sass) repository on GitHub (the [pen](https://codepen.io/HugoGiraudel/pen/loAgq is still updated). You probably know the Team-Sass collective. They have done ton of awesome things like [Breakpoint](https://github.com/Team-Sass/breakpoint), [Sassy Math](https://github.com/Team-Sass/Sassy-math) and [UIKit](https://github.com/Team-Sass/uikit).

I am very glad to see my repo in there, so big thanks to them. :)

Even bigger news! It is now a Compass extension so you don't have to copy/paste functions into your projects anymore. All you have to do is:

1. Install the gem through your terminal: `gem install SassyLists`
1. Require it in your `config.rb` file: `require 'SassyLists'`
1. Import it in your stylesheet: `@import 'SassyLists';`

Done. From there you can use all the functions you want. Isn't it awesome? Plus all you have to do to update the library is reinstalling the gem with the same command as step 1. No more checking your functions are up to date and copy pasting all over again.

All of this thanks to [Vinay Raghu](https://www.vinayraghu.com/) who made the Compass extension out of my original work. A million thanks to him!

## New functions

I have added a couple of functions to make the library even more awesome like `purge()`, `is-symmetrical()`, `sum()`, `chunk()`, `count-values()` and `remove-duplicates()`.

### Purge

I can't believe I didn't make the `purge()` function a while ago. Basically, it removes all non-true value of a list. Compass includes the `compact()` function which does pretty much the same thing.

```scss
@function purge($list) {
  $result: ();

  @each $item in $list {
    @if $item != null and $item != false and $item != '' {
      $result: append($result, $item);
    }
  }

  @return $result;
}

$list: a, b, null, c, false, '', d;
$purge: purge($list);
// -> a, b, c, d
```

I think the code is self-explanatory. We loop through all items of the list: if it's not false, we append it then we return the new list. Easy peasy! It would be even easier if Sass had a boolean converter operator (`!!`). Then we could do something like this `@if !!$item { $result: append($result, $item); }`. Unfortunately, we can't.

### Is symmetrical

I don't think this function has any major usecase, but you know, just in case I added it. It checks whether your list is symmetrical. It's based on my `reverse()` function.

```scss
@function is-symmetrical($list) {
  @return reverse($list) == reverse(reverse($list));
}
```

Why don't we compare the initial list with the reversed one? Because reversing a list modify its inner structure, resulting in a false assertion. This makes sure both list are properly compared.

### Sum

Same here, I don't think it has much point but I wanted to add it anyway. It takes all unitless number from the list and add them. The second parameter is a boolean enabling / disabling the removing of units. Basically, you can parseInt the value to get only the number.

```scss
@function sum($list, $force: false) {
  $result: 0;

  @each $item in $list {
    @if type-of($item) == number {
      @if $force and unit($item) {
        $item: $item / ($item * 0 + 1);
      }
      @if unitless($item) {
        $result: $result + $item;
      }
    }
  }

  @return $result;
}

$list: 1 2 3 4px;
$sum: sum($list); // -> 6
$sum: sum($list, true); // -> 10
```

### Chunk

The `chunk()` function is based on the equivalent PHP function `array_chunk()`. From the [PHP.net manual](https://php.net/manual/en/function.array-chunk.php):

> Chunks an `$array` into `$size` large chunks. The last chunk may contain less than `$size` elements.

```scss
@function chunk($list, $size) {
  $result: ();
  $n: ceil(length($list) / $size);
  $temp-index: 0;

  @for $i from 1 through $n {
    $temp-list: ();

    @for $j from 1 + $temp-index through $size + $temp-index {
      @if $j <= length($list) {
        $temp-list: append($temp-list, nth($list, $j));
      }
    }

    $result: append($result, $temp-list);
    $temp-index: $temp-index + $size;
  }

  @return $result;
}

$list: a, b, c, d, e, f, g;
$chunk: chunk($list, 3);
// -> ( (a, b, c), (d, e, f), g)
```

We could probably make the code slightly lighter but I didn't want to dig too deep into this. I'll eventually clean this up later. Meanwhile, it works great. If you find a usecase, hit me up!

### Count values

Same as above, the `count-values()` function is inspired by `array_count_values()` that counts each value of the given array.

> Returns an array using the values of `$array` as keys and their frequency in `$array` as values.

```scss
@function count-values($list) {
  $keys: ();
  $counts: ();

  @each $item in $list {
    $index: index($keys, $item);

    @if not $index {
      $keys: append($keys, $item);
      $counts: append($counts, 1);
    } @else {
      $count: nth($counts, $index) + 1;
      $counts: replace-nth($counts, $index, $count);
    }
  }

  @return zip($keys, $counts);
}
```

It's based on the built-in `zip()` function that merges several lists into a multi-dimensional list by preserving indexes.

```scss
$list: a, b, c, a, d, b, a, e;
$count-values: count-values($list);
// -> a 3, b 2, c 1, d 1, e 1
```

### Remove duplicates

There are times when you want to remove values that are present multiple times in a list. You had to do it by hand. Not anymore, I got your back.

```scss
@function remove-duplicates($list, $recursive: false) {
  $result: ();

  @each $item in $list {
    @if not index($result, $item) {
      @if length($item) > 1 and $recursive {
        $result: append($result, remove-duplicates($item, $recursive));
      } @else {
        $result: append($result, $item);
      }
    }
  }

  @return $result;
}

$list: a, b, a, c, b, a, d, e;
$remove-duplicates: remove-duplicates($list);
// -> a, b, c, d, e
```

You can even do it recursively if you feel so, by enabling recursivity with `true` as a 2nd argument. Nice, isn't it?

### Debug

Last but not least, I added a `debug()` function to help you people debugging your lists. Basically all it does is displaying the content of your list like a `console.log()` in JavaScript.

```scss
@function debug($list) {
  $result: #{'[ '};

  @each $item in $list {
    @if length($item) > 1 {
      $result: $result#{debug($item)};
    } @else {
      $result: $result#{$item};
    }
    @if index($list, $item) != length($list) {
      $result: $result#{', '};
    }
  }

  $result: $result#{' ]'};

  @return $result;
}

$list: (a b (c d (e f ( (g h (i j k)) l m))));
$debug: debug($list);
// -> [ a, b, [ c, d, [ e, f, [ [ g, h, [ i, j, k] ], l, m ] ] ] ]
```

## Improvements

Not only I try to add new functions but I also do my best to make all functions as fast as they can be and the library as simple to understand as it can be so you can dig into it to change / learn stuff.

For example, you know we have [two remove functions](https://hugogiraudel.com/2013/08/08/advanced-sass-list-functions/#removing): `remove()` and `remove-nth()`. I have simplified those two greatly:

```scss
@function remove($list, $value, $recursive: false) {
  @return replace($list, $value, '', $recursive);
}

@function remove-nth($list, $index) {
  @return replace-nth($list, $index, '');
}
```

Crazy simple, right? How come I haven't done this earlier? Well let's be honest, it has been a pain in the ass to come to this actually. I have faced an annoying issue: replacing by an empty string didn't remove the element from the list, it simply made it disappear. The difference is that the length of the list remained unchanged and this is a big deal.

This is why I had to create the `purge()` function. Both `replace()` and `replace-nth()` functions return a purged list, which means the empty strings get actually deleted from the list.

I have also used quite a couple of ternary operators along the way to make code lighter.

## What now?

Quite a few things! I still have to clean some functions because they are kind of messy at the time. I could still add new functions if you think of something.

I am unable to wait for Sass 3.3, it is going to be awesome. First, the `if()` will be completely reworked to have a built-in parser so it stop bugging around.

But there will also be new string manipulation functions (`str-length()`, `str-slice()`…) and the `call()` function which will allow me to make a lot of new functions like [`every()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).

Oh, and of course Sass 3.3 will bring map support which will be a whole another story, with a ton of new functions to make. Anyway it is going to be amazing, really!
