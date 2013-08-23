---
published: true
layout: post
preview: false
comments: true
guest: "Hugo Darby-Brown"
---

<section>
<p class="explanation">The following is a guest post by <a href="http://darbybrown.com/">Hugo Darby-Brown</a>, a talented front-end developer. I'm very glad to have him writing here today about a menu concept he came up with!</p>
<p>Before I start off I'd like to say that this is more of <strong>a proof of concept</strong>, than a method that I'd recommend using on your next project.  This menu uses the WebKit-specific CSS declaration <code>overflow-scrolling: touch</code> so support is a little flakey on older devices, but there are a few polyfills, which I will cover later (should you feel the urge to use this menu).</p>
</section>
<section id="setting-out">
<h2>Setting Out <a href="#setting-out">#</a></h2>
<p>I wanted to create a horizontal scrolling navigation, similar to that of the iOS taskbar. Lots of responsive menu's take the approach of displaying list items vertically on small screens, but I wanted to play with the idea of having menu items off the screen and swiping to reveal them.</p>
<figure class="figure">
<img src="http://darbybrown.com/img/scroll-overflow-menu.jpg" alt="" />
<figcaption>The scroll-overflow menu by Hugo</figcaption>
</figure>
</section>
<section id="basic-effect">
<h2>The Basic Effect <a href="#basic-effect">#</a></h2>
<p>I wanted the HTML markup to be as clean as possible, this I guess it's pretty self explanatory.</p>
<pre class="language-markup"><code>&lt;header>
  &lt;nav role='navigation'>
    &lt;ul>
      &lt;li>&lt;a href="#">Home&lt;/a>&lt;/li>
      &lt;li>&lt;a href="#">About&lt;/a>&lt;/li>
      &lt;li>&lt;a href="#">Clients&lt;/a>&lt;/li>
      &lt;li>&lt;a href="#">Contact&lt;/a>&lt;/li>
    &lt;/ul>
  &lt;/nav>
  &lt;a href="#" class="nav-toggle">Menu&lt;/a>
&lt;/header></code></pre>
<p>This is the CSS that makes the effect happen. I've stripped out all the styling to highlight the key components that make the effect work.</p>
<pre class="language-css"><code>nav {
  overflow-x: scroll; /* 1 */
  -webkit-overflow-scrolling: touch; /* 2 */
}

ul {
  text-align: justify; /* 3 */
  width: 30em; /* 4 */
}


ul:after { /* 5 */
  content: '';
  display: inline-block;
  width: 100%;
}

li {
  display: inline-block; /* 6 */
}</code></pre>
<p>Okay, so what's going on here? In essence we're creating a navigation that is too large for the screen. We set the overflow to <code>scroll</code>, and the overflow-scroll type to <code>touch</code> to allow for momentum scrolling. Explained in a bit more detail below:</p>
<ol>
<li>Setting <code>auto</code> will work on some devices, but set this to <code>scroll</code> just to be sure.</li>
<li>This the <em>magic</em> property that enables the <em>native feel</em> scrolling.</li>
<li>Setting this to <code>justify</code> creates equally spaced <code>li</code>'s which takes the headache of working out margins.</li>
<li>You must set the width to a value larger than the sum of all the <code>li</code>'s width.</li>
<li>This is <code>text-align: justify</code>'s version of a clearfix.</li>
<li>This must also be set for the equal spacing to work.</li>
</ol>
</section>
<section id="toggling">
<h2>Toggling The Menu <a href="#toggling">#</a></h2>
<p>We're almost done, all we have to do is to deal with the toggling. We could use a CSS hack for this but this is not the point so we'll just use a tiny bit of JavaScript.</p>
<p>So we set the <code>max-height</code> of the navigation to <code>0</code> in order to initially hide it, and add a <code>transition</code> so when we toggle the class <code>.show</code> the menu will appear to slide in from the top, pretty basic mobile menu stuff. </p>
<pre class="language-css"><code>nav {	
	max-height: 0;
	transition: .6s ease-in-out;
}

.show {
	max-height: 15em;
}</code></pre>
<p>Throw in some JS to toggle the class, and you've got yourself a basic slide down mobile menu.</p>
<pre class="language-javascript"><code>// jQuery version
$(".nav-toggle").on('click', function (e) {
  $("nav").toggleClass("show");
  e.preventDefault();
});

// Vanilla JS version
document.querySelector('.nav-toggle').onclick = function (e) {
  var nav = document.querySelector('nav');
  nav.classList.toggle('show');
  e.preventDefault();
}</code></pre>
</section>
<section id="larger-devices">
<h2>What about larger devices? <a href="#larger-devices">#</a></h2>
<p>A mobile only menu isn't much use these days is it? So using a few <code>min-width</code> media queries we'll turn this menu into a responsive mobile first menu.</p>
<pre class="language-css"><code>@media (min-width: 31.25em) {
  nav {
    max-height: none; /* reset the max-height */
    overflow: hidden; /* this prevents the scroll bar showing on large devices */
  }

  ul {
    width: 100%; 
  }

  .nav-toggle {
    display: none; 
  }
}</code></pre>
</section>
<section id="support">
<h2>Support and polyfills <a href="#support">#</a></h2>
<p>The support is really not that bad, without being awesome either. As far as I know, it looks like this:</p>
<ul>
<li>iOS 5+ </li>
<li>Android 3.0</li>
<li>Blackberry 6+</li>
<li>Windows Phone (IE10) supports momentum scrolling natively</li>
</ul>
<p>For unsupported browsers, there are a few of polyfills that can help you, should you want to use it:</p>
<ul>
<li><a href="http://cubiq.org/iscroll-4">iScroll</a></li>
<li><a href="http://filamentgroup.github.io/Overthrow/">Overthrow</a></li>
<li><a href="https://github.com/joehewitt/scrollability/">Scrollability</a></li>
</ul>
</section>
<section id="final-thoughts">
<h2>Final thoughts <a href="#final-thoughts">#</a></h2>
<p>I think you'll see a lot more menu's taking a horizontal approach in the future, but unfortunately Android 2.X still makes up for a 1/3 of market share of all Android devices, so until that reduces significantly I wouldn't use this in any serious projects.</p>
<p>I would love to hear your thoughts on <code>-webkit-overflow-scrolling: touch;</code> and the future possibilities. </p>
<p>I would usually embed the demo but, unfortunately iframes don't play well with <code>overflow-scrolling:touch</code>, so it's best if you directly check <a href="http://darbybrown.com/menu">this link</a> with your phone. You could also could play around the code at <a href="http://codepen.io/hugo/full/pwsLj">CodePen</a> (caution! iframes, doesn't work great on some mobile browsers) or by <a href="http://darbybrown.com/menu/download.zip" target="_blank">downloading the files</a>!</p>
<p>Thanks for reading! If you think of anything to improve this menu concept, feel free to share. :)</p>
<blockquote class="quote"><img src="https://si0.twimg.com/profile_images/378800000254019863/1b79cd519877a4900d633354e161f095.jpeg" alt="Photo Hugo Darby Brown" class="pull-image--left">
<p>Hugo Darby-Brown is both a designer and a developer from UK, passionate with front-end technologies especially CSS. You can catch him on <a href="http://twitter.com/darbybrown">Twitter</a> or on his brand new <a href="http://darbybrown.com">site</a>.</p></blockquote>
</section>