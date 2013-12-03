---
title: The stylesheet breaker
layout: post
comments: false
preview: true
---
<section>
<p>Or how I found the one line of CSS that can break your entire stylesheet. Hopefully it is very unlikely that you'll ever write this line so worry not; you should be safe.</p>
<p>However this is definitely something good to know so you might want to move on with the read.</p>
</section>
<section id="start">
<h2>How did it start <a href="#start">#</a></h2>
<p>I was working on <a href="http://browserhacks.com">Browserhacks</a> pretty late very other night and just when I was about to turn everything off and go to bed, I runned the site on Google Chrome to "check that everything's okay".</p>
<p>And everything seemed okay until I noticed one deficient <a href="http://browserhacks.com/#hack-ac2480b5c83038f2d838e2a62e28a307">hack</a> we added a couple of days earlier, aiming at Chrome 29+ and Opera 16. My Chrome 31 didn't seem targeted so I removed the hack from our database and added a note about it on our GitHub repository. No big deal.</p>
<p>But just to be sure, I launched Firefox (Aurora) to make some tests and then the same phenomenum happened: I noticed a deficient hack. Then another one. Then another one. Then another one. What the fuck? All of our 9 hacks supposed to target latest Firefox seemed to be completely pointless against Firefox Aurora. Either this browser has become bulletproof during its last releases, or there was a problem on our side. The latter the more plausible, unfortunately.</p>
<p>First thing odd: all the JavaScript hacks were fine; only the CSS one were miserably failing. So I started checking the stylesheet dedicated to the hacks (merged into <code>main.css</code> but whatever) and everything seemed good. I double checked the call, I double checked the selectors, I double checked many little things but no luck. Everything seemed fine.</p>
</section>
<section id="finding-the-issue">
<h2>Finding the issue <a href="#finding-the-issue">#</a></h2>
<p>Whenever you're getting desperate about a bug, you start doing very unlikely things in the hope that it will somewhat solve your issues. I'm no exception and I start debugging like a blind man.</p>
<p>First thing I tried was removing the very first hack from the test sheet because it has a very weird syntax that I suspected could break things apart:</p>
<pre class="language-css"><code>.selector { (;property: value;); } 
.selector { [;property: value;]; }</code></pre>
<p>Pretty weird, right? Anyway that wasn't the issue. Then I removed a second one that I knew could be an issue at some point: the collection of IE 7- hacks that rely on adding a special character at the beginning of the property:</p>
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
<p>BINGO! No more issue and all the CSS hacks were working again.</p>
</section>