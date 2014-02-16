---
title: "CSS stars-rating widget with Sass"
layout: post
comments: false
preview: true
---
<section>
The other day, I was having a look at featured pens from CodePen to kill some time before getting a haircut. I ended up checking [a pen from Yelp Devs'](http://codepen.io/yelp/pen/aLxbG) in which they featured their star-rating system we can see pretty much all over their site.

I was both surprised and pleased to see they are using Sass for their CSS codebase, and more interestingly, they are using it pretty well if I may. Their code looked both logic and efficient so that was kind of a cool pen to look at.

Although after a couple of minutes digging into their code, I noticed the CSS output wasn't as good as it could be. A couple of minutes later, I submitted [a new verion](http://codepen.io/HugoGiraudel/pen/DqBkH) to them, taking care of a few optimizations they forgot.

Hence, a short blog post relating all this.
</section>
<section id="the-problem">
## What's the problem? [#](#the-problem)

First of all, the way they approach the whole widget is *very* clever. To deal with half-star ratings, they used left and right borders instead of background-color. This way, they can color only half of the background for a star. This is brilliant.

So the few things I noticed were definitely not about their idea but more the way they use Sass. The very first and most obvious mistake is they output a rule for 5.5-stars rating which simply cannot exist since it goes from 1 to 5.

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

This is only for 3-stars ratings, but it's the same for other ratings as well. We could merge the selectors into one in order to have a single rule with only two declarations in there. That would be much better.

Last but not least, their `stars-color` function returning a color based on a number (of stars) is kind of repetitive and could be refactored in a much simpler and smarter way with a Sass lists.

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
</section>
<section id="solving">
## Doing some trickery to solve problems [#](#solving)

### Moving to data-attributes

One thing I've been surprised to see is they use classes instead of data-attributes for their ratings. In my opinion the only valid option to do so is because you still have to support Internet Explorer 6 but I'm not sure Yelp does. So I decided to move everything to data-attributes.

Instead of having classes like `rating-1` or `rating-4-half`, I have things like this: `data-rating='1'` and `data-rating='4.5'`.

There are two main reasons for this. The first one is it allows me to use data-attributes modulators to target both `x` and `x.y` by doing `data-rating^='x'`. This may seem insignificant but it makes a selector like `.rating-1 .star-1, .rating-1-half .star-1` turn into `[data-rating^='1'] .star-1`. Much shorter.

### Revamping the `stars-color` function

We'll start with the simplest thing we can do to improve the code: refactoring the `stars-color` function. My idea was to have a list of colors (sorted from the lowest rating to the best one) so we can pick a color from its index in the list. 

<pre class="language-scss"><code>@function stars-color($stars) {
  @if type-of($stars) != number {
    @warn '#{$stars} is not a number of `stars-color`.';
    @return false;
  }
  $colors: #cc8b1f #dcb228 #f0991e #f26a2c #dd050b;
  @return if($stars <= length($colors), nth($colors, $stars), #333);
}</code></pre>

Here we have a `$colors` Sass list containing 5 colors, the first being the color for 1 and 1.5 ratings, and the last for 5-stars ratings. The function accepts a single argument: `$stars` which is the rating. 

Then all we have to do is check if `$stars` is a valid index for `$colors`. If it is, we return the color at index `$stars`, else we return a default color (here `#333`). Simple and efficient.

### Rethinking the looping

Yelp Devs are using nested loops to output their CSS. The outer loop goes from 1 through 5 and the inner one is going from 1 to the value of the outer loop. So during the first loop run of the outer loop, the inner loop will go from 1 through... 1. During the second, from 1 through 2, and so on.

Because this works very well and is quite smart, I kept this as is. However I decided not to output anything in the inner loop and instead use it to build a compound selector so we avoid duplicated CSS rules.

<pre class="language-scss"><code>@for $i from 1 to 5 {
  $color: stars-color($i);
  $selector: ();

  @for $j from 1 through $i {
    $selector: append($selector, unquote("[data-rate^='#{$i}'] .star-#{$j}"), comma);
  }

  #{$selector} {
    border-color: $color;
    background: $color;
  }

  [data-rate='#{$i + 0.5}'] .star-#{$i + 1} {
    border-left-color: $color;
  }
}</code></pre>

