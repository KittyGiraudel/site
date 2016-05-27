---
layout: post
summary: true
title: "Sass-ify a CSS shape"
tags:
  - sass
  - mixin
  - star
---

A couple of days ago, [Ana Tudor](http://twitter.com/thebabydino) showed me how she managed to do a [pure CSS 6-point star](http://codepen.io/thebabydino/pen/DmklE) with a single element.

To be truely honest, I wasn’t impressed that much since I am pretty familiar with Ana’s work which is always amazing. If you haven’t seen [her 3D geometric shapes](http://stackoverflow.com/users/1397351/ana) made of pure CSS, then you definitely should.

<figure class="figure--right">
<img alt="" src="/assets/images/sass-mixin-star/css-star.png">
<figcaption>A 6-points star mixin made with CSS</figcaption>
</figure>

Anyway, when I saw this I thought it could be fun to make a [Sass version](http://codepen.io/HugoGiraudel/pen/LkoGE) of it to clean the code and ease the use. Let me show you what I ended up with.

## Understand the shape 

The first thing was to understand how Ana managed to achieve such a shape with a single element (and 2 pseudo-elements). Long story short: **chained CSS transforms**.

<figure class="figure--right">
<img src="/assets/images/sass-mixin-star/rhombius.png" alt="">
<figcaption>3 rhombius = a 6-points star</figcaption>
</figure>

Basically she stacks the element and its 2 pseudo-elements on top of each other after applying several chained transforms to each of them to have the appropriate shape (a [rhombus](http://www.mathopenref.com/rhombus.html)).

Instead of covering everything in here, I let you have a look at [this very clear explanation](http://codepen.io/thebabydino/full/ca5fdb3582a6a27e4d3988d6d90952cb) by Ana herself on CodePen.

*Note: we can do it with one single pseudo-element with the [border shaping trick](http://davidwalsh.name/css-triangles) but the hover doesn't feel right, and without pseudo-element with linear gradients.

## Compute the height 

I quickly noticed the height and the width of the main element were different. The width is a randomly picked number (10em), but the height seemed to be computed by some calculation since it was 8.66em.

At this point, I was already able to handle a mixin to create the star, but the user had to set both the width and the height. Yet, since the height has to be calculated, it wasn’t right. How is the user supposed to know the appropriate height for the width he set?

The user couldn’t figure this out and neither could I. So I asked Ana how to compute the height of the element based on the width. After a few complicated explanations, she finally gave me the formula (explanation [here](http://codepen.io/thebabydino/full/ca5fdb3582a6a27e4d3988d6d90952cb)).

```javascript
function computeHeight(x, skewAngle) { 
  return Math.sin((90 - skewAngle) * Math.PI / 180) * x 
}
```

Okay, this is JavaScript but it is a good start. However this returns a radian value, which is not what we want. We want degrees. So the correct function has to be this one:

```javascript
function computeHeight(x, skewAngle) { 
  return Math.sin(90 - skewAngle) * x 
}
```

> I had never heard of any `sin()` function in Sass.

From there, I knew how to get the height from the width, I only had to turn this into SCSS. First problem: <em>sin()</em>. I had never heard of any `sin()` function in Sass. Damn it.

After a little Google search, I stumbled upon [a not-documentated-at-all library](https://github.com/adambom/Sass-Math/blob/master/math.scss) to use advanced math functions in Sass (including `sin()`, `exp()`, `sqrt()`, and much more). Seemed good enough so I gave it a try.

It turned out the `power()` function (called in the `sin()` one) was triggering a Sass error. I tried a few things but finally couldn’t make it work. So I did something unusual... Looked at the 2nd page on Google. And bam, [the Holy Grail](http://compass-style.org/reference/compass/helpers/math/)!

Compass has built-in functions for advanced math calculation including `sin()`. Isn’t that great? Like really awesome? Building the Sass function was a piece of cake:

```scss
@function computeHeight($x, $skewAngle) { 
  @return sin(90deg - $skewAngle) * $x;
}
```

This worked like a charm. So **given only the width, Sass was able to calculate the according height.**

## Make any unit usable 

So everything was already working great but I forced the user to give a em-based unit which sucked. I wanted to make any unit available knowing that the `computeHeight()` function requires and returns a unitless value. Basically I had to:

1. get the value given by the user
1. split it to get both the integer and the unit
1. store the unit
1. pass the integer to the `computeHeight()` function
1. get the result
1. apprend the unit to it


I had a look in the Sass documentation and I found two related built-in function:

* [`unitless(number)`](http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html#unitless-instance_method) returns a boolean wether the value has a unit or not
* [`unit(number)`](http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html#unit-instance_method) returns the unit of the value


The first is useless in our case, but the second one is precisely what we need to store the unit of the value given by the user. However we still have no way to parse the integer from a value with a unit. At least not with a built-in function. A [quick run on Stack Overflow](http://stackoverflow.com/a/12335841) gave me what I was looking for:

> You need to divide by 1 of the same unit. If you use unit(), you get a string instead of a number, but if you multiply by zero and add 1, you have what you need.

```scss
@function strip-units($number) {
  @return $number / ($number * 0 + 1);
}
```

Do not ask me why it works or how does it work, I have absolutely no idea. This function makes strictly no sense yet it does what we need.

Anyway, at this point we can set the size in any unit we want, could it be `px`, `rem`, `vh`, `cm`, whatever.

## Improve tiny bits

Last but not least, Ana used the [inherit hack](http://xiel.de/webkit-fix-css-transitions-on-pseudo-elements/) to enable transition on pseudo-elements. She asked me if we had a way in Sass to assign the same value to several properties.

Of course we have, mixin to the rescue!

```scss
@mixin val($properties, $value) {
  @each $prop in $properties { 
    #{$prop}:  #{$value};
  }
}
```

You give this mixin a [list](http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#lists) of properties you want to share the same value and of course the value. Then, for each property in the list, the mixin outputs the given value. In our case:

```scss
.selector {
  &:after, &:before {
    @include val(width height background, 'inherit');
  }
}
```

... outputs:

```scss
.selector:before, .selector:after {
  width: inherit;
  height: inherit;
  background: inherit;
}
```

It’s really no big deal. We could totally write those 3 properties/value pairs, but it is great to see what’s possible with Sass, isn’t it?

## Full code 

Here is the full code for the mixin. As you can see, it is really not that big (especially since Ana's original code is very light).

```scss
@mixin val($properties, $value) {
  @each $prop in $properties { 
    #{$prop}: #{$value};
  }
}

@function computeHeight($x, $skewAngle) { 
  @return sin(90deg - $skewAngle) * $x;
}

@function strip-units($number) {
  @return $number / ($number * 0 + 1);
}

@mixin star($size) {
  $height: computeHeight(strip-units($size), 30deg);
  
  width: $size;
  height: #{$height}#{unit($size)};
  position: relative;
  
  @include transition(all .3s);
  @include transform(rotate(-30deg) skewX(30deg));
    
  &:before, 
  &:after {
    $properties: width, height, background;
    content: '';
    position: absolute;
    @include val($properties, 'inherit');
  }
    
  &:before { 
    @include transform(skewX(-30deg) skewX(-30deg)); 
  }
  &:after { 
    @include transform(skewX(-30deg) rotate(-60deg) skewX(-30deg)) 
  }
}
```

## Final words 

Well guys, that’s pretty much it. You have a perfectly working [Sass mixin](http://codepen.io/HugoGiraudel/pen/Lcexi) to create customized single-element 6-point stars in CSS. Pretty neat, right?

Using it couldn't be simpler:

```scss
.star {
  margin: 5em auto;
  background: tomato;
  @include star(10em);
  
  &:hover {
    background: deepskyblue;
  }
}
```

Thanks (and congratulations) to [Ana Tudor](http://twitter.com/thebabydino) for creating such a shape which made me do some cool Sass stuff.

