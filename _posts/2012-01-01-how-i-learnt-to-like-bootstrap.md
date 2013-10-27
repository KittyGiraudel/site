---
published: true
layout: post
preview: true
comments: false
---

<section>
<p>A couple of days ago, I saw a <a href="https://twitter.com/Gandoulfe/status/392640481634422785">fellow French developer say how much he hates (Twitter) Bootstrap</a> for websites on Twitter. And I saw a couple of fellow French developers agree with him.</p>
<p>This reminded me that no so long ago, I was a fervent defender of the tell <em>"Bootstrap is good for prototypes and back offices or stuff like this"</em>.</p>
<img src="/images/how-i-learnt-to-like-bootstrap__bootstrap.jpg" alt="Twitter Bootstrap 3" />
<p>Until a recent project where I finally learnt to like Bootstrap, even for websites. But let's back up a little bit!</p>
<section id="start">
<h2>How this started <a href="#start">#</a></h2>
<p>I recently got hired for quite a big project as the only front-end developer in a team of a dozen of developers. The design itself is fairly complex since it involves various layouts, multiple themes, a lot of forms and a bunch of pages. Thankfully, Symfony and its template engine Twig make it a lot easier to manage but that's not the point.</p>
<p>So when I started working on this project, they basically told me I would be the only one to deal with the front end which sounded great to me because other developers were mostly back-end devs.</p>
<p>And then they told me what I didn't want to hear: <em>"we will use Twitter Bootstrap"</em> and I was like <em>"NOOOOOOOOO!!"</em>.</p>
<p>But then they said something even worse: <em>"Bootstrap 2.3"</em> and then I was like <em>"NOOOOOOOOO!!"</em>.</p>
<p>Since Bootstrap 3 was still in RC back then, it wasn't possible for us to use it. Thankfully a couple of days later, Bootstrap 3.0 officially got released so we jumped onto it and moved the little front-end we had already done to v3.</p>
</section>
<section id="beginning">
<h2>The beginning <a href="#">#</a></h2>
<p>At first, it was a pain in the ass for me to work with Bootstrap. Mostly because I haven't ever used it before. Especially the grid system which didn't feel intuitive to me: <code>.container</code>, <code>.row</code>, <code>.col-md-*</code>? What is this?</p>
<p>But also because I thought my CSS skills were good enough so I don't have to use some framework. And in a way, I was right: I don't need a CSS framework to make a website. Now, even if I don't need it doesn't mean I shouldn't use it at all. It's been a couple of weeks now we are working on this project and picking Bootstrap has to be one of the wisest moves we have taken so far.</p>
</section>
<section id="coding-fast">
<h2>Coding fast <a href="#coding-fast">#</a></h2>
<p>This is the main reason that makes me like Bootstrap on this project: I can code really fast. Making a component displaying a row of product with their image, title and description takes me no more than a couple of minutes thanks to Bootstrap's powerful grid system and its collection of components.</p>
</section>
<section id="less-dependencies">
<h2>Less dependencies <a href="#less-dependencies">#</a></h2>
<p>The title can be confusing: I am not talking about <em>LESS</em>, the CSS preprocessor. I mean that using Bootstrap really reduces the number of dependencies used across the project.</p>
<p>Carousel? Check. No need of FancyJqueryAnythingCarouselSlider.js. Icon fonts? Check. No need of FontAwesome. Modal? Check. Dropdowns? Tabs? Tooltips? Check, check, check. It may sounds trivial, but not having thousands of dependencies is really important to keep things maintainable.</p> 
<p>Of course we still have other dependencies than Bootstrap like jQuery UI (which could deserve a similar article I guess), underscore.js and quite a couple of other things but I can't imagine the number of external dependencies we would have right now if we were not using Twitter Bootstrap.</p>
</section>