---
layout: post
title: Type conversion in Sass
comments: true
preview: false
---

<section>
To *cast* an entity means changing its data type to another one. This very particular thing so common in all programming languages can turn out to be a huge pain in the (S)ass. Mostly because Sass is not a programming language but that's not the point.

Something so simple as changing a stringified number into an integer is actually quite difficult to do in Sass, yet sometimes you might find yourself in the need of doing that (which means there is probably something wrong somewhere in your code by the way).

Sass provides a few types:

* [string](#string) (with or without quotes)
* [number](#number) (with or without CSS unit)
* [bool](#bool) (`true` or `false`)
* [color](#color) (hexadecimal, rgb, hsl, keyword)
* [list](#list) (comma separated or space separated)
* [map](#map) (from Sass 3.3)
* [null](#null) (kind of a weird one)

Let's see how we can cast a value to another data type.

<p class="explanation">Update: I just released [SassyCast](https://github.com/HugoGiraudel/SassyCast), also available as an eponym Compass extension.</p>
</section>
<section id="string">
## To string [#](#string)

Casting to a string has to be the easiest type of all thanks to the brand new `inspect` function from Sass 3.3 which does exactly that: casting to string.

<pre class="language-scss"><code>@function to-string($value) {
  @return inspect($value);
}</code></pre>

It works with anything, even lists and maps. However it does some color conversions (hsl being converted to rgb and things like that) so if it's important for you that the result of `to-string` is precisely the same as the input, you might want to opt for a [proof quoting function](https://github.com/HugoGiraudel/SassyJSON/blob/master/stylesheets/encode/helpers/_quote.scss) instead. Same if you are running Sass 3.2 which doesn't support `inspect`.

Another way to cast to string without quoting is adding an unquoted empty string to the value like this `$value + unquote("")` however it has two pitfalls:

* it doesn't work with `null`: throws `Invalid null operation: "null plus """.`
* it doesn't make maps displayble as CSS values: still throws `"(a: 1, b: 2) isn't a valid CSS value."`
</section>
<section id="number">
## To number [#](#number)

I have already written an article about how to convert a stringified number into an actual number, even if it has a CSS unit in [this article](http://hugogiraudel.com/2014/01/15/sass-string-to-number/). 

I feel like the function could be improved to accept a boolean to be converted into `0` or `1` and things like that but that's mostly optimization at this point. 
</section>
<section id="bool">
## To bool [#](#bool)

Converting a value to a boolean is both simple and tricky. On the whole, the operation is quite easy because Sass does most of the work by evaluating a value to a boolean when in an `@if`/`@else if` directive. Meanwhile, there are some values that Sass considers as `true` while they are generally refered as `false`.

<pre class="language-scss"><code>@function to-bool($value) {
  @if not $value or $value == "" or $value == 0 {
    @return false;
  }
  @return true;
}</code></pre>

Note how we have to manually check for `""` and `0` because both evaluate to `true` in Sass.

<pre class="language-scss"><code>to-bool(0)           // false
to-bool(false)       // false
to-bool(null)        // false
to-bool("")          // false
to-bool(1)           // true
to-bool(true)        // true
to-bool("abc")       // true
to-bool(0 1 2)       // true
to-bool((a: 1, b: 2) // true</code></pre>
</section>
<section id="color">
## To color [#](#color)

We needed to be able to convert a stringified color into a real color for [SassyJSON]() and we succeeded in doing so without too much troubles. Since we can't build an hexadecimal color from the `#` symbol (because it would result in a string), we went with the `rgb()` for hexadecimal colors. 

Basically we parse the triplet, convert each of its three parts from hexadecimal to decimal and run them through the `rgb` function to have a color. Not very short but does the trick!

I'll let you have a look at [the files](https://github.com/HugoGiraudel/SassyJSON/tree/master/stylesheets/decode/helpers/color) from our repo if you're interested in casting a string to a color.
</section>
<section id="list">
## To list [#](#list)

Technically, Sass treats all values as single-item lists so in a way, your value is already a list even if it doesn't have an explicit `list` type. Indeed, you can test its length with `length`, add new values to it with `append` and so on. That being said, if you still want to have a `list` data type anyway there is a very simple way in Sass 3.3 to do so:

<pre class="language-scss"><code>@function to-list($value) {
  @return if(type-of($value) != list, ($value,), $value);
}</code></pre>

No, there is no typo in this code snippet. It's really returning `($value,)`, which is basically a singleton. Starting from Sass 3.3, both [lists and maps accept trailing commas](https://github.com/nex3/sass/pull/964) and since [it's not the braces but the delimiter which makes a list](https://github.com/nex3/sass/issues/837#issuecomment-20429965), returning `$value,` returns a list anyway.

If you are running Sass 3.2 and still want to create a singleton, there is a way which is actually kind of clever if you ask me:

<pre class="language-scss"><code>@function to-list($args...) {
  @return append((), $args);
}</code></pre>
</section>
<section id="map">
## To map [#](#map)

Converting a single value to a map doesn't make much sense since a map is a key/value pair while a value is, well, a value. So in order to cast a value to map, we would have to invent a key to associate the value to. In a matter of simplicity, we can go with `1` but is it obvious? We could also use the `unique-id()` function or something. Anyway, here is the main picture:

<pre class="language-scss"><code>@function to-map($value) {
  @return if(type-of($value) != map, (1: $value), $value);
}</code></pre>

Feel free to replace `1` with whatever makes you feel happy. 

<pre class="language-scss"><code>to-map("string") // (1: "string")
to-map(1337)     // (1: 1337)
</code></pre>
</section>
<section id="null">
## To null [#](#null)

Well, I don't think there is such a thing as *casting to null*. In JavaScript, `typeof null` returns an object (...) but in Sass there is a `null` type which has a single value bound to it: `null`. So casting to null is the same as returning `null`. Pointless.
</section>
<section id="final-words">
## Final words [#](#final-words)

While we can find hacks and tricks to convert values from one type to another, I'd advise against doing so. By doing this, you are moving too much logic inside your stylesheet. More importantly, there is no good reason to cast a value in most cases.

In any case, I think it's interesting to know *how* we can do such things. By tinkering around the syntax, we get to know it better and get more comfortable when it comes to do simple things.
</section>
