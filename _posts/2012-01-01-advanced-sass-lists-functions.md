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
<section id="selecting">
<h2>Selecting values from list <a href="#selecting">#</a></h2>
<h3>First and last</h3>
<p>Let's start with something very simple: two small functions to target first and last elements of a list. I don't know for you, but I don't really like doing <code>nth($list, length($list))</code>. I'd rather do <code>last($list)</code>.</p>
<pre class="language-scss"><code>$list: a, b, c, d, e, f;
$first: first($list); // a
$last: last($list); // f</code></pre>
<p>Nice, isn't it? Of course these functions are ridiculously simple to write:</p>
<pre class="language-scss"><code>@function first($list) {
  @return nth($list, 1);
}

@function last($list) {
  @return nth($list, length($list));
}</code></pre>
<p>Since all values are also considered as single-item lists in Sass, using both functions on a single-element list will obviously returns the same value.</p>
<h3>Last index of value <code>x</code></h3>
<p>Sass already provides a <code>index()</code> function to retreive the index of a given value in a list. It works well but what if the value is present several times in the list? <code>index()</code> returns the first index.</p>
<p>Good. Now what if we want the last one?</p>
<pre class="language-scss"><code>$list: a, b, c, d, e, a, f;
$first-index: index($list, a); // 1
$last-index: last-index($list, a); // 6</code></pre>
<p>I made two versions of this function: in the first one, the code is simple. In the second one, the code is a little dirtier but performance should be better.</p>
<pre class="language-scss"><code>/**
 * Last-index v1
 * More readable code
 * Slightly worse performance
 */
@function last-index($list, $value) {
  $index: null;

  @for $i from 1 through length($list) {
    @if nth($list, $i) == $value {
      $index: $i;
    }
  }

  @return $index;
}

/**
 * Last-index v2
 * Less beautiful code
 * Better performance
 */
