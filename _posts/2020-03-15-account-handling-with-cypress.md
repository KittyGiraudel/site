---
title: Account handling with Cypress
---

At [N26](https://n26.com), we banked on [Cypress](https://cypress.io) (see what I did there?) pretty much from the start. We migrated our then small testing suite from Nightwatch and the horrors of Selenium to Cypress while it was still in closed beta. And we’ve been basing more and more of our testing infrastructure on it ever since.

Our web banking application is almost entirely tested end-to-end with Cypress. We have about 120 suites, taking up to an hour to run.

In this article, I’d like to share how we went from having [static accounts](#static-accounts) to handling [dynamic account](#dynamic-accounts) creation and authentication, and how we came up with [account caching](#caching-accounts) to speed up our runs.

## Static accounts

Originally, we had a few static accounts that we manually created for test purposes. We’d have an account that didn’t confirm their email, one that did, one that didn’t go through the product selection, one that did, an account that’s premium, and so on.

These accounts’ credentials were stored in a JavaScript file, which we imported and used as part of our custom `login` [command](https://docs.cypress.io/api/cypress-api/custom-commands.html) at the beginning of each test.

```js
import { STANDARD_ACCOUNT } from "@tests/utils/accounts";

describe("Personal settings", () => {
  before(() => {
    cy.login(STANDARD_ACCOUNT);
  });
});
```

The problem with this strategy was that soon enough, these accounts were extensively bloated with hundred of thousands of transactions and hundreds of inactive credit cards. In turn, pages were getting slugish and the tests more and more flaky. Moreover, our tests were thus bound to a single environment.

## Dynamic accounts

N26 has an internal service to create accounts. We created a Cypress command to dynamically create a user through that service. Fortunately, the service comes with a lot of handy default values, so we can only pass a few key parameters.

```js
cy.createUser({
  confirmEmail: false,
  residenceCountry: "ITA",
  topUp: 100,
});
```

Under the hood, this command fires a request to the internal service, and receives the newly-created user’s information as a response. It contains a lot of data about the user, such as their identifier, name, birth date, residency, nationality—all of which is generated at random with [Faker](https://github.com/marak/Faker.js/).

Then we would start all our tests with creating an account, then logging into that account with another custom command.

```js
describe("Personal settings", () => {
  before(() => {
    cy.createUser().then((user) => cy.login(user));
  });
});
```

## Caching accounts

While creating accounts on the fly for each test turned out great for test isolation and avoiding account bloating, it also slowed down our test suite quite a bit, as every test ended up doing multiple requests just to set up an account.

Because most tests are not performing destructive actions, we thought we could try caching them during a test run. For instance, the first test would create an account, then the second test would login with that account instead of creating yet another one.

Two critical aspects of that solution: it needed to be opt-in, so we don’t introduce side effects. And we needed to make sure that accounts are reused only when they are in the same state. That means for instance that a test needing an account with a deactivated card cannot reuse an account with an activated card.

We created a `getAccount` command on top of our `createUser` one. It takes the exact same configuration as the `createUser` command, that is, the payload sent to the internal service to create a new account. The only difference is that it also accepts a `cache` option that is `false` by default (opt-in, remember?).

It works like this:

- If the `cache` option is not passed or false, the `getAccount` just calls `createUser` and that’s it.
- If the `cache` option is true, the `getAccount` command serialises the given configuration object, and see if a cached account for that configuration exists already.
  - If an account for the same configuration has been created, we read it from the cache and return it. No extra request!
  - If no account for the given configuration exists yet, we call `createUser` to get an account and we store it in the cache before returning it.

The code (stripped out of unnecessary things) looks like this:

```js
const cache = new Map();

export default function getAccount(conf = {}) {
  const key = stringify(conf);

  if (conf.cache && cache.has(key)) {
    return typeof conf.login === "undefined" || conf.login
      ? cy.login(cache.get(key))
      : cy.wrap(cache.get(key));
  }

  return cy.createUser(conf).then((account) => {
    if (conf.cache && account) {
      cache.set(key, account);
    }

    return cy.wrap(account);
  });
}
```

> Note that `JSON.stringify` does not guarantee key order, which means two identical objects with keys in a different order will not be stringified the same way. We use a lib that ensures key sorting to prevent that problem.

We can now start our tests with a single call to `getAccount` passing the `cache: true` option when possible so we retrieve accounts from local cache if available, or create and cache them otherwise.

```js
describe("Personal settings", () => {
  before(() => {
    cy.getAccount({ cache: true });
  });
});
```

## Wrapping up

I believe one of Cypress’ best features is its extensibility. Creating custom commands is trivial, and it becomes very easy to create your own testing framework on top of Cypress.

We’re consistently working on making our testing infrastructure faster and more resilient. Cypress, in many ways, enable us to do that in ways that other testing tools like Selenium could not.

I hope this helps!
