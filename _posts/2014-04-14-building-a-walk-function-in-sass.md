---
title: Building a walk function in Sass
tags:
  - sass
  - walk
  - functions
  - functional programming
---

> **Edit (2014/11/16):** more functional programming to be found [here](https://sassmeister.com/gist/c36be3440dc2b5ae9ba2).

In the last couple of weeks, I have done some decent amount of code reviewing for various Sass frameworks and I have seen quite clever things. Meanwhile, I keep experimenting with Sass to find cool stuff, and I think this one will get frameworks' maintainers interested.

To please [Joey Hoer’s request for SassyLists](https://github.com/Team-Sass/SassyLists/issues/24), I have built a little `walk` function. The idea is the same as for the `array_walk` function from PHP if you’re familiar.

> array_walk — Apply a user function to every member of an array

So whenever you have a list of values and want to apply a given function to each of them, you either need to write a loop in order to do this manually, or you need a `walk` function. Luckily for you, I’ve written one and looking back at my code I feel like it’s interesting enough to write about it: `call`, `set-nth` and `function-exists` functions, `argList`, nothing but the good.

## A proof of concept

Pretty much like the `array_walk` function actually. Here is the syntax:

```scss
walk(list $list, function $function, argList $args...)
```

The first argument is the list you are walking through. The second argument is the function you want to call to each item from the list. Any argument after those 2 are optional and will be passed as extra argument to the function call.

This is why we add `...` to the `$args` parameter; because it is an `argList`. To put it simple: all arguments passed to the function (as many as you want) starting from the index of `$args` will be packaged as a list. Then, you can access them like regular list item with `nth()` for instance.

For example let’s say you have a list of colors you want to revert, in order to get complementary colors.

```scss
$colors: hotpink deepskyblue firebrick;
$complementary-colors: walk($colors, complementary);
// #69ffb4 #ff4000 #22b2b2
```

As you can see, this is pretty straight-forward. The first argument is the list of colors (`$colors`) and the second argument is the name of the function you want to apply to each item from the list.

Now let’s move on to something slightly more complicated, with an extra parameter. Shall we? Instead of finding the complementary color of each item from the list, let’s lighten all those colors.

```scss
$colors: hotpink deepskyblue firebrick;
$complementary-colors: walk($colors, lighten, 20%);
// #ffcfe7 #66d9ff #e05a5a
```

Not much harder, is it? The second argument is still the function, and we pass a 3rd argument to the function: the percentage for the `lighten` function. This value will be passed as a 2nd argument to the `lighten` function, the first being the color of course.

## How does it work?

Okay, let’s move on to the code now. Surprisingly enough, the function core is extremely short and simple. Actually, the `call` function is doing all the job.

```scss
@function walk($list, $function, $args...) {
  @for $i from 1 through length($list) {
    $list: set-nth($list, $i, call($function, nth($list, $i), $args...));
  }

  @return $list;
}
```

Let’s have a little recap about both `call` and `set-nth` so you can fully understand what’s going on here. First, `set-nth` is a function added in Sass 3.3, aiming at updating a specific value from a list. The first argument is the list, the second is the index to be updated and the third the new value.

I intentionally choosed to use `set-nth()` here and not to build a new list from scratch because I feel like it makes more sense: we are not creating a new list, we are simply updating values. Also I think it’s faster but I’m not quite sure about that.

Regarding `call`, I’ve already written quite a couple of times about it. It does exactly what you are expecting it to do: call the function named after the first argument, passing it all the other arguments in the same order. This is quite cool when you want to dynamically call a function by its name, like we are doing right now.

Back to our function now, here it what’s going on: we loop through the list and update each value with what is being returned by the `call` function. If we take back the last exemple we’ve worked with, here is what happen step by step:

1. Updating value of `$list` at index `1` with the result of `call(hotpink, lighten, 20%)` (`==lighten(hotpink, 20%`)
1. Updating value of `$list` at index `2` with the result of `call(deepskyblue, lighten, 20%)` (`==lighten(deepskyblue, 20%`)
1. Updating value of `$list` at index `3` with the result of `call(firebrick, lighten, 20%)` (`==lighten(firebrick, 20%`)
1. Returning `$list`

Simple, isn’t it?

## What about error handling?

The main problem I can see with this function is you can’t really make sure everything’s okay. For instance, there is absolutely no way to know the number of arguments expected by `$function`. If it’s `complementary`, then it’s 1; if it’s `lighten`, it needs 2; if it’s `rgba`, it’s 4, and so on… It really depends on the function name passed.

Also, we can’t make sure values from `$list` are valid for `$function`. What if you try to `to-upper-case` a list of numbers? It won’t work! Although we can’t make this check.

In the end, the only things we can check is whether or not the function exists thanks to `function-exists`:

```scss
@function walk($list, $function, $args...) {
  @if not function-exists($function) {
    @warn "There is no `#{$function}` function.";
    @return false;
  }

  /* Function core … */
}
```

Thanks to the new `function-exists` from Sass 3.3, we can test whether or not a function exists. In our case, we test if `$function` refers to an existing function. If it doesn’t, we warn the user and return false.

There is not much we can do aside of that. It’s the responsibility of each function to make the correct input validations so it doesn’t crash.

## Final thoughts

With such a simple function we can see how much Sass 3.3 brought to Sass. In about 5 lines of SCSS, we have used not less than 3 new functions from Sass 3.3: `function-exists`, `set-nth` and `call`. How cool is that?

Regarding the function in itself now, I think it might be used by some frameworks. I don’t have any use case coming up at the top of my head right now, but being able to walk through an array is actually more useful than we first think.

By the way, you play with the code on SassMeister:

<p class="sassmeister" data-gist-id="9730068" data-height="480"><a href="https://sassmeister.com/gist/9730068">Play with this gist on SassMeister.</a></p>

If you think of anything about the code, be sure to have a word my friends. :)
