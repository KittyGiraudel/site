---
title: A round-up on CSS playgrounds
layout: post
comments: true
disqus: http://hugogiraudel.com/blog/css-playgrounds.html
---
<section id="playground">
<h2>What is a code playground? <a href="#playground" class="section-anchor">#</a></h2>
<p>A code playground is an online tool allowing you to do some code, then save and share it. It's often used for quick demos and reduced testcases. It's a good alternative to the old .html file with its embedded <code>&lt;style&gt;</code> and <code>&lt;script&gt;</code> tags.</p>
<p>Playgrounds are becoming more and more popular and there are a bunch of options when you want to use one. Let me introduce you the most popular ones:</p>
<ul>
<li><a href="http://codepen.io" title="CodePen">CodePen</a> from Chris Coyier, Tim Sabat and Alex Vasquez</li>
<li><a href="http://dabblet.com" title="Dabblet">Dabblet</a> from Lea Verou</li>
<li><a href="http://cssdeck.com" title="CSSDeck">CSSDeck</a> from Rishabh</li>
<li><a href="http://jsfiddle.net" title="JSFiddle">JSFiddle</a> from Oskar Krawczyk</li>
</ul> 
<p>Basically, they all do more or less the same stuff but each one has its own strengths and weaknesses. So in the end the choice is up to the user. I'd like to give you my opinion on this stuff but first, let's make a little round-up.</p>
</section>
<section id="dabblet">
<h2>Dabblet <a href="#dabblet" class="section-anchor">#</a></h2>
<p>Dabblet is an amazing playground<span style="text-decoration: line-through;">, however it doesn't support JavaScript. That being said, its author presented Dabblet as a pure CSS playground, so it's not very surprising JavaScript isn't supported</span>.</p>
<p>What is a little bit more surprising however is that Dabblet doesn't provide any support for preprocessors, especially CSS ones. Nowadays, it's a pretty big deal when a playground doesn't allow users to code with preprocessors.</p>
<p>Plus, it seems to be very buggy sometimes. Shortcuts don't work as expected, cursor is boucing to the top of your document, etc. It's too bad because it has a minimalist and cute interface.</p>
<h3>Pros</h3>
<ul>
<li>Live reload</li>
<li>Prefixfree by default (removable)</li>
<li>Modulable interface</li>
<li>User accounts via GitHub: gallery</li>
</ul>
<h3>Cons</h3>
<ul>
<li><span style="text-decoration: line-through">No JS support</span> JS tab now in alpha stage</li>
<li>No preprocessors support</li>
<li>Cloned GitHub user accounts (followers/following GitHub users)</li>
<li>Sometimes very buggy</li>
</ul>
<h3>Resources</h3>
<ul>
<li><a href="http://dabblet.com" title="Dabblet">Dabblet</a></li>
<li><a href="http://blog.dabblet.com/" title="Blog Dabblet">Blog</a></li>
<li><a href="https://twitter.com/dabblet" title="Dabblet on Twitter">Dabblet</a> on Twitter</li>
</ul>
</section>
<section id="jsfiddle">
<h2>JSFiddle <a href="#jsfiddle" class="section-anchor">#</a></h2>
<p>JSFiddle is a wonderful playground when it comes to JavaScript development since it provides a wide range of JavaScript libraries, probably more than you'll ever need. Problem is it doesn't use a live reload system meaning you have to hit "Run" everytime you make a change. It's kind of annoying, but for JavaScript prototyping, it's amazing.</p>
<h3>Pros</h3>
<ul>
<li>22 JavaScript libraries available + multiple versions: Mootools, jQuery, Prototype, YUI, Glow, Dojo, Processing.js, ExtJS, Raphael, RightJS, Three.js, Zepto, Eny, Shipyard, Knockout, The X Toolkit, AngularJS, Ember, Underscore, Bonsai, KineticJS, FabricJS</li>
<li>Highly customizable for JS development</li>
<li>Built-in options for Normalize.css</li>
<li>Preprocessors: SCSS (CSS), CoffeeScript (JS), JavaScript 1.7 (JS)</li>
<li>Easy embedding of external stylesheets / JS scripts</li>
<li>Doctype accessible</li>
<li>Numbers versions of your work</li>
<li>User accounts: gallery</li>
<li>Mobile debugger</li>
</ul>
<h3>Cons</h3>
<ul>
<li>No live reload</li>
<li>No HTML preprocessors support</li>
<li>No built-in option for Prefixfree and Modernizr</li>
<li>Interface somewhat a bit fixed</li>
</ul>
<h3>Resources</h3>
<ul>
<li><a href="http://jsfiddle.net" title="JSFiddle">JSFiddle</a></li>
<li><a href="https://twitter.com/jsfiddle" title="JSFiddle on Twitter">JSFiddle</a> and <a href="https://twitter.com/jsfiddlesupport" title="JSFiddleSupport on Twitter">JSFiddleSupport</a> on Twitter</li>
</ul>
</section>
<section id="cssdeck">
<h2>CSSDeck <a href="#cssdeck" class="section-anchor">#</a></h2>
<p>CSSDeck is fairly new in the playground scene but it's the only one providing the ability to record your code while you type it in order to have some kind of video. Basically, you can make video tutorial with CSSDeck, which you can't do with other playgrounds.</P>
<h3>Pros</h3>
<ul>
<li>Live reload</li>
<li>Codecast feature (video coding)</li>
<li>11 JavaScript libraries available: MooTools, jQuery, jQuery Mobile, Prototype, YUI, Underscore, Backbone, Modernizr, Sencha Touch, Dojo, Bootstrap</li>
<li>Preprocessors: ZenCoding (HTML), Markdown (HTML), Slim (HTML), Jade (HTML), HAML (HTML), LESS (CSS), Stylus (CSS), SCSS (CSS), Sass (CSS), Compass (CSS), CoffeeScript (JS)</li>
<li>Built-in options for Prefixfree and Normalize.css</li>
<li>User accounts via Twitter or GitHub: gallery, likes & follow</li>
<li>Possibility to make private stuff</li>
</ul>
<h3>Cons</h3>
<ul>
<li>Small community</li>
<li>Interface sometimes a bit messy</li>
</ul>
<h3>Resources</h3>
<ul>
<li><a href="http://cssdeck.com" title="CSSDeck">CSSDeck</a></li>
<li><a href="https://twitter.com/cssdeck" title="CSSDeck on Twitter">CSSDeck</a> on Twitter</li>
</ul>
</section>
<section id="codepen">
<h2>CodePen <a href="#codepen" class="section-anchor">#</a></h2>
<p>CodePen is one hell of a playground. It provides very strong tools for each of the 3 supported languages and provides awesome features for registered users like personal gallery, tags, forks, likes and follows, various themes, etc.</p>
<p>Plus, authors pick best pens on the site and feature them on the front page. This way you can have a look at best front-end works outhere without having to search in thousands of pages.</p>
<h3>Pros</h3>
<ul>
<li>Live reload</li>
<li>8 JavaScript libraries available: jQuery, jQuery UI, Zepto, MooTools, Prototype, YUI, ExtJS, Dojo</li>
<li>Preprocessors: ZenCoding (HTML), Markdown (HTML), Slim (HTML), HAML (HTML), LESS (CSS), SCSS (CSS), Sass (CSS), CoffeeScript (JS)</li>
<li>Built-in options for Prefixfree, Normalize.css, Reset.css and Modernizr</li>
<li><code>&lt;head&gt;</code> accessible</li>
<li>Easy embedding of external stylesheets / JS scripts</li>
<li>User accounts via GitHub: gallery, likes & follow</li>
<li>Various themes available</li>
<li>Tags</li>
<li>Possibility to fork</li>
<li>Homepage featuring coolest pens</li>
<li>A PRO version with special features (teach mode, pair programming and much more)</li>
</ul>
<h3>Cons</h3>
<ul>
<li>Interface somewhat a bit fixed (preview with small height)</li>
<li>Everything is public without PRO version</li>
<li>Not registered pens are quickly deleted</li>
<li>Sometimes buggy with for loops</li>
</ul>
<h3>Resources</h3>
<ul>
<li><a href="http://codepen.io" title="CodePen">CodePen</a></li>
<li><a href="http://blog.codepen.io/" title="CodePen blog">Blog</a></li>
<li><a href="https://twitter.com/codepen" title="CodePen on Twitter">CodePen</a> on Twitter</li>
</ul>
</section>
<section id="opinion">
<h2>What's my opinion <a href="#opinion" class="section-anchor">#</a></h2>
<p>Honestly, I think <strong>CodePen is far ahead of any other playground outhere</strong>. All in all, it provides more options than others, it's more stable, less buggy, and far more popular even if it's only 6 months old.</p>
<p>I used to work a lot in Dabblet but I've always found those tiny little bugs very annoying. Then I switched to JSFiddle but the lack of a live reload was bothering me. Then came CodePen and it was kind of a revelation.</p>
<p>Shortly after the launch, I spent a huge amount of time on CodePen to play with CSS. Back in the days, I did between 1 and 5 pens a day (inspired from Dribbble), most of them hitting the front page. It was very amusing. Now, I'm not doing much anymore because I use my free time for Codrops as part of articles.</p>
<p>Anyway, if you'd like to have a glance behind the scenes of CodePen, <a href="http://davidwalsh.name/codepen-interview" title="CodePen interview">David Walsh recently interviewed Chris Coyier about it</a>. They talk about challenges to get there, technical details and of course what's planned for the future.</p>
<p>I've made a comparison of these 4 playgrounds as a table for more clarity. Here is <a href="http://jsfiddle.net/FDDed/13/embedded/result/" title="Comparison CSS playgrounds">the JSFiddle</a>. Yeah, I made a <strong>JSFiddle</strong>, because on CodePen everything is public, and I don't want to drop those kind of things there. It's probably one of the only bad sides of CodePen, which will be soon gone.</p>
<iframe style="width: 100%; height: 500px; margin: 20px 0;" src="http://jsfiddle.net/FDDed/13/embedded/result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
<p>What about you? What's your favorite CSS playground?</p>
</section>