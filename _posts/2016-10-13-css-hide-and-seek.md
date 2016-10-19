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

## Wrapping things up

Here is the final version I came up with:

```css  
.sr-only {
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  -webkit-clip-path: inset(50%) !important;
          clip-path: inset(50%) !important;
  height: 1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
}
```

### Warning

This technique should only be used to mask **text**. In other words, there shouldn’t be any focusable element **inside** the hidden element. This could lead to annoying behaviours, like scrolling to an invisible element.

That being said, you may want to hide a focusable element **itself**; a common candidate are **skip links** ([a WCAG 2.0 technique](https://www.w3.org/TR/2013/NOTE-WCAG20-TECHS-20130905/G1)). Most of the time we hide them until they get the focus.

[Bootstrap](https://github.com/twbs/bootstrap/blob/cf5d94f6d5685c371dcb157af74a3c6b14ec8d8e/scss/mixins/_screen-reader.scss) and [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate/blob/a2356c1cbfc560c2b140d4ab507c2a4fdc9f58f0/src/css/main.css#L119) have a pretty good solution for this: another class meant to reset these properties.

Here is the adapted version:

```css
.sr-only-focusable:focus,
.sr-only-focusable:active {
  clip: auto !important;
  -webkit-clip-path: none !important;
          clip-path: none !important;
  height: auto !important;
  overflow: visible !important;
  width: auto !important;
  white-space: normal !important;
}
```

## Go for it
  
You can find it [on CodePen](http://codepen.io/ffoodd/pen/gwKZyq?editors=1100#) or in [this Gist](https://gist.github.com/ffoodd/000b59f431e3e64e4ce1a24d5bb36034). What do you think?

## Edit
10/19/2016

### Screen readers and touch devices

Seeking some testers to make sure I didn't do any regressions, [Johan Ramon met a strange bug with VoiceOver](https://twitter.com/johan_ramon/status/788372720224526336). Digging further with [Sylvain Pigeard](https://github.com/PigeardSylvain) we found that `position: static` was buggy on iOS 10 + VO when `.sr-only-focusable` were focused.

As we thought we discovered a real bug, I headed up to Bootstrap in order to open an issue. But it came out that [an issue was already opened, inovking TalkBack too](https://github.com/twbs/bootstrap/issues/20732). I shared our result to contribute, then [Patrick H. Lauke](https://twitter.com/patrick_h_lauke) did an awesome (and still in progress) work to determinate and describe precisely the bugs. As a result, he filled many bugs:

* [Narrator](https://microsoftaccessibility.uservoice.com/forums/307429-microsoft-accessibility-feedback/suggestions/16717318-focusable-elements-should-fire-focus-event-recei), included in Windows 10 and Windows Phone;
* [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=657157), impacting TalkBack on Android;
* [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1000082) — this one was already opened, but also by Patrick Lauke recently;
* and finally, [two](https://bugs.webkit.org/show_bug.cgi?id=116046 "First webkit bug") [bugs](https://bugs.webkit.org/show_bug.cgi?id=163658 "Second webkit bug") for Webkit, impacting VoiceOver.

So. In fact, **skip links don't work with screen readers on touch devices at the time of writing**. Nice.

### SEO

[Steve Faulkner](https://twitter.com/stevefaulkner) from [the Pacielle Group](https://www.paciellogroup.com/blog/) asked to the Google Webmaster Central Help Forum directly if [extra context for vision impaired users has a negative effect on search ranking?](https://productforums.google.com/forum/#!msg/webmasters/YJcZUhtMIE4/XkOEzVakBAAJ).

Short answer: **nope**. However visually hidden content are considered secondary, in order to prevent abuses. And that's great.
