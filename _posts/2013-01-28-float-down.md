---
title: "Simulate float: down"
layout: post
comments: true
disqus: http://hugogiraudel.com/blog/float-down
---
<section>
<p>Back in september, some guy exposed a very interesting problem on <a href="http://css-tricks.com/forums/discussion/19610/float-items">CSS-tricks forums</a>. To sum up, he had a list of elements floated to the left. However, he wanted to float items top to bottom on each column and not left to right on each row.</p>
<p>He started with:</p>
<img src="http://img401.imageshack.us/img401/4723/98791854.jpg">
<p>And wanted to end with:</p>
<img src="http://imageshack.us/scaled/landing/88/51843399.jpg">
</section>
<section id="solutions">
<h2>Solutions to the problem<a href="#solutions" class="section-anchor">#</a></h2>
<h3>Flexbox</h3>
<p>Even if I'm not a flexbox expert, I'm pretty confident saying there is a way to do it very easily. The problem with flexbox is that it's not fully compatible so we had to look for another option.</p>
<p>Actually <a href="http://twitter.com/bennettfeely">Bennett Feely</a> did it very nicely already on <a href="http://codepen.io/bennettfeely/pen/firxL">CodePen</a>.</p>
<h3>Manually</h3>
<p>I first managed to do it with <code>:nth-child()</code> selectors, replacing manually each one of the ten elements (<a href="http://jsfiddle.net/VAdT3/1/">JSFiddle</a>). It sucked because it was:</p>
<ul>
<li>Manual,</li>
<li>Dependant of the number of items,</li>
<li>CSS heavy,</li>
<li>Not elegant.</li>
</ul>
<h3>JavaScript</h3>
<p>I was very upset not finding any proper way to do it with CSS so I did it with a mix of CSS and JavaScript (in fact jQuery). I don't know if it's the best way to do it in JavaScript but here is what I came up with:</p>
<pre class="language-javascript"><code>$('.myList > li:odd').remove().appendTo('.myList');</code></pre>
<p>Basically I target one out of two items with <code>:nth-child(even)</code> then remove it from the DOM to finally append it again. This does exactly what was asked so I think it's a decent solution (<a href="http://jsfiddle.net/VAdT3/6/">JSFiddle</a>).</p>
<h3>Margins</h3>
<p>Finally someone came up with a better idea (and probably a better understanding of CSS) than mine with a pure CSS and very elegant solution (<a href="http://codepen.io/wolfcry911/pen/IkBbu">CodePen</a>).</p>
<pre class="language-css"><code>li:nth-child(even) {
	margin: 110px 0 0 -110px; 
	/* Given a 100*100px element with a 10px margin */
}</code></pre>
<p>Wolfcry911 simply used margins to reposition one out of two items. It's a brilliant solution, really.</p>
<p>However it relies on CSS advanced pseudo-selectors so for a deeper browser support, you might want get back to the JavaScript solution.</p>
<h3>Columns (edit 31/01/2013)</h3>
<p>I just noticed <a href="http://codepen.io/estelle">Estelle Weyl</a> did it in another clever way with CSS columns (<a href="http://codepen.io/estelle/pen/zkjrn">CodePen</a>). I'm actually wondering if it's not the better option all in all since it requires only one single CSS line (prefixes omitted).</p> 
<pre class="language-css"><code>ul {
	columns: 5;
}</code></pre>
<p>Congratulations to her for such a smart solution. :)</p>
</section>
<section id="moar">
<h2>Pushing it further<a href="#moar" class="section-anchor">#</a></h2>
<p>A few days ago, Chris Coyier found Wolfcry911's work and <a href="https://twitter.com/chriscoyier/status/295223893516500993">tweeted</a> about it. Someone (in the person of <a href="http://twitter.com/arashmilan">Arash Milani</a>) answered it wasn't possible to do it with more than 2 rows.</p>
<p><strong>CHALLENGE ACCEPTED!</strong> This made me want to give it a shot. Honestly, it took me a few tries and no more than 10 minutes to find a solution for 3 rows.</p>	
<pre class="codepen" data-height="450" data-type="result" data-href="DoAIB" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/DoAIB">Check out this Pen!</a></pre>
<p>Instead of doing <code>:nth-child(even)</code>, we need two different selectors:</p>
<pre class="language-css"><code>li:nth-child(3n+2){
	margin: 120px 0 0 -110px;
	background: limegreen;
}

