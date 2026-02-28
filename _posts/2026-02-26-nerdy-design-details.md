---
title: Nerdy Design Details
description: A closer look at the recent design changes I’ve made to this website, and the code behind them.
tags:
  - _post
  - Design
  - UI
  - Accessibility
  - CSS
  - Liquid
---

I’m currently looking for a job, so I have some free time. I decided to use it to work on the look and feel of this website some more, adding small design touches for a nicer, more accessible reading experience. I’ll share the highlights in this article!

- [Working theme switcher](#working-theme-switcher)
- [Fluid typography](#fluid-typography)
- [Creative embeds](#creative-embeds)
- [Fleurons](#fleurons)
- [Squircle corners](#squircle-corners)
- [Clearer focus styles](#clearer-focus-styles)
- [Better ad placement](#better-ad-placement)
- [Wrapping up](#wrapping-up)

## Working theme switcher

There were a few minor issues with the theme switcher (in the corner of your screen).

- For starters, it didn’t work when the operating system was set to dark mode. The website would be correctly rendered in dark mode, but the theme switcher would simply not work.
- Also [Giscus](https://giscus.app/) (my comment system) wouldn’t adapt to the theme, so you’d have a bright section when using dark mode.

I’ve reworked theme-related code a lot. On the CSS side, I’ve leveraged the [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme) property, and started using the [`light-dark(..)`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark) function pretty much all over the place.

```css
:root {
  color-scheme: light dark;
}

body {
  color: light-dark(#444, #eee);
  background-color: light-dark(#fff, #222);
}
```

I’ve improved the control itself to be a tri-state button to support dark, light and automatic modes. I wasn’t super sure what would be the best markup for this, so I decided to leverage the `mixed` state from [`aria-pressed`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-pressed).

```html
<!-- Button currently in light mode -->
<button
  type="button"
  aria-pressed="false"
  class="ThemeButton no-print" 
  title="Theme: light"
>
  <span class="visually-hidden">Dark mode</span>
  <!-- Appropriate icon for current mode here -->
</button>
```

Semantically, this is a button to control the *dark mode* specifically (not exactly the theme per se). The `aria-pressed` attribute determines whether the dark mode is enabled: `true` for yes, `false` for no, `mixed` for automatic (according to the operating system preference).

The JavaScript code just rotates between the 3 states, and backs up the preference in the local storage of the browser. When you interact with the button, it computes the next state, updates the `aria-pressed` and `title` attributes, and stores the new value in local storage.

I’ve also added a playful little hover animation for that button, making it wiggle. Try it here:

<button class="ThemeButton ThemeButton--demo" type="button">
  <span class="visually-hidden">Dark mode</span>
  <svg class="ThemeButton__icon ThemeButton__icon--light" data-theme="light" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high" viewBox="0 0 16 16">
    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
  </svg>
</button>

<style>.ThemeButton--demo { position: static; }</style>

```css
.ThemeButton:hover {
  animation: wiggle 500ms ease-out;
}

@keyframes wiggle {
  from { transform: rotate(10deg) }
  25% { transform: rotate(-10deg) }
  50% { transform: rotate(20deg) }
  75% { transform: rotate(-5deg) }
  to { transform: rotate(0deg) }
}
```

## Fluid typography

Fluid typography is not new. Geoff Graham, among others, was already [writing about it in 2017](https://css-tricks.com/snippets/css/fluid-typography/). Somehow, I never really bothered to look into it. I always found it to be an unnecessary trick. But I decided to come back to it and actually try it out, since this seems like the right place for that.

I’m not smart enough to really make sense of the math behind it, but this declaration essentially allows for variable font size between 1.25rem and 1.4rem. CSS-Tricks has a [good article about fluid typography](https://css-tricks.com/simplified-fluid-typography/) to dive deep into the concept.

```css
body {
  font-size: min(max(1.25rem, 4vw), 1.4rem);
}
```

## Creative embeds

Historically, blockquotes and informative callouts were rendered exactly the same on this website. This came from a time where I used to write content in pure Markdown with no HTML access, and used the blockquote syntax (`>`) to create callouts. It’s of course not great for semantics, so I eventually had 2 different components, and it was time to style them differently.

Let’s see them in action:

> This is a blockquote. It is meant to represent a citation — from someone or somewhere, and renders a `<blockquote>` element.  
> — Kitty Giraudel

And:

{% info %}This is an informative callout. It is kind of an aside to the main content, not directly attached to it but also not irrelevant. It bears no particular semantics, although it could probably render an {% footnoteref "aside-element" "I have since decided to use the <code>&lt;aside&gt;</code> element for callouts. I think it is semantically appropriate, according to the <a href='https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/aside'>MDN page on this element</a>." %}`<aside>` element{% endfootnoteref %}.
{% endinfo %}

They still do look similar! They bear the same pale blue background color, and the blue to pink gradient border. Speaking of which, for some reason it does not seem to be possible to render a gradient border using `border-image` with rounded corners. I have resorted to using [this solution from StackOverflow](https://stackoverflow.com/a/53037637):

```css
blockquote {
  --background-color: light-dark(#f3f8fc, #303132);
  padding: 0.75em 1.5em;
  background-color: var(--background-color);
  border: 2px solid transparent;
  background-image:
    linear-gradient(var(--background-color), var(--background-color)),
    linear-gradient(to right, var(--blue), var(--pink));
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
```

It’s a very clever approach: it uses a flat gradient (with no color change) applied all the way through the padding box, and the actual gradient applied to the border box, created by a transparent border.

Now, for the floating typographic marks, I’ve used absolutely positioned pseudo-elements: a curious [interrobang](https://en.wikipedia.org/wiki/Interrobang) for callouts, and curly quotation marks for blockquotes. For instance, here is the code for the callout:

```css
.Info::before {
  content: '‽';

  opacity: 0.2;
  font: 1000% / 1 Baskerville, serif;
  color: var(--blue);

  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: 1;

  transform: translate(-10%, 69%) rotate(-30deg);
}
```

It’s worth pointing out that the `transform` value for the pseudo-element is totally arbitrary. I just played with the values until I reached something I was happy with. It would need different values for a different font family or size.

To ensure the content within the callout sits on top of the decorative character (even though the latter is semi-transparent), we bump its z-index:

```css
.Info > * { position: relative; z-index: 2; }
```

I have used the same design pattern for [footnotes](#footnotes-label), and the editorial changes (see [this article](https://kittygiraudel.com/2022/09/30/templating-in-html/) for an example). I really like the juxtaposition of a neatly bordered box, and a decorative element breaking out of it, bringing some dynamism!

{% info %}As you can see from the code blocks above, they use the inverted color scheme: they have a pink background, and their gradient border goes from pink to blue. I did consider putting some brackets on each side, but it felt too much, especially since they already stand out with their unique pink-ish theme.{% endinfo %}



## Fleurons

I am fascinated by obscure typographic features. One of my recent reads is [Shady Characters](https://shadycharacters.co.uk/) by Keith Houston {% footnoteref "emdash" "I understand the emdash has been co-opted by LLMs, and using it is discouraged to avoid looking like an AI, but the fact is I truly love the emdash — you will never take it away from me!" %}—{% endfootnoteref %} a fabulous walk through a dozen or so typographic characters, such as &, and #, and †. 

The other day, I stumbled upon [this delightful website by Henry Desroches](https://henry.codes/writing/the-first-thing-i-did-last-year-was-run/). Just before the footer stands this gorgeous little guy: ❦. Would you just look at it? It turns out that *it* has a name: the [fleuron](https://en.wikipedia.org/wiki/Fleuron_(typography)). Quoting Wikipedia:

> A fleuron (/ˈflʊərɒn, -ən, ˈflɜːrɒn, -ən/), also known as a printers’ flower, is a typographical symbol, or glyph, used either as a punctuation mark or as an ornament for typographic compositions. Fleurons are stylized forms of flowers or leaves; the term derives from the Old French: floron (“flower”). Robert Bringhurst in The Elements of Typographic Style calls the forms “horticultural dingbats”. A commonly encountered fleuron is the ❦, the floral heart or hedera (ivy leaf), also known as an aldus leaf after Italian Renaissance printer Aldus Manutius.

I couldn’t resist inserting this “horticultural dingbat” in a few places, least of all between the post date and the expected reading time in the header of the article layout. Another tiny flourish that makes the layout feel more considered.

<p class="PostDate">
  <span>{{ page.date | time }}</span>
  <span class="Fleuron">❦</span> <span title="Estimated read time">6–minute read</span>
</p>

## Squircle corners

I have recently (re)discovered [squircle corners](https://orgpad.info/blog/squircles), and the fact that they are getting native support in CSS via the [`corner-shape`](https://developer.mozilla.org/de/docs/Web/CSS/Reference/Properties/corner-shape) property.

```css
.box {
  border-radius: 1em;
  corner-shape: squircle;
}
```

I’ve switched most boxes to use squircle corners because I find them more aesthetically pleasing. So code blocks, blockquotes, callouts, outlines and more now use this new shape (provided your browser supports it).

## Clearer focus styles

I’ve had [these gradient links](/) for a long time now. And I still like them a lot, but the effect can be quite subtle, especially on low resolution screens. So I’ve decided to make the focus styles more obvious by adding a proper pink outline:

```css
a:focus-visible {
  outline: 2px solid var(--pink);
  outline-offset: 2px;
  border-radius: 0.25em;
  corner-shape: squircle;
}
```

Speaking of links, I’ve also added a little bit of spacing at the top of the page when linking to a heading so that it doesn’t lick the top of the window.

```css
h2 {
  scroll-margin-top: 0.5rem;
}
```

## Better ad placement

For some reason, I am still running ads on this website. It’s not like I make a lot of money from it though. I’ve been with CarbonAds for over 10 years, and probably haven’t made more than a few hundred bucks from them in all that time. But still, it pays for the occasional cup of coffee, so it’s kind of nice I guess.

Carbon requires the ad (which is ~330 &times; 114px) to be placed above the fold — for obvious reasons. I didn’t really know what to do with it, so I had placed it right below the title, centered. It didn’t look too great. Even worse, when running an ad-blocker (something I obviously also do), there would be this massive blank space under the page title for where the ad was supposed to show up. It would look awkward. 

I had limited that problem a little by placing the ad in the bottom right corner of the screen for large viewports. But that wouldn’t happen before 1556-pixel-wide viewports. 

So I’ve implemented a few changes. First, I’ve moved the ad a little lower in the page, while still living above the fold. When possible, I injected it *after* the first paragraph. This wasn’t too obvious in Liquid:

{% raw %}
```liquid
{% assign parts = content | split: "</p>" %}
{{ parts | first }}</p>

{% include "ad.html" %}

{% for part in parts offset: 1 %}
  {{ part }}{% unless forloop.last %}</p>{% endunless %}
{% endfor %}
```
{% endraw %}

And for it to fit better within the flow of the article, I’ve wrapped the ad in a visible container, with a dedicated slot and some text to explicitly mention that this callout is for an ad display. 

Finally, I’ve made it so that if the ad couldn’t be loaded (because of an ad-blocker or any other reason), the ad container would be hidden entirely:

```css
.Ad:not(:has(#carbonads)) { display: none }

@media screen and (min-width: 1556px) {
  .Ad          { display: contents }
  .Ad__text    { display: none }
  .Ad__carbon  { position: fixed; bottom: 0.5em; right: 1em }
}
```

## Wrapping up

I think I covered the most important things! I’ve also cleaned up a lot of the code, particularly on the CSS side, but it’s not particularly interesting. Overall, I’m very happy with the design, and it’s been very fulfilling getting to work on it calmly and peacefully. I hope you like it!