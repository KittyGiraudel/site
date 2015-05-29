---
layout: post
sassmeister: true
title: "Pushing Sass placeholders further"
tags:
  - sass
  - placeholders
  - extend
---

Yesterday I released [Getting the most out of Sass placeholders](http://hugogiraudel.com/2014/03/31/getting-the-most-out-of-sass-placeholders/), where I explained how I came up with a little technique to work around the fact `@extend` doesn't work whenever you're in a `@media` block. 

The trick was to wrap the placeholder extension in a mixin. This mixin accepts a single boolean, defining if it should extend the placeholder or include the mixin's content as a regular mixin would do. Here is a short example:

<pre class="language-scss"><code>@mixin clearfix($extend: true) {
  @if $extend {
    @extend %clearfix;
  }
  @else {
    overflow: hidden;
  }
}

%clear {
  @include clearfix($extend: false);
}</code></pre>

For more informations about this technique and to understand this post, I suggest you read the article. Don't worry, I'll be there. I'll wait, go ahead.

## Pushing things further 

All good? Fine. This morning, [Matt Stow](https://twitter.com/stowball/status/450917879047651328) suggested a new version where we wouldn't have to create a mixin for every placeholder we want to have. Instead, we would have a single mixin &mdash; let's call it `extend()` &mdash; asking for a placeholder's name, and extending it or including the mixin's content as we did yesterday.

You can fin [Matt's demo on SassMeister](http://sassmeister.com/gist/9910272). It looks about this:

<pre class="language-scss"><code>@mixin extend($placeholder, $extend: true) {
  @if $extend {
    @extend %#{$placeholder};
  }
  @else {
    @if $placeholder == clearfix {
      overflow: hidden;
    }
    @else if $placeholder == hide-text {
      overflow: hidden;
      text-indent: 100%;
      white-space: nowrap;
    }
    /* ... any other placeholders you want ... */
    @else {
      @warn "`#{$placeholder}` doesn't exist.";
    }
  }
}

%clearfix {
  @include extend(clearfix, $extend: false);
}

%hide-text {
  @include extend(hide-text, $extend: false);
}</code></pre>

This technique is great if you want to reduce the number of mixins. Indeed, you have only one `extend()` mixin, and all the placeholders you want. When you create a placeholder, all you have to do is adding its core content in the mixin by adding a `@else if ($class == my-placeholder)` clause.

However it can quickly become very messy when you have a lot of placeholders to deal with. I can see the `extend()` mixin's core being dozens of lines long which is probably not a good idea. Also, I don't like having a lot of conditional statements, especially since [Sass doesn't and won't ever provide a `@switch` directive](https://github.com/nex3/sass/issues/554).

## Improving the improved version 

That being said, I liked Matt's idea so I tried to push things even further! To prevent from having a succession of conditional directives, we need a loop. And to use a loop, we need either a list or a map. 

What's cool with CSS declarations is they look like keys/values from a map. I think you can see where this is going.

My idea was to move all the mixin's core to a configuration map so it only deals with logical stuff. Let me explain with an example; what if we had a map like this:

<pre class="language-scss"><code>$placeholders-map: (
  clearfix: (
    overflow: hidden
  ),
  hide-text: (
    overflow: hidden,
    text-indent: 100%,
    white-space: nowrap
  )
);</code></pre>

We have a top-level map called `$placeholders-map`. Each key from the map is the name of a placeholder (e.g. `clearfix`). The value bound to a key is a map as well. Those inner maps are basically CSS declarations. There can be as many as we want.

Now that we have a map to loop through, we can slightly rethink Matt's work:

<pre class="language-scss"><code>@mixin extend($placeholder, $extend: true) {
  $content: map-get($placeholders-map, $placeholder);
  
  // If the key doesn't exist in map, 
  // Do nothing and warn the user
  @if $content == null {
    @warn "`#{$class}` doesn't exist in $extend-map.";
  }
  
  // If $extend is set to true (most cases)
  // Extend the placeholder
  @else if $extend == true {
     @extend %#{$placeholder};
  }
  
  // If $extend is set to false
  // Include placeholder's content directly
  @else {
    @each $property, $value in $content {
      #{$property}: $value;
    }
  }
}</code></pre>

First, we retreive placeholder's content from `$placeholders-map` with `map-get($placeholders-map, $placeholder)`. If the name doesn't exist as a key in the map (`null`) , we do nothing but warn the developer:

* either he made a typo in the placeholder's name,
* or he didn't set the placeholder in the configuration map.

If the placeholder's name has been found and `$extend` is set to `true`, then we extend the actual Sass placeholder. Else if `$extend` is `false`, we dump the placeholder's content from within the mixin. To do so, we loop through the inner map of declarations. Simple and comfy.

Last but not least, let's not forget to create our Sass placeholders! And this is where there is a huge improvement compared to Matt's version: since we have a map, we can loop through the map, to generate the placeholders. We don't have to do it by hand!

<pre class="language-scss"><code>// Looping through `$placeholders-map`
// Instanciating a placeholder everytime
// With $extend set to false so it dumps 
// mixin's core in the placeholder's content
@each $placeholder, $content in $placeholders-map {
  %#{$placeholder} {
    @include extend($placeholder, $extend: false);
  }
}</code></pre>

Done.

## Final thoughts 

You can have a look at the fully commented code [here on SassMeister](http://sassmeister.com/gist/9910527):

<p class="sassmeister" data-gist-id="9910527" data-height="480"><a href="http://sassmeister.com/gist/9910527">Play with this gist on SassMeister.</a></p>

While the code does the job well, I am not sure how I feel about this. To be perfectly honest with you guys, I think I'd rather use the version from yesterday's article (which I already do at work) and this for two reasons.

First, there is a big problem with this version: since we are relying on the fact CSS declarations can be stored as keys/values in a Sass map, it makes it impossible to use nesting (including `&`), inner mixins, or `@extend` in the mixin core. Thus, it does the job for simple placeholders as we've seen in our demo, but wouldn't work for more complex pieces of code.

<blockquote class="pull-quote--right">I love playing with Sass syntax.</blockquote>

Secondly, I don't like storing CSS declarations in a map, no matter how clever it is. In the end, I feel like it adds too much code complexity. [Someone once told me it's like a preprocessor in a preprocessor](http://codepen.io/HugoGiraudel/details/yGFri#comment-id-25055). I don't think it's worth the pain.

That being said, it's pretty cool as experimental stuff. Playing around Sass' syntax has always been one of the things I love the most about this preprocessor. Hence this blog post, and the pretty crazy demo. Anyway, I hope you liked it, and thanks Matt!
