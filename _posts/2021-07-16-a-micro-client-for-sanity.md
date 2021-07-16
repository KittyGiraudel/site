---
title: A micro-client for Sanity
---

In this article, we’ll go through creating a pair of utility functions wrapping the [Sanity JavaScript client](https://www.sanity.io/docs/js-client) to query data without losing your sanity. … I’m sorry. 😶

## Shaping things up

Here are the things we want to achieve:

- Making a distinction between fetching a single entry or a collection.
- Avoiding constructing GROQ queries manually.
- Giving precedence to draft content if instructed so via an option.

To solve our first point, we’re going to author 2 functions: `getEntry` and `getEntries`. The first one will always return a single entry, while the second one will always return an array of entries.

Our second point is going to be addressed by passing different arguments to our functions, all of which will be combined to construct a GROQ query which will eventually be forwarded to the Sanity client. Both functions have the exact same signature for convenience, which goes like this:

- `conditions` is a required array of individual conditions, which will be joined together with `&&`. This is what lives between `*[` and `]` at the beginning of our GROQ query.
- `fields` is the core of the query. We use a string to preserve the power and flexibility of GROQ—no need to try to serialise this madness.
- `params` is an optional object of arguments referenced in the conditions.
- `options` is an optional object of options such as order, limit and preview.

```js
const getEntry = ({ conditions, fields, params, options }) => {}
const getEntries = ({ conditions, fields, params, options }) => {}

const client = { entry: getEntry, entries: getEntries }
```

Let’s see what it would look like in practice with a small example:

```js
const page = await client.entry({
  conditions: ['_type == "page"', 'slug.current == $slug'],
  params: { slug: 'my-page-slug' },
  fields: `_id, title, "content": body`
  options: { isPreview: true }
})
```

Finally our third and final point, returning draft content in preview mode, will be addressed separately further down that blog post.

## Querying content

First, let’s write a small utility to take all our arguments and create a valid GROQ query from it. Let’s call it `createQuery`. It’s going to receive the array of conditions, the string of fields, and the options and put them all together to return a query.

```js
export const createQuery = ({ conditions, fields = '...', options = {} }) => {
  const slice = typeof options.slice !== 'undefined' ? `[${options.slice}]` : ''
  const order = options.order ? `| order(${options.order})` : ''

  return `*[${conditions.join(' && ')}] { ${fields} } ${order} ${slice}`
}
```

{%info%} Note that we use a type check for `options.slice` instead of just checking if it’s truthy to make it possible to pass `0` if necessary (which is a falsy value but should still be printed out as a slice). {%endinfo%}

Now that we can create a GROQ query, we can use it in our helpers.

```js
const getEntry = ({ conditions, fields, params, options = {} }) => {
  const query = createQuery({
    conditions,
    fields,
    options: { ...options, slice: 0 },
  })

  return client.fetch(query, params)
}

const getEntries = ({ conditions, fields, params, options = {} }) => {
  const query = createQuery({ conditions, fields, options })

  return client.fetch(query, params)
}
```

There is admittedly not too much going on for now. The interesting part is going to deal with draft content and that’s the topic of our next section.

## Querying draft content

Sanity handles draft content by cloning the entry and prefixing its unique ID with the `drafts.` prefix. From the [Sanity documentation](https://www.sanity.io/docs/drafts):

> Drafts are saved in a document with an id beginning with the path `drafts.`. When you publish a document it is copied from the draft into a document without the `drafts.`-prefix (e.g. `drafts.ca307fc7-4413-42dc-8e38-2ee09ab6fb3d` vs `ca307fc7-4413-42dc-8e38-2ee09ab6fb3d`). When you keep working a new draft is created and kept read protected in the drafts document until you publish again.

What that means for our client is that we want to give precedence to draft content when the `isPreview` option is passed. When querying a single entry, we should return the draft version if there is one. And when querying a collection, we should preserve the drafts over the published counter-parts. Consider the following list:

```js
5a3b2389-36ce-4997-a93e-2419479d372d
ac547938-3732-4063-aeec-e41e3376d1f3
091b1dda-81dc-45b7-97f4-61b8fc50a3c1
drafts.091b1dda-81dc-45b7-97f4-61b8fc50a3c1
```

If the preview option is passed, we want to return the following entries:

```js
5a3b2389-36ce-4997-a93e-2419479d372d
ac547938-3732-4063-aeec-e41e3376d1f3
// This entry is *not* returned because it has a draft counter-part (L5).
// 091b1dda-81dc-45b7-97f4-61b8fc50a3c1
drafts.091b1dda-81dc-45b7-97f4-61b8fc50a3c1
```

If the preview option is _not_ passed, we want to return the following entries:

```js
5a3b2389-36ce-4997-a93e-2419479d372d
ac547938-3732-4063-aeec-e41e3376d1f3
091b1dda-81dc-45b7-97f4-61b8fc50a3c1
// This entry is *not* returned because it is a draft.
// drafts.091b1dda-81dc-45b7-97f4-61b8fc50a3c1
```

Returning only published content is very easy thanks to the fact that Sanity does not return draft entries if the `useCdn` option is passed to the client. So the first thing we can do is define 2 different Sanity clients, one for when the preview is enabled and one for when it’s not.

```js
const client = sanityClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: true,
  apiVersion: API_VERSION,
})

const previewClient = sanityClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
  token: TOKEN,
  apiVersion: API_VERSION,
})
```

The first thing we have to do is pick the correct client based on the preview mode. If we’re not in preview mode, then things are easy since the production client uses the Sanity CDN which doesn’t return drafts. If the preview mode is enabled though, we need to figure out which entries to keep.

Let’s start with the `getEntry` function. When querying the preview client, we do not limit the amount of results to 1. Then, we try to find a draft entry first, and if we haven’t, we return the published entry.

```js
const isDraftEntry = entry => entry._id.startsWith('drafts.')
const isPublishedEntry = entry => !entry._id.startsWith('drafts.')

const getEntry = async ({ conditions, fields, params, options = {} }) => {
  const slice = options.isPreview ? options.slice : 0
  const query = createQuery({
    conditions,
    fields,
    options: { ...options, slice },
  })

  if (options.isPreview) {
    const entries = await previewClient.fetch(query, params)

    return entries.find(isDraftEntry) || entries.find(isPublishedEntry)
  }

  return client.fetch(query, params)
}
```

The `getEntries` function is a little more complex. We need to preserve drafts over published entries as explained at the beginning of this section.

```js
const getEntries = async ({ conditions, fields, params, options = {} }) => {
  const query = createQuery({ conditions, fields, options })
  const sanityClient = options.isPreview ? previewClient : client
  const entries = await sanityClient.fetch(query, params)

  return options.isPreview ? entries.filter(preserveDrafts) : entries
}
```

And our preserve drafts function (annotated with comments):

```js
const isNotSelf = entry => item => item._id !== entry._id

const findSameEntry = (current, array) => {
  const otherEntries = array.filter(isNotSelf(current))
  const isDraft = isDraftEntry(current)
  const isSameEntry = entry =>
    // If the current entry is a draft, a duplicate would be a published version
    // with the same ID but without the `drafts.` part. If the current entry is
    // a published version, a duplicate would be a draft version with the same
    // ID starting with the `drafts.` part.
    isDraft ? current._id.endsWith(entry._id) : entry._id.endsWith(current._id)

  return otherEntries.find(isSameEntry)
}

// Try to find the current entry in the array with a different publication
// status (draft if it’s published, or published if it’s draft). If the same
// entry has been found in the array but with a different publication status,
// it means it is both published and drafted. In that case, we should only
// preserve the draft version (most recent).
const preserveDrafts = (current, _, array) =>
  findSameEntry(current, array) ? isDraftEntry(current) : true
```

{% info %} Note that this all requires querying the documents’ `_id` as part of the fields when the preview mode is enabled, since the filtering is done by reading the `_id`. To make sure this is the case, one could add a little check in the `createQuery` function to ensure it’s part of the fields. {% endinfo %}

## Wrapping up

That’s it! It’s not the most intuitive, but it works like a charm. When the preview mode is enabled, draft content will be returned and draft entries will take precedence over their published counterparts, which is what we want.

From there, both helpers could also be improved with development logs for debugging purposes, tracking and whatnot. It’s pretty convenient since they centralize the logic to query data, which means it’s a great place to put this sort of things.

I hope this helps! ✨
