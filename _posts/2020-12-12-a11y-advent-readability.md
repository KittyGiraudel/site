---
title: 'A11yAdvent Day 12: Readability'
description: A11yAdvent entry on readability
---

For a medium as text-focused as the web, readability has to be something we have to talk about. Besides making it more comfortable for everyone, taking special care to make content readable helps people with a various range of disabilities, such as color-blindness or dyslexia.

{% info %} While doing research for this article, I learnt about the difference between legibility and readability. The former is the product of the design of a font, based on its characteristics such as height, width, and thickness. Readability on the other hand is related to how the font is used, such as font size, letter spacing, line height and color. {% endinfo %}

The first thing to remember when it comes to readability is that there is no one-size-fit-all solution. While there are commonly accepted suggestions such as avoiding small sizes and enabling decent color contrast, it is good to remember that everyone is different and what works for me might not work for you.

As an example, a couple years back a person came to me after my talk on accessibility and told me that my advice about having super sharp contrast for body text was not always working for them, a dyslexic person who prefers something a little more toned down. Along the same lines, some people might find serif fonts easier to read, and some not.

{% assign wcag_color = "It has been repeatedly shown that [the contrast model is flawed](https://mobile.twitter.com/adamwathan/status/1304490267769221121). It is [known and is being addressed](https://github.com/w3c/wcag/issues/695)." | markdown %}

Let’s walk through the things one can do to improve readability for most:

- Pick a decent font size. There is no real commonly agreed upon threshold, but whatever you think it is, it’s most likely higher. For body text, I would recommend 16px at the very minimum, ideally more like 20px up to 30px, depending on what kind of design you go with.
- Cap the line length. Paragraphs which are too long in width can be difficult to read. Lines should be between 70 and 90 characters long, which can easily be achieved with [the `ch` CSS unit](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/). Similarly, limit paragraphs length to 70 to 90 words to make them easier to read.
- Give some room between lines. Lines that are too close to each other can make it harder to read the content. The WCAG (1.4.12 Text spacing) require the line height to be at least 1.5 times the font size. Arguably, the minimum line height should depend on the font size as well because 1.5 is often a little awkward on large titles where ~1.1 look better.
- Do not justify content. It might look better and more polished, but the varying spacing between words can actually make the text harder to read. Similarly, do not center the text, as the eyes rely on the start alignment to quickly move between lines.
- Ensure decent contrast. Relying on the [WCAG contrast guidelines](https://css-tricks.com/understanding-web-accessibility-color-contrast-guidelines-and-ratios/) is a good place to start (even though the {% footnoteref "wcag_color" wcag_color %}WCAG contrast guidelines are not perfect{% endfootnoteref %}).

As an example, this blog on desktop uses a 22.4px font size and 33.6px line height (1.5 ratio). The content is left-aligned, and lines are about 85 characters long in paragraphs that are around 95 words on average. The text color is #444 on top of plain white, which has a contrast ratio of ~9.73 — enough for any size of text.

You might have noticed I do not give any recommendation as to which font to choose. Besides being a design choice in many aspects, the thing is most properly-designed professional fonts will do just fine provided they are not cursive and exotic. It’s also good to remember a lot of people override the fonts in their browser with one they can conveniently read (Comic Sans is found to be a great typeface by some dyslexic people for instance).
