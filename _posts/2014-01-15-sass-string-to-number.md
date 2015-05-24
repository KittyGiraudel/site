---
layout: post
title: "Casting a string to a number in Sass"
---

Hey guys! I am currently working on a JSON parser in Sass (yes, you read right) thus I faced an issue I thought unsolvable until now: casting a string into a number in Sass. Needless to say I found a solution! Even better, I found a solution to convert a string into a valid CSS length you can use as a CSS value, in calculations and stuff.

I have to say I am pretty proud with what I have come up with. Not only does it work, but it is also very simple and from what I can tell quite efficient. This may be a bit slower for very large numbers but even there I'm not sure we can feel the difference in compilation time. It also lacks of support for very scientific notation like `e` but that's no big deal for now.

## Building the function

As I said, the function is actually simple. It relies on parsing the string character after character in order to map them to actual numbers. Then once you have numbers &mdash; well &mdash; you can do pretty much any thing. Let's start with the skeleton, shall we?

```scss
@function number($string) {
  // Matrices
  $strings: '0' '1' '2' '3' '4' '5' '6' '7' '8' '9';
  $numbers:  0   1   2   3   4   5   6   7   8   9;

  // Result
  $result: 0;

  // Looping through all characters
  @for $i from 1 through str-length($string) {
    // Do magic
  }

  @return $result;
}
```

I think you can see where this is going. Now let's have a look at what happens inside the loop:

```scss
@for $i from 1 through str-length($string) {
  $character: str-slice($string, $i, $i);
  $index: index($strings, $character);

  @if not $index {
    @warn "Unknown character `#{$character}`.";
    @return false;
  }

  $number: nth($numbers, $index);
  $result: $result * 10 + $number;
}
```

And this is enough to cast any positive integer from a string. But wait! What about negative integers? Plus I told you `number`, not `integer`. Let's continue the journey!

## Dealing with negative numbers

Dealing with negative numbers is very easy: if we spot a dash (`-`) as a first character, then it's a negative number. Thus, all we have to do is to multiply `$result` by `-1` (as soon as `$result` isn't `0`).

```scss
@function number($string) {
// ...
$result: 0;
$minus: false;

@for $i from 1 through str-length($string) {
  // ...
  @if $character == '-' {
    $minus: true;
  }

  @else {
    // ...
    $result: $result * 10 + $number;
  }

  @return if($minus, $result * -1, $result);
}
```

As I said, it is pretty straight forward.


## Dealing with decimal dot

Making sure we can convert floats and doubles took me a couple of minutes. I couldn't find a way to deal with numbers once the decimal dot has been found. I always ended up with a completely wrong result until I find a tricky way.

```scss
@function number($string) {
  // ...
  $result: 0;
  $divider: 0;

  @for $i from 1 through str-length($string) {
    // ...
    @if $character == '-' {
      // ...
    }

    @else if $character == '.' {
      $divider: 1;
    }

    @else {
      // ...

      // Decimal dot hasn't been found yet
      @if $divider == 0 {
        $result: $result * 10;
      }

      // Decimal dot has been found
      @else {
        // Move the decimal dot to the left
        $divider: $divider * 10;
        $number: $number / $divider;
      }

      $result: $result + $number;
    }
  }

  @return if($minus, $result * -1, $result);
}
```

Since it can be a little tricky to understand, let's try with a quick example. Here is what happen when we try to cast "13.37" to a number:

1. We set `$divider` and `$result` variables to `0`
2. `"1"` gets found
    1. `$divider` is `0` so `$result` gets multiplied by `10` (still `0`)
    2. `1` gets added to `$result` (now `1`)
3. `"3"` gets found
    1. `$divider` is `0` so `$result` gets multiplied by `10` (now `10`)
    2. `3` gets added to `$result` (now `13`)
4. `"."` gets found
    1. `$divider` is now set to `1`
5. `"3"` gets found
    1. `$divider` is greater than `0` so it gets multiplied by `10` (now `10`)
    2. `3` gets divided by `$divider` (now `0.3`)
    3. `0.3` gets added to `$result` (now `13.3`)
6. `"7"` gets found
    1. `$divider` is greater than `0` so it gets multiplied by `10` (now `100`)
    2. `7` gets divided by `$divider` (now `0.07`)
    3. `0.07` gets added to `$result` (now `13.37`)


## Dealing with CSS lengths

All we have left is the ability to retrieve the correct unit from the string and returning the length. At first I thought it would be hard to do, but it turned out to be very easy. I moved this to a second function to keep things clean but you could probably merge both functions.

First we need to get the unit as a string. It's basically the string starting from the first not-numeric character. In `"42px"`, it would be `"px"`. We only need to slightly tweak our function to get this.

```scss
@function number($string) {
  // ...
  @for $i from 1 through str-length($string) {
    // ...
    @if $char == '-' {
      // ...
    }
    @else if $char == '.' {
      // ...
    }
    @else {
      @if not $index {
        $result: if($minus, $result * -1, $result);
        @return _length($result, str-slice($string, $i));
      }
      // ...
    }
  }
  // ...
}
```

If we come to find a character that is neither `-`, nor `.` nor a number, it means we are moving onto the unit. Then we can return the result of the `_length` function.

```scss
@function _length($number, $unit) {
  $strings: 'px' 'cm' 'mm' '%' 'ch' 'pica' 'in' 'em' 'rem' 'pt' 'pc' 'ex' 'vw' 'vh' 'vmin' 'vmax';
  $units:   1px  1cm  1mm  1%  1ch  1pica  1in  1em  1rem  1pt  1pc  1ex  1vw  1vh  1vmin  1vmax;
  $index: index($strings, $unit);

  @if not $index {
    @warn "Unknown unit `#{$unit}`.";
    @return false;
  }

  @return $number * nth($units, $index);
}
```

The idea is the same as for the `number` function. We retrieve the string in the `$strings` list in order to map it to an actual CSS length from the `$units` list, then we return the product of `$number` and the length. If the unit doesn't exist, we simply return false.

## Examples

If you want to play with the code or the function, you can check it on [SassMeister](http://sassmeister.com/gist/9647408). In any case, here are a couple of examples of our awesome little function:

```scss
sass {
  cast: number("-15");    // -15
  cast: number("-1");     // -1
  cast: number("-.5");    // -.5
  cast: number("-0");     // 0
  cast: number("0");      // 0
  case: number(".10");    // 0.1
  cast: number("1");      // 1
  cast: number("1.5");    // 1.5
  cast: number("10.");    // 10
  cast: number("12.380"); // 12.38
  cast: number("42");     // 42
  cast: number("1337");   // 1337

  cast: number("-10px");  // -10px
  cast: number("20em");   // 20em
  cast: number("30ch");   // 30ch

  cast: number("1fail");  // Error
  cast: number("string"); // Error
}
```

## Final words

So guys, what do you think? Pretty cool isn't it? I'd be glad to see what you could be using this for so if you ever come up with a usecase, be sure to share. ;)

Oh by the way if you need to cast a number into a string, it is nothing easier than `$number + unquote("")`.
