---
title: Sass mixin for offsets
layout: post
comments: true
---
<section>
<p>Over the last months, I have seen a ton of mixins to handle offsets when dealing with absolute / fixed / relative positioning. I also made a lot of them myself. And in the end, none of them really suited me. Either they were far too long or complicated, or the calling didn't feel right to me.</p>
<p>A couple of days ago I came with a fairly new solution (to me) and I must say I am pretty satisfied with it so far. I might stick with this mixin for the next projects. Thus, I wanted to share it with you guys.</p>
<p>But first, let's take a minute to think about what our mixin have to do:</p>
<ul>
<li>We shouldn't have to specify offsets we do not want to edit</li>
<li>We shouldn't be forced to respect a given order (like top - right - bottom - left)</li>
<li>It should handle errors and invalid inputs responsibly</li>
<li>What about syntaxic sugar?</li>
</ul>
</section>
<section id="mixin">
<h2>Building the mixin <a href="#mixin"></a></h2>
<p>What I always wanted to be able to is something like this:</p>
<pre class="language-scss"><code>.element {
	absolute: left 1em top 1.5em
}</code></pre>
<p>And this should output:</p>
<pre class="language-scss"><code>.element {
	position: absolute;
	left: 1em;
	top: 1.5em;
}</code></pre>
<p>Unfortunately, we cannot do something like this in Sass and won't probably ever be able to do so since we have no way to define custom properties. So let's try to do something close.</p>
<h3>The skeleton</h3>
<p>First, we will build the skeleton for our mixin. We seem to want to call our mixin with the keyword <em>absolute</em> so why not calling it <code>absolute</code>? And we pass it a list.</p>
<pre class="language-scss"><code>@mixin absolute($args) {
	/* Mixin stuff here */
}</code></pre>
<h3>Assembling the gears</h3>
<p>Now how does it work? Basically, you define the name of the offset you want to edit, and the next value is the value you want to assign to this offset. Then you repeat this for as many offsets as you want.</p>
<p>The first thing to do is to tell our mixin what are the keywords we want to check. Easiest thing to do so is to create a list inside our mixin:</p>
<pre class="language-scss"><code>@mixin absolute($args) {
	$offsets: top right bottom left;
	/* Order doesn't matter */
}</code></pre>
<p>Now, we will loop through the offsets and make three verifications:</p>
<ol>
<li>Check whether or not the offset is being listed in the <code>$args</code> list,</li>
<li>Make sure the index of an offset + 1 is lesser than or equal to the length of the list,</li>
<li>Make sure the value listed after an offset is a valid length/number.</li>
</ol>
<pre class="language-scss"><code>@mixin absolute($args) {
	$offsets: top right bottom left;

	@each $o in $offsets {
		$i: index($args, $o);

		@if $i 
		and $i + 1 <= length($args) 
		and type-of( nth($args, $i + 1) ) == number {
			#{$o}: nth($args, $i + 1);
		}
	}
}</code></pre>
<p>Okay, this might look quite complicated. Why don't we simply take it over with comments?</p>
<pre class="language-scss"><code>@mixin absolute($args) {
	/**
	 * List of offsets to check for in $args
 	 */
	$offsets: top right bottom left;

	/**
	 * We loop through $offsets to deal with them one by one
	 */
	@each $o in $offsets {

		/**
		 * If current offset found in $args
		 * assigns its index to $i
		 * Or `false` if not found
		 */
		$i: index($args, $o);

		/**
		 * Now we do the verifications
		 * 1. Is the offset listed in $args? (not false)
		 * 2. Is the offset value within the list range?
		 * 3. Is the offset value valid?
		 */
		@if $i                                      /* 1 */
		and $i + 1 <= length($args)                 /* 2 */
		and type-of( nth($args, $i + 1) ) == number /* 3 */ {

			/**
			 * If everything is okay
			 * We assign the according value to the current offset
			 */
			#{$o}: nth($args, $i + 1);
		}
	}
}</code></pre>
<p>I guess this is pretty clear now. Not quite hard in the end, is it?</p>
</section>
<section id="positions">
<h2> Dealing with other position types <a href="#positions"></a></h2>
<p>We now have to deal with <code>relative</code> and <code>fixed</code>. I guess we could duplicate the whole mixin 3 times and simple rename it but would it be the best solution? Definitely not.</p>
<p>Why don't we create a <em>private mixin</em> instead? Something that isn't meant to be called and only helps us for our internal stuff. To do so, I renamed the mixin <code>position()</code> and overloaded it with another argument: the position type.</p>
<p class="note">Note: you might want to rename it differently to avoid conflict with other mixins of your project. Indeed "position" is a quite common keyword.</p>
<pre class="language-scss"><code>@mixin position($position, $args) {
	/* Stuff we saw before */
	position: $position;
}</code></pre>
<p>And now, we create the 3 mixins we need: <code>absolute()</code>, <code>fixed()</code> and <code>relative()</code>.</p>
<pre class="language-scss"><code>@mixin absolute($args) {
	@include position(absolute, $args);
}

