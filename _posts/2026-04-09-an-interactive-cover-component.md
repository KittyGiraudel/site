---
title: An Interactive Cover Component
description: A technical walkthrough on how to build a small interactive cover component, with some nifty CSS tricks.
tags:
  - UI
  - UX
  - CSS
--- 

{% assign protectors_memories_ref = "If you’re into role-playing game, I definitely recommend the <em>Protector’s Memories</em>. It’s a wonderful solo game focusing on exploration and discovery in a unique fantasy setting, with very little combat or magic." %}
{% assign style_differences_ref = "It actually looks a bit different from this one, because this one inherits a bunch of styles from this website — starting with the font styles. But overall and for the purpose of this article, it looks more or less like that." %}
{% assign midjourney_ref = "Kind thanks to my dear sister who is patiently and creatively producing the images using Midjourney, following the original lore from the rulebook and my vision for the site." %}

I am currently building a companion ~~app~~ website for the solo <abbr title="Table-Top Role-Playing Game">TTRPG</abbr> {% footnoteref "protectors-memories" protectors_memories_ref %}“The Protector’s Memories” by Enzo Salviato{% endfootnoteref %}, which I hope to release and introduce soon.

I’ve built a pretty advanced hexagon map (which may be the subject of another blog post), and wanted some {% footnoteref "midjourney" midjourney_ref %}beautiful imagery{% endfootnoteref %} above it to make it more immersive.

I ended up putting a fair bit of work in that UI component, so I thought it deserved a walkthrough. {% footnoteref "style-difference" style_differences_ref %}Here it is{% endfootnoteref %} — try hovering or focusing it:

{% render "demos/cover-component/index.liquid" %}

{% callout "warning" %}Before we dive into the code, I think it’s worth pointing out that the goal is largely to be immersive and expose some lore. I think this design and effect fit *because* of the theme and *because* it’s not for critical content. My point is that it’s just an aesthetic component for a game that makes this acceptable — I don’t think this is necessarily a good user experience for your every day website where there are stakes.{% endcallout %}

## Terminology

I’ll be talking about “biomes” throughout this article. It’s a concept from the game, of which there are 6. Think of them as environments: desert, forest, fields… I’ve decided that each biome has its own color scheme and its own background image. 

In this article, we will deal with the “rural sea” biome, whose green-ish theme is:

```css
[data-biome="ruralSea"] {
  --biome-light: #7dc8a0;
  --biome-dark: #4a9f72;
  --biome-light-contrast: #ffffff;
  --biome-dark-contrast: #ffffff;
  --biome-banner: url('/assets/images/cover-component/banner-ruralSea.avif');
}
```

## The slide-in effect

The effect goes like this: only the “title” — anchored at the bottom of the card — is normally visible, and when interacting with the component (either by hovering or focusing it), the description gets revealed by sliding upward. 

The markup is quite straightforward: 

```html
<div class="Cover" tabindex="0">
  <div class="Cover__overlay"></div>
  <div class="Cover__content">
    <p class="Cover__title">You are currently in a <strong>sea of fields</strong>.</p>
    <p class="Cover__description">The wind picks up and begins to blow harder …</p>
  </div>
</div>
```

It’s important that this effect works for a variety of content lengths — for both the title *and* the description — without having to hard-code values anywhere. So from a CSS 
perspective, we’re going to:

- place the whole content off-screen (`top: 100%`), 
- slide the title back in (`translateY(-100%)`),
- slide the whole content back in on interaction (`translateY(-100%)`).

```css/4,8,12
.Cover__content {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
}

.Cover__title {
  transform: translateY(-100%);
}

.Cover:hover {
  & .Cover__content { transform: translateY(-100%) }
  & .Cover__title   { transform: translateY(0) }
  & .Cover__overlay { opacity: 1 }
}
```

