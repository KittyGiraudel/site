---
title: Shipping code at N26
tags:
  - N26
  - testing
  - process
  - production
---

This article is a response to a question I’ve recently received on Twitter:

> I would be curious to learn how you approach releasing software at @n26. To be more precise, what has to happen to go from finishing something on your machine to releasing it to all customers. I would assume you have a pretty sophisticated test setup by now.
> — [Florian Nagel, Twitter](https://twitter.com/_floriannagel/status/1074660340414205958)

Note that I will be talking exclusively about the web services’ process. Backend microservices, native applications and other pieces of the N26 software architecture might have a different system in place due to their specific constraints and requirements.

## Catching mistakes early

When committing code on our mono-repository, code changes go through linting with [ESLint](https://eslint.org/) and formatting with [Prettier](https://github.com/prettier/prettier) automatically via a Git commit hook.

Our linting setup is quite thorough, and includes things like static evaluation of the JSX to spot accessibility mistakes with [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) and auditing the code for security with [eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security). Linting prevents us from a lot of silly mistakes which can happen when writing code. That’s the first line of defense.

## Reviewing carefully

Once the code has been committed and push to the remote repository, it has to go through a pull-request in order to be merged. No one has write-access on the `master` and `develop` branches, so no one can force push code to production.

We give a lot of importance to code reviews in our team: everybody is welcome to review code, suggest improvements, make comments and ask questions. Only once at least one other person has approved the code can the pull-request be merged.

While other developers review the code changes, unit tests run against the branch on Jenkins in order to make sure the code doesn’t break anything.

## Testing a lot

When the pull-request has been merged, we initiate a testing build. This mimicks a product environment (with dead code elimination, minification, production dependencies…), and run an extensive test suite:

- We make sure depencencies are free of vulnerabilities by auditing them with `npm audit`. If there are any vulnerabilities, the build is immediately aborted to ensure we don’t allow our dependencies to offer attack vectors into our client-side applications.

- We test all our security features such as Cross-Site Resource Forgery protection, client-side encryption, brute-force protection, and so on. This is to ensure the building blocks of our web security are working as expected and never fails.

- We test that all our routes return what we expect (200, 301, 302, 404…). This works by building a “routes manifest” by merging static routes and dynamic ones coming from our Contentful CMS. All web services combined, we test about 3500 routes to make sure there is no rendering error and they actually work.

- We then run [pa11y](https://pa11y.org/) on all these routes which return markup (which is most of them) to test for basic accessibility requirements (mostly correct DOM structure). This ensures we don’t break accessibility basics without realising it.

- Then, we run an extensive suite of end-to-end tests powered by [Cypress](https://www.cypress.io/) to test most main scenarios of our web platform. This mimicks proper user interaction, and most of them actually hit a testing database, therefore also covering the communication between the frontend and the backend API.

- Finally, we run some performance auditing with [Lighthouse](https://github.com/GoogleChrome/lighthouse) to ensure our main landing pages (e.g. the website’s home page, the login page, and so on) are fast and respond quickly.

Once all the tests have passed, the code is deployed on staging servers only available internally, on which we do some manual smoke testing to make sure things are working well.

When we are ready to go live, we do a production build that goes through a similar testing flow, although without even remotely touching the production databases.

## Documenting everything

Due–among other things–to our banking requirements, we have to be very thorough with documentation. Every single pull-request we merge go in release notes we keep on GitHub and is linked to a product requirement on Jira. When releasing code live, we publish the release following [semver](https://semver.org/) conventions.

Being that verbose with contribution history makes it easier for us, but also teams relying on our work, to know what goes in each release, and when was specific code changes shipped live.

---

I hope this inspire you to make your deployment process and pipeline fast and efficient as well! Feel free to share your thoughts with me on Twitter. Oh, and don’t forget that we are currently [hiring in Berlin and Barcelona](https://n26.com/en/careers/departments/13426?gh_jid=1485191&gh_src=4f88b7891)!
