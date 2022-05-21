---
title: Simple access management with Sanity
---

Access management is important to any CMS. Unfortunately, [Sanity](https://sanity.io)’s ability to define custom roles is restricted to customers of the business plan. In this article, we will see how to customize the studio based on default roles, something that is possible with all Sanity plans—albeit a little tricky to set up (kind thanks to [Knut](https://twitter.com/kmelve) for showing me the way).

1. [Introduction](#introduction)
2. [Accessing the user’s role](#accessing-the-users-role)
3. [Updating the desk structure](#updating-the-desk-structure)
4. [Updating the “Create new document” dialog](#updating-the-create-new-document-dialog)
5. [Caveats](#caveats)
6. [Bonus: Hiding other tools](#bonus-hiding-other-tools)
7. [Bonus: Limiting specific fields](#bonus-limiting-specific-fields)

## Introduction

Sanity comes with a set of [predefined roles for all plans](https://www.sanity.io/docs/roles-reference#5ebb6b05ae21). They are:

- Administrator: Read and write access to all datasets, with full access to all project settings
- Editor: Can edit all documents in all datasets within the project
- Viewer: Can view all documents in all datasets within the project

Now for sake of the argument, let’s imagine that our scheme has 2 different types: `blogPost` and `page`. We want editors to be able to handle blog posts themselves, but pages should be managed by administrators only.

To hide pages away from editors, we need to do two things:

- [Update the desk structure](<(#updating-the-desk-structure)>) so it does not show the page menu for editors.
- [Update the “Create new document” dialog](#updating-the-create-new-document-dialog) so it doesn’t allow creating pages for editors.
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

## Caveats

There are important caveats to take into consideration before implementing this solution:

- This is purely obfuscation, and does not prevent editors from accessing or even updating documents via the API directly. This is **not** a secure access management system.
- This can be spoofed relatively easily by anyone tech-savvy enough to manipulate client-side JavaScript code, so once again, this really is just obfuscation.

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

{%info%}If you hide a document type for a specific role, and that document type can be referenced in other documents, you might want to mark all its fields as readonly. Otherwise, editors could still follow a reference field and access the editing form on a type they’re not supposed to manage. {%endinfo%}
