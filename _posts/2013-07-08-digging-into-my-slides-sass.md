---
published: true
layout: post
comments: true
summary: true
codepen: true
title: Digging into my slides about Sass
---

<section>
<p>As you may know, I have been <a href="#">speaking at KiwiParty</a> about Sass in late June. It has been a really great experience and people were really receptive even if my talk was a bit technical.</p>
<p>Because slides are not very self-explanatory, I think it might be cool to dig deep into the topic with expanded explanations, so that everybody can now fully understand what I was trying to explain. :D</p>
<p>Just for your information, here are my slides in French powered by <a href="http://slid.es">Reveal.js</a>:</p>
<iframe src="http://slid.es/hugogiraudel/css-kick-ass-avec-sass/embed" width="100%" height="420" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</section>
<section id="introduction">
<h2>What is Sass? <a href="#introduction">#</a></h2>
<p>I'll skip the part where I introduce myself, I don't think it has much point here. Instead, I'll go straight to the introduction to explain what is a CSS preprocessor.</p>
<p>Sass -and pretty much any preprocessor- is a program aiming at extending a language in order to provide further features or a simplified syntax (or both). You can think of Sass as an extension of CSS; it adds to CSS what CSS doesn't have and what CSS needs (or might need).</p>
<p>Among other things, Sass can be very useful for:</p>
<ul>
<li><strong>Variables</strong>: it's been a while since we first asked for variables in CSS. They'll come native some day but meanwhile, we have to rely on CSS preprocessors.</li>
<li><strong>Nesting</strong>: it is the ability to nest rules within each others to create expanded CSS selectors. Can be very interesting to avoid code repetition. Remember the <a href="http://thesassway.com/beginner/the-inception-rule">inception rule though</a>.</li>
<li><strong>Functions</strong>: I don't think functions deserve an explanation. Give it parameters, it returns a result you can store in a variable or use as a value.</li>
<li><strong>Mixins</strong>: same as functions except it outputs code instead of returning a result. Very useful to output chuncks of code depending on some parameters (mixin arguments).</li>
<li><strong>Color functions</strong>: every preprocessor nowadays comes with a bunch of functions to ease color management (lighten, darken, transparentize, mix, complementary…). Very cool to avoid repeated back-and-forths between the IDE and Photoshop and having 50 shades of grey when you only need one (see what I did there?). Also easier to read than hexadecimal in my opinion.</li>
<li><strong>File concatenation</strong>: we often want to split our large stylesheets into several smaller ones but doing so increases the number of HTTP requests, thus the time the page need to load. Sass makes this possible: multiple files in development environment, one single file compressed in production.</li>
<li>And it's also very cool for a bunch of other things like responsive web design, modular architecture, calculations, namespaces, and so much more...</li>
</ul>
<p>All of this is awesome. But when you just get started with Sass, you don't really know what to do. So you declare a couple of variables, maybe make a mixin or two that you don't really need and that's pretty much it.</p>
<p>My talk aimed at giving some hints to get started with Sass, along with a collection of usecases and code snippets to show how to push stylesheets to an upper level.</p>
</section>
<section id="extend">
<h2>@extend and abstract classes <a href="#extend">#</a></h2>
<p>The <code>@extend</code> feature has to be the one which made Sass so popular compared to other CSS preprocessors including Less. Basically, you can make a selector inherits styles from another selector. It comes with abstract classes (also called placeholders), classes prefixed by a <code>%</code> symbol instead of a dot, that are not compiled in the final stylesheet, thus that cannot be used in the markup. Their use is exclusive to the stylesheet.</p>
<p>As a very simple example, let's make a placeholder of the <a href="http://nicolasgallagher.com/micro-clearfix-hack/">clearfix method by Nicolas Gallagher</a>.</p>
<pre class="language-scss"><code>%clearfix:after {
	content: '';
	display: table;
	clear: both;
}

