---
published: true
layout: post
comments: false
preview: true
summary: true
title: Digging into my slides about Sass
---

<section>
<p>As you may know, I have been <a href=”#”>speaking at KiwiParty</a> about Sass in late June. It has been a really great experience and people were really receptive even if my talk was a bit technical.</p>
<p>Because slides are not very self-explanatory, I think it might be cool to dig deep into the topic with expanded explanations, so that everybody can now fully understand what I was trying to explain. :D</p>
<p>Just for your information, here are my slides in French powered by <a href=”http://slid.es”>Reveal.js</a>:</p>
%PUT SLIDES%
</section>
<section id=”introduction”>
<h2>What is Sass? <a href=”#introduction”>#</a></h2>
<p>I’ll skip the part where I introduce myself, I don’t think it has much point here. Instead, I’ll go straight to the introduction to explain what is a CSS preprocessor.</p>
<p>Sass -and pretty much any preprocessor- is a program aiming at extending a language in order to provide further features or a simplified syntax (or both). You can think of Sass as an extension of CSS; it adds to CSS what CSS doesn’t have and what CSS needs (or might need).</p>
<p>Among other things, Sass can be very useful for:</p>
<ul>
<li><strong>Variables</strong>: it’s been a while since we first asked for variables in CSS. They’ll come native some day but meanwhile, we have to rely on CSS preprocessors.</li>
<li><strong>Nesting</strong>: it is the ability to nest rules within each others to create expanded CSS selectors. Can be very interesting to avoid code repetition. Remember the <a href=”http://thesassway.com/beginner/the-inception-rule”>inception rule though</a>.</li>
<li><strong>Functions</strong>: I don’t think functions deserve an explanation. Give it parameters, it returns a value you can store in a variable or use as a value.</li>
<li><strong>Mixins</strong>: same as functions except it outputs code instead of returning a result. Very useful to output chuncks of code depending on some parameters (mixin arguments).</li>
<li><strong>Color functions</strong>: every preprocessor nowadays comes with a bunch of functions to ease color management (lighten, darken, transparentize, mix, complementary…). Very cool to avoid repeated back-and-forths between the IDE and Photoshop and having 50 shades of grey when you only need one (see what I did there?). Also easier to read than hexadecimal in my opinion.</li>
<li><strong>File concatenation</strong>: we often want to split our large stylesheets into several smaller ones but doing so increases the number of HTTP requests, thus the time the page need to load. Sass makes this possible: multiple files in production environment, one single file compressed in production.</li>
<li>And it’s also very cool for a bunch of other things like responsive web design, modular architecture, calculations, namespaces, and so much more...</li>
</ul>
<p>All of this is awesome. But when you just get started with Sass, you don’t really know what to do. So you declare a couple of variables, maybe make a mixin or two that you don’t really need and that’s pretty much it.</p>
<p>My talk aimed at giving some hints to get started with Sass, along with a collection of usecases and code snippets to show how to push stylesheets to an upper level.</p>
</section>
<section id=”extend”>
<h2>@extend and abstract classes <a href=”#extend”>#</a></h2>
<p>The <code>@extend</code> feature has to be the one which made Sass so popular compared to other CSS preprocessors including Less. Basically, you can make a selector inherits styles from another selector. It comes with abstract classes (also called placeholders), classes prefixed by a <code>%</code> symbol instead of a dot, that are not compiled in the final stylesheet, thus that cannot be used in the markup. Their use is exclusive to the stylesheet.</p>
{% highlight css %}
%clearfix:after {
	content: ‘’;
	display: table;
	clear: both;
}

