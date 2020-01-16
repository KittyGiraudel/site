---
title: "Rethinking Atwood’s law"
tags:
  - thoughts
  - atwood's law
  - sass
---

A couple years ago, the 17th of July 2007 to be exact, [Jeff Atwood](https://twitter.com/codinghorror), founder and builder of StackOverflow and StackExchange [wrote](https://blog.codinghorror.com/the-principle-of-least-power/) about the [principle of least power](https://www.w3.org/DesignIssues/Principles.html) and said:

> [A]ny application that can be written in JavaScript, will eventually be written in JavaScript.

Not only is this quote famous by now, but it also turned to be quite true. JavaScript grew from this weird little nerd to the cool kid we all know it is today. What Jeff didn't know back then perhaps, is how his law can apply to other things as well.

That's why today, I hope he won't mind if I expand his thought to declare the revisited Atwood's law (calling it Atwood-Giraudel would be quite presomptuous):

> [A]ny application that can be written in Sass, will eventually be written in Sass.

And given my obsession for Sass, I'll go even further and add this extra part to the quote, even if it won't ever be retained:

> ... and chances are high that it will be done by me.

_Disclaimer: as for the original law from Jeff Atwood, it is obvious that Sass (or JavaScript) is not always the best choice: more often than not, things should be done in a different way, but the fact that we **can** usually makes use **do** it nevertheless._

## Nonsense you say!

Sass is 7 years old if no mistake, and has come a long since its early days. In 7 years, and especially because of silly people like me loving doing crazy shits, a lot of stuff has been made in Sass already. Let's see:

* [a JSON parser](https://hugogiraudel.com/2014/01/20/json-in-sass/);
* [bitwise operators](https://hugogiraudel.com/2014/06/22/bitwise-operators-in-sass/);
* [sorting algorithms](https://hugogiraudel.com/2014/03/18/sassy-sort/);
* [functional programming](https://sassmeister.com/gist/c36be3440dc2b5ae9ba2);
* [Levenshtein distance implementation](https://sassmeister.com/gist/8334461);
* [inverse trigonometric functions](http://thesassway.com/advanced/inverse-trigonometric-functions-with-sass) by Ana Tudor...

And there are countless more examples I'm probably not even aware of.

## How did we get there?

> Challenge is fun.

I think the main reason is it's challenging. Because Sass is a very limited language, doing advanced things can turn out to be quite challenging. And as we all know, challenge is fun.

Aside from being fun to write, it actually helps a lot understanding the language. I would not be that skilled with Sass if I had stopped after declaring a couple of variables and functions. You don't get good by doing what everybody does. You get good by pushing the limits.

I think I could not stress this enough: try things folks. Do silly stuff. The only rule is to remember what is an experiment and what belongs to production code. Don't use experimental/crazy code in a live code base. It doesn't smell good.

## Final thoughts

Any application that can be written in Sass, will eventually be written in Sass. And we are already close to the end.
