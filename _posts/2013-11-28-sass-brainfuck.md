---
title: Sass brainfuck
layout: post
preview: false
comments: true
---
<section>
<p>After months of experimenting with Sass, making crazy and useless things, hacking aroung the syntax and trying to do things not meant to be done, I have come up with a list of things that still kind of boggle my mind when it comes to Sass. Some of them are rather normal and some are just... plain weird. Please, follow my lead.</p>
</section>
<section id="lenghts-and-numbers">
<h2>Lengths are numbers <a href="#">#</a></h2>
<p>Like... for real. There is no distinction in Sass between what you'd call a number (e.g. <code>42</code>) and what you'd call a length (e.g. <code>1337px</code>). In a sense, that makes sense (see what I did there?). You want to be able to do something like this:</p>
<pre class="language-scss"><code>$value: 42px;
@if $value > 10 {
  // do something
}</code></pre>
<p>You can do this just because lengths are treated as numbers. Else, you would have an error like <em>"42px is not a number for 42px gt 10"</em>.</p>
<p>That being said...</p>
<pre class="language-scss"><code>42px == 42; // true</code></pre>
<p>I can't help but to grind my teeth when I see that the previous assertion returns <code>true</code>. Yes, both are some kind of a number, but still... One has a unit and one does not. I don't think the strict equality operator should return true for such a case.</p>
</section>
<section id="strict-equality-operator">
<h2>Strict equality operator <a href="#strict-equality-operator">#</a></h2>
<blockquote class="pull-quote--right">Sass makes no distrinction between <code>==</code> and <code>===</code>.</blockquote>
<p>Sometimes I wish Sass would make a distinction between <code>==</code> and <code>===</code>. As a reminder, the first one checks whether values are equal while the latter makes sure both are of the same type. This is to prevent something like <code>5 == '5'</code> from returning <code>true</code>. When checking with <code>===</code>, it should return <code>false</code>.</p>
<p>Anyway, every time you use <code>==</code> in Sass, it actually means <code>===</code>. So basically there is no way to check whether two values are equal without checking their type as well.</p>
<p>In most cases, this is really not an issue but I came up with a case where I didn't want to check the type. Please have a look at the following example:</p>
<pre class="language-scss"><code>// Initializing an empty list
$list: ();

// Checking whether the list is true
$check: $list == true; // false, as expected

// Checking whether the list is false
$check: $list == false; // false</code></pre>
<p>While we would expect an empty list to be <code>false</code>, it turns out it is not. If it's not false, then it's true! Right? Seems not. An empty list is neither true nor false because <code>==</code> also checks for types. So the previous statement would look like something like this: <code>[list] === [bool]</code> which is obviously false, no matter what the boolean is.</p>
<p>Okay so it makes sense that the previous example returns <code>false</code> in both cases! Nevertheless, <code>()</code> being evaluated to <code>false</code> would be quite cool when checking for a valid value to append to a list. Please consider the following code:</p>
<pre class="language-scss"><code>$list: (a, b, c);
$value: ();

@if $value { // Short for `$value == true` which is the same as `$value != false`
    $list: append($list, $value);
}</code></pre>
<p>If <code>()</code> was treated as a falsy value, the condition wouldn't match and the 4th element of <code>$list</code> wouldn't be an empty list. This is how it works in JavaScript:</p>
<pre class="language-javascript"><code>var array = ['a', 'b', 'c'];
var value = [];

if(value != false) {
    array.push(value);
}</code></pre>
<p>This works because JavaScript makes a difference between <code>!=</code> and <code>!==</code> while Sass uses the latter no matter what.</p>
<p>We talked about the empty-list case in this section but there is the exact same problem with an empty string <code>""</code> or even the <code>null</code> value. Anyway, as I said it's barely an issue, but it has bugged me more than once.</p>
</section>
<section id="list-append">
<h2>List append <a href="#list-append">#</a></h2>
<p>Even after <a href="http://hugogiraudel.com/2013/07/15/understanding-sass-lists/">many</a> <a href="http://hugogiraudel.com/2013/08/08/advanced-sass-list-functions/">articles</a> <a href="http://hugogiraudel.com/2013/10/09/advanced-sass-list-functions-again/">about</a> <a href="http://thesassway.com/advanced/math-sequences-with-sass">Sass</a> lists, they keep surprising me with how messed up they are.</p>
<p>As you may know, most single-values in Sass are considered as one item-long lists. This is to allow the use of <code>length()</code>, <code>nth()</code>, <code>index()</code> and more. Meanwhile, if you test the type of a single-value list, it won't return <code>list</code> but whatever the type is (could it be <code>bool</code>, <code>number</code> or <code>string</code>). Quick example:</p>
<pre class="language-scss"><code>$value: (1337);
$type: type-of($value); // number</code></pre>
<p>Indeed &mdash;as explained in <a href="https://github.com/nex3/sass/issues/837#issuecomment-20429965">this comment from Chris Eppstein</a>&mdash; parens are not what define lists; it's the delimiter (commas/spaces).</p>
<p>Now what if we append this value to an empty list? Let's see.</p>
<pre class="language-scss"><code>$value: (1337);
$value: append((), $value);
$type: type-of($value); // list</code></pre>
<p>Bazinga! Now that you appended the value to an empty list, the type is a list. To be totally honest with you, I am not entirely sure why this happens. I believe the <code>append()</code> function returns a list no matter what, so if you append a single value to a list, it returns a list with a single item. That's actually the only way I know to cast a single value into a string in Sass. Not that you're going to need it, but that's actually good to know!</p>
</section>
<section id="variable-scope">
<h2>Variable scope <a href="#variable-scope">#</a></h2>
<p>Okay let's put this straight: variable scope has always been my pet hate. I don't know why, I always got it wrong. I believe variable scope in Sass is good, but for some reason it doesn't always work the way I'd want it to work. I recall trying to help someone who wanted to do something like this:</p>
<pre class="language-scss"><code>
// Initialize a variable
$color: tomato;

