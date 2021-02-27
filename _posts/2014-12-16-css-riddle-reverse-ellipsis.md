---
title: 'CSS Riddle: reverse ellipsis'
keywords:
  - css
  - riddle
  - ellipsis
---

The other day, I wanted to do something in CSS that turned out to be quite complicated to achieve. Actually it’s amazing that something _that_ common ends up being so difficult to implement. Anyway, how would you do a reverse ellipsis in CSS, or _start ellipsis_?

A single-line _end-ellipsis_ is often used when you have some long content that you want to hide behind a `…` to prevent a line-break. It is very easy to do. You can implement it with:

```css
/**
 * 1. Hide any overflow
 * 2. Prevent any line-break
 * 3. Add ellipsis at end of line
 */
.ellipsis {
  overflow: hidden; /* 1 */
  white-space: nowrap; /* 2 */
  text-overflow: ellipsis; /* 3 */
}
```

For instance, consider this content:

> The answer to life, the universe, and everything is 42.

If you have some restricted width and applies the `.ellipsis` class:

> The answer to life, the univer…

Now what if you want to display the end of content and add ellipsis at beginning of line? Something like:

> …niverse, and everything is 42.

That is what I call a _reverse ellipsis_, although I suspect CSS specifications to call it _start ellipsis_ since the current value for `text-overflow` is actually called _end-overflow-type_. Anyway, now it’s your turn. I have created [a pen](https://codepen.io/KittyGiraudel/pen/5582f35c9596c40ae947bad2f5993fb2/) if you want to play with the initial code:

<p data-height="280" data-theme-id="0" data-slug-hash="5582f35c9596c40ae947bad2f5993fb2" data-default-tab="result" data-user="KittyGiraudel" class='codepen'>See the Pen <a href='https://codepen.io/KittyGiraudel/pen/5582f35c9596c40ae947bad2f5993fb2/'>5582f35c9596c40ae947bad2f5993fb2</a> by Kitty Giraudel (<a href='https://codepen.io/KittyGiraudel'>@KittyGiraudel</a>) on <a href='https://codepen.io'>CodePen</a>.</p>

**Beware**, next content is spoiler!

## The solution that doesn’t work everywhere

Many of you have been advising using `direction: rtl` as a magic solution.

I suspect all of you who suggested this to run Firefox, in which it does work like a charm (well, kind of). Unfortunately, Firefox is the only browser behaving correctly in right-to-left with `text-overflow: ellipsis`.

That being said, I am not sure why but Firefox does eat the full stop at the end of content. It doesn’t not happen with another character as far as I can tell. If someone has an explanation for this, please report.

In other browsers, especially Chrome, the start ellipsis is correctly displayed but not the end of content. It leads to something like:

> …The answer to life, the univer

No luck. :(

## Hacking a solution

So there is no magic one-liner to make it work everywhere. Fortunately, some of you are very creative and came up with smart hacks to achieve the desired effect. The best solution given so far is the one from [Michael Godwin](https://twitter.com/__Godwin__):

```css
.reverse-ellipsis {
  text-overflow: clip;
  position: relative;
  background-color: white;
}

.reverse-ellipsis:before {
  content: '\02026';
  position: absolute;
  z-index: 1;
  left: -1em;
  background-color: inherit;
  padding-left: 1em;
  margin-left: 0.5em;
}

.reverse-ellipsis span {
  min-width: 100%;
  position: relative;
  display: inline-block;
  float: right;
  overflow: visible;
  background-color: inherit;
  text-indent: 0.5em;
}

.reverse-ellipsis span:before {
  content: '';
  position: absolute;
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: inherit;
  z-index: 200;
  left: -0.5em;
}
```

A couple issues with Michael’s solution:

- It needs an extra element within `.reverse-ellipsis` (here a `span`);
- It involves 25 lines of CSS for such a simple effect;
- It needs a background color;
- Ellipsis is slightly off.

That being said, it is &mdash; as far as I can tell &mdash; the only solution I have seen that does work even if content does not overflow. All over solutions always display the ellipsis, even when content does fit within the container, which is a bit agressive, yielding something like:

> …&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Here is some short content.

This is far from ideal, and Michael’s solution prevents this so congratulations to Michael Godwin.

<p data-height="280" data-theme-id="0" data-slug-hash="NPNZRx" data-default-tab="result" data-user="Godwin" class='codepen'>See the Pen <a href='https://codepen.io/Godwin/pen/NPNZRx/'>NPNZRx</a> by Godwin (<a href='https://codepen.io/Godwin'>@Godwin</a>) on <a href='https://codepen.io'>CodePen</a>.</p>

Cheers to all of you who tried, and if you come up with something better, please be sure to share. ;)
