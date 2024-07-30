---
title: 100 tweets on accessibility
keywords:
  - twitter
  - tweets
  - accessibility
  - a11y
---

This list was originally [posted on Twitter](https://twitter.com/i/moments/877084869309980672) but with Twitter’s future being uncertain, I thought I would bring it here:

1. Don’t shame users in error messages. It can be seen as playful but also possibly condescending and off putting.

2. Be careful with text on images, no matter how cool it looks. It can be done correctly but it’s very hard.

3. Hover effects are nice, but remember that not all users have a mouse/trackpad. Make sure content can be accessible otherwise.

4. [Pa11y](https://github.com/pa11y/pa11y) is a fantastic tool to automate the basics of accessibility testing.

5. The `hidden` attribute can be used to hide an element visually and from screen readers.

6. A low hanging fruit to figure out if a content flow makes sense is to disable CSS and to see if it looks meaningful.

7. Connected radio inputs should be gathered within a fieldset, with a legend serving as label for the group.

8. Be careful with infinite animations, even subtle ones. People with Attention Deficit Hyperactivity Disorder could find them distracting.

9. Make sure not to present paragraphs that are too long. Some users tend to get lost quickly with huge blocks of text.

10. Don’t disable zooming. Some people need it to comfortably read your content. Some unusual situations require users to zoom.

11. About 7 users out of 10 would leave a site when found difficult to use (figure from CAP16).

12. The autistic spectrum is very wide and a lot of people are affected. Designing straight-forward UI helps tremendously.

13. Non-decorative images should have alt text. It is read out by screen-readers to provide information about the image content.

14. If you can provide a night mode, do it. A lof of users prefer browsing in night mode, no matter their vision.

15. Feel free to change the default browser outline, but make sure to clearly indicate which element has the focus.

16. A good way to test if your controls are forgiving enough is to use your mouse/trackpad with your other hand.

17. Fancy layouts are tricky because they can obscure the way content flows. Content hierarchy is very important to do right.

18. A recent [research from @captainsafia](/2017/07/02/accessibility-feedback-from-twitter) shows that non-captioned videos is one of the main accessibility problems faced on the web.

19. Screen readers do not have to be scary. You can get started using one by trying ChromeVox for Chrome which is very straight-forward.

20. Having a “skip-to-content” link at the very top of the page helps screen-reader users not to go through your entire header.

21. About 40 million persons worldwide are blind. Roughly 250 million persons suffer from low-vision (figures from WHO).

22. Performance is accessibility. People in large regions of the world do not have access to fast internet.

23. Proper content flow and keyboard navigation also helps power users who want to do things fast and efficiently.

24. Think about main call-to-actions’ position on screen. Not everybody has a long fingers thumb. Not everybody has two hands available.

25. Avoid justifying text, especially in large amount, as it makes it harder to read or even confusing for some people.

26. Use HTML landmarks to help people navigate your document (HTML5 structural elements & `role` attribute).

27. Don’t autoplay videos, seriously. If you do, mute them. Videos auto-playing with sound go from annoying to damaging.

28. “CSS only” solutions — while clever — usually overlook the accessibility aspect of a feature, making them sub-optimal.

29. Parallax scrolling and heavy animations can cause nausea or sickness. Go easy on them or make it possible to disable them.

30. Parallax scrolling and heavy animations can cause nausea or sickness. Go easy on them or make it possible to disable them.

31. The Chrome team maintains an [accessibility audit](https://github.com/GoogleChrome/accessibility-developer-tools-extension/) for the Chrome DevTools. Use it, it’s great.

32. Use clear language. Tone and even humour are important of course, but in the end, copy should be understandable by everyone.

33. You’ll never have a perfect experience for absolutely everybody, and that’s okay. It doesn’t have to be perfect. Do your best.

34. Accessibility on the web is a lot about caring about users and not being a bigot. That’s the first step, keep being a great human being! ✨

35. High color contrast not only helps people suffering from color-blindness but also users browser under sunlight.

36. As @heydonworks says, accessibility is not about doing more work. It’s about doing the right work. Ideally from the ground up.

37. Never convey information through color only. Colors definitely bear meaning, but they should be a secondary communication channel.

38. White space is free. Don’t be afraid to use it.

39. I like light fonts as much as the next person, but they can be extremely hard to read. Keep them for headlines and large text.

40. Dialog windows should be closable by clicking outside of them or pressing ESC. It saves people from aiming at the tiny cross.

41. A good way to ensure sufficient color contrast between two colors is [this checker from @leaverou](http://leaverou.github.io/contrast-ratio/).

42. Don’t forget the `lang` attribute on the `html` element, and on any element in a different language than the rest of the document.

43. Not all users have to have the same experience on your website. But they should all have access to your content.

44. Hiding an element while keeping it accessible isn’t super straight-forward. @ffoodd_fr found [a bulletproof solution](/2016/10/13/css-hide-and-seek).

45. Building an accessible product is not a one shot thing. It takes time and care along the lifetime of the project.

46. Highly animated content should be introduced with a warning to protect people suffering from epilepsy.

47. The `prefers-reduced-motion` media query (if supported) comes from OS settings. Here is [more info about this media query](https://css-tricks.com/introduction-reduced-motion-media-query/).

48. Decorative images should have an empty `alt` attribute (`alt=""`). Here is a good [decision tree](https://w3.org/WAI/tutorials/images/decision-tree/).

49. The usability of floating labels is debatable. Lack of space, confusing animation, poor contrast, only working for inputs, cropped label…

50. The tab sequence should be trapped within a dialog window. The `inert` attribute will soon natively provides that behaviour.

51. Some people use screen magnifiers to browse the web. Designing for them isn’t too hard, here are [good guidelines for screen magnifiers](https://dev.to/_bigblind/how-to-make-your-website-accessible-to-people-who-use-a-screen-magnifier).

52. Video captions are not only useful for deaf/HoH but also people browsing content in loud areas or without sound (e.g. public transports).

53. When using “−” as in “minus”, use the `&minus;` (or `&#8722;`) rather than a dash. Same for `&times;` in place of “x”.

54. JavaScript is not the enemy of accessibility. Actually some patterns can only be made truly accessible with JavaScript.

55. Using personas can help working with accessibility in mind, as well as encouraging QA to test for it.

56. Video captions also benefit non-native speakers. Despite my decent English, I watch Netflix with English captions all the time.

57. I don’t understand why Firefox still runs with this comically thin dotted outline. I can barely notice it.

58. Roughly 360 million persons worldwide suffer from hearing loss (figures from WHO).

59. The lack of spacing between lines of text (line-height) usually causes quite important readability issues. Easy to fix though!

60. It seems uncommon for users to zoom out. Which means, fonts are usually too small on the web. Don’t be afraid to go big(ger)!

61. Use the `<main>` element to define your main content section. It should be unique and should not contain layout chunks (header/footer…).

62. A good way to ensure keyboard navigation is to unplug your mouse or disable your trackpad when testing.

63. The document outline (hierarchy of headlines) matters. It’s used by certain programs to navigate within a document. Take care of it.

64. When you feel like bitching about Microsoft and their browser, remember that Edge is by far the most accessible one (see [browsers accessibility comparison](http://stevefaulkner.github.io/HTML5accessibility/)).

65. A survey from 2016 shows that one person out of 10 suffers from some sort of color-blindness (could be red/green, blue/yellow or complete).

66. Don’t use a `tabindex` value greater than 0. It messes up with the tab order and can be very confusing.

67. [WebAIM’s hierarchy for motivation](http://webaim.org/blog/motivating-accessibility-change/) to accessibility is: Inspire → Enlighten → Reward → Require → Punish → Guilt.

68. Vocal UI solve a lot of issues but also introduce some. Mute (temporary or permanently) people, and people with a stammer can struggle.

69. PDF is quite an inaccessible format, and here is a fantastic [reminder why PDF are tough to do right](https://paciellogroup.com/blog/2017/02/pdf-inaccessibility/).

70. As @sundress says, web accessibility is _not_ an edge case.

71. If you are getting started with VoiceOver, this is a fantastic [VoiceOver cheatsheet](https://twitter.com/mayabenari/status/822241555142426625).

72. All form controls should have an associated label. This is important for screen-reader users to know how to interact with a form.

73. CSS pseudo-elements’ content is read out loud by screen-readers so be sure it contains relevant information.

74. In a cross-functional team, everybody can contribute to a more accessible experience. Designers, devs, PM, QA… Everyone. :)

75. ARIA should not be used as a fix for poor HTML. Start with clean HTML, then enhance with ARIA if necessary.

76. [a11y.css](http://ffoodd.github.io/a11y.css/) is a clever bookmarklet from @ffoodd_fr using CSS to detect possible accessibility problems.

77. In the US, 50% of people aged 75+, 25% of people aged 65-74 and 10% of people aged 21-64 suffer from some sort of disability.

78. Making content accessible and making sure it is should be considered during planning, not as an after-thought.

79. To know whether an image is decorative or not, ask yourself if content would still make sense would the image be removed.

80. Be careful with infinite scrolling as it can be problematic for keyboard users. Make it possible to replace it with pagination.

81. Video is not always the good media to convey content. Ideally, a text transcript should be provided so people can choose their way.

82. @Heydonworks maintains a collection of in-depth articles to build [inclusive components](https://inclusive-components.design).

83. Add `tabindex=0` to scrollable regions so keyboard users can access them.

84. Icon fonts are quite bad for accessibility. Better to opt for SVG as it’s an accessible imagery format.

85. Provide a way to undo destructive actions so they can be (at least temporarily) reversible. Undo usually > confirm.

86. Many screen-reader users are running on Internet Explorer or Firefox on Windows. Some Safari on iOS.

87. Footnotes are not super straight-forward to implement correctly. That’s why I wrote about [accessible footnotes](https://sitepoint.com/accessible-footnotes-css/) a while ago.

88. Toggle buttons should have persistent label. Hat tip to @heydonworks for the example.

89. Some gestures like tap-and-hold or double clicking can be difficult to perform for users suffering from tremor or tendonitis.

90. Recent studies show that between 10 and 20% of the world population suffer from sort of disability (temporary or permanent).

91. Links opening in a new window should be indicated as such (obvious iconography, explanatory ::after pseudo-element…).

92. As @NeilMilliken says, most people with a disability weren’t born with it. As we age the likelihood increases that we’ll experience.

93. High contrast mode is not about design anymore but strict usability. You should aim for highest readability, not color aesthetics.

94. Avoid interactions that are timed based. Some people are slow. Some people take time. It should not be a stressful race to do something.

95. Comic Sans is actually a fantastic font face for people suffering from dyslexia. OpenDyslexic is a free open alternative.

96. Inserting zero-width space and invisible full-stops can make screen-readers speech nicer as [shown by @simevidas](https://youtube.com/watch?v=yaHOpbAlgkU).

97. Underlining links provides value to users failing at discerning contrast. I bet this is why it was designed this way in the first place.

98. This illustration from Microsoft is a good reminder that we’re all different, but we all should have access to the web equally.

99. Web accessibility is incredibly interesting. Don’t see it as a burden, see it as a challenge and embrace it!

100. That’s a hundred, I’m done for this session! Thank y’all for reading this far. Keep building cool stuff, you awesome people! 💖
