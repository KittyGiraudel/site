---
title: Don't blame CSS Preprocessors because you suck
layout: post
preview: true
comments: false
---
<section>
<p>A couple of days ago, the famous french front-end developer <a href="https://twitter.com/iamvdo">Vincent De Oliveira</a> has written a blog post called <a href="http://blog.iamvdo.me/post/45259636008/pourquoi-je-nutilise-pas-les-preprocesseurs-css">Why I don't use CSS preprocessors</a> ("Pourquoi je n'utilise pas les préprocesseurs CSS"). If you can read French, or stand Google Translate, then I highly recommand you this article, full of good points and interesting opinions.</p>
<p>Please don't consider this post as an answer to Vincent's one. I just wanted to share my opinion on the topic, not to open a flame war. Especially since I like this guy. :)</p>
</section>
<section id="tldr">
<h2>Tl;dr <a href="#tldr">#</a></h2>
</section>
<section id="maintainability">
<h2>Maintainability <a href="#maintainability">#</a></h2>
<p>I think the key word here is <strong>maintainability</strong>. You will never ever reach to the same level of maintainability without a CSS preprocessor. Ever.</p>
<p class="pull-quote--right">I think the key word here is maintainability.</p>
<p>However, you might not need that level of maintainability. As <a href="https://twitter.com/kaelig">Kaelig</a> says in his article <a href="http://blog.kaelig.fr/post/24877648508/preprocesseurs-css-renoncer-par-choix-ou-par">CSS preprocessors: renounce by choice or ignorance?</a> ("Préprocesseurs CSS, renoncer par choix ou par ignorance?"): if you work on small projects or with one-shot websites, you may not need to use a preprocessor. Let's be realistic for a minute: you won't update the site everyday, if at all. If you ever happen to do, you can dig into the code without the use of a preprocessor.</p> 
<p>This makes me get to the point: <strong>I don't need a preprocessor</strong>. I say it: I don't. I'm not working on 10000-lines stylesheets. I'm not working on multiple templates websites. I'm not working on complex CSS architectures. I could do every single project I do without Sass.</p>
<p>But <strong>Sass looks better than CSS to me</strong> (at least in most cases). I like being able to use variables. I like being able to use mixins and functions. I like being able to use Compass. I like all of this stuff, even if I don't necessarily need it. It feels more normal to me.</p>
</section>
<section id="">
<h2>Quality code <a href="#">#</a></h2>
<p>Let's make things clear right now: <strong>preprocessors don't output bad code, bad developers do</strong>. CSS preprocessors -whatever the one you (don't) use- do not generate top-heavy, unwiedly, unnecessarily complicated code. This is a lie bad developers will tell you to explain the quality of their code.</p>
<p class="pull-quote--right">Preprocessors don't output bad code, bad developers do.</p>
<p>If the final stylesheet is less maintainable or heavier, or more complicated than the vanilla CSS version you had before using a preprocessor, <a href="http://pastebin.com/Jy9PqFTy">it's because you messed up</a>. Not because of Sass.</p>
<p>Vincent does an interesting comparison with PHP (HyperText Preprocessor): you can output shitty code with PHP too. Is it because of PHP? Definitely not. It's because you've messed up.</p>
</section>
<section id="">
<h2>Speed <a href="#">#</a></h2>
<p>Some people say preprocessors don't make you write CSS faster. Indeed, you won't become IronMan as soon as you run Sass, definitely not. Even if in the end, you write code slightly faster; simply by the fact you don't have to write vendor prefixes for example.</p>
<p>You're not saving much time while coding. You're saving time when it comes to maintain and update your stylesheets. It's a no brainer. </p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
</section>
