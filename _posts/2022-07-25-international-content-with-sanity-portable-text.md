---
title: International content with Sanity Portable Text
description: A guide on handling international content with Sanity Portable Text
---

[Portable Text](https://www.sanity.io/docs/presenting-block-text) is Sanity’s custom structured format and associated editor to author rich text documents. It is extensible and customizable to a great extent.

In this article, we’ll discuss how to make it possible to mark text snippets as expressed in a different language than the rest of the content. This is particularly important for people relying on screen-readers as the proper demarcation of language may trigger a vocal dictionary switch.

![Screenshot of the rich text editor featuring a “Language switch” option](/assets/images/international-content-with-sanity-portable-text/rich-text.png)

## Why we do this

[Success criterion 3.1.2 of the Web Content Accessibility Guidelines](https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-other-lang-id.html), called “Language of Parts”, states:

> The human language of each passage or phrase in the content can be programmatically determined except for proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the immediately surrounding text. (Level AA)

In other words, for any bit of text content on a page, it should be possible to determine its language. This is typically done at the document level via the `lang` attribute on the `<html>` element. For instance, this website is in English so the `<html>` element has a `lang="en"` attribute.

But it can also be done on a very local part of the document, to demark a single sentence or even word as being in another language.

Taking the first example from the WCAG 3.1.2 page: “He maintained that the DDR (German Democratic Republic) was just a ‘<span lang="de">Treppenwitz der Weltgeschichte</span>’.” That last part should be mark as being German. Like this:

```html
<p>
  He maintained that the DDR (German Democratic Republic) was just a ‘<span
    lang="de"
    >Treppenwitz der Weltgeschichte</span
  >’.
</p>
```

This way, when a screen reader encounters the German phrase, it changes pronunciation rules from English to German to pronounce the word correctly, instead of butchering them using the English dictionary.

The documentation for this success criterion outlines perfectly why doing this matters, so much so that I’ll just borrow directly from there:

- It allows braille translation software to follow changes in language, e.g., substitute control codes for accented characters, and insert control codes necessary to prevent erroneous creation of Grade 2 braille contractions.
- Speech synthesizers that support multiple languages will be able to speak the text in the appropriate accent with proper pronunciation. If changes are not marked, the synthesizer will try its best to speak the words in the default language it works in. Thus, the French word for car, "voiture" would be pronounced "voyture" by a speech synthesizer that uses English as its default language.
- Marking changes in language can benefit future developments in technology, for example users who are unable to translate between languages themselves will be able to use machines to translate unfamiliar languages.
- Marking changes in language can also assist user agents in providing definitions using a dictionary.

Additionally, [Hidde de Vries](https://twitter.com/hdv) rightfully pointed out that [section B.2.1.1 of the Authoring Tools Accessibility Guidelines](https://www.w3.org/TR/ATAG20/#gl_b21) expects tools to make it possible to comply with the WCAG.

> The authoring tool does not place restrictions on the web content that authors can specify or those restrictions do not prevent WCAG 2.0 success criteria from being met.

You can find a more digestible and human-friendly version of the ATAG on [Hidde’s website](https://hidde.blog/content-creation-accessibility/).

## Portable Text editor

There is unfortunately no out-of-the-box way to annotate a bit of text as being in a certain language with Sanity’s Portable Text editor. However, it is [extensible with custom annotations](https://www.sanity.io/docs/customization#92d92c3189a3), so that’s what we’re looking at here.

Let’s start with a very basic schema definition for some Portable Text.

```js
export default {
  title: 'Content',
  name: 'content',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: { decorators: [{ title: 'Strong', value: 'strong' }] },
    },
  ],
}
```

We want to add a custom annotation to mark text snippets as being expressed in another language than the rest of the document.

```js
export default {
  title: 'Content',
  name: 'content',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: { decorators: [{ title: 'Strong', value: 'strong' }] },
      annotations: [languageSwitch],
    },
  ],
}
```

Now onto our annotation object. It needs a name (`lang` for simplicity, but feel free to call it whatever you want), and a text field to specify which language code it is.

As per the HTML specification, the `lang` attribute expects a “language tag” following the [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646) (also known as BCP 47 apparently — who knew). There are some good validators for this format out there, but I decided to go with something simple and flexible: some letters, optionally followed by an hyphen and some more letters. For instance, `de` or `en-GB`. To better understand language tags, I recommend [this dedicated section on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang#language_tag_syntax).

```js
const languageSwitch = {
  title: 'Language switch',
  name: 'lang',
  type: 'object',
  fields: [
    {
      title: 'Language tag',
      name: 'tag',
      type: 'string',
      validation: Rule =>
        Rule.required().regex(/^[a-z]+(-[a-z]+)?$/i, { name: 'language tag' }),
    },
  ],
}
```

Finally, we might want to customize how it looks in the rich text editor. This can be done via the `blockEditor` object of options. I picked the `MdTranslate` icon from the [Material Design icon library](https://react-icons.github.io/react-icons/icons?name=md).

```js
blockEditor: { icon: MdTranslate, render: Lang },
```

And we can write a small component to specify the way the snippet is rendered within the rich text:

```js
const Lang = props => (
  <span title={`Content expressed in “${props.tag}”`} lang={props.tag}>
    {props.children}
  </span>
)
```

{% info %}It might be tempting to prefix or suffix the content with a little flag in the rich text editor, however remember that flags are intended for countries and localities, not for languages. So it’s probably best not to. {% endinfo %}

## Frontend rendering

So far we’ve only worked on the authoring experience. We need to make sure our frontend understands that custom annotation and renders a span with the right `lang` attribute.

```jsx
import { PortableText } from '@portabletext/react'

const COMPONENTS = {
  /* All your component definitions … */
  marks: { lang: Lang },
}

const Lang = props => <span lang={props.value.tag}>{props.children}</span>

const RichText = props => (
  <PortableText value={props.content} components={COMPONENTS} />
)
```

## Wrapping up

That’s essentially it. To summarize, all we did was adding a custom annotation to our Portable Text schema so we can mark snippets of text as being expressed in a different language than the rest of the document. Then in our frontend, we made sure these nodes are rendered as `<span>` elements with the correct `lang` attribute.
