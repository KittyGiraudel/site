---
title: "What's up at Browserhacks?"
preview: true
comments: false
layout: post
---
<section>
<p>Well, quite a lot actually! We've been working hard on <a href="http://browserhacks.com">Browserhacks.com</a> lately to make this whole pool of hacks even easier for you to browse and use. So much we've recently crossed the 100 issues line on <a href="http://github.com/4ae9b8/browserhacks/">GitHub</a>; most of them are closed thankfully!</p>
<p>Anyway, since we do not have a blog for Browserhacks, I have no choice but to announce all those things here. Quick article to explain all we've done since last update.</p>
</section>
<section id="merging-pages">
<h2>Merging home and test pages <a href="#merging-pages">#</a></h2>
<p>I think this is the biggest change we've made to the site so far: merging both the home page and the test page. You see, from the very beginning we had a separate test page. First it was all static, then I managed to generate it dynamically from our database. This was a huge step forward but did we really need a separate page just for testing?</p>
<p>It looks like <em>no</em>. It involved quite a bit of work but I'm glad we've made it. What do you guys think?</p>
<p>Nothing changed in the way we test hacks though: if your browser recognize a line of code, it turns it into a lovely green. In most cases, it means your browser can be targeted by a single line of code, but for some "everything but..." hacks, it's actually a good thing.</p>
<p>If you don't like seeing green lines everywhere on the home page, you can still disable the tests by unchecking the checkbox <em>Enable tests</em> at the top of the page. Or you could download a browser that doesn't spread green lines everywhere... :)</p>
<p>There are still a couple of hacks that are not tested at all essentially all the hacks using IE-specific HTML comments. There is a simple reason to that: we do not know how to test them efficiently for now. We'll think of something.</p>
</section>
<section id="click-to-select">
<h2>One click select <a href="#click-to-select">#</a></h2>
<p>I think the very first issue we've opened for Browserhacks was a request for a <em>copy-to-clipboard</em> feature in order to have a hack ready to be used in a single click. Unfortunately, accessing the user's clipboard is very difficult due to obvious security reasons.</p>
<p><a href="http://brooknovak.wordpress.com/2009/07/28/accessing-the-system-clipboard-with-javascript/">This article</a> explains it in details, but basically here are the possible solutions to insert content into the clipboard:</p>
<ul>
<li><code>clipboardData</code>: only available in IE</li>
<li><code>ZeroClipboard</code>: relies on Flash</li>
<li><code>Liveconnect</code>: relies on Java</li>
<li><code>XUL</code>: only available in Mozilla, and kind of buggy</li>
<li><code>execCommand</code>: both hacky and buggy</li>
</ul>
<blockquote class="pull-quote--right">A cross-browser <em>copy-to-clipboard</em> is not realistic.</blockquote>
<p>Basically: it's a mess and a cross-browser <em>copy-to-clipboard</em> is not realistic. So we had to think of something and by <em>we</em> I mean <a href="http://timpietrusky.com">Tim Pietrusky</a> of course. He came up with a clever idea which would allow the user to select a hack &mdash; for lack of copying &mdash; in one click.</p>
<p>Thus, he released a little JavaScript library called <code>_select()</code> that allow anything to be selected in a single click: paragraphs, images, whole documents, anything. You <strong>really</strong> should check <a href="http://timpietrusky.com/_select/">this</a>.</p>
<p>Anyway, we now use <code>_select()</code> to allow you to select a whole hack by simply clicking it. Then, you only have to press <code>ctrl</code>/<code>cmd</code> + <code>C</code>. Hopefully, this while make it easier to use for all of you with a trackpad.</p>
</section>
<section id="legacy-hacks">
<h2>Introducing legacy hacks <a href="#legacy-hacks">#</a></h2>
<p>The web is evolving very quickly and so do the browsers. Meanwhile we are trying to keep a well documented list of hacks, including hacks nobody will ever use because they are targeting dinosaur browsers. To make the list lighter we've set up a "legacy" system.</p>
<p>Basically all hacks targeting a browser we consider as a "legacy browser" won't be displayed unless you tick the checkbox <em>Show legacy</em> at the top of the page, in which case you see everything even those shits for IE 6.</p>
<p>Fortunately, we've made it very easy for us to decree a browser version as obsolete. All we have to do is change the version in <a href="https://github.com/4ae9b8/browserhacks/blob/master/code/db_browsers.php">this file</a>. Every hack for this version and prior will be considered as legacy.</p>
<p>Soon enough, we'll move the legacy limit for Internet Explorer to <code>7</code>. Soon enough my friends.</p>
</section>
<section id="little-things">
<h2>Little things <a href="#little-things">#</a></h2>
<p>We've also done some little things, starting by <em>improving</em> some styles. The header is now lighter, and the search bar only is fixed on scroll. We'd like opinion on this. You like it? You don't? Why?</p>
<p>In addition we added, fixed and removed a lot of hacks.</p>
</section>
<section id="what-now">
<h2>What now? <a href="#what-now">#</a></h2>
<p>Well, there is always work to do: if only fixing bugs, adding hacks, verifying hacks, and so on. We still have quite a couple of features on the way though like being able to <a href="https://github.com/4ae9b8/browserhacks/issues/97">link to a hack</a>. Actually the feature was ready to be released until we realised the id for a hack is likely to be changed since we don't use an auto-incremented primary from a DBMS but a <a href="https://github.com/4ae9b8/browserhacks/blob/master/code/db_hacks.php">huge PHP array</a>.</p>
<p>You can still use a hack's HTML id to link (like <a href="http://browserhacks.com#hack-10">http://browserhacks.com#hack-10</a>) but don't be surprised if some day, <code>hack-10</code> don't link to this hack anymore.</p> 
<blockquote class="pull-quote--right">Many of the hacks we provide are likely to break when passed in a preprocessor.</blockquote>
<p>I think we also need to give you a hint about the <a href="https://github.com/4ae9b8/browserhacks/issues/96">safety of a hack</a>. Many of the hacks we provide are likely to break when passed in a preprocessor. Some of them can even break upon minification. While we can't prevent this from happening, we should be able to tell you which hacks are <em>safe</em> and which are not. We only need ot think of a way to test all this stuff. If you want to help, you'd be more than welcome!</p>
<p>And last but not least, we want to be able to <a href="https://github.com/4ae9b8/browserhacks/issues/88">automate the testing</a>. This is probably our biggest project for Browserhacks, and we've yet to figure a way to do so. Ultimately, we'd like to be able to make all tests and proof-tests automated so we don't have to spend countless hours on <a href="http://browserstack.com">Browserstack</a> testing all the browsers / OS combos.</p>
<p>If you feel like helping for anything at all, that would be really awesome. Shoot us on <a href="http://twitter.com/browserhacks">Twitter</a> or on <a href="https://github.com/4ae9b8/browserhacks/">Github</a>.</p> 
<p class="note">Note: by the way, I'd really like not having to retweet everything from the Browserhacks Twitter account, so if you guys could follow it, that'd be cool. :D</p>
</section>