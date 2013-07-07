---
title: "Future of CSS layout: CSS Grid"
layout: post
comments: true
summary: true
---
<section>
<p>In the last few days/weeks, I have been helping Chris Coyier with <a href="http://css-tricks.com/almanac/">CSS-Tricks' Almanac</a>. It seems he doesn't have enough time to fill the last remaining entries, so we've been a few to help him out by writing them. I have done <a href="http://css-tricks.com/almanac/properties/p/perspective/">perspective</a>, <a href="http://css-tricks.com/almanac/properties/p/perspective-origin/">perspective-origin</a> and <a href="http://css-tricks.com/almanac/properties/g/grid/">grid</a>.</p>
<p>I've to say it's been a real pleasure to do this, mostly because I've learnt literally a ton of stuff. Some people say the best way to learn is through teaching, I can say it's mostly true. </p>
<p>Anyway, if <code>perspective</code> and <code>perspective-origin</code> have been quite easy to do, I must say <code>grid</code> has been a whole another story. This is by far the most complicated thing I have ever seen in CSS. Let me introduce the topic.</p>
</section>
<section id="grid">
<h2>CSS Grid Layout <a href="#grid">#</a></h2>
<p>The <a href="http://www.w3.org/TR/css3-grid-layout/">CSS Grid Layout</a> is currently a W3C Working Draft aiming at fixing issues with older layout techniques by providing a better way to achieve complex interface design. Indeed, each solution we (have) use(d) to make web pages has at least a flaw:</p>
<ul>
	<li><strong>HTML tables</strong>: markup dependant, not flexible</li>
	<li><strong>float</strong>: clearing</li>
	<li><strong>inline-blocks</strong>: spacing between blocks</li>
</ul>
<p>The CSS Grid Layout consists on defining a 2-dimensional grid in which the children can be positioned as desired. The main benefits of this technique are:</p>
<ul>
	<li>source order independant (!)</li>
	<li>no need for widths or heights</li>
	<li>no need for floats or inline-blocks</li>
	<li>no need for margins to space columns from each others</li>
	<li>easily adjustable when it comes to responsive</li>
