---
title: 'Colors in CSS'
tags:
  - css
  - colors
---

Hi everyone! Today, we will talk about colors in CSS. There are many color specifications and we’ll be talking about their history, what they mean and how to use them.

If you’d like to read about how to build a color scheme for a website then you might be interested in this article [Build a color scheme: the fundamentals](https://tympanus.net/codrops/2012/09/17/build-a-color-scheme-the-fundamentals/), or the article [Principles of Color and the Color Wheel](https://tympanus.net/codrops/2012/02/28/principles-of-color-and-the-color-wheel/) if you’d like to read about the color wheel.

We will see how we can define colors in style sheets, what each one can be used for and more. But first, let me introduce the topic.

## Various types of colors in CSS

Colors in CSS are defined on a [sRGB](https://en.wikipedia.org/wiki/SRGB) color space. sRGB stands for “Standard Red Green Blue” where colors are defined through three channels: Red, Green and Blue.

From there, we have various ways to describe color with CSS. Some of them like keywords and hexadecimal has been there almost since the beginning of the web, while other like HSL or RGB came later.

- **RGB** and **RGBA**
- **Hexadecimal**
- **Keywords** (+transparent and currentColor)
- **HSL** and **HSLA**
- **System colors**

Let’s talk about each one of these definitions to understand them better.

## RGB

Let me start with the RGB syntax since it’s the most fundamental thing to understand in order to comprehend how other notations like hexadecimal work.

### What is RGB?

As I said above, RGB stands for Red, Green and Blue. Remember when you were a little kid and were painting with some cheap watercolor? Well, this is kind of the same thing, except that colors behave a little bit differently on screen and on paper. Let me explain myself:

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

> ![Color cube](/assets/images/css-colors/color-cube.jpg) This picture is the RGB color model mapped to a cube. What you can see is this: the horizontal x-axis as red values increasing to the left, y-axis as blue increasing to the lower right, and the vertical z-axis as green towards the top. The origin, black, is the vertex hidden from the view.

### How do we define RGB colors?

To describe a color using the RGB model, you have to define a value for the red channel, a value for the green channel and a value for the blue channel. Okay, but what type of value? Percentages? Arbitrary? Any?

A RGB value can be defined using four different syntaxes but only two of them are available in CSS:

- A percentage from 0% (black) to 100% (white)
- An integer value from 0 (black) to 255 (white); 255 is the range of a 8-bit byte
- A float number from 0 to 1 (0.58935); it’s more like a theoretical approach **unavailable in CSS**
- A large integer 10, 16, 24, 32, 48 or even 64-bit units, but clearly that’s **unavailable in CSS**

So, summarized, we end up with two different ways to display CSS colors with the `rgb()` function: percentages and integers between 0 and 255. Let’s illustrate this with an example, shall we?

```css
.black {
  /* I’m black! */
  color: rgb(0, 0, 0);
  color: rgb(0%, 0%, 0%);
}

.white {
  /* I’m white! */
  color: rgb(255, 255, 255);
  color: rgb(100%, 100%, 100%);
}

.purple {
  /* I’m medium purple! */
  color: rgb(128, 0, 128);
  color: rgb(50%, 0%, 50%);
}

.light-purple {
  /* I’m fuchsia! */
  color: rgb(255, 0, 255);
  color: rgb(100%, 0%, 100%);
}

.dark-purple {
  /* I’m deep purple! */
  color: rgb(64, 0, 64);
  color: rgb(25%, 0%, 25%);
}
```

**Important**: when using percentages, you have to set the unit even if it is 0. If you don’t, some browsers may be unable to parse it.

_Note: even if the percentage version seems more intuitive, it’s actually the integer version that seems to be more commonly used._

### What about the alpha-channel?

As seen previously, while using the RGB system we can also use an alpha channel which is by default set to 1. This channel allows us to modify the opacity of a color, or its transparency if you will.

To use this channel in CSS, you’ll call the `rgba()` function instead of the `rgb()`. However note the alpha-channel is always defined with a float clamped between 0 and 1.

```css
.black {
  /* I’m half transparent black! */
  color: rgba(0, 0, 0, 0.5);
  color: rgba(0%, 0%, 0%, 0.5);
}

.white {
  /* I’m 2/3 transparent white! */
  color: rgba(255, 255, 255, 0.33);
  color: rgba(100%, 100%, 100%, 0.33);
}

.red {
  /* I’m fully transparent red, so kind of invisible */
  color: rgba(255, 0, 0, 0);
  color: rgba(100%, 0%, 0%, 0);
}
```

This can be very useful in various situation. Let’s say you have some kind of background image and want to write on it without losing readability or putting a big white box on top of it. This is the perfect usecase for RGBa!

```css
.parent {
  background-image: url(‘my-picture.jpg’);
}

.child {
  background: rgba(255, 255, 255, 0.75);
  color: rgb(51, 51, 51);
}
```

This way, the child element will have a white background with 75% opacity, showing its parent’s background without risking any issue with readability.

\*Note: when dealing with decimal values between 0 and 1, you don’t have to write the 0 before the dot. So you can write `rgba(0, 0, 0, .5)` and still be perfectly valid.

_Note: the `rgb()` function is perfectly valid CSS2.1. However the `rgba()` function is part of the CSS3 specification and is not supported by all browsers (Internet Explorer 6, 7, 8)._

## Hexadecimal

### What is hexadecimal?

Most of the time, CSS colors are specified using the hexadecimal format which is a 6 (or 3) characters long string using numbers from 0 to 9 and letters from A to F, starting by the hash sign # (ex: #1A2B3C). We refer as this syntax as a “hex triplet”.

Okay, but what does this mean? I agree it’s not that simple. Basically, hexadecimal colors are some sort of code for RGB colors: the first two characters stand for the red value; the 3rd and 4th characters stand for greens; and the last two characters are here for the blue.

Since the range of a 8-bit byte is 256, we usually use a base 16 system to display values. This system is called hexadecimal. So basically those 3\*2 digits stand for 3 values from 0 to 255 converted to base 16, as you would do in RGB.

Okay, I can understand you’re lost here, so we’ll try a little example. Let’s say you want to make a pure red (rgb(255, 0, 0)): thanks to [this awesome converter](http://wims.unice.fr/wims/wims.cgi), you convert 255 to base 16 and know it equals FF. If you try to convert 0, you’ll see it’s 0 as well in base 16. So your hex triplet would be #FF0000. Simple, isn’t it?

So this was the theory, alright? It doesn’t mean you have to use a base 16 converter every single time you want to use a color in CSS. I’m simply explaining you how are hexadecimal colors composed. Now in real life, you’ll simply use a color palette like Photoshop or whatever.

\*Note: you may see some hex triplets reduced to 3 digits instead of 6. It only happens when the two digits of each of the 3 components of the triplet are the same. To apply it on our previous example, the red color (#FF0000) can be written like #F00. If any of the 3 components have 2 different digits, you can’t do this.

### What about transparency?

Alas, you can’t edit the alpha-channel when defining colors in hexadecimal, it’s actually not possible. If ever you really want to change the opacity, you still can turn your hex triplet to a RGBa quadruplet, or use the opacity property.

**Important**: however beware of the opacity property. It changes the opacity of the element itself, and all its child elements. Plus, it is [not supported by Internet Explorer 6, 7 and 8](https://caniuse.com/#feat=css-opacity).

## Keywords

### What are color keywords?

The fact is, hexadecimal is really unfriendly. Nobody knows what color is associated to a hex triplet at the first glance, because it’s a computed syntax by the machine and for the machine.

RGB is slightly better, especially when you’re using percentage values but it’s not wonderful either. If I tell you `rgb(54%, 69%, 23%)`, can you tell me what color it will be? Even approximately? I guess not.

That’s why there are keywords. Keywords are real color names like red, green and blue associated to actual RGB / hex triplets. Back in the days, the HTML 4.01 Standard proposed 16 different keywords:

- Aqua
- Black
- Blue
- Fuchsia
- Gray
- Green
- Lime
- Maroon
- Navy
- Olive
- Purple
- Red
- Silver
- Teal
- White
- Yellow

<p>Then the CSS2.1 specification added the orange keyword. Finally, CSS3 came with 130 additional keywords for a total of 147 keywords (134 non-gray, 13 gray).</p>

I won’t list all of them here because it would be too long however, this is a visualization of all of them on a hue wheel by [Eric Meyer](https://meyerweb.com/eric/css/colors/hsl-147.html) (see [annotated version by Tab Atkins Jr.](https://www.xanthir.com/blog/b4JC0)):

![Color wheel](/assets/images/css-colors/color-wheel.jpg)

The point of this work is to show keywords are associated to random colors: they are chosen according to their position on the hue wheel.

Eric Meyer also created a color equivalents table in order to know what keyword is associated to which color, with hexadecimal, RGB (both syntax) and HSL versions you [can find here](https://meyerweb.com/eric/css/colors/).

### Keywords usage

The point of keywords is to use basic colors with words that actually mean something. I say “basic” because most of the time, you’ll want a custom color who doesn’t have a keyword. But whenever you want to use a plain red or a silver grey, you don’t have to use a hex or RGB triplet; you can use the keyword.

_Note: the 147 keywords are all perfectly valid, even on old browsers like Internet Explorer 6._

### Special keywords

There are two keywords which are a little bit special since they do not refer to a RGB triplet. Those are `transparent` and `currentColor`.

#### Transparent

The transparent value exists since CSS1 but was only valid as a value for the background property. Nowadays `transparent` is a valid keyword for any property accepting a color value (color, border-color, background, shadows, gradients, etc.).

Its effect is pretty straight forward: it makes the color (or background-color or whatever) of the element transparent, as it is by default when no color is specified.

What’s the point you say? To restore the default transparent color if a color value you can’t remove is already set.

#### CurrentColor

The currentColor is a CSS3 value allowing you to take the color as a default value for another property. Have a look at the code below.

```css
.my-element {
  color: red;
  border-color: 5px solid currentColor;
}
```

The border will be red since the defined color is red. If no color was set, it would have been black, since the default value for the color property is black.

You want to know what’s awesome? `currentColor` is a default value for a bunch of things. From my tests:

- Border-color
- Color component in box-shadow
- Color component in text-shadow

It means you can do one of those and be perfectly valid:

```css
.my-element {
  color: red;
  border-color: 5px solid; /* This will be red */
  box-shadow: 10px 10px 5px; /* This will be red */
  text-shadow: 0 2px 1px; /* This will be red */
}
```

_Note: the cap on the C letter is not required. It’s only a writing convention._

## HSL

### What is HSL?

HSL stands for Hue, Saturation and Lightness. Please don’t worry, HSL is not another format of color. It’s only another representation of the RGB model. This cylindric representation aims at showing the RGB model in a more intuitive way than the previous seen cube.

![Color HSL](/assets/images/css-colors/color-hsl.jpg)

#### Hue

The angle around the central vertical axis of the cylinder corresponds to the “hue”, which is basically the color you want. Take a chromatic wheel: at 0° you have red, at 120° you have green, at 240°you have blue and you go back to red when you reach 360°.

![Color Wheel](/assets/images/css-colors/color-wheel.png)

#### Saturation

The distance from the central vertical axis of the cylinder corresponds to “saturation” (also called “chroma”). It can be understood as the quantity of black and white you add to your color. When set to 100%, the color is “pure”, but when you reduce the saturation you’re creating a “mixture”, progressively moving your color to some kind of grey.

#### Lightness

The distance along the vertical axis corresponds to the “lightness” (also said “value” or “brightness”). To put it simple, the lightness is there to move your color to white or to black. When you’re making a pure color (like red, blue, orange, etc.), you’ll have lightness to 50%. If you want to darken or lighten your color without turning it into an ugly grey, then you’ll change the lightness value.

### How do we define HSL colors?

To describe a color using the HSL representation, you have to define parameters for hue, saturation and lightness. If you don’t know how to start, this is what I recommand:

- **Hue**: choose your color on the chromatic wheel. If it’s red, then the value is 0. If it’s purple, the value would be about 300, and so on.
- **Saturation**: if you want a pure color, then the saturation value will be 100%. If you want some kind of grey, try a value lower than 100%.
- **Lightness**: if you want a pure color, then the lightness value will be 50%. If you want a light color, try something between 50% and 100%. If you want something dark, try below 50%.

```css
.white {
  /* I’m white! */
  color: hsl(0, 0%, 100%);
}

.black {
  /* I’m black! */
  color: hsl(0, 0%, 0%);
}

.red {
  /* I’m red! */
  color: hsl(0, 100%, 50%);
}
```

\*Note: when you want black or white, whatever the hue value you set since it’s not on the wheel. It means `hsl(0, 0%, 100%)`, `hsl(120, 0%, 100%)` and `hsl(240, 0%, 100%)` are all 3 white.

\*Note: the hue value is expressed in degrees but you don’t have to set the unit. Actually you must not set the unit; the parser won’t understand it.

### What about the alpha-channel?

As for RGBa, you can set a value for the alpha-channel on a HSL color. It works exactly the same way RGBa does: it accepts a float value between 0 and 1 such as 0.56.

```css
.parent {
  background-image: url(‘my-picture.jpg’);
}

.child {
  background: hsla(0, 0%, 100%, 0.75);
  color: hsl(0, 0%, 30%);
}
```

## System colors

You may or may not have heard about System colors. At first, I didn’t want to talk about them because they are deprecated in the CSS3 specification but I thought it could be interesting to drop a few lines just in a matter of curiosity.

System colors are a little bit special since they are not matched to a RGB equivalent, at least not directly. They are keywords associated to a color related to the user’s operating system (Windows XP, Mac OS X, Linux Ubuntu, etc.) like `buttonFace` or `activeBorder`.

Since the goal of CSS specifications is to standardize things, you understand why they announced System colors as deprecated. Plus, not all operating systems support all the System color keywords; basically it’s a mess.

If you want a complete list of system color keywords, please refer to [this documentation on Mozilla Developer Network](https://developer.mozilla.org/fr/docs/CSS/color_value).

## What to use when?

Honestly, this is really up to you. In the end, a RGB triplet is generated, parsed and applied no matter the way you displayed it. The browser parser doesn’t care if you prefer `hsl(0, 100%, 50%)` over `rgba(255, 0, 0, 1)`.

```css
/* This will be red, whatever you pick */
.red {
  color: red;
}
.red {
  color: #f00;
}
.red {
  color: #ff0000;
}
.red {
  color: rgb(255, 0, 0);
}
.red {
  color: rgb(100%, 0%, 0%);
}
.red {
  color: rgba(255, 0, 0, 1);
}
.red {
  color: rgba(100%, 0%, 0%, 1);
}
.red {
  color: hsl(0, 100%, 50%);
}
.red {
  color: hsla(0, 100%, 50%, 1);
}
```

Now if you want my way of doing with colors, here is what I do in most cases:

- **RGB**: by itself, I don’t use RGB since I usually use a color picker giving me hex triplet. But when I need to edit the alpha-channel, I use RGBa of course.
- **Hexadecimal**: this is what I use the most in real projects. As said above, any web color picker on the internet will give you at least a hex code. It’s kind of the standard.
- **Keywords**: I use them either for demos when I don’t care much about the color I pick, or for greyscale like white, black and silver.
- **HSL**: I never use HSL because I’m not used to it. It’s a really really good representation of the RGB model but it doesn’t look very intuitive to me so I stick with RGB.

What I think is really cool with HSL however is the fact you can get a shade instead of another color by tweaking the lightness. This is a thing you can’t do with other syntaxes.

## Colors ands CSS preprocessors

CSS preprocessors (at least some of them) provide built-in functions to play with colors. Things like saturate, darken, hue rotation and such. Let me introduce some of them.

### [LESS](http://lesscss.org/#-color-functions)

```less
lighten(@color, @percentage);               /* Makes lighter */
darken(@color, @percentage);                /* Makes darker */

saturate(@color, @percentage);              /* Makes more saturated*/
desaturate(@color, @percentage);            /* Makes less saturated*/

fadein(@color, @percentage);                /* Makes more opaque */
fadeout(@color, @percentage);               /* Makes more transparent */
fade(@color, @percentage);                  /* Gives the color 50% opacity */

spin(@color, @degrees);                     /* Rotates the hue wheel 10° */

mix(@color1, @color2, @percentage);         /* Mixes 2 colors with a default weight of 50% */
contrast(@color1, @darkcolor, @lightcolor); /* Returns @darkcolor if the color is >50% luma (i.e. is a light color) otherwise return @lightcolor */
```

### [Sass](https://sass-lang.com/docs/yardoc/Sass/Script/Functions.html)

```scss
rgba($color, $alpha)               /* Convert a hex color into a RGBa one */
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
fade-out($color, $percentage)       /* Makes more transparent */
```

### [Stylus](http://stylus-lang.com/docs/bifs.html)

```stylus
red(color)          /* Gets the red component */
green(color)        /* Gets the green component */
blue(color)         /* Gets the blue component */
alpha(color)        /* Gets the alpha component */

dark(color)         /* Makes lighter */
light(color)        /* Makes darker */
hue(color)          /* Gets the hue component */
saturation(color)   /* Gets the saturation component */
lightness(color)    /* Gets the lightness component */
```

## Final words

As I was documenting myself to write this article, I understood color stuff is very complicated either in optical, in paint or in digital. Those notions of “hex triplet”, “chromatic wheel”, “base 16”, “alpha” are so abstract we can face some difficulties to understand what they mean, what they represent.

Thankfully in CSS we don’t have to use a base 16 converter everytime we want to describe a color. Tools do it for us. But this is a really interesting topic, so I’d recommand you read about it. You’d be surprise how huge it can be!

Anyway, back to CSS, let me (re)introduce you a few awesome tools and resources to help you deal with colors:

- [Canva](https://www.canva.com/colors/)
- [CSS3 Colors slides](https://fr.slideshare.net/maxdesign/css3-colors) by Russ Weakley
- [Build a color scheme: the fundamentals](https://tympanus.net/codrops/2012/09/17/build-a-color-scheme-the-fundamentals/) by Patrick Cox
- [Using transparency in webdesign: dos and don’ts](https://tympanus.net/codrops/2012/11/26/using-transparency-in-web-design-dos-and-donts/) by Carrie Cousins
- [Principles or Color and the Color Wheel](https://tympanus.net/codrops/2012/02/28/principles-of-color-and-the-color-wheel/) by Carrie Cousins
- [Kuler](https://kuler.adobe.com/) by Adobe
- [Paletton](http://paletton.com/)
- [0to255](http://0to255.com/)
- [Color Equivalents Table](https://meyerweb.com/eric/css/colors/) by Eric Meyer
- [CSS Color Keyword Distribution](https://www.xanthir.com/blog/b4JC0) by Tab Atkins Jr. ([original work](https://meyerweb.com/eric/css/colors/hsl-147.html) by Eric Meyer)
- [Developers guide to images](https://www.jessechapo.com/posts/Developers-Guide-to-Images.html)

Thanks a lot for reading this article. If you have any question or feedback, please be sure to share. Also, if you find any mistake, I’d be glad to correct it. ;)
