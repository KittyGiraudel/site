---
layout: post
sassmeister: true
title: "Automating CSS animations with Sass"
---

The other day, [Harry Roberts](https://twitter.com/csswizardry) featured a snippet of code from his own site [on Twitter](https://twitter.com/csswizardry/status/489038580128686081), asking for some ways to improve it (if any). What Harry did was computing by hand the keyframes of a carousel animation, thus claiming that high school algebra indeed **is** useful.

> “Why do we have to learn algebra, Miss? We’re never going to use it…”
> &mdash;Everyone in my maths class
> [bit.ly/UaM2wf](http://bit.ly/UaM2wf)

## What’s the idea?

As far as I can see, Harry uses a carousel to display quotes about his work on his [home page](http://csswizardry.com). Why use JavaScript when we can use CSS, right? So he uses a CSS animation to run the carousel. That sounds like a lovely idea, until you have to compute keyframes…

Below is [Harry’s comment](https://github.com/csswizardry/csswizardry.github.com/blob/5e8de0bcdd845c1fc46d622a1c605af89ac13208/css/_components.carousel.scss#L42-L87) in his carousel component:


> Scroll the carousel (all hard-coded; yuk!) and apply a subtle blur to imply motion/speed. Equation for the carousel’s transitioning and delayed points in order to complete an entire animation (i.e. 100%):
>
> <img style="display: block; margin: 0 0 1em 0; float: none; max-width: 100%;" alt='Carousel formula' src='/images/automating-css-animations-with-sass__formula-1.png' />
>
> where <var>n</var> is the number of slides, <var>x</var> is the percentage of the animation spent static, and <var>y</var> is the percentage of the animation spent animating.
>
> This carousel has five panes, so:
>
> <img style="display: block; margin: 0 0 1em 0; float: none; max-width: 100%;" alt='5 frames' src='/images/automating-css-animations-with-sass__formula-2.png' />
>
> To work out <var>y</var> if we know <var>n</var> and decide on a value for <var>x</var>:
>
> <img style="display: block; margin: 0 0 1em 0; float: none; max-width: 100%;" alt='Formula to find Y' src='/images/automating-css-animations-with-sass__formula-3.png' />
>
> If we choose that <var>x</var> equals 17.5 (i.e. a frame spends 17.5% of the animation’s total time *not* animating), and we know that <var>n</var> equals 5, then <var>y</var> = 3.125:
>
> <img style="display: block; margin: 0 0 1em 0; float: none; max-width: 100%;" alt='Y when X equals 17.5' src='/images/automating-css-animations-with-sass__formula-4.png' />
>
> Static for 17.5%, transition for 3.125%, and so on, until we hit 100%.
>
> If we were to choose that <var>x</var> equals 15, then we would find that <var>y</var> equals 6.25:
>
> <img style="display: block; margin: 0 0 1em 0; float: none; max-width: 100%;" alt='Y when X equals 15' src='/images/automating-css-animations-with-sass__formula-5.png' />
>
> If <var>y</var> comes out as zero-or-below, it means the number we chose for <var>x</var> was too large: pick again.
>
> N.B. We also include a halfway point in the middle of our transitioning frames to which we apply a subtle blur. This number is derived from:
>
> <img style="display: block; margin: 0 0 1em 0; float: none; max-width: 100%;" alt='Computing a halfway point' src='/images/automating-css-animations-with-sass__formula-6.png' />
>
> where <var>a</var> is the frame in question (out of <var>n</var> frames). The halfway point between frames 3 and 4 is:
>
> <img style="display: block; margin: 0 0 1em 0; float: none; max-width: 100%;" alt='Halfway point between frames 3 and 4' src='/images/automating-css-animations-with-sass__formula-7.png' />
>
> I’m pretty sure this is all a mess. To any kind person reading this who would be able to improve it, I would be very grateful if you would advise :)

And the result is:

<pre class="language-css"><code>@keyframes carousel {
  0% {
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }
  17.5% {
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }
  19.0625% {
    filter: blur(2px);
  }
  20.625% {
    transform: translate3d(-20%, 0, 0);
    filter: blur(0);
  }
  38.125% {
    transform: translate3d(-20%, 0, 0);
    filter: blur(0);
  }
  39.6875% {
    filter: blur(2px);
  }
  41.25%   {
    transform: translate3d(-40%, 0, 0);
    filter: blur(0);
  }
  58.75%   {
    transform: translate3d(-40%, 0, 0);
    filter: blur(0);
  }
  60.3125% {
    filter: blur(2px);
  }
  61.875%  {
    transform: translate3d(-60%, 0, 0);
    filter: blur(0);
  }
  79.375%  {
    transform: translate3d(-60%, 0, 0);
    filter: blur(0);
  }
  80.9375% {
    filter: blur(2px);
  }
  82.5%    {
    transform: translate3d(-80%, 0, 0);
    filter: blur(0);
  }
  100%     {
    transform: translate3d(-80%, 0, 0);
    filter: blur(0);
  }
}</code></pre>

Holy moly!

## Cleaning the animation

Before even thinking about Sass, let's lighten the animation a little bit. As we can see from the previous code block, some keyframes are identical. Let's combine them to make the whole animation simpler:

<pre class="language-css"><code>@keyframes carousel {
  0%,
  17.5% {
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }

  19.0625% {
    filter: blur(2px);
  }

  20.625%,
  38.125% {
    transform: translate3d(-20%, 0, 0);
    filter: blur(0);
  }

  39.6875% {
    filter: blur(2px);
  }

  41.25%,
  58.75% {
    transform: translate3d(-40%, 0, 0);
    filter: blur(0);
  }

  60.3125% {
    filter: blur(2px);
  }

  61.875%,
  79.375% {
    transform: translate3d(-60%, 0, 0);
    filter: blur(0);
  }

  80.9375% {
    filter: blur(2px);
  }

  82.5%,
  100% {
    transform: translate3d(-80%, 0, 0);
    filter: blur(0);
  }
}</code></pre>

Fine! That's less code to output.

## Bringing Sass in the game

Keyframes are typically the kind of things you can optimize. Because they are heavily bound to numbers and loop iterations, it is usually quite easy to generate a repetitive `@keyframes` animation with a loop. Let's try that, shall we?

First, bring the basics. For sake of consistency, I kept Harry's variable names: `n`, `x` and `y`. Let's not forget their meaning:

* `$n` is the number of frames in the animation
* `$x` is the percentage of the animation spent static for each frame. Logic wants it to be less than `100% / $n` then.
* `$y` is the percentage of the animation spent animation for each frame.

<pre class="language-scss"><code>$n: 5;
$x: 17.5%;
$y: (100% - $n * $x) / ($n - 1);</code></pre>

Now, we need to open the `@keyframes` directive, then a loop.

<pre class="language-scss"><code>@keyframes carousel {
  @for $i from 0 to $n { // 0, 1, 2, 3, 4
    // Sass Magic
  }
}</code></pre>

Inside the loop, we will use Harry's formulas to compute each pair of identical keyframes (for instance, 41.25% and 58.75%):

<pre class="language-scss"><code>$current-frame: ($i * $x) + ($i * $y);
$next-frame: (($i + 1) * $x) + ($i + $y);</code></pre>

*Note: braces are completely optional here, we just use them to keep things clean.*

And now, we use those variables to generate a keyframe inside the loop. Let's not forget to interpolate them so they are correctly output in the resulting CSS (more informations about [Sass interpolation on Tuts+](http://webdesign.tutsplus.com/tutorials/all-you-ever-need-to-know-about-sass-interpolation--cms-21375)).

<pre class="language-scss"><code>#{$current-frame, $next-frame} {
  transform: translateX($i * -100% / $frames);
  filter: blur(0);
}</code></pre>

Quite simple, isn't it? For the first loop run, this would output:

<pre class="language-css"><code>0%, 17.5% {
  transform: translate3d(0%, 0, 0);
  filter: blur(0);
}</code></pre>

All we have left is outputing what Harry calls *an halfway frame* to add a little blur effect. Then again, we'll use his formula to compute the keyframe selectors:

<pre class="language-scss"><code>$halfway-frame: $i * ($x / 1%) + ($i - 1) * $y + ($y / 2);

#{$halfway-frame} {
  filter: blur(2px);
}</code></pre>

Oh-ho! We got an error here!

> Invalid CSS after "": expected keyframes selector (e.g. 10%), was "-1.5625%"

As you can see, we end up with a negative keyframe selector. This is prohibited by the [CSS specifications](http://www.w3.org/TR/css3-animations/#keyframes) and Sass considers this a syntax error so we need to make sure this does not happen. Actually, it only happens when `$i` is `0`, so basically on first loop run. An easy way to prevent this error from happening is to condition the output of this rule to the value of `$i`:

<pre class="language-scss"><code>@if $i > 0 {
  #{$halfway-frame} {
    filter: blur(2px);
  }
}</code></pre>

Error gone, all good! So here is how our code looks so far:

<pre class="language-scss"><code>$n: 5;
$x: 17.5%;
$y: (100% - $n * $x) / ($n - 1);

@keyframes carousel {
  @for $i from 0 to $n {
    $current-frame: ($i * $x) + ($i * $y);
    $next-frame: (($i + 1) * $x) + ($i + $y);

    #{$current-frame, $next-frame} {
      transform: translate3d($i * -100% / $frames, 0, 0);
    }

    $halfway-frame: $i * ($x / 1%) + ($i - 1) * $y + ($y / 2);

    @if $i > 0 {
      #{$halfway-frame} {
        filter: blur(2px);
      }
    }
  }
}</code></pre>

