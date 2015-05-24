---
layout: post
title: "The Magic Circle: a CSS brain teaser"
---

> If you want the solution, be sure to read [this post](http://hugogiraudel.com/2014/02/26/the-magic-circle-trick-revealed/).

Months back at work, I have been asked to code a piece of design for the home page of our site that ended up being quite tricky. You know [I like riddles](http://hugogiraudel.com/2014/02/06/calc-css-riddle/), right? Feelink tricksy my precious? Want to play a game?

## What we want?! 

First of all, this is what you should come up with:

<figure class="figure">
<img src="/images/the-magic-circle-a-css-brain-teaser__result.jpg" alt="">
<figcaption>Beautiful, isn't it?</figcaption>
</figure>

Obviously the difficult part is the transparent circle in the middle of the picture, not adding border-radius to the boxes. Anyway, as you can see we got 4 boxes (2 per row), each with its own color scheme because it's prettier. On the middle of the frame, the four boxes are kind of cropped to make place to some kind of invisible circle. And in this circle there is a dark disk.

*Note: this is not an image I made on Photoshop or whatever, this is the result I ended up with.*

## Rules 

There are no games without rules, so let me give you some constraints for the exercise, alright?

* As you can see, the circle must be transparent to allow the use of a background image,
* the space between left blocks and right blocks, and the space between top blocks and bottom blocks should be the same,
* boxes should be able to contain text; if you come up with a solution that makes this impossible, it's not enough,
* the DOM should look like this: `ul > li > section > header + footer` (I came up with a solution to ditch the `section` element but it removes IE 8 support, see below),
* no JavaScript, no images.

Feel free to add as many classes and attributes as needed, and to use a CSS preprocessor if you feel more comfortable with it. I have no problem with this whatsoever.

Regarding browser support, I came up with a solution working from Internet Explorer 9 gracefully degrading on Internet Explorer 8. As far as I know, you simply can't do this on IE 8 without images (or SVG or whatever).

## Game on! 
y much it. In a week or so, I'll update the post with my solution and I'll talk about the more creative and effective proposals you gave me. Surprise me guys, and be sure to have fun doing it. It's a tricky CSS brain-teaser, I'm sure you're going to love it. ;)

To help you start, I created [a very basic CodePen](http://codepen.io/HugoGiraudel/pen/cffeb2facdf797f46617e9615105f38d) you can fork and link to in the comments.

Game on!
