---
title: "What to do with a Sass list?"
tags:
  - sass
  - lists
---

A few weeks ago, [Louis Lazaris](https://twitter.com/ImpressiveWebs) has been invited at [Shop Talk Show](https://shoptalkshow.com/episodes/103-louis-lazaris/), the front-end podcast by [Chris Coyier](https://twitter.com/chriscoyier) and [Dave Rupert](https://twitter.com/davatron5000). I joined in the middle of the show and it was kind of cool hearing Louis talking about various stuff including Sass. By the way, if one of you people come over here, thanks for mentioning me. ;)

Anyway, at some point someone asked a very interesting question about Sass:

> I’m enjoying learning Sass, but one of those things I can’t wrap my head around is use cases for lists. What would you stuff in a Sass list?

I can see why this nice folk came up with such a question. When you've been used to vanilla CSS for years, you hardly can see the use case for a Sass list. I'll try to enlight the path people!

## A quick reminder

Let's start with a quick reminder. First of all, the `list` data type isn't specific to Sass. Actually CSS has been using lists for ages! Doubt it? Consider the following CSS rules:

```css
.element,
.other-element {
  font-family: 'Arial', 'Helvetica', sans-serif;
  padding: 10px 5px 15px 0;
  margin: 1em 0.5em;
  background: url('my/awesome/image.png') 0 0 #666;
  border: 1px solid silver;
  box-shadow: 0 0.5em 0.25em -0.5em rgba(0, 0, 0, 0.1);
}
```

All these properties (and many more) use lists as values. To my knowledge, only `font-family` uses a comma-separated list though. Anyway, most of them are shorthands for multiple properties, so that's not surprising but still. Even the selector itself is a (comma-separated) list!

> There have been lists for long in CSS.

Lists have been around for a long time now, we just didn't call them "lists" because we didn't have to. Now, Sass officially uses the word "list" as a data type, but that doesn't mean Sass introduced lists to the CSS background.

_Note: by the way, if you haven't read [my article about Sass lists](https://hugogiraudel.com/2013/07/15/understanding-sass-lists/), I suggest you do._

## Because looping is fun!

I believe what we've just seen in the first section is a valid answer for the question. Since CSS supports lists for some values, why wouldn't Sass? But you might want to have a deeper answer I suppose. Actually a Sass list hasn't much point by itself. However it's getting pretty cool when you can iterate over it with a loop. Thankfully Sass provides three types of loop: `@for`, `@each` and `@while`.

Let me try with a practical example: at work, we display an image background directly related to the post-code the user is being geolocated in. For instance, I live in Grenoble, France of which the post-code is 38000, shortened as 38. Then, I got served a background image called `background-38.jpg`. To avoid doing this manually for all post-codes, we use a list.

```scss
$zips: 07, 26, 38, 69, 'unknown';

// 1. `.zipcode-*` class on body
// 2. Header only
// 3. Home page
@each $zip in $zips {
  .zipcode-#{$zip} {
    // 1
    .header {
      // 2
      background-image: url('../bundles/images/backgrounds/#{$zip}-small.jpg');
    }

    &.home {
      // 3
      background-image: url('../bundles/images/backgrounds/#{$zip}-large.jpg');
    }
  }
}
```

Thanks to the `$zips` list and the `@each` loop, we can make the whole process of assigning a specific background image depending on a class very simple. Also it gets damn simple to add/remove a zip-code: all we have to do is updating the list.

Okay. I believe this is a decent use case for a list. Now what about lists functions like `append` or `length`? Finding a good example is getting tricky, but I suppose we could take the one I recently talked about in [this article about star rating widget in Sass](https://hugogiraudel.com/2014/02/24/star-rating-system-with-sass/) where I build a selector out of a Sass list.

```scss
@for $i from 1 to 5 {
  $selector: ();

  @for $j from 1 through $i {
    $selector: append(
      $selector,
      unquote("[data-rating^='#{$i}'] .star-#{$j}"),
      comma
    );
  }

  #{$selector} {
    // CSS rules
  }
}
```

The code might be complex to understand so I suggest you read the related article. For instance, when `$i` is 4, the generated `$selector` would be:

```scss
[data-rate^='4'] .star-1, [data-rate^='4'] .star-2, [data-rate^='4'] .star-3, [data-rate^='4'] .star-4 { … }
```

Anyway, this is a valid usecase for `append` even if you could have worked around the problem using `@extend`.

Another use case would be building a CSS gradient from a Sass list of colors. I have an article ready about this; SitePoint will release it in the next few weeks. By the way, I provide another example for lists in my article about making [a Sass component in 10 minutes](https://www.sitepoint.com/sass-component-10-minutes/) at SitePoint where I use one to store various message types (alert, danger, info…) as well as a base color (orange, red, blue…). Probably one of my best write-up so far, be sure to have a look.

## Final thoughts

In most projects, Sass lists are not a game changer. They can be useful if properly used, but you can always do without. Now if you ask me, they are one of the most interesting feature in the whole language. Lists are arrays, and arrays are part of the core of any language. Once you get arrays and loops, you can do absolutely tons of stuff. However most of them won't be used in the average CSS project.

Long story short: lists are awesome, folks.
