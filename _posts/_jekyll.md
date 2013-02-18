---
title: Moving to Jekyll
layout: post
---

Moving to Jekyll
	Before Jekyll
		Look 'ma, no CMS
		Oh god... why?
	Here comes Jekyll
		The install nightmare
		Make things work locally
	GitHub Pages
		Set up the repo
	Redirect, DNS and all this shit

<section>
<h1>{{ page.title }}</h1>
<p class="date">{{ page.date | date: "%d %B %Y" }}, <a href="http://hugogiraudel.com/blog/less-to-sass.html#disqus_thread" class='comment-count'></a></p>

<p>I recently decided to move to Jekyll as a support for my site. To understand why I took this decision, I think it is important to understand what I have been through with the site since the launch (early november 2012).</p>
</section>

<section id="before-jekyll">
<h2>Before Jekyll <a href="#before-jekyll" class="section-anchor">#</a></h2>

<h3>Look 'ma, no CMS</h3>
<p>When I launched the new version of the site last november, I wanted things to be as simple as possible. No complicated Rube Goldberg machine, no heavy CMS, none of this stuff.</p>

<p>When I wanted to release an article, this what I did:</p>
<ol>
	<li>Create a new .html file</li>
	<li>Write the article (+head, header, sidebar, footer, etc.)</li>
	<li>Push it with FTP client</li>
	<li>Add a new entry on the home page</li>
	<li>Add a new entry in the RSS feed</li>
</ol>

<p>Everything was handled manually and I was pretty happy back then.</p>

<h3>Oh god... why?</h3>

<p>But eventually I wanted to make things work a little better by themselves. Especially when it came to file includes. Every time I had to edit a single comma in the head/header/sidebar/footer/foot, I had to open all the files all over again to fix it. YAAAAAAAAY!</p>

<p>So I tried to make things better. I turned everything to PHP and used <code>include()</code> for common parts through all pages. It was way better. But once again I wanted to push things further.</p>

<p>I created a PHP array which was kind of a database to me. It handled both the index page and the RSS feed, and allowed me to quickly show/hide an article from the site. Here is what it looked like:</p>

<pre class="language-javascript"><code>$articles = array(
	array(
		title => "Article title",
		desc => "A little article description",
		url => "/blog/url-of-the-article",
		codrops => false,
		guest => false,
		status => true 
	),
	...
	array()
);</code></pre>

<p>It wasn't bad at all but still wasn't enough. I started wondering weither or not I should get back to a real CMS like WordPress. I knew it would please me once everything would have been settled, but I had to work for weeks to get there. I knew moving to WordPress would have been very complicated.</p>
</section>

<section id="jekyll">
<h2>Here comes Jekyll <a href="#jekyll" class="section-anchor">#</a></h2>

<p>I wanted another simpler option, so I asked on Twitter. A couple of people recommanded either <a href="https://github.com/mojombo/jekyll">Jekyll</a> or <a href="http://octopress.org/">Octopress</a>. I had already heard about it since the site redesign has been motivated by <a href="http://daverupert.com/2012/11/brander-newer/">Dave Rupert's one</a> when he moved to Jekyll.</p>

<p>Back then, I had a look at Jekyll and it looked nice but overly complicated. I'm really not that smart when you put CSS aside. But it seemed I had not much choices so I wanted to give a try.</p>

<p>I looked for tutorials to move a simple site to Jekyll and found a couple of posts explaining the whole process pretty well but the best one has to be <a href="http://www.andrewmunsell.com/tutorials/jekyll-by-example/">this one</a> from Andrew Munsell. If you can read this Andrew, thank you a billion times because I couldn't have made it without your post.</p>

<p>I read the whole post twice or maybe more on saturday night, then looked for even more resources on the porting. I was so excited to try this, I could barely sleep. Then the next day, I woke up early to get started.</p>

<h3>The install nightmare</h3>

<p>Ironically, I think this was the hardest part. At home, I am running Mac OS X 10.6.8. When I tried installing the Jekyll gem, I had an error. Oh shit.</p>

<p><a href="http://stackoverflow.com/questions/10725767/error-installing-jekyll-native-extension-build">Thank you StarOverflow</a>. Basically, I missed some sort of component (Command Line Tool XCode or whatever) that I could download on Apple official website. Fair enough. After 15 minutes spent trying to remember my Apple ID, I finally could download this thing I install it... to realize it requires Mac OS X 10.7. Damn it.</p>

<p>It's sunday morning, I have croissants and coffee. I CAN FIGURE THIS OUT! I tried updating softwares component a couple of times to finally realize not only nothing was updated, but that it couldn't update the OS itself. </p>

<p>After a few more Google searches and mouthful of delicious croissant, I found the horrifying answer: Mac OS X 10.7 cannot be upgraded for free. It is $25. DAMN IT, I JUST WANT TO RUN JEKYLL!</p>

<p>Once again, <a href="http://stackoverflow.com/questions/10989869/how-do-i-get-ruby-set-up-in-os-x-10-6-8">thank you StackOverflow</a>. I could install some other thing from a GitHub repo that finally would get ride of the error when trying to install Jekyll. Worst part over.</p>

<h3>Make things work locally</h3>

</section>