li:nth-child(3n+3) {
	margin: 230px 0 0 -110px;
	background: crimson;
}</code></pre>
</section>
<section id="sass">
<h2>Automating the process<a href="#sass" class="section-anchor">#</a></h2>
<p>So I found a solution to do it with the number of rows we want, pretty cool. Immediately, I thought about automating this. And guess what? I succeeded.</p>
<h3>Prepare the ground</h3>
<p>First, I had to move everything to em units in order to make the whole thing easier to customize. I also created a few variables:</p>
<pre class="language-scss"><code>$rows: 4; 
$baseline: 10px;
$width: 4em;
$height: 4em;
$margin: 0.4em;</code></pre>
<p>A few explanations about the variables:</p>
<ul>
<li><code>$rows</code> stands for the number of rows you want,</li>
<li><code>$baseline</code> is set as a font-size to the root element (<code>html</code>) in order to be able to use em everywhere,</li>
<li><code>$width</code> is the width of each item; in my demo it equals 100px,</li>
<li><code>$height</code> is the height of each item; in my demo it equals 100px as well,</li>
<li><code>$margin</code> is the gap between each item; I set it to 10% of the size of an item.</li>
</ul>
<p class="note">Note: you may wonder why using 2 different variables for size when one would be enough. This allows you to use non-square items if you want to: try it, it works.</em></p>
<h3>Looping!</h3>
<p>Now let's get to the funny part. I figured out there is some kind of pattern to achieve this and to be honest it took me a while (no pun intended) to create the while loop for this, struggling between my comprehension of the problem and Sass syntax errors. Anyway, this is the main idea:</p>
<pre class="language-scss"><code>$i: $rows; // Initializing the loop

@while $i &gt; 1 {

	li:nth-child(#{$rows}n+#{$i}) {
		$j: $i - 1; // Setting a $i-1 variable

		margin-top: $j * $height + $i * $margin;
		margin-left: -($width + $margin);
	}

	$i: $i - 1;
}</code></pre>
<p>It is pretty tough. Let me show you how it compiles when $rows is set to 4 (other variables remain unchanged):</p>
<pre class="language-scss"><code>li:nth-child(4n+4) {
	margin-top: 13.6em;  // (3 * 4em) + (4 * 0.4em)
	margin-left: -4.4em; // -(4em + 0.4em)
}

li:nth-child(4n+3) {
	margin-top: 9.2em;   // (2 * 4em) + (3 * 0.4em)
	margin-left: -4.4em; // -(4em + 0.4em)
}

li:nth-child(4n+2) {
	margin-top: 4.8em;   // (1 * 4em) + (2 * 0.4em)
	margin-left: -4.4em; // -(4em + 0.4em)
}</code></pre>
<p>I think the pattern should be easier to see now thanks to the comments. For X rows you'll have <code>X-1</code> different selectors starting from <code>:nth-child(Xn+Y)</code> (where X and Y are the same) until Y becomes stricly superior than 1 (so Y equals 2).</p>
</section>
<section id="demo">
<h2>Demo<a href="#demo" class="section-anchor">#</a></h2>
<pre class="codepen" data-height="530" data-type="result" data-href="AxmBK" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/AxmBK">Check out this Pen!</a></pre>
<p>Try changing the number of rows by editing <code>$rows</code> and see the magic happen.</p>
</section>
<section id="final-words">
<h2>Final words<a href="#final-words" class="section-anchor">#</a></h2>
<p>There are still some problems with this method like: what if items have various sizes? Or what if we want different margins? Or what if we set a disproportionate number of rows given the number of items?</p>
<p>I guess we could complicate the whole thing to accept more parameters and be even more flexible but would it worth it? I guess not. <strong>The simple way is to use JavaScript. The funny way is to use Sass.</strong></p>
</section>
<script async src="http://codepen.io/assets/embed/ei.js"></script>