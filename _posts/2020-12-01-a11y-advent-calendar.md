---
title: A11y Advent Calendar
keywords:
  - accessibility
  - a11y
  - tips
---

I am between jobs with a bit of free time, so I thought I would try something new this year and publish **an accessibility tip a day** in that article. Nothing too ground-breaking, and I expect a lot of these tips to be common knowledge for many of you, yet we’ll end the month with a nice list of do’s & don’ts. ✨

I will also announce the daily tip on Twitter with the #A11yAdvent hashtag. Feel free to share your opinion and tips under that hashtag as well!

- [Day 1: What is Accessibility?](#day-1-what-is-accessibility)
- [Day 2: Evaluating Accessibility](#day-2-evaluating-accessibility)
- [Day 3: Hiding Content](#day-3-hiding-content)
- [Day 4: Self-Explanatory Links](#day-4-self-explanatory-links)
- [Day 5: Document Outline](#day-5-document-outline)
- [Day 6: Skip to Content](#day-6-skip-to-content)
- [Day 7: Page Title in SPA](#day-7-page-title-in-spa)
- [Day 8: Alternative Text to Images](#day-8-alternative-text-to-images)
- [Day 9: Forms](#day-9-forms)
- [Day 10: ARIA](#day-10-aria)
- [Day 11: Emojis](#day-11-emojis)
- [Day 12: Readability](#day-12-readability)
- [Day 13: Zooming](#day-13-zooming)
- [Day 14: Captions](#day-14-captions)
- [Day 15: Content Warnings](#day-15-content-warnings)
- [Day 16: Animations](#day-16-animations)
- [Day 17: Anxiety](#day-17-anxiety)
- [Day 18: Internationalisation](#day-18-internationalisation)

## Day 1: What is Accessibility?

I thought we would start this calendar by talking about what is accessibility. There is a common belief in the web industry that accessibility is only about blind users. While it certainly involves blind people, it also encompasses way more than that.

The idea behind accessibility is to provide equal access to content to everyone, regardless of who they are or how they browse the web. Indeed, universal access to information and communication technologies is considered a basic human right by the United Nations.

In other words, providing accessible interfaces and content is about considering everyone, regardless of their abilities or disabilities, or the context in which they access content. Practically speaking, we can draw 5 large categories of impairments:

- **Visual:** this ranges from poor eyesight, to colour-blindness, from cloudiness to complete blindness, from fatigue to cataract. The web being a platform primarily consumed with the eyes, a lot of technology improvements have been made in that regard, and that is why accessibility is sometimes thought to be solely about accommodating towards blind users.

- **Motor:** motor impairments, when it comes to the web, are usually considering solely upper-limbs disabilities, so nothing below the belt. There are a wide range of reasons for someone to have limited mobility, such as tendonitis, carpal tunnel syndrom, arthritis broken hand or arm, skin condition, hand tremor, Parkinson disease or more commonly, having only one hand free.

- **Cognitive:** cognitive impairments is a broad and practically endless category because brains are complicated pieces of machinery and everyone is different. Some example could include dyslexia, post-traumatic stress disorder (PTSD), attention deficit and hyperactivity disorder (ADHA), amnesia, insomnia, vestibular disorder (motion sickness), anxiety, dementia…

- **Auditive:** while not originally too considered when the web was designed as an essentially all-text media, auditive impairments are more relevant than ever in this day and age where a lot of content is provided through videos and podcasts. They include but are not limited to being hard-of-hearing (HoH), in a loud environment or completely deaf.

- **Vocal:** vocal impediments range from benign (and sometimes temporary) situations such as having soar throat or a foreign accent, to more serious conditions like stutter or mutism. Because the web is seldom interacted with solely through oral interfaces, this category tends to be left out.

As you can see, there are so many things to consider. It may be daunting, but it’s also the beauty of our job as designers and frontend developers. We get to work _for_ everyone. I don’t know about you, but I find it inspiring. ✨

## Day 2: Evaluating Accessibility

Now that we have broadly defined what accessibility is, we need to discuss how to measure it. Accessibility is audited through the [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG21/) (WCAG for short), a technical standard currently in version 2.1, planned to reach 2.2 in 2021.

The WCAG offer a dozen guidelines organised under the [POUR principles](https://www.w3.org/WAI/WCAG21/Understanding/intro#understanding-the-four-principles-of-accessibility), which stands for Perceivable, Operable, Understandable and Robust. Each guideline is testable through _success criteria_ (a total of over 80 of these), each of them with [3 level of conformance: A, AA and AAA](https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels).

For instance, the [success criterion related to sufficient color contrast](https://www.w3.org/TR/WCAG21/#contrast-minimum) looks like this:

> **Success Criterion 1.4.3 Contrast (Minimum)**  
> (Level AA)  
> The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following:
>
> - **Large Text:** Large-scale text and images of large-scale text have a contrast ratio of at least 3:1.
> - **Incidental:** Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.
> - **Logotypes:** Text that is part of a logo or brand name has no contrast requirement.

Generally speaking, reaching a conformance level of A is the strict minimum and required by law, and it is usually encouraged to go for AA. Now, it is not always possible to reach AAA on all success criteria depending on the site, so it’s a nice objective to aim for but shouldn’t be the end goal.

What is important to remember is that even beyond strict specification conformance, there are still a lot of things that can be done to improve accessibility. As we’ve seen yesterday, this is a broad—almost endless topic—so it should never considered _done_ per se and can be actively worked on at all time.

<p class="Info">Interestingly enough, <a href="https://www.w3.org/TR/mobile-accessibility-mapping/">the WCAG also apply to mobile interfaces</a>. There is no other significant body of work covering mobile accessibility, so the WCAG can and should be followed (when applicable) for mobile applications, even though they are not written for web technologies.</p>

## Day 3: Hiding Content

Today, let’s dive in a bit more technical topic and discuss how to hide content while keeping it accessible to assistive technologies.

As you might guess, most people browse the web by looking at it, and then tapping or clicking links and buttons to interact with it. This mode of consumption works because most people have a decent eyesight and can look at the page. That being said, some people (including but not limited to blind persons) rely on screen-readers to browse the web. These are softwares reading out loud the content of a page, and provided navigation mechanisms to browse web content without necessarily relying on visual input.

When using a screen-reader, one does not always benefit from the surrounding visual context. For instance, an icon might make sense on its own, but if someone cannot perceive the icon, then they might not understand the role of a button. This is why it is important to provide assistive text, even though it might be visually hidden.

One might think using `display: none` or the `hidden` attribute should be enough, but these techniques also remove the content from the accessibility tree and therefore make it inaccessible.

The quest for a combination of CSS declarations to visually hide an element while keeping it accessible to screen-readers is almost as old as the web, and gets refined every couple of years. The latest research to date on the matter has been conducted by Gaël Poupard in his [CSS hide-and-seek article translated here](https://hugogiraudel.com/2016/10/13/css-hide-and-seek/). The consensus is that the following code snippet is enough to hide an element while making its content still available to assistive technologies:

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

What is important to think through is when to hide content entirely (with `display: none` for instance), and when to hide it visually only. For instance, when providing additional information to an icon, it should be visually hidden since the point is to have it read by screen-readers. But when building tabs, or a content toggle, it should be hidden entirely, because there is an interaction required to access it.

## Day 4: Self-Explanatory Links

Let’s stay in the topic of screen-readers and talk about links. I believe a relatively little known feature of many screen-readers is the ability to list all links in a page in order to navigate more rapidly. Besides that feature, tabbing through page means jumping from link to link, skipping the text between them. Either way, links end up being announced devoid of their surrounding content and grammatical context.

That means it is important for links to be self-explanatory. In other words, a link should make sense on its own without the rest of the sentence it lives in or its visual surroundings. The content of the link should describe what the link does.

To have a look at what links look like in a given page, I would highly commend this [accessibility bookmarklet](https://xi.github.io/a11y-outline/) by Tobias Bengfort. Drag it onto your bookmark bar, then activate it on any page to be prompted with a little dialog which contains a dropdown menu offering 3 options: landmarks, headings and links. The last one is the relevant one in this case.

If you spot a link that does not make much sense on its own, revise its content until it does. No more “click here”, “learn more” or other non-sensical links! Similarly, avoid mentioning “link” in the text since most screen-readers already do that.

As an example, consider a link visually stating “Edit” in a list of items. It makes sense, because the link belongs to a list item, therefore it is implied that it is for that specific item. But when listing links or just tabbing through, all links end up saying “Edit”, which is not good at all. To fix that problem, we can apply what we learnt yesterday and add some visually hidden content to the link.

```html
<a href="/edit/1234567890">
  Edit <span class="sr-only">item [distinguishable item name]</span>
</a>
```

## Day 5: Document Outline

{% assign web_aim_survey = "According to [a WebAim survey from 2014](https://webaim.org/projects/screenreadersurvey5/#finding), two-thirds of screen-reader users scan headings as the first step of trying to find information on a long web page." | markdown %}

Ah, the mythical document outline! If you’re at least a little bit into HTML semantics, you might have heard of the phrase once or twice. Broadly speaking, the document outline is the content structure defined by the headings in a page. This structure is important as {% footnoteref "web_aim_survey" web_aim_survey %}heading navigation is one of the main ways for screen-reader users to browse a website{% endfootnoteref %}.

In this article for instance, the post title is a `<h1>` and then we have a bunch of `<h2>`. If any of these end up needing sub-sectioning, there would be `<h3>` and so on and so forth. The outline looks like this (as of writing):

```
1. A11y Advent Calendar
   1.1. Day 1: What is Accessibility?
   1.2. Day 2: Evaluating Accessibility
   1.3. Day 3: Hiding Content
   1.4. Day 4: Self-Explanatory Links
   1.5. Day 5. Document Outline
```

To check the structure of a document, we can use the same [accessibility bookmarklet](https://xi.github.io/a11y-outline/) we’ve mentioned yesterday. When activating it, one of the options is “Headings”, which lists all headings in order and level. From there, we can make sure the structure makes sense, headings are in the right order, and no level is skipped.

{% info %} For years now, there have been discussions (and even proposals) about taking into consideration sectioning elements like `section` into the document outline to create sort of sub-structures where every root would go back to `h1`. This has never been implemented by any browser or supported by any assistive technology so this is basically moot at this point. Stick to appropriate heading levels.

For more information about the history behind the document outline and the proposed resolution algorithm, I encourage you to read [the Document Outline Dilemna](https://css-tricks.com/document-outline-dilemma/) by Amelia Bellamy-Royds which is a fantastic overview of the topic. {% endinfo %}

## Day 6: Skip to Content

Let’s stay in the topic of navigation and talk about a feature that is too often forgotten: a link to go straight to the main content area of the site—often called “skip-to-content” or “skip-navigation” link.

In traditional websites using hyperlinks the right way, the page is fully reloaded when following a link and the focus is restored to the top of the page. When navigating with the keyboard, that means having to tab through the entire header, navigation, sometimes even sidebar before getting to accesss the main content. This is bad.

Single-page applications are not free from this consideration either. Following a link tends to reload the content area and therefore loses the current focus, which sends it to the top of the document, causing the same issue. So either way, there is work to do.

{% assign skip_link = "As [Hidde rightfully pointed out on Twitter](https://twitter.com/hdv/status/1334435081952309253?s=20), this is a good candidate for the WebWeWant.fyi project. I submitted a [suggestion to have skip links natively implemented](https://webwewant.fyi/wants/5fc8bb41d84cfbab3fb47320/) by browsers instead of relying on developers’ implementation." | markdown %}

To work around the problem, a common design pattern is to {% footnoteref "skip_link" skip_link %}implement a skip link{% endfootnoteref %}, which is an anchor link sending to the main content area. So how shall our skip link work?

- It should be at the top of the page, ideally as the first focusable element. It doesn’t have to be absolute first, but the more focusable elements there are before it, the less discoverable and thus less useful the skip link becomes.
- Ideally it’s always visible, but it’s pretty uncommon that it fits nicely into design so it can be visually hidden and revealed on focus—more on that below.
- It should lead to the main content area of the page.
- It should ideally start with the word “Skip” so it’s easily recognisable (visually and aurally). It can say “Skip navigation”, “Skip to content”, or some similar flavours.

Here is our HTML:

```html
<body>
  <a href="#main" class="sr-only sr-only--focusable">Skip to content</a>
</body>
```

For the styling we can use what we learnt in [day 3 of this calendar](#day-3-hiding-content), applying a small twist to undo the hiding styles when the element is focused.

```css
.sr-only.sr-only--focusable:focus,
.sr-only.sr-only--focusable:active {
  clip: auto !important;
  -webkit-clip-path: auto !important;
  clip-path: auto !important;
  height: auto !important;
  overflow: visible !important;
  width: auto !important;
  white-space: normal !important;
}
```

You can play with a [live demo for skip links on CodePen](https://codepen.io/HugoGiraudel/pen/eYdpqoK).

## Day 7: Page Title in SPA

Single-page applications (SPA for short) have been all the hype for the last decade or so. The idea is that we can avoid reloading the entire page when navigating within a site and instead update only the moving parts (usually the content area). This comes from a great premise: faster interactions, no unnecessary HTTP roundtrips, less used bandwidth.

The thing we usually don’t think about is that many assistive technologies such as screen-readers have been initially authored with the “original web” in mind and rely on page (re)loads to announce the page context, namely the page title (hold by the `<title>` element).

When building a SPA—no matter the framework—it is important to do some work to announce the title when following router links. Two things need to happen:

1. The title of the new view/page needs to be announced.
2. The focus needs to be preserved or moved to a proper place.

A nice solution is to have a [visually hidden](#day-3-hiding-content) element at the top of the page which receives the new title when navigating, and move the focus on that element so the content is read. Ideally, the [skip link](#day-6-skip-to-content) lives right after that node so the flow goes like this:

1. Press a link in the content area that causes a router change.
2. The view gets loaded.
3. The title for that view gets rendered in the invisible node.
4. The focus gets move to that node so its content is announced.
5. Tabbing once gets to the skip link, so getting back to the content area is fast and convenient.

Here is how our HTML should look like:

```html
<body>
  <p tabindex="-1" class="sr-only">…</p>
  <a href="#main" class="sr-only sr-only--focusable">Skip to content</a>
  <!-- Rest of the page -->
</body>
```

And our unflavoured JavaScript. Note that this is no specific framework—it’s just a made-up API to illustrate the concept.

```js
const titleHandler = document.querySelector('body > p')

router.on('page:change', ({ title }) => {
  // Render the title of the new page in the <p>
  titleHandler.innerText = title
  // Focus it—note that it *needs*  `tabindex="-1"` to be focusable!
  titleHandler.focus()
})
```

You can find a more in-depth [tutorial for React with `react-router` and `react-helmet`](https://hugogiraudel.com/2020/01/15/accessible-title-in-a-single-page-react-application/) on this blog. The core concept should be the same no matter the framework.

{% info %} Note that if you have can guarantee there is **always** a relevant `<h1>` element (independently of loading states, query errors and such), another possibly simpler solution would be to skip that hidden element altogether, and focus the `<h1>` element instead (still with `tabindex="-1"`). {% endinfo %}

## Day 8: Alternative Text to Images

Ah, alt text! Alternative text to images has been an age old topic on the web. The goal is to provide a description of the image in case it fails to load or for people who are not able to perceive images and rely on textual content to get their meaning. It is very important for people using screen-readers, as well as search engines.

There are countless resources on the web about authoring good alternative texts to images, my favourite of all is [this ultimate guide by Daniel Göransson](https://axesslab.com/alt-texts/), so I will just give a bit of a recap.

- The alternative text is supposed to describe the image. This is not the appropriate place for credits or attributions. This is not the appropriate place for keywords stuffing (no place is).
- Focus on the main content and don’t go overboard with the details. Make it as concise and to the point as possible.
- Do not mention that it is a photo, a picture or an image. This is already implied by the fact that this is in the `alt` attribute of an image.
- If you can, end with a period so there is a pause after announcing it.

Finally, there are some cases where you can leave out the alternative text entirely, and leave the attribute empty (`alt=""`):

- If the image is decorative or does not help comprehension of the document. For instance, the image used as a masthead.
- When the text would just repeat surrounding text, such as the image of an article tile or an icon within a link containing text.
- When the image is part of a repeated list, such as users’ profile picture in a feed or a chat conversation.

That’s the main gist. Images are a critical part of the web—we have to appreciate that not everyone can perceive them the same way, and that’s why it’s critical to describe them properly.

## Day 9: Forms

The web is essentially forms. Any time we, as users, want to interact with a page in a way that goes beyond following links, it is done through forms. Search bar? A form. Chat window? A form. Questionaire? A form. Forms are an essential part of the web, yet they are too often hacked around.

Forms need to be built in a particular way so that everyone can use them efficiently. Whether you are a power-user navigating with the keyboard for speed, or a blind or short-sighted person using a screen-reader, forms can be tedious to fill and that’s why we need to pay a particular attention to them.

Let’s go through a little recap of what is important when building accessible forms.

### Labels

All fields should be labeled, regardless of design considerations. Labels can always be [visually hidden](#day-3-hiding-content), but they have to be present in the DOM, and be correctly linked to their field through the `for`/`id` pair. Placeholders are not labels.

Additionally, labels should indicate the expected format if any, and whether the field is required or not. If all fields are required, an informative message can be issued at the top of the form to state so.

```html
<label for="ssn">Social Security Number (xxx-xxx-xxx) (required)</label>
<input type="text" name="ssn" id="ssn" required />
```

### Errors

Poor error reporting has to be one of the main issues regarding forms on the web. And to some extent, I can understand why as it’s not very intuitive.

First of all, errors should be reported per field instead of as a whole. Depending on the API in place, it’s not always possible unfortunately, and that’s why it’s important as frontend developers to be involved in API design as well.

A field should be mapped to its error container through an `aria-describedby`/`id` attribute pair. It is very important that the error container is always present in the DOM regardless of whether there are errors (and not dynamically inserted with JS), so the mapping can be done on the accessibility tree.

```html
<label for="age">Age</label>
<input type="number" name="age" id="age" aria-describedby="age-errors" />
<div id="age-errors"></div>
```

After displaying an error, the focus should be moved to the relevant field. In case multiple errors were displayed, the focus should be moved to the first invalid field. This is why it is interesting to use HTML validation when possible, as this is all done out of the box.

### Disabled Buttons

Disabled buttons cannot be discovered by screen-readers as they are, so-to-say, removed from the accessibility tree. Therefore, the usage of disabled buttons can cause an issue when the sole button of a form is undiscoverable by assistive technologies.

To work around this problem, the submit button of a form should effectively never be `disabled` and should trigger form validation when pressed.

The button can have `aria-disabled="true"` to still be discoverable and indicate that it is technically not active (due to missing or invalid information for instance). CSS can be used to make a button with that ARIA attribute look like a disabled button to make it visually understandable as well.

There are some rare cases where having a fully `disabled` button is acceptable:

- A previous/next button when reaching the first/last item in a set. For instance, the navigation buttons of a slider.
- Off-screen controls that should not be focusable at a given time. For instance, buttons within inactive slides in a slider.

### Miscellaneous

Radio inputs with the same name should be grouped within a `<fieldset>` element which has its own `<legend>`. This is important so they can be cycled through with the arrow keys.

```html
<fieldset>
  <legend>How comfortable are you with #a11y?</legend>
  <label for="very"> <input type="radio" name="a11y" id="very" /> Very </label>
  <label for="so-so">
    <input type="radio" name="a11y" id="so-so" /> So-so
  </label>
  <label for="not-at-all">
    <input type="radio" name="a11y" id="not-at-all" /> Not at all
  </label>
</fieldset>
```

## Day 10: ARIA

{% assign aria = "“Don’t use ARIA, use native HTML instead” is the first rule of ARIA as described in the [top 5 rules of ARIA](https://www.deque.com/blog/top-5-rules-of-aria/) by Deque." | markdown %}

Yesterday we discussed the usage of the `aria-disabled` and `aria-describedby` attributes so it’s a good time to talk more about ARIA as a whole. It stands for Accessible Rich Internet Applications. It’s a specification aiming at enhancing HTML in order to convey more meaning and semantics to assistive technologies, such as screen-readers.

The {% footnoteref "aria" aria %}first advice when it comes to ARIA{% endfootnoteref %} is to avoid using it when possible. It is a powerful tools that can completely change the way a page or widget gets interpreted by assistive technologies, for good or for bad, so it needs to be used carefully. Generally speaking, prefer using native HTML when possible, and only use ARIA when HTML is not enough (such as for tabs or carousels).

There are a lot of handy guides on the internet on building accessible widgets with the help of ARIA—[Inclusive Components](https://inclusive-components.design/) by Heydon Pickering has to be one of my favourite.

One thing I would like to bring your attention to is the concept of “live” regions. A live region is an area of a page that announces its content to screen-readers as it gets updated. Consider a container for notifications (or snackbars, croutons or whatever yummy thing they are called) or a chat feed.

```html
<div role="log" aria-live="polite">
  <!-- Chat messages being inserted as they are sent -->
</div>

<div role="alert" aria-live="assertive">
  <!-- Important notifications being inserted as they happen -->
</div>
```

A few things to know about live regions:

- The region container needs to be present and have the `aria-live` attribute when the document loads. It cannot be dynamically inserted at a later point unfortunately.
- A `role` attribute is not mandatory, but recommended (`role="region"` if no other role fits). Some roles (such as `log`, `status` or `alert`) have an implicit `aria-live` value, but it is recommended to specify the latter as well for maximum compatibility.
- Prefer using `polite` instead of `assertive` as the latter interrupts ongoing diction to announce the new content, which should be reserved for critical announcements.
- If the region is guaranteed no longer to be updated, set `off` as a value to tell the assistive technologies they no longer have to track changes in that container.

## Day 11: Emojis

Emojis are all around nowadays. Besides being cute and silly, they became an essential communication tool to suggest tone in the written world.

As [Léonie Watson explains in her article about accessible emojis](https://tink.uk/accessible-emoji/), emojis are still not very accessible to screen-readers unfortunately, and tend to be poorly or completely undescribed to their users. They are not reported as images in the accessibility tree, and they are not always assigned an accessible name. These are the 2 things to fix.

The `role="img"` attribute can be set to assign imagery semantics to a DOM node. The accessible name can be defined with the `aria-label` attribute. For instance:

```html
<span role="img" aria-label="Sparkly pink heart">💖</span>
```

That’s the strict minimum to make emojis perceivable to all. In [his article about accessible emojis, Adrian Roselli](https://adrianroselli.com/2016/12/accessible-emoji-tweaked.html) expands on Léonie’s solution to include a small tooltip to display the emoji name as well which is a nice touch.

Of course, most web pages are not coded manually, which means the label will have to be dynamically inserted when an emoji is found. Programmatically [finding emojis is just a regular-expression away](https://github.com/mathiasbynens/emoji-regex) so this is the easy part so to say.

Assigning the description programmatically is harder. It turns out [there is no obvious way to retrieve the description for an emoji](https://twitter.com/mathias/status/986921634228527104?lang=en) (also known as “CLDR short name”). Packages like [emoji-short-name](https://github.com/WebReflection/emoji-short-name) or [emojis.json](https://gist.github.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb/) provide a comprehensive map for most emojis to access their English short name, so this could be a solution albeit it has its limits (lack of internationalisation, potential performance cost…).

## Day 12: Readability

For a medium as text-focused as the web, readability has to be something we have to talk about. Besides making it more comfortable for everyone, taking special care to make content readable helps people with a various range of disabilities, such as color-blindness or dyslexia.

{% info %} While doing research for this article, I learnt about the difference between legibility and readability. The former is the product of the design of a font, based on its characteristics such as height, width, and thickness. Readability on the other hand is related to how the font is used, such as font size, letter spacing, line height and color. {% endinfo %}

The first thing to remember when it comes to readability is that there is no one-size-fit-all solution. While there are commonly accepted suggestions such as avoiding small sizes and enabling decent color contrast, it is good to remember that everyone is different and what works for me might not work for you.

As an example, a couple years back a person came to me after my talk on accessibility and told me that my advice about having super sharp contrast for body text was not always working for them, a dyslexic person who prefers something a little more toned down. Along the same lines, some people might find serif fonts easier to read, and some not.

{% assign wcag_color = "It has been repeatedly shown that [the contrast model is flawed](https://mobile.twitter.com/adamwathan/status/1304490267769221121). It is [known and is being addressed](https://github.com/w3c/wcag/issues/695)." | markdown %}

Let’s walk through the things one can do to improve readability for most:

- Pick a decent font size. There is no real commonly agreed upon threshold, but whatever you think it is, it’s most likely higher. For body text, I would recommend 16px at the very minimum, ideally more like 20px up to 30px, depending on what kind of design you go with.
- Cap the line length. Paragraphs which are too long in width can be difficult to read. Lines should be between 70 and 90 characters long, which can easily be achieved with [the `ch` CSS unit](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/). Similarly, limit paragraphs length to 70 to 90 words to make them easier to read.
- Give some room between lines. Lines that are too close to each other can make it harder to read the content. Depending on the font size, something between 1.4 and 1.5 times the size is usually good. Large headings can go lower, such as ~1.1.
- Do not justify content. It might look better and more polished, but the varying spacing between words can actually make the text harder to read. Similarly, do not center the text, as the eyes rely on the start alignment to quickly move between lines.
- Ensure decent contrast. Relying on the [WCAG contrast guidelines](https://css-tricks.com/understanding-web-accessibility-color-contrast-guidelines-and-ratios/) is a good place to start (even though the {% footnoteref "wcag_color" wcag_color %}WCAG contrast guidelines are not perfect{% endfootnoteref %}).

As an example, this blog on desktop uses a 22.4px font size and 33.6px line height (1.5 ratio). The content is left-aligned, and lines are about 85 characters long in paragraphs that are around 95 words on average. The text color is #444 on top of plain white, which has a contrast ratio of ~9.73—enough for any size of text.

You might have noticed I do not give any recommendation as to which font to choose. Besides being a design choice in many aspects, the thing is most properly-designed professional fonts will do just fine provided they are not cursive and exotic. It’s also good to remember a lot of people override the fonts in their browser with one they can conveniently read (Comic Sans is found to be a great typeface by some dyslexic people for instance).

## Day 13: Zooming

Zooming. Good ol’ zooming. Why we even have to talk about zooming is a bit of a puzzler in itself. The long story short is that years ago, when responsive design became a real thing and everyone started building sites for mobile devices, it was fancy to prevent zooming so the site feels more “like an app”.

Let alone the fact that it would be nice being able to zoom in native applications sometimes, disabling zooming on the web is a big problem. It is the digital equivalent of saying “I personally like taking the stairs, so let’s remove the lift to gain some space.” It’s selfish and ill-guided.

Vision deficiencies are among the most common disabilities, and an awful lot of people need visual correction (through glasses or lenses) to see properly. Even if only a small portion of them actively need to zoom in, this means many people rely on this feature to browse the web conveniently.

Taking myself as an example. I have terrible eyes. I am very short-sighted and have a lazy-eye I can somewhat control thanks to years of orthoptics. But my poor vision is making me tired, which causes my lazy-eye to act up. And my lazy-eye acting up makes my eyes more tired. Which means my vision is not great. That’s why I zoom most sites between 100% and 150%.

So the takeaway is: do not disable zooming.

Additionally, I use the pinch-and-zoom trackpad gesture from my MacBook Pro on every single website. Every time I want to read something, I pinch to zoom to dramatically enlarge the content, read, then pinch out to scroll or navigate. Rince and repeat.

<figure class="figure">
<img src="/assets/images/a11y-advent-calendar/zoom.png" alt="Screenshot of this blog opened in the browser, zoomed in to the max so the content touches the edges of the browser frame" />
<figcaption>This is how I browse the web: zoomed in to the max every time I want to read something</figcaption>
</figure>

I’m fortunate that macOS provides this out of the box. Some people rely on assistive technologies for a similar feature. Note that screen magnifying techniques are ten times more common than usage of screen-readers, so it’s not an edge case that can easily be omitted. AxessLab has a good [post about considering screen magnifiers](https://axesslab.com/make-site-accessible-screen-magnifiers/).

## Day 14: Captions

Whether it’s for videos on the internet or cinematics in video games, captions are an essential accessibility feature. Note that we are talking about “closed captions” here, which are not about translating content—these are subtitles.

For hard-of-hearing and deaf people of course, but also for people for whom processing audio might not be possible (such as those without headphones in a loud environment) or overwhelming (which can be the case for people on the autistic spectrum). They are also very handy for non-native speakers for whom understanding content might be easier when seeing it written rather than just spoken out.

It turns out that authoring good captions is actually surprisingly difficult, and the quality from source to source greatly varies. Here is a collection of tips to make captions as useful as possible:

- Captions should usually live in the safe area of a 16:9 screen resolution, at the bottom of the screen. They might be temporarily moved when obscuring relevant visual content such as embedded text.

- Captions are meant to be read, and therefore their size matter. They should be big enough to be readable at most distances but not too big that they would need to be refreshed too often.

- Like for any text content, contrast is key. The ideal colors for captions on a solid dark background are white, yellow and cyan. Colors can also be used to denote different speakers within a conversation, which can really help understanding.

- The length of captions should be kept short (~40 characters) and the text should not stick to the sides since differences in screen calibrating could cut the edges off. A caption should usually not exceed 2, maybe 3 lines.

- Captions should be displayed for 1 or 2 seconds and changes of captions should come with a brief (200—300ms) uncaptioned pause to make sure the reader can acknowledge a change of text even when lines look alike (length, etc.).

- Language-specific typographic rules should be respected. Words should be broken where possible according to the language they are depicted in, and sentences should be split on punctuation as much as possible.

- Special care can be taken to make sure not to spoil upcoming events before they appear on screen. Nothing like knowing what happens before it actually does because the caption was too revealing.

- Important sound effects and subtility (such as tone, emotions, loudness, music…) should be explicitly mentioned. Same thing if the sound/dialogue comes from something off-screen.

As you can see, there are a lot of things to consider to make captions accessible. Some content might be easier to caption that others (single speaker, few editorial cuts, no sound effects or music…). The more attention is devoted to captions, the more accessible the content becomes. It is particularly critical when the main content of a given page or product is provided through videos (movie, series, screencasts…).

## Day 15: Content Warnings

Content warnings are notices preceding potentially sensitive content. This is so users can prepare themselves to engage or, if necessary, disengage for their own wellbeing. Trigger warnings are specific content warnings that attempt to warn users of content that may cause intense physiological and psychological symptoms for people with post-traumatic stress or anxiety disorder (PTSD).

{% info %} This seems like the perfect opportunity to point out that jokingly using the word “triggered” to mean “being bothered by something” can be considered quite inappropriate and ableist. PTSD triggers are a real thing, which can have dire consequences. It is considerate not to dismiss and minimise the difficult of such experience by misusing the term to describe it. Possible alternative: “grinds one’s gears” or “bothers”. {% endinfo %}

At the core of content warnings, there is the need to acknowledge that every individual is different, and what might not be a sensitive topic to you might in fact be very difficult to approach for someone else. Trigger warnings are essentially an empathetic feature, and they need to be designed with an open mind.

{% assign triggers = "This is not an exhaustive list but can help defining high-level trigger warnings—courtesy of the [Inclusive Teaching document from the University of Michigan](https://sites.lsa.umich.edu/inclusive-teaching/inclusive-classrooms/an-introduction-to-content-warnings-and-trigger-warnings/): sexual assault, abuse, child abuse, pedophilia, incest, animal cruelty, self-harm and suicide, eating disorders, body hatred and fatphobia, violence, pornographic content, death, pregnancy and childbirth, miscarriages and abortion, blood, mental illness and ableism, racism and racial slurs, sexism and misogyny, classism, hateful language directed at religious groups (e.g., islamophobia, antisemitism), transphobia and trans misogyny, homophobia and heterosexism." | markdown %}

Of course, it is not possible to account for every potential trigger. Everybody is different and sensitive to a variety of different topics and situations. Nevertheless, there are {% footnoteref "triggers" triggers %}commonly accepted lists of triggers{% endfootnoteref %} (such as sexual violence, oppressive language, representation of self-harm…).

Regarding the implementation, it could be as simple as a paragraph at the top of the main section mentioning the potentially sensitive topics. For instance:

{% info %} **Trigger warnings:** Explicit Sex Scene, Self-Harm, Transphobia {% endinfo %}

This is a pretty basic but effective approach. It could be enhanced with more information about trauma triggers, link(s) to mental health websites, and even a way to complement or update the list.

<div class="Info">
<p style="margin-bottom: 0;"><strong>Trigger warnings:</strong> Explicit Sex Scene, Self-Harm, Transphobia</p>
<p style="font-size: 80%; margin-top: 0;">
<a href="https://en.wikipedia.org/wiki/Trauma_trigger">
  What are trigger warnings?
</a> ·<a href="https://www.nhs.uk/conditions/post-traumatic-stress-disorder-ptsd/treatment/" style="margin-left: 1ch">
  Get help with PTSD
</a> ·<a href="#" style="margin-left: 1ch">Suggest different warnings</a>
</p>
</div>

For audio and video content, it could be announced and/or shown at the beginning of the track. For imagery, it could be overlayed on top of the image, requiring a user interaction to effectively display the media. This is the approach taken by many social media such as Twitter.

This could even be considered a customisable user setting on a given platform. For instance, as a user I could mark transphobia and self-harm as sensitive topics for me, but consider nudity and sexuality okay. This way, the site (and its algorithms) can not only tailor the content that it shows me based on my content preferences, but also save me discomfort and potential triggers.

## Day 16: Animations

Animations are everywhere nowadays. With devices and browsers more powerful than ever, and APIs making it easier and easier to craft complex and delightful animations, it is no surprise they are heavily used in modern software development. And for good reason! When used properly, animations can grealty enhance the experience, making it easier to understand what is going on.

{% assign vestibular = "According to [Vestibular.org](https://vestibular.org/understanding-vestibular-disorder), a large epidemiological study estimates that as many as 35% adults aged 40 years or older in the United States (roughly 70 million) have experienced some form of vestibular dysfunction." | markdown %}

Animations can also be overused or misused. For most people, no big deal, but certain persons can react poorly to moving content. It can range from frustration to motion sickness (known as {% footnoteref "vestibular" vestibular %}vestibular disorder—which is shockingly common by the way{% endfootnoteref %}), to more critical outcomes like seizures. So it’s important to use animations responsibly.

A relatively low hanging-fruit is to respect the `prefers-reduced-motion` media query when animating content on screen. Note that I use “animating” as a blanket word to cover animations and transitions alike. I wrote about [building a reduced-motion mode](https://hugogiraudel.com/2018/03/19/implementing-a-reduced-motion-mode/) in the past and would recommend reading the article to get the full picture.

Another easy way to improve the experience of people being uncomfortable with animations is to wait for user interactions to trigger them. Animations are a very effective tool when used subtly and as the result of an action. That means no autoplaying videos or carousels. If they are starting automatically, provide quick controls to pause movement. The WCAG are pretty clear about this in [Success Criterion 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html):

> For any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than 5 seconds, and (3) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it unless the movement, blinking, or scrolling is part of an activity where it is essential.

The last very important point to pay attention to with highly animated content—whether it is automatic or as the result of a user action—is to avoid excessive flashes as they can cause seizures. The general rule of thumb is to avoid more than 3 flashes within one second. The [details of the flashing rule](https://www.w3.org/TR/WCAG21/#dfn-general-flash-and-red-flash-thresholds) are outlined more in depth in the WCAG.

For a more comprehensive look at using animations responsibly and with accessibility in mind, I cannot recommend enough [Accessible Web Animations](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/) by Val Head.

## Day 17: Anxiety

Anxiety is a bit of an umbrella term for a range of mental conditions that are characterised by excessive feelings of fear, apprehension and dread. As a result, anxiety is a medical condition that cannot be just shaken away, just like depression cannot be cured by being more positive.

Anxiety disorders are shockingly common too. The most recent numbers I could find from the [Anxiety and Depression Association of America](https://adaa.org/about-adaa/press-room/facts-statistics) estimate that almost one out of 5 American adults (18%) suffers from some form of anxiety. That means it is something we ought to keep in mind when building digital interfaces and experiences.

Ultimately, it is difficult to figure out what people will feel uncomfortable with, but there are generic advice we can give to make things more pleasant for everyone—especially people suffering from anxiety:

- Remove the notion of urgency. The idea that something is only available for a short amount of time is one of the main causes of anxiety among users. By removing this notion altogether, we can make things less stressful. For instance, if a two-factor authentication code is only valid for 1 minute, it might not be necessary to display a timer counting down. Worst case scenario, the user missed the mark and will ask for another code.

- Focus on clarity. The more straightforward the interface and its content, the less stressful it is. Avoid double-negatives and reversed checkboxes and be consistent with phrases and terminology. Stay away from scaremongering like dramatising non-critical actions (such as not wanting to benefit from a promotion), or shaming users for performing something (such as opting out from a newsletter).

- Provide reassurance. Any sensitive action should be marked as such (like placing an order, or deleting an entry), and it should be clear whether {% footnoteref "amazong_review" "One thing Amazon does very well by the way—despite being an awful company that we should all use less. At every step of the checkout process, it is clearly indicated next to the confirmation button whether there will be an opportunity to review the order one more time before placing it. "%}there will be an opportunity to review before confirming{% endfootnoteref %}. The ability to undo actions is also helpful to know that mistakes can be made and recovered from.

Ultimately, a lot of the work in that regard is about deeply caring for users and staying away from aggressive marketing tactics which are heavily relying on inducing anxiety. As a further read, I highly recommend reading [A web of Anxiety](https://developer.paciellogroup.com/blog/2018/08/a-web-of-anxiety-accessibility-for-people-with-anxiety-and-panic-disorders-part-1/) by David Swallow from the Pacellio Group which goes more in details.

## Day 18: Internationalisation

If accessibility is the discipline aiming at providing equal access to everyone, then the internationalisation of content has to play an important part in it. Content provided in a language that is not understood by the user is pretty inaccessible.

Localisation and internationalisation (sometimes shortened l10n and i18n respectively) are broad topics requiring a lot of knowledge to do well. Large companies tend to have teams dedicated to internationalisation and the proper localisation of content. It takes time and effort.

Nevertheless, we can outline a certain amount of advice and things to consider to make sure the content is properly localised:

- The `html` element should have a `lang` attribute (as in ISO2 code, e.g. `lang="en"`). Besides being indexed by search engines, it is used by screen-readers to use the appropriate language profile using the correct accent and pronunciation. Elements containing text in another language should be equally marked as such, for the same reason. If a page in English contains a sentence in Arabic, the DOM element containing that text should be marked as `lang="ar"`.

- Links pointing to a resource in another language than the one the page is displayed in should be marked with the `hreflang` attribute. For instance, if this page were to link to a page in Russian, the link would need to be marked with `hreflang="ru"`.

- Flags should exclusively be used to represent countries, not languages. For instance, while French is mainly spoke in France, it is also spoken in Congo and Canada—among other territorial entities. Or Spanish, which is spoken all over South America, but too often represented with a Spain flag. Flags are for countries, not languages.

- Dates and currencies should ideally be authored in the format conveyed by the language of the page. For instance, a document authored in American English should use the American date format `MM-DD-YYYY`, when a page in German should use the German one `DD.MM.YYYY`. Content in French should author currencies the French way such as “42 €” with a space between the amount and the symbol, which lives after the amount. Libraries like [Luxon](https://moment.github.io/luxon/) and [accounting.js](https://www.npmjs.com/package/accounting) can help with this process.

- Be mindful of bias when designing interfaces and the systems supporting them. For instance, having one first name and one last name is quite an occidental structure. All around the world, people have many names, middle names, initials, no first name, no last name, names with a single character… If you have never read [Falsehoods Programmers Believe About Names](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/), I cannot recommend it enough.

Internationalisation is hard to do well. It takes time and effort, and remembering that what we consider “normal” might be very different from the norms and culture in other places of the globe. In a world as connected as ours, we need to put aside our bias and design systems which fit everyone, whoever they are, and wherever they come from.
