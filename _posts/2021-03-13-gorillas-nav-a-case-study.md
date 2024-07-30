---
title: 'Gorillas’ nav: a case study'
---

<style>
  video { max-width: 100%; }
  @media (min-width: 700px) { video { float: right; margin-left: 1em; max-width: 320px } }
  h2:first-of-type { clear: both; }
</style>

<video playsinline="" autoplay="" muted="" loop="" disablepictureinpicture="" aria-label="Gorillas.io site’s navigation featuring a skip link and a toggle with the brand logo in it, which displays a list of links as a dropdown when interacted with."  poster="https://pbs.twimg.com/tweet_video_thumb/EwXIW3CW8AI3mAh.jpg" src="https://video.twimg.com/tweet_video/EwXIW3CW8AI3mAh.mp4" type="video/mp4"></video>

A few days ago, I posted [a few tweets](https://twitter.com/KittyGiraudel/status/1367834491977412608?s=20) about the new [Gorillas’ website](https://gorillas.io). It’s a pretty simple site at this stage: a couple pages, not much interaction, mostly there to showcase Gorillas’ branding as we expand rapidly across Europe (check it out if you can, it’s good stuff ✨).

One of the most interesting part of the site — at least from a technical standpoint — has to be the navigation. So I thought I’d write a short piece about everything that went into it, from accessibility to behaviour to design.

- [Show me your content](#show-me-your-content)
- [Shut it down](#shut-it-down)
- [Preserving a landmark](#preserving-a-landmark)
- [It’s a blur, sir](#its-a-blur-sir)
- [Nice curves](#nice-curves)
- [Skip it](#skip-it)
- [Language switcher](#language-switcher)

## Show me your content

For good or for bad, the navigation is some sort of a dropdown. It means it’s not just a few links at the top of the page, and there are therefore a few things we had to consider.

We figured the [disclosure widget pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure) was the appropriate choice for the navigation. Basically, you have a `<button>` which controls the visibility of an adjacent container. The toggle contains [visually hidden text](/snippets/sr-only-class/) to mention what it’s for, since its only visible content is the brand logo.

For when JavaScript is not available, we originally intended to have an anchor link sending to the footer, since most if not all pages are linked from there as well.

Then I thought about using `<details>` and `<summary>` since we have pretty loose browser support expectations. It gives us a disclosure widget without needing any JavaScript, which is pretty great. We just had to tweak the styles a little to hide the default arrow and make it a bit more integrated.

```css
/**
 * 1. Remove the <summary> arrow in Firefox.
 */
summary {
  display: block; /* 1 */
  cursor: pointer;
}

/**
 * 1. Remove the <summary> arrow in all other browsers.
 */
summary::-webkit-details-marker {
  display: none; /* 1 */
}
```

{% info %} September 20th edit: using `<details>` and `<summary>` for a navigation menu is not fantastic, as [outlined by Gerardo Rodriguez](https://cloudfour.com/thinks/a-details-element-as-a-burger-menu-is-not-accessible/) and [Adrian Roselli](https://adrianroselli.com/2019/04/details-summary-are-not-insert-control-here.html). Because it gets progressively enhanced into a proper disclosure widget when JS kicks in, it _may_ be fine, but generally speaking this is not the right approach. I did not know this at the time. {% endinfo %}

## Shut it down

As much as I love `<details>` and `<summary>`, they’re also not perfect for a navigation, because clicking elsewhere or tabbing out of it does not close it.

That’s why when JavaScript is available, we replace them with a `<button>` (with `aria-controls` and `aria-expanded`) and a `<div>` with (`aria-hidden` and `aria-labelledby`), so we can have more control over the behaviour — particularly when to close the menu.

```html
<nav role="navigation">
  <button
    type="button"
    aria-controls="menu"
    aria-expanded="false"
    id="menu-toggle"
  >
    <svg aria-hidden="true" focusable="false"><!-- Logo --></svg>
    <span class="sr-only">Navigation</span>
  </button>
  <div id="menu" aria-labelledby="menu-toggle" aria-hidden="true">
    <!-- Navigation content -->
  </div>
</nav>
```

{% info %}[Interesting point raised by Aurélien Levy on Twitter](https://twitter.com/goetsu/status/1370729035156779014?s=20): When using `aria-expanded="true"`, the label should not mention “open” or “close” (or similar) as the state is already conveyed via the attribute.{% endinfo %}

Without getting too deep into technical details (especially because our implementation is in React), we use something along these lines to automatically close the menu when clicking outside of it or tabbing out of it.

```js
const menu = document.querySelector('#menu')
const handleFocusChange = event => {
  if (isOpen && !event.composedPath().includes(menu)) setIsOpen(false)
}

window.addEventListener('click', handleFocusChange)
window.addEventListener('focusin', handleFocusChange)
```

## Preserving a landmark

Because landmarks such as `<nav>` can be listed by assistive technologies, it’s important that the `<nav>` itself is not the element whose visibility is being toggled. Otherwise, it’s undiscoverable when hidden, which is not good. Instead, the `<nav>` should be the surrounding container, always visible, and contains the button to toggle a list’s visibility.

Simplified and using `<details>` and `<summary>` in this example for sake of clarity:

```html
<nav role="navigation">
  <details>
    <summary>
      <svg aria-hidden="true" focusable="false"><!-- Logo --></svg>
      <span class="sr-only">Navigation</span>
    </summary>
    <ul>
      <!-- Navigation content -->
    </ul>
  </details>
</nav>
```

## It’s a blur, sir

What’s a little subtle about the design is that the list doesn’t have a solid background — it’s a heavy blur, which gives a slight shade on top of the thick white on black typography underneath.

Fortunately, CSS now has a `backdrop-filter` property, which enables us to apply filter to the background of an element (in opposition to `filter` which applies to its entirety). We still need to make sure things look okay if the property is not supported though. `@supports` to the rescue!

```css
#menu {
  background-color: #201e1e;
  color: #fff;
}

@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  #menu {
    background-color: rgb(255 255 255 / 0.15);
    -webkit-backdrop-filter: blur(40px);
    backdrop-filter: blur(40px);
  }
}
```

This property is not without pitfalls though. Because the actual list is absolutely positioned, we could not set the backdrop filter on the `<nav>` container, because the list would end up with no background when open (against, absolutely positioned).

We thought about setting it on both the nav and the list, but for some awkward reasons, nested backdrop-filter do not work on Chrome, the list end up with no blur — fine on Safari though. Don’t ask me why.

So we ended up applying the filter on both the toggle and the list (thus covering the whole nav area with blur). As a result, we unfortunately end up with a thin yet noticeable line where the 2 blur areas meet. Sad, but I guess there is no way out.

## Nice curves

Another difficulty caused by the list being absolutely positioned is handling rounded corners. I know, right? Who knew rounded corners could be difficult? Slap a little `border-radius` on this baby and call it done. Well, unfortunately not.

The toggle has the so-called “pill” style. The corners are soft and fully embrace the shape, like one of these glossy pills. When opening the menu, the top corners stay the same, but the bottom corners of the toggle become sharp to blend in with the top corners of the list, and the curves move to the bottom corners of the list. And this needs to be handled both with and without JavaScript.

```css
details[open] > summary {
  border-radius: 30px 30px 0 0;
}
```

This design detail also makes animating the menu opening quite difficult, so much so that we didn’t bother with it.

## Skip it

Of course, we should not forget to add a skip link so people using a keyboard and/or assistive technologies can quicky access the main content without having to go through the navigation.

What’s relatively interesting about having the navigation within a disclosure widget is that the links are not focusable until the nav is being displayed, so the skip link itself loses value.

What I like about the skip link on Gorillas’ website is that it fits nicely into the navigation design, which is not always the case. More often than not, skip links end up being floating at the top of the page, a little oblivious to what’s happening around. Here, it fits nicely within the toggle area.

## Language switcher

While it will most likely move out of the navigation soon as we add more and more languages, the language switcher currently lives within the navigation menu. Although, I suppose we are playing fast and loose with the word “switcher” here since it’s just a few hyperlinks to the different versions of the website.

Still, a few things we paid attention to:

While the links say “EN”, “DE” and “NL”, it’s not fantastic from a verbal perspective. “EN” and “NL” are pronounced as you would expect, but “DE” is pronounced “duh”, which sucks. I assume most screen-reader users would be accustomed to this sort of pronunciation for language code, but we wanted to do better. ~~The 2-letter code is marked with `aria-hidden` so it’s not read out and~~ each link contains visually hidden text mentioning the full language name.

{% info %}[Aurélien Levy rightfully pointed out on Twitter](https://twitter.com/goetsu/status/1370730365418143745?s=20) that marking the 2-letter code as `aria-hidden` would fail [WCAG SC 2.5.3 Label in name](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html). As the visible label is, say, “EN”, voice navigation users can activate it using a command like “click EN”. It will not work anymore if the “EN” text is hidden with `aria-hidden`. [Sara Soueidan expands on the matter in her own blog](https://www.sarasoueidan.com/blog/accessible-text-labels/).{% endinfo %}

The language name is defined in the language itself, and _not_ in the current page language. Browsing the English navigation will read <span lang="de">“Deutsch”</span> for the German link, and not “German”. So it’s pronounced correctly, the language name is wrapped with a span with the `lang` attribute. This way, a screen-reader will switch to a German pronounciation to voice <span lang="de">“Deutsch”</span>.

Each link to an alternative version has the `hreflang` attribute to inform that the content of the page behind the link will be in a certain language. There is little information about the `hreflang` attribute on links out there, so it might do basically nothing. I’m not sure.

The separators between all 3 links are marked with `aria-hidden` since they are strictly decorative. They could have been made with CSS as well, but it was a little less convenient.

We did not fall into the trap of using flags to represent languages, since flags are ultimately for countries, and not languages. While we often associate a country and a language, this thinking line falls short for many countries and languages.

This is basically what it looks like in the end:

```html
<a href="/en" hreflang="en">
  EN<span class="sr-only" lang="en"> — English</span>
</a>
<span aria-hidden="true">/</span>
<a href="/de" hreflang="de">
  DE<span class="sr-only" lang="de"> — Deutsch</span>
</a>
<span aria-hidden="true">/</span>
<a href="/nl" hreflang="nl">
  NL<span class="sr-only" lang="nl"> — Nederlands</span>
</a>
```

That’s about it, folks! As I said, this is nothing too spectacular, but it’s still interesting how many little considerations can go into such a simple interface module. I hope this helps you. If you have any suggestion or comments, please [get in touch on Twitter](https://twitter.com/KittyGiraudel). :)
