---
title: Themes and layouts with Twig
layout: post
comments: false
preview: true
---
<section>
<p>Hey guys! This post is going to be quite different from what I usually write about since it will talk about <a href="http://twig.sensiolabs.org/">Twig</a>, the templat engine used by <a href="http://symfony.com/">Symfony 2</a>. I came across a pretty complicated case at work so I thought I'd write a little something about it.</p>
<p>But let's put some context first: Twig presents itself as a <em>template engine for PHP</em>. Kind of Jekyll, but far more powerful. The basic idea is to create reusable templates also called "views" (basically HTML blocks) to avoid repeating the same code again and again.</p>
<p>For the rest of the article, I'll assume you have some solid knowledge in template engine stuff. If you don't, well, you can still read but that may be sound a bit rough to you!</p>
</section>
<section id="problem">
<h2>The problem <a href="#problem">#</a></h2>
<p>The problem I faced at work was find a way to manage both themes and layouts in Twig.</p>
</section>