A few things worth pointing out:
- We reset the title’s transform on interaction. This acts as a counter-transition: as the content goes up, the title goes down. Without this, the title ends up super high compared to the content.
- We fade-in the overlay on interaction to increase contrast behind the text (see [Styling the overlay](#styling-the-overlay)).

### Smoothing the effect

To avoid abruptly going from one state to another, we use CSS transitions to transition between the two phases. I don’t love having to synchronize transitions, so I’ve defined it once on the top element, and then every children inherit from it.

```css
.Cover { transition: 500ms ease-in-out } /* … */
.Cover__content { transition: inherit } /* … */
.Cover__overlay { transition: inherit } /* … */
.Cover__title { transition: inherit } /* … */
.Cover__description { transition: inherit }
```

### Keyboard navigation

So far, everything works only on hover, and I wanted to add support for keyboard navigation. I’ve decided to apply `tabindex="0"` to the cover, and adjust the CSS selectors to account for focus.

```css
.Cover:is(:hover, :focus-visible) {
  /* … */
}
```

Fair warning: I actually don’t know if using `tabindex="0"` is appropriate here. Perhaps it could be confusing for blind screen-reader users to be able to tab to a `div`. If someone has any experience with this, let me know. :)


### Static variant

In some instances, I have a variant of this component with just the title, no text. In that case, there is nothing to reveal, so we shouldn’t apply our interactive styles. This can be done by ensuring there is a non-empty description. 

```css
.Cover:has(.Cover__description:not(:empty)):is(:hover, :focus-visible) {
  /* … */
}
```

## Styling the overlay

Because we’re rendering text on top of an image, we need an overlay to improve contrast — even though we control the images. For good or for bad, I’ve gone with a two-layered approach: the cover has a built-in overlay using a CSS gradient to increase title contrast, and then there is an actual overlay element during interaction.

Let’s start with the first: it goes downwards, and uses a color-stop at 85%, which is more or less where the title position starts (not very scientific, I know). From there down, it applies a semi-transparent black to improve contrast.

```css
.Cover {
  background-image: linear-gradient(
    to bottom,
    transparent 0%,
    rgb(0 0 0 / 0.5) 85%
  ), var(--biome-banner);
}
```

Now, for the overlay element. I thought it could be cool to bake the biome color into the overlay instead of using a faded pure black. I didn’t really want to maintain yet another color for each biome though, so I went with the [`color-mix()` function](https://caniuse.com/wf-color-mix). This way, we can mix 25% of the biome color with 75% black to get a very dark shade of said color. We don’t really have to consider opacity here because we’ll fade in and out the whole overlay with `opacity`.

```css
.Cover__overlay {
  inset: 0;
  position: absolute;
  background-image: linear-gradient(
    to bottom,
    transparent 50%,
    color-mix(in srgb, var(--biome-dark) 25%, black) 100%
  );
  opacity: 0;
}
```

## Animating the background

I initially didn’t intend to animate the background. But when I started using actual images, I noticed they typically didn’t have the format I needed and were too tall. At the same time, I didn’t want to crop them because it’s nice to see them in all their glory. So I thought I could slowly animate the background position up and down to both show the whole image and give a little bit of dynamism.

At its core, it goes like this:

```css
@keyframes animate-background {
  from { background-position: center 0% }
  to { background-position: center 100% }
}

@media (prefers-reduced-motion: no-preference) {
  .Cover {
    animation-name: animate-background;
    animation-duration: 50s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
}
```

Now the thing is the game has 6 different “biomes” (environments if you will), each with their own image. And they don’t really all need to be animated the same way. For instance, one of the biome uses an image with a *low* landscape and a *lot* of sky. Animating it top to bottom means sometimes all you see is some sky, which kinda sucks. So I wanted to be able to adjust the animation boundaries on a per-biome basis (ideally without having to write a custom animation for each).

It turns out you can use CSS custom properties within keyframes, so let’s do that:

```css
@keyframes animate-background {
  from { background-position: center var(--from, 0%) }
  to { background-position: center var(--to, 100%) }
}
```

Now, we can define custom `--from` and `--to` properties for each biome, determining how far up and down the image it gets animated. We use `0%` and `100%` as fallback values in case a biome doesn’t specify its boundaries (which shouldn’t happen but you never know).

The problem with this approach is that a background that gets animated between 40% and 90% for instance takes the same amount of time as a background animated full height (between 0% and 100%). This is not great because it means some animations will look much faster than others, and that’s not what you want. Fortunately, we can dynamically compute our animation duration based on custom properties.

```css/1
.Cover {
  animation-duration: calc((abs(var(--to) - var(--from))) * 0.5s);
}
```

{% callout %}
When defining `--from` and `--to` as percentages, I couldn’t figure out how to convert them into durations in the `calc()` function. I tried to divide the result of `abs()` by `1%` to get a unitless number (which is how it’s done in Sass for instance), but it didn’t work. To work around the problem, I’ve defined these as unitless values, and multiply them by 1% in the keyframes to get percentages. If someone knows how to do better, let me know.
{% highlight css %}
.Cover[data-biome="ruralSea"] {
  --from: 10;
  --to: 95;
}
{% endhighlight %}
{% endcallout %}

Boom! Now an animation spanning twice as tall as another will take twice as long, which makes sure all images move at the same speed.

## Wrapping up

There is probably still room for improvement: for instance, overflow is not managed at all right now. That means if you have too much content, the whole thing will overflow the cover since it has a fixed height. This is not trivial to fix since our content is absolutely positioned. I’m sure there is a way, I just don’t know it, and also I don’t need it since I control the content in my case.

Still, I think it’s a pretty little component, and it looks gorgeous in the context of the site. I’m very pleased with the outcome.