</ul>
<p>The basic example would be something like this: my <code>.wrapper</code> is my grid; <code>.header</code> will all columns of the first row; <code>.main</code> will by displayed in the second row and the first column; <code>.sidebar</code> in the second row, second column; and <code>.footer</code> in the third row, all columns.</p> 
</section>
<section id="complicated">
<h2>What's complicated? <a href="#complicated">#</a></h2>
<blockquote class="pull-quote--right">Specifications are definitely not for random people.</blockquote>
<p>First, <strong>reading specifications</strong>. If a spec author ever reads this, I am sorry; but the specifications are definitely not for random people. I believe they are mostly made for browser makers, and they are probably very well writen but for a guy like me, it's way too complicated. Unfortunately, I had to dig deep into the spec.</p>
<p>What has been difficult as well is that the only supported browser &mdash;as of writing&mdash; is Internet Explorer 10 (mostly because 3 of 5 authors of the Grid spec are from Microsoft). And I believe they started implementing the module in their browser engine a while ago, resulting in some inconsistencies regarding the spec which keeps moving.</p>
<p>Not only their implementation is at a very early stage (about half the spec is currently supported), but it also differs from the spec at some point. Among other things:</p>
<ul>
	<li><code>grid-rows</code> and <code>grid-columns</code> have been renamed in <code>grid-definition-rows</code> and <code>grid-definition-columns</code></li>
	<li><code>grid-row</code> is supposed to be a shorthand for <code>grid-row-position</code> and <code>grid-row-span</code>. The current implementation in Internet Explorer 10 for <code>grid-row</code> should be the one for <code>grid-row-position</code> (which isn't supported). Same goes for <code>grid-column</code>.</li>
</ul>
<p>This kind of stuff definitely doesn't make things easier.</p>
<p>Otherwise, the module is quite complicated by itself. It involves about 15 new properties, a new unit, and more important: a whole new way of thinking. Fortunately, the currently supported part of the spec is quite easily understandable and it has been very fun to play around with.</p>
</section>
<section id="example">
<h2>A little example <a href="#example">#</a></h2>
<p>What I've found astonishing is the very little amount of required CSS to achieve a complex layout. I counted: with no more than 10 lines of CSS, I've been able to make a 3-columns layout including 2 fixed-size columns, with full-width header and footer. Oh, and source order independant. Please have a look at the following markup:</p>
<pre class="language-markup"><code>&lt;div class="wrapper"&gt;
	&lt;article class="main" &gt;My awesome content here &lt;/article&gt;
	&lt;footer class="footer"&gt;Some informations here  &lt;/footer&gt;
	&lt;header class="header"&gt;My site title goes here &lt;/header&gt;
	&lt;aside class="sidebar"&gt;Here is my side content &lt;/aside&gt;
	&lt;aside class="annexe" &gt;Some more side content  &lt;/aside&gt;
&lt;/div&gt;</code></pre>
<p>Now the CSS. Pay attention to the number of lines:</p>
<pre class="language-css"><code>.wrapper {
	display: grid;
	grid-columns: 200px 15px 1fr 15px 100px;
	grid-rows: (auto 15px)[2] auto;
}

.header, .footer { grid-column-span: 5; }

.sidebar, 
.main, 
.annexe { grid-row: 3; }
.header { grid-row: 1; }
.footer { grid-row: 5; }

.sidebar { grid-column: 1; }
.main    { grid-column: 3; }
.annexe  { grid-column: 5; }</code></pre>
<p>Done. <strong>10 lines. No float. No inline-block. No height. No width. No margin.</strong> And if you want to make everything nice on small devices, it will take no more than a couple of more lines (8 in this example). </p>
<p class="note">Note: I won't explain the syntax in this article. If you want to understand how works the Grid Layout, please have a look at <a href="http://css-tricks.com/almanac/properties/g/grid/">CSS-Tricks' Almanac entry</a>.</p>
</section>
<section id="flexbox">
<h2>What about Flexbox? <a href="#flexbox">#</a></h2>
<blockquote class="quote"><p>Are Flexbox and Grid both solutions to the same problem or do they both have their own use case?</p>
&mdash; <a href="https://twitter.com/Lezz/status/319376112679522304">@Lezz</a></blockquote>
<p>This question comes from Twitter. However I've been questioning myself regarding this while making the entry for CSS-Tricks. Let's have a look at both specifications:</p>
<blockquote class="quote"><p>The <strong>Flexbox specification</strong> describes a CSS box model optimized for user interface design. In the flex layout model, the children of a flex container can be laid out in any direction, and can “flex” their sizes, either growing to fill unused space or shrinking to avoid overflowing the parent. Both horizontal and vertical alignment of the children can be easily manipulated. Nesting of these boxes (horizontal inside vertical, or vertical inside horizontal) can be used to build layouts in two dimensions.</p></blockquote>
<blockquote class="quote"><p><strong>Grid Layout</strong> contains features targeted at web application authors. The Grid can be used to achieve many different layouts. It excels at dividing up space for major regions of an application, or defining the relationship in terms of size, position, and layer between parts of a control built from HTML primitives.</p>
<p>Like tables, the Grid enables an author to align elements into columns and rows, but unlike tables, the Grid doesn’t have content structure, and thus enables a wide variety of layouts not possible with tables. For example, the children of the Grid can position themselves with Grid lines such that they overlap and layer similar to positioned elements.</p>
<p>In addition, the absence of content structure in the Grid helps to manage changes to layout by using fluid and source order independent layout techniques. By combining media queries with the CSS properties that control layout of the Grid and its children, authors can adapt their layout to changes in device form factors, orientation, and available space, without needing to alter the semantic nature of their content.</p></blockquote>
<p>So as I understand this, <strong>the Grid layout is "macro" while the Flexbox module is "micro".</strong> I think Grid will be perfect to organize the layout structure with high-level elements whereas Flexbox will be best-suited for some modules that require specific alignments, ordering and so like a fluid navigation for example.</p>
<p><a href="https://twitter.com/kyle_keeling">Kyle Keeling</a> wrote <a href="http://www.outsidethebracket.com/understanding-the-difference-between-css3-flexbox-grid-layout/">an entry</a> about this a couple of months ago, explaing what he thinks is the difference between Flexbox and Grid.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<blockquote class="pull-quote--right">I have been amazed by its efficiency.</blockquote>
<p>For having <a href="http://codepen.io/HugoGiraudel/pen/2befd6d225b69912af8561f7cb020124">played</a> with the module for hours, I can tell it is quite promising. I have been amazed by its efficiency, and I even could try to mix it with CSS preprocessors: it rocks. The fact it's fully number-based makes it very easy to use in <a href="http://codepen.io/HugoGiraudel/pen/fb0e46cde228e5437993ba1305459a22">loops</a>, <a href="http://codepen.io/HugoGiraudel/pen/aCliz">mixins and functions</a>.</p>
<p>Unfortunately, it is way too soon to use the Grid layout in a real-life project, especially since the browser support is restricted to Internet Explorer 10. However, I've heard the support is coming to Firefox and Chrome nightly builds, so I think we will be able to safely play around with it in a few months from now.</p>
<p>Then let's hope in a year from now, the browser support will be great in all modern browsers (Chrome, Firefox, Opera, IE10+, including some mobile browsers) giving us the ability to use it in projects that don't aim at old browsers.</p>
<p>Meanwhile, you can still experiment with it on Internet Explorer. Here are a couple of useful resources on the topic:</p>
<ul>
	<li><a href="http://www.w3.org/TR/css3-grid-layout/">CSS Grid Layout in the CSS specifications</a></li>
	<li><a href="http://msdn.microsoft.com/en-us/library/ie/hh673533(v=vs.85).aspx">CSS Grid Layout by Microsoft</a></li>
	<li><a href="http://ie.microsoft.com/testdrive/Graphics/hands-on-css3/hands-on_grid.htm">Microsoft's CSS Grid layout playground</a></li>
	<li><a href="http://24ways.org/2012/css3-grid-layout/">CSS Grid Layout by 24Ways</a></li>
	<li><a href="http://www.alsacreations.com/article/lire/1388-css3-grid-layout.html">CSS Grid Layout by Raphael Goetter (FR)</a></li>
</ul>
</section>