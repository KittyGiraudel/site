---
published: true
layout: post
title: Understanding Sass lists
preview: true
comments: false
---

<section>
<p>Lists have to be the most complicated and vicious thing in the whole Sass language. The main problem with lists -if a problem it is- is that the syntax is too permissive. You can do pretty much whatever you want.</p>
<p>Anyway, I recently had the opportunity to write an article for CSS-Tricks about a Sass function involving quite a lot of list manipulation. I introduced the topic by clearing a couple of things regarding Sass lists but I wanted to write a more in-depth article.</p>
</section>
<section id="init">
<h2>Creating a Sass list <a href="#init">#</a></h2>
<p>First things first. Even creating a Sass list can be tricky. Indeed, Sass isn't very strict with variable types. Basically it means you can process a list quite like a string, or use list functions to a string. It is basically a mess.</p>
<p>Anyway, we have a couple of ways to initialize an empty variable (that could be treated as a list):</p>
{% highlight css %}
$a: ();
$b: unquote('');
$c: null;
$d: (null);
{% endhighlight %}
<p>Now we have defined our variables, we will check their type. Just for fun.</p>
{% highlight css %}
type-of($a) -> list
type-of($b) -> string
type-of($c) -> null
type-of($d) -> null
{% endhighlight %}
<p>Since <code>$c</code> and <code>$d</code> are stricly equivalent, we will remove the later from the next tests. Let's check the length of each variable.</p>
{% highlight css %}
length($a) -> 0
length($b) -> 1
length($c) -> 1
{% endhighlight %}
<p><code>$a</code> being 0 item long is what we would have expected since it is an empty list. String being 1 item long isn't that odd either since it is a string. However the <code>null</code> variable being 1 item long is kind of weird.</p>
</section>
<section id="facts">
<h2>Sass list "fun" facts <a href="#facts">#</a></h2>
<p>This section has been quickly covered in the article at CSS-Tricks but since it is the very basics I have to put this here as well.</p>
<p><strong>You can ommit braces.</strong> You can define a non-empty list without any braces if you feel so. In fact, they are often ommited. Specifying the braces explicitly casts the variable as a list while ommiting them can imply a few issues in some rare cases.</p>
{% highlight css %}
$list: "item-1", "item-2", "item-3";
{% endhighlight %}
<p><strong>Indexes start at 1, not 0.</strong> This is one of the most disturbing once you start experimenting with Sass lists. Plus it makes a lot of things pretty complicated (cf CSS-Tricks article).</p>
{% highlight css %}
nth($list, 0) -> throws error
nth($list, 1) -> "item-1"
{% endhighlight %}
<p><strong>You can use spaces or commas as separator.</strong> Even if I feel more comfortable with commas since it is the classic separator for arrays (JavaScript, PHP...).</p>
{% highlight css %}
$list: "item-1" "item-2" "item-3";
{% endhighlight %}
<p><strong>You can nest lists.</strong> As for JavaScript or any other language, there is no limit regarding the level of depth you can have with nested lists. Just go as deep as you need to, bro. </p>
{% highlight css %}
/* Nested lists with braces and same separator */
$list: ( 
		("item-1.1", "item-1.2", "item-1.3"), 
        ("item-2.1", "item-2.2", "item-2.3"),
        ("item-3.1", "item-3.2", "item-3.3")
       );
       
/* Nested lists without braces using different separators to distinguish levels */
$list: "item-1.1" "item-1.2" "item-1.3", 
       "item-2.1" "item-2.2" "item-2.3",
       "item-3.1" "item-3.2" "item-3.3";
{% endhighlight %}
</section>
<section id="functions">
<h2>Sass list functions <a href="#functions">#</a></h2>
<p>Before getting into the real topic, let's make a round-up on Sass list functions.</p>
<p><strong><code>length($list)</code></strong>: returns the length of a <code>$list</code> (if not a list, returns 1).</p>
<p><strong><code>nth($list, $index)</code></strong>: returns the value at <code>$index</code> position in <code>$list</code> (throw an error if index out of list range).</p>
<p><strong><code>index($list, $value)</code></strong>: returns the first index of the searched for <code>$value</code> in <code>$list</code> (false if not found).</p>
<p><strong><code>append($list, $value[, $separator])</code></strong>: appends <code>$value</code> to the end of <code>$list</code> using <code>$separator</code> as a separator (using the current one if not specified).</p>
<p><strong><code>join($list-1, $list-2[, $separator])</code></strong>: appends <code>$list-2</code> to <code>$list-1</code> using <code>$separator</code> as a separator (using the one from the first list if not specified).</p> 
<p><strong><code>zip(*$lists)</code></strong>: combines several list into a comma-separated list where the nth value is a space-separated lists of all source lists nth values. In case source lists are not all the same length, the result list will be the length of the shortest one.</p>
<p><strong><code>reject($list, $value)</code></strong> (Compass): removes <code>$value</code> from <code>$list</code>.</p>
<p><strong><code>compact(*$args)</code></strong> (Compass): returns a new list after removing all the non-true values.</p>
<section id="experimenting">
<h2>Adding things to Sass lists <a href="#experimenting">#</a></h2>
<p>This is where things get very interesting. And quite complicated as well. I think the best way to explain this kind of stuff is to use an example. I'll use the same I talked about in my Sass talk at KiwiParty last month.</p>
<p>Please consider an extended selector like <code>.home .nav-home, .about .nav-about, .products .nav-products, .contact .nav-contact</code> based on a list of keywords <code>$pages: home, about, products, contact</code>. I found 3 ways to generate this selector based on the list; we'll see them one by one.</p>
<p>But first, we will write the skeleton of our testcase:</p>
{% highlight css %}
$pages: home, about, products, contact;
$selector: ();

@each $item in $pages {
	/* We create $selector */
}

#{$selector} {
	style: awesome;
}
{% endhighlight %}
<h3>The long and dirty way</h3>
<p>This is the method I used a couple of weeks. It works but it involves an extra conditional statements to handle commas. Please see below.</p>
{% highlight css %}
@each $item in $pages {
	$selector: $selector unquote('.#{$item} .nav-#{$item}');
    
    @if $item != nth($pages, length($pages)) {
    	$selector: $selector unquote(',');
    }
}
{% endhighlight %}
<p>Basically, we add the new selector to <code>$selector</code> and if we are not dealing with the last item of the list, we add a comma.</p>
<h3>The clean way</h3>
<p>This one is the cleanest way you can use between the three; not the shortest though. Anyway, it uses <code>append()</code> properly.</p>
{% highlight css %}
@each $item in $pages {
	$selector: append($selector, unquote('.#{$item} .nav-#{$item}', comma);
}
{% endhighlight %}
<p>I think this is pretty straightforward: we append to <code>$selector</code> the new selector by explicitly separating it from the previous one with a comma.</p>
<h3>The implicit way</h3>
<p>Probably my favorite version above all since it's the shortest. It relieson implicit appending; very neat.</p>
{% highlight css %}
@each $item in $pages {
	$selector: $selector, unquote('.#{$item} .nav-#{$item}');
}
{% endhighlight %}
<p>Instead of using <code>append()</code> and setting the 3rd parameter to <code>comma</code> we implicitly do it via removing the function and using a comma right after <code>$selector</code>.</p>
</section>
