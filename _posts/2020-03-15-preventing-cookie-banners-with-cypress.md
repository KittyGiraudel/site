---
title: Preventing cookie banners with Cypress
---

If your company has one of these cookie banners and you use Cypress for testing, you might have had issues with your tests failing because the banner covers the page. Here is a super small article to explain how to work around that problem.

In most cases, the way a cookie banner works is that it renders the banner, and when the user interacts with it, it sets a value in a cookie so next page loads do not render the banner again.

We can set that cookie before loading any page thanks to a [Cypress event](https://docs.cypress.io/api/events/catalog-of-events.html#App-Events).

In the code below, replace the value of the two main constants with the way it works for your website, and add this code snippet in Cypress “support file” (defaults to `cypress/support/index.js`).

```js
// The name of the cookie holding whether the user has accepted
// the cookie policy
const COOKIE_NAME = "cookie_notice";
// The value meaning that user has accepted the cookie policy
const COOKIE_VALUE = "ACCEPTED";

Cypress.on("window:before:load", window => {
  window.document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}`;
});
```

If your code relies on [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) instead of cookies to store consent, the concept is exactly the same.
