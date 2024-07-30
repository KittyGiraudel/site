---
title: A content warning component
---

I have already written about [content warnings on this blog](https://kittygiraudel.com/2020/12/15/a11y-advent-content-warnings/). To quote that article:

> Content warnings are notices preceding potentially sensitive content. This is so users can prepare themselves to engage or, if necessary, disengage for their own wellbeing. Trigger warnings are specific content warnings that attempt to warn users of content that may cause intense physiological and psychological symptoms for people with post-traumatic stress or anxiety disorder (PTSD).

In this blog post, we’ll see how to author a component for hiding content behind a warning. I’m using the word “component” broadly here, because it’s really just HTML and CSS. Feel free to wrap it in a React, Vue, [Web Component](https://codesandbox.io/s/content-warning-web-component-gicmkj) (done that last one for you) or whatever floats your boat.

## The HTML structure

Functionally speaking, it’s pretty easy: we want to show there is hidden content, and we want to disclose why it’s hidden. From there, the reader can decide whether they want to expand the content or no.

This is the perfect use case for a good ol’ `<details>` / `<summary>` combo. Here is how it looks:

```html
<details class="ContentWarning">
  <summary><strong>⚠️ Content warning:</strong> Food</summary>
  <img
    src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGJ1cmdlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60"
    alt="Juicy burger and fries on a wooden board"
  />
</details>
```

At that stage, I’d argue it’s basically good enough as it checks all the boxes. It hides the content, warns about the risks, and provides a way to access said content. It also works without JavaScript which is fantastic. What more to ask?

## Sprinkle some styles

Because we rely on `<details>` and `<summary>`, styles are are purely cosmetic and do not really serve much functionality. Therefore, feel free to customize them the way you see fit.

```css
.ContentWarning {
  border: 1px solid rgb(0 0 0 / 0.3);
  border-radius: 0.2em;
}

/**
 * 1. Remove the default arrow that comes with the `<summary>` element
 * 2. Make the toggle feel clickable with a hand cursor
 * 3. Increase the hitbox of the toggle for ease of action
 * 4. Give the toggle a striped background to make it stand out
 */
.ContentWarning > summary {
  list-style: none; /* 1 */
  cursor: pointer; /* 2 */
  padding: 1em; /* 3 */
  --stripe-color: rgb(0 0 0 / 0.1); /* 4 */
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 0.5em,
    var(--stripe-color) 0.5em,
    var(--stripe-color) 1em
  ); /* 4 */
}

/**
 * 1. Tweak the stripes color on hover/focus to indicate that interacting with
 *    the toggle will disclose the sensitive content
 */
.ContentWarning > summary:hover,
.ContentWarning > summary:focus {
  --stripe-color: rgb(150 0 0 / 0.1); /* 1 */
}
```

I voluntarily omitted some styles for sake of simplicity, so you can see the result in the following CodePen:

<p class="codepen" data-height="500" data-default-tab="result" data-slug-hash="poVvyXV" data-user="KittyGiraudel" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/KittyGiraudel/pen/poVvyXV">
  Untitled</a> by Kitty Giraudel (<a href="https://codepen.io/KittyGiraudel">@KittyGiraudel</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## Going further

As you might have noticed, this is a very under-engineering solution — which I personally like. We could go further though. Here are a few options:

- We could provide a bit more context about why the content is not displayed by default. For instance, Twitter states “The Tweet author flagged this Tweet as showing sensitive content.”

- Instead of using the disclosure pattern, we could blur the content. I am a little on the fence with this approach because a) it would require JavaScript and b) I feel like blur is either cosmetic or needs to be subtle enough that you can sort of guess the content behind; which would defeat the purpose of a content warning. On the flip side, it would avoid the content moving up and down due to the change of height.

- We could provide an option to no longer mark content from this category as sensitive. Once stored in local storage or something, this would skip the whole widget if the theme is not deemed sensitive by the reader.