## Pushing things further with a mixin

So far so good? It works pretty well in automating Harry's code so he does not have to compute everything from scratch again if he ever wants to display &mdash;let's say&mdash; 4 slides instead of 5, or wants the animation to be quicker or longer.

But we are basically polluting the global scope with our variables. Also, if he needs another carousel animation elsewhere, we will need to find other variable names, and copy the whole content of the animation into the new one. That's definitely not ideal.

So we have variables and possible duplicated content: [perfect case for a mixin](http://www.sitepoint.com/sass-mixin-placeholder/)! In order to make things easier to understand, we will replace those one-letter variable names with actual words if you don't mind:

* `$n` becomes `$frames`
* `$x` becomes `$static`
* `$y` becomes `$animating`

Also, because a mixin can be called several times with different arguments, we should make sure it outputs different animations. For this, we need to add a 3rd parameter: the animation name.

<pre class="language-scss"><code>@mixin carousel-animation($frames, $static, $name: 'carousel') {
  $animating: (100% - $frames * $static) / ($frames - 1);

  // Moar Sass
}</code></pre>

Since it is now a mixin, it can be called from several places: probably the root level, but there is nothing preventing us from including it from within a selector. Because `@`-directives need to be stand at root level in CSS, we'll use `@at-root` from Sass to make sure the animation gets output at root level.

<pre class="language-scss"><code>@mixin carousel-animation($frames, $static, $name: 'carousel') {
  $animating: (100% - $frames * $static) / ($frames - 1);

  @at-root {
    @keyframes #{$name} {
      // Animation logic here
    }
  }
}</code></pre>

