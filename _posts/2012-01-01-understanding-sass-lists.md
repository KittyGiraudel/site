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
<section>
<h2>Creating a Sass list</h2>
<p>First things first. Even creating a Sass list can be tricky. Indeed, Sass isn't very strict with variable types. Basically it means you can process a list quite like a string, or use list functions to a string. It is basically a mess.</p>
<p>Anyway, we have a couple of ways to initialize an empty variable (that could be treated as a list):</p>
{% highlight css %}
$a: ();
type-of($a) -> list
$b: unquote('');
type-of($b) -> string
$c: null;
type-of($c) -> null
$d: (null);
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
<section>
<h2>Sass list "fun" facts</h2>
<p>This section has been quickly covered in the article at CSS-Tricks but since it is the very basics I have to put this here as well.</p>
<p><strong>You can ommit braces.</strong> You can define a non-empty list without any braces if you feel so. Thus <code>$list: "item-1", "item-2", "item-3"</code> is perfectly valid.</p>
{% highlight css %}
$list: "item-1", "item-2", "item-3";
{% endhighlight %}
<p><strong>Indexes start at 1, not 0.</strong> This is one of the most disturbing once you start experimenting with Sass lists. Plus it makes a lot of things pretty complicated (cf CSS-Tricks article).</p>
{% highlight css %}
$list: "item-1", "item-2", "item-3";
nth($list, 0) -> throws error
nth($list, 1) -> "item-1"
{% endhighlight %}
<p><strong>You can use spaces or commas as separator.</strong> Even if I feel more comfortable with commas since it is the classic separator for arrays (JavaScript, PHP...).</p>
{% highlight css %}
$list: "item-1" "item-2" "item-3";
{% endhighlight %}
<p><strong>You can nest lists.</strong> As for JavaScript or any other language, there is no limit regarding the level of depth you can have with nested lists. Just go as deep as like bro. </p>
{% highlight css %}
/* Nested lists with braces and same separator (clean) */
$list: ( 
		("item-1.1", "item-1.2", "item-1.3"), 
        ("item-2.1", "item-2.2", "item-2.3"),
        ("item-3.1", "item-3.2", "item-3.3")
       );
/* Nested lists the "dirty" way */
$list: "item-1.1" "item-1.2" "item-1.3", 
       "item-2.1" "item-2.2" "item-2.3",
       "item-3.1" "item-3.2" "item-3.3";
{% endhighlight %}
</section>
