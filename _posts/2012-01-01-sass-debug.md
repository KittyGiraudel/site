---
title: How I made a Sass debug function
preview: true
comments: false
layout: post
published: true
---

<section>
<p>You know how much I love playing with Sass lists. I think they are the most powerful and useful feature in Sass. It's a shame there is so few functions to deal with them. This is why I made <a href="https://github.com/Team-Sass/Sass-list-functions">SassyLists</a>.</p>
<p>Most importantly, I always wanted a <code>console.log()</code> for Sass. You know, something to debug a variable, a list, a value, whatever... There is the <code>@debug</code> function but somehow it didn't completely satisfy me. Plus, there is no console on <a href="http://codepen.io">CodePen.io</a> and since this is where I do most of my experiments I needed something else.</p>
<p>So I rolled up my sleeves, got my hands dirty and made my own Sass debug function. If you don't want to read but simply want to dig into the code, check <a href="http://codepen.io/HugoGiraudel/pen/unyBH">this pen</a>.</p>
</section>
<section id="stringify-a-list">
<h2>Stringify a list <a href="#stringify-a-list">#</a></h2>
<p>Everything started when I realized a function to stringify a list. At first, my point was to turn a regular Sass list into a JSON-like string in order to be able to output it into a CSS pseudo-element.</p>
<p>It was pretty easy to do.</p>
<pre class="language-scss"><code>@function debug($list) {
	$result: unquote("[ ");
    
    @each $item in $list {
    	@if length($item) > 1 {
    		$result: unquote("#{$result}#{debug($item)}");
    	}

    	@else {
    		$result: unquote("#{$result}#{$item}");
    	}

    	@if index($list, $item) != length($list) {
     		$result: unquote("#{$result}, ");
    	}
    }
    
    $result: unquote(" ]");
    @return quote($result);
}</code></pre>
<p>This simple functions turns a Sass list into a readable string. It also deals with nested lists. Please have a look at the following example:</p>
<pre class="language-scss"><code>$list: a, b, c, d e f, g, h i, j;
body:before {
	content: debug($list);
    // [ a, b, c, [ d, e, f ], g, [ h, i ], j ]
}</code></pre>
<p>Okay, this is pretty neat, right? However everytime I wanted to debug a list, I had to create a <code>body:before</code> rule, set the content property and all... I wanted something easier.</p>
</section>
<section id="mixinify-the-function">
<h2>Mixinify the function <a href="#mixinify-the-function">#</a></h2>
<p>Basically I wanted to go `@include debug($list)` and have everything displayed. Perfect usecase for a mixin, right?</p>
<pre class="language-scss"><code>@mixin debug($list) {
	body:before {
        content: debug($list, $type)              !important;
    
    	display: block                            !important;
    	margin: 1em                               !important;
    	padding: .5em                             !important; 
    
    	background: #EFEFEF                       !important;
    	border: 1px solid #DDD                    !important;
    	border-radius: .2em                       !important;
    
    	color: #333                               !important;
    	font: .75em/1.5 "Courier New", monospace  !important;
    	text-shadow: 0 1px white                  !important;
    	white-space: pre-wrap                     !important;
    }
}</code></pre>
<p>In case you wonder, I bash <code>!important</code> in case <code>body:before</code> is already defined for something. Basically I force this pseudo-element to behave exactly how I want.</p>
<p>So. This mixin doesn't do much more than styling the output of the @debug function. So now instead of having to open the <code>body:before</code> rule, the content property and all, we just need to go <code>@include debug($list)</code>.</p>
<p>Pretty neat, but I wanted moar.</p>
</section>
<section id="improving-the-function">
<h2>Improving the function <a href="#improving-the-function">#</a></h2>
<p>I wanted two things: 1) explode the list into several lines to make it easier to read; 2) add the ability to display the type of each value in the list.</p>
<h3>Deal with line breaks</h3>
<p>If you are a reader of <a href="http://thesassway.com">TheSassWay.com</a>, you might have stumbled upon my article <a href="http://thesassway.com/advanced/math-sequences-with-sass">Math sequences with Sass</a>
</section> in which I explain how I created famous math sequences in Sass and how I managed to display them with nothing more than CSS.</p>
</section>