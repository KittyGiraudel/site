---
disqus: http://hugogiraudel.com/blog/sass-structure
title: "A closer look at my Sass structure"
tags:
  - sass
  - architecture
---

> **Edit (2014/05/13):** after a year, I got much better with Sass architecture. I suggest you have a look at <a href="http://www.sitepoint.com/architecture-sass-project/">this post.

<!-- -->

> **Edit (2013/02/27):** this post contains valuable yet outdated informations. To have a look at my current Sass structure, please have a look at <a href="https://github.com/HugoGiraudel/hugogiraudel.github.com/tree/master/sass">the GitHub repo.

Hi guys! Ever since the redesign a few weeks ago I have never stopped trying optimizing the performance of the site. One of my biggest concerns was having a stylesheet which is both nice and efficient.

I think I’ve come pretty close to this point thus I thought it might be a good idea to write a bit about it and give you an inside glance at the whole thing.

Please, consider this post as both a way to introduce some people to Sass and a way to ask Sass experts some advices about the way I handled things. Any comment appreciated. :)

## Divide and rule 

One of the biggest problem one faces when building a stylesheet is the size. Depending on the number of pages, elements and templates on your site, you might end up with a huge stylesheet heavy like hell and not so maintainable.

I think one of the best things when using a CSS preprocessor -whatever is your cup of tea- is you can split your stylesheets into several parts without risking degrading the performances.

This is exactly what I did, spliting my stylesheets into parts. As of writing, I currently have 5 different pieces (5 different .scss files):

