---
layout: post
title: "SassyJSON: Talk to the browser!"
tags:
  - sass
  - JSON
  - SassyJSON
  - releaase
---

> **Edit (2014/11/16):** please, don't use this in a live project. If you come up with a case where you need to parse/encode JSON in Sass, consider having a Ruby/C/whatever helper function for this.

If you are a reader of CSS-Tricks, you might have come across this article a while back about [making Sass talk to JavaScript with JSON](http://css-tricks.com/making-sass-talk-to-javascript-with-json/). The main idea behind this write up is to provide a way for JavaScript to access content from the stylesheet (a.k.a. CSS).

While the idea is solid, the realization is very simple. There was no CSS magic behind it at all. Les James (the author) manually wrote some [JSON](http://json.org/) in the `content` property of body's `::before` pseudo-element, like this:

```css
body::before {
  display: none;
  content: '{ "current": "small", "all": ["small"] }';
}
```

Well, you have to tell it is actually kind of cool to be able to do so, right? This is neat! Well fasten your belt guys because [Fabrice Weinberg](https://twitter.com/fweinb) and I pushed this to an upper level.

## Introducing SassyJSON

Fabrice and I recently released [SassyJSON](https://github.com/HugoGiraudel/SassyJSON), a Sass-powered API to communicate with JavaScript through JSON. Basically it's `json-decode` and `json-encode` in Sass.

*Why*, you ask? Well, I guess that could be useful at some point. With maps coming up in Sass 3.3, we are about to have real structured data in Sass. It will soon be very easy to have a config object (understand a map) or a media-query handler (a map again). Being able to encode those objects to JSON and move them out of the stylesheet opens us to a lot of new horizons. I'll leave you the only judge of what you'll do with this.

On my side, I already found a usecase. You may know [Bootcamp](https://github.com/thejameskyle/bootcamp), a Jasmine-like testing framework made in Sass for Sass by [James Kyle](https://twitter.com/thejameskyle) (with a Grunt port). I am using Bootcamp for [SassyLists](https://github.com/Team-Sass/SassyLists). I am using Bootcamp for [SassyMatrix](https://github.com/HugoGiraudel/SassyMatrix). We are using Bootcamp for [SassyJSON](https://github.com/HugoGiraudel/SassyJSON). This makes sure our Sass code is clean and efficient.

Back to my point: Bootcamp 2 (work in progress) [will use maps](https://github.com/thejameskyle/bootcamp/issues/75#issuecomment-32131963) to handle test results. Encoding this map to JSON makes it easy to parse it with JavaScript in order to make a real page for tests result, kind of like Jasmine SpecRunner. This is cool. Picture it guys:

1. You write a Sass library
2. You write Jasmine-like tests for your library
3. You run them with Grunt
4. And get a clean HTML page with your results

How awesome is that?

## Sass to JSON

Writing the `json-encode` part has been very easy to do. It took us less than an hour to have everything set up. We are able to encode properly any Sass type to JSON, including lists and maps. We have a `json-encode` function delaying the encoding to type-specific *private* functions like `_json-encode--string`, `_json-encode--list` thanks to the brand new `call` function from Sass 3.3:

```scss
@function json-encode($value) {
  $type: type-of($value);                            /* 1 */
  @if function_exists('_json-encode--#{$type}') {    /* 2 */
    @return call('_json-encode--#{$type}', $value);  /* 3 */
  }
  @warn "Unknown type for #{$value} (#{$type}).";    /* 4 */
  @return false;                                     /* 4 */
}
```

Here is what's going on:

1. First we check the type of the given value
2. We look for a function called `_json-encode--#{$type}` where `#{$type}` is the type of the value
3. If it exists, we call the function with `call` by passing it the value as parameter
4. If it doesn't exist, we warn the user of the issue and return false

We are very glad to be able to do clever stuff like this thanks to Sass 3.3 new functions. It looks both neat and clean, doesn't it? Otherwise all functions are pretty straight-forward. Really, writing the encoding part has been easy as pie.

### Dumping JSON in CSS

Once you've encoded your Sass into JSON, you'll want to dump the JSON string into the CSS so that you can access it on the other side. There are several possibilities to dump a string into CSS without messing things up:

* using the `content` property of a pseudo-element (`::after` and `::before`)
* using the `font-family` property, preferably on an used element (e.g. `head`)
* using a falsy media query
* using a persistent comment (`/*!*/`)

Since we don't like to choose, we picked all of them. We simply made [a mixin with a flag](https://github.com/HugoGiraudel/SassyJSON/blob/master/src/encode/mixins/_json.scss) as a parameter defining the type of output you'll get: `regular` for option 1 and 2 (cross-browser mess), `media` for the media query and `comment` for the comment or even `all` for all of them (which is the default). Judge for yourselves:

```scss
$map: ((a: (1 2 ( b : 1 )), b: ( #444444, false, ( a: 1, b: test ) ), c: (2 3 4 string)));
@include json-encode($map, $flag: all);
```

```css
/*! json-encode: '{"a": [1, 2, {"b": 1}], "b": ["#444444", false, {"a": 1, "b": "test"}], "c": [2, 3, 4, "string"]}' */

body::before {
  display: none !important;
  content: '{"a": [1, 2, {"b": 1}], "b": ["#444444", false, {"a": 1, "b": "test"}], "c": [2, 3, 4, "string"]}';
}

head {
  font-family: '{"a": [1, 2, {"b": 1}], "b": ["#444444", false, {"a": 1, "b": "test"}], "c": [2, 3, 4, "string"]}';
}

@media -json-encode {
  json {
    json: '{"a": [1, 2, {"b": 1}], "b": ["#444444", false, {"a": 1, "b": "test"}], "c": [2, 3, 4, "string"]}';
  }
}
```

## JSON to Sass

Meanwhile `json-decode` has been a pain in the ass to write, so much that I was very close to give up. Between nested lists, maps, null values, falsy values and hundreds of other tricky cases it is probably one of the hardest thing I've ever done in Sass.

<blockquote class="pull-quote--right">It was so difficult I was close to giving up.</blockquote>

One of the main problem we faced was the ability to retrieve numbers and colors. You see, when you parse a string, everything is a *string*. Even if *you* now this part is a number and this part is a boolean, when you slice your string all you have is shorter strings. Not numbers and booleans.

And this is a big deal, because when you use those tiny bits of decoded JSON in your Sass, types matter. If you go `42px * 2` but `42px` is actually a `string` and not a `number` as it should be, [then your code breaks](http://hugogiraudel.com/2013/09/03/use-lengths-not-strings/) and Sass is furious and you are sad. Hence [this article](http://hugogiraudel.com/2014/01/15/sass-string-to-number/) about casting a string into a number in Sass.

### Getting started

It took me 3 completely different tries before I come up with something that actually succeeds in parsing JSON. Frankly I was about to give up after the 2nd one because I had absolutely no idea how to do this efficiently. Just in case, I started searching for algorithms like how to build one's own JSON parser or something.

I ended up in an obscure StackOverflow thread pointing to JSON parser implementations by browser vendors. Chrome's one was impossible for me to understand, so I gave a shot at [Mozilla's](https://github.com/mozilla/rhino/blob/master/src/org/mozilla/javascript/json/JsonParser.java) and it looked actually understandable! Mozilla is using Java for their JSON parser, and their code is quite simple to catch up even for someone with absolutely no experience with Java at all (a.k.a. me).

<blockquote class="pull-quote--right">Sass and Java are quite different.</blockquote>

So I followed the Fox' steps and began implementing it approximately like they did. Breaking news folks: Sass and Java are two very different languages. I had to be creative for some stuff because it was simply impossible to do it their way (number casting, anyone?).

Anyway, the main idea is the following:

1. Call `json-decode` on a JSON string
2. This is defered to `_json-decode--value`
3. This is defered to a type-specific decoding function like `__json-decode--number`
4. The result bubbles up to `json-decode`
5. You got your result

### Global or scoped?

As I said, the Fox implemented it as a Java class. Among other things, it means this class can have private properties to keep track of some global values. Well I don't. At first, I used a couple of global variables for `$position` (the pointer position), `$source` (the JSON string), `$length` (the length of the string) to make my code very close to the Java implementation. Indeed, none of my functions required any argument to work, using everything from the global scope.

This was kind of dirty. I didn't want the parser to rely on global variables and Fabrice wasn't very satisfied either. So I moved everything back into the functions. This wasn't an easy move because suddenly I had to pass the pointer from a function to another, from the beginning of the parsing until the very end. And since most functions do return a result, I had to return a list of two element where the first would be the pointer, and the second would be the actual result: `($pointer, $result)`. Messy but it did the trick.

## What's left?

Almost nothing. I am very proud with what we have come up with. The *only* thing missing from our parser is the ability to detect special characters: `\"`, `\\`, `\/`, `\b`, `\f`, `\t` and `\u{{four-hex-digits}}`. We [found a way](https://github.com/HugoGiraudel/SassyJSON/blob/master/src/decode/helpers/_strip-token.scss) for `\n` and `\r` and `\"` but that's pretty much it. I'm not sure we will be able to parse them all, but we need to dig deeper into it before determining.

Otherwise, I think we are good. We have already done almost [500 simple tests](https://github.com/HugoGiraudel/SassyJSON/tree/master/test) to cover all basic usages of JSON. Now, we are likely to find edge cases like weird encoding, a space at the wrong place and so on...

Also, I'd like to be able to cover every case of invalid JSON with a `false` return along with an error message in the console. I don't want to have a compiler error whenever the JSON string is invalid: this is dirty. To find all the error cases, I need tests. And if you feel like helping you testing it, you'd be more than welcome.

On the performance side, I suppose we could always do better. We try to make the code as fast as possible but it's not easy when you nest multiple level of functions and loops. I am thinking of using some kind of cache system like [Memo](https://github.com/Team-Sass/Sassy-Maps#memo) for SassyMaps by [Snugug](https://twitter.com/snugug). We'll see.

## Final words

That's pretty much it folks. We hope you like it! It's been one hell of a thing to do and we're glad to have made it through. Comments and suggestions are obviously welcome!

If you want to test SassyJSON, you'll be pleased to know it's available on [npm](https://npmjs.org/) or as [Ruby Gem](http://rubygems.org/gems/SassyJSON). We also [asked SassMeister to support it](https://github.com/jedfoster/SassMeister/issues/70) so you should soon be able to play with it directly on SassMeister.
