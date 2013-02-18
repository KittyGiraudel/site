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
<p class="date">{{ page.date | date: "%d %B %Y" }}</p>

<p>I recently decided to move my website to Jekyll and to host it on GitHub Pages.</p>

<p class="note">Note: <a href="https://github.com/mojombo/jekyll">Jekyll</a> is a simple, blog aware, static site generator written on Ruby by <a href="http://tom.preston-werner.com/">Tom Preston Werner</a>, GitHub co-founder. It takes a template directory (representing the raw form of a website), runs it through Textile or Markdown and Liquid converters, and spits out a complete, static website.</p>

<p class="note">Note: GitHub Pages are public webpages freely hosted and easily published through GitHub.</p>
</section>

<section id="why">
<h2>Why Jekyll and GitHub Pages <a href="#before-jekyll" class="section-anchor">#</a></h2>

<p>There are a couple of reasons that made my take the decision to move my perfectly-working site (or kind of) to Jekyll and GitHub Pages:</p>
<ul>
	<li>No server-side language</li>
	<li>No database</li>
	<li>Markdown support</li>
	<li>Only need a text editor and Git to update</li>
	<li>Static html files on GitHub Pages are blazingly fast</li>
	<li>Public source <a href="https://github.com/HugoGiraudel/hugogiraudel.github.com">code hosted on GitHub</a></li>
	<li><a href="https://github.com/HugoGiraudel/hugogiraudel.github.com/issues">Bug tracker</a></li>	
	<li>Wanted to discover a new thing</li>
	<li>Quite simple to use in the end</li>
</ul>

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

<p>I wanted another simpler option, so I asked on Twitter. A couple of people recommanded either Jekyll or <a href="http://octopress.org/">Octopress</a>. I had already heard about it since the site redesign has been motivated by <a href="http://daverupert.com/2012/11/brander-newer/">Dave Rupert's one</a> when he moved to Jekyll.</p>

<p>Back then, I had a look at Jekyll and it looked nice but overly complicated. I'm really not that smart when you put CSS aside. But it seemed I had not much choices so I wanted to give a try.</p>

<p>I looked for tutorials to move a simple site to Jekyll and found a couple of posts explaining the whole process pretty well but the best one has to be <a href="http://www.andrewmunsell.com/tutorials/jekyll-by-example/">this one</a> from Andrew Munsell. If you can read this Andrew, thank you a billion times because I couldn't have made it without your post.</p>

<h3>The install nightmare</h3>

<p>Ironically, I think this was the hardest part. At home, I am running Mac OS X 10.6.8. When I tried installing the Jekyll gem, I had an error. Oh shit.</p>

<p><a href="http://stackoverflow.com/questions/10725767/error-installing-jekyll-native-extension-build">Thank you StarOverflow</a>. Basically, I missed some sort of component (Command Line Tool XCode or whatever) that I could download on Apple official website. Fair enough. After 15 minutes spent trying to remember my Apple ID, I finally could download this thing I install it... to realize it requires Mac OS X 10.7. Damn it.</p>

<p>It's sunday morning, I have croissants and coffee. I CAN FIGURE THIS OUT! I tried updating softwares component a couple of times to finally realize not only nothing was updated, but that it couldn't update the OS itself. </p>

<p>After a few more Google searches and mouthful of delicious croissant, I found the horrifying answer: Mac OS X 10.7 cannot be upgraded for free. It is $25. DAMN IT, I JUST WANT TO RUN JEKYLL!</p>

<p>Once again, <a href="http://stackoverflow.com/questions/10989869/how-do-i-get-ruby-set-up-in-os-x-10-6-8">thank you StackOverflow</a>. I could install some other thing from a GitHub repo that finally would get ride of the error when trying to install Jekyll. Worst part over.</p>

<h3>Make things work locally</h3>
<p>Making everything work locally was pretty easy I have to say. My previous PHP architecture was very similar to the one I use with Jekyll today regarding includes, folder structure and such.</p>

<p>It took me no more than a couple of hours to make my website run locally. Everything was not perfect (and still isn't) but it was something.</p>
</section>
<section id="github-pages">
<h2>GitHub Pages <a href="#github-pages" class="section-anchor">#</a></h2>

<p>Setting up a GitHub Pages based website couldn't be simpler. It only consists on creating a repo named this way <code>username.github.com</code>. Easy, right?</p>

<p>The best thing with GitHub Pages is it is built on Jekyll. This means you can deploy raw Jekyll source on your repo and GitHub Pages will automagically compile it through Jekyll (on their side).</p>

<p class="note">I could also push the compiled code to the repo but it means I need Jekyll everytime I want to update anything on the site. Not great, especially since I work at 4 different places.</p>

<p>From there, I only had to push the local Jekyll site to this repo and about 10 minutes later, the whole thing was hosted and available at hugogiraudel.github.com. Very simple.</p>
</section>

<section id="dns">
<h2>Redirect, DNS and all this shit <a href="#dns" class="section-anchor">#</a></h2>

<h3>Domain changes</h3>

<p>At this point, I had my site based on Jekyll running on GitHub Pages. There was (and still are) things to improve but still, things were simply working.</p>

<p>However I didn't want to use hugogiraudel.github.com as the main URL but hugogiraudel.com. Meanwhile, I had my website hosted on a OVH server, hugogiraudel.com pointing to a folder on this server.</p>

<p>Basically I had to tell the GitHub server to serve hugogiraudel.github.com content from hugogiraudel.com, and to make hugogiraudel.com redirect at hugogiraudel.github.com.</p>

<p>According to GitHub Pages doc, and a couple of posts on StackOverflow, I understood I had to put a <code>CNAME</code> file at the root of the repo directing to the top-level domain I wanted to serve from (hugogiraudel.com) and create a A record poiting to GitHub IP from my own server.</p>

<p>This has been done and followed by 12 hours of worry. My site was down and I had no idea weither or not it would get back up. Since I don't understand a thing about server stuff and DNS, I could have simply broken everything without even knowing it.</p>

<h3>Thing of old URLs!</h3>
<p>This was probably my biggest concern when I decided to change structure and host. I knew URLs were going to change and I had no idea how to make old URLs still working. Anyway I had to: there are a couple of articles that are linked to on a daily basis.</p>
</section>