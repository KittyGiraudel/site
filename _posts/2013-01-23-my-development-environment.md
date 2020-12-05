---
title: My development environment
keywords:
  - thoughts
---

> **Edit (2014/11/16):** I don’t use Windows anymore. I moved to macOS and Ubuntu. Also I don’t use Canary/Aurora anymore, I switched back to regular versions. I updated Sublime Text to v3. And I suck much less at Git.

<!-- -->

> **Edit (2014/05/13):** things have changed again. I don’t use a FTP client anymore, and I have ditched Compass from nearly all my projects.

<!-- -->

> **Edit (2013/02/21):** this post might contain outdated informations since I [moved my site to Jekyll and GitHub Pages](/2013/02/21/moving-to-jekyll/).

Hey people! I recently blogged about the tools I use for frontend development, but someone pointed out on Twitter I didn’t tell anything about my development environment. Let’s fix my mistake and talk about it!

Well, first of all, it is kind of complicated because I work at 3 different places, which means I have 3 different development environments (5 actually, I have 3 computers at home). There is -well- home, but I also happen to do some stuff at school or at work when I have some time, mostly during the lunch break.

Anyway, I will try to describe what I use to work.

## Operating system

Let’s start with the easy thing: the operating system. First, **I use both Mac and Windows**. At home, I mostly use my girlfriend’s laptop which is a 4-year old Mac. I also have 2 computers I use(d) for gaming which runs Windows 7 and Windows Vista.

At work, I am on Windows XP. Yeah, that’s not cool, I know. But the whole infrastructure is based on Windows XP, so even developers work stations are using XP. Anyway, I can live with it.

At school we’re on Windows 7. The computers there are pretty cool I must say.

I didn’t try Linux yet but I think I might come to it sooner or later. I like challenge.

## Browser

Ah, browsers. Our main tools. For the record, not so long ago I swear only by Firefox. But when I started doing a lot of stuff on the web at the same time (running many tabs with somewhat heavy content like videos, WebGL, CSS animations, etc.), it occurred to me Firefox was suffering from a bad memory management. Which wasn’t the case of Chrome.

So I switched to Chrome and never looked back. I even pushed it one step further, using [Chrome Canary](https://www.google.com/intl/en/chrome/browser/canary.html). This in order to access to a few things Chrome doesn’t support (or didn’t support at the time I switched to Canary) like CSS shaders, exclusions, regions and so on.

> I don’t dislike Firefox -it’s a wonderful browser- but I clearly prefer Chrome.

At work for something which looks like SSL issue, I am also running [Firefox Aurora](https://www.mozilla.org/fr/firefox/channel/) which is the future version of Firefox, like Canary for Chrome. I don’t dislike Firefox -it’s a wonderful browser- but I clearly prefer Chrome.

I also have Opera and Safari on some computers to make unusual tests. Since I am not a freelance web designer living from the sites I make, I’m not using any browser testing tool like [BrowserStack](https://www.browserstack.com/). I would really love a BrowserStack license, but I can’t (or don’t want to) afford a $20/month subscription.

## IDE

I used to be a huge fan of Notepad++, even if everybody was using Dreamweaver. Honestly I never liked DW; it is super heavy while doing not much than a regular text editor.

Now I am standing on [Sublime Text 2](http://www.sublimetext.com/2) on all my computers, with no intention to change soon. The thing Sublime Text 2 provides that Notepad++ doesn’t is the ability to open a whole folder in order to have access to any file of your project in the arborescence. This is really cool. Plus Sublime Text 2 looks better in my opinion. :)

That being said, I’m carefully looking into [Brackets](http://brackets.io/) from Adobe which is a web-based IDE looking pretty cool.

## FTP

Call me old fashioned, I do still use a FTP client. Yes, I know it’s not 2000' anymore but I don’t know how to use FTP from the command line, so I am stuck with a [FileZilla](https://filezilla-project.org/). It is actually pretty cool and very easy to use.

However I would like to move forward, thus I am currently learning how to do some FTP stuff through the command line but I’m still not very good at it so for now I keep using my beloved FileZilla.

## Design

Well, I am a huge fan of this **design in the browser** thing, plus I am very sucky when it comes to any designing tool. I mean you, Photoshop. So really, I hardly use Photoshop, unless I am forced to.

However I have the good luck to have an Adobe Creative Suite on most of my development workflows. Work provides official liences, we have student licences at school and I have a student licence at home as well.

You may find this silly but 9 out of 10 times, I use Photoshop to resize and save a screenshot I just took. Yeah… A $3000 software to make screenshots is a bit expensive I guess.

## Other tools

I didn’t know how to call this section because it gathers various tools doing various things I use at various occasions. I hope it’s clear enough. :P

### Sass and Compass

Not so long ago I gave a try to CSS preprocessors, because I am both curious and a CSS lover. It turned out I like CSS preprocessors, they give a lot more options than regular CSS.

Anyway, I am using [Sass](https://sass-lang.com/) and [Compass](https://compass-style.org/) on most of my projects now. As an example, this site is built on Sass.

I am running Sass through the command line. Yes, it’s scary. But actually it is really not that hard. I would like to have some sort of application taking care of everything for me like [CodeKit](https://codekitapp.com/), unfortunately I am not always on Mac OS plus CodeKit is not free ($25). If I was always using the same development environment, I would definitely buy CodeKit but sadly I am not.

I know there are CodeKit equivalents for Windows. Most people will tell you about [Scout](https://mhs.github.io/scout-app/). I tried it yesterday (as I told you I am curious). Guess what: it turns out Scout was messing with my stylesheets, introducing errors in those. My opinion about it? It sucks. Back to command line.

### Git

Yaaaaay! Git, my dear friend! Friends, **I suck at Git**. I understand the main idea, I even know how to do some very basic stuff but every single time I need to do something it takes me about 20 minutes, I have to try every command I know (which is about 6 or 7), fail, get upset, read the doc, don’t understand anything either and finally ask my brother. Long story short, I don’t like Git… yet.

But I still have an [account at GitHub](https://github.com/HugoGiraudel) which only has 2 repositories as of today (good ones tho!). I hope I’ll push other things in the not so distand future.

### Local server

When I have to do some server side stuff, mostly PHP (sometimes MySQL), I use EasyPHP when I’m on a Windows machine or Mamp when I’m on Mac.

## Final words

Well I guess I have covered pretty much everything I thought about. If I missed anything, just tell me and I will edit the post.

What about you people? What’s your development environment?
