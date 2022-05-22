---
title: Simple access management with Sanity
---

Access management is important to any CMS. Unfortunately, [Sanity](https://sanity.io)’s ability to define custom roles is restricted to customers of the business plan. In this article, we will see how to customize the studio based on default roles, something that is possible with all Sanity plans—albeit a little tricky to set up (kind thanks to [Knut](https://twitter.com/kmelve) for showing me the way).

1. [Introduction](#introduction)
2. [Accessing the user’s role](#accessing-the-users-role)
3. [Updating the desk structure](#updating-the-desk-structure)
4. [Updating the “Create new document” dialog](#updating-the-create-new-document-dialog)
5. [Updating the search](#updating-the-search)
6. [Caveats](#caveats)
7. [Bonus: Hiding other tools](#bonus-hiding-other-tools)
8. [Bonus: Limiting specific fields](#bonus-limiting-specific-fields)

## Introduction

Sanity comes with a set of [predefined roles for all plans](https://www.sanity.io/docs/roles-reference#5ebb6b05ae21). They are:

- Administrator: Read and write access to all datasets, with full access to all project settings
- Editor: Can edit all documents in all datasets within the project
- Viewer: Can view all documents in all datasets within the project

Now for sake of the argument, let’s imagine that our scheme has 2 different types: `blogPost` and `page`. We want editors to be able to handle blog posts themselves, but pages should be managed by administrators only.

To hide pages away from editors, we need to do two things:

- [Update the desk structure](<(#updating-the-desk-structure)>) so it does not show the page menu for editors.
- [Update the “Create new document” dialog](#updating-the-create-new-document-dialog) so it doesn’t allow creating pages for editors.
- [Update the search](#updating-the-search)
- We will also see how to make things a little more tidy with a few extra features.

## Accessing the user’s role

It’s not overly advertised, but you can retrieve information about the current Sanity user by importing the dedicated store from `part:@sanity/base/user`. It provides an asynchronous function `getCurrentUser()` to get information, as well as an observable we can subscribe to. The object looks like this:

```json
{
  "email": "email@domain.com",
  "id": "cc4zMBdMk",
  "name": "Kitty",
  "profileImage": "https://avatars.githubusercontent.com/u/3948238942?v=4",
  "provider": "github",
  "roles": [
    {
      "name": "administrator",
      "title": "Administrator",
      "description": "Read and write access to all datasets, with full access to all project settings."
    }
  ]
}
```

The idea is that upon mounting the studio, we can get information about the current user and store it in a local variable or global object.

```js
// deskStructure.js
import userStore from 'part:@sanity/base/user'

const getCurrentUser = () => {
  userStore.me.subscribe(user => {
    window._sanityUser = user || undefined
  })
}

getCurrentUser()

export const isAdmin = (user = window._sanityUser) =>
  user?.roles.map(role => role.name).includes('administrator')
```

Now, we can read the role from `window._sanityUser` via our `isAdmin` utility function to adapt our structure.

## Updating the desk structure

Sanity comes with its own [structure builder](https://www.sanity.io/docs/structure-builder-introduction), an engine to customize how the CMS menus and panels behave.

```json
{
  "name": "part:@sanity/desk-tool/structure",
  "path": "./deskStructure.js"
}
```

The default structure looks something like this:

```js
// deskStructure.js
export default () => S.list().title('Content').items(S.documentTypeListItems())
```

Let’s rework it a bit. For each document type, we want to render it if the current user is an administrator, or if the type is eligible for an editor. We can also update the title of the list based on the role if we want.

```js
// deskStructure.js
export const EDITOR_TYPES = ['blogPost']

const isShown = item => isAdmin() || EDITOR_TYPES.includes(item.getId())

export default () => {
  const title = isAdmin() ? 'Content' : 'Editorial content'

  return S.list().title(title).items(S.documentTypeListItems().filter(isShown))
}
```

{% info %}You can find [a similar example](https://www.sanity.io/schemas/desk-structure-with-custom-roles-332e8ada) in the Sanity documentation, making use of more roles (both default and custom).{% endinfo %}

## Updating the “Create new document” dialog

Updating the “Create new document” dialog is essentially the same thing (although [difficult to find in the docs](https://www.sanity.io/docs/initial-value-templates#56b4073ca73a)). We need to implement the `new-document-structure` part first:

```json
{
  "name": "part:@sanity/base/new-document-structure",
  "path": "./newDocumentStructure.js"
}
```

And then rework it like this:

```js
// newDocumentStructure.js
import S from '@sanity/base/structure-builder'
import { isAdmin, EDITOR_TYPES } from './deskStructure'

const isShown = item => isAdmin() || EDITOR_TYPES.includes(item.getId())

export default () => S.defaultInitialValueTemplateItems().filter(isShown)
```

## Updating the search

Unfortunately, the studio search cannot really be customized. There is an [experimental feature](https://www.sanity.io/docs/studio-search-config) to give more weight to certain results but there is no way to properly ignore some documents from the search.

Not all hope is lost though! There is a [recent open pull-request](https://github.com/sanity-io/sanity/pull/3253) to implement that very feature, so hopefully it will get merged soon.

Once it’s done, we can programmatically iterate over the documents of our schema to add this ignore flag for the admin-only types for editor users. It will look something like:

```js
// schema.js
import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import blogPost from './blogPost'
import page from './page'
import { isNotAdmin, EDITOR_TYPES } from './deskStructure'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat(
    Object.entries({ blogPost, page }).map(([type, document]) => ({
      ...document,
      // As of writing, this is not yet a production feature. This is still in
      // development and might not ever reach production.
      // See: https://github.com/sanity-io/sanity/pull/3253
      __experimental_search_ignore:
        isNotAdmin() && !EDITOR_TYPES.includes(type),
    }))
  ),
})
```

## Caveats

There are important caveats to take into consideration before implementing this solution:

- This is purely obfuscation, and does not prevent editors from accessing or even updating documents via the API directly. This is **not** a secure access management system.
- This can be spoofed relatively easily by anyone tech-savvy enough to manipulate client-side JavaScript code, so once again, this really is just obfuscation.
- As mentioned in the previous section, the search cannot be customized so it’s essentially very easy for anyone to reach any document.

That being said, if you just want to make sure your editors don’t modify the wrong thing by mistake, this is a good enough solution that is quite simple to implement.

## Bonus: Hiding other tools

Sanity doesn’t make it overly simple to manage the tools that appear at the top of the page in the upper menu (like the Desk tool, the [media library](https://www.sanity.io/plugins/sanity-plugin-media-library) or the [Groq Vision](https://www.sanity.io/docs/the-vision-plugin) plugin).

If we wanted to hide away all tools but the Desk to editors, we would have to do that in our user observer (knowing that the desk is always the first one):

```js
import tools from 'all:part:@sanity/base/tool'
import userStore from 'part:@sanity/base/user'

const getCurrentUser = () => {
  userStore.me.subscribe(user => {
    window._sanityUser = user || undefined
    if (!isAdmin(user)) tools.splice(1)
  })
}

getCurrentUser()
```

A more thorough check could be done if we wanted to only allow some tools for editors instead of removing them all. Once again though, they could still access these tools by reaching the URL directly, so this is just obfuscation.

## Bonus: Limiting specific fields

The `readOnly` and `hidden` properties that can be defined on fields accept a function that receives — among other things — the current user. This means it is possible to mark a certain field readonly, or fully hidden, for editors if we want to (as also [demonstrated in the documentation](https://www.sanity.io/docs/conditional-fields#1cd9fa233032)).

```js
{
  title: "Unique identifier",
  name: "id",
  type: "string",
  hidden: ({ currentUser }) => !isAdmin(currentUser),
  validation: Rule => Rule.required()
},
{
  title: "Slug",
  name: "slug",
  type: "slug",
  readOnly: ({ currentUser }) => !isAdmin(currentUser),
  validation: Rule => Rule.required()
}
```

To make sure fields cannot be updated by editors even if they managed to reach a document they’re not supposed to see (which could happen when following a reference or reaching a document via the search), we can automate it. When defining our schema, we iterate over all fields of all documents, and add a `readOnly` property based on the role.

```js
// schema.js
import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import blogPost from './blogPost'
import page from './page'
import { isAdmin, EDITOR_TYPES } from './deskStructure'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat(
    Object.entries({ blogPost, page }).map(([type, document]) => ({
      ...document,
      fields: document.fields.map(addReadOnly(type)),
    }))
  ),
})

function addReadOnly(type) {
  return function (field) {
    // Block types do not support the `readOnly` property, so we can skip.
    if (field.type === 'block') return field

    // If the `readOnly` property is not already defined and the type is for
    // admins only, we add the `readOnly` property to restrict it for editors.
    if (typeof field.readOnly === 'undefined' && !EDITOR_TYPES.includes(type)) {
      field.readOnly = ({ currentUser }) => !isAdmin(currentUser)
    }

    // If the fiels is an array, recursively add the `readOnly` property to
    // nested fields.
    if (typeof field.of !== 'undefined') {
      field.of.forEach(addReadOnly(type))
    }

    return field
  }
}
```
