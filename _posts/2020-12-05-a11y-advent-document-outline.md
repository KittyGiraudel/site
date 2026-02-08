---
title: 'A11yAdvent Day 5: Document Outline'
description: A11yAdvent entry on the Document Outline
---

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

To check the structure of a document, we can use the same [accessibility bookmarklet or extension](https://github.com/xi/a11y-outline) we’ve mentioned yesterday. When activating it, one of the options is “Headings”, which lists all headings in order and level. From there, we can make sure the structure makes sense, headings are in the right order, and no level is skipped.

{% info %} For years now, there have been discussions (and even proposals) about taking into consideration sectioning elements like `section` into the document outline to create sort of sub-structures where every root would go back to `h1`. This has never been implemented by any browser or supported by any assistive technology so this is basically moot at this point. Stick to appropriate heading levels.

For more information about the history behind the document outline and the proposed resolution algorithm, I encourage you to read [the Document Outline Dilemna](https://css-tricks.com/document-outline-dilemma/) by Amelia Bellamy-Royds which is a fantastic overview of the topic. {% endinfo %}
