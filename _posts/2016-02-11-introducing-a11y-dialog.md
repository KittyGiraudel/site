---
title: Introducing A11y Dialog
keywords:
  - a11y
  - modal
  - accessibility
  - dialog
---

If there’s one thing I try to push forward more and more at Edenspiekermann, it’s accessibility. I can’t help but feel that we don’t care enough about assistive technology users. That’s a shame, really. It’s not that we don’t want to—it’s more like we don’t really know where to start.

Almost all projects involve some form of dialog window at one point or another. However, accessibility is all too often set aside in favor of quick implementation. Truth is, accessible dialog windows are hard. Very hard.

Fortunately, there is a super clever guy named [Greg Kraus](https://github.com/gdkraus) who implemented an accessible modal dialog a few years ago and [open-sourced it on GitHub](https://github.com/gdkraus/accessible-modal-dialog). Now that’s nice!

However, his version—no matter how good it is—requires jQuery. We try to avoid using jQuery as much as we can here. We realised we did not really need it most of the time. On top of that, his script is not very flexible: only one dialog window per page, hard-coded IDs inside the functions. Not very practical and certainly not a drop-in script for any project.

So I rolled up my sleeves and [improved it](https://github.com/KittyGiraudel/a11y-dialog).

## What’s up?

I spent a few hours improving the original version and came up with new ideas as I went, so here is the full list.

The script no longer has jQuery as a dependency. It is now pure vanilla JS, ready to be used in any kind of project. You can still use jQuery if you want, but the script itself does not need it.

It is now possible to use several different dialog windows on the same page, thanks to the [Factory pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#factorypatternjavascript).

```js
// Get the dialog element (with the accessor method you want)
var dialogEl = document.getElementById('my-awesome-dialog')

// Instantiate a new dialog module
var dialog = new A11yDialog(dialogEl)
```

I added a small DOM API to open and close dialog windows (`data-a11y-dialog-show` and `data-a11y-dialog-hide`) without having to bind any listeners yourself. You can have as many openers and closers per dialog window as you want; no limit!

```html
<button data-a11y-dialog-show="my-awesome-dialog" type="button">
  Open the dialog window
</button>
```

```html
<button data-a11y-dialog-hide type="button" title="Close the dialog windows">
  &times;
</button>
```

There is also a teeny tiny JS API to allow you to manually hide and show a dialog window from its instance. It’s also possible to know whether a dialog window is hidden or shown without having to query the DOM.

```js
// Provided `dialog` contains a `A11yDialog` instance
if (dialog.shown) {
  dialog.hide()
} else {
  dialog.show()
}
```

And last but not least, I fixed a minor bug with the original version where elements with `tabindex` attribute set to `-1` would be focusable.

## How do I use it?

As of today, the script is published through [npm](https://www.npmjs.com/package/a11y-dialog).

```sh
npm install a11y-dialog --save
```

At this point, the script will be in your `node_modules` folder. Depending on your build step, this may vary. But you can probably just copy it in your assets folder like so:

```sh
cp node_modules/a11y-dialog/a11y-dialog.js assets/js/vendor
```

## What’s next?

Ideally, we would like the original author to merge our version in his repository (there is an [open issue for this](https://github.com/gdkraus/accessible-modal-dialog/issues/11)). There is no need to have 2 versions out there. Unfortunately, Greg Kraus seems to have stopped maintaining the initial repository, so for now, we’ll keep it on our side as well.

In any case, we are always looking for new ideas to improve our work so if you find a bug or want to suggest a feature, be sure to do so on the [GitHub repository](https://github.com/KittyGiraudel/a11y-dialog)!
