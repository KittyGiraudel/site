---
layout: snippet
tags: snippets
title: Portable-Text links
permalink: /snippets/portable-text-links/
language: GROQ
---

Provided you have a rich text (portable text) field called `body`, you can query all links it contains like this:

```
*[ defined(body) ]
  .body[ _type == "block" ]
  .markDefs[ _type == "link" ]
  .href
```

And if instead you want to list _documents_ which contain a specific link (here `/searched/path`) in their rich text field (here `body`), you can do it like this:

```
*[ defined(body) ] {
  body
}[
  count(
     body[ _type == "block" ]
    .markDefs[ _type == "link" ]
    [ href == "/searched/path" ]
  ) > 0
]
```

{% info %}Kind thanks to [Julia](https://twitter.com/julesisuppose) for her help with these queries.{% endinfo %}
