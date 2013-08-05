---
title: Advanced Sass lists functions
layout: post
preview: true
comments: false
---
<section>
<p>A couple of weeks ago, I wrote a small guide to <a href="http://hugogiraudel.com/2013/07/15/understanding-sass-lists/">understand Sass lists</a>. I hope you've read it and learnt things from it!</p>
<p>Anyway, a couple of days ago I stumbled upon a comment in a Sass issue listing a couple of advanced Sass functions to deal with lists. I thought the idea quite appealing so I made my own functions for this. In my opinion, it is always interesting to go deeper than "it just works", so here is a short blog post to explain my code.</p>
</section>
<section id="prepend">
<h2>Prepending value to list <a href="#prepend">#</a></h2>
<p>Sass comes with a built-in function to add values to a list called <code>append()</code>. While it does the job most of the time, there are cases where you need to add new values at the beginning of the list instead of the end. Thus a new <code>prepend()</code> method.</p>
<pre class="language-scss"><code>$list: b, c, d, e, f;
$list: prepend($list, a); // a, b, c, d, e, f</code></pre>
<p>As you can see, the signature is the same as the one for the <code>append()</code> function. Now, let's open the beast; you'll be surprised how simple this is:</p>
<pre class="language-scss"><code>@function prepend($haystack, $value) {
	@return join($value, $haystack);
}</code></pre>
<p>Yup, that's all. <code>join()</code> is a built in function to merge two lists, the second being appended to the first. Since single values are considered as lists in Sass, we can safely join our new value with our existing list, resulting in prepending the new value to the list. How simple is that?</p>
</section>
<section id="insert-at">
<h2>Inserting value at index n <a href="#insert-at">#</a></h2>
<p>We can append new values to a list, and now even prepend new values to a list. What if we want to insert a new value at index <code>n</code>? Like this:</p>
<pre class="language-scss"><code>$list: a, b, d, e, f;
/* I want to add "c" as the 3rd index in the list */
$list: insert-at($list, 3, c); // a, b, c, d, e, f</code></pre>
<p>Now let's have a look at the function core:</p>
<pre class="language-scss"><code>@function insert-at($haystack, $needle, $value) {
	$new: ();
	@for $i from 1 through length($haystack) {
		@if $i == $needle {
			$new: append($new, $value);
		}
		$new: append($new, nth($haystack, $i));
	}
	@return $new;
}</code></pre>
<p>Here is what happens: we build a new list based on the one we pass to the function (<code>$haystack</code>). When we get to the index passed to the function (<code>$needle</code>), we simply append the new value (<code>$value</code>).</p>
</section>
<section id="replace">
<h2>Replace values from list <a href="#replace">#</a></h2>
<p>We're good with adding new values to a list. Now what if we want to change values from a list? Like changing all occurences of <code>a</code> into <code>z</code>? Or changing the value at index <code>n</code>? Sass provides nothing for this, so let's do it ourself!</p>
<pre class="language-scss"><code>$list: a, b, r, a, c a, d a, b, r, a;
$list: replace($list, a, u); // u, b, r, u, c u, d u, b, r, u;</code></pre>
<p>As you can see, the function also deals with nested lists. At index 5 and 6, we have 2 nested lists where <code>a</code> has been replaced by <code>u</code>.</p>
<pre class="language-scss"><code>@function replace($haystack, $needle, $value) {
	$new: ();
	@for $i from 1 through length($haystack) {
		@if type-of(nth($haystack, $i)) == list {
			$new: append($new, replace(nth($haystack, $i), $needle, $value));
		}

		@else {
			@if nth($haystack, $i) == $needle {
				$new: append($new, $value);
			}

			@else {
        		$new: append($new, nth($haystack, $i));
			}
		}
	}
	@return $new;
}</code></pre>
<p>Getting a little more complicated, doesn't it? Don't worry, it's not that hard to understand. For every element in the list (<code>nth($haystack, $i)</code>), we check whether or not it is a nested list.</p>
<ul>
<li>If it is, we call the <code>replace()</code> function again on the nested list (recursive).</li>
<li>Else, we check if the element is strictly the same as the value we want to replace (<code>$needle</code>).
<ul>
<li>If it is, we append the new value (<code>$value</code>).</li>
<li>Else we append the initial value.</li>
</ul>
<p>And there we have a recursive function replace a given value by another given value in a list and all its nested lists.</p>
</section>
<section id="replace-at">
<h2>Replacing value at index n <a href="#replace-at">#</a></h2>
<p>Now if we want to replace a value at a specific index, it's a lot simpler.</p>
<pre class="language-scss"><code>$list: a, b, z, d, e, f;
$list: replace-at($list, 3, c); // a, b, c, d, e, f</code></pre>
<p>As you can imagine, it works almost the same as the <code>insert-at()</code> function.</p>
<pre class="language-scss"><code>@function replace-at($haystack, $needle, $value) {
	$new: ();
	@for $i from 1 through length($haystack) {
		@if $i == $needle {
			$new: append($new, $value);
		}
		@else {
			$new: append($new, nth($haystack, $i));
		}
	}
	@return $new;
}</code></pre>
<p>I think the code is kind of self explanatory: we loop through the values of the list and if the current index (<code>$i</code>) is stricly equivalent to the index at which we want to replace the value (<code>$needle</code>) we replace the value. Else, we simply append the initial value.</p> 
</section>
<section id="remove">
<h2>Removing value from list <a href="#remove">#</a></h2>
<p>Hey, it's getting pretty cool. We can add values to list pretty much wherever we want. We can replace any value within a list. All we have left is to be able to remove values from list.</p>
<pre class="language-scss"><code>$list: a, b z, c, z, d, z, e, f;
$list: remove($list, z); // a, b, c, d, e, f</code></pre>
<p>Same as for the <code>replace()</code> function, it is recursive so it works on nested lists as well.</p>
<pre class="language-scss"><code>@function remove($haystack, $needle) {
	$new: ();
	@for $i from 1 through length($haystack) {
		@if type-of(nth($haystack, $i)) == list {
			$new: append($new, remove(nth($haystack, $i), $needle));
		}
    
		@else if nth($haystack, $i) != $needle {
			$new: append($new, nth($haystack, $i));
		}
	}
	@return $new;
}</code></pre>
<p>We check each element of the list (<code>nth($haystack, $i)</code>); if it is a list, we call the <code>remove()</code> function on it to deal with nested lists. Else, we simply append the value to the new list as long as it isn't the same as the value we're trying to remove (<code>$needle</code>).</p>
</section>
<section id="remove-at">
<h2>Removing value at index n <a href="#remove-at">#</a></h2>
<p>We only miss the ability to remove a value at a specific index.</p>
<pre class="language-scss"><code>$list: a, b, z, c, d, e, f;
$list: remove-at($list, 3); // a, b, c, d, e, f</code></pre>
<p>This is a very easy function actually.</p>
<pre class="language-scss"><code>@function remove-at($haystack, $needle) {
	$new: ();
	@for $i from 1 through length($haystack) {
		@if $i != $needle {
			$new: append($new, nth($haystack, $i));
		}
	}
	@return $new;
}</code></pre>
<p>We break down the list (<code>$haystack</code>) to build up the new one, appending all the items except the one that was on the index we want to delete (<code>$needle</code>).</p>
</section>
<section id="slice">
<h2>Slicing a list <a href="#slice">#</a></h2>
<p>To complete out series of function, what if we could slice a list between two indexes to get only the part we want?</p>
<pre class="language-scss"><code>$list: a, b, c, d, e, f;
$list: slice($list, 3, 5); // c, d, e</code></pre>
<p>The tricky thing with this function is we have to make sure both index do not conflict each other, are in range, and so on. Let's deal with this:</p>
<pre class="language-scss"><code>@function slice($haystack, $start: 1, $end: length($haystack)) {
	$new: ();
	$start: if($start <= 0, 1, if($start > length($haystack), length($haystack), $start));
	$end: if($end > length($haystack), length($haystack), if($end < $start, $start, $end));

	@for $i from $start through $end {
		$new: append($new, nth($haystack, $i));
	}
	@return $new;
}</code></pre>
<p>We make both <code>$start</code> and <code>$end</code> optional: if they are not specified, we go from the first index (<code>1</code>) to the last one (<code>length($haystack)</code>).</p>
<p>Then we do our verifications. Let's start with, well, <code>$start</code>:</p>
<ul>
<li>If <code>$start <= 0</code>, we set it to the first index in the list (<code>1</code>)</li>
<li>Else if <code>$start > 0</code>, we compare it to the length of the list (<code>length($haystack)</code>)
<ul>
<li>If it is greater than the length of the list, we set it to the length of the list</li>
<li>Else if it is lesser or equals to the length of the list, we leave it to its current value</li>
</ul>
<p>Now, we do almost the same thing for <code>$end</code>:</p>
<ul>
<li>If <code>$end > length($haystack)</code>, we set it to the length of the list</li>
<li>Else if <code>$end <= length($haystack)</code>, we compare it to <code>$start</code>
<ul>
<li>If it is lesser than <code>$start</code>, we set it to the same value as <code>$start</code></li>
<li>If it is greater than or equals to <code>$start</code>, we leave it to its current value</li>
</ul>
<p>And now we're sure our values are okay, we can loop through lists values from <code>$start</code> to <code>$end</code>, building up a new list from those.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>I guess that's all I got folks! If you think of anything that could improve any of those functions, be sure to tell. Meanwhile, you can play with <a href="http://codepen.io/HugoGiraudel/pen/loAgq">this pen</a>.</p>
</section>