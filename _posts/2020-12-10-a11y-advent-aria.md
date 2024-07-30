---
title: 'A11yAdvent Day 10: ARIA'
---

{% assign aria = "“Don’t use ARIA, use native HTML instead” is the first rule of ARIA as described in the [top 5 rules of ARIA](https://www.deque.com/blog/top-5-rules-of-aria/) by Deque." | markdown %}

Yesterday we discussed the usage of the `aria-disabled` and `aria-describedby` attributes so it’s a good time to talk more about ARIA as a whole. It stands for Accessible Rich Internet Applications. It’s a specification aiming at enhancing HTML in order to convey more meaning and semantics to assistive technologies, such as screen-readers.

The {% footnoteref "aria" aria %}first advice when it comes to ARIA{% endfootnoteref %} is to avoid using it when possible. It is a powerful tool that can completely change the way a page or widget gets interpreted by assistive technologies, for good or for bad, so it needs to be used carefully. Generally speaking, prefer using native HTML when possible, and only use ARIA when HTML is not enough (such as for tabs or carousels).

There are a lot of handy guides on the internet on building accessible widgets with the help of ARIA — [Inclusive Components](https://inclusive-components.design/) by Heydon Pickering has to be one of my favourite.

One thing I would like to bring your attention to is the concept of “live” regions. A live region is an area of a page that announces its content to screen-readers as it gets updated. Consider a container for notifications (or snackbars, croutons or whatever yummy thing they are called) or a chat feed.

```html
<div role="log" aria-live="polite">
  <!-- Chat messages being inserted as they are sent -->
</div>

<div role="alert" aria-live="assertive">
  <!-- Important notifications being inserted as they happen -->
</div>
```

A few things to know about live regions:

- The region container needs to be present and have the `aria-live` attribute when the document loads. It cannot be dynamically inserted at a later point unfortunately.
- A `role` attribute is not mandatory, but recommended (`role="region"` if no other role fits). Some roles (such as `log`, `status` or `alert`) have an implicit `aria-live` value, but it is recommended to specify the latter as well for maximum compatibility.
- Prefer using `polite` instead of `assertive` as the latter interrupts ongoing diction to announce the new content, which should be reserved for critical announcements.
- If the region is guaranteed no longer to be updated, set `off` as a value to tell the assistive technologies they no longer have to track changes in that container.
