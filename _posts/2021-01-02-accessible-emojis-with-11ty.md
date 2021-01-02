---
title: Accessible Emojis with 11ty
---

As part of the [A11y Advent calendar](/2020/12/01/a11y-advent-calendar), we [discussed emojis](/2020/12/11/a11y-advent-emojis) and how they are not always quite accessible by default despite being used a lot and being a key communication tool in this day and age. A couple days ago, I posted a tweet about how I found a cheap and lazy way to improve emojis’ accessibility in [11ty](https://www.11ty.dev/).

Quick reminder of what we should do, courtesy of [Leonie Watson’s article on the matter](https://tink.uk/accessible-emoji/):

```html
<span role="img" aria-label="Star" title="Star">⭐️</span>
```

This is easy to do in content pages authored in HTML, but becomes more complicated in articles written in Markdown, let alone done retroactively on hundreds of pages. So the idea is to post-process the resulting HTML to wrap emojis with a span as shown above.

Fortunately, 11ty allows us to post-process HTML with [transforms](https://www.11ty.dev/docs/config/#transforms). They are very handy to, well, _transform_ a template’s output, such as minifying the resulting HTML for instance.

Here, we want a transform that will:

1. Find emojis in the HTML,
2. Find the associated English name for these emojis,
3. Wrap them in a span with the proper attributes.

Let’s start by creating the boilerplate for our transform:

```js
eleventyConfig.addTransform('emojis', (content, outputPath) => {
  return outputPath.endsWith('.html') ? wrapEmojis(content) : content
})

function wrapEmojis(content) {
  // Our code here
}
```

Finding emojis is surprisingly easy thanks to [Mathias Bynens’ `emoji-regex`](https://github.com/mathiasbynens/emoji-regex). This package provides an automatically generated (long) regular expression to find emoji unicode sequences.

From there, we can already wrap our emojis:

```js
// The package exports a function, not a regular expression, so we have to
// call it first to get the regular expression itself.
const emojiRegex = require('emoji-regex/RGI_Emoji')()

function wrapEmojis(content) {
  return content.replace(
    emojiRegex,
    match => `<span role="img">${match}</span>`
  )
}
```

Now we need to figure out the English label a given emoji. It turns out that this is surprisingly difficult. [Mathias Bynens explains why](https://twitter.com/mathias/status/986887009288548352):

> It’s trickier, as it’s not obvious what the expected output is for many emoji. Should you just use the Unicode names? What about sequences? etc.

Nevertheless, I found [emoji-short-name](https://github.com/WebReflection/emoji-short-name), which is based on [emoji-essential](https://github.com/WebReflection/emoji-essential), which is a scrap of [Unicode.org](https://unicode.org/emoji/charts/full-emoji-list.html). This package gives us the English description of an emoji.

```js
// The package exports a function, not a regular expression, so we have to
// call it first to get the regular expression itself.
const emojiRegex = require('emoji-regex/RGI_Emoji')()
const emojiShortName = require('emoji-short-name')

function wrapEmojis(content) {
  return content.replace(emojiRegex, wrapEmoji)
}

function wrapEmoji(emoji) {
  const label = emojiShortName[content]

  return label
    ? `<span role="img" aria-label="${label}" title="${label}">${emoji}</span>`
    : emoji
}
```

That’s about it! As I said, pretty cheap to implement. Now I’m going to be honest and don’t know how robust this solution is. Some emojis _might_ be missing (especially when new ones get added) and some descriptions might be sub-optimal. Additionally, it doesn’t check whether an emoji is already properly wrapped, which could cause a double-wrap (although I’d say this could be fixed relatively easily I guess).

Still, it’s a pretty convenient way to make emojis a little more accessible with 11ty!