// Override it in an impossible @media directive
@media (min-width: 10000em), (-webkit-min-device-pixel-ratio: 42) {
    $color: lightgreen;
}

// Use it
body {
    background: $color; // lightgreen;
}</code></pre>
<p>When I read it now, it seems obvious to me that the assignment in the <code>@media</code> directive will override the first one. Indeed Sass is compiled to serve CSS, not evaluated on the fly. This means Sass has no idea whether the <code>@media</code> will ever match and it doesn't care. It simpy overrides the variable; there is no scoping involved here. But that would be cool, right?</p>
<p>Okay, let's take another example with Sass scope in mixin directives shall we?</p>
<pre class="language-scss"><code>// Define a `$size` variable
$size: 1em;

// Define a mixin with an argument named `$size`
@mixin whatever($size: .5em) {
    // Include the `@content` directive in the mixin core
    @content;
    margin-bottom: $size * 1.2;
}

// Use the mixin
el {
    @include whatever {
        font-size: $size;
    }
}</code></pre>
<p>I want to play a game. In your opinion, what is the CSS rendered by this code (shamelessly stolen from <a href="http://twitter.com/pioupioum">Mehdi Kabab</a>'s new book - "Advanced Sass and Compass")?</p>
<p>The correct answer is:</p>
<pre class="language-scss"><code>el {
    font-size: 1em; 
    margin-bottom: .6em;
}</code></pre>
<p>This is actually not fucked up at all: it's the expected behaviour from correct variable scoping. While it might look silly for an advanced Sass user, I bet it's not that obvious to the beginner. The declared <code>$size</code> variable is used for the font-size while the default value for the <code>$size</code> argument is used for the bottom margin since it is inside the mixin, where the variable is scoped.</p>
</section>
<section id="ternary">
<h2>If ternary then... Sass error <a href="#ternary">#</a></h2>
<p>You all know what a ternary is, right? Kind of a one-line <code>if</code>/<code>else</code> statement. It's pretty cool when you need to assign a variable differently depending on a condition. In JavaScript, you'd write something like this:</p>
<pre class="language-javascript"><code>var whatever = condition ? true : false</code></pre>
<p>Where the first part would be an expression evaluating to a truthy or falsy value, and the other two parts can be whatever you want, not necessarily booleans. Okay, so technically there is no ternary operator in Sass (even if there is one in Ruby very similar to the one we just used). However there is a function called <code>if()</code> which works the same way:</p>
<pre class="language-scss"><code>$whatever: if(condition, true, false);</code></pre>
<p>First argument is the condition, second one is the value to return in case the condition is evaluated to <code>true</code> and as you may guess the third one is returned when the condition is false. 'til then, no surprise.</p>
<p>Let's have a try, shall we? Consider a function accepting a list as its only argument. It checks for its length and returns either the 2nd item if it has multiple items, or the only item if it has only one.</p>
<pre class="language-scss"><code>@function f($a) {
    @return if(length($a) > 1, nth($a, 2), $a);
}</code></pre>
<p>And this is how to use it:</p>
<pre class="language-scss"><code>$c: f( bazinga gloubiboulga );
// returns `gloubiboulga`</code></pre>
<p>And now with a one-item long list:</p>
<pre class="language-scss"><code>$c: f( bazinga );
// List index is 2 but list is only 1 item long for `nth'</code></pre>
<blockquote class="pull-quote--right"><code>if()</code> parses all arguments no matter what.</blockquote>
<p>BAZINGA! The <code>if()</code> function returns an error. It looks like it's trying to access the second item in the list, even if the list is only one item long. <em>Why</em> you ask? Because the ternary function from Sass parses both 2nd and 3rd arguments no matter what.</p>
<p>Hopefully this issue is supposed to be solved in the incoming Sass 3.3 according to <a href="https://github.com/nex3/sass/issues/470">this GitHub issue</a>. Meanwhile, a workaround would be to use a real <code>@if/@else</code> statement to bypass the issue. Not ideal but still better than nothing.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>I love how powerfull Sass has become but there are things that keep boggling my mind. <a href="http://twitter.com/pioupioum">Mehdi Kabab</a>, a fellow French developer (and author of a fresh new book called <a href="http://livre-sass-compass.fr/">Advanced Sass and Compass</a>) told me it was because I wasn't using Sass as a preprocessor.</p>
<blockquote class="twitter-tweet" data-partner="tweetdeck"><p><a href="https://twitter.com/HugoGiraudel">@HugoGiraudel</a> the main problem is you want use Sass like PHP oe Ruby, and not like a CSS preprocessor ;) /cc <a href="https://twitter.com/kaelig">@kaelig</a></p>&mdash; Mehdi Kabab (@piouPiouM) <a href="https://twitter.com/piouPiouM/statuses/401427568592957441">November 15, 2013</a></blockquote>
<p>That's actually true! I've done many things with Sass that are really beycond the scope of CSS. But that's where I think the fun is: thinking out of box, and hacking around the syntax. That's how I learnt to use Sass, and that's how I'll keep going on. ;)</p>
</section>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
