---
title: "What's up at Browserhacks?"
preview: false
comments: true
layout: post
published: true
summary: true
---

<section>
<p>Well, quite a lot actually! We've been working hard on <a href="http://browserhacks.com">Browserhacks.com</a> lately to make this whole pool of hacks even easier for you to browse and use. So much we've recently crossed the 100 issues line on <a href="http://github.com/4ae9b8/browserhacks/">GitHub</a>; most of them are closed thankfully!</p>
<p>Anyway, since we do not have a blog for Browserhacks, I have no choice but to announce all those things here. Quick article to explain all we've done since last major update.</p>
</section>
<section id="grunt">
<h2>Moving to grunt <a href="#grunt">#</a></h2>
<img src="/images/whats-up-at-browserhacks__grunt.jpg" alt="Grunt.js is a JavaScript task runner" class="pull-image--right" />
<p>We have decided to put aside our PHP tools to move to a <a href="http://gruntjs.com">Grunt</a> workflow. As you may know, Grunt is  a task-builder in JavaScript which is involving a lot of things to us.</p>
<p>Well obviously the first thing is we need to learn how to Grunt. <a href="http://blog.weinberg.me/">Fabrice Weinberg</a> has helped us for the porting (a million thanks to him) but at the end of the day we should be able to do this on our own.</p>
<p>Now we don't use PHP anymore, we can host the whole thing on <a href="http://pages.github.com/">GitHub Pages</a> which makes our repository always synchronized with the server and save us from all that server/hosting crap.</p>
<p>Ultimately, because Grunt is a task builder we will be able to do a lot of things we couldn't imagine doing with a PHP setup. More importantly, we will be able to do a lot more things automatically especially testing hacks and stuff.</p>
</section>
<section id="merging-pages">
<h2>Merging home and test pages <a href="#merging-pages">#</a></h2>
<p>I think this is the one of the biggest change we've made to the site so far: <strong>merging both the home page and the test page</strong>. See, from the very beginning we had a separate test page. First it was all static, then I managed to generate it dynamically from our database.</p>
<blockquote class="pull-quote--right">You can still disable the tests if you want.</blockquote>
<p>This was a huge step forward but did we really need a separate page just for testing? It looks like <em>no</em>. It involved quite a bit of work but I'm glad we've made it. What do you guys think?</p>
<p>Nothing changed in the way we test hacks though: if your browser recognize a line of code, it turns it into a lovely green. If you don't like seeing green lines everywhere on the home page, you can still disable the tests by unchecking the checkbox <code>Enable tests</code> at the top of the page. Or you could download a browser that doesn't spread green lines everywhere... :)</p>
<p>There are still a couple of hacks that are not tested at all essentially all the hacks using IE-specific HTML comments. There is a simple reason for that: we do not know how to test them efficiently for now. We'll think of something.</p>
</section>
<section id="click-to-select">
<h2>One click select <a href="#click-to-select">#</a></h2>
<p>I think the very first issue we've opened for Browserhacks was a request for a <em>copy-to-clipboard</em> feature in order to have a hack ready to be used in a single click. Unfortunately, accessing the user's clipboard is very difficult due to obvious security reasons.</p>
<p><a href="http://brooknovak.wordpress.com/2009/07/28/accessing-the-system-clipboard-with-javascript/">This article by Brooknovak</a> explains it in details, but basically here are the possible solutions to insert content into the clipboard:</p>
<ul>
<li><code>clipboardData</code>: only available in IE</li>
<li><code>ZeroClipboard</code>: relies on Flash</li>
<li><code>Liveconnect</code>: relies on Java</li>
<li><code>XUL</code>: only available in Mozilla, and kind of buggy</li>
<li><code>execCommand</code>: both hacky and buggy</li>
</ul>
<blockquote class="pull-quote--right">A cross-browser <em>copy-to-clipboard</em> is not realistic.</blockquote>
<p>Basically it's a mess and a cross-browser <em>copy-to-clipboard</em> is not realistic. So we had to think of something and by <em>we</em> I mean <a href="http://timpietrusky.com">Tim Pietrusky</a> of course. He came up with a clever idea which would allow the user to select a hack &mdash; for lack of copying &mdash; in one click.</p>
<p>Thus, he released a little JavaScript library called <a href="http://timpietrusky.com/_select/">_select()</a> that allow anything to be selected in a single click: paragraphs, images, whole documents, anything.</p>
<p>Anyway, we now use this cool little library to allow you to select a whole hack by simply clicking it. Then, you only have to press <code>ctrl</code>/<code>cmd</code> + <code>C</code>. Hopefully, this while make it easier to use for all of you with a trackpad.</p>
</section>
<section id="legacy-hacks">
<h2>Introducing legacy hacks <a href="#legacy-hacks">#</a></h2>
<p>The web is evolving very quickly and so do the browsers. Meanwhile we are trying to keep a well documented list of hacks, including hacks nobody will ever use because they are targeting dinosaur browsers. To make the list lighter we've set up a <em>legacy</em> system.</p>
<p>Basically all hacks targeting a browser we consider as a <em>legacy browser</em> won't be displayed unless you tick the checkbox <code>Show legacy</code> at the top of the page, in which case you see everything even those shits for IE 6.</p>
<p>Fortunately, we've made it very easy for us to decree a browser version as obsolete. All we have to do is change the version in <a href="https://github.com/4ae9b8/browserhacks/blob/master/code/db_browsers.php">this file</a>. Every hack for this version and prior will be considered as legacy.</p>
<p>Soon enough, we'll move the legacy limit for Internet Explorer to <code>7</code>. Soon enough my friends.</p>
</section>
<section id="link-to">
<h2>Link to a hack <a href="#link-to">#</a></h2>
<p>We thought it would be cool if you could link to a specific hack. It would make it easier to show a hack to someone, rather than copy/pasting or saying <em>Section IE, sub-section Media hacks, 3rd hack on the 2nd column</em>.</p>
<p>So every hack now has a unique ID. You can target a hack by clicking the little <code>#</code> at the bottom right of the code.</p>
</section>
<section id="hack-safety"> 
<h2>Is this hack valid? <a href="#hack-safety">#</a></h2>
<p>This is a <a href="https://github.com/4ae9b8/browserhacks/issues/96">feature request by Lea Verou</a> we're honoring. She asked us for a way to know whether a hack is valid or not. By <em>valid</em>, we mean <em>goes through <a href="http://csslint.net/">CSS Lint</a> without raising a warning</em>.</p>
<p>Thanks to both Fabrice and Grunt, we managed to have all our CSS hacks checked with CSS Lint so you can know right away if a hack is valid or not. We'll very soon have the same thing for JavaScript hacks with JSLint.</p>
<figure class="figure">
<img src="/images/whats-up-at-browserhacks__validity.jpg" alt="">
<figcaption>Display hacks validity and CSS Lint errors</figcaption>
</figure>
<p>Awesome little feature: in case the hack is invalid, we display the warning raised by CSS Lint when you hover the little cross at the bottom right of the hack. Pretty cool, right? </p>
</section>
<section id="little-things">
<h2>Little things <a href="#little-things">#</a></h2>
<p>We've also done a few little things, starting by <em>improving</em> the design. The header is now lighter, and the search bar only is fixed on scroll. We'd like opinion on this. You like it? You don't? Why?</p>
<p>In addition we added, fixed and removed a lot of hacks.</p>
</section>
<section id="what-now">
<h2>What now? <a href="#what-now">#</a></h2>
<p>Well, there is always work to do: if only fixing bugs, adding hacks, verifying hacks, and so on. We still have quite a couple of features on the way.</p>
<blockquote class="pull-quote--right">Many of the hacks we provide are likely to break when passed in a preprocessor.</blockquote>
<p>For example we need to give you a hint about the <a href="https://github.com/4ae9b8/browserhacks/issues/96">safety of a hack</a>. Many of the hacks we provide are likely to break when passed in a preprocessor. Some of them can even break upon minification. While we can't prevent this from happening, we should be able to tell you which hacks are <em>safe</em> and which are not. We only need to think of a way to test all this stuff with Grunt. If you want to help, you'd be more than welcome!</p>
<p>And last but not least, we want to be able to automate the testing. This is probably our biggest project for Browserhacks, and we've yet to figure a way to do so. Ultimately, we'd like to be able to make all tests and proof-tests automated so we don't have to spend countless hours on <a href="http://browserstack.com">Browserstack</a> testing all the browsers / OS combos.</p>
<p>If you feel like helping for anything at all, that would be really awesome. Shoot us on <a href="http://twitter.com/browserhacks">Twitter</a> or on <a href="https://github.com/4ae9b8/browserhacks/">Github</a>.</p> 
<p class="note">Note: by the way, I'd really like not having to retweet everything from the Browserhacks Twitter account, so if you guys could follow it, that'd be cool. :D</p>
</section>