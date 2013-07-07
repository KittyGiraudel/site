---
title: Sassy Media Queries
layout: post
comments: true
codepen: true
---
<section>
Here is a quick blog post aiming at explaining how I turned a ~250-line CSS experiment by [Arley McBlain](http://arleym.com) into less than 30 sexy lines of Sass.

First, let me remind you what Arley did in his experiment, topic of a [great article at CSS-tricks](http://css-tricks.com/lark-queries/). His idea was to change some content according to the screen size.

In order to do that, he used a pseudo-element and filled the `content` property accordingly. With about **160 media query calls**, he managed to change the content every 10px from 1920px to 300px (device width).

Check it live on [his website home](http://arleym.com/) or at [CSS-tricks](http://css-tricks.com/examples/LarkQueries/).
</section>
<section id="sassy">
## Make it Sassy, make it easy [#](#sassy)
Let's be honest, it's an amazing idea, really. It works great, it looks great, the only downside is... it's a pain in the ass to code.

This is where Sass &mdash; or any CSS preprocessor really &mdash; can be very efficient. **It took me about 10 minutes to divide the amount of required code by 4.** Plus, it makes everything so much easier to adapt and maintain. 

<pre class="codepen" data-height="300" data-type="result" data-href="kBzra" data-user="HugoGiraudel" data-safe="true"><code></code><a href="http://codepen.io/HugoGiraudel/pen/kBzra">Check out this Pen!</a></pre>

If you simply want to see the code and don't care much about how I did it, please check [this CodePen](http://codepen.io/HugoGiraudel/pen/kBzra) ([fullsize here](http://codepen.io/HugoGiraudel/full/kBzra)) and resize your browser like a fucking obsessive.

### Create the list

Okay, this is no magic. I had to write all the words Arley used all over again. I guess I could write a little JavaScript that would have parsed Arley's stylesheet then making a list of it but it would have been ever more time consuming.

So basically I created a Sass list containing all words ordered from the longest to the shortest. Hopefully, Arley already did this part of the job before me so I didn't have to do it again.

<pre class="language-scss"><code>$words: "Unconventional", "Flabbergasting", "Scintillating", "Extraordinary", "Unforgettable", "Unpredictable", "Dumbfounding", "Electrifying", "Overwhelming", "Incomparable", "Entertaining", "Magnificient", "Confounding", "Resourceful", "Interesting", "Adventurous", "Bewildering", "Astonishing", "Fascinating", "Outstanding", "Influential", "Imaginative", "Nonsensical", "Stimulating", "Exceptional", "Resplendent", "Commanding", "Determined", "Remarkable", "Incredible", "Impressive", "Perplexing", "Passionate", "Formidable", "Stupefying", "Refreshing", "Delightful", "Incredible", "Innovative", "Monumemtal", "Surprising", "Stupendous", "Staggering", "Delectable", "Astounding", "Responsive", "Courageous", "Outlandish", "Marvelous", "Whimsical", "Versatile", "Motivated", "Brilliant", "Eccentric", "Wonderful", "Excellent", "Thrilling", "Inspiring", "Exquisite", "Inventive", "Colourful", "Delicious", "Fantastic", "Audacious", "Dexterous", "Different", "Confident", "Enthused", "Peculiar", "Glorious", "Smashing", "Splendid", "Adaptive", "Daunting", "Imposing", "Striking", "Charming", "Dazzling", "Engaging", "Resolute", "Intrepid", "Dramatic", "Original", "Fearless", "Flexible", "Creative", "Animated", "Puzzling", "Shocking", "Intense", "Elastic", "Pointed", "Unusual", "Devoted", "Amusing", "Radiant", "Refined", "Natural", "Dynamic", "Radical", "Bizarre", "Curious", "Amazing", "Lively", "Modest", "Mighty", "August", "Unique", "Absurd", "Brazen", "Crafty", "Astute", "Shrewd", "Daring", "Lovely", "Nimble", "Classy", "Humble", "Limber", "Superb", "Super", "Ready", "Crazy", "Proud", "First", "Light", "Alert", "Lithe", "Fiery", "Eager", "Quick", "Risky", "Adept", "Sharp", "Smart", "Brisk", "Fresh", "Swift", "Novel", "Giant", "Funky", "Weird", "Grand", "Alive", "Happy", "Keen", "Bold", "Wild", "Spry", "Zany", "Nice", "Loud", "Lean", "Fine", "Busy", "Cool", "Rare", "Apt", "Fun", "Hot", "Big";</code></pre>

Pretty big, right? Don't worry, the worst part is over. Now it's all about easy and interesting stuff.

### Let's loop!

> One loop to rule them all,  
> One loop to bind them,  
> One loop to bring them all,  
> And in the Sass way bind them.

Now we have the list, we only have to loop through all items in it and do something, right?

<pre class="language-scss"><code>$max: 1910px; /* [1] */
.be:after {
	@each $word in $words { /* [2] */
  		@media screen and (max-width: $max) { /* [3] */
    		content: "Be #{$word}."; /* [4] */
  		}
  		$max: $max - 10; /* [5] */
  	}
}</code></pre>

1. First, we set a max value (not necessarly px) for the first Media Query call we will do; from there, it will decrease from 10 to 10,
2. We loop through all items in the list,
3. We call the Media Query setting the according maximum width,
4. We put the current word in the `content` property,
5. We decrease the value from 10 for the next run in the loop.

Please note we also could write it this way:

<pre class="language-scss"><code>$max: 1910px;
@each $word in $words {
	@media screen and (max-width: $max) {
		.be:after {
    		content: "Be #{$word}.";
  		}
  	}
  	$max: $max - 10;
}</code></pre>

This outputs exactly the same thing. It's really a matter of where you want to put the Media Query call: inside or outside the selector.
</section>
<section id="final-words">
## Final words [#](#final-words)

That's pretty much it. Fairly simple isn't it? This means we can easily add another word in the list without having to copy/paste or code anything. Simply put the word.

However if we add a couple of words, the last one will trigger under 300px device width, which gets kind of small. To prevent this, we could reverse the loop, starting from the smallest width, increasing from 10 to 10.

Thanks again to [Arley McBlain](http://twitter.com/arleym) for his awesome CSS experiment!
</section>