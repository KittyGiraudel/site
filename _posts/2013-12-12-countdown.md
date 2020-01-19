---
title: Introducing Countdown.js
tags:
  - javascript
  - release
---

Hey people! Just a quick article to introduce [Countdown.js](https://github.com/HugoGiraudel/Countdown.js), a little script I recently made. During the last weeks, I’ve been practicing with JavaScript. It has been on [my wishlist](/2013/05/13/things-to-do-2013/) for 2013 and I’m glad that I could made some progress with it.

In order to start making clean scripts and not poorly designed pieces of crappy jQuery dumped in the global object, I have revisited [an old countdown script](https://codepen.io/HugoGiraudel/pen/jtJrq) I made a while back with the [object literal pattern](https://css-tricks.com/how-do-you-structure-javascript-the-module-pattern-edition/).

## Why another countdown script?

There are like a billion scripts for countdowns, timers and clocks made of JavaScript. That’s like the “hello world!” of JS scripts so why making another one? Everything has been done yet!

Well, for one it was mostly about practicing. Making a timer script is something quite simple yet there is often lot of room for improvements. It turns out to be quite a nice playground to work in.

Secondly, I needed a script able to display a countdown in the way I like and not only `hh:mm:ss`. I wanted to be able to display a sentence like `There are still X days, Y hours and Z minutes left` or whatever. And since I didn’t know any script that allowed the use of patterns in a string (`{days}`, `{years}`…), I started building one.

It worked pretty well and the code was clean enough so that I wasn’t ashamed to release it on CodePen in early September. But I wanted to try something else than the litteral object pattern.

As good as this pattern can be, it becomes highly annoying when you have to deal with multiple occurrences of your widget on the same page. For some things, that’s not a problem at all. But you could definitely come with the need to display multiple timers/countdowns on the same page so I needed something moar.

So here comes [Object Oriented JavaScript](http://tobyho.com/2010/11/22/javascript-constructors-and/) in all its glory!

## How to

Well, obviously you need to include the script in your page. But I made it pretty tiny plus it doesn’t have any requirement! It’s under 2Kb minified (which is about ~1.3Kb once gzipped).

```html
<script src="js/countdown.js"></script>
```

Then using the countdown is as easy as instanciating the `Countdown` class:

```javascript
var countdown = new Countdown()
```

This creates a new instance with all defaults values but you can pass quite a few options:

### `selector`

Default: `.timer`

The selector you want to inject Countdown into. It should be a valid string for `document.querySelector()`.

### `dateStart`

Default: `new Date()` (now)

The date to start the countdown to. It should be a valid instance of class `Date`

### `dateEnd`

Default: `new Date(new Date().getTime() + (24 * 60 * 60 * 1000))` (tomorrow)

The date to end the countdown to. It should be a valid instance of class `Date`

### `msgBefore`

Default: `Be ready!`

The message to display before reaching `dateStart`

### `msgAfter`

Default: `It’s over, sorry folks!`

The message to display once reaching `dateEnd`

### `msgPattern`

Default: `{days} days, {hours} hours, {minutes} minutes and {seconds} seconds left`

The message to display during the countdown where values between braces get replaced by actual numeric values. The possible patterns are:

* `{years}`
* `{months}`
* `{weeks}`
* `{days}`
* `{hours}`
* `{minutes}`
* `{seconds}`

### `onStart`

Default: `null`

The function to run whenever the countdown starts.

### `onEnd`

Default: `null`

The function to run whenever the countdown stops.

### Example

```javascript
var countdown = new Countdown({
  selector: '#timer',
  msgBefore: 'Will start at Christmas!',
  msgAfter: 'Happy new year folks!',
  msgPattern:
    '{days} days, {hours} hours and {minutes} minutes before new year!',
  dateStart: new Date('2013/12/25 12:00'),
  dateEnd: new Date('Jan 1, 2014 12:00'),
  onStart: function() {
    console.log('Merry Christmas!')
  },
  onEnd: function() {
    console.log('Happy New Year!')
  }
})
```

## Pushing things further

### Custom events

The script doesn’t use jQuery at all, mostly because there is no need for such a library for this. However if you happen to use jQuery in your project, you’ll be glad to know the Countdown throws custom events on the element you’re binding the countdown to.

As of today, two events are being fired: `countdownStart` and `countdownEnd`. You can use them as follow:

```javascript
var countdown = new Countdown({
  selector: '.timer'
})

$('.timer').on('countdownStart', function() {
  console.log('The countdown has been started.')
})

$('.timer').on('countdownEnd', function() {
  console.log('The countdown has reached 0.')
})
```

Pretty neat, right?

### Validating code

My brother [Loïc](https://twitter.com/l_giraudel) helped me pushing things further by adding a couple of things to the project on GitHub:

* [JSHint](https://www.jshint.com/) tests to check JavaScript code quality
* [Jasmine](https://jasmine.github.io/) tests to make sure the script does what it’s supposed to do
* [Grunt](https://gruntjs.com/) to automate building process (also thanks to [Lucas Churchill](https://twitter.com/_agtlucas) for this)

Thanks bro! Anyway, I’m proud to tell this script as passed strict JSHint validations and Jasmine tests! Hurray!

## Final words

That’s all folks! I hope you like this script and if you find anything worth mentioning, please be sure to shoot in the comments or directly on the [GitHub repo](https://github.com/HugoGiraudel/Countdown.js).

Oh and if you only want to hack around the code, check this pen:

<p data-height="320" data-theme-id="0" data-slug-hash="vCyJq" data-user="HugoGiraudel" data-default-tab="result" class='codepen'>See the Pen <a href='https://codepen.io/HugoGiraudel/pen/vCyJq'>Object-oriented JS Countdown Class</a> by Hugo Giraudel (<a href='https://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='https://codepen.io'>CodePen</a>
