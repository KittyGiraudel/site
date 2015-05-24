---
codepen: true
layout: post
summary: true
title: "Digging into my slides about Sass"
---

As you may know, I have been speaking at KiwiParty about Sass in late June. It has been a really great experience and people were really receptive even if my talk was a bit technical.

Because slides are not very self-explanatory, I think it might be cool to dig deep into the topic with expanded explanations, so that everybody can now fully understand what I was trying to explain. :D

Just for your information, here are my slides in French powered by [Reveal.js](http://slid.es):

<iframe src="http://slid.es/hugogiraudel/css-kick-ass-avec-sass/embed" width="100%" height="420" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

## What is Sass?

I'll skip the part where I introduce myself, I don't think it has much point here. Instead, I'll go straight to the introduction to explain what is a CSS preprocessor.

Sass -and pretty much any preprocessor- is a program aiming at extending a language in order to provide further features or a simplified syntax (or both). You can think of Sass as an extension of CSS; it adds to CSS what CSS doesn't have and what CSS needs (or might need).

Among other things, Sass can be very useful for:

* **Variables**: it's been a while since we first asked for variables in CSS. They'll come native some day but meanwhile, we have to rely on CSS preprocessors.
* **Nesting**: it is the ability to nest rules within each others to create expanded CSS selectors. Can be very interesting to avoid code repetition. Remember the [inception rule though](http://thesassway.com/beginner/the-inception-rule).
* **Functions**: I don't think functions deserve an explanation. Give it parameters, it returns a result you can store in a variable or use as a value.
* **Mixins**: same as functions except it outputs code instead of returning a result. Very useful to output chuncks of code depending on some parameters (mixin arguments).
* **Color functions**: every preprocessor nowadays comes with a bunch of functions to ease color management (lighten, darken, transparentize, mix, complementary…). Very cool to avoid repeated back-and-forths between the IDE and Photoshop and having 50 shades of grey when you only need one (see what I did there?). Also easier to read than hexadecimal in my opinion.
* **File concatenation**: we often want to split our large stylesheets into several smaller ones but doing so increases the number of HTTP requests, thus the time the page need to load. Sass makes this possible: multiple files in development environment, one single file compressed in production.
* And it's also very cool for a bunch of other things like responsive web design, modular architecture, calculations, namespaces, and so much more...

All of this is awesome. But when you just get started with Sass, you don't really know what to do. So you declare a couple of variables, maybe make a mixin or two that you don't really need and that's pretty much it.

My talk aimed at giving some hints to get started with Sass, along with a collection of usecases and code snippets to show how to push stylesheets to an upper level.

## @extend and abstract classes

The `@extend` feature has to be the one which made Sass so popular compared to other CSS preprocessors including Less. Basically, you can make a selector inherits styles from another selector. It comes with abstract classes (also called placeholders), classes prefixed by a `%` symbol instead of a dot, that are not compiled in the final stylesheet, thus that cannot be used in the markup. Their use is exclusive to the stylesheet.

As a very simple example, let's make a placeholder of the [clearfix method by Nicolas Gallagher](http://nicolasgallagher.com/micro-clearfix-hack/).

```scss
%clearfix:after {
  content: '';
  display: table;
  clear: both;
}

.element {
  @extend %clearfix;
}

```

Outputs:

```scss
.element:after {
  content: '';
  display: table;
  clear: both;
}
```

This example shows how we can use `@extend` and placeholders in a very basic way. We can think of a slightly more complex usecase: some kind of message module. If you're familiar with [Twitter Bootstrap](http://twitter.github.io/bootstrap/components.html#alerts), then you'll easily get what this is about: having a pattern for all types of message, then differenciate them based on their color chart (green for OK, red for error, yellow for warning, blue for information).

<pre class="codepen" data-height="300" data-type="result" data-href="3d4097c1f7ee99bfe7b10d05f0db433e" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/Dzloe">Check out this Pen!</a></pre>

With vanilla CSS, you have 3 ways to do this:

1. Create a `.message` class containing styles shared by all messages, then a class per message type. Pretty cool, no style repeated but you have to add two classes to your elements (`.message` and `.message-error`). Less cool.
1. Targets all messages with an attribute selector like `[class^="message-"]`. Clever, but attribute selectors are quite greedy peformance-speaking. Probably what I would do without Sass anyway.
1. You do it the jerk way with only 4 classes, repeating the shared styles in each of them. Not cool at all.

Let's see how we can Sass it:

```scss
%message {
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
}
```

Outputs:

```css
.message-error, .message-ok, .message-warn, .message-info {
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
}
```

No styles repeated, no heavy selector, only one class assigned in the markup. Pretty neat. However, even if there is no repeated styles in the final CSS, there are repeated lines in the Sass stylesheet. They are repeated because the `$color` variable changes in the scope. Isn't this the perfect usecase for a mixin?

```scss
@mixin message($color) {
  @extend %message;
  color: $color;
  background: lighten($color, 38%);
  border-color: lighten(adjust-hue($color, -10), 20%);
}
```

Then, we change our Sass a little bit:

```scss
.message-error {
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
}
```

Quite cool, right? And this is only a very easy example of what you can do with `@extend` and placeholders. Feel free to think of clever usecases as well.

## Sass and REM <a href="#rem">#</h2>

REM (root EM) is awesome. Problem is [IE8 doesn't understand it](http://caniuse.com/#feat=rem), and we cannot cross it out of our support chart yet. We have to deal with it. Thankfully, it is simple enough to provide IE8 a fallback for REM: give it a PX value.

But duplicating every `font-size` declaration can be tedious and converting REM to PX can be annoying. Let's do it with Sass!

```scss
@mixin rem($value, $base: 16) {
  font-size: $value + px;
  font-size: $value / $base + rem;
}

.element {
  @include rem(24);
}
```

Outputs:

```css
.element {
  font-size: 24px;
  font-size: 1.5rem;
}
```

Calculations and fallbacks are handled by Sass. What about pushing things a little further by enabling some sort of flag for IE8 instead of always outputing the PX line? Let's say you are using this in a constantly evolving project or in a library or something. You might want to easily enable or disable IE8 support.

Simple enough: wrap the PX line in a conditional statement (`@if`) depending on a boolean you initialize either at the top of your stylesheet or in a configuration file.

```scss
$support-IE8: false;

@mixin rem($value, $base: 16) {
	@if $support-IE8 {
		font-size: $value + px;
	}

	font-size: $value / $base + rem;
}

.element {
	@include rem(24);
}
```

Outputs:

```css
.element {
	font-size: 1.5rem;
}
```

On topic, I have writen a blog post about a robust and extensive PX/REM Sass mixin called [The Ultimate REM mixin](http://hugogiraudel.com/2013/03/18/ultimate-rem-mixin/).

## Media queries made easy

I don't know for you but I don't really like manipulating media queries. The syntax isn't very typing-friendly, they require values, braces and all. Plus, I really like to manage breakpoints with keywords instead of values. Sass makes it happening; please consider the following mixin.

```scss
@mixin mq($keyword) {
	@if $keyword == small {
		@media (max-width: 48em) { @content; }
	}
	@if $keyword == medium {
		@media (max-width: 58em) { @content; }
	}
	/* … */
}
```

When I want to declare alternative styles for a given breakpoint, I call the `mq()` mixin with the according keyword as argument like `@include mq(small) { … }`.

I like to name my breakpoints “small/medium/large” but you can chose whatever pleases you: “mobile/tablet/desktop”, “baby-bear/mama-bear/papa-bear”...

We can even push things further by adding retina support to the mixin (based on [HiDPI from Kaelig](https://github.com/kaelig/hidpi)):

```scss
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
```

We can now safely use this mixin as below:

```scss
.element {
	/* regular styles */

	@include mq(small) {
		/* small-screen styles */
	}

	@include mq(retina) {
		/* retina-only styles */
	}
}
```

Outputs:

```css
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
```

The Sass way makes it way easier to debug and update in my opinion; lisibility is well preserved since alternative styles are based on keywords instead of arbitrary values.

## Simple responsive grid with Sass <a href="#grid">#</h2>

Nowadays, using a grid system to build a responsive website has become a standard. There are a bunch of amazing grid systems out there, but sometimes [you just want to build your own](http://css-tricks.com/dont-overthink-it-grids/). Especially when you don't need a whole Rube Goldberg machine for your simple layout. Let's see how we can build a very simple grid system in Sass in about 12 lines:

```scss
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
```

Now let's see what the code does exactly:

* You have to define the number of columns you want your grid to be based on, the max-width of your container and the width of a column.
* Gutter width will be automagically calculated based on the 3 values you previously set.
* Then, you call the mixin and pass the number of columns you want your element to expand on as an argument.

And there you have a very simple yet responsive Sass grid.

<pre class="codepen" data-height="300" data-type="result" data-href="9581fd77d4c244288a6a115981ee1d1d" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/FpDdm">Check out this Pen!</a></pre>

## CSS counters and Sass

CSS counters are part of the [CSS 2.1 "Generated content" module](http://www.w3.org/TR/CSS21/generate.html) (and not CSS3 as it is often claimed) making items numbering possible with CSS only. The main idea is the following:

1. initialize one or more counters with `counter-reset`,
1. at each occurrence of a specific item, increment the counter with `counter-increment`,
1. at each occurrence of a specific item, display the current counter with the `:before` pseudo-element and `content: counter(my-counter)`.

Now, what if you want nested counters? Where headings level 1 are numbered like 1, 2, 3, headings level 2 are numbered x.1, x.2, x.3, headings level 3 are numbered x.x.1, x.x.2, x.x.3...

Doing this with vanilla CSS isn't too hard but require code repetition and quite a lot of lines. With a Sass `@for` loop, we can do it with less than 10 lines of code.

```scss
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
```

The code might be complicated to understand but it's really not that hard once you're familiar with Sass. Now, we can push things further by turning this shit into a mixin in order to make it both clean and reusable.

```scss
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
```

*Note: a couple of guys came to me after the talk to warn me against making table of contents with CSS generated content (pseudo-elements) since most screen-readers cannot read it. More a CSS than Sass issue but still, good to note.

## Foreach

The last part of my talk was probably slightly more technical thus more complicated. I wanted to show where we can go with Sass, especially with lists and loops.  

To fully understand it, I thought it was better to introduce Sass loops and lists (remember there was quite a few guys not knowing a bit about Sass in the room).

```scss
/* All equivalents */
$list: ("item-1", "item-2", "item-3", "item-4");
$list: ("item-1" "item-2" "item-3" "item-4");
$list: "item-1", "item-2", "item-3", "item-4";
$list: "item-1" "item-2" "item-3" "item-4";
```

So basically you can ommit braces and can either comma-separate or space-separate values.

A quick look at nested lists:

```scss
$list: ( 
  (item-1, item-2, item-3)
  (item-4, item-5, item-6)
  (item-7, item-8, item-9) 
);

// Or simpler: 
// top-level list is comma-separated 
// inner lists are space-separated 
$list:  item-1 item-2 item-3, 
	      item-4 item-5 item-6, 
        item-7 item-8 item-9;
```

Now, here is how to use a list to access item one by one.

```scss
@each $item in $list {
	/* Access item with $item */
}
```

You can do the exact same thing with a `@for` loop as you would probably do in JavaScript thanks to Sass advanced list functions.

```scss
@for $i from 1 through length($list) {
	/* Access item with nth($list, $i) */
}
```

*Note: I have a very in-depth article on Sass lists scheduled for next week. Stay tuned for some Sass awesomeness. ;)*

Now that we introduced loops and lists, we can move forward. My idea was to build a little Sass script that output a specific background based on a page name where file names would not follow any guide name (hyphens, underscores, .jpg, .png, random folders...). So home page would have background X, contact page background Y, etc.

```scss
// Two-levels list
// Top level contains pages
// Inner level contains page-specific informations 
$pages : 
  "home"     "bg-home.jpg", 
  "about"    "about.png", 
  "products" "prod_bg.jpg", 
  "contact"  "assets/contact.jpg";

@each $page in $pages {
  // Scoped variables
  $selector : nth($page, 1);
  $path     : nth($page, 2);

  .#{$selector} body {
    background: url('../images/#{ $path }');
  }
}
```

Here is what happen:

* We deal with a 2-levels list. Each item is a list containing 2 strings: the name of the page (e.g. "home") and the name of the file (e.g. "bg-home.jpg").
* We loop through the list then access inner items with the `nth()` function (e.g. `nth($page, 1)`).
* We output CSS within the loop to have one rule for each page.

Outputs:

```css
.home     body { background: url('../images/bg-home.jpg'); }
.about    body { background: url('../images/about.png'); }
.products body { background: url('../images/prod_bg.jpg'); }
.contact  body { background: url('../images/assets/contact.jpg'); }
```

I finished my talk with a last example with lists and loops, to show how to build an "active menu" without JavaScript or server-side; only CSS. To put it simple, it relies on the page name matching and the link name. So the link to home page is highlighted if it's a child of `.home` (class on html element); the link to the contact page is highlighted if it's a child of the `.contact` page. You get the idea.

To show the difference between nice and very nice Sass, I made two versions of this one. The first one is cool but meh, the second one is clever as hell (if I may).

Let's save the best for last. The idea behind the first version is to loop through the pages and output styles for each one of them.

```scss
@each $item in home, about, products, contact {
  .#{$item} .nav-#{ $item } { 
    style: awesome;
  }
}
```

Outputs:

```css
.home     .nav-home     { style: awesome; }
.about    .nav-about    { style: awesome; }
.products .nav-products { style: awesome; }
.contact  .nav-contact  { style: awesome; }
```

Not bad. At least it works. But it repeats a bunch of things and this sucks. There has to be a better way to write this.

```scss
$selector: ();

@each $item in home, about, products, contact {
  $selector: append($selector, unquote(".#{$item} .nav-#{$item}"));
}

#{$selector} { 
  style: awesome; 
}
```

Outputs:

```css
.home     .nav-home, 
.about    .nav-about,
.products .nav-products, 
.contact  .nav-contact {
  style: awesome;
}
```

This is hot! Instead of outputing shit in the loop, we use it to create a selector that we then use to define our "active" styles.

## Questions & Answers

**Is there a performance difference between `.message` and `.message-error, .message-ok, .message-info, .message-warn`?**

None. The only difference there is, is that in the first case you have to apply 2 classes to your element instead of one. Per se, having to use 2 classes on the same element isn't a problem at all.

However what can be considered odd is that the 2 classes are co-dependant, meaning they only make sense when they are together. `.message` on itself won't do much since it has no color chart. Meanwhile `.message-error` will look ugly since it lacks basic styles like padding and such.

**Your @media mixin outputs a media-query block every time you use it. Ain't you afraid of performance issues?**

That's true. Sass doesn't automatically merge media queries rules [yet](https://github.com/nex3/sass/issues/316). However, [tests have been done](http://sasscast.tumblr.com/post/38673939456/sass-and-media-queries) and they showed that once GZipped, there was no difference between duplicated and merged @media queries. 

> "... we hashed out whether there were performance implications of combining vs scattering Media Queries and came to the conclusion that the difference, while ugly, is minimal at worst, essentially non-existent at best."

In any case, if you feel dirty having duplicated media queries in your final CSS even if it doesn't make any difference, you can still use [this Ruby gem](https://github.com/aaronjensen/sass-media_query_combiner) to merge them. Please note merging media queries may mean reordering CSS which may involve some specificity issues. More tests needed.

**[Compass](http://compass-style.org/) or [Bourbon](http://bourbon.io/)?**

Well, frankly it's up to you. However note that the Compass team works directly with the Sass team so they are and will always be up to date. Bourbon otherwise is a side-project which isn't affiliated with Sass in any way (well, except for the obvious).

Moreover, Compass comes with a [sprite generator](http://compass-style.org/reference/compass/helpers/sprites/), [Blueprint](http://compass-style.org/reference/blueprint/) for your grids, a [vertical rhytm module](http://compass-style.org/reference/compass/typography/vertical_rhythm/) and a bunch of other cool things like [math functions](http://compass-style.org/reference/compass/helpers/math/), [image dimensions](http://compass-style.org/reference/compass/helpers/image-dimensions/), and [much more](http://compass-style.org/reference/compass/helpers/)...

So if you want my opinion: definitely Compass.

**Do you think we will ever be able to connect Sass to some kind of database to auto-supply lists or something?**

Honestly, I don't think so but I could be wrong. I know Sass developers want to do the right thing and try to stick as much as possible to the "CSS scope" (because in the end what is compiled is CSS). Connecting Sass to a database to generate lists then do things in Sass with these lists like [this pure Sass chart](http://codepen.io/thebabydino/pen/lHqbz) would probably be out of line (yet awesomely clever).

However they are including awesome features in Sass starting with the next version (3.3) which should include sourcemaps, a huge improvements to the parent selector (`&`), inner-string manipulation like `str-index()`, ...

## Final words

I think I've covered pretty much everything I talked about at KiwiParty, even more (I'm not limited by time on my blog). If you feel like some parts deserve deeper explanations, be sure to ask.

