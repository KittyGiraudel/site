---
title: Bitwise operators in Sass
keywords:
  - sass
  - bitwise
  - experiment
  - release
edits:
  - date: 2015/06/06
    md: This is an experiment, please don’t use this code in production.
---

A couple of days ago, [Valérian Galliat](https://twitter.com/valeriangalliat) and I had the crazy idea of implementing bitwise operators in Sass. It went like this:

> **Kitty**: Do you know how bitwise operators work?  
> **Val**: Yes.  
> **Kitty**: Do you think we could implement them in Sass?  
> **Val**: No.  
> (Loading…)  
> **Val**: Well, in fact we could.  
> **Kitty**: LET’S DO IT!

And so we did, hence a short article to relate the story as well as providing a (useless) use case. But first let’s catch up on bitwise operators, shall we?

_Note: project is on GitHub. Check out [SassyBitwise](https://github.com/KittyGiraudel/SassyBitwise)._

## B-b-b-b-bitwise

_Note: I am no programmer so please kindly apologize any shortcut I could make when explaining bitwise operators._

You are probably not without knowing numbers we use in everyday life are expressed in base 10, also known as _decimal_. _Hexadecimal_ is base 16. _Octal_ is base 8. And _binary_ is base 2. Just to name a few popular bases.

Let’s put this very simple: bitwise operators are operators for numbers expressed in their binary form. Most common bitwise operators are AND (`&`), OR (`|`) and NOT (`~`), but there are also XOR (`^`), LEFT-SHIFT (`<<`) and RIGHT-SHIFT (`>>`).

To illustrate this explanation, allow me to have a little example (inspired from [Wikipedia](https://en.wikipedia.org/wiki/Bitwise_operation#Bitwise_operators)):

```
# ~7
NOT 0111 (decimal 7)
  = 1000 (decimal 8)

# 5 & 3
    0101 (decimal 5)
AND 0011 (decimal 3)
  = 0001 (decimal 1)

# 5 | 3
    0101 (decimal 5)
OR  0011 (decimal 3)
  = 0111 (decimal 7)

# 2 ^ 10
    0010 (decimal 2)
XOR 1010 (decimal 10)
  = 1000 (decimal 8)

# 23 << 1
   00010111 (decimal 23) LEFT-SHIFT 1
=  00101110 (decimal 46)

# 23 >> 1
   00010111 (decimal 23) RIGHT-SHIFT 1
=  00001011 (decimal 11)
```

As you can see, the idea is pretty straightforward:

* _NOT_ converts `1`s in `0`s, and `0`s in `1`s
* _AND_ takes `1`s if both are `1`s, else `0`
* _OR_ takes `1` if any are `1`, else `0`
* _XOR_ takes `1` if one of 2 is `1`, else `0`
* _LEFT-SHIFT_ shifts all bits from `n` to the left
* _RIGHT-SHIFT_ shifts all bits from `n` to the right

If you’re more a _table_ kind of person:

|     | Bit | Result |
| :-: | :-: | :----: |
| NOT |  1  |   0    |
| NOT |  0  |   1    |

| Bit 1 | Bit 2 | AND | OR  | XOR |
| :---: | :---: | :-: | :-: | :-: |
|   1   |   0   |  0  |  1  |  1  |
|   0   |   1   |  0  |  1  |  1  |
|   0   |   0   |  0  |  0  |  0  |
|   1   |   1   |  1  |  1  |  0  |

|             | Bit 1 | Bit 2 | Bit 3 | Bit 4 | Bit 5 | Bit 6 | Bit 7 | Bit 8 |
| :---------: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|   Binary    |   0   |   0   |   0   |   1   |   0   |   1   |   1   |   1   |
| LEFT-SHIFT  |   0   |   0   |   1   |   0   |   1   |   1   |   1   |   0   |
| RIGHT-SHIFT |   0   |   0   |   0   |   0   |   1   |   0   |   1   |   1   |

So you got bitwise.

## Sass implementation

Now, we wanted to implement this in Sass. There are two ways of doing it:

* convert to binary string, then apply operations char per char (a char being a bit in this context)
* rely on mathematical equivalents

We could have decided to manipulate binary strings but god knows why, we ended up implementing the mathematical equivalents of all operators. Fortunately, we didn’t have to figure out the formula (we are not _that_ clever): [Wikipedia has them](https://en.wikipedia.org/wiki/Bitwise_operation#Mathematical_equivalents).

You may think that we didn’t need a decimal to binary converter since we use math rather than string manipulation. Actually, we had to write a `decimal-to-binary()` function because we needed to know the length of the binary string to compute bitwise operations.

We could have figured this length without converting to binary if we had a `log()` function. And we could have made a `log()` function if we had a `frexp()` function. And we could have made a `frexp()` function if we had bitwise operators. Do you see the problem here?

Valérian summed it up quite nicely in a Tweet:

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p>&amp;, | and ^ bitwise operators math formulas needs log(), but log() needs frexp() which needs bitwise operators. Fak! cc <a href="https://twitter.com/HugoGiraudel">@HugoGiraudel</a><br />— Valérian Galliat (@valeriangalliat) <a href="https://twitter.com/valeriangalliat/statuses/474127810798555136">June 4, 2014</a></p></blockquote>

I won’t dig into Sass code because it doesn’t have much point. Let’s just have a look at the final implementation. We have implemented each operator as a Sass function called `bw-*` where `*` stands for the name of the operator (e.g. `and`). Except for `bw-not()` which is a rather particuliar operator, all functions accept 2 arguments: both decimal numbers.

On top of that, we have built a `bitwise()` function (aliased as `bw()`) which provides a more friendly API when dealing with bitwise operations. It accepts any number of queued bitwise operations, where operators are quoted. For instance:

```scss
// 42 | 38 | 24
$value: bitwise(42 '|' 38 '|' 24);
```

So that’s not too bad. The fact that operators have to be quoted for Sass not to crash is kind of annoying, but I suppose we can live with it. Other than that, it’s pretty much like if you were doing bitwise operations in other language, except you wrap all this stuff in `bitwise()` or `bw()`. In my opinion, the API is pretty simple to use.

## Applications

Let’s be honest: there is none. Sass is not a low-level programming language. It does not have any valid use case for bitwise operations. Meanwhile, we implemented bit flags. _Bit flags_ is a programming technique aiming at storing several booleans in a single integer in ordre to save memory.

Here is a great [introduction to bit flags](http://forum.codecall.net/topic/56591-bit-fields-flags-tutorial-with-example/) but I’ll try to sum up. The idea behind _bit flags_ is to have a collection of flags (think of them as options) mapped to powers of 2 (usually with an `enum` field in C/C++). Each option will have its own bit flag.

```
00000000 Bin    | Dec
│││││││└ 1 << 0 | 1
││││││└─ 1 << 1 | 2
│││││└── 1 << 2 | 4
││││└─── 1 << 3 | 8
│││└──── 1 << 4 | 16
││└───── 1 << 5 | 32
│└────── 1 << 6 | 64
└─────── 1 << 7 | 128
```

Now, let’s say option A is `1 << 0` (DEC 1) and option B is `1 << 1` (DEC 2). If we _OR_ them:

```
   00000001 (A)
OR 00000010 (B)
 = 00000011
```

The result &mdash; let’s call it _Z_ &mdash; holds both options, right? To retrieve separately A and B from Z, we can use the _AND_ operator:

```
    00000011 (Z)
AND 00000001 (A)
  = 00000001

    00000011 (Z)
AND 00000010 (B)
  = 00000010
```

So far so good. Now what if we try to _AND_ Z and, option C (`1 << 2`).

```
    00000011 (Z)
AND 00000100 (C)
  = 00000000
```

The result of `Z & C` isn’t equal to `C`, so we can safely assume the C option hasn’t been passed.

That’s pretty much how bit flags work. Now let’s apply it to Sass as an example of SassyBitwise. First thing to do, define a couple of flags:

```scss
// Flags
$A: bw(1 '<<' 0);
$B: bw(1 '<<' 1);
$C: bw(1 '<<' 2);
$D: bw(1 '<<' 3);
```

We also need a mixin that would theorically accepts multiple boolean options. As a proof of concept, our mixin will accept a single argument: `$options`, a **number**.

```scss
/// Custom mixin
/// @param {Number} $options - Bitwise encoded flags
@mixin custom-test( $options) {
  is-a-flag-set: bw($options '&' $A);
  is-b-flag-set: bw($options '&' $B);
  is-c-flag-set: bw($options '&' $C);
  is-d-flag-set: bw($options '&' $D);
}
```

And now we call it, passing it the result of a bitwise _OR_ operation of all our flags.

```scss
// Call
test {
  @include custom-test(bw($A '|' $C '|' $D));
}
```

As expected, the result is the following:

```css
test {
  is-a-flag-set: true;
  is-b-flag-set: false;
  is-c-flag-set: true;
  is-d-flag-set: true;
}
```

## Final thoughts

That’s it folks, SassyBitwise. No point, much fun. As always.

_Note: a huge thanks to [Valérian Galliat](https://twitter.com/valeriangalliat) for helping me out with this._