Rest is pretty much the same. Calling it is quite easy now:

<pre class="language-scss"><code>@include carousel-animation(
  $frames: 5,
  $static: 17.5%
);</code></pre>

Resulting in:

<pre class="language-css"><code>@keyframes carousel {
  0%, 17.5% {
    transform: translateX(0%);
    filter: blur(0);
  }
  19.0625% {
    filter: blur(2px);
  }
  20.625%, 38.125% {
    transform: translateX(-20%);
    filter: blur(0);
  }
  39.6875% {
    filter: blur(2px);
  }
  41.25%, 58.75% {
    transform: translateX(-40%);
    filter: blur(0);
  }
  60.3125% {
    filter: blur(2px);
  }
  61.875%, 79.375% {
    transform: translateX(-60%);
    filter: blur(0);
  }
  80.9375% {
    filter: blur(2px);
  }
  82.5%, 100% {
    transform: translateX(-80%);
    filter: blur(0);
  }
}</code></pre>

Mission accomplished! And if we want another animation for the contact page for instance:

<pre class="language-scss"><code>@include carousel-animation(
  $name: 'carousel-contact',
  $frames: 3,
  $static: 20%
);</code></pre>

Pretty neat, heh?

## Final thoughts

That's pretty much it. While Harry's initial code is easier to read for the human eye, it's really not ideal when it comes to maintenance. That's where Sass can comes in handy, automating the whole thing with calculations and loops. It does make the code a little more complex, but it also makes it easier to maintain and update for future use cases.

You can play with the code on SassMeister:

<p class="sassmeister" data-gist-id="b657072d11c527f3a016" data-height="480"><a href="http://sassmeister.com/gist/b657072d11c527f3a016">Play with this gist on SassMeister.</a></p>
