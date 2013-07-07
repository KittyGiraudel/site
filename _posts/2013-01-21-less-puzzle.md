---
title: A little LESS puzzle
layout: post
comments: true
disqus: http://hugogiraudel.com/blog/less-puzzle
--- 
<section>          
<p>Hi guys! What do you think of a little puzzle to wake up your neurons? I think I've found something tricky enough to worth a blog post and a little challenge about it.</p>
<p>First of all, this will be a LESS puzzle, so if you're really unfamiliar with this CSS preprocessor, I think you might feel a bit lost here. Sorry! :(</p>
</section>
<section id="requirements">
<h2>What are the requirements <a href="#requirements" class="section-anchor">#</a></h2>
<p>So the main idea is to enable a Google Web Font using a variable to have only one occurrence of the font name without leaving the stylesheet. Let me explain the requirements a little better:</p>
<ol>
<li>Pick a Google font <a href="http://www.google.com/webfonts">here</a>,</li>
<li>Click on "Quick use", then "@import", and copy the given URL to your clipboard,</li>
<li>Open <a href="http://codepen.io">CodePen</a>, click on "New pen" and pick LESS as a CSS preprocessor,</li>
<li>Create a variable for the font name, like this <code>@my-font: "NameOfMyFont";</code>,</li>
<li>Import the font from Google CDN with <code>@import url()</code> using the variable as the font name in the URL,</li>
<li>Give any element (<code>&lt;h1&gt;</code> would be good) this font.</li>
</ol>
<p><strong>Bonus:</strong> make it work with compound font names (such as "Roboto Condensed").</p>
<p>Accustomed to SASS like me will wonder where is the difficulty in this little exercise. Problem is LESS is extremely annoying when it comes to both url() and string concatenation. I partially covered the topic in <a href="less-to-sass">this article</a>. </p>
<pre class="language-scss"><code>/* SASS version */

$my-font: "Merriweather";
$url: "http://fonts.googleapis.com/css?family=#{$my-font}";
@import url($url);

h1 { font-family: $my-font; }</code></pre>
<p>I struggled about one hour on this and couldn't make it work. All my respect to the one who will find the solution.</p>
<p>Good luck!</p>
</section>
<section id="conclusion">
<h2><span style="text-decoration:line-through">Solution</span> Conclusion (edit January 26th, 2013) <a href="#conclusion" class="section-anchor">#</a></h2>
<p>Loïc Giraudel (secondarily my dear brother) pointed out <a href="https://github.com/cloudhead/less.js/issues/410">a thread on GitHub</a> mentioning that what I called a "puzzle" is in fact a real bug reported more than a year ago.</p>
<p>However as of today, <strong>there is no fix for this neither is there a workaround</strong>. So unless anyone comes up with a solution, this is currently not possible unfortunately.</p>
<p>Plus, the guys behind LESS imply fixing this bug would require a large amount of work and deep code restructuration.</p>
<p>No luck.</p> 
</section>