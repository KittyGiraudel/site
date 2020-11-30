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

To check the structure of a document, we can use the same accessibility bookmarklet we’ve mentioned yesterday. When activating it, one of the options is “Headings”, which lists all headings in order and level.

{% info %}
For years now, there have been discussions (and even proposals) about taking into consideration sectioning elements like `section` into the document outline to create sort of sub-structures where every root would go back to `h1`. This has never been implemented by any browser or supported by any assistive technology so this is basically moot at this point. Stick to appropriate heading levels.

For more information about the history behind the document outline and the proposed resolution algorithm, I encourage you to read [the Document Outline Dilemna](https://css-tricks.com/document-outline-dilemma/) by Amelia Bellamy-Royds which is a fantastic overview of the topic.
{% endinfo %}
