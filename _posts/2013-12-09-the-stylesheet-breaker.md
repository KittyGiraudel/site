---
title: The stylesheet breaker
keywords:
  - css
  - riddle
---

Or **how I found the one line of CSS that can break your entire stylesheet**. Hopefully it is very unlikely that you’ll ever write this line so worry not; you should be safe.

However this is definitely something good to know so you might want to move on with the read.

## How did it start

I was working on [Browserhacks](http://browserhacks.com) pretty late very other night and just when I was about to turn everything off and go to bed, I runned the site on Google Chrome to “check that everything’s okay”.

And everything seemed okay until I noticed one deficient [hack](http://browserhacks.com/#hack-ac2480b5c83038f2d838e2a62e28a307) we added a couple of days earlier, aiming for Chrome 29+ and Opera 16+. My Chrome 31.0.1650.57 didn’t seem targeted so I removed the hack from our database and added a note about it on our GitHub repository. No big deal.

But just to be sure, I launched Firefox (Aurora) to make some tests and then the same phenomenum happened: I noticed a deficient hack. And then another one. And another one. And another one. And again. What the fuck? All of our 9 hacks supposed to target latest Firefox seemed to be completely pointless against Firefox Aurora. Either this browser has become bulletproof during its last releases, or there was a problem on our side. The latter the more plausible, unfortunately.

First thing odd: all the JavaScript hacks were fine; only the CSS one were miserably failing. So I started checking the stylesheet dedicated to the hacks (merged into `main.css but whatever) and everything seemed good. I double checked the call, I double checked the selectors, I double checked many little things but no luck. Everything _seemed_ fine.

## Tracking down the culprit

Whenever you’re getting desperate about a bug, you start doing very unlikely things in hopes of solving your issues. I’m no exception so I started debugging like a blind man.

First thing I tried was removing the very first hack from the test sheet because it has a very weird syntax that I suspected could break things apart:

```css
.selector { (;property: value;); }
.selector { [;property: value;]; }
```

Pretty weird, right? Anyway that wasn’t the problem. Then I removed a second one that I knew could be an issue at some point: the collection of IE 7- hacks that rely on adding special characters at the beginning of the property:

```css
.selector { !property: value; }
.selector { $property: value; }
.selector { &property: value; }
.selector { *property: value; }
.selector { )property: value; }
.selector { =property: value; }
.selector { %property: value; }
.selector { +property: value; }
.selector { @property: value; }
.selector { ,property: value; }
.selector { .property: value; }
.selector { /property: value; }
.selector { `property: value; }
.selector { [property: value; }
.selector { ]property: value; }
.selector { #property: value; }
.selector { ~property: value; }
.selector { ?property: value; }
.selector { :property: value; }
.selector { |property: value; }
```

Well… BINGO! No more issue and all the CSS hacks were working again. Now that I found the deficient hack, I had to figure out which line could make the whole world explode (well, kind of). Not much to do except trying to remove them one by one to find out this one was guilty:

```css
.selector { [property: value; }
```

## About the line

Most CSS parsers are made in a way that if a line is not recognized as valid CSS, it is simply skipped. Mr. [Tab Atkins Jr.](https://twitter.com/tabatkins) explains it very well in his article [How CSS Handles Errors CSS](https://www.xanthir.com/blog/b4JF0):

> CSS was written from the beginning to be very forgiving of errors. When the browser encounters something in a CSS file that it doesn’t understand, it does a very minimal freak-out, then continues on as soon as it can as if nothing bad had happened.

Thus, CSS is not a language where a missing semi-colon can prevent your site from working. At best (worst?), it will break your layout because the one line with the missing semi-colon and the one line after it would not be executed. From the same source:

> If the browser is in trying to parse a declaration and it encounters something it doesn’t understand, it throws away the declaration, then seeks forward until it finds a semicolon that’s not inside of a {}, [], or () block.

This very last quote explains why this line is able to break your entire stylesheet. Basically, you open a bracket you never close. And while the browser has started parsing the opening bracket, it won’t do anything else before finding the closing one so every rules written after this hack won’t even be processed.

I made some tests with an opening parenthesis and an open brace as well: same result. If you open either `{}`, `[]` or `()` in a property and don’t think about closing it, it will crash the whole stylesheet (actually everything after the hack, not before).

## Final words

In the end I simply removed `.selector { [property: value; }` from our hacks database so that it doesn’t harm anyone again. If you want to play around this glitch, simply have a look at [this pen](https://codepen.io/HugoGiraudel/pen/qztrl):

<p data-height="360" data-theme-id="0" data-slug-hash="qztrl" data-user="HugoGiraudel" data-default-tab="css" class='codepen'>See the Pen <a href='https://codepen.io/HugoGiraudel/pen/qztrl'>The stylesheet breaker line</a> by Kitty Giraudel (<a href='https://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='https://codepen.io'>CodePen</a>

On a side note Sass, LESS and Stylus will all throw an error when encountering such a thing. In our case, we use Sass for everything but the hacks, for this very same reason: some hacks are not process-safe.

Anyway folks, that’s all I got. ;) Make sure you don’t have weird things in your stylesheets!