.element {
	@extend %clearfix;
}
{% endhighlight %}
<p>Outputs:</p>
{% highlight css %}
.element:after {
	content: ‘’;
	display: table;
	clear: both;
}
{% endhighlight %}
<p>This example shows how we can use <code>@extend</code> and placeholders in a very basic way. We can think of a slightly more complex usecase: some kind of message module. If you’re familiar with Twitter Bootstrap, then you’ll easily get what this is about: having a pattern for all types of message, then differenciate them based on their color chart (green for OK, red for error, yellow for warning, blue for information).</p>
<p>With vanilla CSS, you have 3 ways to do this:</p>
<ol>
<li>Create a <code>.message</code> class containing styles shared by all messages, then a class per message type. Pretty cool, no style repeated but you have to add two classes to your elements (<code>.message</code> and <code>.message-error</code>. Less cool.</li>
<li>Targets all messages with an attribute selector like <code>[class^=”message-”]</code>. Clever, but attribute selectors are quite greedy peformance-speaking. Probably what I would do without Sass anyway.</li>
<li>You do it the jerk way with only 4 classes, repeating the shared styles in each of them. Not cool at all.</li>
</ol>
<p>Let’s see how we can Sass it:</p>
{% highlight css %}
%message {
	/* shared styles */
}
.message-error {
	/* error-only styles */
}
.message-ok {
	/* ok-only styles */
}
.message-warn {
	/* warn-only styles */
}
.message-info {
	/* info-only styles */
}
{% endhighlight %}
<p>Outputs:</p>
{% highlight css %}
.message-error, .message-ok, .message-warn, .message-info {
	/* shared styles */
}
.message-error {
	/* error-only styles */
}
.message-ok {
	/* ok-only styles */
}
.message-warn {
	/* warn-only styles */
}
.message-info {
	/* info-only styles */
}
{% endhighlight %}
<p>No styles repeated, no heavy selector, only one class assigned in the markup. Pretty neat. And this is only a very easy example of what you can do with <code>@extend</code> and placeholders. Feel free to think of clever usecases as well.</p>
</section>
<section id=”rem”>
<h2>Sass and REM <a href=”#rem”>#</a></h2>
<p>REM (root EM) is awesome. Problem is IE8 doesn’t understand it, and we cannot cross it out of our support chart. We have to deal with it. Thankfully, it is simple enough to provide IE8 a fallback for REM: give it a PX value.</p>
<p>But duplicating every <code>font-size</code> declaration can be tedious and converting REM to PX can be annoying. Let’s do it with Sass!</p>
{% highlight css %}
@mixin rem($value, $base: 16) {
	font-size: $value + “px”;
	font-size: $value / $base + “rem”;
}

.element {
	@include rem(24);
}
{% endhighlight %}
<p>Outputs:</p>
{% highlight css %}
.element {
	font-size: 24px;
	font-size: 1.5rem;
}
{% endhighlight %}
<p>Calculations and fallbacks are handled by Sass. What about pushing things a little further by enabling some sort of flag for IE8 instead of always outputing the PX line? Let’s say you are using this in a constantly evolving project or in a library or something. You might want to easily enable or disable IE8 support.</p>
<p>Simple enough: wrap the PX line in a conditional statement (<code>@if</code>) depending on a boolean you initialize either at the top of your stylesheet or in a configuration file.</p>
{% highlight css %}
$support-IE8: false;

@mixin rem($value, $base: 16) {
	@if $support-IE8 {
		font-size: $value + “px”;
	}

	font-size: $value / $base + “rem”;
}

.element {
	@include rem(24);
}
{% endhighlight %}
<p>Outputs:</p>
{% highlight css %}
.element {
	font-size: 1.5rem;
}
{% endhighlight %}
</section>
<section id=”mq”>
<h2>Media queries made easy <a href=”#mq”>#</a></h2>
<p>I don’t know for you but I don’t really like manipulating media queries. The syntax isn’t very typing-friendly, they require values, braces and all. Plus, I really like to manage breakpoints with keywords instead of values. Sass makes it happening; please consider the following mixin.</p>
{% highlight css %}
@mixin mq($keyword) {
	@if $keyword == small {
		@media (max-width: 48em) { @content; }
	}
	@if $keyword == medium {
		@media (max-width: 58em) { @content; }
	}
	/* … */
}
{% endhighlight %}
<p>When I want to declare alternative styles for a given breakpoint, I call the <code>mq()</code> mixin with the according keyword as argument like <code>@include mq(small) { … }</code>.</p>
<p>I like to name my breakpoints “small/medium/large” but you can chose whatever pleases you: “mobile/tablet/desktop”, “baby-bear/mama-bear/papa-bear”...</p>
<p>We can even push things further by adding retina support to the mixin (based on <a href=”https://github.com/kaelig/hidpi”>HiDPI from Kaelig</a>):</p>
{% highlight css %}
@mixin mq($keyword) {
	/* … */
	@if $keyword == retina {
		@media 
only screen and (-webkit-min-device-pixel-ratio: 1.3)
			only screen and (min-resolution: 124.8dpi)
			only screen and (min-resolution: 1.3dppx) {
				@content;
		}
	}
}
{% endhighlight %}
<p>We can now safely use this mixin as below:</p>
{% highlight css %}
.element {
	/* regular styles */
	@include mq(small) {
		/* small-screen styles */
	}
	@include mq(retina) {
		/* retina-only styles */
	}
}
{% endhighlight %}
<p>Outputs:</p>
{% highlight css %}
.element {
	/* regular styles */
}

@media (max-width: 48em) {
	{
		/* small-screen styles */
	}
}

@media only screen and (-webkit-min-device-pixel-ration: 1.3),
	only screen and (min-resolution: 124.8dpi),
	only screen and (min-resolution: 1.3dppx) {
		.element {
			/* retina-only styles */
		}
}
{% endhighlight %}
<p>The Sass way makes it way easier to debug and update in my opinion; lisibility is well preserved since alternative styles are based on keywords instead of arbitrary values.</p>
</section>
<section id=”grid”>
<h2>Simple responsive grid with Sass <a href=”#grid”>#</a></h2>
<p>Nowadays, using a grid system to build a responsive website has become a standard. There are a bunch of amazing grid systems out there, but sometimes <a href=”http://css-tricks.com/dont-overthink-it-grids/”>you just wan’t to build your own</a>. Especially when you don’t need a whole Rube Goldberg machine for your simple layout. Let’s see how we can build a very simple grid system in Sass in about 12 lines:</p>
{% highlight css %}
/* Your variables */
$nb-columns : 6; 
$wrap-width : 1140px; 
$column-width : 180px; 

/* Calculations */
$gutter-width : ($wrap-width - $nb-columns * $column-width) / $nb-columns; 
$column-pct : ($column-width / $wrap-width) * 100; 
$gutter-pct : ($gutter-width / $wrap-width) * 100; 

/* One single mixin */
@mixin cols($cols) { 
width: $column-pct * $cols + $gutter-pct * ($cols - 1) + unquote('%'); 
margin-right: $gutter-pct + unquote('%'); 
float: left; 

@media screen and (max-width: 400px) { 
width: 100%; 
margin-right: 0; 
} 
}
{% endhighlight %}
<p>Now let’s see what the code does exactly:</p>
<ul>
<li>You have to define the number of columns you want your grid to be based on, the max-width of your container and the width of a column.</li>
<li>Gutter width will be automagically calculated based on the 3 values you previously set.</li>
<li>Then, you call the mixin and pass the number of columns you want your element to expand on as an argument.</li>
</ul>
<p>And there you have a very simple yet responsive Sass grid.</p>
</section>
<section id=”counters”>
<h2>CSS counters and Sass <a href=”#counters”>#</a></h2>
<p>CSS counters are part of a CSS2 module (and not CSS3 as it is often claimed) making items numbering possible with CSS only. The main idea is the following:</p>
<ol>
<li>initialize one or more counters with <code>counter-reset</code>,</li>
<li>at each occurrence of a specific item, increment the counter with <code>counter-increment</code>,</li>
<li>at each occurrence of a specific item, display the current counter with the <code>:before</code> pseudo-element and <code>content: counter(my-counter)</code>.</li>
</ol>
<p>Now, what if you want nested counters? Where headings level 1 are numbered like 1, 2, 3, headings level 2 are numbered x.1, x.2, x.3, headings level 3 are numbered x.x.1, x.x.2, x.x.3...</p>
<p>Doing this with vanilla CSS isn’t too hard but require code repetition and quite a lot of code. With a Sass @for loop, we can do it with less than 10 lines of code.</p>
{% highlight css %}
/* Initialize counters */
body { 
counter-reset: ct1 ct2 ct3 ct4 ct5 ct6;
} 

/* Create a variable (list) to store the concatenated counters */
$nest: (); 

/* Loop on each heading level */
@for $i from 1 through 6 {
	
/* For each heading level */
h#{$i} { 

	/* Increment the according counter */
counter-increment: ct#{$i}; 

/* Display the concatenated counters in the according pseudo-element */
&:before { 
content: $nest counter(ct#{$i}) ". ";
} 
} 

/* Concatenate counters */
$nest: append($nest, counter(ct#{$i}) ".");
}
{% endhighlight %}
<p>The code might be complicated to understand but it’s really not that hard once you’re familiar with Sass. Now, we can push things further by turning this shit into a mixin in order to make it both clean and reusable.</p>
{% highlight css %}
@mixin numbering($from: 1, $to: 6) {
counter-reset: ct1 ct2 ct3 ct4 ct5 ct6;
$nest: (); 

@for $i from 1 through 6 {
		h#{$i} { 
counter-increment: ct#{$i}; 

&:before { 
content: $nest counter(ct#{$i}) ". ";
}	 
} 

$nest: append($nest, counter(ct#{$i}) ".");
}
}

.wrapper {
	@include numbering(1, 4);
}
{% endhighlight %}
<p class=”note”>Note: a couple of guys came to me after the talk to warn me again making table of contents with CSS generated content (pseudo-elements) since most screen-readers cannot read it. More a CSS than Sass issue but still, good to note.</p>
</section>
<section id=”foreach”>
<h2>Foreach <a href=”#foreach”>#</a></h2>
<p>The last part of my talk was probably slightly more technical thus more complicated. I wanted to show where we can go with Sass, especially with lists and loops. </p> 
</section>
