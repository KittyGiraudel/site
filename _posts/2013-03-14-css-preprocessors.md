---
title: 'Can I afford a preprocessor?'
tags:
  - css
  - sass
  - preprocessor
---

**Disclaimer:** I just want to share my thoughts on the topic. I won’t try to convince you to use a preprocessor. So please, don’t tell me how good you are without one; I trust you. I’m a developer too.

A couple of days ago, the famous french front-end developer [Vincent De Oliveira](https://twitter.com/iamvdo) has written a blog post called [Why I don’t use CSS preprocessors](http://blog.iamvdo.me/post/45259636008/pourquoi-je-nutilise-pas-les-preprocesseurs-css) (_Pourquoi je n’utilise pas les préprocesseurs CSS_). If you can read French, or stand [Google Translate](https://translate.google.fr/translate?sl=fr&tl=en&js=n&prev=_t&hl=fr&ie=UTF-8&eotf=1&u=http%3A%2F%2Fblog.iamvdo.me%2Fpost%2F45259636008%2Fpourquoi-je-nutilise-pas-les-preprocesseurs-css), then I highly recommand you this article, full of good points and interesting opinions.

Please don’t consider this post as an answer to Vincent’s one. I just wanted to **share my opinion on the topic**, not open a flame war. Especially since I like this guy. :)

## Tl;dr

There is no point debating about whether preprocessors are good or evil: they are good. If you think they are evil, it’s either because you’re afraid of them, or because you suck at them. The question isn’t even which one to choose: they all do pretty much the same things (even if Sass is slightly more robust than others). The main topic is: **should or shouldn’t you use one**?

There are cases where you don’t want to use a preprocessor (whatever the language). The main case is when your team involves some beginners or inexperienced developers: if they are not very comfortable with the language, it will be even worse with a preprocessor.

The other case is when you are dealing with very small projects or one-shot websites, meaning you don’t plan on updating often. Then, a preprocessor isn’t that useful.

## Quality code

Let’s make things clear right now: **preprocessors don’t output bad code, bad developers do**. CSS preprocessors -whatever the one you (don’t) use- do not generate top-heavy, unwiedly, unnecessarily complicated code. This is a lie bad developers will tell you to explain the quality of their code.

> Preprocessors don’t output bad code, bad developers do.

If the final stylesheet is less maintainable or heavier, or more complicated than the vanilla CSS version you had before using a preprocessor, [it’s because you messed up](https://pastebin.com/Jy9PqFTy). Not because of Sass.

Vincent does an interesting comparison with PHP (HyperText Preprocessor): you can output shitty code with PHP too. Is it because of PHP? Definitely not. It’s because you’ve messed up.

## Speed

Some people say preprocessors don’t make you write CSS faster. Indeed, you won’t become Iron Man as soon as you run Sass, definitely not. Even if in the end, you write code slightly faster; simply by the fact you don’t have to write vendor prefixes for example.

You don’t save much time while coding. You save time when it comes to maintain and update your stylesheets. It’s a no brainer. This also means if you don’t plan on updating your site, then there is less point in using a preprocessor. This makes me come to the next argument.

## Maintainability

I think the key word here is **maintainability**. You will never ever reach the same level of maintainability without a CSS preprocessor. Ever.

> I think the key word here is maintainability.

However, you might not need that level of maintainability. As [Kaelig](https://twitter.com/kaelig) says in his article [CSS preprocessors: renounce by choice or ignorance?](https://blog.kaelig.fr/post/24877648508/preprocesseurs-css-renoncer-par-choix-ou-par) (_Préprocesseurs CSS, renoncer par choix ou par ignorance?_): if you work on small projects or one-shot websites, you may not need a preprocessor. Let’s be realistic for a minute: you won’t update the site everyday, if at all. If you ever happen to do so, you can dig into the code without having to use of a preprocessor.

## Give CSS what CSS needs

Vincent says preprocessors don’t add anything to the default language. In a sense, yes. Sass isn’t magic. CoffeeScript isn’t magic. Markdown isn’t magic. In the end, they render CSS, JS and HTML.

But CSS preprocessors give CSS what CSS lacks of. CSS lacks of variables, above all. CSS possibly lacks of simple nesting for pseudo-classes. CSS might lack of functions and mixins. Preprocessors give developers all this stuff. **Without altering performances**.

> CSS lacks of variables, above all.

**Yes, we can do sites without these features.** It’s just nice to have them. Saying otherwise would be a big fat lie. But of course we can still make sites without preprocessors.

In fact, **I don’t need a preprocessor**. I say it: I don’t. I’m not working on 10000-lines stylesheets. I’m not working on multiple templates websites. I’m not working on complex CSS architectures. I could do every single project I do without Sass.

But **Sass looks better than CSS to me** (at least in most cases). I like being able to use variables. I like being able to use mixins and functions. I like being able to use Compass. I like all of this stuff, even if I don’t necessarily need it. It feels more normal to me.

_Sass also gives multiple stylesheets concatenation and file minification (among others), which is kind out of the CSS range but still awesome features nevertheless._

## Learning curve

> Preprocessors make CSS more complex. […] I said more "complex" not more "complicated". You can think preprocessor’s syntax is simple, it is still more complex than the default one.

Vincent is definitely right on this one. Preprocessors sometimes make the syntax more complex by adding new features; not necessarily more complicated, simply more complex (no pun intended).

One of the biggest concerns when talking about CSS preprocessors (and preprocessors in general) is the learning curve. Most try to stay as close as possible to the default syntax but they involve new features with their own syntax, which need to be learnt. Yes, **it needs some time to wrap one’s head around a preprocessor**, especially if it involves a very different syntax from the original language (Sass, CoffeeScript).

If you happen to be a beginner or work with inexperienced developers, you probably shouldn’t use preprocessors. Someone who’s not very comfortable with a language could do [pretty bad things](https://pastebin.com/Jy9PqFTy) with a preprocessor. Adapt your tools to your team.

## Final words

In the end, most arguments against preprocessors are bullshit. All those things about not speeding up the development, outputing bad code, it’s irrelevant. Most people telling you this are the one who have not even tried to use a preprocessor for real.

The only thing to ask is: **can I afford one?** If you think you or one of your co-workers won’t be able to handle everything correctly, then the answer is _no_. Otherwise just please yourself and go ahead. :)
