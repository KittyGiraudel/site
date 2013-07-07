---
title: A closer look at my Sass structure
layout: post
comments: true
disqus: http://hugogiraudel.com/blog/sass-structure
summary: true
---
<section>          
<p class="explanation"><strong>Edit (2013/02/27):</strong> this post contains valuable yet outdated informations. To have a look at my current Sass structure, please have a look at <a href="https://github.com/HugoGiraudel/hugogiraudel.github.com/tree/master/sass">the GitHub repo</a>.</p>
<p>Hi guys! Ever since the redesign a few weeks ago I have never stopped trying optimizing the performance of the site. One of my biggest concerns was having a stylesheet which is both nice and efficient.</p>
<p>I think I’ve come pretty close to this point thus I thought it might be a good idea to write a bit about it and give you an inside glance at the whole thing.</p>
<p>Please, consider this post as both a way to introduce some people to Sass and a way to ask Sass experts some advices about the way I handled things. Any comment appreciated. :)</p>
</section>
<section id="divide-and-rule">
<h2>Divide and rule <a href="#divide-and-rule" class="section-anchor">#</a></h2>
<p>One of the biggest problem one faces when building a stylesheet is the size. Depending on the number of pages, elements and templates on your site, you might end up with a huge stylesheet heavy like hell and not so maintainable.</p>
<p>I think one of the best things when using a CSS preprocessor -whatever is your cup of tea- is you can split your stylesheets into several parts without risking degrading the performances.</p>
<p>This is exactly what I did, spliting my stylesheets into parts. As of writing, I currently have 5 different pieces (5 different .scss files):</p>
<ul>
<li><code>_font-awesome.scss</code>: <a href="http://fortawesome.github.com/Font-Awesome/">Font Awesome</a> is the icon font I use in the site</li>
<li><code>_google-fonts.scss</code>: this is the snippet from <a href="http://www.google.com/webfonts">Google Web Fonts</a></li>
<li><code>_prism.scss</code>: <a href="http://prismjs.com/">Prism.js</a> is the syntax highlighter</li>
<li><code>_helpers.scss</code>: this file contains my mixins, variables and helper classes</li>
<li><code>_styles.scss</code>: the core of the CSS
</ul>
<p class="note">Note: .scss files starting with a <code>_</code> are not compiled into .css files.</p>
<p>Since my website isn’t that big, I didn’t have to split the code stylesheet into smaller parts like typography, header, footer, modules, etc.</p>
<p>So basically, my central stylesheet (<code>styles.min.scss</code> compiled into <code>styles.min.css</code>) looks like this:</p>
<pre class="language-scss"><code>@import "compass/css3/images";
@import "compass/css3";

@import "font-awesome", 
        "google-fonts", 
        "prism", 
        "helpers", 
        "styles";</code></pre>
<p>The first two lines are Compass related imports. It doesn’t compile into the final CSS. They enable use of Compass embedded mixins, sparing me from writing vendor prefixes. The last line imports the 5 files into a single one (top to bottom).</p>
<p class="note">Note: when importing Sass/SCSS files, you don't need to add underscores or file extensions.</p>
</section>
<section id="kiss">
<h2>KISS (Keep It Simple Stupid) <a href="#kiss" class="section-anchor">#</a></h2>
<p>At first I was using <a href="http://cssgrid.net">the 1140px grid</a> but then it occurred to me I didn’t need a framework as simple as it is to handle a 2-columns layout. I could do it myself and so did I. </p>
<p>My point is: I decided to keep my stylesheet as simple (light) as possible. Thus, I did a huge cleaning in the font-awesome stylesheet. I only kept what was needed: the @font-face call, about ten lines to improve icons position, and the 8 icons I use on the whole site (instead of about 300).</p>
</section>
<section id="helpers">
<h2>Helpers <a href="#helpers" class="section-anchor">#</a></h2>
<p>Depending on your project size, you may have various files for that. Maybe one file for variables, one file for mixins, one file for helper classes, and whatever else you like.</p>
<p>My project is fairly (not to say really) small so I gathered everything into a single file. Let’s dig a little bit into it, part by part.</p>
<h3>Mixins</h3>
<pre class="language-scss"><code>// Mixin providing a PX fallback for REM font-sizes

@mixin font-size($val) {
    font-size: ($val * 20) + px;
    font-size: $val + rem;
}

// Mixin handling breakpoints for media queries

