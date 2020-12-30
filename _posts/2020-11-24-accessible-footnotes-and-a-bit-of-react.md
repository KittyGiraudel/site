---
title: Accessible footnotes and a bit of React
keywords:
  - footnotes
  - accessibility
  - react
---

{% footnoteref "footnotes" "Footnotes are notes placed at the bottom of a page. They cite references or comment on a designated part of the text above it." %}Footnotes{% endfootnoteref %} are not as straightforward as they seem to be. One might thing it’s just a matter of slapping an asterisk or a number after a word, and dumping some extra sweet knowledge at the bottom of the page, but that’s not it. Assistive technologies require some careful mapping in order to correctly associate the reference with its footnote.

A few years back, I wrote [Accessible footnotes with CSS](https://www.sitepoint.com/accessible-footnotes-css/), now the first result when asking Google for “accessible footnotes”. To this day, I still think it’s one of the most useful articles I’ve ever written because: a) most footnotes out there are not accessible and b) the CSS in that demo is actually pretty clever and was fun to write.

Today, I would like to revisit that implementation for using it in React. If you are interested in a ready-to-go solution, I am currently working on [react-a11y-footnotes](https://github.com/HugoGiraudel/react-a11y-footnotes), an {% footnoteref "experimental" "It is currently in v0.1 and the API might change a little. Additionally, I’m not too sure whether the styles I included are enough or too much. Any review or suggestion appreciated!" %}experimental{% endfootnoteref %} library that you can install directly from npm to use in your projects.

## What’s so hard about it?

First of all, let’s sort out nomenclature so we are all on the same page:

- The part that is highlighted or appended with an asterisk or a number within the main body is called the “footnote reference”.
- The additional content at the bottom of the page which is referred to is called the “footnote”.

Here is how a footnote reference should be marked:

```html
<p>
  Something about
  <a
    href="#css-counters-note"
    id="css-counters-ref"
    aria-describedby="footnotes-label"
    role="doc-noteref"
    >CSS counters</a
  >
  that deserves a footnote explaining what they are.
</p>
```

Let’s break it down:

- The `href` attribute is what makes the footnote reference link to the actual footnote further down the page. It is a regular anchor link pointing to an `id`.
- The `id` attribute is necessary to be able to come back to the footnote reference after having read the footnote.
- The `aria-describedby` attribute is indicating that the anchor link is a footnote reference. It refers to the title of the footnotes section.
- The `role` attribute is used for digital publishing (DPUB) contexts to indicate that the link is a footnote reference.
- The content is the segment of text which can be interacted with to move to the footnote.

And here is out the footnotes section would be authored:

```html
<footer role="doc-endnotes">
  <h2 id="footnotes-label">Footnotes</h2>
  <ol>
    <li id="css-counters-note" role="doc-endnote">
      CSS counters are, in essence, variables maintained by CSS whose values may
      be incremented by CSS rules to track how many times they’re used.
      <a
        href="#css-counters-ref"
        aria-label="Back to reference 1"
        role="doc-backlink"
        >↩</a
      >
    </li>
  </ol>
</footer>
```

Again, let’s break it down:

- The container does not _have to_ be a `<footer>` per se, but it seems like an appropriate sectioning element for footnotes. I guess `<aside>` could also do the trick, and in last resort, a `<div>`.
- The `role` attribute is used for digital publishing (DPUB) contexts to indicate that this section contains footnotes.
- The title does not necessarily _have to_ be a heading either (although it seems to make sense to me), but it needs its `id` since it is referred to by every reference in their `aria-describedby` attribute.
- The footnotes do not _have to_ be authored as an ordered list, and could also be authored as individual paragraphs, but an ordered list seems more semantic to me. Additionally, it deals with the numbering for us which is handy.
- Every back link needs to link back to the reference within the text. The `aria-label` attribute is necessary to provide explanatory content if the link text does not (like here, with an icon).

As you can see, there is quite a lot to unpack, and you can soon realise why maintaining footnotes by hand can be tedious and error-prone.

## Here comes React

My React implementation of footnotes aims at making it easier to author the references, and making it automatic to author the footnotes—including their numbering. To do that, it needs 3 different part:

- A `FootnoteRef` component that will render a reference (an anchor tag with all the necessary attributes).
- A `Footnotes` component that will render the footer and all the footnotes in the correct order.
- A `FootnotesProvider` context that will tie all of this together by storing registered references in the correct order to provide relevant footnotes to the footer.

Coming back at our initial example, the usage might look like this:

```jsx
const BlogPage = props => (
  <FootnotesProvider>
    <article>
      <p>
        Something about{' '}
        <FootnoteRef description='CSS Counters are, in essence, variables maintained by CSS whose values may be incremented by CSS rules to track how many times they’re used.'>
          CSS counters
        </FootnoteRef>
        that deserves a footnote explaining what they are.
      </p>
      {/* Some more content */}
      <Footnotes />
    </article>
  </FootnotesProvider>
)
```

What’s nice about this approach is that footnotes are essentially out of sight, out of mind. The footnote itself is authored as the `description` prop on the `FootnoteRef` component, which makes it easy to maintain. The `Footnotes` component does the work of laying out the footnotes in the order of appearance in the text.

## Wrapping things up

I hope [react-a11y-footnotes](https://github.com/HugoGiraudel/react-a11y-footnotes) will help people implement clean and accessible footnotes for everyone. I’m currently finalising the API and will most likely publish a first version some time this week.

I am also playing with providing optional basic styling—especially for the references themselves since they currently rely on CSS counters—to make it easy to import the library, its styles, and start footnoting.

If you have any suggestion, comment or issue, feel free to share on Twitter or in an issue on the GitHub repository!