.element {
	@extend %clearfix;
}
</code></pre>
<p>Outputs:</p>
<pre class="language-scss"><code>.element:after {
	content: '';
	display: table;
	clear: both;
}</code></pre>
<p>This example shows how we can use <code>@extend</code> and placeholders in a very basic way. We can think of a slightly more complex usecase: some kind of message module. If you're familiar with <a href="http://twitter.github.io/bootstrap/components.html#alerts">Twitter Bootstrap</a>, then you'll easily get what this is about: having a pattern for all types of message, then differenciate them based on their color chart (green for OK, red for error, yellow for warning, blue for information).</p>
<pre class="codepen" data-height="300" data-type="result" data-href="3d4097c1f7ee99bfe7b10d05f0db433e" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/Dzloe">Check out this Pen!</a></pre>
<p>With vanilla CSS, you have 3 ways to do this:</p>
<ol>
<li>Create a <code>.message</code> class containing styles shared by all messages, then a class per message type. Pretty cool, no style repeated but you have to add two classes to your elements (<code>.message</code> and <code>.message-error</code>). Less cool.</li>
<li>Targets all messages with an attribute selector like <code>[class^="message-"]</code>. Clever, but attribute selectors are quite greedy peformance-speaking. Probably what I would do without Sass anyway.</li>
<li>You do it the jerk way with only 4 classes, repeating the shared styles in each of them. Not cool at all.</li>
</ol>
<p>Let's see how we can Sass it:</p>
<pre class="language-scss"><code>%message {
	/* shared styles */
}
.message-error {
	@extend %message;
	$color: #b94a48;
	color: $color;
  	background: lighten($color, 38%);
  	border-color: lighten(adjust-hue($color, -10), 20%);
}
.message-ok {
	@extend %message;
	$color: #468847;
	color: $color;
  	background: lighten($color, 38%);
  	border-color: lighten(adjust-hue($color, -10), 20%);
}
.message-warn {
	@extend %message;
	$color: #c09853;
	color: $color;
  	background: lighten($color, 38%);
 	border-color: lighten(adjust-hue($color, -10), 20%);
}
.message-info {
	@extend %message;
	$color: #3a87ad;
	color: $color;
	background: lighten($color, 38%);
 	border-color: lighten(adjust-hue($color, -10), 20%);
}</code></pre>
<p>Outputs:</p>
<pre class="language-css"><code>.message-error, .message-ok, .message-warn, .message-info {
	/* shared styles */
}
.message-error {
	color: #b94a48;
  	background: #efd5d4;
  	border-color: #d5929c;
}
.message-ok {
	color: #468847;
 	background: #b6dab7;
 	border-color: #83ba7a;
}
.message-warn {
	color: #c09853;
  	background: #f4ede1;
  	border-color: #dbba9e;
}
.message-info {
	color: #3a87ad;
  	background: #bfdcea;
  	border-color: #7ac4d3;
}</code></pre>
<p>No styles repeated, no heavy selector, only one class assigned in the markup. Pretty neat. However, even if there is no repeated styles in the final CSS, there are repeated lines in the Sass stylesheet. They are repeated because the <code>$color</code> variable changes in the scope. Isn't this the perfect usecase for a mixin?</p>
<pre class="language-scss"><code>@mixin message($color) {
    @extend %message;
    color: $color;
	background: lighten($color, 38%);
 	border-color: lighten(adjust-hue($color, -10), 20%);
}</code></pre>
<p>Then, we change our Sass a little bit:</p>
<pre class="language-scss"><code>.message-error {
	@include message(#b94a48);
}
.message-ok {
	@include message(#468847);
}
.message-warn {
	@include message(#c09853);
}
.message-info {
	@include message(#3a87ad);
}</code></pre>
<p>Quite cool, right? And this is only a very easy example of what you can do with <code>@extend</code> and placeholders. Feel free to think of clever usecases as well.</p>
</section>
<section id="rem">
<h2>Sass and REM <a href="#rem">#</a></h2>
<p>REM (root EM) is awesome. Problem is <a href="http://caniuse.com/#feat=rem">IE8 doesn't understand it</a>, and we cannot cross it out of our support chart yet. We have to deal with it. Thankfully, it is simple enough to provide IE8 a fallback for REM: give it a PX value.</p>
<p>But duplicating every <code>font-size</code> declaration can be tedious and converting REM to PX can be annoying. Let's do it with Sass!</p>
<pre class="language-scss"><code>@mixin rem($value, $base: 16) {
	font-size: $value + px;
	font-size: $value / $base + rem;
}

.element {
	@include rem(24);
}</code></pre>
<p>Outputs:</p>
<pre class="language-css"><code>.element {
	font-size: 24px;
	font-size: 1.5rem;
}</code></pre>
<p>Calculations and fallbacks are handled by Sass. What about pushing things a little further by enabling some sort of flag for IE8 instead of always outputing the PX line? Let's say you are using this in a constantly evolving project or in a library or something. You might want to easily enable or disable IE8 support.</p>
<p>Simple enough: wrap the PX line in a conditional statement (<code>@if</code>) depending on a boolean you initialize either at the top of your stylesheet or in a configuration file.</p>
<pre class="language-scss"><code>$support-IE8: false;

@mixin rem($value, $base: 16) {
	@if $support-IE8 {
		font-size: $value + px;
	}

	font-size: $value / $base + rem;
}

.element {
	@include rem(24);
}</code></pre>
<p>Outputs:</p>
<pre class="language-css"><code>.element {
	font-size: 1.5rem;
}</code></pre>
<p>On topic, I have writen a blog post about a robust and extensive PX/REM Sass mixin called <a href="http://hugogiraudel.com/2013/03/18/ultimate-rem-mixin/">The Ultimate REM mixin</a>.</p>
</section>
<section id="mq">
<h2>Media queries made easy <a href="#mq">#</a></h2>
<p>I don't know for you but I don't really like manipulating media queries. The syntax isn't very typing-friendly, they require values, braces and all. Plus, I really like to manage breakpoints with keywords instead of values. Sass makes it happening; please consider the following mixin.</p>
<pre class="language-scss"><code>@mixin mq($keyword) {
	@if $keyword == small {
		@media (max-width: 48em) { @content; }
	}
	@if $keyword == medium {
		@media (max-width: 58em) { @content; }
	}
	/* … */
}</code></pre>
<p>When I want to declare alternative styles for a given breakpoint, I call the <code>mq()</code> mixin with the according keyword as argument like <code>@include mq(small) { … }</code>.</p>
<p>I like to name my breakpoints “small/medium/large” but you can chose whatever pleases you: “mobile/tablet/desktop”, “baby-bear/mama-bear/papa-bear”...</p>
<p>We can even push things further by adding retina support to the mixin (based on <a href="https://github.com/kaelig/hidpi">HiDPI from Kaelig</a>):</p>
<pre class="language-scss"><code>@mixin mq($keyword) {
	/* … */
	@if $keyword == retina {
		@media 
			only screen and (-webkit-min-device-pixel-ratio: 1.3)
			only screen and (min-resolution: 124.8dpi)
			only screen and (min-resolution: 1.3dppx) {
				@content;
		}
	}
}</code></pre>
<p>We can now safely use this mixin as below:</p>
<pre class="language-scss"><code>.element {
	/* regular styles */

	@include mq(small) {
		/* small-screen styles */
	}

	@include mq(retina) {
		/* retina-only styles */
	}
}</code></pre>
<p>Outputs:</p>
<pre class="language-css"><code>.element {
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
}</code></pre>
<p>The Sass way makes it way easier to debug and update in my opinion; lisibility is well preserved since alternative styles are based on keywords instead of arbitrary values.</p>
</section>
<section id="grid">
<h2>Simple responsive grid with Sass <a href="#grid">#</a></h2>
<p>Nowadays, using a grid system to build a responsive website has become a standard. There are a bunch of amazing grid systems out there, but sometimes <a href="http://css-tricks.com/dont-overthink-it-grids/">you just want to build your own</a>. Especially when you don't need a whole Rube Goldberg machine for your simple layout. Let's see how we can build a very simple grid system in Sass in about 12 lines:</p>
<pre class="language-scss"><code>/* Your variables */
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
}</code></pre>
<p>Now let's see what the code does exactly:</p>
<ul>
<li>You have to define the number of columns you want your grid to be based on, the max-width of your container and the width of a column.</li>
<li>Gutter width will be automagically calculated based on the 3 values you previously set.</li>
<li>Then, you call the mixin and pass the number of columns you want your element to expand on as an argument.</li>
</ul>
<p>And there you have a very simple yet responsive Sass grid.</p>
<pre class="codepen" data-height="300" data-type="result" data-href="9581fd77d4c244288a6a115981ee1d1d" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/FpDdm">Check out this Pen!</a></pre>
</section>
<section id="counters">
<h2>CSS counters and Sass <a href="#counters">#</a></h2>
<p>CSS counters are part of the <a href="http://www.w3.org/TR/CSS21/generate.html">CSS 2.1 "Generated content" module</a> (and not CSS3 as it is often claimed) making items numbering possible with CSS only. The main idea is the following:</p>
<ol>
<li>initialize one or more counters with <code>counter-reset</code>,</li>
<li>at each occurrence of a specific item, increment the counter with <code>counter-increment</code>,</li>
<li>at each occurrence of a specific item, display the current counter with the <code>:before</code> pseudo-element and <code>content: counter(my-counter)</code>.</li>
</ol>
<p>Now, what if you want nested counters? Where headings level 1 are numbered like 1, 2, 3, headings level 2 are numbered x.1, x.2, x.3, headings level 3 are numbered x.x.1, x.x.2, x.x.3...</p>
<p>Doing this with vanilla CSS isn't too hard but require code repetition and quite a lot of lines. With a Sass <code>@for</code> loop, we can do it with less than 10 lines of code.</p>
<pre class="language-scss"><code>/* Initialize counters */
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
}</code></pre>
<p>The code might be complicated to understand but it's really not that hard once you're familiar with Sass. Now, we can push things further by turning this shit into a mixin in order to make it both clean and reusable.</p>
<pre class="language-scss"><code>@mixin numbering($from: 1, $to: 6) {
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
}</code></pre>
<p class="note">Note: a couple of guys came to me after the talk to warn me against making table of contents with CSS generated content (pseudo-elements) since most screen-readers cannot read it. More a CSS than Sass issue but still, good to note.</p>
</section>
<section id="foreach">
<h2>Foreach <a href="#foreach">#</a></h2>
<p>The last part of my talk was probably slightly more technical thus more complicated. I wanted to show where we can go with Sass, especially with lists and loops. </p> 
<p>To fully understand it, I thought it was better to introduce Sass loops and lists (remember there was quite a few guys not knowing a bit about Sass in the room).</p>
<pre class="language-scss"><code>/* All equivalents */
$list: ("item-1", "item-2", "item-3", "item-4");
$list: ("item-1" "item-2" "item-3" "item-4");
$list: "item-1", "item-2", "item-3", "item-4";
$list: "item-1" "item-2" "item-3" "item-4";</code></pre>
<p>So basically you can ommit braces and can either comma-separate or space-separate values.</li>
<p>A quick look at nested lists:</p>
<pre class="language-scss"><code>$list: ( (item-1, item-2, item-3)
         (item-4, item-5, item-6)
         (item-7, item-8, item-9) );

/* Or simpler: 
 * top-level list is comma-separated 
 * inner lists are space-separated 
 */
$list:  item-1 item-2 item-3, 
		item-4 item-5 item-6, 
        item-7 item-8 item-9;</code></pre>
<p>Now, here is how to use a list to access item one by one.</p>
<pre class="language-scss"><code>@each $item in $list {
	/* Access item with $item */
}</code></pre>
<p>You can do the exact same thing with a <code>@for</code> loop as you would probably do in JavaScript thanks to Sass advanced list functions.</p>
<pre class="language-scss"><code>@for $i from 1 through length($list) {
	/* Access item with nth($list, $i) */
}</code></pre>
<p class="note">Note: I have a very in-depth article on Sass lists scheduled for next week. Stay tuned for some Sass awesomeness. ;)</p>
<p>Now that we introduced loops and lists, we can move forward. My idea was to build a little Sass script that output a specific background based on a page name where file names would not follow any guide name (hyphens, underscores, .jpg, .png, random folders...). So home page would have background X, contact page background Y, etc.</p>
<pre class="language-scss"><code>/* Two-levels list
 * Top level contains pages
 * Inner level contains page-specific informations 
 */
$pages : 
  "home"     "bg-home.jpg", 
  "about"    "about.png", 
  "products" "prod_bg.jpg", 
  "contact"  "assets/contact.jpg";

@each $page in $pages {
	/* Scoped variable */
    $selector : nth($page, 1);
    $path     : nth($page, 2);
    
    .#{ $selector } body {
        background: url('../images/#{ $path }');
    }
}</code></pre>
<p>Here is what happen:</p>
<ul>
<li>We deal with a 2-levels list. Each item is a list containing 2 strings: the name of the page (e.g. "home") and the name of the file (e.g. "bg-home.jpg").</li>
<li>We loop through the list then access inner items with the <code>nth()</code> function (e.g. <code>nth($page, 1)</Code>).</li>
<li>We output CSS within the loop to have one rule for each page.</li>
</ul>
<p>Outputs:</p>
<pre class="language-css"><code>.home     body { background: url('../images/bg-home.jpg'); }
.about    body { background: url('../images/about.png'); }
.products body { background: url('../images/prod_bg.jpg'); }
.contact  body { background: url('../images/assets/contact.jpg'); }</code></pre>
<p>I finished my talk with a last example with lists and loops, to show how to build an "active menu" without JavaScript or server-side; only CSS. To put it simple, it relies on the page name matching and the link name. So the link to home page is highlighted if it's a child of <code>.home</code> (class on html element); the link to the contact page is highlighted if it's a child of the <code>.contact</code> page. You get the idea.</p>
<p>To show the difference between nice and very nice Sass, I made two versions of this one. The first one is cool but meh, the second one is clever as hell (if I may).</p>
<p>Let's save the best for last. The idea behind the first version is to loop through the pages and output styles for each one of them.</p>
<pre class="language-scss"><code>$pages : home, about, products, contact;

