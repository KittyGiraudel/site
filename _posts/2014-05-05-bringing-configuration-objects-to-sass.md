---
title: Bringing configuration objects to Sass
keywords:
  - sass
  - maps
  - configuration
---

One thing I was really looking forward with [Sass maps](https://viget.com/extend/sass-maps-are-awesome) is the ability to have configuration objects for functions and mixins. You know how you pass objects to your JavaScript class constructors instead of several parameters? Well fasten your belt boys because I’m bringing this to Sass!

## An insight in the JS way of doing

Before digging into Sass awesomeness, let’s first have a look at how we would do it in JavaScript:

```javascript
var Class = function(conf) {
  this.conf = extend(
    {
      duration: 2000,
      name: 'class',
      theme: 'dark',
      speed: 500
    },
    conf || {}
  )

  this.init()
}
```

So what’s going on here? The `Class` constructor is accepting a `conf` parameter. Then it defines its own `conf` property by merging the given object with a default configuration via the `extend` function. If `conf` isn’t defined, then it extends an empty object with default properties.

Extending an object based on another one is very convenient when you want to allow the user to define his own configuration but still want to provide defaults in case he doesn’t set all arguments.

## What’s wrong with several parameters?

One could ask what is wrong with having several arguments in the signature with a default value for each of them. Tl;dr version is that using an object is just easier and more convenient. Now if you want the detail, here are the reasons behind why an object as unique parameter instead of several parameters sounds better.

### Harder to read

To begin with, using an object makes it easier to understand since you have to specify the key associated to each value. While slightly longer to write, it’s easier to read; a fair trade-off in my opinion.

```javascript
// This…
f({
  message: 'You shall not pass!',
  close: false,
  error: 42,
  type: 'error'
})

// … is easier to understand than this
f('You shall not pass!', false, 42, 'error')
```

But the readibility argument is kind of a poor one. Some would say that they feel very comfortable with the multiple-arguments notation as long as they use a proper indentation for each argument (kind of like the object one) so let’s move on to something more robust.

### Harder to call

It’s generally simpler to store an object in a variable and then to pass it to the function rather than storing each individual parameter in its own variable. While `.call()` and `.apply()` let you do something around this, it’s not exquisite for readability (again!).

```javascript
// This…
var conf = {
  message: 'You shall not pass!',
  close: false,
  error: 42,
  type: 'error'
}

f(conf)

// … is easier to read than this
var conf = ['You shall not pass!', false, 42, 'error']

f.apply(void 0, conf)
```

Still not convince? Let’s move on.

### Harder to maintain

Adding or removing is as easy as updating the configuration object. No need to update all the calls or change arguments order if some of theme are optional.

```javascript
// Adding a parameter is simple; no need to worry about argument order
f({
  message: 'You shall not pass!',
  close: false,
  error: 42,
  type: 'error',
  duration: 5000
})

// … while you have to put your required parameters before optional one in the signature
f('You shall not pass!', 42, false, 5000, 'error')
```

### Harder to provide default parameters

Last but not least, I think an object notation makes it simpler to provide defaults arguments with an `extend` function than the multiple-arguments notation since JavaScript doesn’t support default values for arguments in the function signature (while PHP, Sass and other languages do). Because of this, using an object is definitely more elegant than multiplying ternary operators to check if arguments are defined or not.

I think we can agree on the fact that using a configuration object as a unique parameter is both better and more elegant than using a bunch of chained arguments. Now let’s move on to the core of this article: bringing this to Sass.

## Bringing it to Sass

In a way, we don’t really need this in Sass because it already provides _named arguments_. [Named arguments](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#keyword_arguments) give the ability to call a function without having to specify all its parameters. You can call it specifying only the arguments you want, no matter their index in the parameter list, like this.

```scss
@mixin mixin($a: 'a', $b: 'b', $c: 'c') {
  /* … */
}

@include mixin($b: 'boat');
```

This is pretty neat. But if like me you’d rather have a single object instead of a collection of arguments, then read on.

Sass 3.3 is bringing maps which are the exact equivalent of JavaScript objects. Now that we have maps, we can do all the cool stuff we just talked about and **this is amazing**. All we need is an `extend` function to be able to extend a given object with an object of default parameters.

This could have been very easy to do but `map-merge` already does it for us. Indeed, when merging two maps it does exactly what we want: extend one map with the other. At best, we could alias the `map-merge` function with an `extend` function:

```scss
@function extend($obj, $ext-obj) {
  @return map-merge($obj, $ext-obj);
}
```

So here it is:

```scss
$default-object: (
  dont: you think,
  this: is awesome
);

$object: (this: is amazing);

$merge:extend($default-object, $object);

/**
 * This results in
$merge: (
  dont: you think,
  this: is amazing
);
 */
```

## Using it for real

Now what’s the point of all of this? Let’s say you have a component you call with a mixin. This mixin accepts quite a few parameters like &mdash; I don’t know &mdash; the width, the color scheme, the animation duration, maybe a name or something. They probably have some default values defined to match a common use case. Until now, you have done it like this

```scss
@mixin component($theme: light, $size: 100%, $duration: 250ms, $name: 'component', $border: true) {
  .#{$name} {
    width: $size;
    animation: fade $duration;

    @if $border {
      border-top: 0.25em solid;
    }

    @if $theme == 'dark' {
      background: #333;
      color: #fefefe;
    } @else if $theme == 'light' {
      background: #fefefe;
      color: #333;
    }
  }
}

// Including component
@include component(dark, $name: 'module');
```

This works great. It is easily readable, it does the job very well. However there is _one_ thing that still sucks with this method: you can’t move the configuration elsewhere. Actually you can, but it will be like 5 variables which is getting a lot. Having a configuration map would be easier to move in a variable file or something.

```scss
@mixin component($conf: ()) {
  // Extending the default arguments with the given object
  $conf:extend(
    (size: 100%, theme: dark, duration: 250ms, name: 'component', border: true),
    $conf
  );

  // Dumping CSS
  .#{map-get($conf, name)} {
    width: map-get($conf, size);
    animation: fade map-get($conf, duration);

    $theme: map-get($conf, theme);
    @if $theme == 'dark' {
      background: #333;
      color: #fefefe;
    } @else if $theme == 'light' {
      background: #fefefe;
      color: #333;
    }
  }
}

// Including component
@include component((
    theme: dark,
    name: 'module'
  ));
```

Both doesn’t look much different except the core function from the object-way looks more crowded. True, but now separating the setup from the code is getting very easy. All you have to do is defining a map and pass it to the mixin. No need to move around a couple of variables which can quickly become a mess.

```scss
// In `_config.scss` along with your other setup variables
$component-conf: (
  theme: light,
  name: 'module'
);

// In `_component.scss`
@include component($component-conf);
```

## Final thoughts

There you go folks. This is definitely a more “Object” approach than the previous one and I can understand some people not liking it because it doesn’t look like we are dealing with CSS anymore.

Now if you ask me, not only does it make both the mixin signature cleaner, but it also gives you more flexibility about your code structure and _this_ is a big deal when working on a huge project with countless components. Being able to gather configuration maps in a variables file can make a huge difference when it comes to code maintenance.

And while the mixin core is a little more crowded due to the map getters, the trade-off can be worth it in some cases.
