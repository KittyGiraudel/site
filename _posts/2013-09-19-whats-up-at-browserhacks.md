---
layout: post
summary: true
title: "What's up at Browserhacks?"
tags:
  - css
  - hacks
  - release
---

Well, quite a lot actually! We've been working hard on [Browserhacks.com](http://browserhacks.com) lately to make this whole pool of hacks even easier for you to browse and use. So much we've recently crossed the 100 issues line on [GitHub](http://github.com/4ae9b8/browserhacks/); most of them are closed thankfully!

Anyway, since we do not have a blog for Browserhacks, I have no choice but to announce all those things here. Quick article to explain all we've done since last major update.

## Moving to grunt

<img src="/images/whats-up-at-browserhacks/grunt.jpg" alt="Grunt.js is a JavaScript task runner" class="pull-image--right" />

We have decided to put aside our PHP tools to move to a [Grunt](http://gruntjs.com) workflow. As you may know, Grunt is  a task-builder in JavaScript which is involving a lot of things to us.

Well obviously the first thing is we need to learn how to Grunt. [Fabrice Weinberg](http://blog.weinberg.me/) has helped us for the porting (a million thanks to him) but at the end of the day we should be able to do this on our own.

Now we don't use PHP anymore, we can host the whole thing on [GitHub Pages](http://pages.github.com/) which makes our repository always synchronized with the server and save us from all that server/hosting crap.

Ultimately, because Grunt is a task builder we will be able to do a lot of things we couldn't imagine doing with a PHP setup. More importantly, we will be able to do a lot more things automatically especially testing hacks and stuff.

## Merging home and test pages

I think this is the one of the biggest change we've made to the site so far: **merging both the home page and the test page**. See, from the very beginning we had a separate test page. First it was all static, then I managed to generate it dynamically from our database.

<blockquote class="pull-quote--right">You can still disable the tests if you want.</blockquote>

This was a huge step forward but did we really need a separate page just for testing? It looks like *no*. It involved quite a bit of work but I'm glad we've made it. What do you guys think?

Nothing changed in the way we test hacks though: if your browser recognize a line of code, it turns it into a lovely green. If you don't like seeing green lines everywhere on the home page, you can still disable the tests by unchecking the checkbox `Enable tests` at the top of the page. Or you could download a browser that doesn't spread green lines everywhere... :)

There are still a couple of hacks that are not tested at all essentially all the hacks using IE-specific HTML comments. There is a simple reason for that: we do not know how to test them efficiently for now. We'll think of something.

## One click select

I think the very first issue we've opened for Browserhacks was a request for a *copy-to-clipboard* feature in order to have a hack ready to be used in a single click. Unfortunately, accessing the user's clipboard is very difficult due to obvious security reasons.

[This article by Brooknovak](http://brooknovak.wordpress.com/2009/07/28/accessing-the-system-clipboard-with-javascript/) explains it in details, but basically here are the possible solutions to insert content into the clipboard:

* `clipboardData`: only available in IE
* `ZeroClipboard`: relies on Flash
* `Liveconnect`: relies on Java
* `XUL`: only available in Mozilla, and kind of buggy
* `execCommand`: both hacky and buggy

<blockquote class="pull-quote--right">A cross-browser *copy-to-clipboard* is not realistic.</blockquote>

Basically it's a mess and a cross-browser *copy-to-clipboard* is not realistic. So we had to think of something and by *we* I mean [Tim Pietrusky](http://timpietrusky.com) of course. He came up with a clever idea which would allow the user to select a hack &mdash; for lack of copying &mdash; in one click.

Thus, he released a little JavaScript library called [_select()](http://timpietrusky.com/_select/) that allow anything to be selected in a single click: paragraphs, images, whole documents, anything.

Anyway, we now use this cool little library to allow you to select a whole hack by simply clicking it. Then, you only have to press `ctrl`/`cmd` + `C`. Hopefully, this while make it easier to use for all of you with a trackpad.

## Introducing legacy hacks

The web is evolving very quickly and so do the browsers. Meanwhile we are trying to keep a well documented list of hacks, including hacks nobody will ever use because they are targeting dinosaur browsers. To make the list lighter we've set up a *legacy* system.

Basically all hacks targeting a browser we consider as a *legacy browser* won't be displayed unless you tick the checkbox `Show legacy` at the top of the page, in which case you see everything even those shits for IE 6.

Fortunately, we've made it very easy for us to decree a browser version as obsolete. All we have to do is change the version in [this file](https://github.com/4ae9b8/browserhacks/blob/master/code/db_browsers.php). Every hack for this version and prior will be considered as legacy.

Soon enough, we'll move the legacy limit for Internet Explorer to `7`. Soon enough my friends.

## Link to a hack

We thought it would be cool if you could link to a specific hack. It would make it easier to show a hack to someone, rather than copy/pasting or saying *Section IE, sub-section Media hacks, 3rd hack on the 2nd column*.

So every hack now has a unique ID. You can target a hack by clicking the little `#` at the bottom right of the code.

## Is this hack valid?

This is a [feature request by Lea Verou](https://github.com/4ae9b8/browserhacks/issues/96) we're honoring. She asked us for a way to know whether a hack is valid or not. By *valid*, we mean *goes through [CSS Lint](http://csslint.net/) without raising a warning*.

Thanks to both Fabrice and Grunt, we managed to have all our CSS hacks checked with CSS Lint so you can know right away if a hack is valid or not. We'll very soon have the same thing for JavaScript hacks with JSLint.

<figure class="figure">
<img src="/images/whats-up-at-browserhacks/validity.jpg" alt="">
<figcaption>Display hacks validity and CSS Lint errors</figcaption>
</figure>

Awesome little feature: in case the hack is invalid, we display the warning raised by CSS Lint when you hover the little cross at the bottom right of the hack. Pretty cool, right? 

## Little things

We've also done a few little things, starting by *improving* the design. The header is now lighter, and the search bar only is fixed on scroll. We'd like opinion on this. You like it? You don't? Why?

In addition we added, fixed and removed a lot of hacks.

## What now?

Well, there is always work to do: if only fixing bugs, adding hacks, verifying hacks, and so on. We still have quite a couple of features on the way.

<blockquote class="pull-quote--right">Many of the hacks we provide are likely to break when passed in a preprocessor.</blockquote>

For example we need to give you a hint about the [safety of a hack](https://github.com/4ae9b8/browserhacks/issues/96). Many of the hacks we provide are likely to break when passed in a preprocessor. Some of them can even break upon minification. While we can't prevent this from happening, we should be able to tell you which hacks are *safe* and which are not. We only need to think of a way to test all this stuff with Grunt. If you want to help, you'd be more than welcome!

And last but not least, we want to be able to automate the testing. This is probably our biggest project for Browserhacks, and we've yet to figure a way to do so. Ultimately, we'd like to be able to make all tests and proof-tests automated so we don't have to spend countless hours on [Browserstack](http://browserstack.com) testing all the browsers / OS combos.

If you feel like helping for anything at all, that would be really awesome. Shoot us on [Twitter](http://twitter.com/browserhacks) or on [Github](https://github.com/4ae9b8/browserhacks/). 

*Note: by the way, I'd really like not having to retweet everything from the Browserhacks Twitter account, so if you guys could follow it, that'd be cool. :D*
