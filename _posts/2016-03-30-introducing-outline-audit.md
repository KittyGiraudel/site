---
title: Introducing Outline Audit
keywords:
  - outline
  - document
  - audit
  - javascript
---

We recently had some minor issues in a project where the final document outline on some pages was somewhat broken. I investigated a little, and ended up building [a tiny tool](https://github.com/edenspiekermann/outline-audit) to audit the document outline. More on that in a bit, but first…

## What’s the document outline?

The document outline is the theoretical schema constructed from the structure of a document (such as a web page), mostly based on headings. It matters because assistive technologies like screen readers rely heavily on this to give context and help navigation. It also matters for search engines, so they can locate and index meaningful content first.

## Does it still matter in HTML5?

The short answer is yes.

The long answer says that with HTML5, we got a set of new “sectioning elements”, such as `<header>`, `<footer>`, `<section>`, `<aside>`, `<article>` and so on. The theory (a.k.a the specification) says that inside one of these elements, the document outline is being reset to create a sub-outline. In the same way, nested ordered list have their own counter and create sub-lists.

However, that is the theory. In practice, unfortunately, it is dramatically different. As of today, there is not a single browser or user assistive technology that applies this.

It means that right now, regarding document outline (exclusively), these elements are no different than `<div>`. And that means that if you rely on these sectioning elements to put `<h1>` everywhere, you end up with a flat document outline composed exclusively of `<h1>`, which hurts accessibility and possibly SEO.

> If you as a developer want to provide a meaningful document structure, use the `<h1>`–`<h6>` elements to express document structure. DO NOT rely upon the HTML5 document outline. By all means use the HTML5 section elements, but do not rely upon them to convey a meaningful structure. If at some point in the future the HTML5 document outline ceases to be a fiction, you will be covered as the use of h1–h6 is backwards compatible. — [Steve Faulkner](http://blog.paciellogroup.com/2013/10/html5-document-outline/)

To avoid these issues, we can make our heading structure consistent and meaningful. Basically, it does not matter what kind of container we use, the heading level must be meaningful in regard to the previous heading. If it is a sort of sub-section, go down one level in the heading structure. If it is an unrelated section, have the same kind of heading as before. When checking the page, we should have a logical heading structure (which also mean never skipping a heading level). It’s actually what the HTML5 specification recommends:

> Sections may contain headings of any rank, and authors are strongly encouraged to use headings of the appropriate rank for the section’s nesting level. — [HTML 5.1 - Headings and sections](http://w3c.github.io/html/sections.html#headings-and-sections)

One last thing to point out on this topic: the theory is so far away from the current state of things that the spec authors decided to review the whole thing and design something that will actually make sense and get implemented. [More to come in the next few months](https://github.com/w3c/html/issues/33). Meanwhile I highly recommend you read this [outstanding article about the document outline by Adrian Roselli](http://adrianroselli.com/2013/12/the-truth-about-truth-about-multiple-h1.html).

## Alright, what about the script?

[Outline Audit](https://github.com/edenspiekermann/outline-audit) is a small JavaScript program that analyses the document outline of the current page, and emits warnings in the developer console when something looks odd.

## How to use it?

Given the size of the script (and that it doesn’t have any dependency), there are quite a few ways to use it. What you could do is save it as a snippet in your DevTools (see next screenshot).

![Saving Outline Audit as a DevTools snippet](http://i.imgur.com/2kDj2ZI.png)

Or you could also have a bookmarklet for this:

```html
<a
  href="javascript:(function(e,n,t){n=e.body,t=e.createElement('script'),t.src='https://cdn.rawgit.com/edenspiekermann/outline-audit/master/index.js',t.async=!0,t.onload=function(){new Outline().warn()},n.appendChild(t)}(document));"
  >Outline Audit</a
>
```

<a href="javascript:(function(e,n,t){n=e.body,t=e.createElement('script'),t.src='https://cdn.rawgit.com/edenspiekermann/outline-audit/master/index.js',t.async=!0,t.onload=function(){new Outline().warn()},n.appendChild(t)}(document));">Outline Audit</a>

Anyway. To use it, instanciate an `Outline` on the element you want (default is the `document` element).

```js
var o = new Outline()
```

From there, you can display the audit result in the console through the `.warn(..)` method:

```js
o.warn()
```

If you want the audit result as an array, you can use the `.audit(..)` method:

```js
var auditResult = o.audit()
```

Last, if you want to get the outline tree itself, you can use the `.get(..)` method:

```js
var outlineTree = o.get()
```

## How does it work?

Nothing incredibly complicated, really. It consists on a function that iterates over all headings of the document in one pass, building a data tree based on their position related to each others.

Then, another function is in charge of reading this tree to check for errors. Last but not least, another function just prints these warnings in the console. That’s it.

If you’re curious about the logic, I recommend you [read the script](https://github.com/edenspiekermann/outline-audit/blob/master/index.js). It’s also [tested with Mocha](https://github.com/edenspiekermann/outline-audit/tree/master/tests), to make sure it does not warn when it’s not supposed to.

## What’s next?

If you have any idea to improve this tool, please tell. I’d be more than happy to have a look at it. In the meantime, check your outlines and make sure they’re not broken! :)
