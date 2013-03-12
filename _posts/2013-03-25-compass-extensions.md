---
title: 8 Compass extensions you may not know
layout: post
preview: true
comments: false
---
<section>
<p><a href="http://compass-style.org/">Compass</a> is a CSS authoring framework dedicated to <a href="http://sass-lang.com/">Sass</a>. Not only is it insanely powerful, but it also includes a large range of built-in functions and mixins, easing daily tasks.</p>
<p>It occurred to me there was a couple of Compass features which remain pretty much unknown to most users so I thought it could be a good idea to write a short blog post about them.</p>
</section>
<section id="opposite-position">
<h2>Opposite-position() <a href="#opposite-position" class="section-anchor">#</a></h2>
<p>Compass has some 5 CSS <a href="http://compass-style.org/reference/compass/helpers/constants/">constants</a> defined: <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code> and <code>center</code>.</p>
<p>The point is, the <code>opposite-position()</code> function returns the opposite value for each constant. Please consider the following example:</p>
{% highlight css %}
$direction: left;
$opposite: opposite-position($direction); /* Outputs "right" */

$position: top right;
$opposite: opposite-position($position); /* Outputs "bottom left" */
{% endhighlight %}
<p class="note">Note: the opposite of <code>center</code> is <code>center</code>.</p>
<p>I personally used this extension in this very site, when it comes to images and quotes pulling. Please refer to <a href="https://github.com/HugoGiraudel/hugogiraudel.github.com/blob/master/sass/_helpers.scss">the source code line 32 and 47</a>.</p>
</section>
<section id="display-helpers">
<h2>Elements-of-type() <a href="#display-helpers" class="section-anchor">#</a></h2>
<p><a href="http://compass-style.org/reference/compass/helpers/display/">Element-of-type()</a> is a built-in function to detect the display type of an element: <code>block</code>, <code>inline</code>, <code>inline-block</code>, <code>table</code>, <code>table-row-group</code>, <code>table-header-group</code>, <code>table-footer-group</code>, <code>table-row</code>, <code>table-cell</code>, <code>list-item</code> and -as odd as it may look- <code>html5</code>, <code>html5-inline</code> and <code>html5-block</code>.</p>
<p class="note">Note: <code>html5</code>, <code>html5-inline</code> and <code>html5-block</code> are not real display values; they are just keywords to gather all html5 elements (inline, block or both).</p>
<p>This may be useful as part of a CSS reset for example:</p>
{% highlight css %}
@mixin reset-html5 {
	#{elements-of-type(html5-block)} {
		display: block; 
	} 
}
{% endhighlight %}
<p>This snippet forces all HTML5 elements to be displayed as block-elements, even by unsupported browsers.</p>
</section>
<section id="experimental">
<h2>Experimental()  <a href="#experimental" class="section-anchor">#</a></h2>
<p>Ironically, <a href="http://compass-style.org/reference/compass/css3/shared/">experimental()</a> has to be one of the most used function in Compass and probably one of the less known at the same time.</p>
<p>Basically, <code>experimental()</code> allows you to define mixins outputing content depending on enabled vendor prefixes. It's used in <strong>all</strong> CSS3 built-in mixins. When you use <code>@include box-sizing(border-box);</code>, here is what happen:</p>
{% highlight css %}
@mixin box-sizing($bs) {
  $bs: unquote($bs);
  @include experimental(box-sizing, $bs, -moz, -webkit, not -o, not -ms, not -khtml, official); 
}
{% endhighlight %}
<p>This outputs:</p>
{% highlight css %}
.element {
	-webkit-box-sizing: border-box;
	   -moz-box-sizing: border-box;
	        box-sizing: border-box;
}
{% endhighlight %}
<p><code>-o-</code>, <code>-ms-</code> (and <code>-khtml-</code>) are omitted because the box-sizing() mixin calls the experimental() mixin by specifically specifying not to outputs lines for Opera and Internet Explorer.</p>
<p>Now what's the point of such a tool? As an example, there is no built-in mixin for CSS3 animation in Compass. Let's make one!</p>
{% highlight css %}
@mixin animation($content) {
  @include experimental(animation, $content, -webkit, -moz, not -o, not -ms, official);
}

.element {
  @include animation(my-animation 3s ease);
}
{% endhighlight %}
<p>This outputs:</p>
{% highlight css %}
.element {
	-webkit-animation: my-animation 3s ease;
	   -moz-animation: my-animation 3s ease;
	        animation: my-animation 3s ease;
}
{% endhighlight %}
</section>
<section id="hacks">
<h2>Hacks <a href="#hacks" class="section-anchor">#</a></h2>
<p><a href="http://compass-style.org/reference/compass/utilities/general/hacks/"></a></p>
</section>
<section id="image-dimensions">
<h2>Image dimensions <a href="#image-dimensions" class="section-anchor">#</a></h2>
http://compass-style.org/reference/compass/helpers/image-dimensions/
</section>
<section id="math-functions">
<h2>Math functions <a href="#math-functions" class="section-anchor">#</a></h2>
<p>If you're like a total nerd and wants to do CSS with math, then you'll be pleased to know Compass has a bunch of built-in <a href="http://compass-style.org/reference/compass/helpers/math/">math functions</a> like <code>sin()</code>, <code>cos()</code>, <code>pi()</code> among a few others.</p>
<p>I once had to use <code>sin()</code> in order to make a <a href="http://hugogiraudel.com/2013/02/18/sass-mixin-star/">mixin for a pure CSS 6-points star</a> but that's pretty much it. If you happen to have a real live use case for one of those functions, I'd be more than pleased to know more about it.</p>
</section>
<section id="selectors">
<h2>Selector helpers <a href="#selectors" class="section-anchor">#</a></h2>
<p>Compass provides some <a href="http://compass-style.org/reference/compass/helpers/selectors/">features</a> to play with selectors like <code>nest()</code>, <code>append-selector()</code> or <code>headings()</code>.</p>
<p>Once again, I am not sure if there are a bunch of real life use cases for such functions. Let me show you with a demo, maybe you'll be able to find a use case:</p>
{% highlight css %}
/* nest() */
nest(".class1", ".class2");          /* Outputs ".class1.class2" */
nest(".class1, .class2", ".class3"); /* Outputs ".class1.class3 .class2.class3" */

/* append-selector */
append-selector(".class1", ".class2"); /* Outputs ".class1.class2" */
append-selector("a, p, li", ".class"); /* Outputs "a.class, p.class, li.class" */
{% endhighlight %}
</section>
<section id="text-replacement">
<h2>Text-replacement <a href="#text-replacement" class="section-anchor">#</a></h2>
http://compass-style.org/reference/compass/typography/text/replacement/
</section>
