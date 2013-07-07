---
title: Colors in CSS
layout: post
comments: true
disqus: http://hugogiraudel.com/blog/css-colors.html
---
<section>
<p>Hi everyone! Today, we will talk about colors in CSS. There are many color specifications and we'll be talking about their history, what they mean and how to use them.</p>
<p>If you'd like to read about how to build a color scheme for a website then you might be interested in this article <a href="http://tympanus.net/codrops/2012/09/17/build-a-color-scheme-the-fundamentals/">Build a color scheme: the fundamentals</a>, or the article <a href="http://tympanus.net/codrops/2012/02/28/principles-of-color-and-the-color-wheel/" title="Principles of Color and the Color Wheel">Principles of Color and the Color Wheel</a> if you'd like to read about the color wheel.</p>
<p>We will see how we can define colors in style sheets, what each one can be used for and more. But first, let me introduce the topic.</p>
</section>
<section id="types-of-colors">
<h2>Various types of colors in CSS <a href="#types-of-colors">#</a></h2>
<p>Colors in CSS are defined on a <a href="http://en.wikipedia.org/wiki/SRGB">sRGB</a> color space. sRGB stands for "Standard Red Green Blue" where colors are defined through three channels: Red, Green and Blue.</p>
<p>From there, we have various ways to describe color with CSS. Some of them like keywords and hexadecimal has been there almost since the beginning of the web, while other like HSL or RGB came later.</p>
<ul>
<li><a href="#rgb"><strong>RGB</strong></a> and <strong>RGBA</strong></li>
<li><a href="#hex"><strong>Hexadecimal</strong></a></li>
<li><a href="#keywords"><strong>Keywords</strong></a> (+transparent and currentColor)</li>
<li><a href="#hsl"><strong>HSL</strong></a> and <strong>HSLA</strong></li>
<li><a href="#system-colors"><strong>System colors</strong></a></li>
</ul>
<p>Let's talk about each one of these definitions to understand them better.</p>
</section>
<section id="rgb">
<h2>RGB <a href="#rgb" class="section-anchor">#</a></h2>
<p>Let me start with the RGB syntax since it’s the most fundamental thing to understand in order to comprehend how other notations like hexadecimal work. </p>
<h3>What is RGB?</h3>
<p>As I said above, RGB stands for Red, Green and Blue. Remember when you were a little kid and were painting with some cheap watercolor? Well, this is kind of the same thing, except that colors behave a little bit differently on screen and on paper. Let me explain myself:</p>
<table>
<tr>
<th>On paper</th>
<th>On screen</th>
</tr>
<tr>
<td>Main colors are Red, Yellow and Blue</td>
<td>Main colors are Red, Green and Blue</td>
</tr>
<tr>
<td>Mixing 3 colors makes a brownish black</td>
<td>Mixing 3 colors makes a grey shade</td>
</tr>
<tr>
<td>A bit of blue + some red make nice purple</td>
<td>A bit of blue + some red make dark purple</td>
</tr>
<tr>
<td>The less color you use, the brighter it is</td>
<td>The less color you use, the darker it is</td>
</tr>
<tr>
<td>Representation is a circle with neither white nor black</td>
<td>Representation is a cube with black and white</td>
</tr>
</table>
<img src="/images/css-colors__color-cube.jpg" class="pull-image--left" alt="Color Cube" />
<blockquote class="quote">This picture is the RGB color model mapped to a cube. What you can see is this: the horizontal x-axis as red values increasing to the left, y-axis as blue increasing to the lower right, and the vertical z-axis as green towards the top. The origin, black, is the vertex hidden from the view.</blockquote>
<h3 style="clear:both">How do we define RGB colors?</h3>
<p>To describe a color using the RGB model, you have to define a value for the red channel, a value for the green channel and a value for the blue channel. Okay, but what type of value? Percentages? Arbitrary? Any?</p>
<p>A RGB value can be defined using four different syntaxes but only two of them are available in CSS:</p>
<ul>
<li>A percentage from 0% (black) to 100% (white)</li>
<li>An integer value from 0 (black) to 255 (white); 255 is the range of a 8-bit byte</li>
<li>A float number from 0 to 1 (0.58935); it’s more like a theoretical approach <strong>unavailable in CSS</strong></li>
<li>A large integer 10, 16, 24, 32, 48 or even 64-bit units, but clearly that's <strong>unavailable in CSS</strong></li>
</ul>
<p>So, summarized, we end up with two different ways to display CSS colors with the <code>rgb()</code> function: percentages and integers between 0 and 255. Let’s illustrate this with an example, shall we?</p>
<pre class="language-css"><code>.black { /* I’m black! */
	color: rgb(0, 0, 0);
	color: rgb(0%, 0%, 0%);
}

