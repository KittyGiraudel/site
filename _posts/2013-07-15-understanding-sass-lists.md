---
published: true
layout: post
title: Understanding Sass lists
comments: true
---

<section>
<p>Lists have to be the most complicated and vicious thing in the whole Sass language. The main problem with lists -if a problem it is- is that the syntax is way too permissive. You can do pretty much whatever you want.</p>
<p>Anyway, I recently had the opportunity to write <a href="http://css-tricks.com/striped-background-gradients/">an article for CSS-Tricks</a> about a Sass function involving quite a lot of list manipulation. I introduced the topic by clearing a couple of things regarding Sass lists but I wanted to write a more in-depth article.</p>
</section>
<section id="init">
<h2>Creating a Sass list <a href="#init">#</a></h2>
<p>First things first. Even creating a Sass list can be tricky. Indeed, Sass isn't very strict with variable types. Basically it means you can process a list quite like a string, or use list functions to a string. It is basically a mess.</p>
<p>Anyway, we have a couple of ways to initialize an empty variable (that could be treated as a list):</p>
<blockquote class="pull-quote--right">Sass isn't very strict with variable type.</blockquote>
<pre class="language-scss"><code>$a: ();
$b: unquote('');
$c: null;
$d: (null);</code></pre>
<p>Now we have defined our variables, we will check their type. Just for fun.</p>
<pre class="language-scss"><code>type-of($a) -> list
type-of($b) -> string
type-of($c) -> null
type-of($d) -> null</code></pre>
<p>Since <code>$c</code> and <code>$d</code> are stricly equivalent, we will remove the later from the next tests. Let's check the length of each variable.</p>
<pre class="language-scss"><code>length($a) -> 0
length($b) -> 1
length($c) -> 1</code></pre>
<p><code>$a</code> being 0 item long is what we would have expected since it is an empty list. String being 1 item long isn't that odd either since it is a string. However the <code>null</code> variable being 1 item long is kind of weird; more on this later.</p>
</section>
<section id="facts">
<h2>Sass list "fun" facts <a href="#facts">#</a></h2>
<p>This section has been quickly covered in the article at CSS-Tricks but since it is the very basics I have to put this here as well.</p>
<p><strong>You can use spaces or commas as separator.</strong> Even if I feel more comfortable with commas since it is the classic separator for arrays (JavaScript, PHP...).</p>
<pre class="language-scss"><code>$list-space: "item-1" "item-2" "item-3";
$list-comma: "item-1", "item-2", "item-3";</code></pre>
<p class="note">Note: As in CSS, you can ommit quotes for your strings as long as they don't contain any special characters. So <code>$list: item-1, item-2, item-3</code> is perfectly valid.</p>
<p><strong>You can nest lists.</strong> As for JavaScript or any other language, there is no limit regarding the level of depth you can have with nested lists. Just go as deep as you need to, bro. </p>
<pre class="language-scss"><code>/* Nested lists with braces and same separator */
$list: ( 
		("item-1.1", "item-1.2", "item-1.3"), 
        ("item-2.1", "item-2.2", "item-2.3"),
        ("item-3.1", "item-3.2", "item-3.3")
       );
       
/* Nested lists without braces using different separators to distinguish levels */
$list: "item-1.1" "item-1.2" "item-1.3", 
       "item-2.1" "item-2.2" "item-2.3",
       "item-3.1" "item-3.2" "item-3.3";</code></pre>
