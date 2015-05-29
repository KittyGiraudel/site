---
codepen: true
layout: post
title: "Items on circle with CSS"
tags:
  - css
  - sass
  - mixin
---

If you like to experiment or do a little bit of webdesign, then you have probably already tried to put elements on a circle. Unless you're a CSS hacker, you've probably set a class/ID per item, then used `left` and `top` accordingly to position everything around the circle.

<figure class="figure--right">
<img alt='' src='/images/items-on-circle/5-items.png' />
<figcaption>5 images positioned along a circle with CSS</figcaption>
</figure>

But in most cases, you would have ended doing this with JavaScript, or jQuery. There are plenty of [plugins](http://addyosmani.com/blog/jquery-roundrr/) doing this out there, and no doubt they are all good.

But what if you could do it very simply with CSS? That's what [Ana Tudor did in an answer on StackOverflow](http://stackoverflow.com/questions/12813573/position-icons-into-circle). Instead of using basic positioning, she relies on chained CSS transforms to do it. God, this is brilliant. Well? Let's push it further.

## About the current solution

Ana's work is great, I'm not questioning this. However, adding or removing elements can be tricky. Before going any further, let's see how she does this:

> [...] You then decide on the angles at which you want to have your links with the images and you add a class deg{desired_angle} (for example deg0 or deg45 or whatever). Then for each such class you apply chained CSS transforms, like this:


<pre class="language-scss"><code>.deg{desired_angle} {
  transform: 
   	rotate({desired_angle}) 
   	translate({half_parent_size}) 
   	rotate(-{desired_angle});
}</code></pre>

...where you replace {desired_angle} with 0, 45, and so on...

> The first rotate transform rotates the object and its axes, the translate transform translates the object along the rotated X axis and the second rotate transform brings back the object into position - [demo to illustrate how this works](http://dabblet.com/gist/3866686).

Because Ana adds specific classes to HTML elements, it's not very fast to add or remove an element. It requires to add the according class to the new element, and change the name + CSS of all other classes to distribute evenly all items along the circle. Bummer.

## Sass to the rescue!

I was pretty sure I could do something cool and easy with Sass. Indeed, I ended with a mixin handling all the positioning automagically. Plus:

* You can define the number of items you want on the circle
* You can use any element you want as child of the container, even different ones (`li`, `div`, `span`, `a`, `img`, whatever)
* It only places items, not more not less: all the fancy stuff is up to you
* It includes a small reset in order to allow you to use it on unordered lists
* It takes care of vendor prefixes for you thanks to Compass
* It handles fallbacks for older browsers
* It's damn easy to use

Here are the arguments you can pass to the mixin in order to suit your needs:

1. `$nb-items (integer)`: this is the number of items you want to distribute along the circle
1. `$circle-size (length)`: this is the size of your circle
1. `$item-size (length)`: this is the size of an item
1. `$class-for-IE (string|false)` (optional): class used as a fallback for pseudo-selectors (default is false, meaning no fallback)

Thus, usage is pretty straight forward:

<pre class="language-scss"><code>.my-container {
	/* With no support for old IE 
	 */
	@include putOnCircle(8, 24em, 6em);
	@include putOnCircle(8, 24em, 6em, false);

	/* With support for old IE
	 * Using class "item" (.item1, .item2, .item3, etc.)
	 */
	@include putOnCircle(8, 24em, 6em, 'item');
}</code></pre>

*If the number of items in the container is superior to the parameter given in the mixin, left children are nicely stacked on top of each other at the center of the parent, not breaking anything.*

## How does it work?

It's pretty easy. It divides `360°` by the number of elements you ask for to compute the angle between 2 items. Then, it runs a @for loop using pseudo-selectors (`:nth-of-type()`) to assign the appropriate transforms to each element.

<pre class="language-scss"><code>$rot: 0; /* Rotation angle for the current item */
$angle: 360 / $nb-items; /* Angle between two items */

@for $i from 1 to $nb-items+1 {

	&:nth-of-type(#{$i}) {
		transform: 
			rotate(#{$rot}deg)       /* Rotate the axis */
			translate($circle-size/2) /* Move the item from the center */ 
			rotate(-#{$rot}deg);     /* Rotate the item back to its default position */
	}

	$rot: $rot + $angle; /* Increments the $rot variable for next item */
}</code></pre>

Outputs (with 8 items and a 24em large container)...

<pre class="language-css"><code>.container > *:nth-of-type(1) { transform: rotate(0deg)   translate(12em) rotate(-0deg);   }
.container > *:nth-of-type(2) { transform: rotate(45deg)  translate(12em) rotate(-45deg);  }
.container > *:nth-of-type(3) { transform: rotate(90deg)  translate(12em) rotate(-90deg);  }
.container > *:nth-of-type(4) { transform: rotate(135deg) translate(12em) rotate(-135deg); }
.container > *:nth-of-type(5) { transform: rotate(180deg) translate(12em) rotate(-180deg); }
.container > *:nth-of-type(6) { transform: rotate(225deg) translate(12em) rotate(-225deg); }
.container > *:nth-of-type(7) { transform: rotate(270deg) translate(12em) rotate(-270deg); }
.container > *:nth-of-type(8) { transform: rotate(315deg) translate(12em) rotate(-315deg); }</code></pre>

## What about old browsers?

The main problem with this technic is that **IE8- doesn't support pseudo-selectors and CSS transforms**.

The first thing is easily fixed either with a plugin like [Selectivizr](http://selectivizr.com/) to enable support for pseudo-selectors on old browsers or a little bit of JavaScript to add a numbered class to each child of the parent. Here is how I did it (with jQuery):

<pre class="language-javascript"><code>$('.parent').children().each(function() {
  $(this).addClass('item'+($(this).index() + 1));
});</code></pre>

Then, the CSS would be slightly altered:

<pre class="language-scss"><code>@for $i from 1 to $nb-items+1 {

	&.#{$class-for-IE}#{$i} {
		/* ... */
	}

}</code></pre>

First problem solved. Not let's deal with the biggest one: IE8- doesn't support CSS transforms. Hopefully, we can draw a fallback that will make everything cool on these browsers as well using margin.

Basically, instead of rotating, translating then rotating back each element, we apply it top and left margins (sometimes negative) to place it on the circle. Fasten your belt folks, the calculations are pretty insane:

<pre class="language-scss"><code>$margin-top : sin($rot * pi() / 180) * $half-parent - $half-item;
$margin-left: cos($rot * pi() / 180) * $half-parent - $half-item;
margin: $margin-top 0 0 $margin-left;</code></pre>

Yes, it's definitely not the easiest way to do it as it involves some complicated calculations (thanks Ana for the formulas), but it works like a charm!

Now how do we use all this stuff for IE8- without messing with modern browser stuff? I found that the easiest solution is to add a flag to the mixin: if it's turned on, then it means we need to support old IE, thus we use classes and margins. Else, we use transforms and pseudo-selectors. Consider the following structure:

<pre class="language-scss"><code>@mixin putOnCircle($nb-items, $circle-size, $item-size, $class-for-IE: false) {
	/* ... */
	@for $i from 1 to $nb-items+1 {
		
		/* If we don't plan on supporting old IE */
		@if $class-for-IE == false {
			&:nth-of-type(#{$i}) {
				/* Use transforms */
			}
		}

		/* If we plan on supporting old IE */
		@else {
			&.#{$class-for-IE}#{$i} {
				/* Use margins */
			}
		}
	}
}</code></pre>

Et voila! We now have a mixin working back to IE7 (maybe even 6) thanks to very little JavaScript. Isn't that nice?

## Final words

That's all folks! If you have any suggestion to improve it, please be sure to share! Meanwhile, you can play with my [demo](http://codepen.io/HugoGiraudel/pen/Bigqr) on CodePen.

<pre class="codepen" data-height="550" data-type="result" data-href="Bigqr" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/Bigqr">Check out this Pen!</a></pre>
