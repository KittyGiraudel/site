---
title: My CSS Aha moment
layout: post
comments: true
---
<section>
<p>I'd like to share with you my CSS "Aha moment". The "Aha moment" is when some day, in the very back of your head, two neurons get in touch and all of the sudden things become clear as crystal.</p>
<p>I think mine was like two years ago or something and since then my CSS has been better than ever. I don't really remember how it came up, but suddenly I understood that <strong>absolutely all elements on a page are rectangles</strong>.</p>
<p>God, that sounds stupid now but it really helped in understanding how to make efficient CSS. You know, at first you don't necessarily get that a line of text isn't shaped around the text but follows the same pattern as all other elements.</p>
<blockquote class="pull-quote--right">All elements on a page are rectangles.</blockquote>
<p>And when you get that and most generally the whole box-model (that says width equals <code>width + padding-left + padding-right + border-left + border-right.</code>), everything becomes so simple.</p>
<figure class="figure--right">
<img src="/images/css-aha-moment__box-model.jpg" alt="">
<figcaption>CSS Box Model</figcaption>
</figure>
<p>Seriously, the first thing to understand when learning CSS is that every element is following the same pattern: <strong>a content-box in a padding-box in a border-box in a margin-box</strong>; I don't know why my teachers didn't even start with that.</p>
<p>Once you get that, it's really not that hard to produce correct (not necessarily efficient, but still correct) CSS.</p>
<p>What about you? What was your Aha moment?</p>
</section>