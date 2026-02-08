---
title: Getting the most out of Sass placeholders
description: A guide on getting the most from Sass placeholders
keywords:
  - sass
  - placeholders
  - extend
  - mixin
---

The other day I was looking at the source code from [GUFF](http://kenwheeler.github.io/guff/), a brand new Sass framework from [Ken Wheeler](https://github.com/kenwheeler). I like reviewing Sass code, I find it very interesting to have an insight at how other people tackle some common issues. By the way, if you want me to review your Sass code, I’ll be glad to do so. ;)

Anyway, I was looking at the code and to my surprise, Ken was mostly using mixins for common patterns, even when there was no variable involved whatsoever. You probably know it’s considered bad practice to use a mixin when you don’t need to make your styles varying according to passed arguments. Placeholders are best suited for such a thing. More informations on topic in [this article at SitePoint](https://www.sitepoint.com/sass-mixin-placeholder/).

So [I opened an issue](https://github.com/kenwheeler/guff/issues/1) to prompt Ken to move away from mixins when there is no need for them, in favor of placeholders and while he was completely willing to do so, he was worried about usage in media queries. Let’s pause here for some explanations.

## @extend and media queries

This is something I covered before in [this article about `@extend`](https://www.sitepoint.com/sass-extend-nobody-told-you/) at SitePoint but I’ll sum up here so you can follow along if you’re not very comfortable with Sass yet.

When extending a selector, Sass doesn’t take the CSS content from the extended selector to put it in the extending one. It works the other way around. It takes the extending selector and append it to the extended one. This is the reason why extending placeholders is better for final output than including mixins.

Because extending takes the current selector to move it to the extended selector, it makes it impossible to use it from different scopes. For instance, you can’t extend a placeholder that has been declared in a `@media` block, nor can you extend a placeholder from root if you’re within a `@media` directive.

And _this_ is a huge issue. Fortunately, this has to be the most expected feature request from Sass (according to the outrageous number of issues mentioning this on their repo: [#501](https://github.com/nex3/sass/issues/501), [#640](https://github.com/nex3/sass/issues/640), [#915](https://github.com/nex3/sass/issues/915), [#1050](https://github.com/nex3/sass/issues/1050), [#1083](https://github.com/nex3/sass/issues/1083)). At this point, we believe Sass maintainers will find a way to allow cross-scope extending.

Meanwhile, this is why Ken didn’t use placeholders and stuck to mixins. However from my experience, it’s not very common to have to include a mixin/extend a placeholder at a very specific breakpoint and not the others. Usually, rules scoped into mixins/placeholders are the core of the element they are applied to, meaning they should be there in all circumstancies. So I decided to find a solution.

## Mixin both mixin and placeholder

See what I did? With the title? “Mixin”… Because it’s like… Nevermind. I opened a SassMeister gist and started playing around to see if I could come up with a solution. First of all, what I ended up with is not unique. People have done it before me; and I remember seeing frameworks using it already.

My idea was the following: extend the placeholder when possible, else include the mixin. Also, I didn’t want to have code duplicates. Whenever I need to make a change in the code, I don’t want to edit both the placeholder and the mixin. There should be only a single place where the code lies.

For our example, let’s consider a basic need: a [micro-clearfix hack](http://nicolasgallagher.com/micro-clearfix-hack/) mixin. Here is how I decided to tackle things:

```scss
@mixin clear($extend: true) {
  @if $extend {
    @extend %clear;
  } @else {
    &:after {
      content: '';
      display: table;
      clear: both;
    }
  }
}

%clear {
  @include clear($extend: false);
}
```

Okay, that looks nasty. Here is what we do: first we define the `clear` mixin. The only parameter from the signature is `$extend`, which is a boolean set to `true` per default.

Then in the mixin core, we check whether or not `$extend` is set to `true`. If it is, then we extend the placeholder. If it is not, we dump the CSS code as a regular mixin would do.

Out of the mixin, we define the placeholder `%clear`. To avoid repeating the CSS code in the placeholder, we only have to include the mixin by setting `$extend` to false. This will dump the CSS code in the placeholder’s core.

Here is a boilerplate to code your own:

```scss
@mixin myMixin($extend: true) {
  @if $extend {
    @extend %myMixin;
  } @else {
    // Mixin core
  }
}

%myMixin {
  @include myMixin($extend: false);
}
```

## Using it

There it is. Now let’s try it:

```scss
.a {
  @include clear;
}
.b {
  @include clear;
}
```

This will result in the following CSS output:

```scss
.a:after,
.b:after {
  content: '';
  display: table;
  clear: both;
}
```

Until now, quite nice isn’t it? Even if we are using a mixin, we have the behaviour of a placeholder since both selectors get merged into a single one, like extending a placeholder would do.

Now let’s imagine we need to have a clear fix at a certain breakpoint:

```scss
@media (min-width: 48em) {
  .c {
    @include clear;
  }
}
```

This will throw an error:

```scss
You may not @extend an outer selector from within @media.
You may only @extend selectors within the same directive.
From "@extend %clear" on line 3.
```

This is exactly the issue we are trying to work around. Now, thanks to the way we wrote our mixin, we only have to move `$extend` to `false` in order to make it work:

```scss
@media (min-width: 48em) {
  .c {
    @include clear(false);
  }
}
```

No more error! The code is being output as usual because in this case, we are not extending a placeholder anymore (which would produce an error) but actually dumping CSS rules like a regular mixin.

## Final thoughts

It’s a shame we have to hack around the syntax in order to get the best from Sass placeholders. Hopefully cross-scope extending will save us from doing such nasty things whenever it comes live.

In any case, this looks like a robust way to get the most from both mixins and placeholders. Hope you like it people!
