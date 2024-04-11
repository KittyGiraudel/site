---
title: A CSS challenge
keywords:
  - css
  - riddle
---

Yesterday night, I’ve seen something in my Twitter timeline which excited my curiosity: a CSS challenge. It was proposed by [Raphael Goetter](https://twitter.com/goetter), a famous French frontend developer on his blog.

Since I’m sure you’ll be interested in a little CSS riddle (you will, will you?), let me tell you what this is about.

![Some text content sitting on top of a horizontal line, and masking said line behind the letters](https://i.imgur.com/fZkkw.jpg)

Will you be able to do this (I’m talking about the small line behind the text) following the restrictions below?

- Only one single element (`h1`) in the body element
- Element horizontally centered in its parent
- The line is vertically centered on the text
- Both the font size and the text have to be editable without having to edit the line
- Body and/or the element can have a background (image) without changing anything else
- No HTTP request, no image, no JavaScript
- The best browser support the better of course

I can’t wait to see the way you’ll figure this out people. I personally found something with a few downsides sadly. I’m sure some of you will be able to find a kick-ass solution. ;)

Good luck!

## [Edit] Solutions (November 24th, 2012)

Thanks for participating! There have been a couple of answers for this trick. Druid of Lûhn proposed [something](https://codepen.io/Druid-of-Luhn/details/sclvk) which works but sadly it’s pretty awful for SEO since it involves an empty `h1` tag.

Joshua Hibbert [used linear gradients](https://jsfiddle.net/joshnh/3PG8j/) to do it (so [did](https://codepen.io/raphaelgoetter/pen/dGxvL) Raphael Goetter). This is a clever technique I thought about but didn’t give a try. My experience with gradients is not that good.

Here is the way I [did it](https://jsfiddle.net/KittyGiraudel/cyeGM/1/):

```css
body {
  text-align: center;
  overflow: hidden;
  background: #ffa;
}

h1 {
  display: -moz-inline-box;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  position: relative;
  font-size: 30px;
  margin-top: 20px;
}

h1:after,
h1:before {
  content: '';
  position: absolute;
  height: 1px;
  width: 1000px;
  top: 50%;
  right: 100%;
  background: black;
}

h1:after {
  left: 100%;
}
```

So basically, I used both pseudo-elements to create the line. To place them, I set the title to inline-block, and the parent (`body`) text-align to center.

Sadly, a few things suck with this technique, even if it works pretty well:

- Parent needs to have `text-align: center`
- Parent needs to have `overflow: auto`
- It requires 2 pseudo-elements
- Pseudo-elements need to have a large width to reach the edge of the screen (~1000px to cover about all screen sizes)

Hopefully the browser support is pretty good, at least way better than the gradient version:

- IE8+
- Firefox 2+
- Chrome
- Safari 3+
- Opera 9+
- iOS Safari 3+
- Opera Mini 5+
- Android Browser 2+
- Blackberry browser 7+
- Opera Mobile 10+
- Chrome for Android
- Firefox for Android

But since it’s only a tiny design improvement, I’ll definitely go with the gradient version on a live project. Thanks for participating. I’ll try to drop another challenge soon. :)
