---
layout: post
title: "CSS trickery and calc function"
---
<figure class="figure--right">
<img src="/images/calc-css-riddle__gollum-riddle.gif" alt="">
<figcaption>Me trying to figure out a solution to a CSS issue</figcaption>
</figure>

Yesterday, famous French front-end developer [Rémi Parmentier proposed a little CSS brain-teaser on his blog](http://www.hteumeuleu.fr/un-casse-tete-en-integration-a-base-de-grille/) and you know how much I like riddles. I am kind of a CSS version of Gollum from The Hobbit - An unexpected journey. Nevermind.

I gave it a go and it turned out to be much easier than I firstly expected. No weird cross browser issue, no dirty hack and mostly just plain ol' good CSS. But you may want to give it a try, don't you?

## It likes riddles, praps it does, does it? 

Let me translate the post from Rémi for you:

1. The orange items have a fixed width of 200px
2. The grid is fluid and contains 4 cells per row
3. Grey cells have 10 left and right margins, except for:
    * The first cell of each row which doesn't have left margin
    * The last cell of each row which doesn't have right margin
4. Items are horizontally centered in cells, except for:
    * The item of the first cell of each row which is left aligned
    * The item of the last cell of each row which is right aligned
5. Items are equally distribued across each row and grey rectangles all share the same width
6. First item and last item from each row are stuck to the edges of the grid
7. All cells have the same parent so HTML should be something like `.grid > .cell > .item`. You can add specific classes if you need.
8. No JavaScript, only HTML and CSS.
9. It should work from IE 9 and gracefully degrades on older browsers.

The tricky part is *5*. After checking at proposals submitted by various developers on Rémi's post, it seems most of them didn't catch that **all grey rectangles should be the same width**. Here is what you should be having:

![The grid we want to create](/images/calc-css-riddle__css-grid.gif)

Rémi made [a CodePen](http://codepen.io/hteumeuleu/pen/zLiGw) to kickstart the riddle if you'd like to give it a try. Go on, have a shot. I'll be waiting.

## Computing the whole thing, one step at a time

**Spoilers!** I'll be giving the solution in a couple of lines or so, so if you don't feel like knowing or are afraid of what you could read, close the tabs, close the browser, shut down your computer and lock yourself in! 

The easiest (and best) solution was to use the `calc` function. A few came up with tricky things like absolute positioning but that doesn't seem like a good idea for a grid system.

When I shared my solution on Twitter, some people seemed kind of amazed at how far I pushed the use of `calc()`. In the end I can assure you the solution is very easy to find, hence a little blog post to explain my thought process.

### Understanding the problem

<blockquote class="pull-quote--right">All cells aren't the same width.</blockquote>

Many devs including myself jumped on the code assuming all cells would be the same width, obviously 25% since there are 4 cells per row. This was the first mistake, **all cells don't share the same width**. Since all orange items are the same width (200px) and all grey spans are the same width (unknown) and some cells contain 2 grey spans while some contain only one, all cells can't be the same width. Cells on sides are shorter than cells in the middle of a row.

Sometimes putting things on paper (well, in a text editor in my case) can help a lot to get things. Here is what I wrote:

    orange | grey | margin | margin | grey | orange | grey | margin | margin | grey | orange | grey | margin | margin | grey | orange
      200  |  ?   |   10   |   10   |  ?   |   200  |  ?   |   10   |   10   |  ?   |   200  |  ?   |   10   |   10   |  ?   |  200

This is what a row looks like. 

### Finding `?`, a grey span width

To compute the width of a cell (could it be one from the sides or one from the middle) we need to find the width of grey spans (marked as `?`). This is actually quite easy to do, isn't it? What do we know so far?

1. We know a row's width is 100%,
2. We know an orange item is 200px, and we got 4 of them,
3. We know a margin is 10px and we go 6 of them.

From this, we can easily pull out the space allowed for grey spans altogether: `100% - (200px * 4 + 10px * 6)`, or `100% - 860px`. To find the width of a single grey span, we only have to divide it per 6 since we have 6 grey rectangles per row. So: `(100% - 860px) / 6`. 

Obviously the computed value depends on the actual width of the viewport. On a `1240px`-large screen, it will result in `380px / 6`, or `63.333333333333336px`. Good!

### Computing side cells width

From there it's getting very easy. Side cells have a 200px wide inner item like every other cells but they only have one grey span instead of two since the orange item is stuck to the edge of the grid. 

So the width is *one orange item + one grey span* or `200px + (100% - 860px) / 6`.

### Computed middle cells width

And the middle cells have two grey spans so their width is *one orange item + two grey spans* or `200px + ((100% - 860X) / 6) * 2`.

## Doing it in CSS

Now that we've computed everything on paper, we need to move all this stuff to the stylesheet. Thankfully CSS provides us the ultimate way to do cross-unit calculations: `calc`. Even better, `calc` is [supported from IE9](http://caniuse.com/#search=calc) so we only have to draw a quick and dirty fallback for IE8 and we're good to go.

### How to distinguish side cells from middle cells

If you are using a templating engine (SPIP, Twig, Liquid...), there are high chances you generate your rows within a loop. This allows you to dynamically add a class to side-cells. Basically every multiples of 4, and every multiple of 4 + 1 (1, 4, 5, 8, 9, 12, 13, 16...).

But since we only have to support a reasonably recent range of browsers, we could use advanced CSS selectors as well like `:nth-of-type()` to target side cells.

<pre class="language-scss"><code>/* Side cells */
.cell:nth-of-type(4n),       /* last  cells */
.cell:nth-of-type(4n + 1) {  /* first cells */
  /* Do something */
}</code></pre>

### Defining widths with calc

In the end, the core of the solution is no more than this:

<pre class="language-scss"><code>/* Middle cells */
.cell {
  width: calc(((100% - (200px * 4 + 10px * 6)) / 6) * 2 + 200px);
}

/* Side cells */
.cell:nth-of-type(4n),
.cell:nth-of-type(4n + 1) {
  width: calc(((100% - (200px * 4 + 10px * 6)) / 6) + 200px);
}</code></pre>

You can have a look at the [whole code directly on CodePen](http://codepen.io/HugoGiraudel/pen/tivIj).

## Pushing things further with Sass 

What's interesting when you put things on paper before coding is you quickly become aware of what would be good stored in a variable. And if you're using a CSS preprocessor, making this whole grid system working on no more than a couple of variables is within easy reach.

There are 3 things we could store:

* The items' width (200px)
* The margin (10px)
* The number of cells per row (4)

Once you've set up those 3 variables, you don't have to edit the code anymore whenever you want to change something, could it be the size of the margin or the number of cells per rows. Pretty neat.

*Note: whenever you're trying to use Sass variables in `calc` function, be sure to escape them with `#{}`. For instance: `calc(#{$margin} + 42px)`.*

Again, [check code on CodePen](http://codepen.io/HugoGiraudel/pen/zFJvn).

## Final thoughts 

That's pretty much it folks. In the end it wasn't that hard, was it? I feel like the most difficult part of a such an exercice is to leave the code aside and taking a couple minutes to actually understand what happens.

Too many developers including myself sometimes are too hurried to jump in the code and try things. When it comes to grid system, it turns out every single time I started coding stuff right away instead of taking a deep breath to get things right, I ended up rewriting most of my code.

And this, as you know it, sucks.
