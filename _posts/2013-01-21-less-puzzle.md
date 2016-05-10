---
disqus: http://hugogiraudel.com/blog/less-puzzle
layout: post
title: "A little LESS puzzle"
tags:
  - css
  - less
  - riddle
---

Hi guys! What do you think of a little puzzle to wake up your neurons? I think I've found something tricky enough to worth a blog post and a little challenge about it.

First of all, this will be a LESS puzzle, so if you're really unfamiliar with this CSS preprocessor, I think you might feel a bit lost here. Sorry! :(

## What are the requirements

So the main idea is to enable a Google Web Font using a variable to have only one occurrence of the font name without leaving the stylesheet. Let me explain the requirements a little better:

1. Pick a Google font [here](http://www.google.com/webfonts),
1. Click on "Quick use", then "@import", and copy the given URL to your clipboard,
1. Open [CodePen](http://codepen.io), click on "New pen" and pick LESS as a CSS preprocessor,
1. Create a variable for the font name, like this `@my-font: "NameOfMyFont";`,
1. Import the font from Google CDN with `@import url()` using the variable as the font name in the URL,
1. Give any element (`<h1>` would be good) this font.

**Bonus:** make it work with compound font names (such as "Roboto Condensed").

Accustomed to Sass like me will wonder where is the difficulty in this little exercise. Problem is LESS is extremely annoying when it comes to both url() and string concatenation. I partially covered the topic in <a href="http://hugogiraudel.com/2012/11/13/less-to-sass/">this article</a>.

```scss
/* Sass version */

$my-font: 'Merriweather';
$url: 'http://fonts.googleapis.com/css?family=#{$my-font}';

@import url($url);

h1 { font-family: $my-font; }
```

I struggled about one hour on this and couldn't make it work. All my respect to the one who will find the solution.

Good luck!

## Conclusion (edit January 26th, 2013)

Loïc Giraudel (secondarily my dear brother) pointed out [a thread on GitHub](https://github.com/cloudhead/less.js/issues/410) mentioning that what I called a "puzzle" is in fact a real bug reported more than a year ago.

However as of today, **there is no fix for this neither is there a workaround**. So unless anyone comes up with a solution, this is currently not possible unfortunately.

Plus, the guys behind LESS imply fixing this bug would require a large amount of work and deep code restructuration.

No luck.
