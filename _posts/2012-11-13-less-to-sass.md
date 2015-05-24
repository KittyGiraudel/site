---
disqus: http://hugogiraudel.com/blog/less-to-sass.html
layout: post
title: "Why I switched from LESS to Sass"
---

Yaaay, another blog post on the web about CSS preprocessors, as if there wasn’t enough. Don’t worry: I won’t try to convince you to use a CSS preprocessor, neither about the one you should pick. These decisions are really up to you.

So this post will be about my own experience with CSS preprocessors. For the concern, I recently wrote an article for Codrops untitled “10 things I learnt about CSS” and I talked a lot about preprocessors, so I’ve read (and tried) a bunch of things on the topic lately.

Anyway and before anything, please note I’m not a hardcore CSS preprocessor user. I’m more like a novice with these tools, but I’ve already worked a little bit on 2 of them: firstly LESS then Sass. I recently moved from LESS to Sass and don’t plan on going back.

## Why LESS as a first try 

A few weeks ago, I wanted to have a real shot with CSS preprocessors after hours of playing on [CodePen](http://codepen.io) so I read a few things to make a choice. To put it simple, there are currently 4 major CSS preprocessors:

* [Sass](http://sass-lang.com/) built on Ruby
* [LESS](http://lesscss.org/) built on JavaScript
* [Stylus](http://learnboost.github.com/stylus/) built on JavaScript
* [CSS Crush](http://the-echoplex.net/csscrush/) built on PHP

I’ve never heard much about Stylus so it was not an option to me. I wanted to have a quick access to complete documentation since I was a little bit scared to take the plunge. And even if CSS Crush sounded really cool because I’m familiar with PHP, I’ve read too few on it to consider this as real choice.

So I had to choose between LESS and Sass like almost everyone else. One thing made the difference in favor of LESS: it could run locally. You see I’m more like a client-side kind of guy. I’m really uncomfortable when it comes to server and command lines, so the fact LESS could be compiled with JavaScript on the fly sounded awesome to me. On the other hand, Sass required to install Ruby and run some command lines and it scared me. So LESS it was.

I’ve played with LESS a few days, tried a few things and even built my own framework on it. It was really cool to see CSS pushed to an upper level and I was starting to think I could do all my future projects with LESS. Until I realized LESS client-side compilation is awful performance speaking.

Anyway, that wasn’t the worst thing. I still could learn how to run the server-side part of LESS to compile, or switch to LESSPHP with the help of my brother who uses it at work. No, the worst thing occurred to me when I tried to dig deep down into the entrails of LESS.

## When I started realizing LESS wasn’t the Eldorado 

One of the first “complicated” thing I tried to create was a mixin handling CSS arrows the same way [CSSArrowPlease](http://cssarrowplease.com/) does. It took me a couple of hours but I finally succeeded and [hosted it on GitHub](https://github.com/HugoGiraudel/LESS-Mixin-for-CSS-arrows). However I noticed something counter-intuitive: conditional statements.

### LESS and conditional statements

The way I wanted to handle my mixin was something which would look like this:

```scss
.mixin(parameters) {
/* Basic stuff here */
if (direction = top)    { /* Conditional stuff here */ }
else if (direction = bottom) { /* Conditional stuff here */ }
else if (direction = left)   { /* Conditional stuff here */ }
else if (direction = right)  { /* Conditional stuff here */ }
}
```

The fact is **LESS doesn’t handle if / else statements**. Instead, it provides guarded mixins (mixin when a parameter exists or equals / is inferior / is superior to something). So basically, I had to do something like this:

```scss
.mixin(parameters) {
	/*Basic stuff here */
}
.mixin(parameters) when (direction = top) {
	/* Conditional stuff here */
}
.mixin(parameters) when (direction = bottom) {
	/* Conditional stuff here */
}
.mixin(parameters) when (direction = left) {
	/* Conditional stuff here */
}
.mixin(parameters) when (direction = right) {
	/* Conditional stuff here */
}
```

It may look similar at the first glance but it involves a few things:

* it multiplies the number of mixin declarations. It’s not one mixin with conditions, it’s multiple mixins varying according to their parameters,
* it becomes hard to understand when multiple conditions are gathered at once,
* it looks counter-intuitive to me since I would like to do as mentioned earlier.

Anyway, I was just a little frustrated not to be able to use what seems intuitive to me: real if/else conditional statements but all in all I succeeded in doing my mixin so it was not so bad. Things started getting bad when I wanted to do moar.

For a recent [Codrops article on pure CSS loading animations](http://tympanus.net/codrops/2012/11/14/creative-css-loading-animations/), I wanted to include a few things about CSS preprocessors and how they are supposed to be easy to use. Actually, it could have been very very simple if I wasn’t using LESS. One of these things was a loop.

### LESS and loops

Loops are cool: they can handle a huge amount of operations in only a few lines and even if you don’t need them everyday in CSS, it’s cool to have the option to use them. I wanted a loop to set the appropriate animation name on a dozen of elements. This is more or less what I was expecting:

```scss
@nbElements: 10;
for(@i = 0; @i &lt; @nbElements; @i++) {
	.my-element:nth-child(@i) { animation-name: loading-@i; }
}
```

Well, this is absolutely not how LESS is handling loops. Actually **LESS doesn't handle loops**; you have to use a recursive function (a function calling itself) in order to reproduce the desired behaviour. This is what I ended up with:

```scss
/* Define loop */
.loop(@index) when (@index &gt; 0) {
	(~".my-element:nth-child(@{index})") {
		animation-name: "loading-@{index}";
	}

	/* Call itself */
	.loop(@index - 1);
}

/* Stop loop */
.loop (0) {}

/* Use loop */
@nbElements: 10;
.loop (@nbElements);
```

In what universe is this more user-friendly and intuitive than a classic for loop? Is there anyone here who would have thought about this at first? I started thinking LESS was not as perfect as I first thought but sadly, that was still not the worst part.

Things went very ugly when I wanted to manage @keyframes inside this for loop. Yeah, I know: I like challenge.

### LESS and concatenation

I know concatenation can be somewhat annoying to handle depending on the language, but I was far from thinking LESS was so bad on this topic. First thing I discovered: **you can't use/concatenate a variable as a selector** without a work-around and **you absolutely can't use a variable as a property name** in LESS (at least as far as I can tell). Only as a value.

```scss
/* This works */
.my-element {
	color: @my-value;
}

/* This doesn't work */
@my-element {
	color: @my-value;
}

/* This doesn't work either */
@{my-element} {
	color: @my-value;
}

/* But this works */
(~"@{my-element}") {
	color: @my-value;
}

/* And this can't work */
.my-element {
	@my-property: @my-value;
	@{my-property}: @my-value;
	(~"@{my-property}"): @my-value;
}
```

Two very annoying things there: we definitely can't use variables as property names and the concatenation syntax is ugly as hell. `(~"@{variable}")`, really? But actually if you want my opinion, **the biggest mistake they made is to name variables with the at sign @**.

It is somewhat well thought out since CSS is using this sign for “alternative stuff” like media queries (@media), animation keyframes (@keyframes) and probably other things in the future (@page for example). I got the reasoning and I admire the will of sticking to the regular CSS syntax.

But come on... How come they didn’t think about variable concatenations and @keyframes/@page uses inside mixins?


Basically, LESS fails to understand @page and @keyframes inside mixins because it throws an exception according to [its source code](https://github.com/cloudhead/less.js/blob/b235734a11f646252db8f0947fee406ce67cf904/lib/less/parser.js#L1158). So you'll need two nested mixins: one handling your animation, the second one to handle the keyframes. Sounds heavy and complicated, well it is. So let’s say you want to create a custom mixin using @keyframes and vendor prefixes (not much, right?) this is what you have to do:

```scss
@newline: `"\n"`; /* Newline */
.my-mixin(@selector, @name, @other-parameters) {
	/* @selector is the element using your animation 
	 * @name is the name of your animation
	 * @other-parameters are the parameters of your animation
	 */ 

	.keyframe-mixin(@pre, @post, @vendor) {
		/* @pre is the newline hack (empty on the first declaration)
		 * @post is a variable fix to detect the last declaration (1 on the last one)
		 * @vendor is the vendor prefix you want  
		 */

		(~"@{pre}@@{vendor}keyframes @{name} {@{newline} 0%") {
			/* 0% stuff here */ 
		} 

		100%  { 
			/* 100% stuff here */
		} 

		.Local(){}
		.Local() when (@post=1) {
			(~"}@{newline}@{selector}") {
				-webkit-animation: @name;
				-moz-animation:    @name;
				-ms-animation:     @name;
				-o-animation:      @name;
				animation:         @name;
			} 
		}    
	.Local;
	}

.keyframe-mixin(""            , 0, "-webkit-");
.keyframe-mixin(~"}@{newline}", 0,    "-moz-");
.keyframe-mixin(~"}@{newline}", 0,     "-ms-");
.keyframe-mixin(~"}@{newline}", 0,      "-o-");
.keyframe-mixin(~"}@{newline}", 1,         "");

} 
.my-mixin("#whatever", name, other-parameters);
```

Yeah, this is a complete nightmare. I'm not the one who wrote this; I've been searching for hours how to do this before finding [a very complete answer](http://stackoverflow.com/questions/13160991/chaining-keyframe-attributes-with-less) on StackOverflow leading to two others related topic with wonderful answers ([here](http://stackoverflow.com/questions/11551313/less-css-pass-mixin-as-a-parameter-to-another-mixin/11589227#11589227) and [there](http://stackoverflow.com/questions/9166152/sign-and-variables-in-css-keyframes-using-less-css)).

*Note: the `.Local()` thing seems to be a keyword for "this" but I couldn't find any confirmation on this. If you have, please catch me on Twitter.*

So basically, here is what there is to say ([still not from me](http://stackoverflow.com/questions/9166152/sign-and-variables-in-css-keyframes-using-less-css/11028622#11028622)):

* The initial selector `(~"@keyframes @{name}{") { ... }` renders as `@keyframes name { { ... }   
* To avoid `{ {`, it requires a newline which cannot be escaped directly so through the variable `@newline: \`"\n"\``;. LESS parses anything between backticks as JavaScript, so the resulting value is a newline character.
* Since `{ ... }` requires a selector to be valid, we use the first step of the animation (0%).
* But the curly braces do not match. To fix this, we can add a dummy selector in the end, which starts with `(~"} dummy") { .. }`. How ugly is that?
* But wait, we already know that vendor prefixes are going to be added in sequel. So, let the final first selector be `(~"@{pre} @@{vendor}keyframes @{name} {@{newline}0%")`. What a nightmare...
* `@{pre}` has to be `"}@{newline}"` for every keyframes block after the first one.
* Instead of a dummy selector for the last curly brace, we define the keyframe mixins. We're using a guarded mixin to implement this.

Anyway, this was waaaaay too much for me. **The point of CSS preprocessors is to easy the CSS development, not to make it harder**. So this is the moment I realized LESS wasn't *that* good.

## Why I think Sass is better 

I won't make a complete and detailed comparison between Sass and LESS because some guys did it very well already ([Chris Coyier](http://css-tricks.com/sass-vs-less/), [Kewin Powell](http://fr.slideshare.net/utbkevin/less-vs-sass-css-precompiler-showdown-14068991), etc.). I'll only cover the few points I talked about earlier.

### Sass and conditional statements

```scss
@mixin my-mixin($parameters) {
	/* Basic stuff here */
	@if $my-parameter == value {
		/* Conditional stuff here */
	}
}
```

This is the Sass syntax for conditional statements in a mixin. Okay, it may lack of some brackets but it's way easier than the LESS syntax in my opinion.

### Sass and loops

```scss
@for $i from 1 through 10 {
/* My stuff here */
}
```

Once again, it may lack of a few brackets but we still understand very well how it works. It's almost plain language: *"for variable i from 1 through 10, do this"*. It looks very intuitive to me.

### Sass and concatenation

Sass has absolutely no problem with concatenation neither in selectors nor in property names. You only have to do this `#{$my-variable}` to make things work.

```scss
#{$my-selector} {
	#{$my-property}: $my-value;
}
```

### Other things

Very quickly, here are the few things making me tell Sass is better than LESS. Those are well explained in the above links.

* Sass has [Compass](http://compass-style.org/) which keeps CSS3 support up to date
* Sass provides the `@extend` feature allowing you to extend a class from another one
* Sass handles media queries in a better and more advanced ways than others
* Sass throws errors instead of miscalculations when doing operations with units
* <span style="text-decoration: line-through;">Sass provides a minifying function to compress your CSS files</span> (so does LESS server-side)
* Sass is slightly more active, development speaking

## LESS is not so bad 

Well, I've been moaning about LESS the whole article, but honestly this is not so bad. At least, it's no so bad if you don't plan on complicated and advanced things. Actually there are things LESS are better at, let me tell you my opinion about it:

* <span style="text-decoration: line-through;">LESS provides some really cool color functions (darken, lighten, spin, de/saturate, fade, fadein, fadeout, mix, contrast)</span> (so does Sass)
* LESS has a nicer and more accessible documentation on [lesscss.org](http://lesscss.org/)
* LESS is not dependent to either command line skills or a third program
* LESS can be used locally without any install required (simple JS script)
* <a href="http://twitter.github.com/bootstrap/" title="Twitter Bootstrap">Twitter Bootstrap</a> which is probably the biggest framework outhere running thousands of websites is built on LESS; it sounds like a nice proof that LESS is a good CSS preprocessor to me

Whatsoever, the choice is really up to you. All of this was only my opinion based on my experience. **LESS is still a good CSS preprocessor, but in the end I think Sass is simply better**.

  
