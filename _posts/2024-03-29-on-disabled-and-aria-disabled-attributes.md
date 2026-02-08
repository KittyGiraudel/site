---
title: On disabled and aria-disabled attributes
description: A write-up about the disabled and aria-disabled attributes and their impact on accessibility
---

There was [this tweet](https://x.com/housecor/status/1773329972637134954?s=20) by Cory House about the `disabled` and `aria-disabled` attributes to which [I replied](https://x.com/KittyGiraudel/status/1773612870351065425?s=20) because I found it a little misleading. And I didn’t want to see like I was just making a snarky comment or something, so here is the longer version of my thoughts.

The tweet in question:

> General HTML rule:  
> “disabled” optimizes for DX. It’s simple and easy for developers.  
> “aria-disabled” optimizes for UX. It improves accessibility and discovery for users.  
> — [Cory House on Twitter](https://x.com/housecor/status/1773329972637134954?s=20)

What I mentioned on Twitter already is that I find these blanket statements unhelpful. More worryingly, I _feel_ like the most obvious takeaway from that tweet is “`disabled` bad, `aria-disabled` good”, and that’s certainly not that simple. So let’s break it down a bit.

## What’s the difference anyway?

The `disabled` attribute is meant to mark an interactive element — typically a form control or a button — as, you guessed it, disabled. This causes it to be unfocusable, unmodifyable, barred from constraint validation and not sent alongside form payloads. In most user agents, it also applies additional styles to the element in question to make it visually “greyed out”.

The `aria-disabled` attribute on the other hand is only here to _convey_ disabled semantics. It does not change the operability of the element itself, nor does it change its appearance. It just hints assistive technologies that the element is supposedly disabled. An element with the `aria-disabled` attribute is still focusable, can be interacted with, and in the case of a form control, will have its value sent along form submissions.

## When to use which?

It kind of depends on what the **intent** is.

If you have a form with plenty fields, and some of them become irrelevant based on the value of other previous fields, using the `disabled` attribute seems like a good option. These fields can be safely omitted entirely, they do not necessarily need to be discovered either if they are obsolete, and they shouldn’t be sent with the form because they are moot.

{% info %} Side note: If a form control should not be editable but should have its value sent alongside the form, or if having access to its value is relevant for any reason, then prefer the `readonly` boolean attribute. {% endinfo %}

Now, if you have a form submit button that is not ready yet because the form needs to be completed first, then `aria-disabled` attribute is certainly better. This way, the button remains discoverable (it can be tabbed to) and interactive (it can be used to trigger form validation). This is what we want in a case like this, which is why there are more than a few articles about the danger of disabled **buttons** specifically:

- [Disabled buttons suck](https://axesslab.com/disabled-buttons-suck/) by Hampus Sethfors
- [The problem with disabled buttons and what to do instead](https://adamsilver.io/blog/the-problem-with-disabled-buttons-and-what-to-do-instead/) by Adam Silver
- [Making disabled buttons more inclusive](https://css-tricks.com/making-disabled-buttons-more-inclusive/) by Sandrina Pereira
- [Usability Pitfalls of Disabled Buttons, and How To Avoid Them](https://www.smashingmagazine.com/2021/08/frustrating-design-patterns-disabled-buttons/) by Vitaly Friedman
- [Disabled Buttons in User Interface](https://uxplanet.org/disabled-buttons-in-user-interface-4dafda3e6fe7) by Nick Babich

## About pointer events

The `pointer-events: none` declaration disable click events on the receiving element(s). However, it does not account for keyboard events. While an element with this property cannot be clicked, it can still be tabbed to, focused and interacted with. So it’s important to make sure the experience for keyboard users remain helpful.

## What then?

Well, the takeaway is that there is no one-size-fits-all solution for this one. The `disabled` attribute is totally fine and should be used when relevant! What’s important is not to use it when the element’s interactivity is necessary to proceed, or when the lack of discoverability is problematic. In these cases, the `aria-disabled` attribute is better to still convey the same semantics, without impairing on usability.

Back to our original tweet then:

> “disabled” optimizes for DX. It’s simple and easy for developers.  
> “aria-disabled” optimizes for UX. It improves accessibility and discovery for users.

Neither the `disabled` nor the `aria-disabled` attribute “optimizes” for anything, let alone “DX vs UX”. They are both meaningful attributes with their own pros and cons, and knowing when to use which is part of an engineer’s job — even if it’s not always obvious.

That’s about it. With that, happy coding!
