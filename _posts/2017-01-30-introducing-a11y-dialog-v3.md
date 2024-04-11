---
title: Introducing a11y-dialog v3
keywords:
  - javascript
  - accessibility
  - dialog
---

Just a couple of words to talk about the work I’ve done to get [a11y-dialog v3.0.0](https://github.com/KittyGiraudel/a11y-dialog/releases/tag/3.0.0) out of the door, and so you can safely upgrade to the newest and shiniest!

All in all, it’s quite a big version as the script has been almost entirely rewritten. There are not much rationale behind it except that it seemed like a good time to dust everything.

Still, quite a few things changed for you, hence the major release. Let’s have a little tour.

## Main element no longer assumed (breaking)

In version 2.\*, the main element was assumed to have a `main` id. Not only was this highly arbitrary, but it also did not play quite well with CMS like Drupal or Wordpress. There was a [long discussion about it](https://github.com/KittyGiraudel/a11y-dialog/issues/56).

From version 3, all siblings of the dialog element will be toggled (understand via the `aria-hidden` attribute). Since the documentation has always recommended having the main content container and the dialog element side by side, it should not be a big deal for most projects.

If toggling siblings does not work for any reason, it is possible to pass an `Element`, a `NodeList` or a selector as second argument. This will define which elements should be toggled on and off when the dialog is being hidden or shown. For instance:

```js
const el = document.querySelector('#dialog')
const dialog = new A11yDialog(el, 'body > *:not(#dialog)')
```

This should hopefully make CMS integrations easier.

To maintain the exact same behaviour as before, you can do:

```js
const el = document.querySelector('#your-dialog')
const dialog = new A11yDialog(el, '#main')
```

## New `.create()` method

In version 2.5.0 was added the `.destroy()` method, which essentially removed all bound listeners from dialog openers and closers (as per [#52](https://github.com/KittyGiraudel/a11y-dialog/issues/52)). From there, the dialog was still sort of usable, but only programmatically through the JS API.

From version 3, there is now a `.create()` method in order to pair nicely with `.destroy()`. It is called automatically from the constructor when instantiating a dialog so nothing should change for the most part.

This method is essentially meant to provide a counterpart to the `.destroy()` method. It binds click listeners to dialog openers and closers. It can be particularly useful when adding openers and closers dynamically to the page as the `.create()` re-performs a DOM query to fetch them.

```js
// Remove click event listeners from all dialog openers and closers, and removes
// all custom event listeners from dialog events
dialog.destroy()

// Add back event listeners to all dialog openers and closers
dialog.create()
```

Note that it is also possible to pass the targets containers (the ones which are toggled along with the dialog element) to the `.create()` method if they ever happen to change (unlikely). Otherwise, the one given on dialog instantiation will remain.

## Events no longer DOM based (breaking)

In version 2.\*, the dialog element itself was firing DOM events when shown or hidden. To be honest, I have no idea why I went down the DOM events route before as this is a nightmare of compatibility.

```js
// Version 2.*
dialogEl
  .addEventListener('show', function () {
    // Do something
  })
  .addEventListener('hide', function () {
    // Do something
  })
```

From version 3, it is now possible to register event listeners on the dialog instance itself with the `.on(type, handler)` method. It is obviously possible to unregister event listeners with the `.off(type, handler)` method.

```js
// Version 3
dialog
  .on('show', function () {
    // Do something
  })
  .on('hide', function () {
    // Do something
  })
```

Note that the `.destroy()` and `.create()` instance also emit events.

```js
dialog.on('destroy', removeDialogNode)
// …
dialog.off('destroy', removeDialogNode)
```

## New events callback signature (breaking)

In version 2.\*, custom (DOM) events used to pass an object to the registered callbacks. It had a `target` key containing the dialog element, and when triggered from a user action (such as click), a `detail` key containing the trigger element.

```js
// Version 2.*
dialogEl.addEventListener('show', function (event) {
  // event.target = dialog element
  // event.detail = trigger element
})
```

From version 3, events pass two separate arguments to the registered listeners: the dialog element, and the trigger element (if any).

```js
// Version 3
dialog.on('show', function (dialogEl, triggerEl) {
  // …
})
```

## Lack of initial `aria-hidden="true"` now safe (possibly breaking)

In version 2.\*, omitting the `aria-hidden="true"` attribute on the dialog element could cause weird issues where the `.shown` property would be correctly synced with the attribute, but the rest of the lib could be buggy on the first show/hide.

From version 3, the `aria-hidden` attribute will be set to `true` when instantiating the dialog, and the `.shown` attribute to `false`. When wanting to have a dialog open by default (please don’t), simply run `.show()` directly after instantiation.

## Method chaining now possible

This is nice little addition allowing you to chain all method calls.

```js
dialog.on('show', doSomething).show()
```

## Wrapping things up

As stated before, this version also comes with brand new code that I took time to heavily comment, as well as a brand new test suite (that should hopefully be much more thorough).

That’s it, and that’s already quite a lot if you want my opinion! I’d be glad to have some feedback about this if you happen to use a11y-dialog. Also, if you find any bug, please kindly [report them on GitHub](https://github.com/KittyGiraudel/a11y-dialog/issues).

_Thanks to [Mike Smart](https://twitter.com/smartmike) and [Loïc Giraudel](https://twitter.com/l_giraudel) for their insightful help._
