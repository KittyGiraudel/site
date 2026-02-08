---
title: How I learnt to like Bootstrap
description: A retrospective on the Bootstrap framework, and when it comes in handy
keywords:
  - css
  - bootstrap
edits:
  - date: 2020/12/9
    md: This article is yee old. I wouldn’t use Bootstrap outside of a quick prototyping phase anymore. I’d spend more time customising it than writing things from scratch so it’s just not worth it — especially since it’s quite heavy. Definitely would skip Bootstrap entirely today.
---

A couple of days ago, I saw a [fellow French developer say how much he hates (Twitter) Bootstrap](https://twitter.com/Gandoulfe/status/392640481634422785) for websites on Twitter. And I saw a couple of fellow French developers agree with him.

![Twitter Bootstrap 3](/assets/images/how-i-learnt-to-like-bootstrap/bootstrap.jpg)

This reminded me that no so long ago, I was a fervent defender of the tell _"Bootstrap is good for prototypes and back offices or stuff like this"_.

Until a recent project where I finally learnt to like Bootstrap, even for websites. But let’s back up a little bit!

## How did we get there

I recently got hired for quite a big project as the only frontend developer in a team of a dozen of developers. The design itself is fairly complex since it involves various layouts, multiple themes, a lot of forms and a bunch of pages. Thankfully, [Symfony 2](https://symfony.com/) and its template engine [Twig](https://twig.symfony.com/) make it a lot easier to manage but that’s not the point.

So when I started working on this project, the project manager basically told me I would be the only one to deal with the front end which sounded great to me because other developers were mostly backend devs.

> Kitty, we’ll use Bootstrap.  
> — NOOOOOO!

And then he told me what I didn’t want to hear: _"we will use Twitter Bootstrap"_ and I was like _"NOOOO!!"_.

But then he said something even worse: _"Bootstrap 2.3"_ and then I was like _"NOOOOOOOO!!"_ (note the number of _O_ is increasing).

Since Bootstrap 3 was still in RC back then, it wasn’t possible for us to use it. Thankfully a couple of days later, it got officially released so we jumped onto it and moved the little frontend we had already done to v3.

## The beginning

At first, it was a pain in the ass for me to work with Bootstrap. Mostly because I haven’t ever used it before. Especially the grid system which didn’t feel intuitive to me: `.container`, `.row`, `.col-md-*`? What is this?

But also because I thought my CSS skills were good enough so I don’t have to use some framework. And in a way, I was right: I don’t need a CSS framework to make a website. Now, even if I don’t need it doesn’t mean I shouldn’t use it at all.

It’s been a couple of weeks now we are working on this project and picking Bootstrap has to be one of the wisest moves we have taken so far.

## Coding fast

This is the main reason that makes me like Bootstrap on this project: I can code really fast. Making a component displaying a row of product with their image, title and description takes me no more than a couple of minutes thanks to Bootstrap’s powerful grid system and its collection of components.

Also it provides a lot of helper classes like `.pull-left`, `.clearfix` and a good starter for responsiveness.

## Less dependencies

This heading can be confusing: I am not talking about _LESS_, the CSS preprocessor. I mean that using Bootstrap really reduces the number of dependencies used across a project.

Carousel? Check. No need of _FancyJqueryAnythingCarouselSlider.js_. Icon fonts? Check. No need of _FontAwesome_. Modal? Check. Dropdowns? Tabs? Tooltips? Check, check, check. It may sounds trivial, but not having thousands of dependencies is really important to keep things maintainable.

Of course we still have other dependencies than Bootstrap like _jQuery UI_ (which could deserve a similar article I guess), _underscore.js_ and quite a couple of other things but I can’t imagine the number of external dependencies we would have right now if we were not using Bootstrap.

## So where did it start?

I believe this whole _"Bootstrap is evil"_ thing started shortly after Twitter Bootstrap 2.x came out. Many people started creating websites with nothing more than the default collection of composents without even trying to customize them or to find a special scheme.

At this point, every sites looked alike and it was kind of annoying for sure. But I feel like this time is over and now most Bootstrap powered sites are using it wisely, adding their own custom design on top of Bootstrap components. That’s what Bootstrap is: a backbone for the site.

## Final words

In the end, I think I’ve changed my mind on Bootstrap and I really start to understand what it’s for. On big websites, having a skeleton to work on is important. It’s like managing a huge JavaScript structure without a library (could it be jQuery, MooTools, whatever).

Long story short: Bootstrap is not that bad. Just don’t use it raw. Cook it your way first.
