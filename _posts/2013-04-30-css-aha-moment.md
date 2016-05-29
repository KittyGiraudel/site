---
layout: post
title: "My CSS Aha moment"
tags:
  - css
  - thoughts
---

I'd like to share with you my CSS "Aha moment". The "Aha moment" is when some day, in the very back of your head, two neurons get in touch and all of the sudden things become clear as crystal.

I think mine was like two years ago or something and since then my CSS has been better than ever. I don't really remember how it came up, but suddenly I understood that **absolutely all elements on a page are rectangles**.

God, that sounds stupid now but it really helped in understanding how to make efficient CSS. You know, at first you don't necessarily get that a line of text isn't shaped around the text but follows the same pattern as all other elements.

> All elements on a page are rectangles.

And when you get that and most generally the whole box-model (that says width equals `width + padding-left + padding-right + border-left + border-right.`), everything becomes so simple.

<figure class="figure">
<img src="/assets/images/css-aha-moment/box-model.jpg" alt="">
<figcaption>CSS Box Model</figcaption>
</figure>

Seriously, the first thing to understand when learning CSS is that every element is following the same pattern: **a content-box in a padding-box in a border-box in a margin-box**; I don't know why my teachers didn't even start with that.

Once you get that, it's really not that hard to produce correct (not necessarily efficient, but still correct) CSS.

What about you? What was your Aha moment?