@mixin breakpoint($point) {
    @if $point == mama-bear {
        @media (max-width: 48em) { @content; }
    }
    @if $point == baby-bear {
        @media (max-width: 38em) { @content; } 
    }
}</code></pre>
<p>Just two. Why having one hundred mixins when you use just two? The first one allows me to use <code>rem</code> safely for font-size by providing a <code>px</code> fallback. This is a very nice mixin from Chris Coyier at <a href="http://css-tricks.com/snippets/css/less-mixin-for-rem-font-sizing/">CSS-tricks</a>. </p>
<p>The second one also comes from <a href="http://css-tricks.com/media-queries-sass-3-2-and-codekit/">CSS-tricks</a> and is a nice way to handle breakpoints for Media Queries within a single MQ declaration. If either I want to change the breakpoints, I don’t have to go through all my stylesheets to find occurrences; all I have to do is edit it in the mixin.</p>
<p>Whenever I want to use a Media Query, I just have to run <code class="language-css">@include breakpoint(baby-bear) { /* My stuff here */ }</code>.</p>
<p class="note">Note: I use <code>em</code> in media queries in order to prevent some layouts problem when zooming in the browser. More about it in <a href="http://blog.cloudfour.com/the-ems-have-it-proportional-media-queries-ftw/">this article</a> from Lyza Gardner.</p>
<h3>Variables</h3>
<p>Ah variables. The most awesome thing in any informatic language in the world. This little piece of thing that spare you from repeating again and again the same things. </p>
<p>Native CSS variables are coming but currently only supported by Chrome so meanwhile we rely on CSS preprocessors for variables. I have to say I really didn’t use much in my project. Actually I used 4, not more.</p>
<pre class="language-scss"><code>$pink: #FF3D7F;
$lightgrey: #444;
$mediumgrey: #666;
$darkgrey: #999;</code></pre>
<p>At first I named my variables like <code>$color1</code>, <code>$color2</code>, etc but then it occurred to me I was not able to know what variable I had to set in order to have the right color so I switched back to real color names. It feels easier to me this way.</p>
<h3>Helper classes</h3>
<p>Helpers are classes you can add to any element to have a quick effect without having to give this element any id or specific class, then set styles and all this stuff.</p>
<p>I have quite a few helper classes, some very useful, other a bit less but I use them all in the site. This kind of collection grow up as the project grow so for now it’s kind of small.</p>
<p>Let's start with the basics:</p>
<ul>
<li><code>%clearfix</code> is an invisible class meant to be extended (@extend) to clear floats in an element containing only floated elements</li>
<li><code>.icon-left</code> and <code>.icon-right</code> are used on inline icons to prevent them from sticking the text</li>
</ul>                   
<pre class="language-scss"><code>%clearfix {
    &:after {
        display: table;
        content: "";
        clear: both 
    }
}

.icon-left { margin-right: 5px }
.iconright { margin-left: 5px }</code></pre>
<p>Then, two helpers to give content specific meaning:</p>
<ul>
    <li><code>.visually-hidden</code> simply make the text disappear while keeping it accessible for both screen readers and search engine bots.</li>
    <li><code>.note</code> is used to tell a paragraph is a note which could be removed without affecting the sense of the content</li>
</ul>
<pre class="language-scss"><code>.visually-hidden { 
    position: absolute; 
    overflow: hidden; 
    clip: rect(0 0 0 0); 
    height: 1px; width: 1px; 
    margin: -1px; 
    padding: 0; 
    border: none; 
}

.note {
    font-style: italic;
    padding-left: 1em;
}</code></pre>
<p>And now let's dig into more interesting stuff. I have built some useful classes to pull images or quotes out of the flow and put them on the side in order to emphasize them. Both are built in the same way:</p>
<ul>
    <li><code>%pull-quote</code> and <code>%pull-image</code> are invisible classes; it means they won’t be compiled in the stylesheet, they are only here to be extended</li>
    <li><code>.pull-quote--left</code>, <code>.pull-quote--right</code>, <code>.pull-image--left</code> and <code>.pull-image--right</code> respectively inherit (<code>@extend</code>) styles from <code>%pull-quote</code> and <code>%pull-image</code></li>
    <li>Plus, they have some specific styles like margins, float, borders, etc.</li>
    <li>On small screens, they are not floated any more, pulled back in the flow and centered</li>
</ul>
<pre class="language-scss"><code>%pull-image {
    max-width: 15em;
    display: block;

    @include breakpoint(baby-bear) { 
        float: none;
        width: 100%;
        margin: 1em auto;
    }
}

.pull-image--left {
    @extend %pull-image;
    float: left;
    margin: 0 1em 1em 0;
}

.pull-image--right {
    @extend %pull-image;
    float: right;
    margin: 0 0 1em 1em;
}

%pull-quote {
    max-width: 250px;
    width: 100%;
    position: relative;
    line-height: 1.35;
    font-size: 1.5em;

    &:after,
    &:before {
        font-weight: bold;
    }

    &:before { content: '\201c'; }
    &:after  { content: '\201d'; }

    @include breakpoint(baby-bear) { 
        float: none;
        margin: 1em auto;
        border: 5px solid $pink;
        border-left: none;
        border-right: none;
        text-align: center;
        padding: 1em 0.5em;
        max-width: 100%;
    }
}

