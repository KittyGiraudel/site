---
title: Sass brainfuck
layout: post
preview: true
comments: false
---
<section>
<p>After months of experimenting with Sass, making crazy and useless things, hacking aroung the syntax and trying things that are not meant to be done, I have come with a list of things that still kind of bug my mind when it comes to Sass. Some of them are normal, some of them are normal, and some are just... weird. Please, follow my lead.</p>
</section>
<section id="lenghts-and-numbers">
<h2>Lengths are numbers <a href="#">#</a></h2>
<p>Like... for real. There is no distinction in Sass between what you call a number (e.g. <code>42</code>) and what you'd call a length (e.g. <code>1337px</code>). In a sense, that makes sense (see what I did there?). You want to be able to do something like this:</p>
<pre class="language-scss"><code>$value: 42px;
@if $value > 10 {
	// do something
}</code></pre>
<p>That's because lengths are considered as numbers you can do this. Else, you would have an error like <em>"42px is not a number for 42px gt 10"</em>.</p>
<p>That being said...</p>
<pre class="language-scss"><code>42px == 42; // true</code></pre>
<p>I can't help but to grind my teeth when I see that the previous assertion returns <code>true</code>. Yes, both are type of number but still... One has a unit and one has not. I don't think the stricly equivalent operator should return true for such a case.</p>
</section>
<section id="strictly-equal-operator">
<h2>Strictly equal operator <a href="#strictly-equal-operator">#</a></h2>
<p>Sometimes I wish Sass could make a distinction between <code>==</code> and <code>===</code>. As a reminder, the first one check whether values are equal while the latter makes sure both are of the same type. This to prevent something like <code>5 == '5'</code> to return <code>true</code>. When checking with <code>===</code>, it should return <code>false</code>.</p>
<p>Anyway, when you use <code>==</code> in Sass, it actually means <code>===</code>. So basically there is no way to check whether two values are equal in Sass with as well checking their type.</p>
<p>In most cases, this is really not an issue but I came up with a case where I didn't wanted to check the type. Please have a look at the following exemple:</p>
<pre class="language-scss"><code>// Initializing an empty list
$list: ();

// Checking whether the list is true
$check: $list == true; // false, as expected

// Checking whether the list is false
$check: $list == false; // false</code></pre>
<p>While we would expect an empty list to be <code>false</code>, it turns out it is not. If it's not false, then it's true! Right? Seems not. An empty list is neither true nor false because <code>==</code> also checks for types. So the preview statement would look like something like this: <code>[list] === [bool]</code> which is obviously false, no matter what the boolean is.</p>
<p>Okay so this makes sense that the previous example returns <code>false</code> in both cases! Nevertheless, <code>()</code> being evaluated to <code>false</code> would be quite cool when checking for a valid value to append to a list. Please consider the following code.</p>
<pre class="language-scss"><code>$list: (a, b, c);
$value: ();

@if $value { // Short for `$value == true` which is the same as `$value != false`
    $list: append($list, $value);
}</code></pre>
<p>If <code>()</code> was considered as a falsy value, the condition wouldn't match and the 4th element of <code>$list</code> wouldn't be an empty list. This is how it works in JavaScript:</p>
<pre class="language-javascript"><code>var array = ['a', 'b', 'c'];
var value = [];

if(value != false) {
    array.push(value);
}</code></pre>
<p>This works because JavaScript makes a difference between <code>!=</code> and <code>!==</code> while Sass uses the latter no matter what.</p>
<p>We talked about the empty-list case in this section but there is the exact same problem with an empty string <code>""</code> or even the <code>null</code> value. Anyway, as I said it's barely an issue, but it has boggled me more than once.</p>
</section>
<section id="list-append">
<h2>List append <a href="#list-append">#</a></h2>
<p>Even after <a href="http://hugogiraudel.com/2013/07/15/understanding-sass-lists/">many</a> <a href="http://hugogiraudel.com/2013/08/08/advanced-sass-list-functions/">articles</a> <a href="http://hugogiraudel.com/2013/10/09/advanced-sass-list-functions-again/">about</a> <a href="http://thesassway.com/advanced/math-sequences-with-sass">Sass</a> lists, they keep surprising me with how messed up they are.</p>
<p>As you may now, most single-values in Sass are considered as one item-long lists. This is meant to allow the use of <code>length()</code>, <code>nth()</code>, <code>index()</code> and more. Meanwhile, if you test the type of a single-value list, it won't return <code>list</code> but whatever the type is (could it be <code>bool</code>, <code>number</code> or <code>string</code>). Quick example:</p>
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
<p>Okay let's put this straight: variable scope has always been my pet hate. I don't know why, I always got it wrong. I believe Sass variable scope is good, but for some reason it doesn't always work the way I'd want it to work. I recall trying to help someone who wanted to do something like this:</p>
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
<p>I want to play a game. In your opinion, what is the CSS rendered by this code (shamelessly stolen from <a href="http://twitter.com/pioupioum">Mehdi Kabab</a>'s new book - "Sass and Compass avancé")?</p>
<p>The correct answer is:</p>
<pre class="language-scss"><code>el {
    font-size: 1em; 
    margin-bottom: .6em;
}</code></pre>
<p>This is actually not fucked up at all: it's the expected behaviour from a correct variable scoping. While it might look silly for an advanced Sass user, I bet it's not that obvious to the beginner. The declared <code>$size</code> variable is used for the font-size while the default value for the <code>$size</code> argument is used for the bottom margin since it is inside the mixin, where the variable is scoped.</p>
</section>