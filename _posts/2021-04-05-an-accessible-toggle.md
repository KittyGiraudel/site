---
title: An accessible toggle
---

Toggles (or sometimes “toggle switches”) are heavily used in modern interfaces. They tend to be relatively straightforward and can be thought as glorified checkboxes. Yet, they are often made inaccessible one way or another. 

In this article, I will show a small HTML + CSS only implementation of an accessible toggle that you can basically copy in your own projects and tweak at your own convenience.

<p class="codepen" data-height="300" data-theme-id="light" data-default-tab="result" data-user="KittyGiraudel" data-slug-hash="xxgrPvg" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="xxgrPvg">
  <span>See the Pen <a href="https://codepen.io/KittyGiraudel/pen/xxgrPvg">
  xxgrPvg</a> by Kitty Giraudel (<a href="https://codepen.io/KittyGiraudel">@KittyGiraudel</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## Markup

As always, let’s start with the HTML. In this case, we are going to start with the very basics, which is a properly labelled checkbox. It’s an `<input>` with a `<label>`, with the correct attributes, and a visible label.

```html
<label class='Toggle' for='toggle'>
  <input type='checkbox' name='toggle' id='toggle' class="Toggle__input" />
  This is the label
</label>
```

{% info %}It’s worth mentioning that it is also possible to use 2 radio inputs instead (or even a button it should only work with JavaScript anyway). Sara Soueidan goes more in details about [designing and building toggle switches](https://www.sarasoueidan.com/blog/toggle-switch-design/).
{% endinfo %}

Now, we are going to need a little more than this. To avoid conveying the status of the checkbox relying solely on color ([WCAG Success Criteria 1.4.1 Use of Color](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-without-color.html)), we are going to use a couple icons.

The way it’s going to work is we’re going to have a small container between the input and the text label which contains 2 icons: a checkmark and a cross (taken from [Material UI icons](https://material.io/resources/icons/)). Then we’ll create the toggle handle with a pseudo-element to cover one of the icon at a time.

```html
<label class='Toggle' for='toggle'>
  <input type='checkbox' name='toggle' id='toggle' class="Toggle__input" />

  <span class="Toggle__display" hidden>
    <svg aria-hidden="true" focusable="false"
         class="Toggle__icon Toggle__icon--checkmark" width='18' height='14' viewBox='0 0 18 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M6.08471 10.6237L2.29164 6.83059L1 8.11313L6.08471 13.1978L17 2.28255L15.7175 1L6.08471 10.6237Z' fill='currentcolor' stroke='currentcolor' />
    </svg>
    <svg aria-hidden="true" focusable="false"
         class="Toggle__icon Toggle__icon--cross" width='13' height='13' viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M11.167 0L6.5 4.667L1.833 0L0 1.833L4.667 6.5L0 11.167L1.833 13L6.5 8.333L11.167 13L13 11.167L8.333 6.5L13 1.833L11.167 0Z' fill='currentcolor' />
    </svg>
  </span>

  This is the label
</label>
```

A few things to note about our markup here:

- We use `aria-hidden="true"` on our SVGs, because they should not be discoverable by assistive technologies since they are strictly decorative.
- We use `focusable="false"` on our SVGs as well to avoid an issue with Internet Explorer where SVGs are focusable by default. 
- We use `hidden` on the `.Toggle__display` container to hide it when **CSS is not available**, since it should fall back to a basic checkbox. Its display value will be overriden in CSS.

## Styles

Before we get deep into styling, I would like to clarify the terminology, just so it’s easier to follow up:

- The container is the wrapping `<label>` that contains both the toggle and the text label (`.Toggle`).
- The “toggle” is the visual toggle, green or red depending on status, and with the 2 icons (`.Toggle__display`).
- The “handle” is the circular disc covering one of the icons, and moving left and right when interacting with the toggle (`.Toggle__display::before`).
- The input is the HTML `<input>` which is visually hidden but remains accessible and focusable (`.Toggle__input`).

### The container

Let’s start with some basic styles for our container.

```css
/**
 * 1. Vertically center the toggle and the label. `flex` could be used if a 
 *    block-level display is preferred.
 * 2. Grant a position context for the visually hidden input.
 */
.Toggle {
  display: inline-flex; /* 1 */
  align-items: center; /* 1 */
  position: relative; /* 2 */
}
```

### The toggle and handle

Then, our toggle. To make it easier to tweak its styles, we rely on some CSS custom properties for the offset *around* the handle, and the diameter of the handle itself.

```css
/**
 * 1. Vertically center the icons and space them evenly in the available 
 *    horizontal space essentially giving something like: [ ✔ ✗ ]
 * 2. Size the display according to the size of the handle.
 * 3. Grant a position context for the pseudo-element making the handle.
 * 4. Give a pill-like shape with rounded corners, regardless of the size.
 * 5. The default state is considered unchecked, hence why this pale red is
 *    used as a background color.
 * 6. Give a bit of spacing between the toggle and the text label.
 */
.Toggle__display {
  --offset: 0.25em;
  --diameter: 1.8em;
  
  display: inline-flex; /* 1 */
  align-items: center; /* 1 */
  justify-content: space-around; /* 1 */

  width: calc(var(--diameter) * 2 + var(--offset) * 2); /* 2 */
  height: calc(var(--diameter) + var(--offset) * 2); /* 2 */
  
  position: relative; /* 3 */
  border-radius: 100vw; /* 4 */
  background-color: #fbe4e2; /* 5 */
  margin-right: 1ch; /* 6 */

  transition: 250ms;
  cursor: pointer;
}

/**
 * 1. Size the round handle according to the diameter custom property.
 * 2. Absolutely position the handle on top of the icons, vertically centered
 *    within the container and offset by the spacing amount on the left.
 * 3. Give the handle a solid background to hide the icon underneath. This
 *    could be dark in a dark mode theme, as long as it’s solid.
 */
.Toggle__display::before {
  content: '';

  width: var(--diameter); /* 1 */
  height: var(--diameter); /* 1 */
  border-radius: 50%; /* 1 */

  position: absolute; /* 2 */
  z-index: 2; /* 2 */
  top: 50%; /* 2 */
  left: var(--offset); /* 2 */
  transform: translate(0, -50%); /* 2 */

  background-color: #fff; /* 3 */
  transition: inherit;
}
```

### Focused styles

The reason we inserted our toggle container *after* the input itself is so we can use the adjacent sibling combinator (`+`) to style the toggle depending on the state of the input (checked, focused, disabled…).

First, let’s deal with focus styles. As long as they’re noticeable, they can be as custom as we want them to be. In order to be quite neutral, I decided to display the native focus outline around the toggle when the input is focused.

```css
/**
 * 1. When the input is focused, provide the display the default outline
 *    styles from the browser to mimic a native control. This can be
 *    customised to have a custom focus outline.
 */
.Toggle__input:focus + .Toggle__display {
  outline: 1px dotted #212121; /* 1 */
  outline: 1px auto -webkit-focus-ring-color; /* 1 */
}
```

One interesting thing I’ve noticed is that when clicking a native checkbox or its label, the focus outline does not appear. It only does so when focusing the checkbox with a keyboard. We can mimic this behaviour by removing the styles we just applied when the [`:focus-visible` selector](https://css-tricks.com/almanac/selectors/f/focus-visible/) doesn’t match.

```css
/**
 * 1. When the toggle is interacted with with a mouse click (and therefore
 *    the focus does not have to be ‘visible’ as per browsers heuristics),
 *    remove the focus outline. This is the native checkbox’s behaviour where
 *    the focus is not visible when clicking it.
 */
.Toggle__input:focus:not(:focus-visible) + .Toggle__display {
  outline: 0; /* 1 */
}
```

### Checked state

Then, we have to deal with the checked state. There are 2 things we want to do in that case: update the toggle background color from red to green, and slide the handle to the right so it covers the cross and show the checkmark (100% of its own width).

```css
/**
 * 1. When the input is checked, change the display background color to a
 *    pale green instead. 
 */
.Toggle__input:checked + .Toggle__display {
  background-color: #e3f5eb; /* 1 */
}

/**
 * 1. When the input is checked, slide the handle to the right so it covers
 *    the cross icon instead of the checkmark one.
 */
.Toggle__input:checked + .Toggle__display::before {
  transform: translate(100%, -50%); /* 1 */
}
```

### Disabled state

Finally, we can add some custom styles to make a disabled toggle a bit more explicit.

```css
/**
 * 1. When the input is disabled, tweak the toggle styles so it looks dimmed 
 *    with less sharp colors, softer opacity and a relevant cursor.
 */
.Toggle__input:disabled + .Toggle__display {
  opacity: 0.6; /* 1 */
  filter: grayscale(40%); /* 1 */
  cursor: not-allowed; /* 1 */
}
```

### The icons

Finally, we apply some styles to our icons, as recommended by [Florens Verschelde in their fantastic guide on SVG icons](https://fvsch.com/svg-icons#section-styling):

```css
.Toggle__icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  fill: currentcolor;
  vertical-align: middle;
}

/**
 * 1. The cross looks visually bigger than the checkmark so we adjust its
 *    size. This might not be needed depending on the icons.
 */
.Toggle__icon--cross {
  color: #e74c3c;
  font-size: 85%; /* 1 */
}

.Toggle__icon--checkmark {
  color: #1fb978;
}
```

## Wrapping up

As you can see, there is nothing extremely difficult with it but still a lot of things to consider. Here is what we’ve accomplished:

- We use an actual checkbox form element, which we style as a toggle.
- It conveys its status with both iconography *and* color.
- It leaves no artifacts when CSS is not available.
- It has native focus styles, and can be customised.
- It has a disabled state.
- It should be relatively easy to adapt to a dark mode provided there are some global custom properties exposed.

Pretty neat! Feel free to [play with the code on CodePen](https://codepen.io/KittyGiraudel/pen/xxgrPvg?editors=0100) and I hope this helps y’all making your toggles accessible. ✨
