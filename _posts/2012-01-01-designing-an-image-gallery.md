---
title: "Designing an image gallery"
layout: post
comments: false
preview: true
---
<section>
<p>Hey guys! I recently had the opportunity to work on a cool little project I'd like to talk about: an advanced image gallery with some really cool features. Indeed, I've been asked to design and develop the site of Alexandra Lucas to promote her work as a French photographer. Since I'm a big fan of her work, I accepted and it turned out to be quite fun to work on this project.</p>
<p>Let's say things straight: I'd never have the opportunity to work on an image gallery before. Actually I did but back then I didn't give a shit about performance, responsive design, high-density displays and all the topics cool kids always talk about. So this time I've been faced with some difficulties I had not encountered before; meaning I had to solve them by myself.</p>
</section>
<section id="layout">
<h2>Working on the layout <a href="#layout">#</a></h2>
<p>The main content of the site is photographs. The goal is to show them. Alexandra wanted something "Flickr-like". Some sort of wall of photos that automagically adapt to the size of your screen. Kind of a cool layout, really.</p>
<p>At first I thought about doing it myself and then... </p>
<img src="/images/design-an-image-gallery__how-about-no-bear.jpg" alt="Coding a responsive image gallery by hand? What about no!" />
<p>It would have been a pain in the ass to work out such a "complicated" layout so I thought about Masonry but that's kind of old school, right? In the end, I went with <a href='https://github.com/desandro/isotope'>Isotope</a> for layouting the items.</p>
<blockquote class="pull-quote--right">Isotope is the best JavaScript plugin I ever worked with.</blockquote>
<p>Isotope has to be the best JavaScript plugin I ever worked with. Developed by David Desandro, <strong>you can think of it as <em>Masonry 2.0</em></strong>. It makes complicated box-based layouts fully customizable and above all <strong>easy</strong>.</p>
<p>The idea is quite simple: you define a container that will draw boundaries for the layout and Isotope will move all its child elements according to the available room. What is really nice is it takes advantage of hardware accelerated CSS transforms (translate) if the browser support them (else it falls back on offsets).</p>
<p>Anyway, I wanted to give some emphasis to the author content: her picture and her name, a short description and one or two ways to contact her. I first tried to include this as if it was a picture, in the layout but it looked kind of crowded. Instead, I decided to take a whole column to do this. Not only it makes this content more valuable but it also gives the page the space it needs to look nice.</p>
<p>While the sidebar is floated left, the pictures are all wrapped in a regular unordered list which is floated left as well. Each image is in a <code>figure</code> element to be as semantic as possible.</p>
</section>
<section id="features">
<h2>Building features over the layout <a href="#features">#</a></h2>
<p>We needed two major features for this image gallery:</p>
<ul>
	<li>being able to filter images by tags</li>
	<li>display a scaled up image when clicking it</li>
</ul>
<p>The first one was pretty easy to do since Isotope comes with a built-in way to filter and sort items. In the documentation, they recommand using a class as a tag and apply it to all elements you want to assign this tag to. Then you create a little list with a jQuery selector as a <code>data-filter</code> attribute (like <code>.tag</code>). When you click on an element of this list, the plugin parses this data-attribute and displays nothing but the items matching the given selector.</p>
<p>I didn't want to add classes for this so I added a <code>data-album</code> attribute to every item and I pass it the name of the album the image belongs to. Then, I give something like this to the <code>data-filter</code> attribute of the filter list: <code>[data-album*='album-name']</code>. Easy peasy!</p>
<p>Regarding the second feature, I basically needed a little lightbox thingie to display an image in fullsize when clicked. I could have developed one but since I'm not a JavaScript ninja, I would probably ended with a code that could be improved. So I decided to rely on a built-in solution; I wanted something which is both nice and efficient so I went with <a href="http://lab.hakim.se/avgrund/">Avgrund</a> from Hakim El Hattab.</p>
<p>Avrgrund is a very lightweight modal plugin that does exactly what I want: open a modal on click, close it with a close button or the ESC key or clicking out of the lightbox.</p>
</section>
<section id="responsive">
<h2>Doing something for small devices <a href="#responsive">#</a></h2>
<p>Of course, we wanted the site to look acceptable (if not good!) on small devices. I wasn't sure about the way to display this photo gallery on mobile so I opted for the easy solution: put everything into one column. I'll try to think of something better for a future version.</p>
<p>Thankfully, Isotope handled almost all the work for me: when there is no more room for two columns, it wraps everything into a single one. I only had to remove floats from my two main containers, tweak a couple of things and it was okay.</p>
<p>When you load the page on your phone, you'll see nothing but the author information, starting with her picture. You get to read the tiny description, then if you scroll there are photos. I think it's nice this way; it kind of reproduces the <em>"Hi, I'm X. Here is my work"</em> social flow.</p>
<p>Regarding the modal, I completely removed it at first then I tweaked it on small screens so it takes almost the full viewport (leaving a small gap on each side). I'm not sure it is the best thing to do especially since clicking (tapping) an image makes no sense on small screen since it won't enlarge it at all. We'll see after some tests.</p>
</section>
<section id="high-density-displays">
<h2>Dealing with high density displays <a href="#high-density-displays">#</a></h2>
<p>Let me tell you this: dealing with retina displays is a pain in the ass. God, this is so annoying. I don't even know why we came to have such a thing... Did we really need it? In any case, this "feature" involves a lot of things like:</p>
<ul>
	<li>having to deal more files for every image,</li>
	<li>having to deal with big files that can be heavy,</li>
	<li>having to deal with more CSS and/or JavaScript to handle convertion between retina and not-retina.</li>
