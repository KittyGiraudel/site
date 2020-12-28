---
title: 'A11yAdvent Day 9: Forms'
---

The web is essentially forms. Any time we, as users, want to interact with a page in a way that goes beyond following links, it is done through forms. Search bar? A form. Chat window? A form. Questionaire? A form. Forms are an essential part of the web, yet they are too often hacked around.

Forms need to be built in a particular way so that everyone can use them efficiently. Whether you are a power-user navigating with the keyboard for speed, or a blind or short-sighted person using a screen-reader, forms can be tedious to fill and that’s why we need to pay a particular attention to them.

Let’s go through a little recap of what is important when building accessible forms.

### Labels

All fields should be labeled, regardless of design considerations. Labels can always be [visually hidden](/2020/12/03/a11y-advent-hiding-content), but they have to be present in the DOM, and be correctly linked to their field through the `for`/`id` pair. Placeholders are not labels.

Additionally, labels should indicate the expected format if any, and whether the field is required or not. If all fields are required, an informative message can be issued at the top of the form to state so.

```html
<label for="ssn">Social Security Number (xxx-xxx-xxx) (required)</label>
<input type="text" name="ssn" id="ssn" required />
```

### Errors

Poor error reporting has to be one of the main issues regarding forms on the web. And to some extent, I can understand why as it’s not very intuitive.

First of all, errors should be reported per field instead of as a whole. Depending on the API in place, it’s not always possible unfortunately, and that’s why it’s important as frontend developers to be involved in API design as well.

A field should be mapped to its error container through an `aria-describedby`/`id` attribute pair. It is very important that the error container is always present in the DOM regardless of whether there are errors (and not dynamically inserted with JS), so the mapping can be done on the accessibility tree.

```html
<label for="age">Age</label>
<input type="number" name="age" id="age" aria-describedby="age-errors" />
<div id="age-errors"></div>
```

After displaying an error, the focus should be moved to the relevant field. In case multiple errors were displayed, the focus should be moved to the first invalid field. This is why it is interesting to use HTML validation when possible, as this is all done out of the box.

### Disabled Buttons

Disabled buttons cannot be discovered by screen-readers as they are, so-to-say, removed from the accessibility tree. Therefore, the usage of disabled buttons can cause an issue when the sole button of a form is undiscoverable by assistive technologies.

To work around this problem, the submit button of a form should effectively never be `disabled` and should trigger form validation when pressed.

The button can have `aria-disabled="true"` to still be discoverable and indicate that it is technically not active (due to missing or invalid information for instance). CSS can be used to make a button with that ARIA attribute look like a disabled button to make it visually understandable as well.

There are some rare cases where having a fully `disabled` button is acceptable:

- A previous/next button when reaching the first/last item in a set. For instance, the navigation buttons of a slider.
- Off-screen controls that should not be focusable at a given time. For instance, buttons within inactive slides in a slider.

### Miscellaneous

Radio inputs with the same name should be grouped within a `<fieldset>` element which has its own `<legend>`. This is important so they can be cycled through with the arrow keys.

```html
<fieldset>
  <legend>How comfortable are you with #a11y?</legend>
  <label for="very"> <input type="radio" name="a11y" id="very" /> Very </label>
  <label for="so-so">
    <input type="radio" name="a11y" id="so-so" /> So-so
  </label>
  <label for="not-at-all">
    <input type="radio" name="a11y" id="not-at-all" /> Not at all
  </label>
</fieldset>
```
