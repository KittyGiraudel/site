---
title: Items on circle with CSS
layout: post
codepen: true
preview: true
comments: false
---
<section>
<p>If you like to experiment or do a little bit of webdesign, then you have probably already tried to put elements on a circle. Unless you're a CSS hacker, you've probably set a class/ID per item, then used <code>left</code> and <code>top</code> accordingly to position everything around the circle.</p>
<img class='pull-image--right' alt='5 images positioned along a circle' src='/images/items-on-circle__5-items.png'>
<p>But in most cases, you would have ended doing this with JavaScript, or jQuery. There are plenty of <a href="http://addyosmani.com/blog/jquery-roundrr/">plugins</a> doing this out there, and no doubt they are all good.</p>
<p>But what if you could do it very simply with CSS? That's what <a href="http://stackoverflow.com/questions/12813573/position-icons-into-circle">Ana Tudor did in an answer on StackOverflow</a>. Instead of using basic positioning, she relies on chained CSS transforms to do it. God, this is brilliant. Well? Let's push it further.</p>
</section>
<section id="current-solution">
<h2>About the current solution <a href="#current-solution">#</a></h2>
<p>Ana's work is great, I'm not questioning this. However, adding or removing elements can be tricky. Before going any further, let's see how she does this:</p>
<blockquote><p>[...] You then decide on the angles at which you want to have your links with the images and you add a class deg{desired_angle} (for example deg0 or deg45 or whatever). Then for each such class you apply chained CSS transforms, like this:</p>
{% highlight css %}
.deg{desired_angle} {
   transform: 
   	rotate({desired_angle}) 
   	translate(12em) 
   	rotate(-{desired_angle});
}
{% endhighlight %}
<p>where you replace {desired_angle} with 0, 45, and so on...</p>
<p>The first rotate transform rotates the object and its axes, the translate transform translates the object along the rotated X axis and the second rotate transform brings back the object into position - <a href="http://dabblet.com/gist/3866686">demo to illustrate how this works</a>.</p></blockquote>
<p>Because Ana adds specific classes to HTML elements, it's not very fast to add or remove an element. It requires to add the according class to the new element, and change the name + CSS of all other classes to distribute evenly all items along the circle. Bummer.</p>
</section>
<section id="sass">
<h2>Sass to the rescue! <a href="#sass">#</a></h2>
<p>I was pretty sure I could do something cool and easy with Sass. Indeed, I ended with a mixin handling all the positioning automagically. Plus:</p>
<ul>
<li>You can define the number of items you want on the circle</li>
<li>You can use any element you want as child of the container, even different ones (<code>li</code>, <code>div</code>, <code>span</code>, <code>a</code>, <code>img</code>, whatever)</li>
<li>It only places items, not more not less: all the fancy stuff is up to you</li>
<li>It includes a small reset in order to allow you to use it on unordered lists</li>
<li>It takes care of vendor prefixes for you thanks to Compass</li>
<li>You can make the whole shit easily responsive with relative units</li>
<li>It's damn easy to use</li>
</ul>
<p>Here are the arguments you can pass to the mixin in order to suit your needs:</p>
<ol>
<li><code>$nbItems (integer)</code>: this is the number of items you want to distribute along the circle</li>
<li><code>$circleSize (length)</code>: this is the size of your circle</li>
<li><code>$itemSize (length)</code> (optional): this is the size of an item (default is <code>$circleSize / 4</code>)</li>
<li><code>$innerPadding (length|keyword)</code> (optional): this is the padding you want inside the main container (default is "none", also accepts "limited" and "strict" as values)</li>
</ol>
<p>Thus, usage is pretty straight forward:</p>
{% highlight css %}
.my-container {
	/* Without optional parameters 
	 * 8 items, 24em large container, 6em large items (24/4), no inner padding
	 */
	@include putOnCircle(8, 24em);

	/* With all parameters 
	 * 5 items, 500px large container, 7.2em large items, limited inner padding
	 */
	@include putOnCircle(5, 500px, 7.2em, limited);
}
{% endhighlight %}
<p class="note">If the number of items in the container is superior to the parameter given in the mixin, left children are nicely stacked on top of each other at the center of the parent, not breaking anything.</p>
</section>
<section id="how">
<h2>How does it work? <a href="#how">#</a></h2>
<p>It's pretty easy. It divides <code>360°</code> by the number of elements you ask for to compute the angle between 2 items. Then, it runs a @for loop using pseudo-selectors (<code>:nth-of-type()</code>) to assign the appropriate transforms to each element.</p>
{% highlight css %}
$rot: 0; /* Rotation angle for the current item */
$angle: 360 / $nbItems; /* Angle between two items */

