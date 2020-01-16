---
title: Markdown as a design
tags:
  - markdown
  - redesign
  - css
---

A short post to talk about the recent redesign of this site.

I’ve never been quite happy with the design of this blog. Let’s face it: I am no designer, and coming up with a fancy layout is not really my strong suit.

So I was thinking… hey, why not trying something _different_ for once?

Markdown is one of my favourite things in this industry. I use it so much. For articles. For books. For sites. For mails. For personal content. It is such an amazing text format, both simple and obvious.

Last year, I have written about [how I use Sublime Text as a writing environment](https://hugogiraudel.com/2015/05/18/writing-in-sublime-text/). And now, I wanted to move my Sublime Text design in the browser. Here we are.

## What the hell is this?

This site runs on Jekyll. Almost everything that is not structural (such as the sidebar, the footer, etc.) is written in Markdown. Jekyll compiles everything to static HTML. Then I use CSS to style HTML as raw Markdown.

This is not a new concept. A couple of libraries style HTML like Markdown, such as [ReMarkdown](https://fvsch.com/remarkdown/) or [Markdown.css](http://mrcoles.com/demo/markdown-css/), and I myself made [a pretty detailed CodePen](https://codepen.io/HugoGiraudel/pen/JmonG) about this last year.

It is surprisingly easy to do. Basically, pseudo-elements are used to display characters at specific location, such as `#` before headings, or `**` around `<strong>` elements.

```css
strong::before,
strong::after {
  content: '**';
}
```

A monospace typeface (here “Source Code Pro”) is required to make the whole thing look even better, and a special care must be given to spacing and line height in order to align everything on a grid.

## The hard parts

While most of the design is surprisingly easy to implement, there are a few things that turned out to be slightly more tricky. Here they are, and how I solved them.

### Long URLs in links

To make it look like Markdown, the `href` attribute of a link is being displayed with a pseudo-element, like this:

```css
a::before {
  content: '[';
}

a::after {
  content: '](' attr(href) ')';
}
```

The problem is that some URLs are very long. Veeeery long. Sometimes, it resulted in odd and quite confusing line breaks. I managed to solve it (or rather make it less painful) by forcing line breaks at end of line anywhere in a URL, thanks to `word-break: break-all`.

```css
a::after {
  content: '](' attr(href) ')';
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
}
```

This declaration is usually to avoid because it does not respect language-specific line breaking rules and arbitrarily breaks a word when reaching the end of a line. In this scenario though, it is exactly what we want, and does not cause any readability issue because it’s limited to the link pseudo-element only.

### Line numbers

When I launched the redesign, there was no line numbers, and I could not help thinking it really was missing. I was not sure how to implement it best and I must say my current solution is quite fragile.

Right now, the main container has an absolutely positioned pseudo-element displaying numbers through the `content` property. Line breaks between numbers are made with `\A` and the `white-space` property. It looks like this (shortened for sanity):

```css
.main {
  overflow: hidden;
}

.main::before {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  white-space: pre;
  text-align: right;
  padding: 0 0.5em;
  content: '1\A 2\A 3\A 4\A 5\A 6\A 7\A 8\A 9\A 10\A 11\A 12…';
}
```

Numbers go up to about 700, a magic number that I estimated would cover all of my pages in a matter of length, even the very long ones. I can see 3 problems with this approach though:

- If I ever write a super-duper long article, numbers might cease before the end of the page.
- The `content` property itself is so long that it weights 4.31Kb, which is almost a third of the stylesheet.
- The page does not necessarily (and most likely does not) have a round height, resulting in a line number being half displayed.

I tried playing with CSS counters but I could not come up with something working as nicely. If someone has a solution to make this more elegant, please tell! My bet is that we can probably remove the `\A` from the `content` property by relying on natural line breaking. That would shorten the whole thing a hell lot already.

### Aligning images on a grid

I don’t over-use images on this blog, but a few articles use some. The problem with images is that I don’t control their height. Which means they kind of break the line-based flow.

I managed to solve this with a little bit of JavaScript, to scale down an image just enough to fit on a rounded amount of lines, but that’s not super nice. Unfortunately, I am not sure there is a good solution for this.

## What’s next

I don’t know yet if I am going to keep this design for a long time, but right now I am super happy with it. It looks very different to what I used to have, or to any other blog on the internet, for that matters. And [reactions on Twitter](https://twitter.com/HugoGiraudel/status/736181867653779456) were surprisingly very positive, so thank you for the support y’all!

If you can think of anything to improve the design, or to make it look even more like Sublime Text while still providing value, please tell me! In the mean time, happy coding. :)
