---
title: 'A11yAdvent Day 16: Animations'
---

Animations are everywhere nowadays. With devices and browsers more powerful than ever, and APIs making it easier and easier to craft complex and delightful animations, it is no surprise they are heavily used in modern software development. And for good reason! When used properly, animations can grealty enhance the experience, making it easier to understand what is going on.

{% assign vestibular = "According to [Vestibular.org](https://vestibular.org/understanding-vestibular-disorder), a large epidemiological study estimates that as many as 35% adults aged 40 years or older in the United States (roughly 70 million) have experienced some form of vestibular dysfunction." | markdown %}

Animations can also be overused or misused. For most people, no big deal, but certain persons can react poorly to moving content. It can range from frustration to motion sickness (known as {% footnoteref "vestibular" vestibular %}vestibular disorder—which is shockingly common by the way{% endfootnoteref %}), to more critical outcomes like seizures. So it’s important to use animations responsibly.

A relatively low hanging-fruit is to respect the `prefers-reduced-motion` media query when animating content on screen. Note that I use “animating” as a blanket word to cover animations and transitions alike. I wrote about [building a reduced-motion mode](https://kittygiraudel.com/2018/03/19/implementing-a-reduced-motion-mode/) in the past and would recommend reading the article to get the full picture.

Another easy way to improve the experience of people being uncomfortable with animations is to wait for user interactions to trigger them. Animations are a very effective tool when used subtly and as the result of an action. That means no autoplaying videos or carousels. If they are starting automatically, provide quick controls to pause movement. The WCAG are pretty clear about this in [Success Criterion 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html):

> For any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than 5 seconds, and (3) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it unless the movement, blinking, or scrolling is part of an activity where it is essential.

The last very important point to pay attention to with highly animated content—whether it is automatic or as the result of a user action—is to avoid excessive flashes as they can cause seizures. The general rule of thumb is to avoid more than 3 flashes within one second. The [details of the flashing rule](https://www.w3.org/TR/WCAG21/#dfn-general-flash-and-red-flash-thresholds) are outlined more in depth in the WCAG.

For a more comprehensive look at using animations responsibly and with accessibility in mind, I cannot recommend enough [Accessible Web Animations](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/) by Val Head.
