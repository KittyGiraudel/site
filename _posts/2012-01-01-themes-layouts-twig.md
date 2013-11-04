---
title: Themes and layouts with Twig
layout: post
comments: false
preview: true
---
<section>
<p>Hey guys! This post is going to be quite different from what I usually write about since it will talk about <a href="http://twig.sensiolabs.org/">Twig</a>, the templat engine used by <a href="http://symfony.com/">Symfony 2</a>. I came across a pretty complicated case at work so I thought I'd write a little something about it.</p>
<p>But let's put some context first: Twig presents itself as a <em>template engine for PHP</em>. Kind of Jekyll, but far more powerful. The basic idea is to create reusable templates also called "views" (basically HTML blocks) to avoid repeating the same code again and again.</p>
</section>
<section id="twig">
<h2>Some leveling-up about Twig <a href="#twig">#</a></h2>
<p>Since not all of you are Twig masters, I'm going to explain a couple of things before entering the topic.</p>
<p>Twig is mostly about extending templates (@extend), kind of like extends work in Sass. thus, we start with defining a base template outputing some HTML (<code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code>...) and defining Twig blocks. This is a Twig block:</p>
<pre><code>{&#37; block header &#37;}{&#37; endblock &#37;}</code></pre>
<p>When a second template extends from the first one, it can dump stuff into this block that will bubble up into the first one to finally output content. There is no maximum level of nesting for such a thing so you can do this as deep as you want.</p>
<p>You can also include files (@include) which work has you would expect: this is basically the <code>@include</code> from PHP. And finally, you can embed (@embed) files which is more complex. Embeding is a mix between both extending and including. Basically it includes a template with the ability to make blocks bubbling down instead of up. We'll come back to this.</p>
</section>
<section id="problem">
<h2>The problem <a href="#problem">#</a></h2>
<p>The problem I faced at work was find a way to manage both themes and layouts in Twig with <em>themes</em> being design schemes (mostly color-based) and layouts basically being the number of columns we use for the layout (1, 2 or 3). We have half a dozen of themes &mdash; one per section of site &mdash; (shopping, news, admin, regular, ...) and as I said above, 3 different layouts (respectively called "1-1" for one-column, "2-1" for two columns, "1-2-1" for three columns; don't ask me why).</p>
<p>We had to be able to define both the theme and the layout on a page per page basis. Something like this:</p>
<pre><code>{&#37; extends '@layout' &#37;}
{&#37; extends '@theme' &#37;}</code></pre>
<p>Unfortunately, it's not possible to extend multiple templates in Twig (which seems obvious) so we had to find a workaround.</p>
</section>
