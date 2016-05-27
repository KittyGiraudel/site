---
guest: "Hugo Darby-Brown"
layout: post
title: "Scroll overflow menu"
tags:
  - css
  - experiment
---

<p class="explanation">The following is a guest post by <a href="http://darbybrown.com/">Hugo Darby-Brown</a>, a talented front-end developer. I'm very glad to have him writing here today about a menu concept he came up with!</p>

Before I start off I'd like to say that this is more of **a proof of concept**, than a method that I'd recommend using on your next project.  This menu uses the WebKit-specific CSS declaration `overflow-scrolling: touch` so support is a little flakey on older devices, but there are a few polyfills, which I will cover later (should you feel the urge to use this menu).


## Setting Out

I wanted to create a horizontal scrolling navigation, similar to that of the iOS taskbar. Lots of responsive menu's take the approach of displaying list items vertically on small screens, but I wanted to play with the idea of having menu items off the screen and swiping to reveal them.

<figure class="figure">
  <img src="http://darbybrown.com/img/scroll-overflow-menu.jpg" alt="" />
  <figcaption>The scroll-overflow menu by Hugo</figcaption>
</figure>

## The Basic Effect

I wanted the HTML markup to be as clean as possible, this I guess it's pretty self explanatory.

```html
<header>
  <nav role='navigation'>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Clients</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  <a href="#" class="nav-toggle">Menu</a>
</header>
```

This is the CSS that makes the effect happen. I've stripped out all the styling to highlight the key components that make the effect work.

```css
nav {
  overflow-x: scroll; /* 1 */
  -webkit-overflow-scrolling: touch; /* 2 */
}

ul {
  text-align: justify; /* 3 */
  width: 30em; /* 4 */
}

ul:after { /* 5 */
  content: '';
  display: inline-block;
  width: 100%;
}

li {
  display: inline-block; /* 6 */
}
```

Okay, so what's going on here? In essence we're creating a navigation that is too large for the screen. We set the overflow to `scroll`, and the overflow-scroll type to `touch` to allow for momentum scrolling. Explained in a bit more detail below:

1. Setting `auto` will work on some devices, but set this to `scroll` just to be sure.
1. This the *magic* property that enables the *native feel* scrolling.
1. Setting this to `justify` creates equally spaced `li`'s which takes the headache of working out margins.
1. You must set the width to a value larger than the sum of all the `li`'s width.
1. This is `text-align: justify`'s version of a clearfix.
1. This must also be set for the equal spacing to work.


## Toggling The Menu

We're almost done, all we have to do is to deal with the toggling. We could use a CSS hack for this but this is not the point so we'll just use a tiny bit of JavaScript.

So we set the `max-height` of the navigation to `0` in order to initially hide it, and add a `transition` so when we toggle the class `.show` the menu will appear to slide in from the top, pretty basic mobile menu stuff.

```css
nav {
	max-height: 0;
	transition: .6s ease-in-out;
}

.show {
	max-height: 15em;
}
```

Throw in some JS to toggle the class, and you've got yourself a basic slide down mobile menu.

```javascript
// jQuery version
$(".nav-toggle").on('click', function (e) {
  $("nav").toggleClass("show");
  e.preventDefault();
});

// Vanilla JS version
document.querySelector('.nav-toggle').onclick = function (e) {
  var nav = document.querySelector('nav');
  nav.classList.toggle('show');
  e.preventDefault();
}
```

## What about larger devices?

A mobile only menu isn't much use these days is it? So using a few `min-width` media queries we'll turn this menu into a responsive mobile first menu.

```css
@media (min-width: 31.25em) {
  nav {
    max-height: none; /* reset the max-height */
    overflow: hidden; /* this prevents the scroll bar showing on large devices */
  }

  ul {
    width: 100%;
  }

  .nav-toggle {
    display: none;
  }
}
```

## Support and polyfills


The support is really not that bad, without being awesome either. As far as I know, it looks like this:

* iOS 5+ 
* Android 3.0
* Blackberry 6+
* Windows Phone (IE10) supports momentum scrolling natively

For unsupported browsers, there are a few of polyfills that can help you, should you want to use it:

* [iScroll](http://cubiq.org/iscroll-4)
* [Overthrow](http://filamentgroup.github.io/Overthrow/)
* [Scrollability](https://github.com/joehewitt/scrollability/)

## Final thoughts

I think you'll see a lot more menu's taking a horizontal approach in the future, but unfortunately Android 2.X still makes up for a 1/3 of market share of all Android devices, so until that reduces significantly I wouldn't use this in any serious projects.

I would love to hear your thoughts on `-webkit-overflow-scrolling: touch;` and the future possibilities.

I would usually embed the demo but, unfortunately iframes don't play well with `overflow-scrolling:touch`, so it's best if you directly check [this link](http://darbybrown.com/menu) with your phone. You could also could play around the code at [CodePen](http://codepen.io/hugo/full/pwsLj) (caution! iframes, doesn't work great on some mobile browsers) or by [downloading the files](http://darbybrown.com/menu/download.zip)!

Thanks for reading! If you think of anything to improve this menu concept, feel free to share. :)

> Hugo Darby-Brown is both a designer and a developer from UK, passionate with front-end technologies especially CSS. You can catch him on [Twitter](http://twitter.com/darbybrown) or on his brand new [site](http://darbybrown.com).
