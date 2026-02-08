---
title: Testing skip links with Cypress
description: A technical write-up on authoring Cypress tests to test accessibility skip links
---

Testing skip navigation links can be tricky, since [Cypress still does not have proper support for the `Tab` key](https://github.com/cypress-io/cypress/issues/299). As a way around it, Cypress recommends [cypress-plugin-tab](https://github.com/kuceb/cypress-plugin-tab), but that module is no longer maintained, not to mention a little flaky.

I recently implemented a proper automated test using [cypress-real-events](https://github.com/dmtrKovalenko/cypress-real-events) instead. Unfortunately, it does not work in Firefox since it relies on the Chromium remote debugger protocol.

As you’ll see, my test code makes very few asumptions about the way the skip link is implemented. Instead, it makes sure that:

- The skip link is not visible to begin with.
- The skip link is the first interactive element in the page.
- The skip link is visible when focused.
- The skip link moves the focus to the main element.

Without further ado:

```js
// Load the page
cy.visit('/')

// Ensure the skip link is not visible to start with
cy.get('[data-cy="skip-link"]').as('skipLink').should('not.be.visible')

// Press Tab once to enter the page
// See: https://github.com/dmtrKovalenko/cypress-real-events/issues/355#issuecomment-1365813070
cy.window().focus().realPress('Tab')

// Ensure the skip link is now focused and visible
cy.get('@skipLink').should('have.focus').and('be.visible')

// Interact with the skip link
cy.get('skipLink').realPress('Enter')

// Ensure the skip link is no longer focused or visible
cy.get('@skipLink').should('not.have.focus').and('not.be.visible')

// Press tab again and ensure the focus was moved to the main element
cy.realPress('Tab')
  .focused()
  .then($el => expect($el.closest('main').not.to.be.null))
```

I hope this helps! ✨