.white { /* I’m white! */
	color: rgb(255, 255, 255);
	color: rgb(100%, 100%, 100%);
}

.purple { /* I’m medium purple! */
	color: rgb(128, 0, 128);
	color: rgb(50%, 0%, 50%);
}

.light-purple { /* I’m fuchsia! */
	color: rgb(255, 0, 255);
	color: rgb(100%, 0%, 100%);
}

.dark-purple { /* I’m deep purple! */
	color: rgb(64, 0, 64);
	color: rgb(25%, 0%, 25%);
}</code></pre>
<p><strong>Important</strong>: when using percentages, you have to set the unit even if it is 0. If you don’t, some browsers may be unable to parse it.</p>
<p class="note">Note: even if the percentage version seems more intuitive, it’s actually the integer version that seems to be more commonly used.</p>
<h3>What about the alpha-channel?</h3>
<p>As seen previously, while using the RGB system we can also use an alpha channel which is by default set to 1. This channel allows us to modify the opacity of a color, or its transparency if you will.</p>
<p>To use this channel in CSS, you’ll call the <code>rgba()</code> function instead of the <code>rgb()</code>. However note the alpha-channel is always defined with a float clamped between 0 and 1.</p>
<pre class="language-css"><code>.black { /* I’m half transparent black! */
	color: rgba(0, 0, 0, 0.5);
	color: rgba(0%, 0%, 0%, 0.5);
}

.white { /* I’m 2/3 transparent white! */
	color: rgba(255, 255, 255, 0.33);
	color: rgba(100%, 100%, 100%, 0.33);
}

.red { /* I’m fully transparent red, so kind of invisible */
	color: rgba(255, 0, 0, 0);
	color: rgba(100%, 0%, 0%, 0);
}</code></pre>
<p>This can be very useful in various situation. Let’s say you have some kind of background image and want to write on it without losing readability or putting a big white box on top of it. This is the perfect usecase for RGBa!</p>
<pre class="language-css"><code>.parent {
	background-image: url(‘my-picture.jpg’);
}

