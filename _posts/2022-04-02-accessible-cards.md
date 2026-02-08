---
title: Accessible cards
description: A guide to creating an accessible card component
keywords:
  - accessibility
  - a11y
  - card
  - html
  - css
---

I was recently helping my partner and their team with implementing an accessible card component. I’ve iterated a few times on the demo I created until I realized that it might be worth a blog post to walk through it since there are quite a few things going on.

From the discussion we had, here are the requirements I understood:

- A card is typically interactive. Which means interacting with it (regardless of the device input) either follows a link or performs an action.
- A card _can_ be sitting in a list with other cards, and therefore should be announced as such. This is important as screen-readers enumerate items in lists (e.g. “list, four items”).
- A card _can_ contain actions (links or buttons).

On to a table of contents:

- [Markup](#markup)
- [CSS](#css)
- [Nested actions](#nested-actions)
- [Heading or no heading?](#heading-or-no-heading)
- [Wrapping up](#wrapping-up)

{%info%} If you just want the code, you can play with my [original React implementation on CodeSandbox](https://codesandbox.io/s/accessible-cards-7vu5ny?file=/src/App.js), or the [plain HTML/CSS version on CodePen](https://codepen.io/KittyGiraudel/pen/bGaoXxR). The CSS code should be fully commented either way. {%endinfo%}

## Markup

Cats. Let’s imagine we want to display a list of cats. Every cat card can be interacted with to open a page dedicated to that cat. Let’s see what the markup looks like.

```html
<ul>
  <li class="Card">
    <img
      class="Card-Image"
      src="https://placekitten.com/200/200"
      alt="Picture of Lilith"
    />
    <div class="Card-Content">
      <p class="Card-Title">
        <a class="Card-Primary-Action" href="/cat/lilith">Lilith</a>
      </p>
      <p class="Card-Meta">10 year old British Shorthair</p>
    </div>
  </li>
  <!-- More cards -->
</ul>
```

Allow me to point out that the link (it could also be a button if it performed an action instead of going somewhere) is placed on the primary piece of information only. It does _not_ wrap the whole card.

The reason for it is that links can be listed by assistive technologies (such as VoiceOver’s rotor or [a11y-outline](https://github.com/xi/a11y-outline)), so we want to provide just enough information so that they’re understandable and identifiable on their own. We don’t want the entire card’s content to be read out when listing the links — it’s too much.

In that case, we want the link to be listed as “Lilith, link” not “Lilith, 10 year old British Shorthair, link”. And while the latter would still be acceptable, it quickly becomes problematic when cards hold more and more content (think product cards with a lot of meta data for instance).

## CSS

Now, we want the whole card to be interactive, not just the main content. So we need to expand the hitbox with CSS. We can do that by using a pseudo-element which sits on top of the whole card. Skipping unrelated properties, it might look like this:

```css
/**
 * 1. Position context for the link’s pseudo-element.
 */
.Card {
  position: relative; /* 1 */
}

/**
 * 1. Use a pseudo-element to expand the hitbox of the link over
 *    the whole card.
 * 2. Expand the hitbox over the whole card.
 * 3. Place the pseudo-element on top of the whole card.
 */
.Card-Primary-Action::before {
  content: ''; /* 1 */
  position: absolute; /* 2 */
  inset: 0; /* 2 */
  z-index: 1; /* 3 */
}
```

This does the job. Now the whole card is clickable. To make it look as such though, we need to adjust the focus styles:

```css
/**
 * 1. Show that the card is interactive.
 */
.Card-Primary-Action::before {
  cursor: pointer; /* 1 */
  border: 2px solid transparent; /* 1 */
  transition: border-color 200ms;
}

/**
 * 1. Display interactivity on hover/focus by highlighting the border.
 */
.Card-Primary-Action:hover::before,
.Card-Primary-Action:focus::before {
  border-color: hotpink; /* 1 */
}

/**
 * 1. Hide the default focus outline as it’s recreated with a border.
 */
.Card-Primary-Action:focus {
  outline: none; /* 1 */
}
```

## Nested actions

Now what if the card contains links or buttons? This is where we’re happy not to have wrapped it all with an anchor or a button, since that would prevent us from adding interactive elements within it.

Ultimately, we can add other links and buttons at will. For instance, let’s say we want a button on the right side of the card to get some more details about the cat.

```html
<li class="Card">
  <img class="Card-Image" />
  <div class="Card-Content">…</div>
  <button class="Card-Secondary-Action">Details</button>
</li>
```

The only thing we need to do is bump its `z-index` so it sits _above_ the pseudo-element that covers the card.

```css
/**
 * 1. Place the secondary action on top of the card.
 */
.Card-Secondary-Action {
  position: relative; /* 1 */
  z-index: 2; /* 1 */
}
```

{% info %}[Adrian Roselli reached out](https://twitter.com/aardrian/status/1511302503324868612?s=20&t=ZhCo8_uclewkYiTpp0I5WA) to share his experience having tested this pattern with users. He found that having dead space around the button is important to avoid mis-taps. If possible, consider carving out some space for the additional control instead of placing on top of the card link. Read more information in his [article about interactive cards](https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html#Additional).{% endinfo %}

## Heading or no heading?

Let me take this post as an opportunity to discuss whether a card should contain a heading.

I don’t think there is a right or a wrong answer per se. There might be cases where making the primary content of a card a link is worth it, and cases where it’s not. I guess it depends whether the heading a) introduces a significant amount of content, and b) benefits from being listed among all the headings of the page.

For what it’s worth, Heydon Pickering does use links in his [article about cards](https://inclusive-components.design/cards/). Looking back at the list of transactions we built for N26 back in the days, we certainly wouldn’t want dozens or hundreds of transactions to have their own heading — that would make the headings listing unusable.

## Wrapping up

Long story short: don’t wrap the whole card with a link, and instead link your main distinctive piece of information and expand its hitbox with CSS. This offers a better experience when listing links, and enable cards to contain other interactive elements.

I would also recommend reading [Heydon’s piece on an inclusive card component](https://inclusive-components.design/cards/) as he covers all of this and more. I only remembered about his outstanding work when I was done with this post. Oh well. 😅

Hope this helps! ✨

<p class="codepen" data-height="500" data-default-tab="result" data-slug-hash="bGaoXxR" data-user="KittyGiraudel" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/KittyGiraudel/pen/bGaoXxR">
  Accessible Cards</a> by Kitty Giraudel (<a href="https://codepen.io/KittyGiraudel">@KittyGiraudel</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
