---
title: "Introducing Browserhacks"
layout: post
comments: true
---
<section>
<p>Hey guys! Just a quick post to anounce the very recent launch of <a href="http://browserhacks.com">Browserhacks</a>!</p>
<p class="explanation">Browserhacks is an extensive list of browser specific CSS (and somewhat JavaScript) hacks gathered from all over the interwebz.</p>
</section>
<section id="why">
## Why doing this? [#](#why)

There are two main reasons that lead us to create Browserhacks.

The first one is that we couldn't find a place where all (at least many) hacks were gathered (or it was way too old; Netscape 4 says hi!). The best spot at the moment is [this great blog post by Paul Irish](http://paulirish.com/2009/browser-specific-css-hacks/), but it's a) a blog post; b) there are a lot of interesting stuff in the hundred of comments nobody will ever read anymore.

Anyway, we thought it could be a good idea to get our hands a little dirty and merge [all](http://paulirish.com/2009/browser-specific-css-hacks/) [the](https://gist.github.com/983116) [cool](http://www.impressivewebs.com/ie10-css-hacks/) [sources](http://www.webcredible.co.uk/user-friendly-resources/css/hacks-browser-detection.shtml") we could find on the topic into a lovely tool.

The other reason is that we wanted to do something together for quite a while now and it was a very good opportunity to do it! So we did.
</section>
<section id="who">
## Who is "we"? [#](#why)

*We* is the short for a group of 6 persons gathered under the sweet name of [4ae9b8](http://4ae9b8.com). How cool is that name, right?! Anyway, we are:

* [Tim Pietrusky](https://twitter.com/timpietrusky)
* [Mads Cordes](https://twitter.com/mobilpadde)
* [Fabrice Weinberg](https://twitter.com/fweinb)
* [Ana Tudor](https://twitter.com/thebabydino)
* [Sara Soueidan](https://twitter.com/sarasoueidan)
* and of course [myself](https://twitter.com/hugogiraudel)

Even if in this project, Tim and I did most of the job. However everybody has participated by giving opinion, advices and making tests. :)
</section>
<section id="how">
## How to use it? [#](#how)

It couldn't be any simpler. If you ever happen to be stuck on a rendering bug in let's say... Internet Explorer 7 (only an example...), you could simply:

1. Come to [Browserhacks.com](http://browserhacks.com),
2. Search for "IE7",
3. Copy one of the proposed hacks,
4. Paste it in your stylesheet,
5. Keep CSS-ing worry-free!

<p class="note">If you don't feel like using this because you don't like CSS hacks (understandable), simply don't use it. However if you start trolling, God will kill many kittens.</p>
</section>
<section id="final-words">
## Final words [#](#final-words)

Browserhacks is built on a PHP/Backbone.js structure. The front-end stuff is built with [Tim's framework Crystallo](http://timpietrusky.github.com/crystallo/) and Sass.

The source code is available on [GitHub](https://github.com/4ae9b8/browserhacks). If you find a bug, want to make a suggestion or propose a hack, please open an issue in the [bug tracker](https://github.com/4ae9b8/browserhacks/issues?state=open). Many kudos to you!

Here is what we plan on for the next version:

* Put the hacks that matches in your browser first
* Improve the search by adding moar filterz (like a type filter)
* Improve the main site in Internet Explorer 8-
* Add moar hackz!

Hope you like it, happy hacking!
</section>