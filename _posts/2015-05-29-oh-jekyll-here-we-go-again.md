---
title: 'Oh Jekyll, here we go again…'
tags:
  - jekyll
  - mixture
  - blog
---

I [created this site](https://hugogiraudel.com/2012/11/09/redesign-blog/) in November 2012, with a strictly static old school set up. I quickly moved on to a custom PHP workflow only to move to [Jekyll](https://jekyllrb.com) about 3 months later (February 2013). I wrote about the experience in [this article](https://hugogiraudel.com/2013/02/21/jekyll/).

![Mixture.io](/assets/images/oh-jekyll-here-we-go-again/mixture.png)

Over a year later (June 2014), I decided to give Mixture a go. Mixture is a static site generator as well, but it is packaged as an application with a nice interface and a couple of extra features that Jekyll does not have. The kind folks at Mixture offered me to write about the transition on their blog.

And here we are, almost a year later again, back to Jekyll, one more time. I thought it would wait for Jekyll 3 to be released but it did not. To be perfectly honest with you, I don’t see it changing anytime soon (but I might be wrong, I seem to be quite undecided regarding this).

<figure class="figure">
<img src="https://fc03.deviantart.net/fs70/f/2013/085/6/b/one_more_time_a_tribute_to_daft_punk_rainmeter_by_crazyxb-d5zbgb5.png" alt="" />
<figcaption>Wallpaper by <a href="https://www.deviantart.com/crazyxb" target="_blank" rel="noopener noreferrer">crazyxb</a> DeviantArt user</figcaption>
</figure>

## What was wrong?

Let me get something straight before going any further: Mixture is a terrific tool. Moreover, [Neil Kinnish](https://twitter.com/neiltak) and [Pete Nelson](https://twitter.com/petetak) are great people who provide one of the best support I’ve ever seen. So Mixture definitely is an interesting piece of software.

Okay, now what did I dislike with it? I think the most annoying thing for me was to push the compiled sources to the repository instead of the actual development sources. While this seems irrelevant it actually prevented me from quickly fixing a typo directly from the GitHub interface.

Fixing anything required me to have the Mixture application installed (which is less of a problem now that I don’t work on Linux anymore), the repository cloned and up-to-date, then to make the change, compiled the sources and finally push it back to the repository. Tedious at best, highly annoying at worst.

> The most annoying thing for was to push the compiled sources to the repository.

Along the same lines, it was literally impossible for anybody to contribute in any way unless they happen to be Mixture subscribers. I will concede that it is not like hundreds of people would contribute to this blog, still some people do submit pull requests to fix typos. Also, as I often offer guest posts to people, I’d like them to be able to submit their work through a pull request as well.

So being able to push uncompiled sources to the GitHub repository and let [GitHub Pages](https://pages.github.com/) do all the compilation and deployment work for me was actually the major factor for me to leave Mixture behind and go back to Jekyll.

## How hard was it to switch back?

Since it was a going back and not actually a completely new migration, it ended up being extremely easy. Not only both generators rely on Liquid, but they also pretty much work the same. Only Jekyll relies on a specific naming convention for posts which I stuck to during this year using Mixture. So moving back took me something like 10 minutes I’d say.

The 4 next hours were spent redesigning the site (which I suck at).

## Final thoughts

Anyway, that’s done now. And I am glad to be back. Also I can’t wait for Jekyll 3. I can now update small things directly from [GitHub](https://github.com/HugoGiraudel/hugogiraudel.github.com/) without having to worry about the computer I’m using. And you can now fix my many typos by submitting nice pull requests! :D

Also, if you have any recommendation for the design part, please feel free to suggest. I’m not quite convinced with the current design so I’d be glad to have some feedback.&nbsp;:)

_PS: all Sass stylesheets from this site are heavily documented so feel free to [have a look](https://github.com/HugoGiraudel/hugogiraudel.github.com/tree/master/_sass)._
