---
published: true
preview: false
comments: true
title: "Use lengths, not strings"
layout: post
---

<section>
<p>This is something I see in a lot of Sass demos and tutorials. People tend to use strings instead of actual lengths, and if it's okay in most cases, there are a couple of situations when it is not anymore.</p>
<p>But first, let me introduce the topic because you probably wonder what the hell I am talking about. Nothing better than a little example for this.</p>
<pre class="language-scss"><code>$value: 13.37;
$length: $value + em;
    
whatever {
    padding-top: $length;
}</code></pre>
<p>I want to play a game... This example: working or not working?</p>
<p>Well obviously, it works like a charm. That's probably why you can see it so much in so many Sass demos.</p>
</section>
<section id="problem">
<h2>The problem <a href="#problem">#</a></h2>
<p>Then you ask <em>"if it works, why bother?"</em>. That's actually a very fair question. Let's continue our example, shall we? What if we apply &mdash; let's say &mdash; the <code>round()</code> function to our length?</p>
<pre class="language-scss"><code>$rounded-length: round($length);</code></pre>
<p>Aaaaaand... bummer.</p>
<blockquote class="quote">"13.37em" is not a number for 'round'.</blockquote> 
<p>Same problem with any function requiring a number (lengths are numbers in Sass) like <code>abs()</code>, <code>ceil()</code>, <code>floor()</code>, <code>min()</code>... Even worse! The <code>unit()</code> function will also fail to return the unit. </p>
<p>This is because <strong>there is no unit</strong> since it's now a string. When you append a string (in this case <em>em</em>) to a number (<em>13.37</em>), you implicitly cast it into a string.</p>
<p>Indeed, if you check the type of your variable with the <code>type-of()</code> function, you'll see it's not a number but a string.</p>
<pre class="language-scss"><code>type-of($length); // string</code></pre>
</section>
<section id="solution">
<h2>The solution <a href="#solution">#</a></h2>
<p>There is a very simple solution. Instead of appending the unit, simply multiply the number by 1 unit. For example, <em>3 apples</em> is strictly equivalent to <em>3 times 1 apple</em>, right? Same thing.</p>
<pre class="language-scss"><code>$value: 13.37;
$length: $value * 1em;
    
whatever {
    padding-top: round($length); // 13em
}</code></pre>
<p>Problem solved! Please, use lengths when you need to, not strings.</p>
</section>