@function last-index($list, $value) {
  @for $i from length($list)*-1 through -1 {
    @if nth($list, abs($i)) == $value {
      @return abs($i);
    }
  }

  @return null;
}</code></pre>
<p>The second version is better because it starts from the end and returns the first occurence it finds instead of looping through all the items from the start. The code is a little ugly because as of today, Sass <code>@for</code> loops can't decrement.</p>
</section>
<section id="adding">
<h2>Adding values to a list <a href="#adding">#</a></h2>
<h3>Prepending value to list</h3>
<p>You already know Sass comes with a built-in function to add values to a list called <code>append()</code>. While it does the job most of the time, there are cases where you need to add new values at the beginning of the list instead of the end. Thus a new <code>prepend()</code> method.</p>
<pre class="language-scss"><code>$list: b, c, d, e, f;
$list: prepend($list, a); // a, b, c, d, e, f</code></pre>
<p>As you can see, the signature is the same as the one for the <code>append()</code> function. Now, let's open the beast; you'll be surprised how simple this is:</p>
<pre class="language-scss"><code>@function prepend($list, $value) {
	@return join($value, $list);
}</code></pre>
<p>Yup, that's all. <code>join()</code> is a built in function to merge two lists, the second being appended to the first. Since single values are considered as lists in Sass, we can safely join our new value with our existing list, resulting in prepending the new value to the list. How simple is that?</p>
<h3>Inserting value at index n</h3>
<p>We can append new values to a list, and now even prepend new values to a list. What if we want to insert a new value at index <code>n</code>? Like this:</p>
<pre class="language-scss"><code>$list: a, b, d, e, f;
/* I want to add "c" as the 3rd index in the list */
$list: insert-at($list, 3, c); // a, b, c, d, e, f</code></pre>
<p>Now let's have a look at the function core:</p>
<pre class="language-scss"><code>@function insert-at($list, $index, $value) {
  $result: ();

  @if $index < 1 {
    @warn "The index has to be a positive integer.";
  }

  @else if $index > length($list) {
    $result: append($list, $value);
  }

  @else {
    @for $i from 1 through length($list) {
      @if $i == $index {
        $result: append($result, $value);
      }
      $result: append($result, nth($list, $i));
    }
  }

  @return $result;
}</code></pre>
<p>Here is what happens: we first make some verifications on <code>$index</code>. If it is strictly lesser than 1, we throw an error. If <code>$index</code> is greater than the length of the list, we simply append the new value to the list. In any other case, we build a new list based on the one we pass to the function (<code>$list</code>). When we get to <code>$index</code> passed to the function, we simply append the new <code>$value</code>.</p>
</section>
<section id="replacing">
<h2>Replacing values from list <a href="#replacing">#</a></h2>
<h3>Replacing value X</h3>
<p>We're good with adding new values to a list. Now what if we want to change values from a list? Like changing all occurences of <code>a</code> into <code>z</code>? Or changing the value at index <code>n</code>? Sass provides nothing for this, so let's do it ourself!</p>
<pre class="language-scss"><code>$list: a, b, r, a, c a, d a, b, r, a;
$list: replace($list, a, u); // u, b, r, u, c a, d a, b, r, u;
$list: replace($list, a, u, true); // u, b, r, u, c u, d u, b, r, u;</code></pre>
<p>As you can see, the function also deals with nested lists if you pass the 4th optional argument to <code>true</code>. At index 5 and 6, we have 2 nested lists where <code>a</code> has been replaced by <code>u</code> in the second example.</p>
<pre class="language-scss"><code>@function replace($list, $old-value, $new-value, $recursive: false) {
  $result: ();

  @for $i from 1 through length($list) {
    @if type-of(nth($list, $i)) == list and $recursive {
      $result: append($result, replace(nth($list, $i), $old-value, $new-value, $recursive));
    }

    @else {
      @if nth($list, $i) == $old-value {
        $result: append($result, $new-value);
      }

      @else {
        $result: append($result, nth($list, $i));
      }
    }
  }

  @return $result;
}</code></pre>
<p>Getting a little more complicated, doesn't it? Don't worry, it's not that hard to understand. For every element in the list (<code>nth($list, $i)</code>), we check whether or not it is a nested list.</p>
<ul>
<li>If it is and <code>$recursive</code> is set to <code>true</code>, we call the <code>replace()</code> function again on the nested list (recursive style!).</li>
<li>Else, we check if the element is strictly the same as the value we want to replace (<code>$old-value</code>).
<ul>
<li>If it is, we append the new value (<code>$new-value</code>).</li>
<li>Else we append the initial value.</li>
</ul>
<p>And there we have a recursive function to replace a given value by another given value in a list and all its nested lists.</p>
<h3>Replacing value at index n</h3>
<p>Now if we want to replace a value at a specific index, it's a lot simpler.</p>
<pre class="language-scss"><code>$list: a, b, z, d, e, f;
$list: replace-at($list, 3, c); // a, b, c, d, e, f</code></pre>
<p>As you can imagine, it works almost the same as the <code>insert-at()</code> function.</p>
<pre class="language-scss"><code>@function replace-at($list, $index, $value) {
  $result: ();

  @for $i from 1 through length($list) {
    @if $i == $index {
      $result: append($result, $value);
    }
    @else {
      $result: append($result, nth($list, $i));
    }
  }

  @return $result;
}</code></pre>
<p>I think the code is kind of self explanatory: we loop through the values of the <code>$list</code> and if the current index (<code>$i</code>) is stricly equivalent to the index at which we want to replace the value (<code>$index</code>) we replace the value. Else, we simply append the initial value.</p> 
</section>
<section id="removing">
<h2>Removing values from list <a href="#removing">#</a></h2>
<h3>Removing values X</h3>
<p>Hey, it's getting pretty cool. We can add values to list pretty much wherever we want. We can replace any value within a list. All we have left is to be able to remove values from list.</p>
<pre class="language-scss"><code>$list: a, b z, c, z, d, z, e, f;
$list: remove($list, z); // a, b, c, d, e, f</code></pre>
<p>Same as for the <code>replace()</code> function, it can be recursive so it works on nested lists as well.</p>
<pre class="language-scss"><code>@function remove($list, $value, $recursive: false) {
  $result: ();

  @for $i from 1 through length($list) {
    @if type-of(nth($list, $i)) == list and $recursive {
      $result: append($result, remove(nth($list, $i), $value, $recursive));
    }

    @else if nth($list, $i) != $value {
      $result: append($result, nth($list, $i));
    }
  }

  @return $result;
}</code></pre>
<p>We check each element of the list (<code>nth($list, $i)</code>); if it is a list and <code>$recursive</code> is <code>true</code>, we call the <code>remove()</code> function on it to deal with nested lists. Else, we simply append the value to the new list as long as it isn't the same as the value we're trying to remove (<code>$value</code>).</p>
<h3>Removing value at index n</h3>
<p>We only miss the ability to remove a value at a specific index.</p>
<pre class="language-scss"><code>$list: a, b, z, c, d, e, f;
$list: remove-at($list, 3); // a, b, c, d, e, f</code></pre>
<p>This is a very easy function actually.</p>
<pre class="language-scss"><code>@function remove-at($list, $index) {
  $result: ();

  @for $i from 1 through length($list) {
    @if $i != $index {
      $result: append($result, nth($list, $i));
    }
  }

  @return $result;
}</code></pre>
<p>We break down the list (<code>$list</code>) to build up the new one, appending all the items except the one that was on the index we want to delete (<code>$index</code>).</p>
</section>
<section id="slicing">
<h2>Slicing a list <a href="#slicing">#</a></h2>
<p>To complete out series of function, what if we could slice a list between two indexes to get only the part we want?</p>
<pre class="language-scss"><code>$list: a, b, c, d, e, f;
$list: slice($list, 3, 5); // c, d, e</code></pre>
<p>The tricky thing with this function is we have to make sure both index do not conflict each other, are in range, and so on. Let's deal with this:</p>
<pre class="language-scss"><code>@function slice($list, $start: 1, $end: length($list)) {
  $result: ();
  $start: if($start <= 0, 1, if($start > length($list), length($list), $start));
  $end: if($end > length($list), length($list), if($end < $start, $start, $end));

  @for $i from $start through $end {
     $result: append($result, nth($list, $i));
  }

  @return $result;
}</code></pre>
<p>We make both <code>$start</code> and <code>$end</code> optional: if they are not specified, we go from the first index (<code>1</code>) to the last one (<code>length($list)</code>).</p>
<p>Then we do our verifications. Let's start with, well, <code>$start</code>:</p>
<ul>
<li>If <code>$start <= 0</code>, we set it to the first index in the list (<code>1</code>)</li>
<li>Else if <code>$start > 0</code>, we compare it to the length of the list (<code>length($list)</code>)
<ul>
<li>If it is greater than the length of the list, we set it to the length of the list</li>
<li>Else if it is lesser or equals to the length of the list, we leave it to its current value</li>
</ul>
<p>Now, we do almost the same thing for <code>$end</code>:</p>
<ul>
<li>If <code>$end > length($list)</code>, we set it to the length of the list</li>
<li>Else if <code>$end <= length($list)</code>, we compare it to <code>$start</code>
<ul>
<li>If it is lesser than <code>$start</code>, we set it to the same value as <code>$start</code></li>
<li>If it is greater than or equals to <code>$start</code>, we leave it to its current value</li>
</ul>
<p>And now we're sure our values are okay, we can loop through lists values from <code>$start</code> to <code>$end</code>, building up a new list from those.</p>
</section>
<section id="reverse">
<h2>Reverse a list <a href="#reverse">#</a></h2>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>I guess that's all I got folks! If you think of anything that could improve any of those functions, be sure to tell. Meanwhile, you can play with <a href="http://codepen.io/HugoGiraudel/pen/loAgq">this pen</a>.</p>
</section>