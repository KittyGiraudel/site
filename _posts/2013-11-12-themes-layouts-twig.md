---
title: Dealing with themes and layouts with Twig
layout: post
comments: true
preview: false
---
<section>
<p>Hey guys! This post is going to be quite different from what I usually write about since it will talk about <a href="http://twig.sensiolabs.org/">Twig</a>, the template engine used by <a href="http://symfony.com/">Symfony 2</a>. I came across a pretty complicated case at work so I thought I'd write a little something about it.</p>
<p>But let's put some context first: Twig presents itself as a <em>template engine for PHP</em>. Kind of Jekyll, but far more powerful. The basic idea is to create reusable templates also called "views" (basically HTML blocks) to avoid repeating the same code again and again.</p>
</section>
<section id="twig">
<h2>Some leveling-up about Twig <a href="#twig">#</a></h2>
<p>Since not all of you are Twig masters (neither am I though), I am going to explain a couple of things before entering the topic.</p>
<h3>Extend</h3>
<p>Twig is mostly about extending templates (<a href="http://twig.sensiolabs.org/doc/tags/extends.html"><code>@extend</code></a>). Thus we start with setting up a base template outputing some HTML (<code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code>...) and defining Twig blocks. Quick example:</p>
<pre class="language-markup"><code>&lt;!-- base.html.twig --&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;!-- whatever --&gt;&lt;/head&gt;
&lt;body&gt;
    {&#37; block header &#37;}{&#37; endblock &#37;}
    {&#37; block main   &#37;}{&#37; endblock &#37;}
    {&#37; block footer &#37;}{&#37; endblock &#37;}
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>When a second template extends from the first one, it can dump stuff into those blocks that will bubble up into the first one to finally output content. There is no maximum level of nesting for such a thing so you can do this as deep as you want. Let's continue our example:</p>
<pre class="language-markup"><code>&lt;!-- page.html.twig --&gt;
{&#37; extends 'base.html.twig' &#37;}

{&#37; block header &#37;}
    &lt;h1&gt;Title&lt;/h1&gt;
{&#37; endblock &#37;}

{&#37; block main &#37;}
    &lt;p&gt;My first page&lt;/p&gt;
{&#37; endblock &#37;}

{&#37; block footer &#37;}
    &lt;footer&gt;Credits & copyright&lt;/footer&gt;
{&#37; endblock &#37;}</code></pre>
<p>That's pretty much how you work a project with Twig.</p>
<h3>Include</h3>
<p>Now you also can also include files (<a href="http://twig.sensiolabs.org/doc/tags/include.html"><code>@include</code></a>) which work has you would expect: this is basically the <code>@include</code> from PHP. So if you have some static content, like a footer for example, you can include a partials (a bunch of HTML if you will) directly into your footer block like this:</p>
<pre class="language-markup"><code>{&#37; block footer &#37;}
    {&#37; include 'partials/footer.html.twig' &#37;}
{&#37; endblock &#37;}</code></pre>
<h3>Embed</h3>
<p>And finally, you can embed (<a href="http://twig.sensiolabs.org/doc/tags/embed.html"><code>@embed</code></a>) files which is more complex. Embeding is a mix between both extending and including. Basically it includes a template with the ability to make blocks bubbling down instead of up. We'll come back to this.</p>
</section>
<section id="problem">
<h2>The problem <a href="#problem">#</a></h2>
<p>The problem I faced at work was finding a way to manage both themes and layouts in Twig with <em>themes</em> being design schemes (mostly color-based) and <em>layouts</em> basically being the number of columns we use for the layout as well as their size.</p>
<p>So the theme is passed as a class to the body element (e.g. <code>&lt;body class="shopping"&gt;</code>), while the layout defines what kind of dom nodes / HTML classes we will use for the main content of the site.</p>
<p>We have half a dozen of themes &mdash; one per section of site &mdash; (<code>shopping</code>, <code>news</code>, <code>admin</code>, <code>regular</code>, ...) and 4 different layouts based on the 12-columns grid system from Bootstrap (<code>12</code> for a full-width one-column template, <code>9-3</code> for two columns with a 3/1 ratio, <code>8-4</code> for a two columns with a 2/1 ratio and <code>2-7-3</code> for 3-columns).</p>
<p>Back to the issue: we had to be able to define both the theme and the layout on a page per page basis. Something like this:</p>
<pre class="language-markup"><code>&lt;!-- This doesn't work. --&gt;
{&#37; extends '@layout' &#37;}
{&#37; extends '@theme' &#37;}</code></pre>
<p>Unfortunately, it's not possible to extend multiple templates in Twig (which seems obvious) so we had to find a workaround.</p>
</section>
<section id="dirty-solution">
<h2>The ultra dirty solution we didn't even try <a href="#dirty-solution">#</a></h2>
<p>One possible way to go &mdash; the one we wanted to avoid at all costs &mdash; was having either every layouts for every themes, or every themes for every layouts. Basically something like this:</p>
<ul>
<li>admin (theme)
<ul>
<li>12 (layout)</li>
<li>8-4 (layout)</li>
<li>9-3 (layout)</li>
<li>2-7-3 (layout)</li>
</ul>
</li>
<li>shopping (theme)
<ul>
<li>12 (layout)</li>
<li>8-4 (layout)</li>
<li>9-3 (layout)</li>
<li>2-7-3 (layout)</li>
</ul>
</li>
<li>...</li>
</ul>
<p>With this solution, you could do somethink like <code>{&#37; extends 'shopping/12' &#37;}</code>. Or the other way around:</p>
<ul>
<li>12 (layout)</li>
<ul>
<li>shopping (theme)</li>
<li>news (theme)</li>
<li>...</li>
</ul>
</li>
<li>12 (layout)</li>
<ul>
<li>shopping (theme)</li>
<li>news (theme)</li>
<li>...</li>
</ul>
</li>
<li>...</li>
</ul>
<p>With this solution, you could do somethink like <code>{&#37; extends '12/shopping' &#37;}</code>.</p>
<p>Both sucks. Really bad. It is not only very ugly but also a nightmare to maintain. Guys, don't do this. This is not a good idea. Especially since Twig is the most powerful template engine out there: there is a better way.</p>
</section>
<section id="solution">
<h2>A clean solution <a href="#solution">#</a></h2>
<p>After some searches, we finally found a way to do what we wanted with the <code>embed</code> directive. As I said earlier, embed really comes in handy when trying to achieve complicated systems like this. From the official Twig documentation:</p>
<blockquote class="quote">The embed tag combines the behaviour of include and extends. It allows you to include another template's contents, just like include does. But it also allows you to override any block defined inside the included template, like when extending a template.</blockquote>
<p>In the end, we need 4 files to create a page:</p>
<ul>
<li><code>base.html.twig</code> which defines the page core and the major blocks</li>
<li><code>{theme}.html.twig</code> with <code>{theme}</code> being the name of the theme we want (e.g. <code>shopping</code>) which extends <code>base.html.twig</code> and defines the class for the body element (and if necessary some other theme-specific stuff)</li>
<li><code>{layout}.html.twig</code> with <code>{layout}</code> being the layout we want (e.g. <code>9-3</code>), defining content blocks</li>
<li><code>page.html.twig</code> which is the actual page, embeding the layout file in the main content to override its blocks</li>
</ul>
<p>This may sound a bit complicated so why not doing this step by step, shall we?</p>
<h3>Setting up the base file</h3>
<p>As seen previously, the base file creates the HTML root document, the major HTML tags and defines the major Twig blocks, especially the one used to define the HTML class on the body element.</p>
<pre class="language-markup"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;!-- whatever --&gt;&lt;/head&gt;
&lt;body class="{&#37; block theme &#37;}default{&#37; endblock &#37;}"&gt;
    {&#37; block layout &#37;}{&#37; endblock &#37;}
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3>Defining a theme</h3>
<p>Next, we need to define a theme. A theme file will directly extends the base file, and will be extended by the page file. The content of the theme file is very light. Let's say we have a <em>shopping</em> theme; so we have the <code>shopping.html.twig</code> file:</p>
<pre><code>{&#37; extends 'base.html.twig' &#37;}

{&#37; block theme 'shopping' &#37;}</code></pre>
<p>The last line of this code example may look a little weird to you: it is the short way for <code>{&#37; block theme &#37;}shopping{&#37; endblock &#37;}</code>. I like this way better when the content block is like a word or two without any HTML.</p>
<p>Anyway, when using this theme, the <code>theme</code> block defined in <code>base.html.twig</code> will be filled with <code>shopping</code>, setting a <code>shopping</code> class to the body element.</p>
<h3>Defining a layout</h3>
<p>Let's say our page will use the shopping theme we just created with a 2-columns layout with a 2/1 ratio. Right? As I said previously, I like to call my themes the way they work with columns so in this case: <code>9-3.html.twig</code>.</p>
<pre class="language-markup"><code>&lt;div class="wrapper"&gt;
    &lt;div class="col-md-9  content"&gt;
        {&#37; block content &#37;}{&#37; endblock &#37;}
    &lt;/div&gt;
    &lt;div class="col-md-3  sidebar"&gt;
        {&#37; block sidebar &#37;}{&#37; endblock &#37;}
    &lt;/div&gt;
&lt;/div&gt;</code></pre>
<h3>Creating the page</h3>
<p>We only need the last piece of the puzzle: the page file. In this file, not much to do except dumping our content in the accurate blocks:</p>
<pre class="language-markup"><code>{&#37; extends 'shopping.html.twig' &#37;}

&lt;!-- Filling the 'layout' block defined in base template --&gt;
{&#37; block layout &#37;}
    {&#37; embed '9-3.html.twig' &#37;}
        {&#37; block content &#37;}
            <p>My awesome content</p>
        {&#37; endblock %}
        {&#37; block sidebar &#37;}
            <p>My sidebar content</p>
        {&#37; endblock &#37;}
    {&#37; endembed &#37;}
{&#37; endblock &#37;}
</code></pre>
<h3>Rendered HTML</h3>
<pre class="language-markup"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;!-- whatever --&gt;&lt;/head&gt;
&lt;body class="shopping"&gt;
    &lt;div class="col-md-9  content"&gt;
        <p>My awesome content</p>
    &lt;/div&gt;
    &lt;div class="col-md-3  sidebar"&gt;
        <p>My sidebar content</p>
    &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Voila! Pretty neat, right?</p>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words">#</a></h2>
<p>That's pretty much it. From there, dealing with color schemes is quite simple since you have a specific class on the body element. To ease the pain of working out design schemes on the CSS-side, I use a couple of Sass mixins and a bunch of Sass variables. It makes everything fits in a couple of lines instead of large amount of vanilla CSS.</p>
<p>Long story short: Twig is really powerful and so is the embed directive.</p>
</section>