.child {
	background: rgba(255, 255, 255, 0.75);
	color: rgb(51, 51, 51);
}</code></pre>
<p>This way, the child element will have a white background with 75% opacity, showing its parent’s background without risking any issue with readability.</p>
<p class="note">Note: when dealing with decimal values between 0 and 1, you don’t have to write the 0 before the dot. So you can write <code>rgba(0, 0, 0, .5)</code> and still be perfectly valid.</p>
<p><em>Note: the <code>rgb()</code> function is perfectly valid CSS2.1. However the <code>rgba()</code> function is part of the CSS3 specification and is not supported by all browsers (Internet Explorer 6, 7, 8).</em></p>
</section>
<section id="hex">
<h2>Hexadecimal <a href="#hex" class="section-anchor">#</a></h2>
<h3>What is hexadecimal?</h3>
<p>Most of the time, CSS colors are specified using the hexadecimal format which is a 6 (or 3) characters long string using numbers from 0 to 9 and letters from A to F, starting by the hash sign # (ex: #1A2B3C). We refer as this syntax as a “hex triplet”.</p>
<p>Okay, but what does this mean? I agree it’s not that simple. Basically, hexadecimal colors are some sort of code for RGB colors: the first two characters stand for the red value; the 3rd and 4th characters stand for greens; and the last two characters are here for the blue.</p>
<p>Since the range of a 8-bit byte is 256, we usually use a base 16 system to display values. This system is called hexadecimal. So basically those 3*2 digits stand for 3 values from 0 to 255 converted to base 16, as you would do in RGB.</p>
<p>Okay, I can understand you’re lost here, so we’ll try a little example. Let’s say you want to make a pure red (rgb(255, 0, 0)): thanks to <a href="http://wims.unice.fr/wims/wims.cgi">this awesome converter</a>, you convert 255 to base 16 and know it equals FF. If you try to convert 0, you’ll see it’s 0 as well in base 16. So your hex triplet would be #FF0000. Simple, isn’t it?</p>
<p>So this was the theory, alright? It doesn’t mean you have to use a base 16 converter every single time you want to use a color in CSS. I’m simply explaining you how are hexadecimal colors composed. Now in real life, you’ll simply use a color palette like Photoshop or whatever.</p>
<p class="note">Note: you may see some hex triplets reduced to 3 digits instead of 6. It only happens when the two digits of each of the 3 components of the triplet are the same. To apply it on our previous example, the red color (#FF0000) can be written like #F00. If any of the 3 components have 2 different digits, you can’t do this.</p>
<h3>What about transparency?</h3>
<p>Alas, you can’t edit the alpha-channel when defining colors in hexadecimal, it’s actually not possible. If ever you really want to change the opacity, you still can turn your hex triplet to a RGBa quadruplet, or use the opacity property.</p>
<p><strong>Important</strong>: however beware of the opacity property. It changes the opacity of the element itself, and all its child elements. Plus, it is <a href="http://caniuse.com/#feat=css-opacity">not supported by Internet Explorer 6, 7 and 8</a>.</p>
</section>
<section id="keywords">
<h2>Keywords <a href="#" class="section-anchor">#</a></h2>
<h3>What are color keywords?</h3>
<p>The fact is, hexadecimal is really unfriendly. Nobody knows what color is associated to a hex triplet at the first glance, because it’s a computed syntax by the machine and for the machine.</p>
<p>RGB is slightly better, especially when you’re using percentage values but it’s not wonderful either. If I tell you <code>rgb(54%, 69%, 23%)</code>, can you tell me what color it will be? Even approximately? I guess not.</p>
<p>That’s why there are keywords. Keywords are real color names like red, green and blue associated to actual RGB / hex triplets. Back in the days, the HTML 4.01 Standard proposed 16 different keywords:</p>
<ul style="list-style: none; margin-left: 0;">
<li style="padding: 5px; margin-bottom: 2px; background: aqua">Aqua</li>
<li style="padding: 5px; margin-bottom: 2px; background: black; color: white">Black</li>
<li style="padding: 5px; margin-bottom: 2px; background: blue; color: white">Blue</li>
<li style="padding: 5px; margin-bottom: 2px; background: fuchsia;">Fuchsia</li>
<li style="padding: 5px; margin-bottom: 2px; background: gray; color: white">Gray</li>
<li style="padding: 5px; margin-bottom: 2px; background: green; color: white">Green</li>
<li style="padding: 5px; margin-bottom: 2px; background: lime;">Lime</li>
<li style="padding: 5px; margin-bottom: 2px; background: maroon; color: white">Maroon</li>
<li style="padding: 5px; margin-bottom: 2px; background: navy; color: white">Navy</li>
<li style="padding: 5px; margin-bottom: 2px; background: olive; color: white">Olive</li>
<li style="padding: 5px; margin-bottom: 2px; background: purple; color: white">Purple</li>
<li style="padding: 5px; margin-bottom: 2px; background: red; color: white">Red</li>
<li style="padding: 5px; margin-bottom: 2px; background: silver;">Silver</li>
<li style="padding: 5px; margin-bottom: 2px; background: teal; color: white">Teal</li>
<li style="padding: 5px; margin-bottom: 2px; background: white;">White</li>
<li style="padding: 5px; margin-bottom: 2px; background: yellow;">Yellow</li>
</ul>
<p>Then the CSS2.1 specification added the <span style="background: orange; display: inline-block; padding: 0 5px;">orange</span> keyword. Finally, CSS3 came with 130 additional keywords for a total of 147 keywords (134 non-gray, 13 gray).
I won’t list all of them here because it would be too long however, this is a visualization of all of them on a hue wheel by <a href="http://meyerweb.com/eric/css/colors/hsl-147.html">Eric Meyer</a> (see <a href="http://www.xanthir.com/blog/b4JC0">annotated version by Tab Atkins Jr.</a>):</p>
<img alt="Color Wheel" src="/images/css-colors__color-wheel.jpg"/>
<p>The point of this work is to show keywords are associated to random colors: they are chosen according to their position on the hue wheel.</p>
<p>Eric Meyer also created a color equivalents table in order to know what keyword is associated to which color, with hexadecimal, RGB (both syntax) and HSL versions you <a href="http://meyerweb.com/eric/css/colors/">can find here</a>.</p>
<h3>Keywords usage</h3>
<p>The point of keywords is to use basic colors with words that actually mean something. I say “basic” because most of the time, you’ll want a custom color who doesn’t have a keyword. But whenever you want to use a plain red or a silver grey, you don’t have to use a hex or RGB triplet; you can use the keyword.</p>
<p class="note">Note: the 147 keywords are all perfectly valid, even on old browsers like Internet Explorer 6.</p>
<h3>Special keywords</h3>
<p>There are two keywords which are a little bit special since they do not refer to a RGB triplet. Those are <code>transparent</code> and <code>currentColor</code>.</p>
<h4>Transparent</h4>
<p>The transparent value exists since CSS1 but was only valid as a value for the background property. Nowadays <code>transparent</code> is a valid keyword for any property accepting a color value (color, border-color, background, shadows, gradients, etc.).</p>
<p>Its effect is pretty straight forward: it makes the color (or background-color or whatever) of the element transparent, as it is by default when no color is specified.</p>
<p>What’s the point you say? To restore the default transparent color if a color value you can’t remove is already set.</p>
<h4>CurrentColor</h4>
<p>The currentColor is a CSS3 value allowing you to take the color as a default value for another property. Have a look at the code below.</p>
<pre class="language-css"><code>.my-element {
color: red;
	border-color: 5px solid currentColor;
}</code></pre>
<p>The border will be red since the defined color is red. If no color was set, it would have been black, since the default value for the color property is black.</p>
<p>You want to know what’s awesome? <code>currentColor</code> is a default value for a bunch of things. From my tests:</p>
<ul>
<li>Border-color</li>
<li>Color component in box-shadow</li>
<li>Color component in text-shadow</li>
</ul>
<p>It means you can do one of those and be perfectly valid:</p>
<pre class="language-css"><code>.my-element {
	color: red;
	border-color: 5px solid;   /* This will be red */
	box-shadow: 10px 10px 5px; /* This will be red */
	text-shadow: 0 2px 1px;    /* This will be red */
}</code></pre>
<p class="note">Note: the cap on the C letter is not required. It’s only a writing convention.</p>
</section>
<section id="hsl">
<h2>HSL <a href="#hsl" class="section-anchor">#</a></h2>
<h3>What is HSL?</h3>
<p>HSL stands for Hue, Saturation and Lightness. Please don’t worry, HSL is not another format of color. It’s only another representation of the RGB model. This cylindric representation aims at showing the RGB model in a more intuitive way than the previous seen cube.</p>
<img src="/images/css-colors__color-hsl.jpg" alt="Color HSL" />
<h4>Hue</h4>
<p>The angle around the central vertical axis of the cylinder corresponds to the “hue”, which is basically the color you want. Take a chromatic wheel: at 0° you have red, at 120° you have green, at 240°you have blue and you go back to red when you reach 360°.</p>
<img src="/images/css-colors__color-wheel.png" alt="Color Wheel" />
<h4>Saturation</h4>
<p>The distance from the central vertical axis of the cylinder corresponds to “saturation” (also called “chroma”). It can be understood as the quantity of black and white you add to your color. When set to 100%, the color is “pure”, but when you reduce the saturation you’re creating a “mixture”, progressively moving your color to some kind of grey.</p>
<h4>Lightness</h4>
<p>The distance along the vertical axis corresponds to the “lightness” (also said “value” or “brightness”). To put it simple, the lightness is there to move your color to white or to black. When you’re making a pure color (like red, blue, orange, etc.), you’ll have lightness to 50%. If you want to darken or lighten your color without turning it into an ugly grey, then you’ll change the lightness value.</p>
<h3>How do we define HSL colors?</h3>
<p>To describe a color using the HSL representation, you have to define parameters for hue, saturation and lightness. If you don’t know how to start, this is what I recommand:</p>
<ul>
<li><strong>Hue</strong>: choose your color on the chromatic wheel. If it’s red, then the value is 0. If it’s purple, the value would be about 300, and so on.</li>
<li><strong>Saturation</strong>: if you want a pure color, then the saturation value will be 100%. If you want some kind of grey, try a value lower than 100%.</li>
<li><strong>Lightness</strong>: if you want a pure color, then the lightness value will be 50%. If you want a light color, try something between 50% and 100%. If you want something dark, try below 50%.</li>
</ul>
<pre class="language-css"><code>.white { /* I’m white! */
	color: hsl(0, 0%, 100%);
}

.black { /* I’m black! */
	color: hsl(0, 0%, 0%);
}

.red { /* I’m red! */
	color: hsl(0, 100%, 50%);
}</code></pre>
<p class="note">Note: when you want black or white, whatever the hue value you set since it’s not on the wheel. It means <code>hsl(0, 0%, 100%)</code>, <code>hsl(120, 0%, 100%)</code> and <code>hsl(240, 0%, 100%)</code> are all 3 white.</p>
<p class="note">Note: the hue value is expressed in degrees but you don’t have to set the unit. Actually you must not set the unit; the parser won’t understand it.</p>
<h3>What about the alpha-channel?</h3>
<p>As for RGBa, you can set a value for the alpha-channel on a HSL color. It works exactly the same way RGBa does: it accepts a float value between 0 and 1 such as 0.56.</p>
<pre class="language-css"><code>.parent {
	background-image: url(‘my-picture.jpg’);
}

.child {
	background: hsla(0, 0%, 100%, 0.75);
	color: hsl(0, 0%, 30%);
}</code></pre>
</section>
<section id="system-colors">
<h2>System colors <a href="#system-colors" class="section-anchor">#</a></h2>
<p>You may or may not have heard about System colors. At first, I didn’t want to talk about them because they are deprecated in the CSS3 specification but I thought it could be interesting to drop a few lines just in a matter of curiosity.</p>
<p>System colors are a little bit special since they are not matched to a RGB equivalent, at least not directly. They are keywords associated to a color related to the user’s operating system (Windows XP, Mac OS X, Linux Ubuntu, etc.) like <code>buttonFace</code> or <code>activeBorder</code>.</p>
<p>Since the goal of CSS specifications is to standardize things, you understand why they announced System colors as deprecated. Plus, not all operating systems support all the System color keywords; basically it’s a mess.</p>
<p>If you want a complete list of system color keywords, please refer to <a href="https://developer.mozilla.org/fr/docs/CSS/color_value">this documentation on Mozilla Developer Network</a>.</p>
<h2>What to use when?</h2>
<p>Honestly, this is really up to you. In the end, a RGB triplet is generated, parsed and applied no matter the way you displayed it. The browser parser doesn’t care if you prefer <code>hsl(0, 100%, 50%)</code> over <code>rgba(255, 0, 0, 1)</code>.</p>
<pre class="language-css"><code>/* This will be red, whatever you pick */
.red { color: red; } 
.red { color: #f00; }
.red { color: #ff0000; }
.red { color: rgb(255, 0, 0); } 
.red { color: rgb(100%, 0%, 0%); } 
.red { color: rgba(255, 0, 0, 1); }
.red { color: rgba(100%, 0%, 0%, 1); }
.red { color: hsl(0, 100%, 50%); }
.red { color: hsla(0, 100%, 50%, 1); }</code></pre>
<p>Now if you want my way of doing with colors, here is what I do in most cases:</p>
<ul>
<li><strong>RGB</strong>: by itself, I don’t use RGB since I usually use a color picker giving me hex triplet. But when I need to edit the alpha-channel, I use RGBa of course.</li>
<li><strong>Hexadecimal</strong>: this is what I use the most in real projects. As said above, any web color picker on the internet will give you at least a hex code. It’s kind of the standard.</li>
<li><strong>Keywords</strong>: I use them either for demos when I don’t care much about the color I pick, or for greyscale like white, black and silver.</li>
<li><strong>HSL</strong>: I never use HSL because I’m not used to it. It’s a really really good representation of the RGB model but it doesn’t look very intuitive to me so I stick with RGB.</li>
</ul>
<p>What I think is really cool with HSL however is the fact you can get a shade instead of another color by tweaking the lightness. This is a thing you can’t do with other syntaxes.</p>
</section>
<section id="preprocessors">
<h2>Colors ands CSS preprocessors <a href="#preprocessors" class="section-anchor">#</a></h2>
<p>CSS preprocessors (at least some of them) provide built-in functions to play with colors. Things like saturate, darken, hue rotation and such. Let me introduce some of them.</p>
<h3>LESS (<a href="http://lesscss.org/#-color-functions">doc</a>)</h3>
<pre class="language-scss"><code>lighten(@color, @percentage);               /* Makes lighter */
darken(@color, @percentage);                /* Makes darker */

saturate(@color, @percentage);              /* Makes more saturated*/
desaturate(@color, @percentage);            /* Makes less saturated*/

fadein(@color, @percentage);                /* Makes more opaque */
fadeout(@color, @percentage);               /* Makes more transparent */ 
fade(@color, @percentage);                  /* Gives the color 50% opacity */

spin(@color, @degrees);                     /* Rotates the hue wheel 10° */

mix(@color1, @color2, @percentage);         /* Mixes 2 colors with a default weight of 50% */
contrast(@color1, @darkcolor, @lightcolor); /* Returns @darkcolor if the color is >50% luma (i.e. is a light color) otherwise return @lightcolor */</code></pre>
<h3>Sass (<a href="http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html">doc</a>)</h3>
<pre class="language-scss"><code>rgba($color, $alpha)               /* Convert a hex color into a RGBa one */
red($color)                        /* Gets the red component */
green($color)                      /* Gets the green component */
blue($color)                       /* Gets the blue component */
mix($color-1, $color-2, [$weight]) /* Mixes 2 colors together with a default weight of 50% */

hue($color)                         /* Gets the hue component */
saturation($color)                  /* Gets the saturation component */
lightness($color)                   /* Gets the lightness component */
adjust-hue($color, $degrees)        /* Rotates the hue wheel */
lighten($color, $percentage)        /* Makes lighter */
darken($color, $percentage)         /* Makes darker */
saturate($color, $percentage)       /* Makes more saturated */
desaturate($color, $percentage)     /* Makes less saturated */

grayscale($color)                   /* Converts to grayscale */
complement($color)                  /* Returns the complement */
invert($color)                      /* Returns the inverse */

alpha($color)                       /* Gets the alpha component (opacity) */
opacity($color)                     /* Gets the alpha component (opacity) */
opacify($color, $percentage)        /* Makes more opaque */
fade-in($color, $percentage)        /* Makes more opaque */
transparentize($color, $percentage) /* Makes more transparent */
fade-out($color, $percentage)       /* Makes more transparent */</code></pre>
<h3>CSS Crush (<a href="http://the-echoplex.net/csscrush/">doc</a>)</h3>
<pre class="language-scss"><code>h-adjust($color $value)             /* Rotates the hue wheel */
s-adjust($color $value)             /* Changes the saturation */
l-adjust($color $value)             /* Changes the lightness */
a-adjust($color $value)             /* Changes the alpha-channel */</code></pre>
<h3>Stylus (<a href="http://learnboost.github.com/stylus/docs/bifs.html">doc</a>)</h3>

<pre class="language-scss"><code>red(color)          /* Gets the red component */
green(color)        /* Gets the green component */
blue(color)         /* Gets the blue component */
alpha(color)        /* Gets the alpha component */

dark(color)         /* Makes lighter */
light(color)        /* Makes darker */
hue(color)          /* Gets the hue component */
saturation(color)   /* Gets the saturation component */
lightness(color)    /* Gets the lightness component */</code></pre>
</section>
<section id="final-words">
<h2>Final words <a href="#final-words" class="section-anchor">#</a></h2>
<p>As I was documenting myself to write this article, I understood color stuff is very complicated either in optical, in paint or in digital. Those notions of “hex triplet”, “chromatic wheel”, “base 16”, “alpha” are so abstract we can face some difficulties to understand what they mean, what they represent.</p>
<p>Thankfully in CSS we don’t have to use a base 16 converter everytime we want to describe a color. Tools do it for us. But this is a really interesting topic, so I’d recommand you read about it. You’d be surprise how huge it can be!</p>
<p>Anyway, back to CSS, let me (re)introduce you a few awesome tools and resources to help you deal with colors:</p>
<ul>
<li><a href="http://fr.slideshare.net/maxdesign/css3-colors">CSS3 Colors slides</a> by Russ Weakley</li>
<li><a href="http://css.coloratum.com/">CSS Coloratum</a>, a color converter by Lea Verou</li>
<li><a href="http://tympanus.net/codrops/2012/09/17/build-a-color-scheme-the-fundamentals/">Build a color scheme: the fundamentals</a> by Patrick Cox</li>
<li><a href="http://tympanus.net/codrops/2012/11/26/using-transparency-in-web-design-dos-and-donts/">Using transparency in webdesign: dos and don'ts</a> by Carrie Cousins</li>
<li><a href="http://tympanus.net/codrops/2012/02/28/principles-of-color-and-the-color-wheel/" title="Principles of Color and the Color Wheel">Principles or Color and the Color Wheel</a> by Carrie Cousins</li>
<li><a href="https://kuler.adobe.com/">Kuler</a> by Adobe</li>
<li><a href="http://colorschemedesigner.com/">Color Scheme Designer</a></li>
<li><a href="http://0to255.com/">0to255</a></li>
<li><a href="http://meyerweb.com/eric/css/colors/">Color Equivalents Table</a> by Eric Meyer</li>
<li><a href="http://www.xanthir.com/blog/b4JC0">CSS Color Keyword Distribution</a> by Tab Atkins Jr. (<a href="http://meyerweb.com/eric/css/colors/hsl-147.html">original work</a> by Eric Meyer)</li>
<li><a href="http://www.jessechapo.com/posts/Developers-Guide-to-Images.html">Developers guide to images</a></li>
<li><a href="http://colour.charlottedann.com/">Official Brand Colors</a> by Charlotte Dann</li>
</ul>
<p>Thanks a lot for reading this article. If you have any question or feedback, please be sure to share. Also, if you find any mistake, I'd be glad to correct it. ;)</p>
</section>