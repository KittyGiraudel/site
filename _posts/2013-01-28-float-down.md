---
disqus: http://hugogiraudel.com/blog/float-down
title: "Simulate float: down"
tags:
  - css
  - riddle
  - float
---

Back in september, some guy exposed a very interesting problem on [CSS-tricks forums](http://css-tricks.com/forums/discussion/19610/float-items). To sum up, he had a list of elements floated to the left. However, he wanted to float items top to bottom on each column and not left to right on each row.

He started with:

![Before](http://img401.imageshack.us/img401/4723/98791854.jpg)

And wanted to end with:

![After](http://imageshack.us/scaled/landing/88/51843399.jpg)

## Solutions to the problem

### Flexbox

Even if I'm not a flexbox expert, I'm pretty confident saying there is a way to do it very easily. The problem with flexbox is that it's not fully compatible so we had to look for another option.

Actually [Bennett Feely](http://twitter.com/bennettfeely) did it very nicely already on [CodePen](http://codepen.io/bennettfeely/pen/firxL).

### Manually

I first managed to do it with `:nth-child()` selectors, replacing manually each one of the ten elements ([JSFiddle](http://jsfiddle.net/VAdT3/1/)). It sucked because it was:

* Manual,
* Dependant of the number of items,
* CSS heavy,
* Not elegant.

### JavaScript

I was very upset not finding any proper way to do it with CSS so I did it with a mix of CSS and JavaScript (in fact jQuery). I don't know if it's the best way to do it in JavaScript but here is what I came up with:

```javascript
$('.myList > li:odd').remove().appendTo('.myList');
```

Basically I target one out of two items with `:nth-child(even)` then remove it from the DOM to finally append it again. This does exactly what was asked so I think it's a decent solution ([JSFiddle](http://jsfiddle.net/VAdT3/6/)).

### Margins

Finally someone came up with a better idea (and probably a better understanding of CSS) than mine with a pure CSS and very elegant solution ([CodePen](http://codepen.io/wolfcry911/pen/IkBbu)).

```css
li:nth-child(even) {
  margin: 110px 0 0 -110px; 
  /* Given a 100*100px element with a 10px margin */
}
```

Wolfcry911 simply used margins to reposition one out of two items. It's a brilliant solution, really.

However it relies on CSS advanced pseudo-selectors so for a deeper browser support, you might want get back to the JavaScript solution.

### Columns (edit 31/01/2013)

I just noticed [Estelle Weyl](http://codepen.io/estelle) did it in another clever way with CSS columns ([CodePen](http://codepen.io/estelle/pen/zkjrn)). I'm actually wondering if it's not the better option all in all since it requires only one single CSS line (prefixes omitted). 

```css
ul {
  columns: 5;
}
```

Congratulations to her for such a smart solution. :)

## Pushing it further

A few days ago, Chris Coyier found Wolfcry911's work and [tweeted](https://twitter.com/chriscoyier/status/295223893516500993) about it. Someone (in the person of [Arash Milani](http://twitter.com/arashmilan)) answered it wasn't possible to do it with more than 2 rows.

**CHALLENGE ACCEPTED!** This made me want to give it a shot. Honestly, it took me a few tries and no more than 10 minutes to find a solution for 3 rows.

<pre class="codepen" data-height="480" data-type="result" data-href="DoAIB" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/DoAIB">Check out this Pen!</a></pre>

Instead of doing `:nth-child(even)`, we need two different selectors:

```css
li:nth-child(3n+2){
  margin: 120px 0 0 -110px;
  background: limegreen;
}

li:nth-child(3n+3) {
  margin: 230px 0 0 -110px;
  background: crimson;
}
```

## Automating the process

So I found a solution to do it with the number of rows we want, pretty cool. Immediately, I thought about automating this. And guess what? I succeeded.

### Prepare the ground

First, I had to move everything to em units in order to make the whole thing easier to customize. I also created a few variables:

```scss
$rows: 4; 
$baseline: 10px;
$width: 4em;
$height: 4em;
$margin: 0.4em;
```

A few explanations about the variables:

* `$rows` stands for the number of rows you want,
* `$baseline` is set as a font-size to the root element (`html`) in order to be able to use em everywhere,
* `$width` is the width of each item; in my demo it equals 100px,
* `$height` is the height of each item; in my demo it equals 100px as well,
* `$margin` is the gap between each item; I set it to 10% of the size of an item.

*Note: you may wonder why using 2 different variables for size when one would be enough. This allows you to use non-square items if you want to: try it, it works.*

### Looping!

Now let's get to the funny part. I figured out there is some kind of pattern to achieve this and to be honest it took me a while (no pun intended) to create the while loop for this, struggling between my comprehension of the problem and Sass syntax errors. Anyway, this is the main idea:

```scss
$i: $rows; // Initializing the loop

@while ($i > 1) {
  li:nth-child(#{$rows}n + #{$i}) {
    $j: ($i - 1); // Setting a $i-1 variable

    margin-top: ($j * $height + $i * $margin);
    margin-left: -($width + $margin);
  }

  $i: ($i - 1);
}
```

It is pretty tough. Let me show you how it compiles when $rows is set to 4 (other variables remain unchanged):

```scss
li:nth-child(4n + 4) {
  margin-top: 13.6em;  // (3 * 4em) + (4 * 0.4em)
  margin-left: -4.4em; // -(4em + 0.4em)
}

li:nth-child(4n + 3) {
  margin-top: 9.2em;   // (2 * 4em) + (3 * 0.4em)
  margin-left: -4.4em; // -(4em + 0.4em)
}

li:nth-child(4n + 2) {
  margin-top: 4.8em;   // (1 * 4em) + (2 * 0.4em)
  margin-left: -4.4em; // -(4em + 0.4em)
}
```

I think the pattern should be easier to see now thanks to the comments. For X rows you’ll have `X-1` different selectors starting from `:nth-child(Xn+Y)` (where X and Y are the same) until Y becomes stricly superior than 1 (so Y equals 2).

## Demo

<pre class="codepen" data-height="560" data-type="result" data-href="AxmBK" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/AxmBK">Check out this Pen!</a></pre>

Try changing the number of rows by editing `$rows` and see the magic happen.

## Final words

There are still some problems with this method like: what if items have various sizes? Or what if we want different margins? Or what if we set a disproportionate number of rows given the number of items?

I guess we could complicate the whole thing to accept more parameters and be even more flexible but would it worth it? I guess not. **The simple way is to use JavaScript. The funny way is to use Sass.**
