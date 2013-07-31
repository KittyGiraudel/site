---
title: A couple of Sass functions
layout: post
preview: true
comments: false
---
<section>
<p>We can do awesome things with Sass. It really pushes CSS to an upper level. More than that, it is so much fun to make Sass mixins and functions. Everytime I do something new, I'm like “whoaaa” even if it's a useless thing.</p>
<p>Mixins are usually quite easy to deal with. Functions are a little more underground in Sass. So what if we go through a couple of functions (including useless one) to see how we can build an efficiant function?</p>
</section>
<section id='strip-unit'>
<h2>Strip unit function <a href="#strip-unit">#</a></h2>
<p>If you build mixins or just like to play around the syntax, you may have already faced a case where you'd need to strip the unit from a number. This is not very complicated:</p>
<pre class="language-scss"><code>@function strip-unit($value) {
	@return $value / ($value * 0 + 1);
}</code></pre>
<p>It might look weird at first but it's actually pretty logical: to get a number without its unit, you need to divide it by 1 of the same unit. To get <code>42</code> from <code>42em</code>, you need to divide <code>42em</code> by <code>1em</code>.</p>
<p>So we divide our number by the same number multiplied by 0 to which we then add 1. With our example, here is what happen: <code>42em / 42em * 0 + 1</code>, so <code>42em / 0em + 1</code> so, <code>42em / 1em</code> so <code>42</code>.</p>
<pre class="language-scss"><code>@function strip-unit($value) {
	@return $value / ($value * 0 + 1);
}

$length : 42em;
$int    : strip-unit($length); // 42</code></pre>
<p>There has been a request to include this function to Sass code but Chris Eppstein declined it. According to him, there is no good usecase for such a thing, and most of existing usages are bad understanding of how units work. So, no <code>strip-unit()</code> into Sass!</p>
</section>
<section id="clamp">
<h2>Clamp a number <a href="#clamp">#</a></h2>
<p>I found this function in a <a href="https://github.com/nex3/sass/pull/402">Sass issue</a> and was pretty amazed by its efficiency. All credits to its author.</p>
<p>Anyway, this is a function to clamp a number. Clamping a number means restricting it between min and max values.</p>
<ul>
<li><code>4</code> clamped to <code>1-3</code> equals <code>3</code>.</li>
<li><code>-5</code> clamped to <code>1-10</code> equals <code>1</code>.</li>
<li><code>42</code> clamped to <code>10-100</code> equals <code>42</code>.</li>
</ul>
<pre class="language-scss"><code>@function clamp($value, $min, $max) {
  @return if($value > $max, $max, if($value < $min, $min, $value));
}</code></pre>
<p>To understand this function, you have to understand the <code>if()</code> function. <code>if()</code> is a function mimicing the well known one-line conditional statement: <code>var = condition ? true : false</code>. The first parameter of the <code>if()</code> function is the condition, the second one is the result if condition is true, and the first one is the value if condition is false.</p>
<p>Now back to our clamp function, here is what is going on:</p>
<ol>
<li>If the value is greather than the maximum value, we return max</li>
<li>If the value is lesser than or equals to the maximum value
<ul>
<li>If the value is lesser than the minimum value, we return min</li>
<li>If the value is equals greater than or equals to minimum value, we return value</li>
</ul>
</li>
</ol>
<p>What I like with this method is it is very concise and damn efficient. With nested <code>if()</code> function, there is no need of conditional statements, everything lies in one single line.</p>
<p>Now what's the point of this function? I guess that could be useful when you want to be sure the number you pass to a function is between two values, like a percentage for color functions.</p>
<pre class="language-scss"><code>$value: percentage(clamp($value, 0, 100));
$darkColor: darken($color, $value);</code></pre>
</section>
<section id="unit-conversion">
<h2>Unit conversion <a href="#unit-conversion">#</a></h2>
<p>This one is a function by Chris Eppstein himself in order to convert a unit into another one. This one converts units for angles but you could probably do this for anything fixed (px, in, cm, mm).</p>
<pre class="language-scss"><code>@function convert-angle($value, $unit) {
  $convertable-units: deg grad turn rad;
  $conversion-factors: 1 10grad/9deg 1turn/360deg 3.1415926rad/180deg;
  @if index($convertable-units, unit($value)) and index($convertable-units, $unit) {
    @return $value
             / nth($conversion-factors, index($convertable-units, unit($value)))
             * nth($conversion-factors, index($convertable-units, $unit));
  } @else {
    @warn "Cannot convert #{unit($value)} to #{$unit}";
  }
}</code></pre>
<p>Here is how it works: you give it a value and the unit you want to convert your value into (let's say <code>30grad</code> into <code>turn</code>). If both are recognized as valid units for the function, calculations are made to return the new value into the asked unit.</p>
</section>