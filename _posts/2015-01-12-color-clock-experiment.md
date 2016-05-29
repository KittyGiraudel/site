---
title: "Color Clock Experiment"
tags:
  - javascript
  - experiment
  - color
  - clock
---

A while back, a developer posted a little experiment in which the current time was being used as an hexadecimal color, applied to the body element. Better have a look at [the demo](http://www.jacopocolo.com/hexclock/#).

![Hexclock experiment](/assets/images/color-clock-experiment/hexclock.png)

What a clever little experiment it was, yet I can't say I am completely fond of the way it has been implemented. Not only colors are restricted between `#000000` (00:00:00) and `#235959` (23:59:59), but the JavaScript part did not really please me. So here is my try.

There are two things I wanted to give specific attention to:

* Having a very wide range of colors available;
* Making sure the clock is still readable on very dark/light colors.

Alright, let's go.

<p data-height="320" data-theme-id="0" data-slug-hash="JobxQR" data-default-tab="result" data-user="HugoGiraudel" class='codepen'>See the Pen <a href='http://codepen.io/HugoGiraudel/pen/JobxQR/'>Color Clock</a> by Hugo Giraudel (<a href='http://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

## Building the app

Let's start with a little skeleton for our application:

```javascript
(function () {
  'use strict';

  // Our main function
  function colorClock() {
    // ...
  }

  // Call our function every second
  var timer = setInterval(colorClock, 1000);
}());
```

Nothing special here: at every second, we call the `colorClock` function. This function will have to do three things:

* display the current time;
* apply the computed color to the body;
* change font color if too dark/light.

## Printing the current time

Displaying the current time is probably the easiest part of the exercise. Although I must say I got helped by a [StackOverflow answer](http://stackoverflow.com/a/12612778).

```javascript
function colorClock() {
  // ...

  function dateToContent(date) {
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  }

  var date = new Date();
  document.body.innerHTML = dateToContent(date);
}
```

## Applying the computed color to the body

Let's tackle the actual challenge. My thought process was as follow. Our time is made of 3 components: hours, minutes and seconds. A color is made of 3 components: red, green and blue channels. If I convert each component to a 255 value, I can have a color from the current time (where hours are converted to red, minutes to green and seconds to blue).

Alright. The first thing we need is to compute our color channels based on the current time. To do so, we need a `RGBFromDate` function that takes an instance of `Date`, and returns an array of 3 channels expressed as (rounded) numbers between 0 and 255.

```javascript
function RGBFromDate(date) {
  return [
    (date.getHours()   / 24 * 255),
    (date.getMinutes() / 60 * 255),
    (date.getSeconds() / 60 * 255)
  ].map(function (e) {
    return Math.round(e);
  });
}
```

At this point, we have everything we need to apply the color to the body.

```javascript
var date = new Date();
var channels = RGBFromDate(date);

document.body.style.backgroundColor = 'rgb(' + channels.join(',') + ')';
```

## Changing font color based on body color

Last but not least, we need to find a way to change the font color if the background color is too dark or too light, so the text remains readable at all time. To do this, we have to compute the [luminance](http://en.wikipedia.org/wiki/Relative_luminance) of a color. If it is higher than `.7`, then the color is very bright and text should be black.

```javascript
function colorLuminance(red, green, blue) {
  return ((0.299 * red) + (0.587 * green) + (0.114 * blue)) / 256;
}

function colorFromRGB(red, green, blue) {
  return colorLuminance(red, green, blue) > 0.7 ? 'black' : 'white';
}

document.body.style.color = colorFromRGB.apply(this, channels);
```

## Final thoughts

That's it. Here is the final code:

```javascript
(function () {
  'use strict';

  function colorClock() {
    // Get RGB channels from a date
    function RGBFromDate(date) {
      return [
        (date.getHours()   / 24 * 255),
        (date.getMinutes() / 60 * 255),
        (date.getSeconds() / 60 * 255)
      ].map(function (e) {
        return Math.round(e);
      });
    }

    // Get color luminance as a float from RGB channels
    function colorLuminance(red, green, blue) {
      return ((0.299 * red) + (0.587 * green) + (0.114 * blue)) / 256;
    }

    // Get font color from RGB channels from background
    function colorFromRGB(red, green, blue) {
      return colorLuminance(red, green, blue) > 0.7 ? 'black' : 'white';
    }

    // Get formatted date
    function dateToContent(date) {
      return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    var date = new Date();
    var channels = RGBFromDate(date);

    document.body.style.color = colorFromRGB.apply(this, channels);
    document.body.style.backgroundColor = 'rgb(' + channels.join(',') + ')';
    document.body.innerHTML = dateToContent(date);
  }

  var t = setInterval(colorClock, 1000);
}());
```

You can play with the code on CodePen:

<p data-height="320" data-theme-id="0" data-slug-hash="JobxQR" data-default-tab="result" data-user="HugoGiraudel" class='codepen'>See the Pen <a href='http://codepen.io/HugoGiraudel/pen/JobxQR/'>Color Clock</a> by Hugo Giraudel (<a href='http://codepen.io/HugoGiraudel'>@HugoGiraudel</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

Hope you liked it!
