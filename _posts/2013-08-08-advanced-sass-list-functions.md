---
title: Advanced Sass list functions
layout: post
comments: true
summary: true
---

<section>
<p>A couple of weeks ago, I wrote a small guide to <a href="http://hugogiraudel.com/2013/07/15/understanding-sass-lists/">understand Sass lists</a>. I hope you've read it and learnt things from it!</p>
<p>Anyway, a couple of days ago I stumbled upon <a href="https://github.com/nex3/sass/issues/852#issuecomment-22071664">a comment in a Sass issue</a> listing a couple of advanced Sass functions to deal with lists. I found the idea quite appealing so I made my own function library for for this. In my opinion, it is always interesting to go deeper than <em>"it just works"</em>, so here is a short blog post to explain my code.</p>
<p>If you don't feel like reading all this and just want to look at the code, you can play with <a href="http://codepen.io/HugoGiraudel/pen/loAgq">this pen</a> or contribute to <a href="https://github.com/HugoGiraudel/Sass-snippets/blob/master/list-functions/_all.scss">this repo</a>.</p>
</section>
<section id="selecting">
<h2>Selecting values from list <a href="#selecting">#</a></h2>
<h3>First and last</h3>
<p>Let's start with something very simple: two small functions to target first and last elements of a list. I don't know for you, but I don't really like doing <code>nth($list, length($list))</code>. I'd rather do <code>last($list)</code>.</p>
<pre class="language-scss"><code>$list: a, b, c, d, e, f;
$first: first($list); // a
$last: last($list);   // f</code></pre>
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
<pre class="language-scss"><code>$list: a, b, c, d z, e, a, f;
$first-index: index($list, a);     // 1
$last-index: last-index($list, a); // 6
$last-index: last-index($list, z); // null</code></pre>
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
<blockquote class="pull-quote--right">Sass <code>@for</code> loops can't decrement.</blockquote>
<p>The second version is better because it starts from the end and returns the first occurence it finds instead of looping through all the items from the start.</p>
<p>The code is a little ugly because as of today, Sass <code>@for</code> loops can't decrement. Thus, we have to use a ugly workaround to make the loop increment on negative value, then use the absolute value of <code>$i</code>. Not cool but it works.</p>
</section>
<section id="adding">
<h2>Adding values to a list <a href="#adding">#</a></h2>
<h3>Prepending value to list</h3>
<p>You already know Sass comes with a built-in function to add values to a list called <code>append()</code>. While it does the job most of the time, there are cases where you need to add new values at the beginning of the list instead of the end. Thus a new <code>prepend()</code> method.</p>
<pre class="language-scss"><code>$list: b, c, d, e, f;
$new-list: prepend($list, a);               // a, b, c, d, e, f
$new-list: prepend($list, now i know my a); // now, i, know, my, a, b, c, d, e, f</code></pre>
<p>As you can see, the signature is the same as the one for the <code>append()</code> function. Now, let's open the beast; you'll be surprised how simple this is:</p>
<pre class="language-scss"><code>@function prepend($list, $value) {
	@return join($value, $list);
}</code></pre>
<p>Yup, that's all. <code>join()</code> is a built in function to merge two lists, the second being appended to the first. Since single values are considered as lists in Sass, we can safely join our new value with our existing list, resulting in prepending the new value to the list. How simple is that?</p>
<h3>Inserting value at index <code>n</code></h3>
<p>We can append new values to a list, and now even prepend new values to a list. What if we want to insert a new value at index <code>n</code>? Like this:</p>
<pre class="language-scss"><code>$list: a, b, d, e, f;
/* I want to add "c" as the 3rd index in the list */
$new-list: insert-nth($list, 3, c);   // a, b, c, d, e, f
$new-list: insert-nth($list, -1, z);  // error
$new-list: insert-nth($list, 0, z);   // error
$new-list: insert-nth($list, 100, z); // error
$new-list: insert-nth($list, zog, z); // error</code></pre>
<p>Now let's have a look at the function core:</p>
<pre class="language-scss"><code>@function insert-nth($list, $index, $value) {
  $result: null;
      
  @if type-of($index) != number {
    @warn "$index: #{quote($index)} is not a number for `insert-nth`.";
  }

  @else if $index < 1 {
    @warn "List index 0 must be a non-zero integer for `insert-nth`";
  }

  @else if $index > length($list) {
    @warn "List index is #{$index} but list is only #{length($list)} item long for `insert-nth'.";
  }

  @else {
    $result: ();
        
    @for $i from 1 through length($list) {
      @if $i == $index {
        $result: append($result, $value);
      }

      $result: append($result, nth($list, $i));
    }
  }

  @return $result;
}</code></pre>
<p>Here is what happens: we first make some verifications on <code>$index</code>. If it is strictly lesser than 1 or greater than the length of the list, we throw an error.</p>
<p>In any other case, we build a new list based on the one we pass to the function (<code>$list</code>). When we get to the <code>$index</code> passed to the function, we simply append the new <code>$value</code>.</p>
</section>
<section id="replacing">
<h2>Replacing values from list <a href="#replacing">#</a></h2>
<p>We're good with adding new values to a list. Now what if we want to change values from a list? Like changing all occurences of <code>a</code> into <code>z</code>? Or changing the value at index <code>n</code>? Sass provides nothing native for this, so let's do it ourself!</p>
<h3>Replacing value <code>x</code></h3>
<pre class="language-scss"><code>$list: a, b, r, a, c a, d a, b, r, a;
$new-list: replace($list, a, u);       // u, b, r, u, c a, d a, b, r, u;
$new-list: replace($list, a, u, true); // u, b, r, u, c u, d u, b, r, u;</code></pre>
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
<li>If it is, we append <code>$new-value</code>.</li>
<li>Else we append the initial value.</li>
</ul>
</li>
</ul>
<p>And there we have a recursive function to replace a given value by another given value in a list and all its nested lists.</p>
<h3>Replacing value at index <code>n</code></h3>
<p>Now if we want to replace a value at a specific index, it's a lot simpler.</p>
<pre class="language-scss"><code>$list: a, b, z, d, e, f;
$new-list: replace-nth($list,   3, c); // a, b, c, d, e, f
$new-list: replace-nth($list,   0, c); // error
$new-list: replace-nth($list,  -2, c); // a, b, c, d, z, f
$new-list: replace-nth($list, -10, c); // error
$new-list: replace-nth($list, 100, c); // error
$new-list: replace-nth($list, zog, c); // error</code></pre>
<p>As you can imagine, it works almost the same as the <code>insert-nth()</code> function.</p>
<pre class="language-scss"><code>@function replace-nth($list, $index, $value) {
  $result: null;
      
  @if type-of($index) != number {
    @warn "$index: #{quote($index)} is not a number for `replace-nth`.";
  }

  @else if $index == 0 {
    @warn "List index 0 must be a non-zero integer for `replace-nth`.";
  }
      
  @else if abs($index) > length($list) {
    @warn "List index is #{$index} but list is only #{length($list)} item long for `replace-nth`.";
  }

  @else {
    $result: ();
    $index: if($index < 0, length($list) + $index + 1, $index);  

    @for $i from 1 through length($list) {
      @if $i == $index {
        $result: append($result, $value);
      }
    
      @else {
        $result: append($result, nth($list, $i));
      }
    }
  }
 
  @return $result;
}</code></pre>
<p>I think the code is kind of self explanatory: we check for errors then loop through the values of the <code>$list</code> and if the current index (<code>$i</code>) is stricly equivalent to the index at which we want to replace the value (<code>$index</code>) we replace the value. Else, we simply append the initial value.</p> 
<p class="note"><strong>Edit (2013/08/11):</strong> I slightly tweaked the function to accept negative integers. Thus, <code>-1</code> means last item, <code>-2</code> means second-to-last, and so on. However if you go like <code>-100</code>, it throws an error.</p>
</section>
<section id="removing">
<h2>Removing values from list <a href="#removing">#</a></h2>
<p>Hey, it's getting pretty cool. We can add values to list pretty much wherever we want. We can replace any value within a list. All we have left is to be able to remove values from lists.</p>
<h3>Removing values <code>x</code></h3>
<pre class="language-scss"><code>$list: a, b z, c, z, d, z, e, f;
$new-list: remove($list, z);       // a, b z, c, d, e, f;
$new-list: remove($list, z, true); // a, b, c, d, e, f</code></pre>
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
<p>I bet you're starting to get the idea. We check each element of the list (<code>nth($list, $i)</code>); if it is a list and <code>$recursive == true</code>, we call the <code>remove()</code> function on it to deal with nested lists. Else, we simply append the value to the new list as long as it isn't the same as the value we're trying to remove (<code>$value</code>).</p>
<h3>Removing value at index <code>n</code></h3>
<p>We only miss the ability to remove a value at a specific index.</p>
<pre class="language-scss"><code>$list: a, b, z, c, d, e, f;
$new-list: remove-nth($list,   3); // a, b, c, d, e, f
$new-list: remove-nth($list,   0); // error
$new-list: remove-nth($list,  -2); // a, b, z, c, d, f
$new-list: remove-nth($list, -10); // error
$new-list: remove-nth($list, 100); // error
$new-list: remove-nth($list, zog); // error</code></pre>
<p>This is a very easy function actually.</p>
<pre class="language-scss"><code>@function remove-nth($list, $index) {
  $result: null;
        
  @if type-of($index) != number {
    @warn "$index: #{quote($index)} is not a number for `remove-nth`.";
  }

  @else if $index == 0 {
    @warn "List index 0 must be a non-zero integer for `remove-nth`.";
  }

  @else if abs($index) > length($list) {
    @warn "List index is #{$index} but list is only #{length($list)} item long for `remove-nth`.";
  }

  @else {
    $result: ();
    $index: if($index < 0, length($list) + $index + 1, $index);  

    @for $i from 1 through length($list) {
      @if $i != $index {
        $result: append($result, nth($list, $i));
      }
    }
  }
        
  @return $result;
}</code></pre>
<p>We break down the list (<code>$list</code>) to build up the new one, appending all the items except the one that was on the index we want to delete (<code>$index</code>).</p>
<p class="note"><strong>Edit (2013/08/11):</strong> same as for the <code>replace-nth</code> function, I tweaked this one to accept negative integers. So <code>-1</code> means last item, <code>-2</code> means second-to-last, and so on.</p>
</section>
<section id="miscellaneous">
<h2>Miscellaneous <a href="#miscellaneous">#</a></h2>
<p>We did a lot of important things already, so why not ending our series of functions with a couple of miscellaneous stuff? Like slicing a list? Reversing a list? Converting a list into a string?</p>
<h3>Slicing a list</h3>
<pre class="language-scss"><code>$list: a, b, c, d, e, f;
$new-list: slice($list, 3, 5);   // c, d, e
$new-list: slice($list, 4, 4);   // d
$new-list: slice($list, 5, 3);   // error
$new-list: slice($list, -1, 10); // error</code></pre>
<p>In the first draft I made of this function, I edited <code>$start</code> and <code>$end</code> value so they don't conflict with each other. In the end, I went with the safe mode: display error messages if anything seems wrong.</p>
<pre class="language-scss"><code>@function slice($list, $start: 1, $end: length($list)) {
  $result: null;
              
  @if type-of($start) != number or type-of($end) != number {
    @warn "Either $start or $end are not a number for `slice`.";
  }
             
  @else if $start > $end {
    @warn "The start index has to be lesser than or equals to the end index for `slice`.";
  }

  @else if $start < 1 or $end < 1 {
    @warn "List indexes must be non-zero integers for `slice`.";
  }

  @else if $start > length($list) {
    @warn "List index is #{$start} but list is only #{length($list)} item long for `slice`.";
  }
             
  @else if $end > length($list) {
    @warn "List index is #{$end} but list is only #{length($list)} item long for `slice`.";
  }
  
  @else {
    $result: ();
                
    @for $i from $start through $end {
      $result: append($result, nth($list, $i));
    }
  }

  @return $result;
}
}</code></pre>
<p>We make both <code>$start</code> and <code>$end</code> optional: if they are not specified, we go from the first index (<code>1</code>) to the last one (<code>length($list)</code>).</p>
<p>Then we make sure <code>$start</code> is lesser or equals to <code>$end</code> and that they both are within list range.</p>
<p>And now we're sure our values are okay, we can loop through lists values from <code>$start</code> to <code>$end</code>, building up a new list from those.</p>
<p class="note">Question: would you prefer a function slicing from index <code>n</code> for <code>x</code> indexes to this (so basically <code>$start</code> and <code>$length</code>)?</p>
<h3>Reverse a list</h3>
<p>Let's make a small function to reverse the order of elements within a list so the last index becomes the first, and the first the last.</p>
<pre class="language-scss"><code>$list: a, b, c d e, f, g, h;
$new-list: reverse($list);       // h, g, f, c d e, b, a
$new-list: reverse($list, true); // h, g, f, e d c, b, a</code></pre>
<p>As you can see, by default the function do not reverse nested lists. As always, you can force this behaviour by setting the <code>$recursive</code> parameter to <code>true</code>.</p>
<pre class="language-scss"><code>@function reverse($list, $recursive: false) {
   $result: ();

   @for $i from length($list)*-1 through -1 {
      @if type-of(nth($list, abs($i))) == list and $recursive {
        $result: append($result, reverse(nth($list, abs($i)), $recursive));      
      }

      @else {
        $result: append($result, nth($list, abs($i)));
      }
   }

   @return $result;
}</code></pre>
<p>As we saw earlier, <code>@for</code> loops can't decrement so we use the negative indexes workaround to make it work. Quite easy to do in the end. </p>
<h3>Convert a list into a string</h3>
<p>Let's finish with a function I had a hard time to name. I first wanted to call it <code>join()</code> like in JavaScript but there is already one. I then thought about <code>implode()</code> and <code>to-string()</code>. I went with the latter. The point of this function is to convert an array into a string, with the ability to use a string to join elements with each others.</p>
<pre class="language-scss"><code>$list: a, b, c d e, f, g, h;
$new-list: to-string($list);      // abcdefgh
$new-list: to-string($list, '-'); // a-b-c-d-e-f-g-h</code></pre>
<p>The core of the function is slightly more complicated than others because there is a need of a strictly internal boolean to make it work. Before I explain any further, please have a look at the code.</p>
<pre class="language-scss"><code>@function to-string($list, $glue: '', $is-nested: false) {
  $result: null;

  @for $i from 1 through length($list) {
    $e: nth($list, $i);

    @if type-of($e) == list {
      $result: $result#{to-string($e, $glue, true)};
    }
    
    @else {
      $result: if($i != length($list) or $is-nested, $result#{$e}#{$glue}, $result#{$e});
    }
  }

  @return $result;
}</code></pre>
<p class="note">Note: recursivity is implied here. It would make no sense not to join elements from inner lists so you have no power over this: it is recursive.</p>
<p>Now, my very first draft returned something like this <code>a-b-c-d-e-f-g-h-</code>. With an extra hyphen at the end.</p>
<p>In a foolish attempt to fix this, I added a condition to check whether it is the last element of the list. If it is, we don't add the <code>$glue</code>. Unfortunately, it only moved the issue to nested lists. Then I had <code>a-b-c-d-ef-g-h</code> because the check was also made in inner lists, resulting in no glue after the last element of inner lists.</p>
<p>That's why I had to add an extra argument to the function signature to differenciate the upper level from the nested ones. It is not very elegant but this is the only option I found. If you think of something else, be sure to tell.</p>
<h3>Shift indexes of a list</h3>
<p>This function comes from <a href="https://twitter.com/thebabydino">Ana tudor</a>. It aims at shifting the indexes of a list by a certain value. It may be quite tricky to understand.</p>
<pre class="language-scss"><code>$list: a, b, c, d, e, f;
$new-list: loop($list, 1);  // f, a, b, c, d, e
$new-list: loop($list, -3); // d, e, f, a, b, c</code></pre>
</section>
<p>Hopefully examples will make the point of this function clearer. The code isn't obvious in the end, so I'll just leave it here.</p>
<pre class="language-scss"><code>@function loop($list, $value: 1) {
  $result: ();
    
  @for $i from 0 to length($list) {
    $result: append($result, nth($list, ($i - $value) % length($list) + 1));
  }
  
  @return $result;
}</code></pre>
<p>Thanks a lot for the input Ana!</p>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>I guess that's all I got folks! If you think of anything that could improve any of those functions, be sure to tell. Meanwhile, you can play with <a href="http://codepen.io/HugoGiraudel/pen/loAgq">this pen</a> or contribute to <a href="https://github.com/HugoGiraudel/Sass-snippets/blob/master/list-functions/_all.scss">this repo</a>.</p>
</section>