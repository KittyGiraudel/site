---
published: true
preview: true
comments: false
layout: post
---

<section>
<p>A couple of weeks ago (right before holidays actually), I've been playing around math sequences in Sass, especially the <a href="http://en.wikipedia.org/wiki/Fibonacci_number">Fibonacci number</a>, the <a href="http://en.wikipedia.org/wiki/Juggler_sequence">Juggler sequence</a> and the <a href="http://en.wikipedia.org/wiki/Look-and-say_sequence">Look-and-say sequence</a> also known as <em>Conway's number</em>.</p>
<p>Those were kind of fun Sass experiments and people seemed to be interested on Twitter so here is the how-to.</p> 
<p>If you're not interested in learning how I did it and just want to see the code, you can play around those pens: <a href="http://codepen.io/HugoGiraudel/pen/krAes">Fibonacci number</a>, <a href="http://codepen.io/HugoGiraudel/pen/GnzfB">Juggler sequence</a>, <a href="http://codepen.io/HugoGiraudel/pen/tBhzs">Look-and-say sequence</a>.
</section>
<section id="fibonacci-number">
<h2>Fibonacci number <a href="#fibonacci-number">#</a></h2>
<p>The Fibonacci number is one of those math sequences that follow simple rules. The one ruling the Fibonacci sequence is that <strong>each subsequent number is the sum of the previous two</strong>. Here are the 10 first entries of this sequence:</p>
<pre><code>0 1 1 2 3 5 8 13 21 34 55</code></pre>
<p>Pretty simple, isn't it? Of course there is no end to this sequence, so we need to fix a limit, like the number of entries we want; we'll call this number <code>$n</code>. Okay, let's build the skeleton. To start the sequence we need 2 numbers, right?</p>
<pre class="language-scss"><code>@function fibonacci($n) {
	$fib: 0 1;
    @for $i from 1 through $n {
    	$fib: append($fib, $new);
    }
    @return $fib;
}</code></pre>
<p>We're almost done! We only need to work this <code>$new</code> variable. It's actually really simple:</p>
<pre class="language-scss"><code>$last: nth($fib, length($fib));
$second-to-last: nth($fib, length($fib) - 1);
$new: $last + $second-to-last;</code></pre>
<p>And there you have it, the Fibonacci number in Sass. Here is the whole function and a usecase:</p>
<pre class="language-scss"><code>@function fibonacci($n) {
	$fib: 0 1;
    @for $i from 1 through $n {
    	$new: nth($fib, length($fib)) + nth($fib, length($fib) - 1);
    	$fib: append($fib, $new);
    }
    @return $fib;
}

$fib: fibonacci(10);
// -> 0 1 1 2 3 5 8 13 21 34 55 89</code></pre>
</section>
<section id="juggler">
<h2>Juggler sequence <a href="#juggler">#</a></h2>
<p>I'll be totally honest with you guys: I'm not sure what's the Juggler sequence is meant for. All I know is how it works. First of all, it is not an infinite sequence; secondly, it's different for each initial number.</p>
<p>Basically, every new entry in the sequence is either the previous one raised to 1/2 if it's even or raised to 3/2 if it's odd. Let's take an example with <code>3</code> as a starter:</p>
<pre><code>3 5 11 36 6 2 1</code></pre>
<p>What's interesting about this sequence is it will eventually always end up with <code>1</code>. This is actually pretty cool because it means we know when to stop: when we reach 1. Ready?</p>
<pre class="language-scss"><code>@function juggler($n) {
	$juggler: ($n);
    @while nth($juggler, length($juggler)) != 1 {
    	// What's $new?
    	$juggler: append($juggler, $new);
    }
    @return $juggler;
}</code></pre>
<p>First time ever I find a usecase for the while loop; this makes me happy! Anyway, I think the code is pretty self-explanatory. We append new values to the list until the last one is <code>1</code>, in which case we stop. All we have to do is to find <code>$new</code>.</p>
<p>It is actually pretty simple. We only have to check whether the last number is odd or even:</p>
<ul>
<li>If it's odd, raise it to <code>3/2</code>
<li>If it's even, raise it to <code>1/2</code>
</ul>
<pre class="language-scss"><code>$last : nth($juggler, length($juggler));
$x    : if($last % 2 == 0, 1/2, 3/2);
$new  : pow($last, $x);</code></pre>
<p>Simple, isn't it? Here is the whole function and a usecase:</p>
<pre class="language-scss"><code>@function juggler($n) {
	$juggler: ($n);
    @while nth($juggler, length($juggler)) != 1 {
    	// What's $new?
    	$juggler: append($juggler, $new);
    }
    @return $juggler;
}

