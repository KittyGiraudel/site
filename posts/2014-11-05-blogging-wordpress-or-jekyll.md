---
title: 'Blogging: WordPress or Jekyll'
description: A comparison of WordPress and Jekyll for blogging
tags:
  - WordPress
  - Jekyll
  - Writing
toc: false
deprecated: true
---

Disclaimer! I don’t really like writing comparisons. While I always try to stay neutral and factual, I feel like some people always feel offended and forced to nitpick or worse. So please let me remind you that this article is only intended to give a rough overview of both platforms and what you should expect from each.

So you want to create your own blog, or port your blog over, but you may not know which platform is the right fit for your needs. Of course there is a world outside of WordPress or Jekyll, but for sake of simplicity we’ll only dig down into these two.

First, allow me to introduce the two:

> WordPress is a free and open source blogging tool and a content management system (CMS) based on PHP and MySQL. Features include a plugin architecture and a template system.  
> — [Wikipedia – WordPress](https://en.wikipedia.org/wiki/WordPress)

> Transform your plain text into static websites and blogs.  
> — [Jekyllrb.com](http://jekyllrb.com/)

Note that both platforms are fully able to power complex websites, but for the length of our article we will only focus on the blogging component.

## Data Storage

The first thing that really divides these platforms is the way they handle data, which in our case would be a collection of articles.

WordPress being a MySQL-powered CMS, everything is stored in a database. WordPress then reads from and writes to this database whenever needed, fetching existing and adding new content.

It’s worth nothing WP stores much more than just articles. For instance, and that’s probably much more important than articles at this point, WordPress stores account credentials. To log into your dashboard and write articles, you have to type in your username and password so you can access the admin area which grants access to database.

On the other hand, Jekyll is basically a lot of files that get compiled only to build a static website. In itself, no server nor browser is able to read or serve a Jekyll site if it’s not being compiled to HTML/CSS first. So while being coded in Ruby, Jekyll actually requires absolutely no server side language or database system.

## Hosting

No matter what you end up choosing, hosting should concern you and have an impact on your decision. Both systems really do not work the same.

WordPress being a PHP/MySQL CMS needs to be hosted on a server that supports both PHP 5.2.4 or greater and MySQL 5.0 or greater. WordPress officially recommands [Apache](https://httpd.apache.org/) or [Nginx](http://nginx.org/). However, once everything set up on the server, you should not have to push new things now and then since everything is stored in a database.

When it comes to Jekyll, I can not recommend GitHub Pages hosting enough. The thing is, [GitHub Pages](https://pages.github.com/) support Jekyll, which means it is fully compatible. When you push an uncompiled Jekyll project (which has some very specific traits) to a [`gh-pages` branch](http://jekyllrb.com/docs/github-pages/#project-pages) of a GitHub Repository (public or private, it doesn’t matter), GitHub will compile it on its side and serve it.

That means you don’t have to compile your project on your machine, then push to a server. You can push the uncompiled source to your repository, and leave the compilation to GitHub Pages, which will serve it.

That also means you can update your site through GitHub directly, and use GitHub as a CMS which can be very handy when fixing typos and little things here and there. That being said, it will be much more convenient to clone, work, commit and push when your article involves images and stuff.

Anyway, you can also decide to compile your Jekyll project on your machine and push it to a server that is totally unrelated to GitHub but since Jekyll doesn’t rely on any database at all, and everything is just files, you’ll need to push to your server for every new article, which can be tedious.

## Writing

Writing an article in WordPress goes through this steps:

1. Log into your WordPress dashboard with your secure credentials;
2. Head into the ‘Post’ section to create a new article;
3. Write your post in the WordPress editor (Markdown needs a plugin);
4. Preview it through the WordPress preview system;
5. Publish it to make it live.

Writing an article in Jekyll:

1. Open the uncompiled source code of your Jekyll project on your machine;
2. Create a new file in the _posts folder;
3. Write your article in Markdown;
4. Run jekyll serve to preview your article;
5. Push on your repository if you host through GitHub Pages;
6. Run jekyll build and push on your server if you host the compiled site.

## Final Thoughts

Now, my opinion: if you are not scared with command lines (that are usually not any longer than jekyll build) and GitHub is an option for you, Jekyll is the perfect workflow. For a tech related blog, I could not recommend this enough.

Now if you are setting up a blog for someone who is really not that tech savvy, or want something simple ready in minutes, WordPress with a free/cheap theme is probably good enough for you.

What I do not like with WordPress is it uses a database, which immediately involves some security concerns (credentials, hacks, server…) and possibly slowness depending on your host and the quality of your theme. If you ask me, WordPress is quite an overkill solution for a simple personal blog.

On the other hand, Jekyll can look a little scary at first but ends up being very easy and comfortable to use if you have at least some little tech-background. I like to control everything when it comes to my own sites/blogs, and that’s exactly what Jekyll allows me to do