---
title: An introduction to hardware acceleration
keywords:
  - css
  - performance
  - hardware
  - acceleration
---

Hardware acceleration is the process of delegating a task usually performed by the CPU (Central Processor Unit) to the GPU (Graphical Processor Unit) in order to speed up performance, hence the name _hardware acceleration_.

## What about the browser?

When applied to CSS, it is useful to know how a browser works in order to understand what is going on and what we can do. A browser have two execution threads: the _main thread_ and the _compositer_. The main thread takes care of basically everything, from parsing the documents to executing JavaScript. The compositer deals with graphics-intensive rendering, to keep things simple.

So applying hardware acceleration to the front-end world, it means telling the browser to delegate some visual things to the compositer in order to let it perform both important tasks on the main thread, and rendering tasks on the compositer. This improves performance and ensures a better frame-rate.

I like this technical yet affordable explanation of hardware acceleration by [Ariya Hidayat](http://calendar.perfplanet.com/2014/hardware-accelerated-css-the-nice-vs-the-naughty/):

> Among many different features of a GPU, it can hold a limited number of textures (a rectangle of pixels) and manipulate those textures efficiently, including applying a certain transformation (translation, scaling, rotating, etc). Instead of drawing the pixels for every animation frame, the browser will “snapshot” the DOM element and store it as a GPU texture (often called as layer). Later, the browser will simply tell the GPU to transform the said texture to give the perception of an animating DOM element. This is called GPU compositing, naturally referred to as “hardware acceleration”.  
> &mdash; Ariya Hidayat in [Hardware Accelerated CSS: The Nice vs The Naughty](http://calendar.perfplanet.com/2014/hardware-accelerated-css-the-nice-vs-the-naughty/)

## What about CSS?

It is good to know that browsers are able to perform some hardware acceleration on their own when it comes to `opacity` and `transform` properties. To put it simply, when using these properties on an element, the browser will _promote the element to its own layer_. Basically, it moves the physical rendering of the element onto another layer so that it can be dealt with by the compositer (and the GPU) instead of the main thread. This is the reason why it is often recommended to use `transform` and `opacity` when doing some animations and transitions in CSS.

You can also force the browser to promote an element to its own layer (for immediate or later use) by using `translateZ(0)` or `transform3d(0, 0, 0)`, often referred to as the _null transform_ or a _transform hack_. Because you intimate the browser to use a 3D transform, it has to delegate the visual rendering to the compositer and the GPU.

There is also a brand new property called `will-change` which literally intimate the browser to promote the element to its own layer for immediate or later use. `will-change` accepts a list of properties like the `transition-property` property.

## Pitfalls

Beware not to get extreme about it and promote all elements from the DOM (or too many for that matter) to their own layer. By doing so, you would create a surcharge on the GPU, leading to performance issues (oh the irony) or even crashes.

It would basically be driving a very powerful sport car on a very crowded freeway during rush hour: pointless.

## Further reading

- [Hardware Accelerated CSS: The Nice vs The Naughty](http://calendar.perfplanet.com/2014/hardware-accelerated-css-the-nice-vs-the-naughty/)
- [Increase Site Performance With Hardware Accelerated CSS](http://blog.teamtreehouse.com/increase-your-sites-performance-with-hardware-accelerated-css)
- [Let's Play With Hardware Accelerated CSS](http://www.smashingmagazine.com/2012/06/play-with-hardware-accelerated-css/)
- [Everything You Need to Know About the CSS will-change Property](https://dev.opera.com/articles/css-will-change-property/)
