---
title: How I made a Sass debug function
preview: false
comments: trie
layout: post
codepen: true
---

<section>
<p class="explanation">The code explained in this article has been slightly revisited in <a href="http://codepen.io/HugoGiraudel/pen/unyBH">the pen</a> afterwards. For the ultimate version of the code, check the pen.</p>
<p>You know how much I love playing with Sass lists. I think they are the most powerful and useful feature in Sass. It's a shame there is so few functions to deal with them. This is why I made <a href="https://github.com/Team-Sass/Sass-list-functions">SassyLists</a>.</p>
<p>Most importantly, I always wanted a <code>console.log()</code> for Sass. You know, something to debug a variable, a list, a value, whatever... There is the <a href="http://sass-lang.com/documentation/file.SASS_REFERENCE.html#_4"><code>@debug</code></a> function but somehow it didn't completely satisfy me. Plus, there is no console on <a href="http://codepen.io">CodePen.io</a> and since this is where I do most of my experiments I needed something else.</p>
<p>So I rolled up my sleeves, got my hands dirty and made my own Sass debug function. This is how it looks like:</p>
<p data-height="310" data-theme-id="0" data-slug-hash="unyBH" data-user="HugoGiraudel" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/HugoGiraudel/pen/unyBH'>Debug Sass lists</a> by Hugo Giraudel (<a href='http://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='http://codepen.io'>CodePen</a></p>
<p>If you don't want to read but simply want to dig into the code, check <a href="http://codepen.io/HugoGiraudel/pen/unyBH">this pen</a>.</p>
</section>
<section id="stringify-a-list">
<h2>Stringify a list <a href="#stringify-a-list">#</a></h2>
<p>Everything started when I realized a function to stringify a list. At first, my point was to turn a regular Sass list into a JSON-like string in order to be able to output it into a CSS pseudo-element.</p>
<p>It was pretty easy to do.</p>
<pre class="language-scss"><code>@function debug($list) {
	// We open the bracket
	$result: "[ ";

    // For each item in list
    @each $item in $list {
    	// We test its length
    	// If it's more than one item long
    	@if length($item) > 1 {
    		// We deal with a nested list
    		$result: $result + debug($item);
    	}
    	// Else we append the item to $result
    	@else {
    		$result: $result + $item;
    	}

    	// If we are not dealing with the last item of the list
    	// We add a comma and a space
    	@if index($list, $item) != length($list) {
     		$result: $result + ", ";
    	}
    }

    // We close the bracket
    // And return the string
    $result: $result + " ]";
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
<p>Basically I wanted to go <code>@include debug($list)</code> and have everything displayed. Perfect usecase for a mixin, right?</p>
<pre class="language-scss"><code>@mixin debug($list) {
	body:before {
        content: debug($list)                     !important;

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
<p>So. This mixin doesn't do much more than styling the output of the <code>debug</code> function. So now instead of having to open the <code>body:before</code> rule, the content property and all, we just need to go <code>@include debug($list)</code>.</p>
<p>Pretty neat, but I wanted moar.</p>
</section>
<section id="improving-the-function">
<h2>Improving the function <a href="#improving-the-function">#</a></h2>
<p>I wanted two things: 1) explode the list into several lines to make it easier to read; 2) add the ability to display the type of each value in the list.</p>
<h3>Dealing with line breaks</h3>
<p>If you are a reader of <a href="http://thesassway.com">TheSassWay.com</a>, you might have stumbled upon my article <a href="http://thesassway.com/advanced/math-sequences-with-sass">Math sequences with Sass</a> in which I explain how I created famous math sequences in Sass and how I managed to display them with nothing more than CSS. Anyway, I kind of answer the question of linebreaks in CSS.</p>
<p>If you've ever read the <a href="http://www.w3.org/TR/CSS2/generate.html#content">CSS specifications for the content property</a> (don't worry, neither did I), you may know that there is a way to insert breaklines with <code>\A </code> (don't forget the trailing white space). In TheSassWay article, I used it as a <code>$glue</code> for the <a href="https://github.com/Team-Sass/Sass-list-functions/blob/master/compass-extension/stylesheets/SassyLists/_to-string.scss"><code>to-string()</code> function</a> from SassyLists.</p>
<p>This is pretty much what we will do here.</p>
<pre class="language-scss"><code>@function debug($list) {
	$line-break: "\A ";
	$result: "[ " + $line-break;

	@each $item in $list {
    	$result: $result + "  ";

		@if length($item) > 1 {
			$result: $result + debug($item);
		}

		@else {
			$result: $result + $item;
		}

		@if index($list, $item) != length($list) {
			$result: $result + ", " + $line-break;
		}
 	}

	$result: $result + $line-break + "]";
	@return quote($result);
}</code></pre>
<p>All we did was adding a line-break after the bracket, after each value, then before the closing bracket. That looks great, but we need to handle the indentation now. This is where it gets a little tricky.</p>
<p>Actually the only way I could manage a perfect indentation is the same trick I used for the <code>to-string()</code> function: with an internal boolean to make a distinction between the root level (the one you called) and the inner levels (from nested lists). Problem with this boolean is it messes with the function signature but that's the only way I found.</p>
<pre class="language-scss"><code>@function debug($list, $root: true) {
  $line-break: "\A ";
  $result: "[ " + $line-break;
  $space: if($root, "", "  ");

  @each $item in $list {
    $result: $result + "  ";

    @if length($item) > 1 {
      $result: $result + debug($item, false);
    }

    @else {
      $result: $result + $space + $item;
    }

    @if index($list, $item) != length($list) {
      $result: $result + ", " + $line-break;
    }

  }

  $result: $result + $line-break + $space + "]";
  @return quote($result);
}</code></pre>
<p>The list should now be properly indented. So should be the nested lists. Okaaaay this is getting quite cool! We can now output a list in a clean <code>var_dump()</code> way.</p>
<h3>Displaying variable types</h3>
<p>Now the icing on top of the cake would be displaying variable types, right? Thanks to the <code>type-of()</code> function and some tweaks to our <code>debug</code> function, it is actually quite simple to do. Far simpler than what we previously did with indents and line breaks.</p>
<pre class="language-scss"><code>@function debug($list, $type: false, $root: true) {
  $line-break: "\A ";
  $result: if($type,
	  "(list:#{length($list)})[ "+ $line-break,
	  "[ " + $line-break
  );
  $space: if($root,
	  "",
	  "  "
  );

  @each $item in $list {
	  $result: $result + "  ";

		@if length($item) > 1 {
			$result: $result + debug($item, $type, false);
		}

		@else {
			$result: if($type,
				$result + $space + "(" + type-of($item) + ") " + $item,
				$result + $space + $item
			);
		}

		@if index($list, $item) != length($list) {
			$result: $result + ", " + $line-break;
		}
	}

	$result: $result + $line-break + $space + "]");
	@return quote($result);
}</code></pre>
<p>As you can see, it is pretty much the same. We only check for the <code>$type</code> boolean and add the value types accordingly wherever they belong. We're almost there!</p>
<p class="note">Note: I've set the <code>$type</code> boolean to <code>false</code> as a default for the <code>debug</code> function but to <code>true</code> for the mixin.</p>
<h3>Making it work for single values</h3>
<p>The only problem left is that if you debug a single value, it will wrap it into <code>(list:1) [ ... ]</code>. While this is true, it doesn't really help the user so we should get rid of this. Fairly easy! We just have to add a condition when entering the function.</p>
<pre class="language-scss"><code>@function debug($list, $type: false, $root: true) {
	@if length($list) == 1 {
    	@return if($type,
    		quote("(#{type-of($list)}) #{$list}"),
    		quote($list)
    	);
	}
	...
}
</code></pre>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>That's pretty much it guys. I hope you like it. This has been added to <a href="https://github.com/Team-Sass/Sass-list-functions">SassyLists</a>, so if you think of something to improve it be sure to share!</p>
<p>Some of you might find this kind of overkill. Then you can try <a href="https://gist.github.com/piouPiouM/7030210">this <code>@debug</code>-powered version</a> by <a href="http://twitter.com/pioupioum">Mehdi Kabab</a> that does pretty much the same thing but in the Ruby console.</p>
</section>
