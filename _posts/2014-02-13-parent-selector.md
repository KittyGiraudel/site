---
layout: post
comments: false
preview: true
title: "Parent selector: on `has()` and `^`"
---
<section>
Yesterday I stumbled upon [this Google Survey](https://docs.google.com/forms/d/1x0eXPBj1GN8Zau-7k9J_JGhoM6uGEqlJBkBBDFswT2w/viewform?edit_requested=true) about the selector syntax for the incoming parent selector from [Selectors Level 4](http://dev.w3.org/csswg/selectors4/#subject) module asking for developers' help on choosing the right syntax for this feature. 

The official syntax for this has yet to be determined and as of writing there are two proposals grabbing some attention:

* the `:has()` pseudo-class (e.g. `X:has(Y)`)
* the `^` operator (e.g. `^X Y`) ; an old proposal also mentions `!` instead of `^` but the idea is the same

I think it should be `:has()`. Definitely. And here is why.
</section>
<section id="readibility">
## Starting with the obvious [#](#readability)
One thing that no one can misses is how obvious the `:has()` proposal is. It speaks for iself. One thing I always liked in CSS is the ability to understand the selectors just by reading them out loud. When you see something like this:
<blockquote class="pull-quote--right">CSS selectors can be understood by reading them out loud.</blockquote>

<pre class="language-css"><code>A:has(B)</code></pre>

... you only have to read it to understand it: *I want to select all elements `A` containing at least one element `B`*. You can try it for pretty much all CSS selectors, it works pretty well. The exception could be `~` (and `>` in a lesser extend) which isn't as obvious as it should be.

Anyway, we got a first problem with `^` here: it doesn't make any sense. You have to know it to understand it. This is rather bad in my opinion but I guess it's not terrible and can still be a valid candidate for the parent selector.

Moving on.
</section>
<section id="selector-target-last">
## Keeping target last [#](#selector-target-last)

The "ah-ah moment" I had a while back about CSS was that the target of a CSS selector is always at the end of it. That's also a reason why CSS parsers read selectors from right to left and not left to right. Because this is the way it makes sense. 

<pre class="language-css"><code>nav a:hover span</code></pre>

In this example, `span` is the target. Not `nav` or `a:hover`. Just `span`. This is the element you're willing to style. The remaining pieces of the selector are nothing but the context. You may think of it this way:

* *What we want?!* &mdash; *`span`!*
* *Where we want?!* &mdash; *When hovering `a` in `nav`!*
* *When we want?!* &mdash; *Now!*

Adding a pseudo-class or a pseudo-element to the last element from the selector doesn't change the target, it only adds some more context on the target itself. 

<pre class="language-css"><code>nav a:hover span:after</code></pre>

The last element is still the target of the selector, although now it's not only `span` but `span:after`. Now back to our discussion, plus I'm sure you can see the problem now.

The `^` character &mdash; or whatever character could it be &mdash; breaks that rule and this is rather bad in my opinion. When you see `^A B`, the target is no longer `B`, it's `A` because of this little character right on its left. 

Meanwhile `:has()` being a pseudo-class it preserves this golden rule by keeping the selector's target to the end. In `A B:has(C)`, there are only two dissociable parts: `A` and `B:has(C)`. And as you can see, the target (`B:has(C)`) is still at the end of the selector.
</section>
<section id="consistency">
## Keeping it consistent [#](#consistency)

Not only `:has()` is both more readable and more understandable, but it also goes very well with the existing pseudo-classes, especially [`:not()`](http://dev.w3.org/csswg/selectors4/#negation) and [`:matches()`](http://dev.w3.org/csswg/selectors4/#matches) ([aliased as `:any()` in Firefox](https://developer.mozilla.org/en-US/docs/Web/CSS/:any)) which both work in the exact same way.

<blockquote class="pull-quote--right">There are reasons why we have `:not()` and not `!` as a negative operator.</blockquote>

Having meaningful pseudo-classes can make a huge difference. There are reasons why we have `:not()` and not `!` as a *negative operator*. Because `A:not(B):has(C)` is easier to read than `^A!B C`. 

Actually the single fact `:not()` already exists as is in the spec is enough to make `:has()` the only valid choice to this whole discussion.

Also, no selector should start with an operator. You can't write something like `> A` or `~ B` so why should you be able to write something like `^ A B`? On the other hand, starting a selector with a pseudo-class/pseudo-element, while uncommon, is definitely valid (e.g. `:hover`).
</section>
<section id="multiple-occurrences">
## Multiple occurrences mess [#](#multiple-occurrences)

There are still edge cases I don't really see handled with the single character notation. For instance, what happens if there are multiple occurrences of the `^` symbol in the selector, like:

<pre class="language-css"><code>A ^B ^C D</code></pre>

What happens here? What is the selector's target? Is it `C`? Is it `D`? We don't know and more accurately: we can't know. I believe this should simply throw an error (which, in CSS, is equivalent to *skip that shit and move on*).

On the other hand, the pseudo-class proposal make it very easy to allow multiple occurrences of itself in a selector. Even better, chaining and nesting are possible.

<pre class="language-css"><code>A:has(B:has(C))</code></pre>

This means we are looking for all `A` elements containing at least a `B` element, himself containing at least a `C` element. Doing this with the other syntax is close to impossible and if we can come up with a solution, would it be as clean as this one?
</section>
<section id="in-favor-of-single-character-proposal">
## In favor of `^` [#](#in-favor-of-single-character-proposal)

There are two major pros for the single character proposal:

1. It's shorter and easier to type. Typing `^` or `!` is very easy and takes no mare than a single keypress. Meanwhile, typing `:has()` takes 6 keypresses including a mix of letters and special characters. Sounds silly but that's definitely longer to type.
2. Because it's shorter, it means it results in a shorter stylesheet. Okay, it's no big deal at this point but if you start using it a lot (and I know you will, come on it's the parent selector) you can see a tiny difference in the resulting stylesheet.

That being said, I really don't see this as an interesting trade-off. Having consistent and robust selectors is far more important than having to type a couple of extra characters.
</section>
<section id="final-thoughts">
## Final thoughts [#](#final-thoughts)

If you ask me, the `^` proposal (or `!` for that matter) sucks. Syntactically it's very poor and messy. I don't think it should even be considered. The only fair pro I can see is it's shorter which is definitely not a good reason to consider it as a solid candidate for parent selector.

Meanwhile, `:has()` is robust, simple and very permissive. It's the One folks. 
</section>
