---
title: “CSS is easy”
keywords:
  - css
  - frontend
  - backend
---

I am studying what comes close to “Programming Sciences“. My mates are hardware, server or backend people. When I tell them I prefer frontend, especially HTML/CSS I always get the same reaction “CSS is easy”.

And I always tell myself the same thing “Yeaaaaah… so that should explain why your CSS is a fucking mess”.

## CSS is easy… syntactically

Yes. CSS has a very easy syntax based on english words. I don’t think it could be much simpler since it can be summed up in 3 words: **selector, property, value**.

A 8-year-old child could do some CSS without even having any explanation on how to do so. Even HTML has a more complicated syntax than CSS since there are some elements which need a closing tag, some don’t, some have attributes, some don’t, some can’t be inside others and so on. CSS is always the same.

```css
selector [, selector2, …] [:pseudo-class] {
 property: value;
 [property2: value2;
 …]
}
```

Most of all, CSS means something. It uses real words, understandable by anyone. When you read `.element { color: red; }`, you can be pretty sure it means an item called “element” is red. It’s a no brainer.

## A constantly evolving language

The first “problem” (for lack of a better word) with CSS is that it is a constantly evolving language. It was first introduced in 1994 if no mistake; so almost 20 years ago. After 3 major versions (CSS1, CSS2 and CSS2.1), CSS is now divided into modules growing at their own speed (Colors Level 3, Selectors Level 4, etc.). It means you cannot simply “learn CSS” then don’t get back to it. You can learn the bases, yes but it’s not enough.

Some things I learnt 2 years ago are irrelevant now, and some things I’m learning today might disappear or become bad practices in the future. It is a non-stop evolution &mdash; which is cool but &mdash; which requires developers to be very careful.

## Browser dependant

The thing is, since CSS is a language compiled on the client side (meaning by the browser itself), its interpretation depends on the compiler (once again, the browser).

Yes, HTML and JavaScript as well. But unless you’re using new HTML5 elements (which don’t provide much more than semantic), your HTML &mdash; as long as it is valid &mdash; won’t differ from one browser to another.

JavaScript is kind of like CSS. The interpretation depends on the JavaScript engine version. For example, Internet Explorer 9 doesn’t use the same [ECMAScript engine](https://en.wikipedia.org/wiki/List_of_ECMAScript_engines) as Firefox or Chrome (Chakra for IE9, SpiderMonkey for Firefox, V8 for Chrome).

Anyway, in order to write consistent CSS, you have to know which browser supports which feature, or partially support them, and how to draw fallback, when to use hacks, and so on. It requires some knowledge, and most of all, some experience.

Take the Flexbox module for example. It has been introduced in 2009 and has known 3 different syntaxes since then resulting in a blurry mess when trying to have the best browser support:

```css
.flex {
  -ms-box-orient: horizontal;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: flex;
}
```

This is the kind of thing that makes CSS tricky (some people would say annoying).

## Final words

> A simple syntax doesn’t make an easy language.

CSS isn’t easy. Combining a very permissive (somewhat broken) syntax with constantly evolving features and rendering inconsistencies makes CSS not that easy at all. Yes, the syntax is simple, but a simple syntax doesn’t make an easy language.

And when you have to deal with performance, modular architecture, and responsive webdesign, it becomes even less easy. But that’s a whole 'nother story.
