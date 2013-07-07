---
title: The ultimate PX/REM mixin
layout: post
comments: true
---
<section id="rem">
<h2>About REM <a href="#rem" class="section-anchor">#</a></h2>
<p>Everybody loves relative units. They are handy and help us solve daily problems. However the most used one (<code>em</code>) presents some issues, especially when it comes to nesting. </p>
<p>As an example, setting both <code>p</code> and <code>li</code> tags font-size to <code>1.2em</code> may seem fine. But if you ever happen to have a paragraph inside a list item, it would result in a font-size 1.44 times (1.2 * 1.2) bigger than parent font-size, and not 1.2 as wished.</p>
<p>To avoid this, a new unit has been created: <a href="http://snook.ca/archives/html_and_css/font-size-with-rem"><code>rem</code></a>. It stands for <em>root em</em>. Basically, instead of being relative to the font-size of its direct parent, it's relative to the font-size defined for the <code>html</code> element.</p>
<p>You may have already seen something like this in frameworks, demo, blog posts and such:</p>
<pre class="language-css"><code>html {
	font-size: 62.5%
}

body {
	font-size: 1.6rem;
}</code></pre>
<p>Because all browsers have a default font-size of <code>16px</code>, setting the font-size to 62.5% on the html element gives it a font-size of 10px (10 / 16 * 100 = 62.5) without explicitely setting it to <code>10px</code> which would prevent zooming. Then, setting a font-size of 1.6rem on the body element simply results in a font-size of <code>16px</code>, cascading through the whole DOM tree.</p>
<p>Then, if I want an element to have like a <code>28px</code> font-size, I simply have to do <code>.element { font-size: 2.8rem; }</code>, no matter the size of its parent.</p>
<p>Everything is great, however <a href="http://caniuse.com/#feat=rem">rem isn't supported in all browsers</a>, especially not in Internet Explorer 8, which is still required in most projects. It means we have to <strong>give a fallback</strong> for this browser.</p>
</section>
<section id="mixin">
<h2>Mixin to the rescue! <a href="#mixin" class="section-anchor">#</a></h2>
<p>Having to define twice the font-size property everytime you have to set the size of a text element sucks. This is the moment you'd like to have a wonderful mixin handling everything for you. Well, <strong>WISH GRANTED!</strong></p>
<h3>About the mixin</h3>
<p>There are already many mixins handling <code>px</code> fallback for <code>rem</code> usage, most of them do it very well. However this one pushes things a step further. It is inspired by <a href="https://github.com/drublic/Sass-Mixins/blob/master/rem.scss">this rem mixin</a> by <a href="https://twitter.com/drublic">Hans Christian Reinl</a>, revamped by myself to make it even more awesome. Here are the features:</p>
<ul>
<li>Accepts either <code>px</code> or <code>rem</code> as an input value</li>
<li>Accepts (almost) any property as an input, not only font-size</li>
<li>Accepts multiple values, like <code>10px 20px</code> (for padding or margin as an example)</li>
</ul>
<h3>Let's open the beast</h3>
<pre class="language-scss"><code>html {
	font-size: 62.5%; /* 1 */
}

@function parseInt($n) { /* 2 */
  @return $n / ($n * 0 + 1);
}

@mixin rem($property, $values) {
  $px : (); /* 3 */
  $rem: (); /* 3 */
  
  @each $value in $values { /* 4 */
   
    @if $value == 0 or $value == auto { /* 5 */
      $px : append($px , $value);
      $rem: append($rem, $value);
    }
    
    @else { 
      $unit: unit($value);    /* 6 */
      $val: parseInt($value); /* 6 */
      
      @if $unit == "px" {  /* 7 */
        $px : append($px,  $value);
        $rem: append($rem, ($val / 10 + rem));
      }
      
      @if $unit == "rem" { /* 7 */
        $px : append($px,  ($val * 10 + px));
        $rem: append($rem, $value);
      }
    }
  }
  
  @if $px == $rem {     /* 8 */
    #{$property}: $px;  /* 9 */
  } @else {
    #{$property}: $px;  /* 9 */
    #{$property}: $rem; /* 9 */
  }
}</code></pre>	
<p>This may be a bit rough so let me explain it:</p>
<ol>
<li>The mixin relies on a baseline of <code>10px</code></li>
<li>The mixin relies on a function to parse the integer from a value with a unit</li>
<li>We define a list of values for both units</li>
<li>We iterate through each value in the given parameter <code>$values</code></li>
<li>If the value is either <code>auto</code> or <code>0</code>, we append it to the list as-is</li>
<li>If the value has a unit, we split it to get both the unit and the raw value</li>
<li>We append according values to the lists depending on the unit of the given value</li>
<li>If the two lists are the same, we ouput only one (like <code>margin-top: 0</code>)</li>
<li>We output the result</li>
</ol>
<p class="note">Thanks to <a href="http://twitter.com/movingprimates">Moving Primates</a> to improve the mixin by adding step 8. ;)</p>
<h3>Usage</h3>
<p>Using it is pretty straightforward:</p>
<pre class="language-scss"><code>html {
	font-size: 62.5%;
}

body {
	@include rem(font-size, 1.6rem);
	@include rem(padding, 20px 10px);
}</code></pre>
<p>... outputs:</p>
<pre class="language-css"><code>html {
	font-size: 62.5%;
}

body {
	font-size: 16px; 	/* Fallback for IE8 */
	font-size: 1.6rem;
	padding: 20px 10px; /* Fallback for IE8 */
	padding: 2rem 1rem;
}</code></pre>
<h3>Remaining issues</h3>
<p>There are still some issues with this mixin:</p>
<ul>
<li>Doesn't work with all properties (border shorthand among others)</li>
<li>Doesn't fallback if you input a wrong value (wrong unit or unitless value as an example)</li>
<li>Relies on a defined baseline; however this is easily fixed by adding a <code>$baseline</code> parameter to the mixin</li>
<li>Relies on a <code>parseInt()</code> function; I've proposed it to Compass, let's hope they add it anytime soon</li>
</ul>
<p>If you ever happen to find a decent solution to fix one, I'll be glad to know and add it!</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words" class="section-anchor">#</a></h2>
<p>That's pretty much it folks. I'd be glad to hear your opinion on this and improve it with your ideas. :)</p>
<p>If you want a playground to test and hack, please feel free to fork <a href="http://codepen.io/HugoGiraudel/pen/xsKdH">my pen</a>.</p>
</section>