---
title: 'A11yAdvent Day 15: Content Warnings'
description: A11yAdvent entry on content warnings
---

Content warnings are notices preceding potentially sensitive content. This is so users can prepare themselves to engage or, if necessary, disengage for their own wellbeing. Trigger warnings are specific content warnings that attempt to warn users of content that may cause intense physiological and psychological symptoms for people with post-traumatic stress or anxiety disorder (PTSD).

{% info %} This seems like the perfect opportunity to point out that jokingly using the word “triggered” to mean “being bothered by something” can be considered quite inappropriate and ableist. PTSD triggers are a real thing, which can have dire consequences. It is considerate not to dismiss and minimise the difficult of such experience by misusing the term to describe it. Possible alternative: “grinds one’s gears” or “bothers”. {% endinfo %}

At the core of content warnings, there is the need to acknowledge that every individual is different, and what might not be a sensitive topic to you might in fact be very difficult to approach for someone else. Trigger warnings are essentially an empathetic feature, and they need to be designed with an open mind.

{% assign triggers = "This is not an exhaustive list but can help defining high-level trigger warnings — courtesy of the [Inclusive Teaching document from the University of Michigan](https://sites.lsa.umich.edu/inclusive-teaching/inclusive-classrooms/an-introduction-to-content-warnings-and-trigger-warnings/): sexual assault, abuse, child abuse, pedophilia, incest, animal cruelty, self-harm and suicide, eating disorders, body hatred and fatphobia, violence, pornographic content, death, pregnancy and childbirth, miscarriages and abortion, blood, mental illness and ableism, racism and racial slurs, sexism and misogyny, classism, hateful language directed at religious groups (e.g., islamophobia, antisemitism), transphobia and trans misogyny, homophobia and heterosexism." | markdown %}

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
