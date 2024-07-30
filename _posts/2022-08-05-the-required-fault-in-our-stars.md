---
title: The required fault in our stars
keywords:
  - accessibility
  - a11y
  - field
  - required
  - asterisk
---

I have been trying to figure why and when did we start using the asterisk character (`*`) to denote required fields on the web. There is little historical content about this out there, but Jared Spool pointed out that this design decision appears to predate the web:

> [I]t predates the web. I've seen instances of an asterisk to indicate a required field on mainframe data entry screens from the 70s. So, it's a pretty old convention. As to where it first showed up or who was the mastermind behind it, I'm without a clue.  
> — [Jared Spool on UX Stack Exchange](https://ux.stackexchange.com/questions/10468/why-does-asterisk-mean-required-on-a-form-field#comment15243_10468)

It may also be derived from the print industry commonly using it to mark footnotes. Regardless where it came from, it’s safe to say the asterisk character is now a well established convention, so much so that we get to ask ourselves: is the symbol enough in itself?

I was recently doing an accessibility review and someone asked me what was the ideal markup for denoting required fields in web forms. I initially thought it to be a no-brainer, but after digging a bit, I realised there is a room for interpretation.

## Under-engineered

The first version is by far the simplest. All we do is append an asterisk to the label itself.

```html
<label for="name">Name *</label> <input type="text" id="name" required="" />
```

People will see the star and understand that the field is required. In theory, people using screen-readers should hear the asterisk character. However, as [Denis Boudreau explains](https://dboudreau.tumblr.com/post/80636672526/do-not-rely-on-asterisks-alone-to-define-required), the asterisk symbol is not part of the characters that are naturally conveyed at the default verbosity level of most screen readers. So it might be skipped altogether.

That being said, the field has the `required` attribute, so it will be announced as such by screen-readers. Because of that, we could consider removing the asterisk from the accessibility tree, like so:

```html
<!-- Not ideal, see below -->
<label for="name">Name <span aria-hidden="true">*</span></label>
<input type="text" id="name" required="" />
```

I discussed this approach with [Hidde de Vries](https://twitter.com/hdv) and he suggested that it may be useful for screen-reader users to know that there’s a star in the label. For instance, if before the form there’s an intro that says “Fields marked with a star (`*`) are required” or something along those lines — a [recommended technique (G184)](https://www.w3.org/WAI/WCAG21/Techniques/general/G184.html) to satisfy [Success Criterion 3.3.2: Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions).

{% info %} [Scott O’Hara](https://twitter.com/scottohara/status/1556684102983716865?s=20&t=76fQrM6OoA_cTHqyEIJd3A) points out that tweaking the wording to avoid focusing on the star character (e.g. “Fill in all required fields (`*`)”) might be a good idea. Then the `required` attibute (or `aria-required`) indicates the required nature of the field without having to try and make someone look for the `*` which may not even be announced. {% endinfo %}

A minor improvement we could consider is adding a `title` attribute to the star to give it more context. The `title` attribute is not picked up consistently by assistive technologies, so this is more of a usability tip than an accessibility one — although it appears to be a [recommended WCAG technique (H90)](https://www.w3.org/WAI/WCAG21/Techniques/html/H90.html).

```html
<label for="name">Name <span title="Required field">*</span></label>
<input type="text" id="name" required="" />
```

## Over-engineered

A different approach I have seen used (and have implemented myself) is to vocally indicate that the field is required by providing visually hidden assistive text as part of the label.

```html
<label for="name">
  Name
  <span aria-hidden="true" title="Required field">*</span>
  <span class="sr-only">Required field</span>
</label>
<input type="text" id="name" required="" />
```

The potential issue with this approach is that the requirement might be voiced twice. First as part of the label, then via the `required` HTML attribute. Better safe than sorry I guess, but overly verbose output could be tedious for screen-reader users.

## Which to choose

Well, there is no definitive answer (as it’s often the case).

The first approach is certainly simpler, but may lack clarity with less savvy audiences. If used, the form should contain information stating that fields marked with a star are required (ideally _at the top_, before any required field).

The second approach is more explicit, but maybe too explicit for screen-reader users who may experience double output. I’ll be transparent and admit that I haven’t extensively tried it, so results may vary based on the assistive technology.

[This article](https://www.accessibility-developer-guide.com/examples/forms/required/) outlines other variations using an icon instead of the asterisk character, or relying on the `aria-describedby` attribute. [Søren Birkemeyer](https://twitter.com/polarbirke/status/1556686909400809473?s=20&t=76fQrM6OoA_cTHqyEIJd3A) recommends flipping the problem on its head and marking optional fields instead, when everything is required by default. This method apparently yields positive results for their clients. As you can see, there are plenty ways to tackle that problem.

Ultimately, you can pass WCAG SC 3.3.2 and provide a good user experience to everyone with any technique, provided it’s implemented correctly.