<p><strong>You can ommit braces</strong> (as you can guess from the previous example). You can define a non-empty list without any braces if you feel so. This is because -contrarily to what most people think- <a href="https://github.com/nex3/sass/issues/837#issuecomment-20429965">braces are not what create lists</a> in Sass (except when empty); it is the delimiter (see below). Braces are a just a grouping mecanism.</p>
<p class="note">Note: This is the theory. I've noticed braces are not just a grouping mecanism. When manipulating matrices (4/5+ levels of nesting), braces are definitely not optional. This is too complicated for today though, we'll dig into this in anotger blog post.</p>
<blockquote class="pull-quote--right">Manipulating 5+ nested lists is a pain in the ass.</blockquote>
<pre class="language-scss"><code>$list: "item-1", "item-2", "item-3";</code></pre>
<p><strong>Indexes start at 1, not 0.</strong> This is one of the most disturbing once you start experimenting with Sass lists. Plus it makes a lot of things pretty complicated (cf CSS-Tricks article).</p>
<pre class="language-scss"><code>nth($list, 0) -> throws error
nth($list, 1) -> "item-1"</code></pre>
<p><strong>Every value in Sass is treated as a list.</strong> Strings, numbers, boolean, whatever you can put in a variable. This means you're fine to use some <a href="#functions">list functions</a> even on things that don't look like one.</p>
<pre class="language-scss"><code>$variable: "Sass is awesome";
length($variable) -> 1</code></pre>
<p class="note">Beware! If you remove the quotes around this string, it will be parsed as a 3 items long list (1: Sass; 2: is; 3: awesome). I recommand you quotes your strings to avoid some unpleasant surprises.</p>
</section>
<section id="functions">
<h2>Sass list functions <a href="#functions">#</a></h2>
<p>Before getting into the real topic, let's make a round-up on Sass list functions.</p>
<p><strong><code class="language-scss">length($list)</code></strong>: returns the length of a <code>$list</code> (if not a list, returns 1).</p>
<p><strong><code class="language-scss">nth($list, $index)</code></strong>: returns the value at <code>$index</code> position in <code>$list</code> (throw an error if index out of list range).</p>
<p><strong><code class="language-scss">index($list, $value)</code></strong>: returns the first index of the searched for <code>$value</code> in <code>$list</code> (false if not found).</p>
<p><strong><code class="language-scss">append($list, $value[, $separator])</code></strong>: appends <code>$value</code> to the end of <code>$list</code> using <code>$separator</code> as a separator (using the current one if not specified).</p>
<p><strong><code class="language-scss">join($list-1, $list-2[, $separator])</code></strong>: appends <code>$list-2</code> to <code>$list-1</code> using <code>$separator</code> as a separator (using the one from the first list if not specified).</p> 
<p><strong><code class="language-scss">zip(*$lists)</code></strong>: combines several list into a comma-separated list where the nth value is a space-separated lists of all source lists nth values. In case source lists are not all the same length, the result list will be the length of the shortest one.</p>
<p><strong><code class="language-scss">reject($list, $value)</code></strong><em> (Compass)</em>: removes <code>$value</code> from <code>$list</code>.</p>
<p><strong><code class="language-scss">compact(*$args)</code></strong> <em>(Compass)</em>: returns a new list after removing all the non-true values.</p>
</section>
<section id="experimenting">
<h2>Adding things to Sass lists <a href="#experimenting">#</a></h2>
<p>This is where things get very interesting. And quite complicated as well. I think the best way to explain this kind of stuff is to use an example. I'll use the same I talked about in <a href="http://hugogiraudel.com/2013/07/01/feedbacks-kiwiparty/">my Sass talk at KiwiParty</a> last month.</p>
<p>Please consider an extended selector like <code>.home .nav-home, .about .nav-about, .products .nav-products, .contact .nav-contact</code> based on a list of keywords <code>$pages: home, about, products, contact</code>. I found 3 ways to generate this selector based on the list; we'll see them one by one.</p>
<p>But first, we will write the skeleton of our testcase:</p>
<pre class="language-scss"><code>$pages: home, about, products, contact;
$selector: ();

@each $item in $pages {
	/* We create $selector */
}

#{$selector} {
	style: awesome;
}</code></pre>
<h3>The long and dirty way</h3>
<p>This is the method I was still using a couple of weeks ago. It works but it involves an extra conditional statemens to handle commas. Please see below.</p>
<pre class="language-scss"><code>@each $item in $pages {
	$selector: $selector unquote('.#{$item} .nav-#{$item}');
    
    @if $item != nth($pages, length($pages)) {
    	$selector: $selector unquote(',');
    }
}</code></pre>
<p>Basically, we add the new selector to <code>$selector</code> and if we are not dealing with the last item of the list, we add a comma.</p>
<p class="note">Note: we have to use <code>unquote('')</code> to treat our new selector as an unquoted string.</p>
<h3>The clean way</h3>
<p>This one is the cleanest way you can use between the three; not the shortest though. Anyway, it uses <code>append()</code> properly.</p>
<pre class="language-scss"><code>@each $item in $pages {
	$selector: append($selector, unquote('.#{$item} .nav-#{$item}'), comma);
}</code></pre>
<p>I think this is pretty straightforward: we append to <code>$selector</code> the new selector by explicitly separating it from the previous one with a comma.</p>
<h3>The implicit way</h3>
<p>Probably my favorite version above all since it's the shortest. It relies on implicit appending; very neat.</p>
<pre class="language-scss"><code>@each $item in $pages {
	$selector: $selector, unquote('.#{$item} .nav-#{$item}');
}</code></pre>
<p>Instead of using <code>append()</code> and setting the 3rd parameter to <code>comma</code> we implicitly do it via removing the function and using a comma right after <code>$selector</code>.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<blockquote class="pull-quote--right">Having a very permissive can be complicated.</blockquote>
<p>The three versions we saw in the previous section work like a charm, the one you should use is really up to you. You can also do it in some other more complicated and dirty ways.</p>
<p>Anyway, this shows why having a very permissive can be complicated. As I said at the beginning of this post, you can do pretty much whatever you want and if you want my opinion this isn't for the best.</p>
</section>
