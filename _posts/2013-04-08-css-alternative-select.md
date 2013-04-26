---
title: Why a CSS alternative to &lt;select&gt; is impossible
layout: post
comments: true
summary: true
---
<section>
<p>A couple of weeks ago, I came across an article from Pepsized featuring a <a href="http://pepsized.com/css-only-alternative-to-the-select-element/">CSS-only alternative to the Select Element</a>.	Sounds nice! Especially since I recall doing some <a href="http://tympanus.net/codrops/2012/10/04/custom-drop-down-list-styling/">dropdown styling at Codrops</a>.</p>
<p>Yeah, it's very nice. Even if it's not an alternative to the Select Element. This is not possible. You cannot do a pure CSS alternative to the Select Element.</p>
<p>There is more than just a click on a button opening a list of options to the <code>&lt;select&gt;</code> element. It involves accessibility, usability, processing, shadow DOM and a lot of various options. A lot of things that CSS can't do. That <strong>CSS isn't supposed to do</strong>.</p>
<blockquote class="pull-quote--right">You can't do a CSS alternative to the Select element.</blockquote>
<p>Now don't get me wrong, the author at Pepsized did a wonderful job on this article, regarding both the design and the usability (which is far better than what I did at Codrops). (S)He is a good CSS developer, I don't even question that. But once again, (s)he didn't provide a CSS alternative to the <code>&lt;select&gt;</code> element. Let me clear things up point per point.</p>
</section>
<section id="accessibility">
<h2>Accessibility <a href="#accessibility">#</a></h2>
<p>The major concern here is <strong>accessibility</strong>. The default <code>&lt;select&gt;</code> element is completely usable either with a mouse or a keyboard, following this process:</p>
<ol>
	<li>Mouse: move your cursor over the <code>&lt;select&gt;</code> element<br>
		Keyboard: use the tab key to focus the <code>&lt;select&gt;</code> element</li>
	<li>Mouse: click on the <code>&lt;select&gt;</code> element<br>
		Keyboard: press enter</li>
	<li>Mouse: move your cursor over the desired option<br>
		Keyboard: use the top and bottom arrow keys to pick an option</li>
	<li>Mouse: click on the desired option<br>
		Keyboard: press enter</li>
</ol>
<p>While making a pure CSS dropdown easily usable with the mouse can be done by pretty much any one with some CSS knowledge, making it usable with keyboard navigation is a whole other story.</p>
<p>However, it's doable. You won't have exactly the same process as above, but you'll probably be able to pick your option with the arrow keys and such.</p>
<p>Anyway, this introduces some new behaviour (you may call this inconsistencies) for people who can't use a mouse. Yes, not having to press enter (steps 2 and 4) is probably no big deal for you and I, but for &mdash; let's say &mdash; a blind user, it may be confusing.</p>
</section>
<section id="mobile">
<h2>Mobile devices <a href="#mobile">#</a></h2>
<p>Mobile devices can become another problem with a home-made <code>&lt;select&gt;</code> element. Mobile devices often mean touch events. There is no more mouse. There is no more keyboard. Now there is a finger.</p>
<p>In most cases, making a custom dropdown accessible for mobile users will take no more than just a few lines of CSS. Basically it requires to change all the hover states by focus states to make things work.</p>
<p>But <strong>making things work is not always enough</strong>. Mobile browsers have a very efficient way to handle select dropdowns natively enabling scrolling gestures. When facing a <code>&lt;select&gt;</code> with dozens of options like a dropdown to pick your country, having a mobile-friendly UI can make the difference between a user who buy/subscribe and a user who leave.</p>
</section>
<section id="processing">
<h2>Processing <a href="#processing">#</a></h2>	
<p>In most cases, as a developer you will use a <code>&lt;select&gt;</code> element because you want your users to pick an option; option that you will want to use for your database, your email, or whatever.</p>
<p>Since the <code>&lt;select&gt;</code> element is a form element, it comes with a name attribute and the ability to send POST or GET data through a form. This means you can access the selected option by no more than <code>$_POST['name-of-select-element']</code> in PHP. With JavaScript, it will probably be something like <code>document.getElementById('name-of-select-element').value;</code>.</p>
<p>Fine. Now let's do this with CSS only. Uh-ho, not possible. If you're clever enough, you'll come up with a solution involving hidden radio inputs within your list items. Sounds fair enough; so... you end up using multiple form elements... not to use a form element. Right?</p>
<blockquote class="pull-quote--right">You end up using multiple form elements not to use a form element.</blockquote>
<p>Let's say you don't mind the extra-processing that comes with the multiple radio buttons compared to the regular <code>&lt;select&gt;</code> element... </p>
</section>
<section id="options">
<h2>Native options <a href="#options">#</a></h2>
<p>... what if you want to give your user the ability to select multiple options? Okay, you could still use checkboxes, that sounds legit.</p>
<p>Then let's talk about other options like: <code>required</code>, <code>disabled</code> and <code>autofocus</code>.</p>
<p>I can think of a workaround for <code>disabled</code> with a class on the parent element, using pointer-events to disable clicking on items. Okay.</p>
<p>If you come up with a CSS-only solution to force the user to select an option by preventing form submit and displaying a warning message instead, I'd be more than glad to hear it!</p>
<p>You could still use JavaScript. But then:</p>
<ul>
	<li>it's no more a CSS-only alternative to the <code>&lt;select&gt;</code> element</li>
	<li>it adds even more code to your page, slowing it down</li>
</ul>
</section>
<section id="Performance">
<h2>Performance <a href="#Performance">#</a></h2>
<p>Even if it's not much a concern, using a HTML/CSS "alternative" to the <code>&lt;select&gt;</code> element means using at least a dozen of DOM nodes (quickly ramping up with the number of options) and maybe about 50 lines of CSS, perhaps including some heavy CSS properties like shadows or gradients.</p>
<p>Okay, it's no big deal when you know the average page size is a little over 1.4Mb (according to <a href="http://www.httparchive.org/interesting.php#bytesperpage">HTTP Archive</a>).</p>
<p>But still, you could have used a single element (including Shadow DOM) and 0 line of CSS for a result which beats your alternative on all points except on design (and this is yet to be determined).</p>
</section>
<section id="final-words">
<h2>Be native <a href="#final-words">#</a></h2>
<p>Browser makers spend countless hours building native support for a lot of things in order to improve both user's experience and developer's life. Use these native features.</p>
<p>Please, don't screw accessibility, performance and usability for design purpose. Those things should always come first.</p>
</section>