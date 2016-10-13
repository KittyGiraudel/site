---
title: "CSS Hide-and-Seek"
guest: "Gaël Poupard"
tags:
  - css
  - accessibility
  - a11y
---

> This article is a translation from [Cache-cache CSS](http://www.ffoodd.fr/cache-cache-css/) by accessibility expert [Gaël Poupard](https://twitter.com/ffoodd_fr). All credits to him.

**Or how to visually hide some text while keeping it accessible.**

And even if I find this stupid — hiding text from some users but not others seems inherently wrong from an accessibility stand point to me — it’s a recurring need.

There are many ways of doing this, that I won’t detail here. For the past few years, I’ve been using this technique from [Thierry Koblentz](https://twitter.com/thierrykoblentz) described on [Yahoo!’s dev blog](https://developer.yahoo.com/blogs/ydn/clip-hidden-content-better-accessibility-53456.html). It’s by far the most comprehensive, and — to my knowledge — the only way supporting <abbr title="Right To Left">RTL</abbr> text orientation.

Unfortunately it’s not without issue anymore.

## Deprecated property

The “magic trick” of this solution relies on the `clip` property. It’s simple to understand and very efficient. Only downside: `clip` has been deprecated by the [CSS Masking Level 1 module](https://www.w3.org/TR/css-masking-1/).

No worries. This technique being quite old now, there is no surprise it’s getting obsolete. The new specification recommends using `clip-path` to replace `clip`. Which is not ideal, because [`clip-path` support is still so-so](http://caniuse.com/#feat=css-clip-path). Thus we have to keep `clip` *and* add `clip-path` as progressive enhancement.

That being said, the syntax is different. After a bit of research, [Yvain Liechti suggested this short version](https://twitter.com/ryuran78/status/778943389819604992) to get the expected result:

```css
clip-path: inset(50%);
```

Problem solved.

## Shrinked text

[J. Renée Beach warned](https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe) about the `width: 1px` declaration having side effects on text rendering and therefore on its vocalisation by screen readers. 

The suggested solution is both simple and logical: preventing the text from wrapping so that spaces between words are preserved.

Only one declaration does that:

```css
white-space: nowrap;
```

Problem solved again.

## The full gist

Here is the final version I came up with, with [another trick from Yvain Liechti](https://twitter.com/ryuran78/status/786531490343550977) to prevent already positionned elements to be stretched:

```css  
.sr-only {
  border: 0 !important;
  bottom: auto !important;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px !important;
  overflow: hidden;
  padding: 0 !important;
  position: absolute !important;
  right: auto !important;
  width: 1px !important;
  white-space: nowrap;
}
```
  
You can find it [on CodePen](http://codepen.io/ffoodd/pen/gwKZyq?editors=1100#) or in [this Gist](https://gist.github.com/ffoodd/000b59f431e3e64e4ce1a24d5bb36034). What do you think?
