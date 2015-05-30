---
layout: post
title: "Star-rating widget with Sass"
tags:
  - sass
  - star
  - rating
---

The other day, I was having a look at featured pens from CodePen to kill some time before getting a haircut. I ended up checking [a pen from Yelp Devs'](http://codepen.io/yelp/pen/aLxbG) (in the person of [Benjamin Knight](https://twitter.com/benjamin_knight)) in which they featured their star-rating system we can see pretty much all over their site.

<figure class="figure--right">
<img src="/images/stars-rating-widget-with-sass/rating-widget.png" alt="" />
<figcaption>Star-rating widget from Yelp</figcaption>
</figure>

I was both surprised and pleased to see they are using Sass for their CSS codebase, and more interestingly, they are using it pretty well if I may. Their code looked both logic and efficient so that was kind of a cool pen to look at.

Although after a couple of minutes digging into their code, I noticed the CSS output wasn't as good as it could be. A couple of minutes later, I submitted [a new verion](http://codepen.io/HugoGiraudel/pen/DqBkH) to them, taking care of a few optimizations they forgot.

Hence, a short blog post relating all this.

## What's the problem? 

First of all, the way they approach the whole widget is *very* clever. To deal with half-star ratings, they use left and right borders instead of background-color. This way, they can color only half of the background for a star. This is brilliant.

So the few things I noticed were definitely not about their idea but more the way they use Sass. The first and most obvious mistake is they output a rule for 5.5-stars rating which simply cannot exist since it goes from 1 to 5.

<pre class="language-css"><code>.rating-5-half .star-6 {
  border-left-color: #dd050b;
}</code></pre>

Next and probably the biggest flaws in their code, they got a lot of duplicated rules. It's not terrible but it could definitely be improved. Here is a little section of their output:

<pre class="language-css"><code>.rating-3 .star-1,
.rating-3-half .star-1 {
  border-color: #f0991e;
  background: #f0991e;
}

.rating-3 .star-2,
.rating-3-half .star-2 {
  border-color: #f0991e;
  background: #f0991e;
}

.rating-3 .star-3,
.rating-3-half .star-3 {
  border-color: #f0991e;
  background: #f0991e;
}</code></pre>

This is only for 3-stars ratings, but it's the same for other ratings as well. We could merge the selectors into one in order to have a single rule with only two declarations in there which would be much better.

Last but not least, their `stars-color` function returning a color based on a number (of stars) is repetitive and could be refactored.

<pre class="language-scss"><code>@function stars-color($num) {
  @if $num == 5 {
    @return #dd050b;
  } @else if $num == 4 {
    @return #f26a2c;
  } @else if $num == 3 {
    @return #f0991e;
  } @else if $num == 2 {
    @return #dcb228;
  } @else if $num == 1 {
    @return #cc8b1f;
  }
}</code></pre>

## Solving problems, one at a time 

### Moving to data-attributes

One thing I've been surprised to see is they use classes instead of data-attributes for their ratings. In my opinion the only valid option to do so is because you still have to support Internet Explorer 6 but I'm not sure Yelp does. So I decided to move everything to data-attributes.

<pre class="language-markup"><code>&lt;!-- No more -->
&lt;div class="rating rating-1-half">&lt;/div>

&lt;!-- Instead -->
&lt;div class="rating" data-rating="1.5">&lt;/div></code></pre>

There are two main reasons for this. The first one is it allows me to use data-attributes modulators to target both `x` and `x.y` by doing `data-rating^='x'`. This may seem insignificant but it makes a selector like `.rating-1 .star-1, .rating-1-half .star-1` turn into `[data-rating^='1'] .star-1`. Much shorter.

Another interesting about moving to data-attributes is it makes any JavaScript enhancement much lighter. Needless to say it's easier to parse a numeric data-attribute than to parse a string in class lists. But that's clearly out of the scope of this article though.

### Revamping the `stars-color` function

We'll start with the simplest thing we can do to improve the code: refactoring the `stars-color` function. My idea was to have a list of colors (sorted from the lowest rating to the best one) so we can pick a color from its index in the list. 

<pre class="language-scss"><code>@function stars-color($stars) {
  @if type-of($stars) != number {
    @warn '#{$stars} is not a number for `stars-color`.';
    @return false;
  }
  $colors: #cc8b1f #dcb228 #f0991e #f26a2c #dd050b;
  @return if($stars <= length($colors), nth($colors, $stars), #333);
}</code></pre>

Here we have a `$colors` Sass list containing 5 colors, the first being the color for 1 and 1.5 ratings, and the last for 5-stars ratings. The function accepts a single argument: `$stars` which is the rating. 

Then all we have to do is check if `$stars` is a valid index for `$colors`. If it is, we return the color at index `$stars`, else we return a default color (here `#333`). Simple and efficient.

<blockquote class="pull-quote--right">Always verify inputs from your functions.</blockquote>

Also note how we make our function secure by making sure `$stars` is a number. When building custom functions, always think about data validation. ;)

### Looping is fun, wheeee!

Yelp Devs are using nested loops to output their CSS. The outer loop goes from 1 through 5 and the inner one is going from 1 to the value of the outer loop. So during the first loop run of the outer loop, the inner loop will go from 1 through... 1. During the second, from 1 through 2, and so on.

Because it does the work well and is quite smart, I kept this as is. However I decided not to output anything in the inner loop and instead use it to build a compound selector to avoid duplicated CSS rules.

<pre class="language-scss"><code>@for $i from 1 to 5 {
  $color: stars-color($i);
  $selector: ();

  @for $j from 1 through $i {
    $selector: append(
      $selector, 
      unquote("[data-rating^='#{$i}'] .star-#{$j}"), 
      comma
    );
  }

  #{$selector} {
    border-color: $color;
    background: $color;
  }

  [data-rating='#{$i + 0.5}'] .star-#{$i + 1} {
    border-left-color: $color;
  }
}</code></pre>

