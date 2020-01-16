---
title: "Parent selector: on has() and ^"
tags:
  - thoughts
  - css
  - parent selector
---

Yesterday I stumbled upon [this Google Survey](https://docs.google.com/forms/d/1x0eXPBj1GN8Zau-7k9J_JGhoM6uGEqlJBkBBDFswT2w/viewform?edit_requested=true) about the selector syntax for the incoming parent selector from [Selectors Level 4](https://dev.w3.org/csswg/selectors4/#subject) module asking for developers' help on choosing the right syntax for this feature.

The official syntax for this has yet to be determined and as of writing there are two proposals grabbing some attention:

* the `:has()` pseudo-class (e.g. `X:has(Y)`)
* the `^` operator (e.g. `^X Y`) ; an old proposal also mentions `!` instead of `^` but the idea is the same

I think it should be `:has()`. Definitely. And here is why.

## Starting with the obvious

ses is how obvious the `:has()` proposal is. It speaks for itself. One thing I always liked in CSS is the ability to understand the selectors just by reading them out loud. When you see something like this:

> CSS selectors can be understood by reading them out loud.

```css
a: has(B);
```

… you only have to read it to understand it: _I want to select all elements `A` containing at least one element `B`_. You can try it for pretty much all CSS selectors, it works pretty well. The exception could be `~` (and `>` in a lesser extend) which isn’t as obvious as it should be.

Anyway, we got a first problem with `^` here: it doesn’t make any sense. You have to know it to understand it. This is rather bad in my opinion but I guess it’s not terrible and can still be a valid candidate for the parent selector.

Moving on.

## Keeping target last

The "ah-ah moment" I had a while back about CSS was that the target (refered as _subject_ in the specifications) of a CSS selector is always at the end of it. That’s also a reason why CSS parsers read selectors from right to left and not left to right. Because this is the way it makes sense.

```css
nav: hover span;
```

In this example, `span` is the target. Not `nav` or `a:hover`. Just `span`. This is the element you’re willing to style. The remaining pieces of the selector are nothing but the context. You may think of it this way:

* _What we want?!_ &mdash; _`span`!_
* _Where we want?!_ &mdash; _When hovering `a` in `nav`!_
* _When we want?!_ &mdash; _Now!_

Adding a pseudo-class or a pseudo-element to the last element from the selector doesn’t change the target, it only adds some more context on the target itself.

```css
nav a:hover span:after
```

The last element is still the target of the selector, although now it’s not only `span` but `span:after`. Now back to our discussion, plus I’m sure you can see the problem now.

The `^` character &mdash; or whatever character could it be &mdash; breaks that rule and this is rather bad in my opinion. When you see `^A B`, the target is no longer `B`, it’s `A` because of this little character right on its left.

Meanwhile `:has()` being a pseudo-class it preserves this golden rule by keeping the selector’s target to the end. In `A B:has(C)`, there are only two dissociable parts: `A` and `B:has(C)`. And as you can see, the target (`B:has(C)`) is still at the end of the selector.

## Keeping it consistent

Not only `:has()` is both more readable and more understandable, but it also goes very well with the existing pseudo-classes, especially [`:not()`](https://dev.w3.org/csswg/selectors4/#negation) and [`:matches()`](https://dev.w3.org/csswg/selectors4/#matches) (aliased as [`:any()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:any) in Firefox) which both work in the exact same way.

> There are reasons why we have `:not()` and not `!` as a negative operator.

Having meaningful pseudo-classes can make a huge difference. There are reasons why we have `:not()` and not `!` as a _negative operator_. Because `A:not(B):has(C)` is easier to read than `^A!B C`.

Actually the single fact `:not()` already exists as is in the spec is enough to make `:has()` the only valid choice to this whole discussion.

Also, no selector should start with an operator. You can’t write something like `> A` or `~ B` so why should you be able to write something like `^ A B`? On the other hand, starting a selector with a pseudo-class/pseudo-element, while uncommon, is definitely valid (e.g. `:hover`).

## Multiple occurrences mess

There are still edge cases I don’t really see handled with the single character notation. For instance, what happens if there are multiple occurrences of the `^` symbol in the selector, like:

```css
A ^B ^C D
```

What happens here? What is the selector’s target? Is it `C`? Is it `D`? We don’t know and more accurately: we can’t know. According to the specifications, a selector like `^A ^B` would result in _all `B` contained in `A` and their containing `A` elements_. Needless to say it’s getting crazy. If you ask me, this should simply throw an error (which, in CSS, is equivalent to _skip that shit and move on_).

On the other hand, the pseudo-class proposal makes it very easy to allow multiple occurrences of itself in a selector. Even better, chaining and nesting are possible.

```css
a: has(B:has(C));
```

This means we are looking for all `A` elements containing at least a `B` element, himself containing at least a `C` element. Doing this with the other syntax is close to impossible and if we can come up with a solution, would it be as clean as this one?

## In favor of `^`

There are two major pros for the single character proposal:

1. It’s shorter and easier to type. Typing `^` or `!` is very easy and takes no mare than a single keypress. Meanwhile, typing `:has()` takes 6 keypresses including a mix of letters and special characters. Sounds silly but that’s definitely longer to type.
2. Because it’s shorter, it means it results in a shorter stylesheet. Okay, it’s no big deal at this point but if you start using it a lot (and I know you will, come on it’s the parent selector) you can see a tiny difference in the resulting stylesheet.

That being said, I really don’t see this as an interesting trade-off. Having consistent and robust selectors is far more important than having to type a couple of extra characters.

## Final thoughts

If you ask me, the `^` proposal (or `!` for that matter) sucks. Syntactically it’s very poor and messy. I don’t think it should even be considered. The only fair pro I can see is it’s shorter which is definitely not a good reason to consider it as a solid candidate for parent selector.

Meanwhile, `:has()` is robust, simple and very permissive. It’s the One folks.

_Update: the `^` combinator is already used in Shadow DOM where it is a descendant selector crossing a single shadow boundary. More informations on this stuff at [HTML5Rocks](https://github.com/html5rocks/www.html5rocks.com/blob/master/content/tutorials/webcomponents/shadowdom-201/en/index.md#the--and--combinators)._
