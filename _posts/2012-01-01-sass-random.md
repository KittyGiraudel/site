---
title: Random function with Sass 3.3
layout: post
preview: true
comments: false
---
<section>
<p>Everything started when I was spying on the source code for Sass 3.3 for my article about the <a href="http://davidwalsh.name/future-sass">future of Sass</a> at David Walsh' Blog. I was sniffing the incoming functions when all of the sudden I came by a <code>unique-id()</code> function.</p>
<p>According to the <a href="https://github.com/nex3/sass/issues/771">issue</a> which started this idea, the <code>unique-id()</code> function should return a unique random alphanumeric identifier that could be use for whatever you like. As far as I understood the example provided by Chris Eppstein, it could be used to dynamically generated and extend a placeholder from within a mixin. Kind of complicated stuff, really.</p>
<p>Anyway, I saw this unique id thingie as an opportunity to have a random number with Sass. Why? I don't know. I leave this question to you. Maybe some day I'll find a usecase for a random number in CSS.</p>
<p class="note">Note: the code in this article has not been tested at all since it requires some Sass 3.3 functions that are not implemented yet. This is more like a proof of concept.</p>
</section>
<section id="unique-id">
<h2>About unique-id() <a href="#unique-id">#</a></h2>
<p>To understand what this is all about, you jae
</section>
<section id="rand-v1">
<h2>Rand() v1 (dirty) <a href="#rand-v1">#</a></h2>
</section>
<section id="rand-v2">
<h2>Rand() v2 (clean) <a href="#rand-v2">#</a></h2>
</section>