---
layout: snippet
tags: snippets
title: getTextFromTree()
permalink: /snippets/get-text-from-tree/
language: React
---

When working with React, it might sometimes be necessary to get a plain text representation of a tree of components. This small utility function (which is probably not bulletproof) can help doing just that:

```js
const getTextFromTree = tree => {
  if (!tree) return ''
  if (Array.isArray(tree)) return tree.map(getTextFromTree).join(' ')
  if (tree.props) return getTextFromTree(tree.props.children)
  return tree
}
```

For instance, considering this React tree:

```jsx
<div className='App'>
  <h1>
    Hello <strong>CodeSandbox</strong>
  </h1>
  <h2>Start editing to see some magic happen!</h2>
</div>
```

The string representation returned by `getTextFromTree` would look like this:

```
Hello  CodeSandbox Start editing to see some magic happen!
```

Double spaces could be dealt with by replacing sequences of 2+ spaces with a single space. For instance: `outcome.replace(/\s{2,}/g, ' ')`.