This may look a little complicated but I can assure you it is actually quite simple to understand. First, we retrieve the color for the current loop run and store it in a `$color` variable to avoid having to get it multiple times. We also instanciate an empty list named `$selector` which will contain our generated selector.

Then we run the inner loop. As we've seen previously, the inner loop goes from 1 through `$i`, and it doesn't do much. The only thing that is going on inside the inner loop is appending a piece of selector to the selector list.

Once we get off the inner loop, we can use the generated selector to dump the rules. For instance, if `$i = 2`, `$selector` equals `[data-rating^='2'] .star-1, [data-rating^='2'] .star-2`. It succeeds in targeting stars 1 and 2 in ratings going from 1 to 2.5.

Last but not least, we need to deal with half-ratings. For this, we only have to dump a selector specifically targeting half ratings to have a result like this: `[data-rating='2.5'] .star-3`. Not that hard, is it?

### Dealing with 5-stars ratings

You may have noticed from the last code snippet the outer loop is not dealing with 5-stars rating because it goes from `1 to 5` (5 excluded) and not `1 through 5` (5 included). This is meant to be in order to optimize the CSS output for 5-stars rating.

There are 2 things that are different in this case:

1. There is no half-rating since 5.5 doesn't exist
2. There is no need to be specific since it's the maximum rating: we should color all the stars anyway

Then dealing with this case is as easy as writing:

<pre class="language-scss"><code>$color: stars-color(5);
[data-rating='5'] i {
  border-color: $color;
  background: $color;
}</code></pre>

## Final code 

To see how efficient those little optimizations have been, I've minified both demo:

* [Original](http://codepen.io/yelp/pen/aLxbG): 1.84Kb (2.38Kb unminified)
* [Mine](http://codepen.io/HugoGiraudel/pen/DqBkH): 1.05Kb (1.36Kb unminified)

And here is what the loops' output looks like in my case:

<pre class="language-css"><code>[data-rating^='1'] .star-1 {
  border-color: #cc8b1f;
  background: #cc8b1f;
}

[data-rating='1.5'] .star-2 {
  border-left-color: #cc8b1f;
}

[data-rating^='2'] .star-1,
[data-rating^='2'] .star-2 {
  border-color: #dcb228;
  background: #dcb228;
}

[data-rating='2.5'] .star-3 {
  border-left-color: #dcb228;
}

[data-rating^='3'] .star-1,
[data-rating^='3'] .star-2,
[data-rating^='3'] .star-3 {
  border-color: #f0991e;
  background: #f0991e;
}

[data-rating='3.5'] .star-4 {
  border-left-color: #f0991e;
}

[data-rating^='4'] .star-1,
[data-rating^='4'] .star-2,
[data-rating^='4'] .star-3,
[data-rating^='4'] .star-4 {
  border-color: #f26a2c;
  background: #f26a2c;
}

[data-rating='4.5'] .star-5 {
  border-left-color: #f26a2c;
}

[data-rating='5'] i {
  border-color: #dd050b;
  background: #dd050b;
}</code></pre>

Looks quite efficient, doesn't it?

## Final thoughts 

In the end, it's really not that much; saving 800 bytes is quite ridiculous. However I think it's interesting to see how we can use some features like Sass lists (often overlook by dervelopers) to improve CSS output.

Thanks to Sass lists and the `append` function, we have been able to create a selector from a loop and use this selector outside the loop to minimize the amount of CSS that is being compiled. This is definitely something fun doing, even if it needs to roll up the sleeves and hack around the code. 

Hope you liked the demo anyway folks. Cheers!

<p data-height="454" data-theme-id="0" data-slug-hash="DqBkH" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/HugoGiraudel/pen/DqBkH'>CSS Rating Stars</a> by Hugo Giraudel (<a href='http://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

*Update: be sure to check [this version](http://codepen.io/piouPiouM/pen/beBcJ) from Mehdi Kabab, using placeholders to make it slightler lighter (14 bytes after gzip... :D).*
