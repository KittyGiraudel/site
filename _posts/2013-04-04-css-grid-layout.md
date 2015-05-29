---
layout: post
summary: true
title: "Future of CSS layout: CSS Grid"
tags:
  - css
  - grid
  - layout
---

> **Edit (2014/05/13):** it looks like Internet Explorer is not the only browser to support the Grid Layout anymore since Chrome 34+ seems able to handle it quite well without any prefix. To the future!

In the last few days/weeks, I have been helping Chris Coyier with [CSS-Tricks' Almanac](http://css-tricks.com/almanac/). It seems he doesn't have enough time to fill the last remaining entries, so we've been a few to help him out by writing them. I have done [perspective](http://css-tricks.com/almanac/properties/p/perspective/), [perspective-origin](http://css-tricks.com/almanac/properties/p/perspective-origin/) and [grid](http://css-tricks.com/almanac/properties/g/grid/).

I've to say it's been a real pleasure to do this, mostly because I've learnt literally a ton of stuff. Some people say the best way to learn is through teaching, I can say it's mostly true.

Anyway, if `perspective` and `perspective-origin` have been quite easy to do, I must say `grid` has been a whole another story. This is by far the most complicated thing I have ever seen in CSS. Let me introduce the topic.

## CSS Grid Layout

The [CSS Grid Layout](http://www.w3.org/TR/css3-grid-layout/) is currently a W3C Working Draft aiming at fixing issues with older layout techniques by providing a better way to achieve complex interface design. Indeed, each solution we (have) use(d) to make web pages has at least a flaw:

* **HTML tables**: markup dependant, not flexible
* **float**: clearing
* **inline-blocks**: spacing between blocks

The CSS Grid Layout consists on defining a 2-dimensional grid in which the children can be positioned as desired. The main benefits of this technique are:

* source order independant (!)
* no need for widths or heights
* no need for floats or inline-blocks
* no need for margins to space columns from each others
* easily adjustable when it comes to responsive

The basic example would be something like this: my `.wrapper` is my grid; `.header` will all columns of the first row; `.main` will by displayed in the second row and the first column; `.sidebar` in the second row, second column; and `.footer` in the third row, all columns.

## What's complicated?

<blockquote class="pull-quote--right">Specifications are definitely not for random people.</blockquote>

First, **reading specifications**. If a spec author ever reads this, I am sorry; but the specifications are definitely not for random people. I believe they are mostly made for browser makers, and they are probably very well writen but for a guy like me, it's way too complicated. Unfortunately, I had to dig deep into the spec.

What has been difficult as well is that the only supported browser &mdash; as of writing &mdash; is Internet Explorer 10 (mostly because 3 of 5 authors of the Grid spec are from Microsoft). And I believe they started implementing the module in their browser engine a while ago, resulting in some inconsistencies regarding the spec which keeps moving.

Not only their implementation is at a very early stage (about half the spec is currently supported), but it also differs from the spec at some point. Among other things:

* `grid-rows` and `grid-columns` have been renamed in `grid-definition-rows` and `grid-definition-columns`
* `grid-row` is supposed to be a shorthand for `grid-row-position` and `grid-row-span`. The current implementation in Internet Explorer 10 for `grid-row` should be the one for `grid-row-position` (which isn't supported). Same goes for `grid-column`.

This kind of stuff definitely doesn't make things easier.

Otherwise, the module is quite complicated by itself. It involves about 15 new properties, a new unit, and more important: a whole new way of thinking. Fortunately, the currently supported part of the spec is quite easily understandable and it has been very fun to play around with.

## A little example

What I've found astonishing is the very little amount of required CSS to achieve a complex layout. I counted: with no more than 10 lines of CSS, I've been able to make a 3-columns layout including 2 fixed-size columns, with full-width header and footer. Oh, and source order independant. Please have a look at the following markup:

<pre class="language-markup"><code>&lt;div class="wrapper">
	&lt;article class="main" >My awesome content here &lt;/article>
	&lt;footer class="footer">Some informations here  &lt;/footer>
	&lt;header class="header">My site title goes here &lt;/header>
	&lt;aside class="sidebar">Here is my side content &lt;/aside>
	&lt;aside class="annexe" >Some more side content  &lt;/aside>
&lt;/div></code></pre>

Now the CSS. Pay attention to the number of lines:

<pre class="language-css"><code>.wrapper {
	display: grid;
	grid-columns: 200px 15px 1fr 15px 100px;
	grid-rows: (auto 15px)[2] auto;
}

.header, .footer { grid-column-span: 5; }

.sidebar,
.main,
.annexe { grid-row: 3; }
.header { grid-row: 1; }
.footer { grid-row: 5; }

.sidebar { grid-column: 1; }
.main    { grid-column: 3; }
.annexe  { grid-column: 5; }</code></pre>

Done. **10 lines. No float. No inline-block. No height. No width. No margin.** And if you want to make everything nice on small devices, it will take no more than a couple of more lines (8 in this example).

*Note: I won't explain the syntax in this article. If you want to understand how works the Grid Layout, please have a look at [CSS-Tricks' Almanac entry](http://css-tricks.com/almanac/properties/g/grid/).*

## What about Flexbox?

> Are Flexbox and Grid both solutions to the same problem or do they both have their own use case?
&mdash; [@Lezz](https://twitter.com/Lezz/status/319376112679522304)


This question comes from Twitter. However I've been questioning myself regarding this while making the entry for CSS-Tricks. Let's have a look at both specifications:

> The **Flexbox specification** describes a CSS box model optimized for user interface design. In the flex layout model, the children of a flex container can be laid out in any direction, and can “flex” their sizes, either growing to fill unused space or shrinking to avoid overflowing the parent. Both horizontal and vertical alignment of the children can be easily manipulated. Nesting of these boxes (horizontal inside vertical, or vertical inside horizontal) can be used to build layouts in two dimensions.

> **Grid Layout** contains features targeted at web application authors. The Grid can be used to achieve many different layouts. It excels at dividing up space for major regions of an application, or defining the relationship in terms of size, position, and layer between parts of a control built from HTML primitives.
> Like tables, the Grid enables an author to align elements into columns and rows, but unlike tables, the Grid doesn’t have content structure, and thus enables a wide variety of layouts not possible with tables. For example, the children of the Grid can position themselves with Grid lines such that they overlap and layer similar to positioned elements.
> In addition, the absence of content structure in the Grid helps to manage changes to layout by using fluid and source order independent layout techniques. By combining media queries with the CSS properties that control layout of the Grid and its children, authors can adapt their layout to changes in device form factors, orientation, and available space, without needing to alter the semantic nature of their content.</blockquote>

So as I understand this, **the Grid layout is "macro" while the Flexbox module is "micro".** I think Grid will be perfect to organize the layout structure with high-level elements whereas Flexbox will be best-suited for some modules that require specific alignments, ordering and so like a fluid navigation for example.

[Kyle Keeling](https://twitter.com/kyle_keeling) wrote [an entry](http://www.outsidethebracket.com/understanding-the-difference-between-css3-flexbox-grid-layout/) about this a couple of months ago, explaing what he thinks is the difference between Flexbox and Grid.

## Final words

<blockquote class="pull-quote--right">I have been amazed by its efficiency.</blockquote>

For having [played](http://codepen.io/HugoGiraudel/pen/2befd6d225b69912af8561f7cb020124) with the module for hours, I can tell it is quite promising. I have been amazed by its efficiency, and I even could try to mix it with CSS preprocessors: it rocks. The fact it's fully number-based makes it very easy to use in [loops](http://codepen.io/HugoGiraudel/pen/fb0e46cde228e5437993ba1305459a22), [mixins and functions](http://codepen.io/HugoGiraudel/pen/aCliz).

Unfortunately, it is way too soon to use the Grid layout in a real-life project, especially since the browser support is restricted to Internet Explorer 10. However, I've heard the support is coming to Firefox and Chrome nightly builds, so I think we will be able to safely play around with it in a few months from now.

Then let's hope in a year from now, the browser support will be great in all modern browsers (Chrome, Firefox, Opera, IE10+, including some mobile browsers) giving us the ability to use it in projects that don't aim at old browsers.

Meanwhile, you can still experiment with it on Internet Explorer. Here are a couple of useful resources on the topic:

* [CSS Grid Layout in the CSS specifications](http://www.w3.org/TR/css3-grid-layout/)
* [CSS Grid Layout by Microsoft](http://msdn.microsoft.com/en-us/library/ie/hh673533(v=vs.85).aspx)
* [Microsoft's CSS Grid layout playground](http://ie.microsoft.com/testdrive/Graphics/hands-on-css3/hands-on_grid.htm)
* [CSS Grid Layout by 24Ways](http://24ways.org/2012/css3-grid-layout/)
* [CSS Grid Layout by Raphael Goetter (FR)](http://www.alsacreations.com/article/lire/1388-css3-grid-layout.html)