$juggler: juggler(77);
// -> 77 675 17537 2322378 1523 59436 243 3787 233046 482 21 96 9 27 140 11 36 6 2 1
</code></pre>
</section>
<section id="look-and-say">
<h2>Look-and-say sequence <a href="#look-and-say">#</a></h2>
<p>The Look-and-say sequence is a little bit less mathematical than the Fibonacci number. Its name is self explanatory: to generate a new entry from the previous one, read off the digits of the previous one, counting the number of digits in groups of the same digit.</p>
<pre class="language-scss"><code>$look-and-say: 1, 11, 21, 1211, 111221, 312211;</code></pre>
<p>Starting with <code>1</code>, here is what happen:</p>
<ul>
<li><code>1</code> is read off as "one 1" or <code>11</code>.
<li><code>11</code> is read off as "two 1s" or <code>21</code>.
<li><code>21</code> is read off as "one 2, then one 1" or <code>1211</code>.
<li><code>1211</code> is read off as "one 1, then one 2, then two 1s" or <code>111221</code>.
<li><code>111221</code> is read off as "three 1s, then two 2s, then one 1" or <code>312211</code>.
</ul>
<h3>Fun facts</h3>
<p>In case you're interested, there are numbers of fun facts regarding this sequence:</p>
<ul>
<li>There won't be any number greater than 3</li>
<li>Except for the first entry, all entries have an even number of characters</li>
<li>Except for the first entry, odd entries end with <code>21</code> and even entries end with <code>11</code></li>
<li>The average number of <code>1</code> is <code>50%</code>, of <code>2</code> is <code>31%</code>, of <code>3</code> is <code>19%</code>.</li>
</ul>
<p>You can even start the sequence with another digit than 1. For any digit from 0 to 9, this digit will indefinitely remain as the last digit of each entries:</p>
<pre><code>d 1d 111d 311d 13211d 111312211d 31131122211d</code></pre>
<h3>Look-and-say in Sass</h3>
<p>To build this sequence with Sass, I got inspired by <a href="http://codepen.io/HugoGiraudel/pen/wDkvc">an old pen of mine</a> where I attempted to do the sequence in JavaScript. The code is dirty as hell and definitely waaaay too heavy for such a thing, but it works.</p>
<p>Since Sass isn't as powerful as JavaScript (no regular expression, no replace...), I don't think there are many ways to go. If anyone has a better idea, I'd be glad to hear it! :)</p>
<p>As for the Fibonacci number, there is no end so we have to define a limit. Again, this will be <code>$n</code>.</p>
<pre class="language-scss"><code>@function look-and-say($n) {
	$sequence: (1);
    @for $i from 1 through $n {
    	// We do stuff
    }
    @return $sequence;
}</code></pre>
<p>Before going any further, I think it's important to understand how we are going to store the whole sequence in Sass. Basically, it will be a list of lists. Like this:</p>
<pre class="language-scss"><code>$sequence: 1, 1 1, 2 1, 1 2 1 1, 1 1 1 2 2 1;</code></pre>
<p>So the upper level (entries) are comma separated while the lower level (numbers in each entry) are space separated. Two-levels deep list. Alright back to our stuff.</p>
<p>For each loop run, we have to check the previous entry first. Then, here is what we do:</p>
<ol>
<li>Start from last character</li>
<li>Check the number of identical characters previous to and including this one (basically 1, 2 or 3)</li>
<li>Prepend this count and the character to the new entry</li>
<li>Start back to next unchecked character</li>
</ol>
<pre class="language-scss"><code>@function look-and-say($n) {
	$sequence: (1);
    @for $i from 1 through $n {
    	$last-entry : nth($sequence, length($sequence));
        $new-entry  : ();
        $count     : 0;
        @for $j from length($last-entry) * -1 through -1 { 
        	$j      : abs($j);
    		$last   : nth($last-entry, $j);
            $last-1 : null;
            $last-2 : null;
            
            @if $j > 1 { $last-1: nth($last-entry, $j - 1); }
      		@if $j > 2 { $last-2: nth($last-entry, $j - 2); }
            
            // We do stuff
        }
    }
    @return $sequence;
}</code></pre>
<p>We use the dirty old negative hack to make the loop decrement instead of increment since we want to start from the last character (stored in <code>$last</code>).</p>
<p>Since second-to-last and third-to-last characted don't necessarily exist, we first define them to <code>null</code> then we check if they can exist, and if they can, we define them for good.</p>
<p>Now we check if <code>$count = 0</code>. If it does, it means we are dealing with a brand new character. Then, we need to know how long is the sequence of identical numbers (1, 2 or 3). Quite easy to do:</p>
<ul>
<li>if <code>$last</code>, <code>$last-1</code> and <code>$last-2</code> are identical, it's <code>3</code></li>
<li>if <code>$last</code> and <code>$last-1</code> are identical, it's <code>2</code></li>
<li>else it's 1</li>
</ul>
<p>Once we've figured out this number, we can <strong>prepend</strong> (remember we're starting from the end of the line) it and the value to the new entry.</p>
<p>Then, we decrement <code>$count</code> from 1 at each loop run. This is meant to skip numbers we just checked.</p>
<pre class="language-scss"><code>@if $count == 0 {
    @if $last == $last-1 and $last == $last-2 { 
    	$count: 3; 
    }
    @else if $last == $last-1 { 
    	$count: 2; 
    }
    @else { 
    	$count: 1;
	}

    // Prepend new numbers to new line
    $new-line: join($count $last, $new-entry        
}  

$count: $count - 1;</code></pre>
<p>Once we're done with the inner loop, we can append the new entry to the sequence and start a new entry again, and so on until we've run <code>$n</code> loop runs. When we've finished, we return the sequence. Here is the whole function:</p>
<pre class="language-scss"><code>@function look-and-say($n) {
	$sequence: (1);
    @for $i from 1 through $n {
    	$last-entry : nth($sequence, length($sequence));
        $new-entry  : ();
        $count     : 0;
        @for $j from length($last-entry) * -1 through -1 { 
        	$j      : abs($j);
    		$last   : nth($last-entry, $j);
            
            $last-1 : null;
            $last-2 : null;
            @if $j > 1 { $last-1: nth($last-entry, $j - 1); }
      		@if $j > 2 { $last-2: nth($last-entry, $j - 2); }
            
            @if $count == 0 {
            	@if $last == $last-1 and $last == $last-2 { 
                	$count: 3; 
            	}
            	@else if $last == $last-1 { 
                    $count: 2; 
            	}
            	@else { 
                	$count: 1;
            	}
            	// Prepend new numbers to new line
            	$new-line: join($count $last, $new-entry);  
            }  
            $count: $count - 1;
        }
        // Appending new line to result
    	$sequence: append($sequence, $new-entry);
	}  
	// Returning the whole sequence
	@return $sequence;
}</code></pre>
<p>And here is how you use it:</p>
<pre class="language-scss"><code>$look-and-say: look-and-say(7);
// 1, 1 1, 2 1, 1 2 1 1, 1 1 1 2 2 1, 3 1 2 2 1 1, 1 3 1 1 2 2 2 1, 1 1 1 3 2 1 3 2 1 1</code></pre>
<p class="note">Caution! This sequence is pretty heavy to generate, and the number of characters in each entry quickly grow. On CodePen, it's getting too heavy after like 15 iterations. You could push it further locally but if your browser crashes, you won't tell you hadn't be warned!</p>
</section>
<section id="displaying">
<h2>Displaying those sequences <a href="#displaying">#</a></h2>
<p>One equally interesting thing is how I managed to display these sequences with line breaks and reasonable styles without any markup at all.</p>
<p>First things first: to display textual content without any markup, I used a pseudo-element on the body. This way, I can inject text into the document without having to use an extra element.</p>
<p>Now to display it with line-breaks, I had to get tricky! The main idea is to convert the list into a string and to join elements with a line-break character.</p>
<p>Thankfully, I recently wrote an article about <a href="http://hugogiraudel.com/2013/08/08/advanced-sass-list-functions/">advanced Sass list functions</a>, and one of those is <code>to-string()</code>. I slightly tweaked it so it's as simple as it can get:</p>
<pre class="language-scss"><code>@function to-string($list, $glue: '') {
  $result: null;

  @for $i from 1 through length($list) {
    $e: nth($list, $i);      
    $result: if($i != length($list), $result#{$e}#{$glue}, $result#{$e});
  }

  @return $result;
}</code></pre>
<p>I think you can see where this is going now: to display the Fibonacci number line by line, I simply did this:</p>
<pre class="language-scss"><code>body:before {
    content: quote(to-string(fibonacci(100), ' \A '));
    white-space: pre-wrap;
}</code></pre>
<p>Here is what we do (from middle to edges):</p>
<ol>
<li>We call the fibonacci function to run 100 times</li>
<li>We convert the returned list into a string, using the <code>\A</code> line-break character</li>
<li>We quote this string so it's a valid content value</li>
</ol>
<p>There you have it: displaying a whole list of data with line-breaks all through CSS. Pretty neat, isn't it?</p>
<p class="note">Note: for the Look-and-say sequence, it takes one extra step to convert nested lists into strings first. You check how I did it directly on <a href="http://codepen.io/HugoGiraudel/pen/tBhzs">the pen</a>.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>This is pointless but definitely fun to do. And interesting. Now what else could we do? Do you have anything in mind? :)</p>
</section>