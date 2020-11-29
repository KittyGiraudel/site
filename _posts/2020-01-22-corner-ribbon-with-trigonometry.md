---
title: Corner ribbon with trigonometry
keywords:
  - sass
  - design
  - ribbon
---

I was never the best at trigonometry, so I was very proud finally cracking how to perfectly position a corner ribbon within a box with CSS.

![Colorful corner ribbon saying “Express”](/assets/images/corner-ribbon-with-trigonometry/ribbon.png)

Unfortunately for us, CSS does not provide trigonometry functions yet (although there are plans to implement them), so we have to rely on another language for that. We have three options:

- We can use a preprocessor like Sass (although we might have to [implement our own math functions](https://www.unindented.org/blog/trigonometry-in-sass/)).
- We can use JavaScript, which is a compelling option when using CSS-in-JS.
- We can run the math on the side and hard-code the value. That’s what we’ll do here.

Let’s start with some simple markup:

```html
<div class="container">
  <div class="ribbon">Express</div>
</div>
```

And some basic styling (without all purely aestethic considerations):

```css
/**
 * 1. Positioning context for the ribbon.
 * 2. Prevent the edges of the ribbon from being visible outside the
 *    box.
 */
.container {
  position: relative; /* 1 */
  overflow: hidden; /* 2 */
}

/**
 * 1. Start absolutely positioned in the top right corner of the
 *    container.
 * 2. Horizontal padding is considered in the ribbon placement.
 *    The larger the ribbon (text + padding), the lower in the
 *    container it might have to be.
 * 3. Make sure the content is centered within the ribbon itself.
 * 4. Position the ribbon correctly based on its width, as per
 *    the following formula: `cos(45 * π / 180) * 100%`.
 */
.ribbon {
  position: absolute; /* 1 */
  top: 0; /* 1 */
  right: 0; /* 1 */
  padding: 0 2em; /* 2 */
  text-align: center; /* 3 */
  transform:
    translateY(-100%)
    rotate(90deg)
    translateX(70.71067811865476%)
    rotate(-45deg); /* 4 */
  transform-origin: bottom right; /* 4 */
}
```

## Trigonometry, just like in school

This `transform` declaration is quite a mouthful. Let’s apply it left to right and see the result at every step to try and make sense of it. We start with the ribbon absolutely positioned in the top right corner of the container.

![Ribbon positioned in the top right corner of its container](/assets/images/corner-ribbon-with-trigonometry/ribbon_1.png)

1. `translateY(-100%)` translates the ribbon on its Y axis by its height.

![Ribbon translated on its Y axis by its height](/assets/images/corner-ribbon-with-trigonometry/ribbon_2.png)

2. `rotate(90deg)` rotates the ribbon 90 degrees clockwise to inverse its axis.

![Ribbon rotated 90 degrees to inverse its axis](/assets/images/corner-ribbon-with-trigonometry/ribbon_3.png)

3. `translateX(70.71067811865476%)` translates the ribbon vertically (axes have been swapped) by `cos(45)` (while remembering that math functions expect radians, not degrees).

![Ribbon translated vertically by cos(45)](/assets/images/corner-ribbon-with-trigonometry/ribbon_4.png)

4. `rotate(-45deg)` rotates the ribbon 45 degrees counter-clockwise to orient it correctly. `overflow: hidden` on the container is enough to clip these corners.

![Ribbon rotated -45 degrees](/assets/images/corner-ribbon-with-trigonometry/ribbon_5.png)

That’s it! ✨ What is nice with this solution is that tweaking the horizontal padding or the text content will automatically preserve the ribbon in the corner as expected. No need to change anything!

Feel free to play with [the interactive demo on CodePen](https://codepen.io/HugoGiraudel/pen/ExaeLXW?editors=0100).
