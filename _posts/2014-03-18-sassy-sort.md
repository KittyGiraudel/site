---
title: "SassySort: sorting algorithms in Sass"
tags:
  - sass
  - sort
  - release
---

> **Edit (2015/06/06)**: this is an experiment, please don't use this code in production.

The idea of building a sorting function in pure Sass isn't new. I think everything started months ago when a fellow folk on Twitter asked how I would build a Sass function to sort a list of numeric values in order to create a modular scale. It was actually quite easy to do even if it could probably be optimized.

Although at this point, sorting numbers was not enough to me. I wanted to sort more. I wanted to sort everything! Thankfully, Sass 3.3 was providing me exactly what I needed: string manipulation functions. So I started hacking around to make a sorting function. It took me two days but eventually I did it.

That could have been the end of that if Sam Richards (a.k.a [Snugug](https://twitter.com/snugug)) had not put his Quick Sort implementation on my way. God, it was both fast and beautiful but… it was for numeric values only. Challenge accepted!

It didn't take me long to update his function in order to sort anything, very quickly (actually as quickly as Ruby can get, which means, not much…). And I really enjoyed working on this, so I started implementing other famous algorithms in Sass, resulting in [SassySort](https://github.com/HugoGiraudel/SassySort).

_Note: I recently wrote [an article](http://thesassway.com/advanced/implementing-bubble-sort-with-sass) about how to implement the Bubble Sort algorithm in Sass for The Sass Way. If you haven't read it, you should! At least for the beautiful header image!_

## How to use

SassySort is now a Compass Extension, which means you can easily include it in any of your project.

1. Run `gem install SassySort` in your terminal
2. Add `require 'SassySort'` to your `config.rb`
3. Add `@import 'SassySort'` to your stylesheet

If you simply want to add a file to your project, you can get the [dist file](https://github.com/HugoGiraudel/SassySort/blob/master/dist/_SassySort.scss) from the repository, copy and paste its content to your project and voila.

Then you've access to a neat little API:

```scss
$list: oranges pears apples strawberries bananas;
$sort: sort($list);
// => apples bananas oranges pears strawberries
```

That's pretty much the end of it.

_Note: also, [I've asked SassMeister to include it](https://github.com/jedfoster/SassMeister/issues/64#issuecomment-35530071), so you might be able to use it directly into [SassMeister](https://sassmeister.com/) in the not-so-far future._

## Picking the algorithm

Looking back at my code, I think it's pretty cool how I handled the whole thing.There are a couple of algorithms available but I wanted to keep the function name simple: `sort()` and not `bubble-sort()` or `insertion-sort()`. So you can pass the algorithm name as argument.

```scss
$sort: sort($list, $algorithm: 'bubble');
```

This will use the Bubble Sort implementation, because of the way the `sort()` function works:

```scss
@function sort($list, $order: $default-order, $algorithm: 'quick') {
  @return call('#{$algorithm}-sort', $list, $order);
}
```

> Quicksort is… quicker.

As you can see, the `sort()` function does no more than defering the return to a sub-function named after the algorithm you ask for (e.g.`%algorithm%-sort`). The default algorithm is `quick`, as specified in the function signature but you can use `bubble`, `insertion`, `shell`, `comb` and `selection` as well. However `quick` is simply… quicker.

## Dealing with weird characters

Depending on what you aim at doing with this sorting function, you might or might not encounter some issues if you are trying to sort words with unexpected characters. This is because Sass doesn't have access to some universal sorting order or something; I had to hard-code the order to follow somewhere.

And this somewhere is in the `$default-order` variable:

```scss
$default-order: '!' '#' '$' '%' '&' "'" '(' ')' '*' '+' ',' '-' '.' '/' '[' '\\'
  ']' '^' '_' '{' '|' '}' '~' '0' '1' '2' '3' '4' '5' '6' '7' '8' '9' 'a' 'b'
  'c' 'd' 'e' 'f' 'g' 'h' 'i' 'j' 'k' 'l' 'm' 'n' 'o' 'p' 'q' 'r' 's' 't' 'u'
  'v' 'w' 'x' 'y' 'z' !default;
```

As you can see, it only deals with a restricted amount of characters. Mostly special characters, numbers and letters. You might notice there are no uppercase letters. I decided I wouldn't deal with case when sorting. It simply added to much complexity to sorting functions.

Anyway, if you need to add extra characters, you can override this list or make your own variable and pass it to the sort function as the `$order` (2nd) argument.

```scss
$custom-order: ;
$sort: sort($list, $order: $custom-order);
```

Note that if an unrecognized character is found, it is skipped.

## Final thoughts

That's pretty much it folks. If you really want to dig in the code of the algorithms, be sure to have a look at the [repository](https://github.com/HugoGiraudel/SassySort) however it was mostly JavaScript to Sass code conversion, so there is no magic behind it.

If you feel like implementing other sorting algorithms, be sure to have a shot and open an issue / pull-request.
