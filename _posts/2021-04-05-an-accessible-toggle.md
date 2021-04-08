---
title: An accessible toggle
---

Toggles (or sometimes “toggle switches”) are heavily used in modern interfaces. They tend to be relatively straightforward and can be thought as glorified checkboxes. Yet, they are often made inaccessible one way or another.

In this article, I will show a small HTML + CSS only implementation of an accessible toggle that you can basically copy in your own projects and tweak at your own convenience.

- [Markup](#markup)
- [Styling](#styling)
  - [The container](#the-container)
  - [The toggle and handle](#the-toggle-and-handle)
  - [Focused styles](#focused-styles)
  - [Checked state](#checked-state)
  - [Disabled state](#disabled-state)
  - [Right-to-left support](#right-to-left-support)
  - [The icons](#the-icons)
- [Button variant](#button-variant)
- [Wrapping up](#wrapping-up)

<p class="codepen" data-height="365" data-theme-id="light" data-default-tab="result" data-user="KittyGiraudel" data-slug-hash="xxgrPvg" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="xxgrPvg">
  <span>See the Pen <a href="https://codepen.io/KittyGiraudel/pen/xxgrPvg">
  xxgrPvg</a> by Kitty Giraudel (<a href="https://codepen.io/KittyGiraudel">@KittyGiraudel</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

{% assign toggles = "Dion mentions how [the toggle might look reversed](https://twitter.com/_diondiondion/status/1379828760585834497?s=20), a sentiment backed up by [Rawrmonstar](https://twitter.com/rawrawrmonstar/status/1379555735118352384?s=20), and Mikael Kundert mentions how [checkboxes are usually simpler](https://twitter.com/iMiksu/status/1379802269709897737?s=20)." | markdown %}

{% info %} **Disclaimer:** Before using a toggle switch, consider whether this is the best user interface for the situation. {% footnoteref "toggles" toggles %}Toggles can be visually confusing{% endfootnoteref %} and in some cases, [a button might be more suited](#button-variant).{% endinfo %}

## Markup

As always, let’s start with the HTML. In this case, we are going to start with the very basics, which is a properly labelled checkbox. It’s an `<input>` with a `<label>`, with the correct attributes, and a visible label.

If the toggle causes an immediate action (such as switching a theme) and therefore relies on JavaScript, it should use a `<button>` instead. Refer to the [button variant](#button-variant) for more information about the markup—the [styles](#styles) are essentially the same. Thanks to Adrian Roselli for pointing this out!

```html
<label class="Toggle" for="toggle">
  <input type="checkbox" name="toggle" id="toggle" class="Toggle__input" />
  This is the label
</label>
```

{% info %} It is worth mentioning that this is not the only way to mark up such interface component. For instance, it is possible to use 2 radio inputs instead. Sara Soueidan goes more in details about [designing and building toggle switches](https://www.sarasoueidan.com/blog/toggle-switch-design/).{% endinfo %}

Now, we are going to need a little more than this. To avoid conveying the status of the checkbox relying solely on color ([WCAG Success Criteria 1.4.1 Use of Color](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-without-color.html)), we are going to use a couple icons.

The way it’s going to work is we’re going to have a small container between the input and the text label which contains 2 icons: a checkmark and a cross (taken from [Material UI icons](https://material.io/resources/icons/)). Then we’ll create the toggle handle with a pseudo-element to cover one of the icon at a time.

```html
<label class="Toggle" for="toggle">
  <input type="checkbox" name="toggle" id="toggle" class="Toggle__input" />

  <span class="Toggle__display" hidden>
    <svg
      aria-hidden="true"
      focusable="false"
      class="Toggle__icon Toggle__icon--checkmark"
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.08471 10.6237L2.29164 6.83059L1 8.11313L6.08471 13.1978L17 2.28255L15.7175 1L6.08471 10.6237Z"
        fill="currentcolor"
        stroke="currentcolor"
      />
    </svg>
    <svg
      aria-hidden="true"
      focusable="false"
      class="Toggle__icon Toggle__icon--cross"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.167 0L6.5 4.667L1.833 0L0 1.833L4.667 6.5L0 11.167L1.833 13L6.5 8.333L11.167 13L13 11.167L8.333 6.5L13 1.833L11.167 0Z"
        fill="currentcolor"
      />
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
 * 2. Make sure the toggle remains clean and functional even if the label is
 *    too wide to fit on one line. Thanks @jouni_kantola for the heads up!
 * 3. Grant a position context for the visually hidden and absolutely
 *    positioned input.
 * 4. Provide spacing between the toggle and the text regardless of layout
 *    direction. If browser support is considered insufficient, use
 *    a right margin on `.Toggle__display` in LTR, and left margin in RTL.
 *    See: https://caniuse.com/flexbox-gap
 */
.Toggle {
  display: inline-flex; /* 1 */
  align-items: center; /* 1 */
  flex-wrap: wrap; /* 2 */
  position: relative; /* 3 */
  gap: 1ch; /* 4 */
}
```

### The toggle and handle

Then, our toggle. To make it easier to tweak its styles, we rely on some CSS custom properties for the offset _around_ the handle, and the diameter of the handle itself.

```css
/**
 * 1. Vertically center the icons and space them evenly in the available 
 *    horizontal space, essentially giving something like: [ ✔ ✗ ]
 * 2. Size the display according to the size of the handle. `box-sizing`
 *    could use `border-box` but the border would have to be considered
 *    in the `width` computation. Either way works.
 * 3. For the toggle to be visible in Windows High-Contrast Mode, we apply a
 *    thin semi-transparent (or fully transparent) border.
 *    Kind thanks to Adrian Roselli for the tip:
 *    https://twitter.com/aardrian/status/1379786724222631938?s=20
 * 4. Grant a position context for the pseudo-element making the handle.
 * 5. Give a pill-like shape with rounded corners, regardless of the size.
 * 6. The default state is considered unchecked, hence why this pale red is
 *    used as a background color.
 */
.Toggle__display {
  --offset: 0.25em;
  --diameter: 1.8em;

  display: inline-flex; /* 1 */
  align-items: center; /* 1 */
  justify-content: space-around; /* 1 */

  width: calc(var(--diameter) * 2 + var(--offset) * 2); /* 2 */
  height: calc(var(--diameter) + var(--offset) * 2); /* 2 */
  box-sizing: content-box; /* 2 */

  border: 0.1em solid rgb(0 0 0 / 0.2); /* 3 */

  position: relative; /* 4 */
  border-radius: 100vw; /* 5 */
  background-color: #fbe4e2; /* 6 */

  transition: 250ms;
  cursor: pointer;
}

/**
 * 1. Size the round handle according to the diameter custom property.
 * 2. For the handle to be visible in Windows High-Contrast Mode, we apply a
 *    thin semi-transparent (or fully transparent) border.
 *    Kind thanks to Adrian Roselli for the tip:
 *    https://twitter.com/aardrian/status/1379786724222631938?s=20
 * 3. Absolutely position the handle on top of the icons, vertically centered
 *    within the container and offset by the spacing amount on the left.
 * 4. Give the handle a solid background to hide the icon underneath. This
 *    could be dark in a dark mode theme, as long as it’s solid.
 */
.Toggle__display::before {
  content: '';

  width: var(--diameter); /* 1 */
  height: var(--diameter); /* 1 */
  border-radius: 50%; /* 1 */

  box-sizing: border-box; /* 2 */
  border: 0.1 solid rgb(0 0 0 / 0.2); /* 2 */

  position: absolute; /* 3 */
  z-index: 2; /* 3 */
  top: 50%; /* 3 */
  left: var(--offset); /* 3 */
  transform: translate(0, -50%); /* 3 */

  background-color: #fff; /* 4 */
  transition: inherit;
}
```

The transition here is so the handle gently slides from one side to the other. This might be a little distracting or unsettling for some people, so it’s advised to disable this transition when the [reduced motion is enabled](/2018/03/19/implementing-a-reduced-motion-mode/). This could be done with the following snippet:

```css
@media (prefers-reduced-motion: reduce) {
  .Toggle__display {
    transition-duration: 0ms;
  }
}
```

### Focused styles

The reason we inserted our toggle container _after_ the input itself is so we can use the adjacent sibling combinator (`+`) to style the toggle depending on the state of the input (checked, focused, disabled…).

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

Then, we have to deal with the checked state. There are 2 things we want to do in that case: update the toggle background color from red to green, and slide the handle to the right so it covers the cross and shows the checkmark (100% of its own width).

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

{% info %}[Adrian Roselli](https://twitter.com/aardrian/status/1379776239838322689?s=20) rightfully pointed out that this design does not account for a possibly “mixed” (or [“indeterminate” state](https://css-tricks.com/indeterminate-checkboxes/)). This is true for sake of simplicity since most checkboxes/toggles do not need such state, but should be considered when needed.{% endinfo %}

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

### Right-to-left support

I originally forgot about right-to-left support and Adrian Roselli was kind enough to poke me so I update the code. Ideally, we would use the `:dir()` pseudo-class unfortunately [browser support is pretty abysmal](https://caniuse.com/css-dir-pseudo) as of writing so we have to rely on the `[dir]` attribute selector instead.

We need to adjust everything that’s currently directional so the original position of the handle, and the checked position of the handle.

```css
/**
 * 1. Flip the original position of the unchecked toggle in RTL.
 */
[dir='rtl'] .Toggle__display::before {
  left: auto; /* 1 */
  right: var(--offset); /* 1 */
}

/**
 * 1. Move the handle in the correct direction in RTL.
 */
[dir='rtl'] .Toggle__input:checked + .Toggle__display::before {
  transform: translate(-100%, -50%); /* 1 */
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

## Button variant

As mentioned previously, using a checkbox is not necessarily the most appropriate markup. If the toggle has an immediate effect (and therefore relies on JavaScript), and provided it cannot have an indeterminate state, then it should be a `<button>` element with the `aria-pressed` attribute instead.

Adrian Roselli has an insightful decision tree to pick between a checkbox and a button in [his piece about toggles](https://adrianroselli.com/2019/08/under-engineered-toggles-too.html).

Fortunately, it is easy to adapt our code so it works all the same as a button. First, we tweak the HTML so the `<label>` becomes a `<button>`, and the `<input>` is removed.

```html
<button class="Toggle" type="button" aria-pressed="false">
  <span class="Toggle__display" hidden>
    <!-- The toggle does not change at all -->
  </span>
  This is the label
</button>
```

Then, we need to make sure our `<button>` does not look like one. To do so, we reset the default button styles, including the focus outline since it is applied on the toggle instead.

```css
/**
 * 1. Reset default <button> styles.
 */
button.Toggle {
  border: 0; /* 1 */
  padding: 0; /* 1 */
  background: transparent; /* 1 */
  font: inherit; /* 1 */
}

/**
 * 1. The focus styles are applied on the toggle instead of the container, so
 *    the default focus outline can be safely removed.
 */
.Toggle:focus {
  outline: 0; /* 1 */
}
```

Then, we need to complement all our input-related selectors with a variation for the button variant.

```diff
+ .Toggle:focus .Toggle__display,
.Toggle__input:focus + .Toggle__display {
  /* … */
}

+ .Toggle:focus:not(:focus-visible) .Toggle__display,
.Toggle__input:focus:not(:focus-visible) + .Toggle__display {
  /* … */
}

+ .Toggle[aria-pressed="true"] .Toggle__display::before,
.Toggle__input:checked + .Toggle__display::before {
  /* … */
}

+ .Toggle[disabled] .Toggle__display,
.Toggle__input:disabled + .Toggle__display {
  /* … */
}

+ [dir="rtl"] .Toggle[aria-pressed="true"] + .Toggle__display::before,
[dir="rtl"] .Toggle__input:checked + .Toggle__display::before {
  /* … */
}
```

That’s about it! This way, we can use either the checkbox markup or the button markup, depending on whats more appropriate for the situation, and have the same styles in both cases. Pretty handy!

## Wrapping up

As you can see, there is nothing extremely difficult with it but still a lot of things to consider. Here is what we’ve accomplished:

- We use an actual checkbox form element, which we style as a toggle.
- It conveys its status with both iconography _and_ color.
- It leaves no artifacts when CSS is not available.
- It has native focus styles, and can be customised.
- It has a disabled state.
- It has right-to-left support, if necessary.
- It should be relatively easy to adapt to a dark mode provided there are some global custom properties exposed.

Pretty neat! Feel free to [play with the code on CodePen](https://codepen.io/KittyGiraudel/pen/xxgrPvg?editors=0100) and I hope this helps y’all making your toggles accessible. ✨ I recommend reading these articles to go further:

- [Designing and building toggle switches](https://www.sarasoueidan.com/blog/toggle-switch-design/) by Sara Soueidan
- [Toggle buttons](https://inclusive-components.design/toggle-button/) by Heydon Pickering
- [ARIA switch controls](https://scottaohara.github.io/aria-switch-control/) by Scott O'Hara
- [Under-engineered toggles](https://adrianroselli.com/2019/08/under-engineered-toggles-too.html) by Adrian Roselli
