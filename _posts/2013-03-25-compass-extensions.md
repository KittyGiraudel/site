---
title: 8 Compass extensions you may not know
layout: post
comments: true
---
<section>
<p><a href="http://compass-style.org/">Compass</a> is a CSS authoring framework dedicated to <a href="http://sass-lang.com/">Sass</a>. Not only is it insanely powerful, but it also includes a large range of built-in functions and mixins, easing daily tasks.</p>
<p>It occurred to me there was a couple of Compass features which remain pretty much unknown to most users so I thought it could be a good idea to write a short blog post about them.</p>
</section>
<section id="opposite-position">
<h2>Opposite-position() <a href="#opposite-position" class="section-anchor">#</a></h2>
<p>Compass defines 5 CSS <a href="http://compass-style.org/reference/compass/helpers/constants/">constants</a>: <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code> and <code>center</code>.</p>
<p>The point of these inalterable variables is to use the <code>opposite-position()</code> function which returns the opposite value for each constant. Please consider the following example:</p>
<pre class="language-scss"><code>$direction: left;
$opposite: opposite-position($direction); /* Outputs "right" */

$position: top right;
$opposite: opposite-position($position); /* Outputs "bottom left" */</code></pre>
<p class="note">Note: the opposite of <code>center</code> is <code>center</code>.</p>
<p>I personally used this extension in this very site, when it comes to images and quotes pulling (<a href="https://github.com/HugoGiraudel/hugogiraudel.github.com/blob/master/sass/_helpers.scss#L32">L32</a> and <a href="https://github.com/HugoGiraudel/hugogiraudel.github.com/blob/master/sass/_helpers.scss#L47">L47</a>).</p>
<pre class="language-scss"><code>@mixin pull-quote($direction) {
	$opposite: opposite-position($direction);

	text-align: $opposite;
	float: $direction;  
	margin: 0 0 .5em 0;
	margin-#{$opposite}: 1em;
	border-#{$opposite}: 6px solid hotpink;
	padding-#{$opposite}: 1em;
}</code></pre>
<p>So <code>$opposite</code> equals <em>right</em> when <code>$direction</code> is <em>left</em> and vice versa. Allows me to make only one mixin instead of 2!</p>
</section>
<section id="display-helpers">
<h2>Elements-of-type() <a href="#display-helpers" class="section-anchor">#</a></h2>
<p><a href="http://compass-style.org/reference/compass/helpers/display/">Element-of-type()</a> is a built-in function to detect the display type of an element: <code>block</code>, <code>inline</code>, <code>inline-block</code>, <code>table</code>, <code>table-row-group</code>, <code>table-header-group</code>, <code>table-footer-group</code>, <code>table-row</code>, <code>table-cell</code>, <code>list-item</code> and -as odd as it may look- <code>html5</code>, <code>html5-inline</code> and <code>html5-block</code>.</p>
<p class="note">Note: <code>html5</code>, <code>html5-inline</code> and <code>html5-block</code> are not real display values; they are just keywords to gather all html5 elements (inline, block or both).</p>
<p>This may be useful as part of a CSS reset for example:</p>
<pre class="language-scss"><code>@mixin reset-html5 {
	#{elements-of-type(html5-block)} {
		display: block; 
	} 
}</code></pre>
<p>This snippet forces all HTML5 elements to be displayed as block-elements, even by unsupported browsers.</p>
</section>
<section id="experimental">
<h2>Experimental() <a href="#experimental" class="section-anchor">#</a></h2>
<p><a href="http://compass-style.org/reference/compass/css3/shared/">Experimental()</a> has to be one of the most used function in Compass and probably one of the less known at the same time.</p>
<p>Basically, <code>experimental()</code> allows you to define mixins outputing content depending on enabled vendor prefixes. It is used in <strong>all</strong> CSS3 built-in mixins. When you use <code>@include box-sizing(border-box)</code>, here is what happen:</p>
<pre class="language-scss"><code>@mixin box-sizing($bs) {
  $bs: unquote($bs);
  @include experimental(box-sizing, $bs, -moz, -webkit, not -o, not -ms, not -khtml, official); 
}</code></pre>
<p>This outputs:</p>
<pre class="language-css"><code>.element {
	-webkit-box-sizing: border-box;
	   -moz-box-sizing: border-box;
	        box-sizing: border-box;
}</code></pre>
<p><code>-o-</code>, <code>-ms-</code> (and <code>-khtml-</code>) are omitted because the <code>box-sizing()</code> mixin calls <code>experimental()</code> by specifically specifying not to output lines for Opera and Internet Explorer.</p>
<p>Now what's the point of such a tool? As an example, there is no default mixin for CSS animation in Compass. Let's make one!</p>
<pre class="language-scss"><code>@mixin animation($content) {
  @include experimental(animation, $content, -webkit, -moz, not -o, not -ms, official);
}

