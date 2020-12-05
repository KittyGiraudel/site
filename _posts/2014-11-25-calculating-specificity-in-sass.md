---
guest: David Khourshid
title: Calculating specificity in Sass
keywords:
  - sass
  - css
  - specificity
---

> The following is a guest post by [David Khourshid](https://twitter.com/davidkpiano) about how he managed to build a specificity calculator in Sass. In all honesty, I would not have made any better than David with this, so I have to say I am very glad to have him talking about his experiment here.

As any web developer who has to write CSS knows, specificity is both an important and confusing concept. You might be familiar with principles such as avoiding nesting and IDs to keep specificity low, but knowing exactly _how_ specific your selectors are can provide you valuable insight for improving your stylesheets. Understanding specificity is especially important if you are culpable of sprinkling `!important` throughout your CSS rules in frustration, which ironically, makes specificity less important.

![CSS Specificity issue](/assets/images/calculating-specificity-in-sass/important.png)

**TL;DR:** Check out the source (and examples) [here on SassMeister](https://www.sassmeister.com/gist/dbf20a242bcccd1d789c) or directly on [GitHub](https://github.com/davidkpiano/sass-specificity).

## What is Specificity?

In short, specificity determines **how specific** a selector is. This might sound like a tautology, but the concept is simple: rules contained in a _more specific_ selector will have greater **weight** over rules contained in a _less specific_ selector. This plays a role in the **cascading** part of CSS, and ultimately determines which style rule (the one with the greatest weight) will be applied to an element. Specifically, specificity of a selector is the collective [multiplicity](https://en.wikipedia.org/wiki/Multiplicity_(mathematics)) of its simple selector types.

There are plenty of articles that further explain/simplify specificity:

* W3C - [the Cascade and Specificity](https://www.w3.org/TR/CSS2/cascade.html#specificity) and [Calculating Specificity](https://www.w3.org/TR/css3-selectors/#specificity);
* Smashing Mag - [CSS Specificity: Things You Should Know](https://www.smashingmagazine.com/2007/07/27/css-specificity-things-you-should-know/);
* CSS Tricks - [Specifics on CSS Specificity](https://css-tricks.com/specifics-on-css-specificity/);
* CSS Specificity illustrated on [cssspecificity.com](https://cssspecificity.com/);
* Sitepoint - [Specificity](https://www.sitepoint.com/web-foundations/specificity/).

## The Simplicity of Calculating Specificity

The algorithm for calculating the specificity of a selector is surprisingly simple. A simple selector can fall into three types:

* **Type A**: ID selectors;
* **Type B**: class, attribute, and pseudo-class selectors;
* **Type C**: element (type) and pseudo-element selectors.

Compound and complex selectors are composed of simple selectors. To calculate specificity, simply break apart your selector into simple selectors, and count the **occurances of each type**. For example:

```css
#main ul li > a[href].active.current:hover {
}
```

…has **1 ID (type A)** selector, **2 class + 1 attribute + 1 pseudo-class (type B)** selector, and **3 element type (type C)** selectors, giving it a specificity of `1, 4, 3`. We’ll talk about how we can represent this accurately as an integer value later.

## The Specifics

Now that we have our basic algorithm, let’s dive right in to calculating specificity with Sass. In Sass 3.4 (Selective Steve), one of the major new features was the addition of many useful [selector functions](https://sass-lang.com/documentation/Sass/Script/Functions.html#selector_functions) that might have seemed pretty useless…

…_until now._ (Okay, I’m sure people have found perfectly good uses for them, but still.)

First things first, let’s determine what our API is going to look like. The simpler, the better. I want two things:

* A **function** that returns specificity as a type map or integer, given a selector (string), and…
* A **mixin** that outputs both a type map and an integer value inside the generated CSS of the _current selector’s_ specificity.

Great; our API will look like this, respectively:

```scss
/// Returns the specificity map or value of given simple/complex/multiple selector(s).
/// @access public
/// @param {List | String} $initial-selector - selector returned by '&'
/// @param {Bool} $integer - output specificity as integer? (default: false)
/// @return {Map | Number} specificity map or specificity value represented as integer
@function specificity($selector, $integer) {
}

/// Outputs specificity in your CSS as (invalid) properties.
/// Please, don’t use this mixin in production.
/// @access public
/// @require {function} specificity
/// @output specificity (map as string), specificity-value (specificity value as integer)
@mixin specificity() {
}
```

Looks clean and simple. Let’s move on.

### Determining Selector Type

Consider a simple selector. In order to implement the algorithm described above, we need to know what **type** the simple selector is - **A, B, or C**. Let’s represent this as a map of what each type **begins with** (I call these _type tokens_):

```scss
$types: (
  c: (':before', ':after', ':first-line', ':first-letter', ':selection'),
  b: ('.', '[', ':'),
  a: ('#')
);
```

You’ll notice that the map is in reverse order, and that’s because of our irritable colon (`:`) - both pseudo-elements and pseudo-classes start with one. The less general (pseudo-element) selectors are filtered out first so that they aren’t accidentally categorized as a type B selector.

Next, according to the [W3C spec](https://www.w3.org/TR/css3-selectors/#specificity), `:not()` does _not_ count towards specificity, but the simple selector _inside_ the parentheses does count. We can grab that with some string manipulation:

```scss
@if  {
  $simple-selector: str-slice($simple-selector, 6, -2);
}
```

Then, iterate through the `$types` map and see if the `$simple-selector` begins with any of the _type tokens_. If it does, return the type.

```scss
@each $type-key, $type-tokens in $types {
  @each $token in $type-tokens {
    @if str-index($simple-selector, $token) == 1 {
      @return $type-key;
    }
  }
}
```

As a catch-all, if none of the type tokens matched, then the simple selector is either the universal selector (`*`) or an element type selector. Here’s the full function:

```scss
@function specificity-type($simple-selector) {
  $types: (
    c: (':before', ':after', ':first-line', ':first-letter', ':selection'),
    b: ('.', '[', ':'),
    a: ('#')
  );

  $simple-selector: str-replace-batch($simple-selector, '::', ':');

  @if  {
    $simple-selector: str-slice($simple-selector, 6, -2);
  }

  @each $type-key, $type-tokens in $types {
    @each $token in $type-tokens {
      @if str-index($simple-selector, $token) == 1 {
        @return $type-key;
      }
    }
  }

  // Ignore the universal selector
  @if str-index($simple-selector, '*') == 1 {
    @return false;
  }

  // Simple selector is type selector (element)
  @return c;
}
```

### Determining Specificity Value

Fair warning, this section might get a bit mathematical. According to the W3C spec:

> Concatenating the three numbers a-b-c (in a **number system with a large base**) gives the specificity.

Our goal is to represent the multiplicity of the three types (A, B, C) as a (base 10) integer from a larger (base ??) number. A common mistake is to use base 10, as this seems like the most straightforward approach. Consider a selector like:

```css
body nav ul > li > a + div > span ~ div.icon > i:before {
}
```

This [complex selector](https://dev.w3.org/csswg/selectors4/#complex) doesn’t look _too_ ridiculous, but its type map is `a: 0, b: 1, c: 10`. If you multiply the types by 10<sup>2</sup>, 10<sup>1</sup>, and 10<sup>0</sup> respectively, and add them together, you get **20**. This implies that the above selector has the same specificity as _two classes_.

**This is inaccurate.**

In reality, even a selector with a single class should have greater specificity than a selector with **any** number of (solely) element type selectors.

> We’re going to need a bigger base.

![What if we tried more power by XKCD](/assets/images/calculating-specificity-in-sass/xkcd.png)

I chose base 256 (16<sup>2</sup>) to represent two hexadecimal digits per type. This is historically how specificity was calculated, but also lets [256 classes override an ID](https://www.thecssninja.com/css/extreme-specificity). The larger you make the base, the more accurate your (relative) specificity will be.

Our job is simple, now. Multiply the multiplicity (frequency) of each type by an exponent of the base according to the map `(a: 2, b: 1, c: 0)` (remember - type A selectors are the most specific). E.g. the selector `#foo .bar.baz > ul > li` would have a **specificity type map** `(a: 1, b: 2, c: 2)` which would give it a specificity of 1 _ 256<sup>2</sup> + 2 _ 256<sup>1</sup> + 2 \* 256<sup>0</sup> = 66050. Here’s that function:

```scss
@function specificity-value($specificity-map, $base: 256) {
  $exponent-map: (
    a: 2,
    b: 1,
    c: 0
  );
  $specificity: 0;

  @each $specificity-type, $specificity-value in $specificity-map {
    $specificity: $specificity + ($specificity-value * pow($base, map-get($exponent-map, $specificity-type)));
  }

  @return $specificity;
}
```

### Dealing with Complex and Compound Selectors

Thankfully, with Sass 3.4's selector functions, we can split a selector list comprised of complex and compound selectors into simple selectors. We’re going to be using two of these functions:

* [`selector-parse($selector)`](https://sass-lang.com/documentation/Sass/Script/Functions.html#selector_parse-instance_method) to split a [selector list](https://dev.w3.org/csswg/selectors4/#selector-list) into a list of selectors;
* [`simple-selectors($selector)`](https://sass-lang.com/documentation/Sass/Script/Functions.html#simple_selectors-instance_method) to split each compound/complex selector into a list of simple selectors.

Some points to note: I’m using a homemade `str-replace-batch` function to remove combinators, as these don’t count towards specificity:

```scss
$initial-selector: str-replace-batch(#{$initial-selector},  ('+', '>', '~'));
```

And more importantly, I’m keeping a running total of the multiplicity of each simple selector using a map:

```scss
$selector-specificity-map: (
  a: 0,
  b: 0,
  c: 0
);
```

Then, I can just use my previously defined function `selector-type` to iterate through each simple selector (`$part`) and increment the `$selector-specificity-map` accordingly:

```scss
@each $part in $parts {
  $specificity-type: specificity-type($part);

  @if $specificity-type {
    $selector-specificity-map: map-merge(
      $selector-specificity-map,

      (
        #{$specificity-type}: map-get(
            $selector-specificity-map,
            $specificity-type
          ) + 1
      )
    );
  }
}
```

The rest of the function just returns the specificity map (or integer value, if desired) with the highest specificity, determined by the `specificity-value` function, by keeping track of it here:

```scss
$specificities-map: map-merge(
  $specificities-map,
   (specificity-value($selector-specificity-map): $selector-specificity-map)
);
```

Here’s the full function:

```scss
@function specificity($initial-selector, $integer: false) {
  $initial-selector: str-replace-batch(#{$initial-selector},  ('+', '>', '~'));
  $selectors: selector-parse($initial-selector);
  $specificities-map: ();

  @each $selector in $selectors {
    $parts: ();
    $selector-specificity-map: (
      a: 0,
      b: 0,
      c: 0
    );

    @each $simple-selectors in $selector {
      @each $simple-selector in simple-selectors($simple-selectors) {
        $parts: append($parts, $simple-selector);
      }
    }

    @each $part in $parts {
      $specificity-type: specificity-type($part);
      @if $specificity-type {
        $selector-specificity-map: map-merge(
          $selector-specificity-map,

          (
            #{$specificity-type}: map-get(
                $selector-specificity-map,
                $specificity-type
              ) + 1
          )
        );
      }
    }

    $specificities-map: map-merge(
      $specificities-map,
       (specificity-value($selector-specificity-map): $selector-specificity-map)
    );
  }

  $specificity-value: max(map-keys($specificities-map)...);
  $specificity-map: map-values(map-get($specificities-map, $specificity-value));

  @return if($integer, $specificity-value, $specificity-map);
}
```

## The Applicability of Specificity

So, aside from this being another application of a [rethinking of Atwood’s Law](/2014/10/27/rethinking-atwoods-law/), knowing **exactly how specific** your selectors are can be much more beneficial than seeing in your dev tools that your desired styles have been overridden by another style for some relatively unknown reason (which I’m sure is a common frustration). You can easily output specificity as a mixin:

```scss
@mixin specificity() {
  specificity: specificity(&);
  specificity-value: specificity(&, true);
}
```

On top of this, you can [find some way](/2014/01/20/sassyjson-talk-to-the-browser/) to communicate the specificities of your selectors to the browser in development, and output a [specificity graph](https://csswizardry.com/2014/10/the-specificity-graph/) to ensure that your CSS is well-organized.

You can take this even further and, if you have dynamic selectors in your SCSS, know ahead of time which one will have the highest specificity:

```scss
@if specificity($foo-selector, true) > specificity($bar-selector, true) {
  // …
}
```

The full source for the specificity functions/mixins, as well as examples, are available [here on SassMeister](http:s//sassmeister.com/gist/dbf20a242bcccd1d789c):

<p class="sassmeister" data-gist-id="dbf20a242bcccd1d789c" data-height="480" data-theme="tomorrow"><a href="http:s//sassmeister.com/gist/dbf20a242bcccd1d789c">Play with this gist on SassMeister.</a></p>

> [David Khourshid](https://twitter.com/davidkpiano) is a frontend web developer in Orlando, Florida. He is passionate about JavaScript, Sass, and cutting-edge frontend technologies. He is also a pianist and enjoys mathematics, and is constantly finding new ways to apply both math and music theory to web development.