@mixin fixed($args) {
	@include position(fixed, $args);
}

@mixin relative($args) {
	@include position(relative, $args);
}</code></pre>
<p>Almost done. To indicate <code>position()</code> is a private mixin, I wanted to prefix it with something. I first thought about <code>private-position()</code> but it didn't feel great. In the end I went with <code>_position()</code>. Since I use hyphens to separate words in CSS, the underscore was unused. No risk of conflicts with anything in a project!</p>
<p class="note">Note: remember hyphens and underscores are treated the same way in Sass. It means <code>-position()</code> will work as well. This is meant to be: "hyphens or underscores" is only a matter of presentational preference.</p> 
</section>
<section id="usage">
<h2>Usage <a href="#usage"></a></h2>
<p>Using this mixin is pretty simple:</p>
<pre class="language-scss"><code>.element {
	@include absolute(top 1em right 10%);
}</code></pre>
<p>Outputs:</p>
<pre class="language-scss"><code>.element {
	position: absolute;
	top: 1em;
	right: 10%;
}</code></pre>
<p>Now, what if we try to do bad things like assigning no value to an offset, or an invalid value?</p>
<pre class="language-scss"><code>.element {
	@include absolute(top 1em left "HAHAHA!" right 10% bottom);
}</code></pre>
<p>In this case:</p>
<ul>
	<li><code>top</code> will be defined to <code>1em</code></li>
	<li><code>left</code> won't be set since we gave it a string</li>
	<li><code>right</code> will be defined to <code>10%</code></li>
	<li><code>bottom</code> won't be set since we didn't give it any value</li>
</ul>
<pre class="language-scss"><code>.element {
	position: absolute;
	top: 1em;
	right: 10%;
}</code></pre>
<p>Clean handling of errors and invalid inputs. Nice!</p>
<h3>Hoping for a better include in the future</h3>
<p>The only thing that still bother me quite a bit with this is we still have to write <code>@include</code> to call a mixin. It might seems ridiculous (especially given the speed at which we're able to press keys) but having to type an extra 8 characters can be annoying.</p>
<p>Hopefully, some day we will see a shorter way to call mixins in Sass. Indeed, someone already <a href="https://github.com/nex3/sass/issues/366">opened the issue</a> and the idea seems to have taken its way across minds including <a href="https://github.com/nex3/sass/issues/366#issuecomment-7559687">Chris Eppstein's</a>. The <code>+</code> operator has been proposed (as in the indented Sass syntax) but this could involve some issues when dealing with mixins with no-arguments + <code>@content</code> directive. Have a look at this:</p>
<pre class="language-scss"><code>abcd {
	+efgh {
		property: value;
	}
}</code></pre> 
<p>Is it supposed to mean <em>"assign <code>property: value</code> to a direct sibling <code>efgh</code> of <code>abcd</code>"</em> or <em>"call mixin <code>efgh</code> in <code>abcd</code>"</em>? Thus someone proposed <code>++</code> instead and it seems quite good so far. No idea when or if we will ever see this coming though. Let's hope. </a></p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words"></a></h2>
<p>I'm aware some of you won't like this. Some will say it is overly complicated, some will say it is useless and some will say their mixin is better. In no way this is a better way than an other. It simply suits my tastes. I like the way it works, and I like the way I can use it.</p>
<p>Anyway, you can fork and play around <a href="http://codepen.io/HugoGiraudel/pen/HDebE">this pen</a> if you feel so. And be sure to hit me if you ever need anything or want to propose something new. :)</p>
</section>