---
layout: post
sassmeister: true
title: "Translation system in Sass"
---

Lately, I have been actively contributing to [a11y.css](https://github.com/ffoodd/a11y.css) project. If you don't know it yet and happen to be interested in accessibility, I highly recommand you give it a glance. It is a massive work from French developer and accessibility activist [Gaël Poupard](https://twitter.com/ffoodd_fr).

As far as I am concerned, I am no accessibility expert, so I always find this kind of initiatives very helpful. To briefly introduce a11y.css, it is a stylesheet that you can include in any web page to highlight possible mistakes, errors and improvements. Each notification comes with a message (displayed with pseudo-elements) explaining what's going on and what should be done. Cool stuff, really.

I thought it was too bad to keep it exclusively in French so I opened [an issue](https://github.com/ffoodd/a11y.css/issues/13) to suggest a Sass solution (project was already running on Sass anyway) to provide messages in different languages. I am very happy with what I have come up hence this article to explain how I did it.

## Introducing the API

The goal was not to switch the whole thing to English. I think Gaël wanted to keep French and in the mean time provide an English version. So the idea was to find a way to generate a stylesheet per language. Feel like adding Spanish? Go for it, should be a breeze.

My idea was to have a `.scss` file per language, following a pattern like `a11y-<language>.scss` for convenience that gets compiled into a `a11y-<language>.css` file. This file shouldn't contain much. Actually only:

1. defining `@charset` (obviously to `UTF-8`);
1. importing utilities (translation map, mixins, configuration...);
1. defining the language to use (as of today `fr` or `en`);
1. importing CSS styles.

For instance, `a11y-en.scss` would look like:

<pre class="language-scss"><code>@charset "UTF-8";

@import "utils/all";
@include set-locale("en");
@import "a11y/a11y";</code></pre>

Looking pretty neat, right?

## Setting the language

You've seen from the previous code snippet that we have a `set-locale` mixin accepting a language (shortcut) as a parameter. Let's see how it works:

<pre class="language-scss"><code>/// Defines the language used by `a11y.css`. For now, only `fr` and `en` allowed.
/// @group languages
/// @param {String} $language
/// @output Nothing
/// @example scss - Defines the language to `fr`.
///  @include set-locale('fr');
@mixin set-locale($language) {
  $supported-languages: 'fr', 'en';
  $language: to-lower-case($language);

  @if not index($supported-languages, $language) {
    @error "Language `#{$language}` is not supported. Pull request welcome!";
  }

  $language: $language !global;
}</code></pre>

There is very little done here. First, it makes sure the given language is supported. For now, only `fr` and `en` are. If it is not supported, it throws an error. Else, it creates a global variable called `$language` containing the language (`fr` or `en`). Easy, let's move on.

## Gathering all messages within a map

The point of this system is to gather all messages within a big Sass map. Thus, we don't have dozens of strings scattered across stylesheets. Every single message, no matter the language, lives inside the `$messages` map. Then, we'll have an accessor (a getter function) to retrieve a message from this map depending on the global language.

Gaël has divided messages in different themes: `errors`, `advices` or `warnings`. This is the first level of our map.

<pre class="language-scss"><code>$messages: (
  'errors': ( /* ... */ ),
  'advices': ( /* ... */ ),
  'warnings': ( /* ... */ )
);</code></pre>

Then each theme gets mapped to a sub-map (second level) containing keys for different situations. For instance, the `error` telling that there a missing `src` attribute on images:

> [src] attribute missing or empty. Oh, well…

... is arbitrary named `no-src`.

<pre class="language-scss"><code>$messages: (
  'errors': (
    'no-src': ( /* ... */ )
  ),
  'advices': ( /* ... */ ),
  'warnings': ( /* ... */ )
);</code></pre>

And finally, this key is mapped to another sub-map (third level) where each key is the language and each value the translation:

<pre class="language-scss"><code>$messages: (
  'errors': (
    'no-src': (
      'fr': 'Attribut [src] manquant ou vide. Bon.',
      'en': '[src] attribute missing or empty. Oh, well…'
    ),
    // ...
  ),
  'advices': (
    // ...
  ),
  'warnings': (
    // ...
  )
);</code></pre>

However fetching `fr` key from `no-src` key from `errors` key from `$messages` map would look like:

<pre class="language-scss"><code>$message: map-get(map-get(map-get($messages, 'errors'), 'no-src'), 'fr')));</code></pre>

This is both ugly and a pain in the ass to write. With a [`map-deep-get`](https://github.com/ffoodd/a11y.css/blob/master/sass/utils/_functions.scss#L6-L12) function, we could shorten this to:

<pre class="language-scss"><code>$message: map-deep-get($messages, 'errors', 'no-src', 'fr');</code></pre>

Much better, isn't it? Although having to type the language over and over is not very convenient. And we could also make sure `errors` is a valid theme (which is the case) and `no-src` is a valid key from theme `errors` (which is also the case). To do all this, we need a little wrapper function. Let's call it `message`, in all its simplicity:

<pre class="language-scss"><code>/// Retrieve message from series of keys
/// @access private
/// @param {String} $theme - Either `advice`, `error` or `warning`
/// @param {String} $key - Key to find message for
/// @requires $messages
/// @return {String} Message
@function message($theme, $key) {
  $locale: if(global-variable-exists('language'), $language, 'en');

  @if not index(map-keys($messages), $theme) {
    @error "Theme `#{$theme}` does not exist.";
  }

  @if not index(map-keys(map-get($messages, $theme)), $key) {
    @error "No key `#{$key}` found for theme `#{$theme}`.";
  }

  @return map-deep-get($messages, $theme, $key, $locale);
}</code></pre>

The `message` function first deals with the language. If a global variable called `language` exists &mdash; which is the case if `set-locale` has been called &mdash; it uses it, else it falls back to `en`. Then, it makes sure arguments are valid. Finally, it returns the result of `map-deep-get` as we've seen above.

So we could use it like this:

<pre class="language-scss"><code>img:not([src])::after {
    content: message('errors', 'no-src');
}</code></pre>

Pretty cool! Although having to type `content` everywhere could be avoided. Plus, Gaël uses `!important` in order to make sure the messages are correctly being displayed. Let's have a `message` mixin wrapping around `message` function!

<pre class="language-scss"><code>/// Get a message from the translation map based on the defined language.
/// The message contains the icon associated to the message type.
/// @group languages
/// @param {String} $theme - Theme name
/// @param {String} $key - Key name
/// @require {function} message
/// @output `content`, with `!important`
/// @example scss - Get message for `no-src` from `errors` category when language is set to `en`
/// .selector {
///   @include message('errors', 'no-src');
/// }
/// @example css - Resulting CSS
/// .selector {
///   content: '[src] attribute missing or empty. Oh, well…';
/// }
@mixin message($theme, $key) {
  content: message($theme, $key) !important;
}</code></pre>

Same arguments. No logic. Nothing but the `content` property with `!important`. Thus we would use it like this:

<pre class="language-scss"><code>img:not([src])::after {
    @include message('errors', 'no-src');
}</code></pre>

We're done. It's over!

## Final thoughts

Cases where we need a translation system in Sass are close to zero, but for a11y.css this work proves to be useful after all. Adding a new language, for instance German, is as easy as adding a `de` key to all messages in the `$messages` map, and adding `de` to `$supported-languages` within `set-locale` mixin.

That's it! Anyway, have a look at [a11y.css](http://ffoodd.github.io/a11y.css), contribute to this awesome project and share the love!
