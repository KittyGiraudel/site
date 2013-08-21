---
published: true
preview: true
comments: false
layout: post
---

<section>
<p>A couple of weeks ago (right before holidays actually), I've been playing around math sequences in Sass, especially the <a href="http://en.wikipedia.org/wiki/Fibonacci_number">Fibonacci number</a> and the <a href="http://en.wikipedia.org/wiki/Look-and-say_sequence">Look-and-say sequence</a> also known as <em>Conway's number</em>.</p>
<p>Those were kind of fun Sass experiments and people seemed to be interested on Twitter so here is the how-to.</p> 
</section>
<section id="fibonacci-number">
<h2>Fibonacci number <a href="#fibonacci-number">#</a></h2>
<p>The Fibonacci number is one of those math sequences that follow simple rules. The one ruling the Fibonacci sequence is that <strong>each subsequent number is the sum of the previous two</strong>. Here are the 10 first lines of the Fibonacci number.</p>
<pre><code>0
1
1
2
3
5
8
13
21
34
55</code></pre>
<p>Pretty simple, isn't it? Of course there is no end to this sequence, so we need to fix a limit, like the number of lines we want; we'll call this number <code>$n</code>. Okay, let's build the skeleton. To start the sequence we need 2 numbers, right?</p>
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
<section id="">
<h2> <a href="#">#</a></h2>
</section>
<section id="">
<h2> <a href="#">#</a></h2>
</section>
<section id="">
<h2> <a href="#">#</a></h2>
</section>