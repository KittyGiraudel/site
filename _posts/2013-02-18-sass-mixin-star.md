---
title: Sass-ify a CSS shape
layout: post
comments: true
summary: true
---
<section>          
<p>A couple of days ago, <a href="http://twitter.com/thebabydino">Ana Tudor</a> showed me how she managed to do a <a href="http://codepen.io/thebabydino/pen/DmklE">pure CSS 6-point star</a> with a single element.</p>
<p>To be truely honest, I wasn’t impressed that much since I am pretty familiar with Ana’s work which is always amazing. If you haven’t seen <a href="http://stackoverflow.com/users/1397351/ana">her 3D geometric shapes</a> made of pure CSS, then you definitely should.</p>
<figure class="figure--right">
<img alt="" src="/images/sass-mixin-star__css-star.png">
<figcaption>A 6-points star mixin made with CSS</figcaption>
</figure>
<p>Anyway, when I saw this I thought it could be fun to make a <a href="http://codepen.io/HugoGiraudel/pen/LkoGE">Sass version</a> of it to clean the code and ease the use. Let me show you what I ended up with.</p>
</section>
<section id="shape">
<h2>Understand the shape <a href="#shape" class="section-anchor">#</a></h2>
<p>The first thing was to understand how Ana managed to achieve such a shape with a single element (and 2 pseudo-elements). Long story short:  <strong>chained CSS transforms</strong>.</p>
<figure class="figure--right">
<img src="/images/sass-mixin-star__rhombius.png" alt="">
<figcaption>3 rhombius = a 6-points star</figcaption>
</figure>
<p>Basically she stacks the element and its 2 pseudo-elements on top of each other after applying several chained transforms to each of them to have the appropriate shape (a <a href="http://www.mathopenref.com/rhombus.html">rhombus</a>).</p>
<p>Instead of covering everything in here, I let you have a look at <a href="http://codepen.io/thebabydino/full/ca5fdb3582a6a27e4d3988d6d90952cb">this very clear explanation</a> by Ana herself on CodePen.</p>
<p class="note">Note: we can do it with one single pseudo-element with the <a href="http://davidwalsh.name/css-triangles">border shaping trick</a> but the hover doesn't feel right, and without pseudo-element with linear gradients.</p>
</section>
<section id="compute-the-height">
<h2>Compute the height <a href="#compute-the-height" class="section-anchor">#</a></h2>
<p>I quickly noticed the height and the width of the main element were different. The width is a randomly picked number (10em), but the height seemed to be computed by some calculation since it was 8.66em.</p>
<p>At this point, I was already able to handle a mixin to create the star, but the user had to set both the width and the height. Yet, since the height has to be calculated, it wasn’t right. How is the user supposed to know the appropriate height for the width he set?</p>
<p>The user couldn’t figure this out and neither could I. So I asked Ana how to compute the height of the element based on the width. After a few complicated explanations, she finally gave me the formula (explanation <a href="http://codepen.io/thebabydino/full/ca5fdb3582a6a27e4d3988d6d90952cb">here</a>).</p>
<pre class="language-javascript"><code>function computeHeight(x, skewAngle) { 
  return Math.sin((90 - skewAngle) * Math.PI / 180) * x 
}</code></pre>
<p>Okay, this is JavaScript but it is a good start. However this returns a radian value, which is not what we want. We want degrees. So the correct function has to be this one:</p>
<pre class="language-javascript"><code>function computeHeight(x, skewAngle) { 
  return Math.sin(90 - skewAngle) * x 
}</code></pre>
<blockquote class="pull-quote--right">I had never heard of any <code>sin()</code> function in Sass.</blockquote>
<p>From there, I knew how to get the height from the width, I only had to turn this into SCSS. First problem: <em>sin()</em>. I had never heard of any <code>sin()</code> function in Sass. Damn it.</p>
<p>After a little Google search, I stumbled upon <a href="https://github.com/adambom/Sass-Math/blob/master/math.scss">a not-documentated-at-all library</a> to use advanced math functions in Sass (including <code>sin()</code>, <code>exp()</code>, <code>sqrt()</code>, and much more). Seemed good enough so I gave it a try.</p>
<p>It turned out the <code>power()</code> function (called in the <code>sin()</code> one) was triggering a Sass error. I tried a few things but finally couldn’t make it work. So I did something unusual... Looked at the 2nd page on Google. And bam, <a href="http://compass-style.org/reference/compass/helpers/math/">the Holy Grail</a>!</p>
<p>Compass has built-in functions for advanced math calculation including <code>sin()</code>. Isn’t that great? Like really awesome? Building the Sass function was a piece of cake:</p>
<pre class="language-scss"><code>@function computeHeight($x, $skewAngle) { 
  @return sin(90deg - $skewAngle) * $x;
}</code></pre>
<p>This worked like a charm. So <strong>given only the width, Sass was able to calculate the according height.</strong></p>
</section>
<section id="units">
<h2>Make any unit usable <a href="#units" class="section-anchor">#</a></h2>
<p>So everything was already working great but I forced the user to give a em-based unit which sucked. I wanted to make any unit available knowing that the <code>computeHeight()</code> function requires and returns a unitless value. Basically I had to:</p>
<ol>
<li>get the value given by the user</li>
<li>split it to get both the integer and the unit</li>
<li>store the unit</li>
<li>pass the integer to the <code>computeHeight()</code> function</li>
<li>get the result</li>
<li>apprend the unit to it</li>
</ol>
<p>I had a look in the Sass documentation and I found two related built-in function:</p>
<ul>
<li><a href="http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html#unitless-instance_method"><code>unitless(number)</code></a> returns a boolean wether the value has a unit or not</li>
<li><a href="http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html#unit-instance_method"><code>unit(number)</code></a> returns the unit of the value</li>
</ul>
<p>The first is useless in our case, but the second one is precisely what we need to store the unit of the value given by the user. However we still have no way to parse the integer from a value with a unit. At least not with a built-in function. A <a href="http://stackoverflow.com/a/12335841">quick run on Stack Overflow</a> gave me what I was looking for:</p>
<blockquote class="quote"><p>You need to divide by 1 of the same unit. If you use unit(), you get a string instead of a number, but if you multiply by zero and add 1, you have what you need:</p></blockquote>
<pre class="language-scss"><code>@function strip-units($number) {
  @return $number / ($number * 0 + 1);
}</code></pre>
<p>Do not ask me why it works or how does it work, I have absolutely no idea. This function makes strictly no sense yet it does what we need.</p>
<p>Anyway, at this point we can set the size in any unit we want, could it be <code>px</code>, <code>rem</code>, <code>vh</code>, <code>cm</code>, whatever.
</section>
<section id="improvements">
<h2>Improve tiny bits <a href="#improvements" class="section-anchor">#</a></h2>
<p>Last but not least, Ana used the <a href="http://xiel.de/webkit-fix-css-transitions-on-pseudo-elements/">inherit hack</a> to enable transition on pseudo-elements. She asked me if we had a way in Sass to assign the same value to several properties.</p>
<p>Of course we have, mixin to the rescue!</p>
<pre class="language-scss"><code>@mixin val($properties, $value) {
  @each $prop in $properties { 
    #{$prop}:  #{$value};
  }
}</code></pre>
<p>You give this mixin a <a href="http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#lists">list</a> of properties you want to share the same value and of course the value. Then, for each property in the list, the mixin outputs the given value. In our case:</p>
<pre class="language-scss"><code>&:after, &:before {
  $properties: width, height, background;
  @include val($properties, 'inherit');
}</code></pre>
<p>... outputs:</p>
<pre class="language-scss"><code>.selector:before, .selector:after {
  width      : inherit;
  height     : inherit;
  background : inherit;
}</code></pre>
<p>It’s really no big deal. We could totally write those 3 properties/value pairs, but it is great to see what’s possible with Sass, isn’t it?</p>
</section>
<section id="code">
<h2>Full code <a href="#code" class="section-anchor">#</a></h2>
<p>Here is the full code for the mixin. As you can see, it is really not that big (especially since Ana's original code is very light).</p>
<pre class="language-scss"><code>@mixin val($properties, $value) {
  @each $prop in $properties { 
    #{$prop}: #{$value};
  }
}

@function computeHeight($x, $skewAngle) { 
  @return sin(90deg - $skewAngle) * $x;
}

@function strip-units($number) {
  @return $number / ($number * 0 + 1);
}

@mixin star($size) {
  $height: computeHeight(strip-units($size), 30deg);
  
  width: $size;
  height: #{$height}#{unit($size)};
  position: relative;
  
  @include transition(all .3s);
  @include transform(rotate(-30deg) skewX(30deg));
    
  &:before, 
  &:after {
    $properties: width, height, background;
    content: '';
    position: absolute;
    @include val($properties, 'inherit');
  }
    
  &:before { 
    @include transform(skewX(-30deg) skewX(-30deg)); 
  }
  &:after { 
    @include transform(skewX(-30deg) rotate(-60deg) skewX(-30deg)) 
  }
}</code></pre>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words" class="section-anchor">#</a></h2>
<p>Well guys, that’s pretty much it. You have a perfectly working <a href="http://codepen.io/HugoGiraudel/pen/LkoGE">Sass mixin</a> to create customized single-element 6-point stars in CSS. Pretty neat, right?</p>
<p>Using it couldn't be simpler:</p>
<pre class="language-scss"><code>.star {
  margin: 5em auto;
  background: tomato;
  @include star(10em);
  
  &:hover {
    background: deepskyblue;
  }
}</code></pre>
<p>Thanks (and congratulations) to <a href="http://twitter.com/thebabydino">Ana Tudor</a> for creating such a shape which made me do some cool Sass stuff.</p>
</section>