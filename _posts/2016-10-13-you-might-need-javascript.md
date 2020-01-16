---
title: You might need JavaScript
tags:
  - js
  - css
  - accessibility
  - a11y
---

It’s been a rough couple of months for JavaScript. Another day, another rant about it, another article about how the ecosystem is too fragmented, the language too convoluted, and what else.

Recently enough, a project named [You Might Not Need JS](https://youmightnotneedjs.com) has seen the day. I have mixed opinions about it, and rather than writing a series of context-less tweets, I thought the sensible thing to do would be to write a couple of lines here.

Needless to say, this is obviously not meant as an offense to the project’s author, especially since I believe they (mostly) did a great job. More on that later.

## A word about the inspiration

The project which has inspired the aforementioned one is [You Might Not Need jQuery](https://youmightnotneedjquery.com/), in which its author outlined ways to use plain JavaScript rather than the jQuery library for simple tasks. It was quite a hit when it came out.

What I liked with this attempt is that it showed the world that JavaScript had come a long way and was not as hard to author as when jQuery was first invented. It also had the benefit of introducing new browser APIs (`.querySelectorAll`, `.classList`, `.matches`, `bind`) which is obviously a Good Thing™.

## Know your browser

Coming back to my initial point: I am all for teaching people not to abuse JavaScript and not to use it when it is not needed. No need to convince me that progressive enhancement is the way to go, and that relying on JavaScript for critical features is to be avoided. For that, I think Una (the project’s author) did a fantastic job.

However, I don’t believe replacing JavaScript with [CSS hacks](https://youmightnotneedjs.com/#view_switcher) is any better. People, JavaScript is not a problem. I repeat it, because it doesn’t seem that obvious these days: **JavaScript is not a problem**. It has been invented for a reason. Replacing it for the sake of replacing it is not only useless, it’s also quite harmful.

CSS is not meant to handle logic and states. It has some simple mechanisms to ease styling based on states (pseudo-classes mostly), but it is not meant to control states. JavaScript is.

At the end of the day, it boils down to knowing your browser. There are some excellent examples in this project, and almost all of them are about replacing JavaScript with native HTML. A good one is [the color picker](https://youmightnotneedjs.com/#color_picker):

```html
<label for="color-picker">Select a color</label>
<input type="color" id="color-picker" />
```

Fantastic! No need for JavaScript if the browser supports the `color` input type. Maybe only load a JS-powered color picker if it doesn’t.

Another good example is the form validation, with all the fancy HTML attributes allowing that (`required`, `pattern`, etc.). Indeed, no need for JavaScript client-side validation if the browser can do the heavy lifting for us.

I really appreciate this project promoting these new browser features in favor of heavy JavaScript modules, the same way You Might Not Need jQuery featured new DOM APIs instead of jQuery-dependent scripts. But I don’t think all examples are correctly picked, which brings me to my last point.

## A word on accessibility

The problem with blindly banishing JavaScript from interactive components is that it often means making them inaccessible. It is a popular belief to think that JavaScript is an enemy of accessibility; that’s a fallacy.

While it is strongly encouraged to make websites work without JavaScript (because it can fail to load or execute and be blocked or disabled), it does not mean JavaScript should be avoided at all cost. It means it shouldn’t be used in a critical way.

If there is one thing I learnt while building [a11y-dialog](https://github.com/edenspiekermann/a11y-dialog) and [a11y-toggle](https://github.com/edenspiekermann/a11y-toggle), it’s that JavaScript is necessary for interactive modules to be fully accessible for people using assistive technologies (such as a screen reader for instance).

A dialog element is not going to be accessible with CSS only. The `aria-hidden` attribute needs to be toggled, the focus needs to be trapped, the escape key needs to close the dialog, and I could go on.

Maybe instead of trying to reproduce the exact same module without JavaScript by using CSS hacks, we could display the content in a way that is suited for no JavaScript behaviour. Nothing states that both JS and no-JS environments should behave the same. If a module cannot fully exist without JavaScript, don’t use it in a no-JS environment; find something else.

## Final thoughts

**Be pragmatic about your approach.** If something can be done in HTML exclusively, it probably means it should be done in HTML. If the lack of browser support is likely to be an issue, fix it with JavaScript.

If something needs interactivity and state handling, it is likely to be a job for JavaScript, not CSS. A CSS hack is not any better than a clean JavaScript solution.

If you want to make it work without JavaScript: go simple. Accessible content powered by clean code is better than non-accessible content made with hacks.

With that said, happy coding. 💖
