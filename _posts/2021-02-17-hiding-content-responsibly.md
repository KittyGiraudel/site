---
title: Hiding Content Responsibly
edits:
  - date: 2021/02/25
    md: Vincent Valentin pointed out on Twitter that he has [a very detailed tabular version on CodePen](https://codepen.io/vincent-valentin/full/JjGmxzV). Thank you for sharing!
---

I wrote about [hiding content](/2020/12/03/a11y-advent-hiding-content/) during the A11yAdvent calendar, namely how to make something [invisible but still accessible for screen readers](/2016/10/13/css-hide-and-seek/). I’m going to mention the “accessibility tree” a few times in this article, so be sure to read [how accessibility trees inform assistive technologies](https://hiddedevries.nl/en/blog/2019-06-27-how-accessibility-trees-inform-assistive-tech) by Hidde de Vries.

In this article, I want to discuss all the ways to hide something, be it through HTML or CSS, and when to use which. Feel free to jump to the [summary](#summary).

## Overview

| Method                       | Visible               | Accessible |
| :--------------------------- | :-------------------- | :--------- |
| `.sr-only` class             | No                    | Yes        |
| `aria-hidden="true"`         | Yes                   | No         |
| `hidden=""`                  | No                    | No         |
| `display: none`              | No                    | No         |
| `visibility: hidden`         | No, but space remains | No         |
| `opacity: 0`                 | No, but space remains | Depends    |
| `clip-path: circle(0)`       | No, but space remains | Depends    |
| `transform: scale(0)`        | No, but space remains | Yes        |
| `width: 0` + `height: 0`     | No                    | No         |
| `content-visibility: hidden` | No                    | No         |

## The `.sr-only` class

[This combination of CSS declarations](https://kittygiraudel.com/snippets/sr-only-class/) hides an element from the page, but keeps it accessible for screen readers. It comes in very handy to provide more context to screen readers when the visual layout is enough with it.

{% info %} This technique should only be used to mask text. In other words, there shouldn’t be any focusable element inside the hidden element. This could lead to annoying behaviours, like scrolling to an invisible element. {% endinfo %}

**Summary:**

- Visible: no (removed from layout)
- Accessible: yes
- Element + children focusable: yes (⚠️)

**Verdict:** 👍 Great to visually hide text content while preserving it for assistive technologies.

## The `aria-hidden` attribute

The [`aria-hidden` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute), when set to `true`, hides the content from the accessibility tree, while keeping it visually visible. It stays visible because browsers do not apply styles to elements with `aria-hidden="true"` so this only impacts the accessibility tree.

{% info %} It is important to note that any focusable elements within an element with `aria-hidden="true"` remains focusable, which can be a big problem for screen readers. Make sure there are no focusable elements within such container and that the element itself is also not focusable either (see the [fourth rule of ARIA](https://www.w3.org/TR/using-aria/#fourth)). {% endinfo %}

**Summary:**

- Visible: yes
- Accessible: no (except via `aria-describedby` and `aria-labelledby`)
- Element + children focusable: yes (⚠️)

**Verdict:** 👍 Great to hide something from assistive technologies while keeping it visually displayed. Use with caution.

## The `display: none` declaration and the `hidden` attribute

The `display: none` declaration and the `hidden` HTML attribute do the same thing: they visually remove an element from the rendering tree _and_ from the accessibility tree.

What’s nice about the `hidden` attribute is that you can mask content entirely through HTML without having to write any CSS, which can be handy in some contexts.

{% info %} Interesting fact shared by [Aurélien Levy](https://twitter.com/goetsu): removed content with these methods can still be vocalized when referenced via `aria-describedby` or `aria-labelledby`. This can be handy to avoid double-vocalization. For instance, if a field references a text node via `aria-describedby`, this content can safely be hidden (with `hidden`, `display: none` or even `aria-hidden="true"`) so that it cannot be discovered normally, but still be announced when the field is focused. {% endinfo %}

**Summary:**

- Visible: no (removed from layout)
- Accessible: no (except via `aria-describedby` and `aria-labelledby`)
- Element + children focusable: no

**Verdict:** 👍 Great to hide something from both assistive technologies and screens.

## The `visibility: hidden` declaration

The `visibility: hidden` CSS declaration visually hides an element without affecting the layout. The space it takes remains empty and surrounding content doesn’t reflow in its place.

From the accessibility perspective, the declaration behave like `display: none` and the content is removed entirely and not accessible.

**Summary:**

- Visible: no (remains in layout)
- Accessible: no
- Element + children focusable: no

**Verdict:** 👍 Good when `display: none` is not an option and the layout permits it.

## The `opacity: 0`, `clip-path: circle(0)` declarations

The `opacity: 0` and `clip-path: circle(0)` CSS declarations visually hide an element, but the place it takes is not freed, just like `visibility: hidden`.

Whether the content remains accessible depends on assistive technologies. Some will consider the content inaccessible and skip it, and some will still read it. For that reason, it is recommended not to use these declarations to consistently hide content.

**Summary:**

- Visible: no (remains in layout)
- Accessible: depends
- Element + children focusable: yes (⚠️)

**Verdict:** ✋ Shady and inconsistent, so don’t except maybe for visual animations purposes.

## The `transform: scale(0)` declaration

The `transform: scale(0)` CSS declaration visually hides an element, but the place it takes is not freed, just like `visibility: hidden`, `opacity: 0` and `clip-path: circle(0)`.

The content remains accessible to screen readers though.

**Summary:**

- Visible: no (remains in layout)
- Accessible: yes
- Element + children focusable: yes

**Verdict:** ✋ Restrict for visual animations purposes.

## The `width: 0` and `height: 0` declarations

Resizing an element to a 0x0 box with the `width` and `height` CSS properties and hiding its overflow will cause the element not to appear on screen and as far as I know all screen readers will skip it as inaccessible. However, this technique are usually considered quite fishy and could cause SEO penalties.

**Summary:**

- Visible: no (removed from layout)
- Accessible: no
- Element + children focusable: no

**Verdict:** 👎 Unclear and unexpected, risky from a SEO perspective, don’t.

## The `content-visibility: hidden` declaration

The `content-visibility` CSS property was introduced as a way to improve performance by hinting the browser (Chrome, as of writing) to skip rendering of a certain element until it is within the viewport.

Content made hidden with `content-visibility: hidden` will effectively be absent from the accessibility tree entirely (just like with `display: none`). This is not necessarily intended behaviour though, and for that reason it is recommended not to use that declaration on landmarks.

**Summary:**

- Visible: no (removed from layout)
- Accessible: no
- Element + children focusable: no

**Verdict:** 👎 Poor support, poorly implemented, don’t.

## Summary

Generally speaking, you want to avoid having too many discrepancies between the visual content, and the underlying content exposed to the accessibility layer. The more in sync they are, the better for everyone. Remember that a clearer visual interface with more explicit content benefits everyone.

- If you need to hide something both visually and from the accessibility tree, use `display: none` or the `hidden` HTML attribute. Valid cases: show/hide widget, offscreen navigation, closed dialog.

- If you need to hide something from the accessibility tree but keep it visible, use `aria-hidden="true"`. Valid cases: visual content void of meaning, icons.

- If you need to visually hide something but keep it accessible, use the [visually hidden CSS declaration group](https://kittygiraudel.com/snippets/sr-only-class/). Valid cases: complementary content to provide more context, such as for [icon buttons/links](https://kittygiraudel.com/2020/12/10/accessible-icon-links/).