.pull-quote--left {
    @extend %pull-quote;
    text-align: right;
    float: left;
    padding-right: 1em;
    margin: 0 1em 0 0;
    border-right: 6px solid $pink;
}

.pull-quote--right {
    @extend %pull-quote;
    text-align: left;
    float: right;
    padding-left: 1em;
    margin: 0 0 0 1em;
    border-left: 6px solid $pink;
}</code></pre>
<p>Please note how I nest media queries inside their related selectors. There are two main reasons for this:</p>
<ul>
<li>This makes the stylesheet easier to maintain since you have everything at the same place: regular rules + conditional rules. No need of going at the bottom of the stylesheet to find all the conditional CSS.</li>
<li>When compiling, Sass doesn’t generate a bunch of media queries but a single one. So no performance issue on this point.</li>
</ul>
<p class="note">Note: if you ever wonder about the double dashes or underscores in class names, it is related to the BEM (Block Element Modifier) approach. More on the topic in <a href="http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/">this excellent post</a> from Harry Roberts.</p>
</section>
<section id="core">
<h2>Core of styles<a href="#core" class="section-anchor">#</a></h2>
<p>Now we’ve seen pretty much everything else than what makes the site what it is, I think it’s time to dig into the main stylesheet. For reading concern I’ll split it into several code snippets here. Plus it will be easier for commenting.</p>
<h3>Reset</h3>
<p>This is not optional, every project needs to use some kind of way to reset CSS styles. Depending on your tastes it might be <a href="http://meyerweb.com/eric/tools/css/reset/">Eric Meyer’s CSS reset</a>, <a href="http://necolas.github.com/normalize.css/">Normalize CSS</a> or as I like to call it the <strong>barbarian CSS</strong> as below.</p>
<pre class="language-scss"><code>*,
*:before,
*:after {
    @include box-sizing(border-box);
    padding: 0;
    margin: 0;
}</code></pre>
<p>Yes I know, this is dirty. I shouldn’t not reset CSS this way but honestly on small projects like this, it’s really not a big deal. At first I used Normalize CSS but then I realized loading kilobytes of code when 2 lines are enough is not necessary. So barbarian CSS reset guys!<p>
<p>Please note I use the simplest box-sizing since IE (all versions) represents less than 1.5% of my traffic.</p>
<h3>Overall stuff</h3>
<p>I didn’t really know how to call this.</p>
<pre class="language-scss"><code>html {
    font: 20px/1 "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue","Helvetica","Arial","Lucida Grande",sans-serif;
    color: #555;
    text-shadow: 0 1px rgba(255,255,255,0.6);

    border-left: 6px solid $pink;
    background-image: url("data:image/png;base64,hErEiSaFuCkInGlOnGdAtAuRiaSaBaCkGrOuNd");

    @include breakpoint(baby-bear) { 
        border-left: none;
        border-top: 5px solid $pink;
    }
}

a {
    color: $pink;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}</code></pre>
<p>Basic stuff here. Font-size, color, font-families, text-shadows and everything that needs to cascade on the whole document are set on the root element (<code>html</code>). I also give a little custom styles to anchor tags.</p>
<h3>Containers</h3>
<p>This used to be in the 1140px stylesheet but since I don’t use anymore, I moved it back here. It’s all about main wrappers and containers.</p>
<pre class="language-scss"><code>.row {
    width: 100%;
    max-width: 57em;
    margin: 0 auto;
    padding: 0 1em;
}

.main {
    @extend %content;
    width: 68%;
    margin-right: 2%;

    @include breakpoint(mama-bear) { 
        margin-right: 0;
        border-bottom: 3px solid #D1D1D1;
    }
}

.sidebar {
    @extend %content;
    width: 30%;
    padding-top: 2em;
}

%content { 
    padding-bottom: 3em;
    float: left;

    @include breakpoint(mama-bear) {
        float: none;
        width: 100%;
    }
}</code></pre>
<p><code>.row</code> is the main wrapper: it contains the header, the main column (<code>.main</code>), the sidebar (<code>.sidebar</code>) and the footer.</p>
<p><code>.content</code> is an invisible shared class between both the main column and the sidebar.</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words" class="section-anchor">#</a></h2>
<p>I deliberately skipped the rest of the stylesheet since I think it's not the most interesting part in my opinion. It mostly consists on setting styles for various content elements like paragraphs, lists, tables, images, titles, and so on. Plus, it's classic CSS, not really SCSS magic.</p>
<p>I think I have covered most of my Sass structure. If you feel like something could be improved or if you have any question, please be sure to drop a comment. :)</p>
</section>