This may look a little complicated but I can assure you it is actually quite simple to understand. First, we retrieve the color for the current loop run and store it in a `$color` variable to avoid having to get it multiple times. We also instanciate an empty list named `$selector` which will contain our generated selector.

Then we run the inner loop. As we've seen previously, the inner loop goes from 1 through `$i`, and it doesn't do much. The only thing that is going on inside the inner loop is appending a piece of selector to the selector list.

Once we get off the inner loop, we can use the generated selector to dump the rules. For instance, if `$i = 2`, `$selector` equals `[data-rate^='2'] .star-1, [data-rate^='2'] .star-2`. It succeeds in targeting stars 1 and 2 in ratings going from 1 to 2.5.

Last but not least, we need to deal with half-ratings. For this, we only have to dump a selector targeting specifically half ratings like to have a result like this: `[data-rate='2.5'] .star-3`. Not that hard, is it?

So in the end, we end up with this CSS output:

### Dealing with 5-stars ratings

You may have noticed from the last code snippet the outer loop is not dealing with 5-stars rating because it goes from `1 **to** 5` (5 excluded) and not `1 **through** 5` (5 included). This is meant to be in order to optimize the CSS output for 5-stars rating.

There are 2 things that are different in this case:

1. There is no half-rating since 5.5 doesn't exist
2. There is no need to be specific since it's the maximum rating: if it's 5, then we should color all the stars anyway

Then dealing with this case is as easy as using:

<pre class="language-scss"><code>$color: stars-color(5);
[data-rate='5'] i {
  border-color: $color;
  background: $color;
}</code></pre>
</section>
<section id="css-output">
## Final code [#](#css-output)

To see how efficient those little optimizations have been, I've minified both demo:

* Original: 2379 bytes (1840 minified)
* Mine: 1363 bytes (1056 minified)

And here is what the loops output in my case:

<pre class="language-css"><code>[data-rate^='1'] .star-1 {
  border-color: #cc8b1f;
  background: #cc8b1f;
}

[data-rate='1.5'] .star-2 {
  border-left-color: #cc8b1f;
}

[data-rate^='2'] .star-1,
[data-rate^='2'] .star-2 {
  border-color: #dcb228;
  background: #dcb228;
}

[data-rate='2.5'] .star-3 {
  border-left-color: #dcb228;
}

[data-rate^='3'] .star-1,
[data-rate^='3'] .star-2,
[data-rate^='3'] .star-3 {
  border-color: #f0991e;
  background: #f0991e;
}

[data-rate='3.5'] .star-4 {
  border-left-color: #f0991e;
}

[data-rate^='4'] .star-1,
[data-rate^='4'] .star-2,
[data-rate^='4'] .star-3,
[data-rate^='4'] .star-4 {
  border-color: #f26a2c;
  background: #f26a2c;
}

[data-rate='4.5'] .star-5 {
  border-left-color: #f26a2c;
}

[data-rate='5'] i {
  border-color: #dd050b;
  background: #dd050b;
}</code></pre>

Looks quite efficient, doesn't it?
</section>
<section id="final-thoughts">
## Final thoughts [#](#final-thoughts)

In the end, it's really not that much; saving 800 bytes is ridiculous. Also the point was not to blame Yelp Devs at all. I think I wanted to show how we can use some often overlooked features from Sass like lists to improve CSS rendering.

Thanks to Sass lists and the `append` function, we have been able to create a selector from a loop and use this selector outside the loop to minimize the amount of CSS that is being compiled. This is definitely something fun doing, even if it needs to roll up the sleeves and hack around the code. 

Hope you liked the demo anyway folks. Cheers!
</section>