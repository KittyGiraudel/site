---
title: "Introducing Countdown.js"
layout: post
comments: true
preview: false
codepen: true
---
<section>
<p>Hey guys! Just a quick article to introduce <a href="https://github.com/HugoGiraudel/Countdown.js">Countdown.js</a>, a little script I recently made. During the last weeks, I've been practicing with JavaScript. It has been on <a href="http://hugogiraudel.com/2013/05/13/things-to-do-2013/">my wishlist for 2013</a> and I'm glad that I could made some progress with it.</p>
<p>In order to start making clean scripts and not poorly designed pieces of crappy jQuery dumped in the global object, I have revisited <a href="http://codepen.io/HugoGiraudel/pen/jtJrq">an old countdown script</a> I made a while back with the <a href="http://css-tricks.com/how-do-you-structure-javascript-the-module-pattern-edition/">object literal pattern</a>.</p>
</section>
<section id="why-another-one">
<h2>Why another countdown script? <a href="#why-another-one">#</a></h2>
<p>There are like a billion scripts for countdowns, timers and clocks made of JavaScript. That's like the "hello world!" of JS scripts so why making another one? Everything has been done yet!</p>
<p>Well, for one it was mostly about practicing. Making a timer script is something quite simple yet there is often lot of room for improvements. It turns out to be quite a nice playground to work in. </p>
<p>Secondly, I needed a script able to display a countdown in the way I like and not only <code>hh:mm:ss</code>. I wanted to be able to display a sentence like <code>There are still X days, Y hours and Z minutes left</code> or whatever. And since I didn't know any script that allowed the use of patterns in a string (<code>{days}</code>, <code>{years}</code>...), I started building one.</p>
<p>It worked pretty well and the code was clean enough so that I wasn't ashamed to release it on CodePen in early September. But I wanted to try something else than the litteral object pattern.</p>
<p>As good as this pattern can be, it becomes highly annoying when you have to deal with multiple occurrences of your widget on the same page. For some things, that's not a problem at all. But you could definitely come with the need to display multiple timers/countdowns on the same page so I needed something moar.</p>
<p>So here comes <a href="http://tobyho.com/2010/11/22/javascript-constructors-and/">Object Oriented JavaScript</a> in all its glory!</p>
</section>
<section id="how-to">
<h2>How to <a href="#how-to">#</a></h2>
<p>Well, obviously you need to include the script in your page. But I made it pretty tiny plus it doesn't have any requirement! It's under 2Kb minified (which is about ~1.3Kb once gzipped).</p>
<pre class="language-markup"><code>&lt;script src="js/countdown.js">&lt;/script></code></pre>
<p>Then using the countdown is as easy as instanciating the <code>Countdown</code> class:</p>
<pre class="language-javascript"><code>var countdown = new Countdown();</code></pre>
<p>This creates a new instance with all defaults values but you can pass quite a few options:</p>
<h3 style="text-transform: initial;"><code>selector</code></h3>
<p>Default: <code>.timer</code></p>
<p>The selector you want to inject Countdown into. It should be a valid string for <code>document.querySelector()</code>.</p>
<h3 style="text-transform: initial;"><code>dateStart</code></h3>
<p>Default: <code>new Date()</code> (now)</p>
<p>The date to start the countdown to. It should be a valid instance of class <code>Date</code></p>
<h3 style="text-transform: initial;"><code>dateEnd</code></h3>
<p>Default: <code>new Date(new Date().getTime() + (24 * 60 * 60 * 1000))</code> (tomorrow)</p>
<p>The date to end the countdown to. It should be a valid instance of class <code>Date</code></p>
<h3 style="text-transform: initial;"><code>msgBefore</code></h3>
<p>Default: <code>Be ready!</code></p>
<p>The message to display before reaching <code>dateStart</code></p>
<h3 style="text-transform: initial;"><code>msgAfter</code></h3>
<p>Default: <code>It's over, sorry folks!</code></p>
<p>The message to display once reaching <code>dateEnd</code></p>
<h3 style="text-transform: initial;"><code>msgPattern</code></h3>
<p>Default: <code>{days} days, {hours} hours, {minutes} minutes and {seconds} seconds left</code></p>
<p>The message to display during the countdown where values between braces get replaced by actual numeric values. The possible patterns are:</p>
<ul>
<li><code>{years}</code></li>
<li><code>{months}</code></li>
<li><code>{weeks}</code></li>
<li><code>{days}</code></li>
<li><code>{hours}</code></li>
<li><code>{minutes}</code></li>
<li><code>{seconds}</code></li>
</ul>
<h3 style="text-transform: initial;"><code>onStart</code></h3>
<p>Default: <code>null</code></p>
<p>The function to run whenever the countdown starts.</p>
<h3 style="text-transform: initial;"><code>onEnd</code></h3>
<p>Default: <code>null</code></p>
<p>The function to run whenever the countdown stops.</p>
<h3>Example</h3>
<pre class="language-javascript"><code>var countdown = new Countdown({
    selector: '#timer',
    msgBefore: "Will start at Christmas!",
    msgAfter: "Happy new year folks!",
    msgPattern: "{days} days, {hours} hours and {minutes} minutes before new year!",
    dateStart: new Date('2013/12/25 12:00'),
    dateEnd: new Date('Jan 1, 2014 12:00'),
    onStart: function() {
    	console.log('Merry Christmas!');
    },
    onEnd: function() {
    	console.log('Happy New Year!');
    }
});</code></pre>
</section>
<section id="pushing-things-further">
<h2>Pushing things further <a href="#pushing-things-further">#</a></h2>
<h3>Custom events</h3>
<p>The script doesn't use jQuery at all, mostly because there is no need for such a library for this. However if you happen to use jQuery in your project, you'll be glad to know the Countdown throws custom events on the element you're binding the countdown to.</p>
<p>As of today, two events are being fired: <code>countdownStart</code> and <code>countdownEnd</code>. You can use them as follow:</p>
<pre class="language-javascript"><code>var countdown = new Countdown({
	selector: '.timer'
});

$('.timer').on('countdownStart', function() {
	console.log('The countdown has been started.');
});

$('.timer').on('countdownEnd', function() {
	console.log('The countdown has reached 0.');
});
</code></pre>
<p>Pretty neat, right?</p>
<h3>Validating code</h3>
<p>My brother <a href="https://twitter.com/l_giraudel">Loïc</a> helped me pushing things further by adding a couple of things to the project on GitHub:</p>
<ul>
<li><a href="http://www.jshint.com/">JSHint</a> tests to check JavaScript code quality</li>
<li><a href="http://pivotal.github.io/jasmine/">Jasmine</a> tests to make sure the script does what it's supposed to do</li>
<li><a href="http://gruntjs.com/">Grunt</a> to automate building process (also thanks to <a href="https://twitter.com/_agtlucas">Lucas Churchill</a> for this)</li>
</ul>
<p>Thanks bro! Anyway, I'm proud to tell this script as passed strict JSHint validations and Jasmine tests! Hurray!</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>That's all folks! I hope you like this script and if you find anything worth mentioning, please be sure to shoot in the comments or directly on the <a href="https://github.com/HugoGiraudel/Countdown.js">GitHub repo</a>.</p>
<p>Oh and if you only want to hack around the code, check this pen:</p>
<p data-height="300" data-theme-id="0" data-slug-hash="vCyJq" data-user="HugoGiraudel" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/HugoGiraudel/pen/vCyJq'>Object-oriented JS Countdown Class</a> by Hugo Giraudel (<a href='http://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='http://codepen.io'>CodePen</a></p>
</section>
