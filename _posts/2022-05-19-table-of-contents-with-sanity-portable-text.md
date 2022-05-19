---
title: Table of contents with Sanity Portable Text
---

Sanity has this concept of “[portable text](https://www.sanity.io/docs/presenting-block-text)”. It’s basically an AST (Abstract Syntax Tree) generated via their rich text editor (called [blocks](https://www.sanity.io/docs/what-you-need-to-know-about-block-text)), which you can render in any format (HTML, JSX, Markdown…).

In this article, I want to walk through automating the creation of a table of contents for the headings contained in a portable text tree. The idea goes likethis:

1. Walk to the AST to find heading nodes.
2. Construct a small data structure that represents the heading outline.
3. Use it to render a table of contents.

Let’s start here, with the `body` prop containing the portable text queried from Sanity:

```js
const BlogPost = props => {
  return <PortableText value={props.body} />
}
```

{%info%}I’ll be using React in this article, but the core logic is framework-agnostic and applicable regardless of how you render your components. {%endinfo%}

## Finding headings

The first ting we need is a way to extract heading nodes from that data tree. To do so, we need a way to walk the tree, test every node, and collect the ones that match a function.

This is how we would create such a function:

- We “reduce” the tree of nodes into an array of relevant nodes with `Array.prototype.reduce`.
- We test every node with our matcher: if it matches, we keep it.
- If the node has children, we recursively them.

```js
const filter = (ast, match) =>
  ast.reduce((acc, node) => {
    if (match(node)) acc.push(node)
    if (node.children) acc.push(...filter(node.children, match))
    return acc
  }, [])
```

Now, we can create a `findHeadings` function that look for nodes with a `style` prop like `h2`, `h3`…

```js
const findHeadings = ast => filter(ast, node => /h\d/.test(node.style))
```

{%info%}Note that `style` has nothing to do with `style` HTML attribute. It’s a property called `style` on Portable Text nodes which may contain things like `normal`, `h2`, `h3`, etc. {%endinfo%}

# Nesting headings

Now, we want a function that nests these headings properly based on their level. This is surprisingly difficult to do, so I decided to rely on the code of [outline-audit](https://github.com/edenspiekermann/outline-audit/blob/master/index.js) I wrote in 2016, which essentially does the same thing. Here is a compact version:

```js
const get = (object, path) => path.reduce((prev, curr) => prev[curr], object)
const getObjectPath = path =>
  path.length === 0
    ? path
    : ['subheadings'].concat(path.join('.subheadings.').split('.'))

const parseOutline = ast => {
  const outline = { subheadings: [] }
  const headings = findHeadings(ast)
  const path = []
  let lastLevel = 0

  headings.forEach(heading => {
    const level = Number(heading.style.slice(1))
    heading.subheadings = []

    if (level < lastLevel) for (let i = lastLevel; i >= level; i--) path.pop()
    else if (level === lastLevel) path.pop()

    const prop = get(outline, getObjectPath(path))
    prop.subheadings.push(heading)
    path.push(prop.subheadings.length - 1)
    lastLevel = level
  })

  return outline.subheadings
}
```

We now have an array of top-level headings, and each of these headings has its own subheadings in its `subheadings` prop. Pretty neat! Here is an example:

# Rendering

We have everything we need to render our table of contents in the frontend!

```js
const BlogPost = props => {
  const outline = parseOutline(props.body)

  return (
    <>
      <TableOfContents outline={outline} />
      <PortableText value={props.body} />
    </>
  )
}
```

And finally, our `TableOfContents` component:

```js
const getChildrenText = props =>
  props.children
    .map(node => (typeof node === 'string' ? node : node.text || ''))
    .join('')

const TableOfContents = props => (
  <ol>
    {props.outline.map(heading => (
      <li>
        <a href={'#' + heading._key}>{getChildrenText(heading)}</a>
        {heading.subheadings.length > 0 && (
          <TableOfContents outline={heading.subheadings} />
        )}
      </li>
    ))}
  </ol>
)
```

A couple of things to note here:

- We extract the text from the heading node with this `getChildrenText` function.
- We recursively render table of contents components for subheadings (if any).
- The styling is left at your discretion.

## Customizing anchors

Right now, we are using the Sanity node key (the `_key` property) as the ID for our headings. It’s okay, but it doesn’t make for great URLs (e.g. `/your-path#b4282a9f0b2e`). It can also generate invalid IDs since keys can start with a number, which is not allowed in HTML.

We can tweak our `findHeadings` function to provide more information for each node. Sanity uses [speakingurl](https://www.npmjs.com/package/speakingurl) to generate slugs under-the-hood, so there are good chances it’s already in your bundle. We can use it to transform the heading text into a slug (e.g. “Customizing anchors” would become “customizing-anchors”).

```js
const findHeadings = ast =>
  filter(ast, node => /h\d/.test(node.style)).map(node => {
    const text = getChildrenText(node)
    const slug = speakingurl(text)

    return { ...node, text, slug }
  })
```

And we can update our component:

```js
<a href={'#' + heading.slug}>{heading.text}</a>
```

That’s it folks! I hope it helps you generating table of contents for your portable text. Feel free to reach out on Twitter if you have any question!
