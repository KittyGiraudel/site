---
title: A CSS challenge
layout: post
comments: true
disqus: http://hugogiraudel.com/blog/css-challenge.html
---
<section>
<p>Yesterday night, I've seen something in my Twitter timeline which excited my curiosity: a CSS challenge. It was proposed by <a href="https://twitter.com/goetter">Raphael Goetter</a>, a famous French front-end developer on <a href="http://blog.goetter.fr/post/36084887039/tes-pas-cap-premiere-edition" title="CSS challenge on Raphael Goetter's blog">his blog</a>.</p>
<p>Since I'm sure you'll be interested in a little CSS riddle (you will, will you?), let me tell you what this is about.</p>
<img src="http://i.imgur.com/fZkkw.jpg" alt="CSS challenge">
<p>Will you be able to do this (I'm talking about the small line behind the text) following the restrictions below?</p>
<ul>
<li>Only one single element (<code>h1</code>) in the body element</li>
<li>Element horizontally centered in its parent</li>
<li>The line is vertically centered on the text</li>
<li>Both the font size and the text have to be editable without having to edit the line</li>
<li>Body and/or the element can have a background (image) without changing anything else</li>
<li>No HTTP request, no image, no JavaScript</li>
<li>The best browser support the better of course</li>
</ul>
<p>I can't wait to see the way you'll figure this out guys. I personally found something with a few downsides sadly. I'm sure some of you will be able to find a kick-ass solution. ;)</p>
<p>Good luck!</p>
</section>
<section id="solutions">
<h2>[Edit] Solutions (November 24th, 2012) <a href="#solutions" class="section-anchor">#</a></h2>
<p>Thanks for participating! There have been a couple of answers for this trick. Druid of Lûhn proposed <a href="http://codepen.io/Druid-of-Luhn/details/sclvk">something</a> which works but sadly it's pretty awful for SEO since it involves an empty <code>h1</code> tag.</p>
<p>Joshua Hibbert <a href="http://jsfiddle.net/joshnh/3PG8j/">used linear gradients</a> to do it (so <a href="http://codepen.io/raphaelgoetter/pen/dGxvL">did</a> Raphael Goetter). This is a clever technique I thought about but didn't give a try. My experience with gradients is not that good.</p>
<p>Here is the way I <a href="http://jsfiddle.net/HugoGiraudel/cyeGM/1/">did it</a>:</p>
<pre class="language-css"><code>body {
	text-align: center;
	overflow: hidden;
	background: #ffa;
}

h1 {
	display: -moz-inline-box;
	display: inline-block;
	*display: inline;
	*zoom: 1;
	position: relative;
	font-size: 30px;
	margin-top: 20px;
}

h1:after,
h1:before {
	content: "";
	position: absolute;
	height: 1px;
	width: 1000px;
	top: 50%;
	right: 100%;
	background: black;
}

h1:after { left: 100%; }</code></pre>
<p>So basically, I used both pseudo-elements to create the line. To place them, I set the title to inline-block, and the parent (<code>body</code>) text-align to center.</p>
<p>Sadly, a few things suck with this technique, even if it works pretty well:</p>
<ul>
<li>Parent needs to have <code>text-align: center</code></li>
<li>Parent needs to have <code>overflow: auto</code></li>
<li>It requires 2 pseudo-elements</li>
<li>Pseudo-elements need to have a large width to reach the edge of the screen (~1000px to cover about all screen sizes)</li>
</ul>
<p>Hopefully the browser support is pretty good, at least way better than the gradient version:</p>
<ul>
<li>IE8+</li>
<li>Firefox 2+</li>
<li>Chrome</li>
<li>Safari 3+</li>
<li>Opera 9+</li>
<li>iOS Safari 3+</li>
<li>Opera Mini 5+</li>
<li>Android Browser 2+</li>
<li>Blackberry browser 7+</li>
<li>Opera Mobile 10+</li>
<li>Chrome for Android</li>
<li>Firefox for Android</li>
</ul>
<p>But since it's only a tiny design improvement, I'll definitely go with the gradient version on a live project. Thanks for participating. I'll try to drop another challenge soon. :)</p>
</section>