</ul>
<p>There are quite a few ways to handle graphics on retina displays, most of them include getting rid off images when possible by using SVG, CSS, fonts, Canvas... When it comes to real images, the number of solutions get lower: replace with CSS, replace with JavaScript.</p>
<p>CSS image replacement within @media blocks can work great... if you deal with background-images. It is even simpler with a preprocessor thanks to clever mixins (<a href="https://github.com/kaelig/hidpi">HiDPI</a> for Sass, <a href="https://github.com/imulus/retinajs/blob/master/src/retina.less">Retina.less</a> for LESS). But when you only have <code>img</code> tags, you can't do it with CSS only.</p>
<p>So you start looking for a JavaScript solution and hopefully you find <a href="http://retinajs.com/">RetinaJS</a> which is a great little script to handle high-density displays image convertion.</p>
<p>Basically, the script parses all your image tags, make an AJAX request on your server to check whether there is a file with the same name and a <code>@2x</code> appended right before the extension and if there is it swaps the current src with the one it found. All of this only if you are using a retina display obviously.</p>
<p>So I guess it is not that bad since this solution handles almost everything for us, but really. Does it worth it? Now we have to create like 2 or 3 files for each image so they can look good everywhere depending on the device's capacities. It sucks.</p>
<blockquote class="pull-quote--right">Dealing with retina displays is a pain in the ass.</blockquote>
</section>
<section id="performance">
<h2>Think (and do) about performance <a href="#performance">#</a></h2>
<p>I think this is what took me the most time in the entire project even if I have a decent knowledge of front-end performance (without being an expert).</p>
<p>Of course I minified my stylesheets (with Sass) and my JS scripts (with <a href="http://refresh-sf.com/yui/">YUI Compressor</a>). I set up Gzip with <code>.htaccess</code> along with some cache stuff. I even added a DNS prefect for Google Fonts. And even if all this stuff is really nice, the most important thing to optimize here is... images.</p>
<p>When I first set up the layout with images and all, I used really big pcitures like 1600*1059px and I was like <em>"I resize them automagically with CSS"</em>. Sure. And the page weighed about 35Mb. Ouch.</p>
<p>I quickly understood I had to handle 2 files for each image: one for the thumbnail (400*266) and a bigger one for when you click on it (800+). This is what I did. I also smushed all images to remove unnecessary meta data. The page went down to 750Kb. Not bad, right? Still not good enough though, especially for a small device on a crappy 3D connection.</p>
<p>Next step was to only load images that are actually displayed on the screen. This is called <em>lazy load</em>. Thankfully, I found an amazing <a href="http://www.appelsiini.net/projects/lazyload">JavaScript plugin doing this</a>. All I had to do was turning my markup into something like this:</p>
<pre class="language-markup"><code>
&lt;li class='gallery__item'&gt;
	&lt;figure&gt;
		&lt;img class='gallery__image'
				src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
				data-original="images/filename.jpg" 
				alt="Alt text" 
				width="400" 
				height="266" /&gt;
	&lt;/figure&gt;
&lt;/li&gt;
</code></pre>
<p>As you can see, the image source is a 1*1px blank GIF while the actual source lies in the <code>data-original</code> attribute. Then the LazyLoad script checks all images to see if they are currently displayed or not; if they are, it swaps the <code>src</code> with <code>data-original</code>. Everytime there is a scroll, it checks again. Lightweight and comfy.</p>
<blockquote class="pull-quote--right">When viewing it on mobile, it goes down to 700 bytes.</blockquote>
<p>Thanks to LazyLoad, I could bring down the page to 380Kb on a regular desktop screen. Definitely good. When viewing it on mobile, it goes down to ... 700 bytes. Then it progressively load the images as the user scroll through them. How cool is that? </p>
</section>