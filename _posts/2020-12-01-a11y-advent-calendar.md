---
title: A11y Advent Calendar
keywords:
- accessibility
- a11y
- tips
---

I am between jobs with a bit of free time, so I thought I would try something new this year and publish **an accessibility tip a day** in that article. Nothing too ground-breaking, and I expect a lot of these tips to be common knowledge for many of you, yet we’ll end the month with a nice list of do’s & don’ts. ✨

I will also announce the daily tip on Twitter with the #A11yAdvent hashtag. Feel free to share your opinion and tips under that hashtag as well!

## Day 1: what is accessibility?

I thought we would start this calendar by talking about what is accessibility. There is a common belief in the web industry that accessibility is only about blind users. While it certainly involves blind people, it also encompasses way more than that.

The idea behind accessibility is to provide equal access to content to everyone, regardless of who they are or how they browse the web. Indeed, universal access to information and communication technologies is considered a basic human right by the United Nations.

In other words, providing accessible interfaces and content is about considering everyone, regardless of their abilities or disabilities, or the context in which they access content. Practically speaking, we can draw 5 large categories of impairments:

- **Visual:** this ranges from poor eyesight, to colour-blindness, from cloudiness to complete blindness, from fatigue to cataract. The web being a platform primarily consumed with the eyes, a lot of technology improvements have been made in that regard, and that is why accessibility is sometimes thought to be solely about accommodating towards blind users.

- **Motor:** motor impairments, when it comes to the web, are usually considering solely upper-limbs disabilities, so nothing below the belt. There are a wide range of reasons for someone to have limited mobility, such as tendonitis, carpal tunnel syndrom, arthritis broken hand or arm, skin condition, hand tremor, Parkinson disease or more commonly, having only one hand free.

- **Cognitive:** cognitive impairments is a broad and practically endless category because brains are complicated pieces of machinery and everyone is different. Some example could include dyslexia, post-traumatic stress disorder (PTSD), attention deficit and hyperactivity disorder (ADHA), amnesia, insomnia, vestibular disorder (motion sickness), anxiety, dementia…

- **Auditive:** while not originally too considered when the web was designed as an essentially all-text media, auditive impairments are more relevant than ever in this day and age where a lot of content is provided through videos and podcasts. They include but are not limited to being hard-of-hearing (HoH), in a loud environment or completely deaf.

- **Vocal:** vocal impediments range from benign (and sometimes temporary) situations such as having soar throat or a foreign accent, to more serious conditions like stutter or mutism. Because the web is seldom interacted with solely through oral interfaces, this category tends to be left out.

As you can see, there are so many things to consider. It may be daunting, but it’s also the beauty of our job as designers and frontend developers. We get to work _for_ everyone. I don’t know about you, but I find it inspiring. ✨

## Day 2: measuring accessibility

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
