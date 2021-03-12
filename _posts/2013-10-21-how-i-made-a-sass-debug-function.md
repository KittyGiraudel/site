---
title: How I made a Sass debug function
keywords:
  - sass
  - debug
  - function
---

{% info %} The code explained in this article has been slightly revisited in [the pen](https://codepen.io/KittyGiraudel/pen/unyBH) afterwards. For the ultimate version of the code, check the pen. {% endinfo %}

You know how much I love playing with Sass lists. I think they are the most powerful and useful feature in Sass. It’s a shame there is so few functions to deal with them. This is why I made [SassyLists](https://github.com/at-import/SassyLists).

Most importantly, I always wanted a `console.log()` for Sass. You know, something to debug a variable, a list, a value, whatever… There is the `[@debug](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#_4)` function but somehow it didn’t completely satisfy me. Plus, there is no console on [CodePen](https://codepen.io) and since this is where I do most of my experiments I needed something else.

So I rolled up my sleeves, got my hands dirty and made my own Sass debug function. This is how it looks like:

<p data-height="320" data-theme-id="0" data-slug-hash="unyBH" data-user="KittyGiraudel" data-default-tab="result" class='codepen'>See the Pen <a href='https://codepen.io/KittyGiraudel/pen/unyBH'>Debug Sass lists</a> by Kitty Giraudel (<a href='https://codepen.io/KittyGiraudel'>@KittyGiraudel</a>) on <a href='https://codepen.io'>CodePen</a></p>

If you don’t want to read but simply want to dig into the code, check [this pen](https://codepen.io/KittyGiraudel/pen/unyBH).

## Stringify a list

Everything started when I realized a function to stringify a list. At first, my point was to turn a regular Sass list into a JSON-like string in order to be able to output it into a CSS pseudo-element.

It was pretty easy to do.

```scss
@function debug($list) {
  // We open the bracket
  $result: '[ ';

  // For each item in list
  @each $item in $list {
    // We test its length
    // If it’s more than one item long
    @if length($item) > 1 {
      // We deal with a nested list
      $result: $result + debug($item);
    }
    // Else we append the item to $result
    @else {
      $result: $result + $item;
    }

    // If we are not dealing with the last item of the list
    // We add a comma and a space
    @if index($list, $item) != length($list) {
      $result: $result + ', ';
    }
  }

  // We close the bracket
  // And return the string
  $result: $result + ' ]';
  @return quote($result);
}
```

This simple functions turns a Sass list into a readable string. It also deals with nested lists. Please have a look at the following example:

```scss
$list: a, b, c, d e f, g, h i, j;
body:before {
  content: debug($list);
  // [ a, b, c, [ d, e, f ], g, [ h, i ], j ]
}
```

Okay, this is pretty neat, right? However everytime I wanted to debug a list, I had to create a `body:before` rule, set the content property and all… I wanted something easier.

## Mixinify the function

Basically I wanted to go `@include debug($list)` and have everything displayed. Perfect usecase for a mixin, right?

```scss
@mixin debug($list) {
  body:before {
    content: debug($list) !important;

    display: block !important;
    margin: 1em !important;
    padding: 0.5em !important;

    background: #efefef !important;
    border: 1px solid #ddd !important;
    border-radius: 0.2em !important;

    color: #333 !important;
    font: 0.75em/1.5 'Courier New', monospace !important;
    text-shadow: 0 1px white !important;
    white-space: pre-wrap !important;
  }
}
```

In case you wonder, I bash `!important` in case `body:before` is already defined for something. Basically I force this pseudo-element to behave exactly how I want.

So. This mixin doesn’t do much more than styling the output of the `debug` function. So now instead of having to open the `body:before` rule, the content property and all, we just need to go `@include debug($list)`.

Pretty neat, but I wanted moar.

## Improving the function

I wanted two things: 1) explode the list into several lines to make it easier to read; 2) add the ability to display the type of each value in the list.

### Dealing with line breaks

You might have stumbled upon my article [Math sequences with Sass](/2013/10/14/math-sequences-with-sass/) in which I explain how I created famous math sequences in Sass and how I managed to display them with nothing more than CSS. Anyway, I kind of answer the question of linebreaks in CSS.

If you’ve ever read the [CSS specifications for the content property](https://www.w3.org/TR/CSS2/generate.html#content) (don’t worry, neither did I), you may know that there is a way to insert breaklines with `\A` (don’t forget the trailing white space). In the article, I used it as a `$glue` for the [`to-string()`](https://github.com/at-import/SassyLists/blob/master/stylesheets/functions/_to-string.scss) function from SassyLists.

This is pretty much what we will do here.

```scss
@function debug($list) {
  $line-break: '\A ';
  $result: '[ ' + $line-break;

  @each $item in $list {
    $result: $result + '  ';

    @if length($item) > 1 {
      $result: $result + debug($item);
    } @else {
      $result: $result + $item;
    }

    @if index($list, $item) != length($list) {
      $result: $result + ', ' + $line-break;
    }
  }

  $result: $result + $line-break + ']';
  @return quote($result);
}
```

All we did was adding a line-break after the bracket, after each value, then before the closing bracket. That looks great, but we need to handle the indentation now. This is where it gets a little tricky.

Actually the only way I could manage a perfect indentation is the same trick I used for the `to-string()` function: with an internal boolean to make a distinction between the root level (the one you called) and the inner levels (from nested lists). Problem with this boolean is it messes with the function signature but that’s the only way I found.

```scss
@function debug($list, $root: true) {
  $line-break: '\A ';
  $result: '[ ' + $line-break;
  $space: if($root, '', '  ');

  @each $item in $list {
    $result: $result + '  ';

    @if length($item) > 1 {
      $result: $result + debug($item, false);
    } @else {
      $result: $result + $space + $item;
    }

    @if index($list, $item) != length($list) {
      $result: $result + ', ' + $line-break;
    }
  }

  $result: $result + $line-break + $space + ']';
  @return quote($result);
}
```

The list should now be properly indented. So should be the nested lists. Okaaaay this is getting quite cool! We can now output a list in a clean `var_dump()` way.

### Displaying variable types

Now the icing on top of the cake would be displaying variable types, right? Thanks to the `type-of()` function and some tweaks to our `debug` function, it is actually quite simple to do. Far simpler than what we previously did with indents and line breaks.

```scss
@function debug($list, $type: false, $root: true) {
  $line-break: "\A ";
  $result: if($type,
	  "(list:#{length($list)})[ "+ $line-break,
	  "[ " + $line-break
  );
  $space: if($root,
	  "",
	  "  "
  );

  @each $item in $list {
	  $result: $result + "  ";

		@if length($item) > 1 {
			$result: $result + debug($item, $type, false);
		}

		@else {
			$result: if($type,
				$result + $space + "(" + type-of($item) + ") " + $item,
				$result + $space + $item
			);
		}

		@if index($list, $item) != length($list) {
			$result: $result + ", " + $line-break;
		}
	}

	$result: $result + $line-break + $space + "]");
	@return quote($result);
}
```

As you can see, it is pretty much the same. We only check for the `$type` boolean and add the value types accordingly wherever they belong. We’re almost there!

_Note: I’ve set the `$type` boolean to `false` as a default for the `debug` function but to `true` for the mixin._

### Making it work for single values

The only problem left is that if you debug a single value, it will wrap it into `(list:1) [ … ]`. While this is true, it doesn’t really help the user so we should get rid of this. Fairly easy! We just have to add a condition when entering the function.

```scss
@function debug($list, $type: false, $root: true) {
	@if length($list) == 1 {
    	@return if($type,
    		quote("(#{type-of($list)}) #{$list}"),
    		quote($list)
    	);
	}
	…
}
```

## Final words

That’s pretty much it people. I hope you like it. This has been added to [SassyLists](https://github.com/at-import/SassyLists), so if you think of something to improve it be sure to share!

Some of you might find this kind of overkill. Then you can try [this `@debug`-powered version](https://gist.github.com/piouPiouM/7030210) by [Mehdi Kabab](https://twitter.com/pioupioum) that does pretty much the same thing but in the Ruby console.
