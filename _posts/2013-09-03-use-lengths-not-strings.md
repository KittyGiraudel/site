---
layout: post
title: "Use lengths, not strings"
tags:
  - sass
  - type
  - strings
  - lengths
---

This is something I see in a lot of Sass demos and tutorials. People tend to use strings instead of actual lengths, and if it's okay in most cases, there are a couple of situations when it is not anymore.

But first, let me introduce the topic because you probably wonder what the hell I am talking about. Nothing better than a little example for this.

```scss
$value: 13.37;
$length: $value + em;
    
whatever {
    padding-top: $length;
}
```

I want to play a game... This example: working or not working?

Well obviously, it works like a charm. That's probably why you can see it so much in so many Sass demos.

## The problem

Then you ask *"if it works, why bother?"*. That's actually a very fair question. Let's continue our example, shall we? What if we apply &mdash; let's say &mdash; the `round()` function to our length?

```scss
$rounded-length: round($length);
```

Aaaaaand... bummer.

> "13.37em" is not a number for 'round'.

Same problem with any function requiring a number (lengths are numbers in Sass) like `abs()`, `ceil()`, `floor()`, `min()`... Even worse! The `unit()` function will also fail to return the unit. 

This is because **there is no unit** since it's now a string. When you append a string (in this case *em*) to a number (*13.37*), you implicitly cast it into a string.

Indeed, if you check the type of your variable with the `type-of()` function, you'll see it's not a number but a string.

```scss
type-of($length); // string
```

## The solution

There is a very simple solution. Instead of appending the unit, simply multiply the number by 1 unit. For example, *3 apples* is strictly equivalent to *3 times 1 apple*, right? Same thing.

```scss
$value: 13.37;
$length: $value * 1em;
    
whatever {
    padding-top: round($length); // 13em
}
```

Problem solved! Please, use lengths when you need to, not strings.
