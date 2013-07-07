---
title: Dig deep into CSS linear gradients
layout: post
guest: Ana Tudor
comments: true
codepen: true
disqus: http://hugogiraudel.com/blog/css-gradients
summary: true
numberedFigures: true
---      
<section>          
<p class="explanation">The following is a guest post by <a href="http://twitter.com/thebabydino" target="blank">Ana Tudor</a>. She is passionate about experimenting and learning new things. Also she loves maths and enjoys playing with code.</p>
<p>I had no idea how powerful CSS gradients could be until late 2011, when I found the <a href="http://lea.verou.me/css3patterns/" target="blank">CSS3 Patterns Gallery</a> made by Lea Verou. The idea that you can obtain many shapes using just gradients was a starting point for many CSS experiments I would later do.</p>
<p>Recently, while browsing through the demos on CodePen, I came across <a href="http://codepen.io/bitmap/pen/eBbHt" target="blank">a CSS3 Color Wheel</a> and thought <q>hey, I could do it with just one element and gradients</q>. So I did and the result can be seen <a href="http://codepen.io/thebabydino/pen/hkxGp" target="blank">here</a>. And now I'm going to explain the reasoning behind it.</p>
<figure class="figure--right">
<img src="/images/css-gradients__rainbow_wheel_screen.gif" alt="" />
<figcaption>Rainbow wheel made of CSS</figcaption>
</figure>
</section>
<section id="breaking-it-down">
<h2>Breaking it down <a href="#breaking-it-down" class="section-anchor">#</a></h2>
<p>The wheel - or you can think of it as a pie - is first split horizontally into two halves and then each half is split into five slices, so there are ten slices in total. Which means that the <a href="http://en.wikipedia.org/wiki/Central_angle" target="blank">central angle</a> for each slice is <code><a href="http://www.mathopenref.com/degrees.html" target="blank">360°</a>/10 = 36°</code>.</p>
<p>The pen below shows graphically how to layer the multiple backgrounds. It also has a pause button so that the infinite animation doesn't turn into a performance problem.</p>
<pre class="codepen" data-height="340" data-type="result" data-href="Kuvom" data-user="thebabydino" data-safe="true"><code></code><a href="http://codepen.io/thebabydino/pen/qgoBL" target="blank">Check out this Pen!</a>s</pre>
<p>For both the original pen and this helper demo, the interesting part is this one:</p>
<pre class="language-css"><code>background: 
linear-gradient(36deg, #272b66 42.34%, transparent 42.34%),
linear-gradient(72deg, #2d559f 75.48%, transparent 75.48%),
linear-gradient(-36deg, #9ac147 42.34%, transparent 42.34%) 100% 0,
linear-gradient(-72deg, #639b47 75.48%, transparent 75.48%) 100% 0, 
linear-gradient(36deg, transparent 57.66%, #e1e23b 57.66%) 100% 100%,
linear-gradient(72deg, transparent 24.52%, #f7941e 24.52%) 100% 100%,
linear-gradient(-36deg, transparent 57.66%, #662a6c 57.66%) 0 100%,
linear-gradient(-72deg, transparent 24.52%, #9a1d34 24.52%) 0 100%, 
#43a1cd linear-gradient(#ba3e2e, #ba3e2e) 50% 100%;
background-repeat: no-repeat;
background-size: 50% 50%;</code></pre>
<p>We first specify the nine gradient backgrounds, their positioning and the <code>background-color</code> using the shorthand <code>background</code> syntax.</p>
</section>
<section id="background-shorthand">
<h2>The background shorthand <a href="#background-shorthand" class="section-anchor">#</a></h2>
<p>For anyone who doesn't remember, the background layers are listed from the top one to the bottom one and the <code>background-color</code> is specified together with the bottom layer. A background layer includes the following:</p>
<ul>
<li><code>&lt;background-image&gt;</code>
<li><code>&lt;background-position&gt;</code> / <code>&lt;background-size&gt;</code>
<li><code>&lt;background-repeat&gt;</code>
<li><code>&lt;background-attachment&gt;</code>
<li><code>&lt;background-origin&gt;</code>
<li><code>&lt;background-clip&gt;</code>
</ul>
<p>If the <code>background-position</code> is not specified, then the <code>background-size</code> isn't specified either. Also, since <code>background-origin</code> and <code>background-clip</code> both need the same kind of value (that is, a box value like <code>border-box</code> or <code>content-box</code>), then, if there is only one such value, that value is given to both <code>background-origin</code> and <code>background-clip</code>. Other than that, any value except the one for <code>background-image</code> can be missing and then it is assumed to be the default.</p>
<p>Since we have nine background layers and we want to have the same non-default values for <code>background-repeat</code> and <code>background-size</code> for all of them, we specify these outside the shorthand so that we don't have to write the same thing nine times.</p>
<blockquote class="pull-quote--right">Safari doesn't support background-size inside the shorthand.</blockquote>
<p>In the case of <code>background-size</code>, there is also another reason to do that: Safari doesn't support <code>background-size</code> inside the shorthand and, until recently (up to and including version 17), Firefox didn't support that either. Also, two values should be always given when the <code>background-image</code> is a gradient, because giving it just one value is going to produce different results in different browsers (unless that one value is 100%, in which case it might as well be missing as that is the default).</p>
<p>The <code>background-color</code> is set to be a light blue (<code>#43a1cd</code>) and then, on top of it, there are layered nine non-repeating (<code>background-repeat: no-repeat</code> for all) background images created using CSS gradients. All nine of them are half the <code>width</code> and the <code>height</code> of the element (<code>background-size: 50% 50%</code>).</p>
<p>The bottom one - horizontally centred (<code>50%</code>) and at the bottom (<code>100%</code>) - is really simple. It's just a gradient from a firebrick red to the same color (<code>linear-gradient(#ba3e2e, #ba3e2e)</code>), so the result is simply a solid color square.</p>
<p>The other eight are gradients from <code>transparent</code> to a solid color or from a solid color to <code>transparent</code>. Four of them look like double slices, having a central angle of <code>2*36° = 72°</code>, but half of each such double slice gets covered by another single slice (having a central angle of <code>36°</code>).</p>
</section>
<section id="about-linear-gradients">
<h2>A few things about linear gradients <a href="#about-linear-gradients" class="section-anchor">#</a></h2>
<p>In order to better understand gradient angles and how the <code>%</code> values for color stops are computed, let's see how a linear gradient is defined. Hopefully, this demo that lets you change the gradient angle helps with that - just click the dots.</p>
<pre class="codepen" data-height="640" data-type="result" data-href="qgoBL" data-user="thebabydino" data-safe="true"><code></code>
<a href="http://codepen.io/thebabydino/pen/qgoBL" target="blank">Check out this Pen!</a></pre>
<p>The <em>gradient angle</em> is the angle - measured clockwise - between the vertical axis and the <em>gradient line</em> (the blue line in the demo). This is for the new syntax, which is not yet supported by WebKit browsers (however, <a href="https://bugs.webkit.org/show_bug.cgi?id=67166" target="blank">this is going to change</a>). The old syntax measured angles just like on the <a href="http://en.wikipedia.org/wiki/Unit_circle" target="blank">trigonometric unit circle</a> (counter-clockwise and starting from the horizontal axis).</p>
<p class="note">Note: coming from a mathematical background, I have to say the old way feels more natural to me. However, the new way feels consistent with other CSS features, like rotate transforms, for which the angle values are also clockwise.</p>
<p>What this means is that we (almost always) have different angle values in the standard syntax and in the current WebKit syntax. So, if we are not using something like <a href="http://leaverou.github.com/prefixfree/" target="blank">-prefix-free</a> (which I do almost all the time), then we should to be able to compute one when knowing the other. That is actually pretty simple. They are going in opposite directions, so the formula for one includes the other with a minus sign. Also, there is a <code>90°</code> difference between them so this is how we get them: </p>
<pre class="language-scss"><code>newSyntax = 90° - oldSyntax;
oldSyntax = 90° - newSyntax;</code></pre>
<p class="note">Note: if no gradient angle or destination side is specified (for example, <code>linear-gradient(lime, yellow)</code>), then the resulting gradient is going to have a gradient angle of <code>180°</code>, not <code>0°</code>.</p>
<p>All the points on a line that is <a href="http://www.mathopenref.com/perpendicular.html" target="blank">perpendicular</a> on the gradient line have the same color. The perpendicular from the corner in the quadrant that's opposite to the quadrant of the angle is the <code>0%</code> line (the crimson line in the demo) and its intersection with the gradient line is the <em>starting point</em> of the gradient (let's call it <code class="var">S</code>). The perpendicular from the opposite corner (the one in the same quadrant as the gradient angle) is the <code>100%</code> line (the black line in the demo) and its intersection with the gradient line is the <em>ending point</em> of the gradient (let's call it <code class="var">E</code>).</p>
<figure class="figure">
<img src="/images/css-gradients__gradient.png" alt="" />
<figcaption>Gradient with gradient line, 0% line and 100% line</figcaption>
</figure>
<p>In order to compute the <code>%</code> value of any point <code class="var">P</code>, we first draw a perpendicular on the gradient line starting from that point. The intersection between the gradient line and this perpendicular is going to be a point we'll name <code class="var">I</code>. We now compute the ratio between the lengths of <code class="var">SI</code> and <code class="var">SE</code> and the <code>%</code> value for that point is going to be <code>100%</code> times that ratio.</p>
</section>
<section id="putting-it-all-to-work">
<h2>Putting it all to work <a href="#putting-it-all-to-work" class="section-anchor">#</a></h2>
<p>Now let's see how we apply this for the particular case of the rainbow wheel.</p>
<p>Let's first consider a gradient that creates a single slice (one with a central angle of <code>36°</code>). This is a square image (see below), with a blue slice having an angle of <code>36°</code> in the lower part. We draw the horizontal and vertical axes through the point <code class="var">O</code> at which the diagonals intersect. We draw a perpendicular from that point to the line that separates the dark blue part from the transparent part. This is going to be the gradient line. As it can be seen, there is a <code>36°</code> angle between the vertical axis and the gradient line, so the angle of the gradient is <code>36°</code>.</p>
<figure class="figure">
<img src="/images/css-gradients__slice_1.png" alt="" />
<figcaption>Applying the theory for the first slice</figcaption>
</figure>
<p>We now draw a perpendicular from the corner of the square in the quadrant that is opposite to the one in which the gradient angle is found. This is the <code>0%</code> line. Then we draw a perpendicular from the corner of the square in the same quadrant (<code>Q I</code>) as the gradient angle - this is the <code>100%</code> line.</p>
<p>The <a href="http://www.mathopenref.com/square.html" target="blank">intersection of the diagonals of a square splits each one of them into two</a>, so <code class="var">AO</code> and <code class="var">BO</code> are equal. The <code class="var">BOE</code> and <code class="var">AOS</code> angles are equal, as they are <a href="http://www.mathopenref.com/anglesvertical.html" target="blank">vertical angles</a>. Moreover, the <code class="var">BOE</code> and <code class="var">AOS</code> triangles are <a href="http://www.mathopenref.com/righttriangle.html" target="blank">right triangles</a>. All these three <a href="http://en.wikipedia.org/wiki/Triangle#Similarity_and_congruence" target="blank">mean that the two triangles are also congruent</a>. Which in turn means that <code class="var">SO</code> and <code class="var">EO</code> are equal, so the length of <code class="var">SE</code> is going to be twice the length of <code class="var">EO</code> or twice the length of <code class="var">SO</code>.</p>
<figure class="figure--right">
<img src="/images/css-gradients__right_triangle_trigonometric_functions.png" alt="" />
<figcaption>A right angled triangle and how to compute sin and cos functions</figcaption>
</figure>
<p class="note">Note: before moving further, let's go through a couple of trigonometry concepts first. The longest side of a right-angled triangle is the one opposing that right angle and it's called the <a href="http://www.mathopenref.com/hypotenuse.html" target="blank">hypotenuse</a>. The other two sides (the ones forming the right angle) are called the <a href="http://en.wikipedia.org/wiki/Cathetus" target="blank">catheti</a> of the right triangle. The <a href="http://www.mathopenref.com/sine.html" target="blank">sine</a> of an acute angle in a right triangle is the ratio between the cathetus opposing that angle and the hypotenuse. The <a href="http://www.mathopenref.com/cosine.html" target="blank">cosine</a> of the same angle is the ratio between the adjacent cathetus and the hypothenuse.</p>
<figure class="figure--right">
<img src="/images/css-gradients__slice_1_BOE.png" alt="" />
<figcaption>The BOE triangle</figcaption>
</figure>
<p>Computing the length of <code class="var">EO</code> in the right triangle <code class="var">BOE</code> is really simple. If we take the length of the side of the square to be <code class="var">a</code>, then the length of the half diagonal <code class="var">BO</code> is going to be <code class="var">a*sqrt(2)/2</code>. The <code class="var">BOE</code> angle is equal to the difference between the <code class="var">BOM</code> angle, which is <code>45°</code>, and the <code class="var">EOM</code> angle, which is <code>36°</code>. This makes <code class="var">BOE</code> have <code>9°</code>. Since <code class="var">BO</code> is also the hypotenuse in the right triangle <code class="var">BOE</code>, the length of <code class="var">EO</code> is going to be <code>(<span class='var'>a</span>*sqrt(2)/2)*cos9°</code>. Which makes the length of <code class="var">SE</code> be <code class="var">a*sqrt(2)*cos9°</code>.</p>
<figure class="figure--right">
<img src="/images/css-gradients__slice_1_APD.png" alt="" />
<figcaption>The APD triangle</figcaption>
</figure>
<p>We now draw a perpendicular from <code class="var">A</code> to the <code class="var">PI</code> line. <code class="var">ASID</code> is a rectangle, which means that the length of <code class="var">SI</code> equals the length of <code class="var">AD</code>. We now consider the rectangular triangle <code class="var">APD</code>. In this triangle, <code class="var">AP</code> is the hypotenuse and has a length of <code class="var">a</code>. This means that <code class="var">AD</code> is going to have a length of <code class="var">a*sin36°</code>. But <code class="var">SI</code> is equal to <code class="var">AD</code>, so it also has a length of <code class="var">a*sin36°</code>.</p>
<p>Since we now know both <code class="var">SI</code> and <code class="var">SE</code>, we can compute their ratio. It is <code>sin36°/(sqrt(2)*cos9°) = 0.4234</code>. So the <code>%</code> value for the color stop is <code>42.34%</code>.</p>
<p>In this way, we've arrived at: <code>linear-gradient(36deg, #272b66 42.34%, transparent 42.34%)</code></p>
<p>Computing the <code>%</code> values for the other background layers is done in the exact same manner.</p>
</section>
<section id="automating">
<h2>Automating all this <a href="#automating" class="section-anchor">#</a></h2>
<p>By now, you're probably thinking it sucks to do so many computations. And it must be even worse when there are more gradients with different angles...</p>
<p>Even though for creating the rainbow wheel experiment I did compute everything on paper... I can only agree with that! This is why I made a really basic little tool that computes the <code>%</code> for any point inside the gradient box. You just need to click inside it and the <code>%</code> value appears in a box at the bottom center.</p>
<pre class="codepen" data-height="320" data-type="result" data-href="FDbdB" data-user="thebabydino" data-safe="true"><code></code><a href="http://codepen.io/thebabydino/pen/FDbdB">Check out this Pen!</a></pre>
<p>You can change the dimensions of the gradient box and you can also change the gradient itself. It accepts the newest syntax for linear gradients, with angle values in degrees, <code>to &lt;side&gt;</code> values or no value at all for describing the direction of the gradient.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words" class="section-anchor">#</a></h2>
<p>CSS gradients are really powerful and understanding how they work can be really useful for creating all sorts of imageless textures or shapes that would be difficult to obtain otherwise.</p>
<blockquote class="quote">
<img src="http://www.gravatar.com/avatar/bee436794e066a5423040cf673c7506f?s=200" alt="Ana Tudor's gravatar" class="pull-image--left">
<p>Ana Tudor excels in CSS, especially when it comes to CSS transforms and well, as you may have seen, CSS gradients.</p>
<p>You definitely should follow her on <a href="http://twitter.com/thebabydino" target="blank">Twitter</a> or have a look at <a href="http://about.me/thebabydino" target="blank">her profile</a> to know more about her and what she does.</p>
</blockquote>
</section>