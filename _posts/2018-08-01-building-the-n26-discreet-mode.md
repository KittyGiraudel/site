---
title: "Building the N26 discreet mode"
tags:
  - accessibility
  - discreet
  - a11y
  - css
---

When we launched “[N26 for web](https://n26.com/en-de/webapp)” a couple of weeks back, we introduced a sweet feature called the “discreet mode”. To put it simply, this switch masks all sensitive information from the user interface such as amounts and private tokens.

In this article, we’ll see how we built that discreet mode and why it is worth considering adding one to your application as well.

## What is it

Our goal at N26 is to make users comfortable dealing with their money. We go to great lengths to enable people to perform boring banking actions in a simple and efficient way, be it on mobile or desktop.

This certainly comes with its own challenges. Money being the sensitive topic it is, many people feel uncomfortable talking about it, especially their own. This is how the idea of having a discreet mode came up.

![Discreet mode within the N26 webapp](https://user-images.githubusercontent.com/1889710/43515691-77428d7e-9583-11e8-8f5d-475d0bd7b5ba.png)

A simple toggle to mask all sensitive user information, mainly amounts and account balance. Checking your account in the public transports or in a shared open space? We got you covered.

![Ways to toggle the discreet mode in the N26 webapp](https://user-images.githubusercontent.com/1889710/43516741-c5b90048-9586-11e8-8506-08684216cfed.png)

An interesting side effect we didn’t anticipate from this feature is that some people use this mode not to make sure that no one sees it but rather to avoid being confronted to their own account balance every time they use the app.

## How it works

Under the hood, this is not dramatically complex: there is a control which dispatches a Redux action to define whether the discreet mode is enabled or not. This setting is saved in a cookie, but eventually will make its way to our database once/if the native N26 apps get to implement the discreet mode.

Between the account balance, and each transaction total, we display a lot of amounts. This means we need a centralised way to display or mask an amount based on the state of that preference. Our `Amount` React component connects to the Redux store and applies different styles based on the preference status.

We want to mask the amount on the screen while making it obvious that some content is being masked. We don’t want to remove the content from the document entirely. To do so, we decided to use the `blur` CSS filter.

```css
.amount {
  filter: blur(10px);
}
```

We have to consider the case where CSS filters are not supported (such as on Internet Explorer). There are a few ways to work around this:

- We could use a custom blur SVG filter, but it seemed a little overkill.
- We could apply a similar background color as the text color, but it could get odd on some elements.
- We decided to fall back on using `opacity`, while not ideal because it becomes unclear some content has been masked.

```css
.amount {
  opacity: 0;
}

@supports (filter: blur(10px)) {
  .amount {
    opacity: 1;
    filter: blur(10px);
  }
}
```

On top of that, we add some CSS transitions so the switch between the two modes is smooth.

## Wrapping up

For now, we only use the discreet mode to hide amounts. That being said, we are considering further applications of this settings, such as hiding identifying information, displayed digits of credit card numbers, card tokens and more.

We are also investigating faster ways to toggle this mode: either by long-tapping/double-clicking a discreet piece of information, or with a custom keyboard shortcut.

If you have ideas on how to improve this feature, be sure to [get in touch with me on Twitter](https://twitter.com/HugoGiraudel)!
