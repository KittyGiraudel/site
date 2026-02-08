---
title: Shadow roots and inheritance
description: A short explanation of an unintuitive behavior of CSS and shadow roots
---

I encountered a bit of a HTML/CSS oddity the other day, and was a little stumped as to what was happening so I thought I’d share what I learnt in case that helps other people stumbling across the same thing.

## The problem

Take a basic `<details>` and `<summary>` combo:

```html
<details>
  <summary>System Requirements</summary>
  <p>
    Requires a computer running an operating system. The computer must have some
    memory and ideally some kind of long-term storage. An input device as well
    as some form of output device is recommended.
  </p>
</details>
```

Now, consider the [following inocuous CSS](https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/):

```css
html {
  box-sizing: border-box;
}

* {
  box-sizing: inherit;
}
```

While there is nothing too ground-breaking here, what’s interesting to note is that anything within the `<details>` element will have a `content-box` box sizing, and _not_ a `border-box` one.

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="KKmONwP" data-user="KittyGiraudel" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  Feel free to judge by yourself in this <a href="https://codepen.io/KittyGiraudel/pen/KKmONwP">demo</a>.
</p>

This is not specific to `box-sizing` though. There is nothing special about this property that would cause this behaviour. In face, all enforced inheritance break down at the `<details>` layer, as [Šime Vidas pointed out on Twitter](https://twitter.com/simevidas/status/1428503137816612871?s=20).

## The reason

[Amelia Bellamy-Royds](https://twitter.com/AmeliasBrain/status/1428762631725326339?s=20) was so kind as to explain why that is:

> Because of the weird display model of `<details>`, it is implemented as a shadow DOM (with the summary slotted in first, and then the rest of the light DOM contents). Inherited properties will inherit through the composed tree including shadow elements, which you can’t style.
>
> CSS inheritance should follow [&lt;details> → shadow root → &lt;slot> → &lt;summary>]. But `box-sizing` isn't normally inherited, and the `* { box-sizing: inherit }` rule in the document won’t match either the shadow root node or the slot element.

Amelia then recommended enabling the “Show user agent shadow DOM” Chromium DevTools setting, which enhance the DOM representation with browser shadow DOM. Inspecting our demo, we can see something like this now:

```html
<details>
  #shadow-root (user-agent)
  <slot name="user-agent-custom-assign-slot" id="details-summary">
    <!-- ↪ <summary> reveal -->
  </slot>
  <slot name="user-agent-default-slot" id="details-content">
    <!-- ↪ <p> reveal -->
  </slot>

  <summary>System Requirements</summary>
  <p>
    Requires a computer running an operating system. The computer must have some
    memory and ideally some kind of long-term storage. An input device as well
    as some form of output device is recommended.
  </p>
</details>
```

As Amelia explains, the `<summary>` is inserted in the first shadow root slot, while the rest of the content (called “light DOM”, or the `<p>` tag in our case) is inserted in the second slot.

The thing is, none of these slots or the shadow root are matched by the universal selector `*`, which only matches elements from the light DOM. Therefore, `<summary>` properly inherits `box-sizing` from its parent, but its inner shadow root does not, and neither do the inner slots, hence why the `<summary>` and the `<p>` elements don’t.

## The workaround

I played with some ideas to apply the `box-sizing` rule to shadow roots as well, but I didn’t find anything too conclusive.

What’s particularly interesting is that things work as you’d expect on Firefox though. So either Firefox does not implement `<details>` with Shadow DOM (which it doesn’t have to, as the implementation is not specified), or it does but it makes inheritance work as expected. There is an [open whatwg/html issue about this](https://github.com/whatwg/html/issues/3748).

I guess a simple fix is to apply `box-sizing: border-box` to `details > *` as well, or to apply `box-sizing: border-box` to _everything_ and bypass inheritance entirely.