@for $i from 1 to $nbItems+1 {

	&:nth-of-type(#{$i}) {
		transform: 
			rotate(#{$rot}deg)       /* Rotate the axis */
			translate($circleSize/2) /* Move the item from the center */ 
			rotate(-#{$rot}deg);     /* Rotate the item back to its default position */
	}

	$rot: $rot + $angle; /* Increments the $rot variable for next item */
}
{% endhighlight %}
<p>Outputs (with 8 items and a 24em large container)...</p>
{% highlight css %}
.container > *:nth-of-type(1) { transform: rotate(0deg)   translate(12em) rotate(-0deg);   }
.container > *:nth-of-type(2) { transform: rotate(45deg)  translate(12em) rotate(-45deg);  }
.container > *:nth-of-type(3) { transform: rotate(90deg)  translate(12em) rotate(-90deg);  }
.container > *:nth-of-type(4) { transform: rotate(135deg) translate(12em) rotate(-135deg); }
.container > *:nth-of-type(5) { transform: rotate(180deg) translate(12em) rotate(-180deg); }
.container > *:nth-of-type(6) { transform: rotate(225deg) translate(12em) rotate(-225deg); }
.container > *:nth-of-type(7) { transform: rotate(270deg) translate(12em) rotate(-270deg); }
.container > *:nth-of-type(8) { transform: rotate(315deg) translate(12em) rotate(-315deg); }
{% endhighlight %}
</section>
<section id="inner-padding">
<h2>About the inner padding <a href="#inner-padding">#</a></h2>
<p>The inner padding was probably the hardest thing to do. Here is the thing, if you don't set a padding on the container, the items are placed <strong>on</strong> the circle, meaning they are half in, half out. In most cases, that's what you want.</p>
<p>If you want items to be stricly inside the circle, then it's getting more complicated.</p>
<ul>
<li>If you are dealing with circular items, then the inner padding has to be half the size of an item in order to make them inside the containing circle. That's the easy one.</li>
<li>If you are dealing with squares however, it's getting waaaay more complicated. Indeed, the distance between the center of a square and one of its corner is <code>sqrt(2) * itemSize / 2</code> (thanks Ana). So in order to make squares stricly inside the container, the padding has to be equals to the above formula.</li>
</ul>
<p>Hopefully, Sass does it for us and you don't have to use your calculator every time you want to use the mixin. In fact, I even included keywords to ease the use if you don't want to set a custom inner padding:</p>
<ul>
<li><code>none</code> (default value): simply set padding to 0, placing items <strong>on</strong> the circle</li>
<li><code>limited</code>: put circular items inside the container, isn't enough for squares though</li>
<li><code>strict</code>: put any item inside the container</li>
</ul>
{% highlight css %}
@if $innerPadding == "none"    { $innerPadding: 0; }
@if $innerPadding == "limited" { $innerPadding: $halfImage; }
@if $innerPadding == "strict"  { $innerPadding: $halfImage * sqrt(2); }
{% endhighlight %}
</section>
<section id="legacy-browsers">
<h2>What about old browsers? <a href="#legacy-browsers">#</a></h2>
<p>There are two problems with this technic that prevent the mixin to works for older browsers:</p>
<ul>
<li>IE8- don't support pseudo-selectors (:nth-of-type())</li>
<li>IE9- don't support CSS transforms</li>
</ul>
<p>The first problem is easily fixed with either a plugin like <a href="">Selectivizr</a> to enable support for pseudo-selectors on old browsers or a little bit of JavaScript to add a numbered class to each child of the parent. Here is how I did it:</p>
{% highlight javascript %}
$('.parent').children().each(function() {
  $(this).addClass('item'+($(this).index() + 1));
});
{% endhighlight %}
<p>Then, the CSS would be slightly altered:</p>
{% highlight css %}
@for $i from 1 to $nbItems+1 {
	&:nth-of-type(#{$i}),
	&.item#{$i} {
		/* ... */
	}
}
{% endhighlight %}
<p>First problem solved. Not let's deal with the biggest one: IE9- don't support CSS transforms. Hopefully, we can draw a fallback that will make everything cool on these browsers as well using margin.</p>
<p>Basically, instead of rotating, translating then rotating back each element, we apply it top and left margin (sometimes negative) to place it on the circle.</p>
{% highlight css %}
$marginTop : sin($rot * pi() / 180) * $halfParent - $halfItem;
$marginLeft: cos($rot * pi() / 180) * $halfParent - $halfItem;
margin: $marginTop 0 0 $marginLeft;
{% endhighlight %}
<p>Yes, it's definitely not the easiest way to do it as it involves some complicated calculations (thanks Ana for the formulas), but it works like a charm!</p>
<p>To detect if the browser supports CSS transforms, we use Modernizr. If it does, we apply CSS transforms, if it doesn't, we apply margins. Consider the following structure:</p>
{% highlight css %}
@for $i from 1 to $nbItems+1 {
	&:nth-of-type(#{$i}),
	&.item#{$i} {
		.csstransforms {
			/* Use transforms */
		}

		.no-csstransforms {
			/* Use margins */
		}
	}
}
{% enhighlight %}
<p>Et voila! We now have a mixin working back to IE7 (maybe even 6) thanks to very little JavaScript. Isn't that nice?</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>That's all folks! If you have any suggestion to improve it, please be sure to share! Meanwhile, you can play with my <a href="http://codepen.io/HugoGiraudel/pen/Bigqr">demo</a> on CodePen.</p>
<pre class="codepen" data-height="550" data-type="result" data-href="Bigqr" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/Bigqr">Check out this Pen!</a></pre>
</section>