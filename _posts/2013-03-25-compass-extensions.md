---
title: "8 Compass features you may not know"
tags:
  - sass
  - compass
---

> **Edit (2014/11/16):** I no longer use Compass. Just sayin'.

[Compass](http://compass-style.org/) is a CSS authoring framework dedicated to [Sass](http://sass-lang.com/). Not only is it insanely powerful, but it also includes a large range of built-in functions and mixins, easing daily tasks.

It occurred to me there was a couple of Compass features which remain pretty much unknown to most users so I thought it could be a good idea to write a short blog post about them.

## Opposite-position()

Compass defines 5 CSS [constants](http://compass-style.org/reference/compass/helpers/constants/): `top`, `right`, `bottom`, `left` and `center`.

The point of these inalterable variables is to use the `opposite-position()` function which returns the opposite value for each constant. Please consider the following example:

```scss
$direction: left;
$opposite: opposite-position($direction); /* Outputs "right" */

$position: top right;
$opposite: opposite-position($position); /* Outputs "bottom left" */
```

*Note: the opposite of `center` is `center`.*

I personally used this extension in this very site, when it comes to images and quotes pulling ([L32](https://github.com/HugoGiraudel/hugogiraudel.github.com/blob/master/sass/_helpers.scss#L32) and [L47](https://github.com/HugoGiraudel/hugogiraudel.github.com/blob/master/sass/_helpers.scss#L47)).

```scss
@mixin pull-quote($direction) {
	$opposite: opposite-position($direction);

	text-align: $opposite;
	float: $direction;
	margin: 0 0 .5em 0;
	margin-#{$opposite}: 1em;
	border-#{$opposite}: 6px solid hotpink;
	padding-#{$opposite}: 1em;
}
```

So `$opposite` equals *right* when `$direction` is *left* and vice versa. Allows me to make only one mixin instead of 2!

## Elements-of-type()

[Element-of-type()](http://compass-style.org/reference/compass/helpers/display/) is a built-in function to detect the display type of an element: `block`, `inline`, `inline-block`, `table`, `table-row-group`, `table-header-group`, `table-footer-group`, `table-row`, `table-cell`, `list-item` and -as odd as it may look- `html5`, `html5-inline` and `html5-block`.

*Note: `html5`, `html5-inline` and `html5-block` are not real display values; they are just keywords to gather all html5 elements (inline, block or both).*

This may be useful as part of a CSS reset for example:

```scss
@mixin reset-html5 {
	#{elements-of-type(html5-block)} {
		display: block;
	}
}
```

This snippet forces all HTML5 elements to be displayed as block-elements, even by unsupported browsers.

## Experimental()

[Experimental](http://compass-style.org/reference/compass/css3/shared/) has to be one of the most used function in Compass and probably one of the less known at the same time.

Basically, `experimental()` allows you to define mixins outputing content depending on enabled vendor prefixes. It is used in **all** CSS3 built-in mixins. When you use `@include box-sizing(border-box)`, here is what happen:

```scss
@mixin box-sizing($bs) {
  $bs: unquote($bs);
  @include experimental(box-sizing, $bs, -moz, -webkit, not -o, not -ms, not -khtml, official);
}
```

This outputs:

```css
.element {
	-webkit-box-sizing: border-box;
	   -moz-box-sizing: border-box;
	        box-sizing: border-box;
}
```

`-o-`, `-ms-` (and `-khtml-`) are omitted because the `box-sizing()` mixin calls `experimental()` by specifically specifying not to output lines for Opera and Internet Explorer.

Now what's the point of such a tool? As an example, there is no default mixin for CSS animation in Compass. Let's make one!

```scss
@mixin animation($content) {
  @include experimental(animation, $content, -webkit, -moz, not -o, not -ms, official);
}

.element {
  @include animation(my-animation 3s ease);
}
```

This outputs:

```css
.element {
	-webkit-animation: my-animation 3s ease;
	   -moz-animation: my-animation 3s ease;
	        animation: my-animation 3s ease;
}
```

## Hacks

Hum, [hacks](http://compass-style.org/reference/compass/utilities/general/hacks/). I know what you think: *NOOOOOO!*. Anyway, Compass provides a couple of features to take advantage of Internet Explorer inconsistencies and weaknesses.

You may have already heard of `has-layout`. [This article](http://www.satzansatz.de/cssd/onhavinglayout.html) explains it way better than I could:

> “Layout” is an IE/Win proprietary concept that determines how elements draw and bound their content, interact with and relate to other elements, and react on and transmit application/user events.
> This quality can be irreversibly triggered by some CSS properties. Some HTML elements have “layout” by default.
> Microsoft developers decided that elements should be able to acquire a “property” (in an object-oriented programming sense) they referred to as hasLayout, which is set to true when this rendering concept takes effect.

Back to our business: Compass gives two ways to trigger `hasLayout` on elements: with `zoom` (using the `zoom` MS proprietary property) or with `block` (using the `display` property). I'd go with the zoom, even if it doesn't validate mostly because I'm used to.

```scss
.element1 {
	@include has-layout(zoom);
}

.element2 {
	@include has-layout(block);
}
```

Outputs...

```css
.element1 {
	*zoom: 1;
}

.element2 {
	display: inline-block;
}
.element2 {
	display: block;
}
```

You now understand why I use the zoom approach. Otherwise, Compass also provides another way to target IE6 specifically called the bang hack. It relies on the inability for IE6 to understand the `!important` flag:

```scss
.element1 {
	@include bang-hack(color, red, blue);
}
```

Outputs...

```css
.element1 {
	color: red !important;
	color: blue;
}
```

Since IE6 doesn't understand `!important`, it will apply the later declaratation while other browsers will follow the hammer bash flaged rule.

## Image dimensions

Compass gives you a way to know the [dimensions of an image](http://compass-style.org/reference/compass/helpers/image-dimensions/) (given as a path) with 2 functions: `image-width()` and `image-height()`.

```scss
.element {
	$image: 'my-awesome-background.jpg';
	background: url($image);
	width:  image-width($image);
	height: image-height($image);
}
```

In this example, the element will have a size relative to the background-image it uses.

*Note: beware, the path has to be relative to your project's image directory, defined in your `config.rb` file.*

## Math functions

If you're like a total nerd and want to do CSS with math, then you'll be pleased to know Compass has a bunch of built-in [math functions](http://compass-style.org/reference/compass/helpers/math/) like `sin()`, `cos()`, `pi()` among a few others.

I once had to use `sin()` in order to make a [mixin for a pure CSS 6-points star](http://hugogiraudel.com/2013/02/18/sass-mixin-star/) but that's pretty much it. If you happen to have a real live use case for one of those functions, I'd be more than pleased to know more about it.

```scss
$n: 4;
$pow :  pow($n); /* Returns 16 */
$sqrt: sqrt($n); /* Returns 2  */
```

## Selector helpers

Compass provides some [features](http://compass-style.org/reference/compass/helpers/selectors/) to play with selectors like `nest()`, `append-selector()` or `headings()`.

Once again, I am not sure if there are a bunch of real life use cases for such functions. Let me show you with a demo, maybe you'll be able to find a use case:

```scss
/* nest() */
nest(".class1", ".class2");
/* Outputs ".class1.class2" */
nest(".class1, .class2", ".class3");
/* Outputs ".class1.class3 .class2.class3" */

/* append-selector */
append-selector(".class1", ".class2");
/* Outputs ".class1.class2" */
append-selector("a, p, li", ".class");
/* Outputs "a.class, p.class, li.class" */

/* headings() */
#{headings()} {
	font-family: 'My Awesome Font';
	/* Set font-family to all headings */
}

#{headings(1, 3)} {
	font-weight: bold;
	/* Set font-weight to h1, h2, h3 */
}
```

## Image-replacement functions

Compass provides several resources to ease a daily task: [image replacement](http://compass-style.org/reference/compass/typography/text/replacement/). When you have an element with text content, but you want the text to disappear to see the background image instead.

```scss
.element {
	@include hide-text(right);
}
```

Outputs...

```css
.element {
	text-indent: 110%;
    white-space: nowrap;
    overflow: hidden;
}
```

*The `hide-text()` mixin takes a direction as a parameter. The default one is `left`, resulting in a `text-indent: -199988px` with a `16px` baseline. You definitely should use `right` for better performance.*

## Final words

So people, how many of these features did you know? If you have some free time, I highly recommand you to dig into [Compass documentation](http://compass-style.org/reference/compass/). You'd be surprised how little you know about the framework in most cases.

