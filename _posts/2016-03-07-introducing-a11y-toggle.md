---
title: Introducing A11y Toggle
keywords:
  - a11y
  - toggle
  - accessibility
---

---

title: "Introducing A11y Toggle" author: kitty-giraudel layout: post

---

A few weeks ago, [I introduced a11y-dialog](/2016/02/11/introducing-a11y-dialog). Today, I am coming back with another accessibility-focused module: [a11y-toggle](https://github.com/edenspiekermann/a11y-toggle).

At Edenspiekermann, we used to heavily rely on the [checkbox hack](https://css-tricks.com/the-checkbox-hack/) to toggle content visibility. Unfortunately, this hack (the word is an understatement) involves some usability and accessibility concerns.

## What’s wrong with the checkbox hack?

For starters, the checkbox hack relies on the `:checked` pseudo-class which is unfortunately not supported everywhere (source [QuirksMode](http://quirksmode.org/css/selectors/mobile.html#t60)). In case you’re too lazy to check the compatibility tables, here is a list of browsers _not_ supporting `:checked`:

- Internet Explorer up to 8;
- Some versions of Firefox on Linux;
- Android Stock Browser;
- Opera Mini;
- BlackBerry Browser;
- Nokia Xpress Browser;
- UC Browser;
- Firefox Android;
- And some other minor browsers.

That’s a lot of people excluded just for the sake of simplicity (which is also arguable). On top of that, the checkbox hack has some accessibility issues. See, for a content toggle to be fully accessible to assistive technology users, it should respect the following:

- the toggle should have a `aria-expanded` attribute to define its current state (`true` for expanded, `false` for collapsed);
- the toggle should have a `aria-controls` attribute linking to the toggled content in case they are not in order in the document so that assistive technologies can provide a shortcut;
- the toggled content should have a `aria-hidden` attribute to define its current state (`true` for collapsed, `false` or no attribute for expanded).

All of this cannot be done with CSS itself. Initial ARIA-specific attributes can be set, but they cannot be updated on toggle use, which makes the whole thing quite broken.

## JavaScript to the rescue!

So we need JavaScript (unfortunately). However, we don’t need a hell lot of it. A few lines are enough. And that’s precisely what a11y-toggle does (in roughly 300 bytes once gzipped). It just *makes it work*™.

You can install it through [npm](https://www.npmjs.com/package/a11y-toggle):

```sh
npm install --save a11y-toggle
```

Include the script in your app / pages and you should be good to go. You only have to add a `data-a11y-toggle` attribute linking to the collapsible element’s `id`. For instance:

```html
<button data-a11y-toggle="content-container">Toggle content</button>

<div id="content-container">
  Here is some content that can be be toggled visible or invisible.
</div>
```

a11y-toggle is adding the initial `aria-hidden`, `aria-controls` and `aria-expanded` attributes so you don’t have to worry about them.

## What’s next?

I would like to investigate on the `<details>` and `<summary>` elements as they are basically a native implementation for content toggles. Given the [poor browser support](http://caniuse.com/#feat=details), I could consider making a11y-dialog a polyfill for these.

Anyway, if you have any idea to make it better or if you found a bug, please [reach out to me on Twitter](https://twitter.com/KittyGiraudel) or [open an issue on GitHub](https://github.com/edenspiekermann/a11y-toggle).
