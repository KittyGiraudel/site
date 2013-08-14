---
title: A couple of Sass functions
layout: post
preview: false
comments: true
published: true
---

<section>
<p>We can do awesome things with Sass. It really pushes CSS to an upper level. More than that, it is so much fun to make Sass mixins and functions. Everytime I do something new, I'm like “whoaaa” even if it's a useless thing.</p>
<p>Mixins are usually quite easy to deal with. Functions are a little more underground in Sass. So what if we go through a couple of functions (including useless ones) to see how we can build an efficient ones?</p>
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
<p>There has been <a href="https://github.com/nex3/sass/issues/533">a request</a> to include this function to Sass core but Chris Eppstein declined it. According to him, there is no good usecase for such a thing, and most of existing usages are bad understanding of how units work. So, no <code>strip-unit()</code> into Sass!</p>
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
<li>If the value is greater than the maximum value, it returns <code>$max</code></li>
<li>If the value is lesser than or equals to the maximum value and
<ul>
<li>if the value is lesser than the minimum value, it returns <code>$min</code></li>
<li>if the value is greater than or equals to the minimum value, it returns <code>$value</code></li>
</ul>
</li>
</ol>
<p>What I like with this method is it is very concise and damn efficient. With nested <code>if()</code>, there is no need of conditional statements, everything lies in one single line.</p>
<p>Now what's the point of this function? I guess that could be useful when you want to be sure the number you pass to a function is between two values, like a percentage for color functions.</p>
<pre class="language-scss"><code>$pc: percentage(clamp($value, 0, 100));
$darkColor: darken($color, $pc);</code></pre>
</section>
<section id="unit-conversion">
<h2>Unit conversion <a href="#unit-conversion">#</a></h2>
<p>This one is a function by Chris Eppstein himself in order to convert an angle into another unit (because <a href="http://codepen.io/HugoGiraudel/pen/rdgse">there are 4 different ways of declaring an angle in CSS</a>). This one converts angles but you could probably do this for anything fixed (px, in, cm, mm).</p>
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
<p>Here is how it works: you give it a value and the unit you want to convert your value into (let's say <code>30grad</code> into <code>turn</code>). If both are recognized as valid units for the function, the current value is first converted into degrees, then converted from degrees into the asked unit. Damn clever and pretty useful!</p>
<pre class="language-scss"><code>$angle-deg: 30deg;
$angle-rad: convert-angle($angle-deg, rad); // 0.5236rad
</code></pre>
</section>
<section id="import-once">
<h2>Import once <a href="#import-once">#</a></h2>
<p>When you are working on very big Sass projects, you sometimes wish there was a <code>@import-once</code> directive. As of today, if you import twice the same file, its content is outputed twice. Sounds legit, but still sucks.</p>
<p>While we wait for <a href="https://github.com/nex3/sass/issues/353#issuecomment-18626307">Sass 4.0</a> which will bring the brand new <code>@import</code> (solving this issue), we can rely on this little function I found in <a href="https://github.com/nex3/sass/issues/156">an issue</a> on Sass' GitHub repo.</p>
<pre class="language-scss"><code>$imported-once-files: ();

@function import-once($filename) {
    @if index($imported-once-files, $filename) {
        @return false;
    }

    $imported-once-files: append($imported-once-files, $filename);
    @return true;
}

@if import-once("_SharedBaseStuff.scss") {
    /* ...declare stuff that will only be imported once... */
}</code></pre>
<p>The idea is pretty simple: everytime you import a file, you store its name in a list (<code>$imported-once-files</code>). If its name is stored, then you can't import it a second time.</p>
<p>It took me a couple of minutes to get the point of this function. Actually, this is how you should probably use it:</p>
<pre class="language-scss"><code>/* _variables.scss: initialize the list */
$imported-once-files: ();

/* _functions.scss: define the function */
@function import-once($filename) {
    @if index($imported-once-files, $filename) {
        @return false;
    }

    $imported-once-files: append($imported-once-files, $filename);
    @return true;
}

/* styles.scss: import files */
@import "variables"; /* Sass stuff only */
@import "functions"; /* Sass stuff only */
@import "component";

/* _component.scss: wrap content depending on function return */
@if import-once('component') {
  .element {
    /* ... */
  }
}</code></pre>
<p>Now if you add another <code>@import "component"</code> in <code>styles.scss</code>, since the whole content of <code>_component.scss</code> is wrapped in a conditional statement calling the function, its content won't be outputed a second time. Clever.</p>
<blockquote class="pull-quote--right">We cannot import a file in a conditional statement.</blockquote>
<p>You probably wonder what prevents us from doing something like this:</p>
<pre class="language-scss"><code>/* styles.scss - this doesn't work */
@if import-once('component') {
  @import "component";
}</code></pre>
<p>Unfortunately, we cannot import a file in a conditional statement, <a href="https://github.com/nex3/sass/issues/451">this just don't work</a>. Here is the reason mentioned by Chris Eppstein:</p>
<blockquote class="quote"><p>It was never intended that <code>@import</code> would work in a conditional context, this makes it impossible for us to build a dependency tree for recompilation without fully executing the file -- which would be simply terrible for performance.</p></blockquote>
</section>
<section id="mapping">
<h2>Mapping with nested lists <a href="#mapping">#</a></h2>
<p>Sass 3.3 will introduce <em>maps</em> which come very close to what we often call <em>associative arrays</em>. The point is to have a list of <code>key => value</code> pairs. It is already possible to emulate some kind of map workaround with nested lists.</p>
<p>Let's have a look at the following list <code>$list: a b, c d, e f;</code>. <code>a</code> is kind of mapped of to <code>b</code>, <code>c</code> to <code>d</code>, and so on. Now what if you want to retreive <code>b</code> from <code>a</code> (the value from the key) or even <code>a</code> from <code>b</code> (the key from the value, which is less frequent)? This is where our function is coming on stage.</p>
<pre class="language-scss"><code>@function match($haystack, $needle) {
  @each $item in $haystack {
    $index: index($item, $needle);
    @if $index { 
      $return: if($index == 1, 2, $index);
      @return nth($item, $return); 
    }
  }
  @return false;
}</code></pre>
<p>Basically, the function loops through the pairs; if <code>$needle</code> you gave is found, it checks whether it has been found as the key or the value, and returns the other. So with our last example:</p>
<pre class="language-scss"><code>$list: a b, c d, e f;
$value: match($list, e); /* returns f */
$value: match($list, b); /* returns a */
$value: match($list, z); /* returns false */</code></pre>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>That's all I got folk. Do you have any cool Sass functions you sometimes use, or even made just for the sake of it?</p>
</section>