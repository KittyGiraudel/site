---
title: 'A11yAdvent Day 21: Testing Accessibility'
---

On [day 2](/2020/12/02/a11y-advent-evaluating-accessibility/), we talked about evaluating accessibility with the Web Content Accessibility Guidelines. It is time to see how to test it. But first of all, a disclaimer: if I hope to have shown anything with this calendar is that accessibility is a broad topic impacting many different kinds of people and a lot of the work is done beyond sheer compliance with the WCAG.

Therefore, it is important to acknowledge that not everything can be automated. In fact, only a few things can be automated in the grand scheme of things. Basically, the HTML (and to some extent the CSS) can be audited to see if there are any sort immediately appearing markup issues.

Testing the HTML can be done with a variety of tools:

- [pa11y](https://pa11y.org/), which has a nice command-line interface to audit pages.
- [a11y.css](https://ffoodd.github.io/a11y.css/), a handy bookmarklet relying on CSS only to highlight potential HTML issues.
- [a11y-outline](https://github.com/xi/a11y-outline), the accessibility boorkmarklet we’ve discussed in day 4 (very good to quickly audit landmarks, links and headings).
- [aXe](https://github.com/dequelabs/axe-core), an accessibility testing engine which can be integrated in a variety of ways (devtools, React, Cypress…).
- There is also an endless list of browser extensions like [WAVE](https://wave.webaim.org/extension/).

{% info %} This is the perfect time and place to remind or let you know that accessiBe, the supposedly #1 fully automated accessibility solution” is a scam. It feeds on companies believing they can solve all their accessibility concerns by implementing a 1-line JavaScript widget. They cannot. Do not fall for it. {% endinfo %}

For copy-writing and content, I can recommend:

- [alex.js](https://alexjs.com/), a command-line utility to spot insensitive and inconsiderate writing.
- [Hemingway App](http://www.hemingwayapp.com/), a web application to help improve writing styles by spotting redundancy and complexity in English text.

Low hanging-fruits which can be performed to test things:

- Enable the reduced motion in the OS preferences (if possible).
- Enable the dark mode in the OS preferences (if possible).
- Use secondary hand (both on mobile and desktop for the trackpad/mouse).
- Use the keyboard only.
- Use a screen-reader (e.g. VoiceOver or ChromeVox, both free options).

For more all-around testing, there are pretty handy checklists:

- The one from the [A11y Project](https://www.a11yproject.com/checklist/).
- The one from [VoxMedia](http://accessibility.voxmedia.com/) going beyond technical implementation.
- This one from [Elsevier](https://romeo.elsevier.com/accessibility_checklist/).

For professional audits conducted by accessibility experts, I can recommend:

- [Marcy Sutton](https://twitter.com/marcysutton) (who will release an [EggHead series on testing accessibility](https://testingaccessibility.com/) in 2021).
- [AxessLab](https://axesslab.com/accessibility-review-by-expert/), a company specialised in accessibility auditing and testing.
- [Temesis](https://temesis.com/), a French company with English capacity specialised in accessibility and conducting audits abroad. I worked with them at N26 and it was a great experience.
- [Tenon](https://tenon.io/) which looks like a software as a service (SaaS) solution for organising, testing and evaluating accessibility within an organisation.

I am definitely forgetting a lot of tools here—this is just the tip of the iceberg. At the end of the day, ensuring proper accessibility and inclusivity in our products has to be done by combining various tools, methogolodies and manual work. There won’t be a one-size-fit-all testing solution. Feel free to share your favourite tools on Twitter with the #A11yAdvent hashtag!
