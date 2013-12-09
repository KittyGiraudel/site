---
title: The stylesheet breaker
layout: post
comments: true
preview: false
codepen: true
---
<section>
<p>Or <strong>how I found the one line of CSS that can break your entire stylesheet</strong>. Hopefully it is very unlikely that you'll ever write this line so worry not; you should be safe.</p>
<p>However this is definitely something good to know so you might want to move on with the read.</p>
</section>
<section id="start">
<h2>How did it start <a href="#start">#</a></h2>
<p>I was working on <a href="http://browserhacks.com">Browserhacks</a> pretty late very other night and just when I was about to turn everything off and go to bed, I runned the site on Google Chrome to "check that everything's okay".</p>
<p>And everything seemed okay until I noticed one deficient <a href="http://browserhacks.com/#hack-ac2480b5c83038f2d838e2a62e28a307">hack</a> we added a couple of days earlier, aiming for Chrome 29+ and Opera 16+. My Chrome 31.0.1650.57 didn't seem targeted so I removed the hack from our database and added a note about it on our GitHub repository. No big deal.</p>
<blockquote class="pull-quote--right">All our CSS hacks were broken.</blockquote>
<p>But just to be sure, I launched Firefox (Aurora) to make some tests and then the same phenomenum happened: I noticed a deficient hack. And then another one. And another one. And another one. And again. What the fuck? All of our 9 hacks supposed to target latest Firefox seemed to be completely pointless against Firefox Aurora. Either this browser has become bulletproof during its last releases, or there was a problem on our side. The latter the more plausible, unfortunately.</p>
<p>First thing odd: all the JavaScript hacks were fine; only the CSS one were miserably failing. So I started checking the stylesheet dedicated to the hacks (merged into <code>main.css</code> but whatever) and everything seemed good. I double checked the call, I double checked the selectors, I double checked many little things but no luck. Everything <em>seemed</em> fine.</p>
</section>
<section id="finding-the-issue">
<h2>Tracking down the culprit <a href="#finding-the-issue">#</a></h2>
<p>Whenever you're getting desperate about a bug, you start doing very unlikely things in hopes of solving your issues. I'm no exception so I started debugging like a blind man.</p>
<p>First thing I tried was removing the very first hack from the test sheet because it has a very weird syntax that I suspected could break things apart:</p>
<pre class="language-css"><code>.selector { (;property: value;); } 
.selector { [;property: value;]; }</code></pre>
<p>Pretty weird, right? Anyway that wasn't the problem. Then I removed a second one that I knew could be an issue at some point: the collection of IE 7- hacks that rely on adding special characters at the beginning of the property:</p>
<pre class="language-css"><code>.selector { !property: value; } 
.selector { $property: value; } 
.selector { &property: value; } 
.selector { *property: value; } 
.selector { )property: value; } 
.selector { =property: value; } 
.selector { %property: value; } 
.selector { +property: value; } 
.selector { @property: value; } 
.selector { ,property: value; } 
.selector { .property: value; } 
.selector { /property: value; } 
.selector { `property: value; } 
.selector { [property: value; } 
.selector { ]property: value; } 
.selector { #property: value; } 
.selector { ~property: value; } 
.selector { ?property: value; } 
.selector { :property: value; } 
.selector { |property: value; }</code></pre>
<p>Well... BINGO! No more issue and all the CSS hacks were working again. Now that I found the deficient hack, I had to figure out which line could make the whole world explode (well, kind of). Not much to do except trying to remove them one by one to find out this one was guilty:</p>
<pre class="language-css"><code>.selector { [property: value; }</code></pre>
</section>
<section id="about-the-line">
<h2>About the line <a href="#about-the-line">#</a></h2>
<p>Most CSS parsers are made in a way that if a line is not recognized as valid CSS, it is simply skipped. Mr. <a href="https://twitter.com/tabatkins">Tab Atkins Jr.</a> explains it very well in his article <a href="http://www.xanthir.com/blog/b4JF0">How CSS Handles Errors CSS</a>:
<blockquote class="quote">CSS was written from the beginning to be very forgiving of errors. When the browser encounters something in a CSS file that it doesn't understand, it does a very minimal freak-out, then continues on as soon as it can as if nothing bad had happened.</blockquote>
<p>Thus, CSS is not a language where a missing semi-colon can prevent your site from working. At best (worst?), it will break your layout because the one line with the missing semi-colon and the one line after it would not be executed. From the same source:</p>
<blockquote class="quote">If the browser is in trying to parse a declaration and it encounters something it doesn't understand, it throws away the declaration, then seeks forward until it finds a semicolon that's not inside of a {}, [], or () block.</blockquote>
<p>This very last quote explains why this line is able to break your entire stylesheet. Basically, you open a bracket you never close. And while the browser has started parsing the opening bracket, it won't do anything else before finding the closing one so every rules written after this hack won't even be processed.</p>
<p>I made some tests with an opening parenthesis and an open brace as well: same result. If you open either <code>{}</code>, <code>[]</code> or <code>()</code> in a property and don't think about closing it, it will crash the whole stylesheet (actually everything after the hack, not before).</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>In the end I simply removed <code>.selector { [property: value; }</code> from our hacks database so that it doesn't harm anyone again. If you want to play around this glitch, simply have a look at <a href="http://codepen.io/HugoGiraudel/pen/qztrl">this pen</a>:</p>
<p data-height="350" data-theme-id="0" data-slug-hash="qztrl" data-user="HugoGiraudel" data-default-tab="css" class='codepen'>See the Pen <a href='http://codepen.io/HugoGiraudel/pen/qztrl'>The stylesheet breaker line</a> by Hugo Giraudel (<a href='http://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='http://codepen.io'>CodePen</a></p>
<p>On a side note Sass, LESS and Stylus will all throw an error when encountering such a thing. In our case, we use Sass for everything but the hacks, for this very same reason: some hacks are not process-safe.</p>
<p>Anyway folks, that's all I got. ;) Make sure you don't have weird things in your stylesheets!</p>
</section>