.element {
  @include animation(my-animation 3s ease);
}</code></pre>
<p>This outputs:</p>
<pre class="language-css"><code>.element {
	-webkit-animation: my-animation 3s ease;
	   -moz-animation: my-animation 3s ease;
	        animation: my-animation 3s ease;
}</code></pre>
</section>
<section id="hacks">
<h2>Hacks <a href="#hacks" class="section-anchor">#</a></h2>
<p>Hum, <a href="http://compass-style.org/reference/compass/utilities/general/hacks/">hacks</a>. I know what you think: <em>NOOOOOO!</em>. Anyway, Compass provides a couple of features to take advantage of Internet Explorer inconsistencies and weaknesses.</p>
<p>You may have already heard of <code>has-layout</code>. <a href="http://www.satzansatz.de/cssd/onhavinglayout.html">This article</a> explains it way better than I could:</p>
<blockquote class="quote"><p>“Layout” is an IE/Win proprietary concept that determines how elements draw and bound their content, interact with and relate to other elements, and react on and transmit application/user events.</p>
<p>This quality can be irreversibly triggered by some CSS properties. Some HTML elements have “layout” by default.</p>
<p>Microsoft developers decided that elements should be able to acquire a “property” (in an object-oriented programming sense) they referred to as hasLayout, which is set to true when this rendering concept takes effect.</p></blockquote>
<p>Back to our business: Compass gives two ways to trigger <code>hasLayout</code> on elements: with <code>zoom</code> (using the <code>zoom</code> MS proprietary property) or with <code>block</code> (using the <code>display</code> property). I'd go with the zoom, even if it doesn't validate mostly because I'm used to.</p>
<pre class="language-scss"><code>.element1 {
	@include has-layout(zoom);
}

.element2 {
	@include has-layout(block);
}</code></pre>
<p>Outputs...</p>
<pre class="language-css"><code>.element1 {
	*zoom: 1;
}

.element2 {
	display: inline-block;
}
.element2 {
	display: block;
}</code></pre>
</section>
<p>You now understand why I use the zoom approach. Otherwise, Compass also provides another way to target IE6 specifically called the bang hack. It relies on the inability for IE6 to understand the <code>!important</code> flag:</p>
<pre class="language-scss"><code>.element1 {
	@include bang-hack(color, red, blue);
}</code></pre>
<p>Outputs...</p>
<pre class="language-css"><code>.element1 {
	color: red !important;
	color: blue;
}</code></pre>
<p>Since IE6 doesn't understand <code>!important</code>, it will apply the later declaratation while other browsers will follow the hammer bash flaged rule.</p>
<section id="image-dimensions">
<h2>Image dimensions <a href="#image-dimensions" class="section-anchor">#</a></h2>
<p>Compass gives you a way to know the <a href="http://compass-style.org/reference/compass/helpers/image-dimensions/">dimensions of an image</a> (given as a path) with 2 functions: <code>image-width()</code> and <code>image-height()</code>.</p>
<pre class="language-scss"><code>.element {
	$image: 'my-awesome-background.jpg';
	background: url($image);
	width:  image-width($image);
	height: image-height($image);
}</code></pre>
<p>In this example, the element will have a size relative to the background-image it uses.</p>
<p class="note">Note: beware, the path has to be relative to your project's image directory, defined in your <code>config.rb</code> file.</p>
</section>
<section id="math-functions">
<h2>Math functions <a href="#math-functions" class="section-anchor">#</a></h2>
<p>If you're like a total nerd and want to do CSS with math, then you'll be pleased to know Compass has a bunch of built-in <a href="http://compass-style.org/reference/compass/helpers/math/">math functions</a> like <code>sin()</code>, <code>cos()</code>, <code>pi()</code> among a few others.</p>
<p>I once had to use <code>sin()</code> in order to make a <a href="http://hugogiraudel.com/2013/02/18/sass-mixin-star/">mixin for a pure CSS 6-points star</a> but that's pretty much it. If you happen to have a real live use case for one of those functions, I'd be more than pleased to know more about it.</p>
<pre class="language-scss"><code>$n: 4;
$pow :  pow($n); /* Returns 16 */
$sqrt: sqrt($n); /* Returns 2  */ </code></pre>
</section>
<section id="selectors">
<h2>Selector helpers <a href="#selectors" class="section-anchor">#</a></h2>
<p>Compass provides some <a href="http://compass-style.org/reference/compass/helpers/selectors/">features</a> to play with selectors like <code>nest()</code>, <code>append-selector()</code> or <code>headings()</code>.</p>
<p>Once again, I am not sure if there are a bunch of real life use cases for such functions. Let me show you with a demo, maybe you'll be able to find a use case:</p>
<pre class="language-scss"><code>/* nest() */
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
}</code></pre>
</section>
<section id="text-replacement">
<h2>Image-replacement functions <a href="#text-replacement" class="section-anchor">#</a></h2>
<p>Compass provides several resources to ease a daily task: <a href="http://compass-style.org/reference/compass/typography/text/replacement/">image replacement</a>. When you have an element with text content, but you want the text to disappear to see the background image instead.</p>
<pre class="language-scss"><code>.element {
	@include hide-text(right);
}</code></pre>
<p>Outputs...</p>
<pre class="language-css"><code>.element {
	text-indent: 110%;
    white-space: nowrap;
    overflow: hidden;
}</code></pre>
<p class="note">The <code>hide-text()</code> mixin takes a direction as a parameter. The default one is <code>left</code>, resulting in a <code>text-indent: -199988px</code> with a <code>16px</code> baseline. You definitely should use <code>right</code> for better performance.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words" class="section-anchor">#</a></h2>
<p>So guys, how many of these features did you know? If you have some free time, I highly recommand you to dig into <a href="http://compass-style.org/reference/compass/">Compass documentation</a>. You'd be surprised how little you know about the framework in most cases.</p>
</section>