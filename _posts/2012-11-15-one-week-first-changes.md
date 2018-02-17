---
title: "One week, first changes"
tags:
  - blog
  - writing
---

## Design

After the launch, it occured to me the design was a bit gloomy so I wanted to add a color to cheer things up. After a dark blue and a creepy green, I ended with the hot pink and a quick survey on Twitter encouraged me to keep it. So pink it is! Hope you like it.

Speaking of survey, another quick one about text align told me to switch to left. It looks like people dislike when text is justified on blogs. I liked it but I'm not the main reader of this blog. :D

## Development

I was playing with [Sass](http://sass-lang.com/) during the last couple of days and decided it could be cool to build the blog on it, so now it is. Since the site is pretty small, it's no big deal. Actually I used only very few of the potential of Sass (or whatever other CSS preprocessor):

* Variables
* Nested styles
* A few mixins
* Concatenation and minification of the stylesheets

Anyway, it's cool.

## Features

### Prism as a syntax highlighter

You may have also noticed I've included [Prism.js](http://prismjs.com/) from Lea Verou on the blog as a syntax highlighter for code snippets. I'm pretty happy with it, I think it makes the code easier to read.

Only issue I see right now with Prism.js is it has some issues with processed CSS syntax such as LESS and Sass, but it's no big deal.

### Disqus as a comment system

To satisfy a few requests, I agreed on setting up a comment system to allow you to say stuff. Since I decided I won't do any PHP on the site, I had only a few if not one option. Hopefully [Disqus](http://disqus.com/) is widely spread all around the world now and honestly I would have never done such a wonder so I'm pretty excited about it.

Depending on how things go I'll have a closer look into options but for now it's far better than anything I would have ever hope for so I'm very happy with it. Then please drop a comment if you have anything to tell. ;)

### Codrops articles notifications

You may or may not have noticed yet but from now on, my articles on Codrops will be featured on the index of the blog. To distinguish them from other articles, they are annotated with [Codrops]. What do you think? Good idea? Bad idea?

## To do

I've already made a bunch of tiny bug fixes like broken links, inadequate margins, little issues on mobile but some bugs may persist so if you still find one, please tell me: I'll fix it as soon as possible.

If you have any suggestion to how we could make this place better, please feel free to speak. By the way I'd like to thanks all of you giving feedbacks and helping me improve this place. It means a lot, keep up! :)