@each $item in $pages {
    .#{ $item } .nav-#{ $item } { 
        style: awesome;
    }
}</code></pre>
<p>Outputs:</p>
<pre class="language-css"><code>.home     .nav-home     { style: awesome; }
.about    .nav-about    { style: awesome; }
.products .nav-products { style: awesome; }
.contact  .nav-contact  { style: awesome; }</code></pre>
<p>Not bad. At least it works. But it repeats a bunch of things and this sucks. There has to be a better way to write this.</p>
<pre class="language-scss"><code>$pages    : home, about, products, contact;
$selector : ();

@each $item in $pages {
    $selector: append($selector, unquote(".#{$item} .nav-#{$item}"));
}

#{ $selector } { 
    style: awesome; 
}</code></pre>
<p>Outputs:</p>
<pre class="language-scsscss"><code>.home     .nav-home, 
.about    .nav-about,
.products .nav-products, 
.contact  .nav-contact {
    style: awesome;
}</code></pre>
<p>This is hot! Instead of outputing shit in the loop, we use it to create a selector that we then use to define our "active" styles.</p>
</section>
<section id="QA">
<h2>Questions & Answers <a href="#QA">#</a></h2>
<p style="font-weight: bold"><span class="fontawesome-comments icon-left" style="color: #aaa"></span>Is there a performance difference between <code>.message</code> and <code>.message-error, .message-ok, .message-info, .message-warn</code>?</p>
<p>None. The only difference there is, is that in the first case you have to apply 2 classes to your element instead of one. Per se, having to use 2 classes on the same element isn't a problem at all.</p>
<p>However what can be considered odd is that the 2 classes are co-dependant, meaning they only make sense when they are together. <code>.message</code> on itself won't do much since it has no color chart. Meanwhile <code>.message-error</code> will look ugly since it lacks basic styles like padding and such.</p>
<p style="font-weight: bold"><span class="fontawesome-comments icon-left" style="color: #aaa"></span>Your @media mixin outputs a media-query block every time you use it. Ain't you afraid of performance issues?</p>
<p>That's true. Sass doesn't automatically merge media queries rules <a href="https://github.com/nex3/sass/issues/316">yet</a>. However, <a href="http://sasscast.tumblr.com/post/38673939456/sass-and-media-queries">tests have been done</a> and they showed that once GZipped, there was no difference between duplicated and merged @media queries.</p> 
<blockquote class="quote"><p>"... we hashed out whether there were performance implications of combining vs scattering Media Queries and came to the conclusion that the difference, while ugly, is minimal at worst, essentially non-existent at best."</p></blockquote>
<p>In any case, if you feel dirty having duplicated media queries in your final CSS even if it doesn't make any difference, you can still use <a href="https://github.com/aaronjensen/sass-media_query_combiner">this Ruby gem</a> to merge them. Please note merging media queries may mean reordering CSS which may involve some specificity issues. More tests needed.</p>
<p style="font-weight: bold"><span class="fontawesome-comments icon-left" style="color: #aaa"></span><a href="http://compass-style.org/">Compass</a> or <a href="http://bourbon.io/">Bourbon</a>?</p>
<p>Well, frankly it's up to you. However note that the Compass team works directly with the Sass team so they are and will always be up to date. Bourbon otherwise is a side-project which isn't affiliated with Sass in any way (well, except for the obvious).</p>
<p>Moreover, Compass comes with a <a href="http://compass-style.org/reference/compass/helpers/sprites/">sprite generator</a>, <a href="http://compass-style.org/reference/blueprint/">Blueprint</a> for your grids, a <a href="http://compass-style.org/reference/compass/typography/vertical_rhythm/">vertical rhytm module</a> and a bunch of other cool things like <a href="http://compass-style.org/reference/compass/helpers/math/">math functions</a>, <a href="http://compass-style.org/reference/compass/helpers/image-dimensions/">image dimensions</a>, and <a href="http://compass-style.org/reference/compass/helpers/">much more</a>...</p>
<p>So if you want my opinion: definitely Compass.</p>  
<p style="font-weight: bold"><span class="fontawesome-comments icon-left" style="color: #aaa"></span>Do you think we will ever be able to connect Sass to some kind of database to auto-supply lists or something?</p>
<p>Honestly, I don't think so but I could be wrong. I know Sass developers want to do the right thing and try to stick as much as possible to the "CSS scope" (because in the end what is compiled is CSS). Connecting Sass to a database to generate lists then do things in Sass with these lists like <a href="http://codepen.io/thebabydino/pen/lHqbz">this pure Sass chart</a> would probably be out of line (yet awesomely clever).</p>
<p>However they are including awesome features in Sass starting with the next version (3.3) which should include sourcemaps, a huge improvements to the parent selector (<code>&</code>), inner-string manipulation like <code>str-index()</code>, ...</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>I think I've covered pretty much everything I talked about at KiwiParty, even more (I'm not limited by time on my blog). If you feel like some parts deserve deeper explanations, be sure to ask.</p>
</section>
