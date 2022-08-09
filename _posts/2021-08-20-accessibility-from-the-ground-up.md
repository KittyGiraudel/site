---
title: Accessibility from the ground up
---

So you are starting or restarting that website or webapp from scratch, and you want to do things well. You know about accessibility, you know it’s important, and no one up the food chain (all them bosses) is challenging this (or invested enough to care). That’s great news! Let’s make that project A C C E S S I B L E. ✨

That’s pretty daunting though. It can be tricky to know how to even get started with such a big task. Fear not! In this piece, we’re going to see how to get started with accessibility so it’s considered all throughout the development lifecycle of the project instead of at the end like usual.

- [Learn what accessibility is](#learn-what-accessibility-is)
- [Write documentation](#write-documentation)
- [Have a checklist](#have-a-checklist)
- [Automate what you can](#automate-what-you-can)
- [Centralize logic](#centralize-logic)
- [Raise awareness](#raise-awareness)

## Learn what accessibility is

I wrote about [what accessibility is](https://kittygiraudel.com/2020/12/01/a11y-advent-what-is-accessibility/) as the first piece of my A11y Advent calendar 2020 so I’ll keep things relatively concise here.

The general idea is to provide equal access to content to everyone, regardless of who they are or how they browse the web. So making an interface accessible is about considering anyone, independently of their abilities or disabilities, or the context in which they access content. Practically speaking, we can draw 5 large categories of impairments, each as broad as the next with lots of things to consider: visual, motor, cognitive, auditive and vocal.

So when (re)building that project, you’ll have to remember that the way _you_ use it might very well not be the way many other people use it. Needless to say, it’s good to avoid making too many assumptions and to keep an open mind when building software.

If someone asks you for something more concrete, you can tell them that accessibility is audited through the [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG21/) (WCAG for short). The WCAG offer a dozen guidelines organized under the POUR principles, which stands for Perceivable, Operable, Understandable and Robust. Each guideline is testable through success criteria (a total of over 80 of these), each of them with 3 level of conformance: A, AA and AAA.

[Being conformant](https://www.w3.org/TR/UNDERSTANDING-WCAG20/conformance.html) with the guidelines mean passing success criteria at a conformance level of A. Further efforts can be made to achieve higher conformance levels (when available), but it does not have to be a goal per se. A lot of work can (and should) be put into accessibility well beyond sheer compliance with the WCAG.

## Write documentation

Because accessibility testing cannot be fully automated (as we’ll see later), it is important to document expectations and implementations as you go, especially for more complex interface components like interactive widgets.

Authoring an accessibility handbook as a team is a great way to make sure everyone is involved in that initiative, and that the knowledge flows within the product team so it doesn’t fall onto someone’s shoulders to ensure everything’s accessible.

I wrote about how we [made technical documentation a first-class citizen back at N26](https://kittygiraudel.com/2020/01/23/technical-documentation-for-everyone/), which contains interesting tips to make sure the documentation remains relevant and up-to-date.

## Have a checklist

If your team is not very experienced with accessibility, it can be a good idea to create a small checklist people can refer to when they work on a feature. For instance, this is the checklist I authored for Gorillas:

- Ensure the [content is readable](https://kittygiraudel.com/2020/12/12/a11y-advent-readability/), understandable and structured. The text should not be too small, the contrast should be sufficient (and [pass contrast standards](https://contrast-ratio.com/)). The copy should make sense, even though the users might not be native speakers (be mindful of puns, jargon and idioms), and should be properly structured with a relevant [document outline](https://kittygiraudel.com/2020/12/05/a11y-advent-document-outline/) (semantic elements, heading levels, sections, etc.).
- Ensure the feature looks and is usable with color distortion (which can be simulated with various browser extensions such as NoCoffee or See), including total lack of colors. Colors should not be used as sole vector of information.
- Ensure [links are self-explanatory](https://kittygiraudel.com/2020/12/04/a11y-advent-self-explanatory-links/). Links can be listed by assistive technologies devoid of their surrounding context, and therefore should make sense on their own. This is important for efficient navigation for people using screen-readers and can be tested with [this accessibility extension](https://github.com/xi/a11y-outline).
- Ensure [images are properly described](https://kittygiraudel.com/2020/12/08/a11y-advent-alternative-text-to-images/) if they are not strictly decorative. Images are not always visible, at least not to everyone. Make sure they have a relevant associated description so everyone can understand them.
- Ensure all [forms are operable](https://kittygiraudel.com/2020/12/09/a11y-advent-forms/). Forms are one of the principal ways for users to interact with a website, and the way they are used varies greatly from user to user. Make sure they can be operated and filled efficiently regardless of the user and their device. This means having hover, active, focused, disabled states, and proper labeling of all elements.
- When using video or audio as a key part of content, [ensure it is captioned](https://kittygiraudel.com/2020/12/14/a11y-advent-captions/) and provide a written transcript. Not everyone can or wants to process information in an auditive manner.
- Ensure [animations](https://kittygiraudel.com/2020/12/16/a11y-advent-animations/) are subtle and do not flash too much. Make sure they respect the motion preferences of the user when applicable, and provide a way to disable or pause heavy animations. The risks range from simple dizziness and migraines to seizures.

Remember that these are merely suggestions and low-hanging fruits to ensure a certain level of accessibility. Yet, it is important to go further and ensure we not only are compliant with [WCAG 2.1 conformance AA](https://www.w3.org/TR/WCAG21/), but accommodate to everyone to the best we can.

## Automate what you can

There is only so much that can be automated. Auditing the HTML and CSS for potential pitfalls is a good place to start, but ultimately it is not going to replace some careful manual testing. Still, it can be a nice safety net, especially in environments where the HTML is abstracted away (such as with JavaScript frameworks).

I would recommend integrating [axe](https://github.com/dequelabs/agnostic-axe) which audits the DOM for potential accessibility issues. Its integration in the development environment should be pretty straightforward, and it gives helpful hints in the console while developing features.

If you’re setting up automated tests (and you probably should), you can even [integrate axe with Cypress](https://github.com/component-driven/cypress-axe). In a React application, [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) encourages an accessibility-oriented mindset when authoring unit tests.

You can find more information about [accessibility testing and tooling](https://kittygiraudel.com/2020/12/21/a11y-advent-testing-accessibility/) in this entry from the A11y Advent Calendar.

## Centralize logic

Accessibility is an ongoing battle. It’s never done, and you and your team can never stop caring about it. To avoid doing the same improvements and fixes over and over, a component-based architecture is key.

The goal is going to create accessible components which can be reused across the application, ensuring that many expectations are matched from the get-go. The same way you’d have a centralized way to deal with, say, translations—you wouldn’t implement a translation pipeline in every component.

Try to rely on existing (lightweight and flexible) implementations of complex components. Interfaces like dialogs, footnotes, tabs, and advanced form controls can be very difficult to build properly, and it’s better to use battle-tested solutions rather than risking rolling out your own at the detriment of your users.

I [expanded a bit on that topic](https://kittygiraudel.com/2020/12/22/a11y-advent-interactive-widgets/) in the A11y Advent Calendar, and you can also get started with that incredible [list of accessible components](https://www.smashingmagazine.com/2021/03/complete-guide-accessible-front-end-components) on Smashing Magazine.

If you’re not sure how to implement something, you could ask on Twitter with the #a11y hashtag, or in the [web-a11y Slack](http://web-a11y.slack.com/). It requires an invite (because Slack), but has thousands of members and is a vibrant community of accessibility enthusiasts and specialists alike, where you can get information and support.

## Raise awareness

Accessibility is a team game. It cannot be achieved let alone ensured by a single individual. It has to come from everyone, all the time. That’s why it’s very important to raise awareness within the organization about it so it becomes a normal topic to talk about.

I would go further and say that accessibility should be discussed (and possibly assessed) during the interview process, especially for engineers and designers, but also QA engineers and product owners. It’s everyone’s responsibility to make it happen, and too often that burden is put solely on developers.

That should get you started. Take the time to build things well from the ground up, it will pay off later. Treat accessibility as what it is, a significant part of the job, instead of a burden or someone’s else responsibility. Make your interface accessible, test, test, test, rinse and repeat. It doesn’t have to be perfect, it just have to be usable by everyone.
