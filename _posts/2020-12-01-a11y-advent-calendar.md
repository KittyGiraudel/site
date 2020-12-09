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
- [Day 2: Measuring Accessibility](#day-2-measuring-accessibility)
- [Day 3: Hiding Content](#day-3-hiding-content)
- [Day 4: Self-Explanatory Links](#day-4-self-explanatory-links)
- [Day 5: Document Outline](#day-5-document-outline)
- [Day 6: Skip to Content](#day-6-skip-to-content)
- [Day 7: Page Title in SPA](#day-7-page-title-in-spa)
- [Day 8: Alternative Text to Images](#day-8-alternative-text-to-images)
- [Day 9: Forms](#day-9-connected-radio-inputs)

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

{% info %}
For years now, there have been discussions (and even proposals) about taking into consideration sectioning elements like `section` into the document outline to create sort of sub-structures where every root would go back to `h1`. This has never been implemented by any browser or supported by any assistive technology so this is basically moot at this point. Stick to appropriate heading levels.

For more information about the history behind the document outline and the proposed resolution algorithm, I encourage you to read [the Document Outline Dilemna](https://css-tricks.com/document-outline-dilemma/) by Amelia Bellamy-Royds which is a fantastic overview of the topic.
{% endinfo %}

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

{% info %}
Note that if you have can guarantee there is **always** a relevant `<h1>` element (independently of loading states, query errors and such), another possibly simpler solution would be to skip that hidden element altogether, and focus the `<h1>` element instead (still with `tabindex="-1"`).
{% endinfo %}

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
<input type="number" name="age" id="age" aria-describedby="age-errors">
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
  <label for="very">
    <input type="radio" name="a11y" id="very"> Very
  </label>
  <label for="so-so">
    <input type="radio" name="a11y" id="so-so"> So-so
  </label>
  <label for="not-at-all">
    <input type="radio" name="a11y" id="not-at-all"> Not at all
  </label>
</fieldset>
```
