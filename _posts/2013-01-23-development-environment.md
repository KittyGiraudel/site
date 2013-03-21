---
title: My development environment
layout: post
comments: true
disqus: http://hugogiraudel.com/blog/development-environment
summary: true
---
<section>         
<p class="explanation"><strong>Edit (2013/02/21):</strong> this post might contain outdated informations since I <a href="http://hugogiraudel.com/2013/02/21/jekyll/">moved my site to Jekyll and GitHub Pages</a>.</p> 
<p>Hey guys! I recently blogged about the tools I use for front-end development, but someone pointed out on Twitter I didn't tell anything about my development environment. Let's fix my mistake and talk about it!</p>
<p>Well, first of all, it is kind of complicated because I work at 3 different places, which means I have 3 different development environments (5 actually, I have 3 computers at home). There is -well- home, but I also happen to do some stuff at school or at work when I have some time, mostly during the lunch break.</p>
<p>Anyway, I will try to describe what I use to work.</p>
</section>
<section id="os">
<h2>Operating system <a href="#os" class="section-anchor">#</a></h2>
<p>Let's start with the easy thing: the operating system. First, <strong>I use both Mac and Windows</strong>. At home, I mostly use my girlfriend's laptop which is a 4-year old Mac. I also have 2 computers I use(d) for gaming which runs Windows 7 and Windows Vista.</p>
<p>At work, I am on Windows XP. Yeah, that's not cool, I know. But the whole infrastructure is based on Windows XP, so even developers work stations are using XP. Anyway, I can live with it.</p>
<p>At school we're on Windows 7. The computers there are pretty cool I must say.</p>
<p>I didn't try Linux yet but I think I might come to it sooner or later. I like challenge.</p>
</section>
<section id="browser">
<h2>Browser <a href="#browser" class="section-anchor">#</a></h2>
<p>Ah, browsers. Our main tools. For the record, not so long ago I swear only by Firefox. But when I started doing a lot of stuff on the web at the same time (running many tabs with somewhat heavy content like videos, WebGL, CSS animations, etc.), it occurred to me Firefox was suffering from a bad memory management. Which wasn't the case of Chrome.</p>
<p>So I switched to Chrome and never looked back. I even pushed it one step further, using <a href="https://www.google.com/intl/en/chrome/browser/canary.html">Chrome Canary</a>. This in order to access to a few things Chrome doesn't support (or didn't support at the time I switched to Canary) like CSS shaders, exclusions, regions and so on.</p>
<blockquote class="pull-quote--right">I don't dislike Firefox -it's a wonderful browser- but I clearly prefer Chrome.</blockquote>
<p>At work for something which looks like SSL issue, I am also running <a href="http://www.mozilla.org/fr/firefox/channel/">Firefox Aurora</a> which is the future version of Firefox, like Canary for Chrome. I don't dislike Firefox -it's a wonderful browser- but I clearly prefer Chrome.</p>
<p>I also have Opera and Safari on some computers to make unusual tests. Since I am not a freelance web designer living from the sites I make, I'm not using any browser testing tool like <a href="http://www.browserstack.com/">BrowserStack</a>. I would really love a BrowserStack license, but I can't (or don't want to) afford a $20/month subscription.</p>
</section>
<section id="ide">
<h2>IDE <a href="#ide" class="section-anchor">#</a></h2>
<img src="/images/development-environment__sublime-text.png" alt="Sublime Text 2" class="pull-image--right">
<p>I used to be a huge fan of Notepad++, even if everybody was using Dreamweaver. Honestly I never liked DW; it is super heavy while doing not much than a regular text editor.</p>
<p>Now I am standing on <a href="http://www.sublimetext.com/2">Sublime Text 2</a> on all my computers, with no intention to change soon. The thing Sublime Text 2 provides that Notepad++ doesn't is the ability to open a whole folder in order to have access to any file of your project in the arborescence. This is really cool. Plus Sublime Text 2 looks better in my opinion. :)</p> 
<p>That being said, I'm carefully looking into <a href="http://brackets.io/">Brackets</a> from Adobe which is a web-based IDE looking pretty cool.</p>
</section>
<section id="ftp">
<h2>FTP <a href="#ftp" class="section-anchor">#</a></h2>
<p>Call me old fashioned, I do still use a FTP client. Yes, I know it's not 2000' anymore but I don't know how to use FTP from the command line, so I am stuck with a <a href="http://filezilla-project.org/">FileZilla</a>. It is actually pretty cool and very easy to use.</p>
<p>However I would like to move forward, thus I am currently learning how to do some FTP stuff through the command line but I'm still not very good at it so for now I keep using my beloved FileZilla.</p>
</section>
<section id="design">
<h2>Design <a href="#design" class="section-anchor">#</a></h2>
<p>Well, I am a huge fan of this <strong>design in the browser</strong> thing, plus I am very sucky when it comes to any designing tool. I mean you, Photoshop. So really, I hardly use Photoshop, unless I am forced to.</p>
<p>However I have the good luck to have an Adobe Creative Suite on most of my development workflows. Work provides official liences, we have student licences at school and I have a student licence at home as well.</p>
<p>You may find this silly but 9 out of 10 times, I use Photoshop to resize and save a screenshot I just took. Yeah... A $3000 software to make screenshots is a bit expensive I guess.</p>
</section>
<section id="tools">
<h2>Other tools <a href="#tools" class="section-anchor">#</a></h2>
<p>I didn't know how to call this section because it gathers various tools doing various things I use at various occasions. I hope it's clear enough. :P</p>
<h3>Sass &amp; Compass</h3>
<img src="/images/development-environment__sass-compass.jpg" alt="Sass and Compass" class="pull-image--right">
<p>Not so long ago I gave a try to CSS preprocessors, because I am both curious and a CSS lover. It turned out I like CSS preprocessors, they give a lot more options than regular CSS.</p>
<p>Anyway, I am using <a href="http://sass-lang.com/">Sass</a> and <a href="http://compass-style.org/">Compass</a> on most of my projects now. As an example, this site is built on Sass.</p>
<p>I am running Sass through the command line. Yes, it's scary. But actually it is really not that hard. I would like to have some sort of application taking care of everything for me like <a href="http://incident57.com/codekit/">CodeKit</a>, unfortunately I am not always on Mac OS plus CodeKit is not free ($25). If I was always using the same development environment, I would definitely buy CodeKit but sadly I am not.</p>
<p>I know there are CodeKit equivalents for Windows. Most people will tell you about <a href="http://mhs.github.com/scout-app/">Scout</a>. I tried it yesterday (as I told you I am curious). Guess what: it turns out Scout was messing with my stylesheets, introducing errors in those. My opinion about it? It sucks. Back to command line.</p>
<h3>Git</h3>
<p>Yaaaaay! Git, my dear friend! Guys, <strong>I suck at Git</strong>. I understand the main idea, I even know how to do some very basic stuff but every single time I need to do something it takes me about 20 minutes, I have to try every command I know (which is about 6 or 7), fail, get upset, read the doc, don't understand anything either and finally ask my brother. Long story short, I don't like Git... yet.</p>
<p>But I still have an <a href="https://github.com/HugoGiraudel">account at GitHub</a> which only has 2 repositories as of today (good ones tho!). I hope I'll push other things in the not so distand future.</p>
<h3>Local server</h3>
<p>When I have to do some server side stuff, mostly PHP (sometimes MySQL), I use EasyPHP when I'm on a Windows machine or Mamp when I'm on Mac.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words" class="section-anchor">#</a></h2>
<p>Well I guess I have covered pretty much everything I thought about. If I missed anything, just tell me and I will edit the post.</p>
<p>What about you guys? What's your development environment?</p>
</section>