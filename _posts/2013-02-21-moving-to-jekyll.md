---
title: Moving to Jekyll
keywords:
  - blog
  - jekyll
  - writing
templateEngineOverride: md
---

If you wonder why you may have experienced some issues when trying to reach the site a couple of days ago, it is probably because I recently decided to move my website to Jekyll and to host it on GitHub Pages. Just like that.

As a reminder or for those of you who don’t know what Jekyll and GitHub Pages are:

[Jekyll](https://github.com/mojombo/jekyll) is a simple, blog aware, static site generator written on Ruby by [Tom Preston Werner](http://tom.preston-werner.com/), GitHub co-founder. It takes a template directory (representing the raw form of a website), runs it through Markdown and Liquid converters to spit out a complete static website.

[GitHub Pages](https://pages.github.com/) are public webpages freely hosted and easily published through GitHub.

## Why Jekyll and GitHub Pages

There are a couple of reasons that made me take the decision to move my perfectly-working site (or kind of) to Jekyll and GitHub Pages:

- **No server-side language nor database.** This is only good ol' HTML/CSS/JS. Frankly, I don’t want to have anything to do with a database unless I absolutely have to. This also means it’s worry-free: nothing to hack and unless GitHub goes down, no reason it won’t work.
- **Simpler workflow.** I only need a text editor and Git to update the site or release a blog post. No need for a local PHP server or anything. Plus, synchronizing my local environment with the one in production takes no more than a single command.
- **Fewer dependencies.** No more jQuery.paginate for pagination; Jekyll has a built in plugin to do it. No more Prism.js for syntax highlighting; Jekyll comes with Pygments, a Python based syntax highlighter. Less JS (and especially no more jQuery) means faster site.
- **Hosted on GitHub.** Not only are static files served from GitHub blazingly fast, but the [source code is now public](source code is now). I like the idea of making anyone able to have a look at the code behind the site. Plus, there is now a [bug tracker](https://github.com/KittyGiraudel/site/issues).
- **Discover new things.** I’ve learnt to use the PHP/MySQL combo but I finally learnt how not to use it when it is not needed. I wanted to discover a new thing and it turned out to be quite simple to use in the end.

## Before Jekyll

### Look 'ma, no CMS

When I launched the new version of the site last November, I wanted things to be as simple as possible. No complicated Rube Goldberg machine, no heavy CMS, none of this stuff. I didn’t even want to use a server-side language.

Every time I wanted to release an article, this what I did:

1. Create a new `.html` file
1. Write the article (+head, header, sidebar, footer, etc.)
1. Push it with an FTP client
1. Add a new entry on the home page
1. Add a new entry in the RSS feed

Everything was handled manually and I was pretty happy back then (what a fool…).

### It was a bad idea

<figure class="figure">
<img src="/assets/images/jekyll/oh-god-why.png" alt="Oh god… why?" />
<figcaption>Oh god… why?</figcaption>
</figure>

But soon enough I realized I couldn’t stand this any longer. Every time I had to edit a single comma in either the head, the sidebar or the footer, I had to open all the files all over again to fix it. YAAAAAAAAY!

So I tried to make things work a little better by themselves. I turned everything to PHP and used `include()` for shared parts throughout all pages. It was already way better. But once again I wanted to push things further.

I created a PHP array which was kind of a database to me. It handled both the index page and the RSS feed, and allowed me to quickly show/hide an article from the site by switching a boolean. Here is what it looked like:

```php
$articles = array(
  array(
    title => "Article title",
    desc => "A little article description",
    url => "/blog/url-of-the-article",
    codrops => false,
    guest => false,
    status => true //public
  ),
  …
);
```

It wasn’t bad at all but still wasn’t good enough. I started wondering whether or not I should get back to a real CMS like WordPress. I knew it would please me once everything would had been settled, but I also knew it would have taken weeks to get there because moving an existing site to WordPress is very complicated.

Also as a developer, I would probably have not felt very proud of running WordPress for my own site. Don’t get me wrong, WordPress works great but this site is also meant to show what I can do.

## Here comes Jekyll

This is why I wanted another simpler option, so I [asked](https://twitter.com/KittyGiraudel/status/302826818988290048) [on](https://twitter.com/KittyGiraudel/status/302839345277194240) [Twitter](https://twitter.com/KittyGiraudel/status/302910551363825665). A couple of people recommended either Jekyll or [Octopress](http://octopress.org/) (which runs on Jekyll). I had already heard about it since the site redesign has been motivated by [Dave Rupert’s](https://daverupert.com/2012/11/brander-newer/) when he moved to Jekyll.

Back then, I had a look at Jekyll and it seemed nice but overly complicated — at least to me. I am really not that smart when you put CSS aside. Anyway it seemed to be quite what I was looking for so I thought I should give a try.

I looked for tutorials to move a simple site to Jekyll and found a couple of posts explaining the whole process pretty well but the best one has to be [this one](https://www.andrewmunsell.com/tutorials/jekyll-by-example/) from Andrew Munsell. If you can read this Andrew, thank you a billion times because I couldn’t have made it without your post. Two or three reads later, I was fucking ready to move that shit to Jekyll.

### The install nightmare

Ironically, I think this was the hardest part. You see, when I tried to install the Jekyll gem at home (Mac OS X 10.6.8) it threw me an error. It wasn’t starting well.

Thanks to a [StackOverflow answer](https://stackoverflow.com/questions/10725767/error-installing-jekyll-native-extension-build), I understood I missed some sort of component (Command Line Tool XCode or whatever) which could be downloaded on Apple’s official website. Fair enough. After 15 minutes spent trying to remember my Apple ID, I could finally download and install this thing… only to realize it requires Mac OS X 10.7 to run. Damn it.

It’s Sunday morning, I have croissants and coffee. I CAN FIGURE THIS OUT! So I tried updating software components a couple of times to finally realize not only nothing was getting updated, but that it couldn’t update the OS itself, thus I would never get Mac OS X 10.7 this way.

After a few more Google searches and mouthfuls of delicious croissant, I found the horrifying answer: Mac OS X 10.7 cannot be upgraded for free. It is \$25. DAMN IT, I JUST WANT TO RUN JEKYLL!

Once again thanks to a [StackOverflow answer](https://stackoverflow.com/questions/10989869/how-do-i-get-ruby-set-up-in-os-x-10-6-8) I could install some other thing (called GCC) which would finally get rid of the error when trying to install Jekyll. Worst part over.

**Edit:** … kind of. I spent hours trying to install Jekyll on a Windows machine without success. It turns out the latest Rdiscount gem (required by Jekyll to compile Markdown into HTML) cannot compile due to [a bug on Windows](https://github.com/rtomayko/rdiscount/issues/74). As of writing, there is no known fix for this.

### Make things work locally

Making everything work locally was pretty easy I have to say, especially since my previous PHP architecture was kind of similar to the one I use with Jekyll today (includes, folder structure and such).

To create a blog post, here is what I have to do:

1. Create a new Markdown file (`.md`)
1. Fill the “front-matter”, which is what Liquid needs to compile everything right. As an example, here is the header (front-matter) of this post:<br>

```html
---
title: Moving to Jekyll
layout: post
---
```

1. Write my article (either in Markdown or in HTML)
1. Push to the repo

It is pretty straight forward. If I want to disable comments, it requires no more than switching the `comments` boolean to false. If it is a Codrops article, I only have to add `codrops: url`. If it is a guest post, I only have to add `guest: Ana Tudor`. See? Very simple.

It took me no more than a couple of hours with some motivating music to make my website run locally. Not everything was perfect (and still isn’t) but it was something.

## GitHub Pages

Setting up a GitHub Pages based website couldn’t be simpler. It only consists of creating a repo named this way `username.github.com`. Easy, right?

The best thing with GitHub Pages is that it is built on Jekyll. This means **you can push raw Jekyll source to your repo** and GitHub Pages will automagically compile it through Jekyll (on their side). This also means you only really need Jekyll the very first time to set everything up, but then — unless you plan on changing your structure everyday — you don’t really need to use Jekyll at all since GitHub does the compilation.

_I could also push the compiled code to the repo but that would mean I need Jekyll everytime I want to update anything on the site. Not great, especially since I work at 4 different places._

From there, I only had to push the local Jekyll site to this repo and about 10 minutes later, the whole thing was hosted and available at kittygiraudel.github.com. Easy as a pie.

## Redirect, DNS and all this shit

### Domain changes

At this point, I had my site based on Jekyll running on GitHub Pages. However I didn’t want to use kittygiraudel.github.com as the main domain name but kittygiraudel.com. Meanwhile, I had my (previous) website hosted on a OVH server, kittygiraudel.com pointing to a folder on this server.

Basically I had to tell the GitHub server to serve kittygiraudel.github.com content from kittygiraudel.com, and to make kittygiraudel.com redirect at kittygiraudel.github.com.

According to [GitHub Pages documentation](https://help.github.com/articles/setting-up-a-custom-domain-with-pages), and a couple of [posts on StackOverflow](https://stackoverflow.com/questions/9082499/custom-domain-for-github-project-pages), I understood I had to create a `CNAME` file at the root of the repo directing to the top-level domain I wanted to serve from (kittygiraudel.com) and set an A-record pointing to the GitHub IP from my own server.

This has been done and followed by 12 hours of worry. My site was down and I had no idea whether or not it would get back up. Since I don’t understand a thing about server stuff and DNS, I could have simply broken everything without even knowing it.

Hopefully I did everything right and the site has been back up about 12 hours after the DNS change. However some people are still facing some [issues](https://twitter.com/thebabydino/status/304194836523786240) when trying to reach the site as of today. I don’t think I can do anything about it except asking them to wait or use a proxy.

**Edit:** I got in touch with OVH technical support. Basically they told me everything was fine. Users unable to reach the site should try clearing their cache or try from different connections.

### Think of old URLs!

This was probably my biggest concern when I decided to change structure and host. I knew URLs were going to change and I had no idea how to make old URLs still working. Anyway **I had to**. There are a couple of articles being linked to on a daily basis.

GitHub doesn’t allow `.htaccess` config for obvious reasons, so I couldn’t set server-side redirects. A [StackOverflow answer](https://stackoverflow.com/a/13676721) recommended a Jekyll plugin to handle automatic redirects through aliases but GitHub Pages compiles Jekyll in safe mode (no plugin), so it wasn’t an option either.

I opted for a very simple — yet not perfect — approach which consisted of creating HTML files at the old locations redirecting to the new files with meta tags. For example, there is a file in a `/blog` folder called `css-gradients.html` containing only a the basic html/head/body tag and:

```html
<meta http-equiv="refresh" content="0;url=/2013/02/04/css-gradients/" />
```

Thus, trying to reach `kittygiraudel.com/blog/css-gradients` (old URL) automagically redirects to `kittygiraudel.com/2013/02/04/css-gradients/`. Easy peasy.

However it is not perfect since it requires me to have about 15 files like this in an unused /blog folder. I could do it because I only had 15 articles, but what if I had 300? So if anyone has a clean solution, I take it! :)

## Final words

First of all, I must say I am very happy with the porting. All in all, everything has gone pretty well and the downtime hasn’t been that long. Also I am proud of having done all this by myself; kind of a big deal to me.

There are still a couple of things to take care of, like finding a way to preview articles before releasing them without having to run Jekyll but it’s nitpicking.

If you ever happen to find any bug or if you have a suggestion, please [open an issue on GitHub](https://github.com/KittyGiraudel/site/issues) or drop me a comment here.