* `_font-awesome.scss`: [Font Awesome](http://fortawesome.github.com/Font-Awesome/) is the icon font I use in the site
* `_google-fonts.scss`: this is the snippet from [Google Web Fonts](http://www.google.com/webfonts)
* `_prism.scss`: [Prism.js](http://prismjs.com/) is the syntax highlighter
* `_helpers.scss`: this file contains my mixins, variables and helper classes
* `_styles.scss`: the core of the CSS


*Note: .scss files starting with a `_` are not compiled into .css files.*

Since my website isn’t that big, I didn’t have to split the code stylesheet into smaller parts like typography, header, footer, modules, etc.

So basically, my central stylesheet (`styles.min.scss` compiled into `styles.min.css`) looks like this:

```scss
@import "compass/css3/images";
@import "compass/css3";

@import "font-awesome", 
        "google-fonts", 
        "prism", 
        "helpers", 
        "styles";
```

The first two lines are Compass related imports. It doesn’t compile into the final CSS. They enable use of Compass embedded mixins, sparing me from writing vendor prefixes. The last line imports the 5 files into a single one (top to bottom).

*Note: when importing Sass/SCSS files, you don't need to add underscores or file extensions.*

## KISS (Keep It Simple Stupid) 

At first I was using [the 1140px grid](http://cssgrid.net) but then it occurred to me I didn’t need a framework as simple as it is to handle a 2-columns layout. I could do it myself and so did I. 

My point is: I decided to keep my stylesheet as simple (light) as possible. Thus, I did a huge cleaning in the font-awesome stylesheet. I only kept what was needed: the @font-face call, about ten lines to improve icons position, and the 8 icons I use on the whole site (instead of about 300).

## Helpers 

Depending on your project size, you may have various files for that. Maybe one file for variables, one file for mixins, one file for helper classes, and whatever else you like.

My project is fairly (not to say really) small so I gathered everything into a single file. Let’s dig a little bit into it, part by part.

### Mixins

```scss
// Mixin providing a PX fallback for REM font-sizes

@mixin font-size($val) {
    font-size: ($val * 20) + px;
    font-size: $val + rem;
}

// Mixin handling breakpoints for media queries

@mixin breakpoint($point) {
    @if $point == mama-bear {
        @media (max-width: 48em) { @content; }
    }
    @if $point == baby-bear {
        @media (max-width: 38em) { @content; } 
    }
}
```

Just two. Why having one hundred mixins when you use just two? The first one allows me to use `rem` safely for font-size by providing a `px` fallback. This is a very nice mixin from Chris Coyier at [CSS-tricks](http://css-tricks.com/snippets/css/less-mixin-for-rem-font-sizing/). 

The second one also comes from [CSS-tricks](http://css-tricks.com/media-queries-sass-3-2-and-codekit/) and is a nice way to handle breakpoints for Media Queries within a single MQ declaration. If either I want to change the breakpoints, I don’t have to go through all my stylesheets to find occurrences; all I have to do is edit it in the mixin.

Whenever I want to use a Media Query, I just have to run `@include breakpoint(baby-bear) { /* My stuff here */ }`.

*Note: I use `em` in media queries in order to prevent some layouts problem when zooming in the browser. More about it in [this article](http://blog.cloudfour.com/the-ems-have-it-proportional-media-queries-ftw/) from Lyza Gardner.

### Variables

Ah variables. The most awesome thing in any informatic language in the world. This little piece of thing that spare you from repeating again and again the same things. 

Native CSS variables are coming but currently only supported by Chrome so meanwhile we rely on CSS preprocessors for variables. I have to say I really didn’t use much in my project. Actually I used 4, not more.

```scss
$pink: #FF3D7F;
$lightgrey: #444;
$mediumgrey: #666;
$darkgrey: #999;
```

At first I named my variables like `$color1`, `$color2`, etc but then it occurred to me I was not able to know what variable I had to set in order to have the right color so I switched back to real color names. It feels easier to me this way.

### Helper classes

Helpers are classes you can add to any element to have a quick effect without having to give this element any id or specific class, then set styles and all this stuff.

I have quite a few helper classes, some very useful, other a bit less but I use them all in the site. This kind of collection grow up as the project grow so for now it’s kind of small.

Let's start with the basics:

* `%clearfix` is an invisible class meant to be extended (@extend) to clear floats in an element containing only floated elements
* `.icon-left` and `.icon-right` are used on inline icons to prevent them from sticking the text
                   

```scss
%clearfix {
  &:after {
    display: table;
    content: "";
    clear: both 
  }
}

.icon-left { margin-right: 5px }
.iconright { margin-left: 5px }
```

Then, two helpers to give content specific meaning:

* `.visually-hidden` simply make the text disappear while keeping it accessible for both screen readers and search engine bots.
* `.note` is used to tell a paragraph is a note which could be removed without affecting the sense of the content


```scss
.visually-hidden { 
  position: absolute; 
  overflow: hidden; 
  clip: rect(0 0 0 0); 
  height: 1px; width: 1px;
  margin: -1px; 
  padding: 0; 
  border: none; 
}

.note {
  font-style: italic;
  padding-left: 1em;
}
```

And now let's dig into more interesting stuff. I have built some useful classes to pull images or quotes out of the flow and put them on the side in order to emphasize them. Both are built in the same way:

* `%pull-quote` and `%pull-image` are invisible classes; it means they won’t be compiled in the stylesheet, they are only here to be extended
* `.pull-quote--left`, `.pull-quote--right`, `.pull-image--left` and `.pull-image--right` respectively inherit (`@extend`) styles from `%pull-quote` and `%pull-image`
* Plus, they have some specific styles like margins, float, borders, etc.
* On small screens, they are not floated any more, pulled back in the flow and centered

```scss
%pull-image {
  max-width: 15em;
  display: block;

  @include breakpoint(baby-bear) { 
    float: none;
    width: 100%;
    margin: 1em auto;
  }
}

.pull-image--left {
  @extend %pull-image;
  float: left;
  margin: 0 1em 1em 0;
}

.pull-image--right {
  @extend %pull-image;
  float: right;
  margin: 0 0 1em 1em;
}

%pull-quote {
  max-width: 250px;
  width: 100%;
  position: relative;
  line-height: 1.35;
  font-size: 1.5em;

  &:after,
  &:before {
    font-weight: bold;
  }

  &:before { content: '\201c'; }
  &:after  { content: '\201d'; }

  @include breakpoint(baby-bear) { 
    float: none;
    margin: 1em auto;
    border: 5px solid $pink;
    border-left: none;
    border-right: none;
    text-align: center;
    padding: 1em 0.5em;
    max-width: 100%;
  }
}

.pull-quote--left {
  @extend %pull-quote;
  text-align: right;
  float: left;
  padding-right: 1em;
  margin: 0 1em 0 0;
  border-right: 6px solid $pink;
}

.pull-quote--right {
  @extend %pull-quote;
  text-align: left;
  float: right;
  padding-left: 1em;
  margin: 0 0 0 1em;
  border-left: 6px solid $pink;
}
```

Please note how I nest media queries inside their related selectors. There are two main reasons for this:

* This makes the stylesheet easier to maintain since you have everything at the same place: regular rules + conditional rules. No need of going at the bottom of the stylesheet to find all the conditional CSS.
* When compiling, Sass doesn’t generate a bunch of media queries but a single one. So no performance issue on this point.

*Note: if you ever wonder about the double dashes or underscores in class names, it is related to the BEM (Block Element Modifier) approach. More on the topic in [this excellent post](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) from Harry Roberts.*

## Core of styles

Now we’ve seen pretty much everything else than what makes the site what it is, I think it’s time to dig into the main stylesheet. For reading concern I’ll split it into several code snippets here. Plus it will be easier for commenting.

### Reset

This is not optional, every project needs to use some kind of way to reset CSS styles. Depending on your tastes it might be [Eric Meyer’s CSS reset](http://meyerweb.com/eric/tools/css/reset/), [Normalize CSS](http://necolas.github.com/normalize.css/) or as I like to call it the **barbarian CSS** as below.

```scss
*,
*:before,
*:after {
  @include box-sizing(border-box);
  padding: 0;
  margin: 0;
}
```

Yes I know, this is dirty. I shouldn’t not reset CSS this way but honestly on small projects like this, it’s really not a big deal. At first I used Normalize CSS but then I realized loading kilobytes of code when 2 lines are enough is not necessary. So barbarian CSS reset guys!


Please note I use the simplest box-sizing since IE (all versions) represents less than 1.5% of my traffic.

### Overall stuff

I didn’t really know how to call this.

```scss
html {
  font: 20px/1 "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue","Helvetica","Arial","Lucida Grande",sans-serif;
  color: #555;
  text-shadow: 0 1px rgba(255,255,255,0.6);

  border-left: 6px solid $pink;
  background-image: url("data:image/png;base64,hErEiSaFuCkInGlOnGdAtAuRiaSaBaCkGrOuNd");

  @include breakpoint(baby-bear) { 
    border-left: none;
    border-top: 5px solid $pink;
  }
}

a {
  color: $pink;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
```

Basic stuff here. Font-size, color, font-families, text-shadows and everything that needs to cascade on the whole document are set on the root element (`html`). I also give a little custom styles to anchor tags.

### Containers

This used to be in the 1140px stylesheet but since I don’t use anymore, I moved it back here. It’s all about main wrappers and containers.

```scss
.row {
  width: 100%;
  max-width: 57em;
  margin: 0 auto;
  padding: 0 1em;
}

.main {
  @extend %content;
  width: 68%;
  margin-right: 2%;

  @include breakpoint(mama-bear) { 
    margin-right: 0;
    border-bottom: 3px solid #D1D1D1;
  }
}

.sidebar {
  @extend %content;
  width: 30%;
  padding-top: 2em;
}

%content { 
  padding-bottom: 3em;
  float: left;

  @include breakpoint(mama-bear) {
    float: none;
    width: 100%;
  }
}
```

`.row` is the main wrapper: it contains the header, the main column (`.main`), the sidebar (`.sidebar`) and the footer.

`.content` is an invisible shared class between both the main column and the sidebar.

## Final words 

I deliberately skipped the rest of the stylesheet since I think it's not the most interesting part in my opinion. It mostly consists on setting styles for various content elements like paragraphs, lists, tables, images, titles, and so on. Plus, it's classic CSS, not really SCSS magic.

I think I have covered most of my Sass structure. If you feel like something could be improved or if you have any question, please be sure to drop a comment. :)
