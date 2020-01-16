---
title: Little steps for accessibility at N26
tags:
  - N26
  - a11y
  - accessibility
  - process
---

Over the last year, I have been driving the accessibility initiative at N26 to a point where it’s interesting enough that I can write about it. Because it’s a step by step process, this write-up is divided in sections. Feel free to jump to the one relevant to your interests.

* [Making it a non-functional requirement](##making-it-a-non-functional-requirement)
* [Preventing mistakes early](#preventing-mistakes-early)
* [Enabling power](#enabling-power)
* [Sharing knowledge](#sharing-knowledge)
* [Testing what’s testable](#testing-whats-testable)
* [TL;DR](#wrapping-things-up)

## Making it a non-functional requirement

An issue that often arises when it comes to introducing accessibility on a project is that there is either no time or no money for that. “That’s not our audience!” they say. Product owners, often by (understandable) lack of knowledge on the topic, dismiss accessibility for it being too inconvenient to implement.

At N26, I had the luck to start fresh. We had an empty code-base and a platform to build from the ground up. Being an advocate for inclusive experiences, it was out of question for me to give up on web accessibility before even starting. Recently hired in the company, I knew this was likely a battle I could lose, so I decided not to even fight it.

For the first few months, we never mentioned accessibility in plannings, and Just Did It™. We made our interfaces as inclusive as possible. We tried our best to accomodate to different usages of the web (devices, possible handicaps, sizes…). During review, we would usually point out how we made this component or user interface robust for different scenarios, including for people with disabilities.

This is how we slowly implemented in everyone’s mind —including our product owner— that web accessibility doesn’t have too be hard or longer to implement. We could just do it as we do everything else provided we’d consider it from the ground up. And this is how we made it a non-functional requirement. In systems engineering, a non-functional requirement (or NFR for short) is a criterion that describes how a system should _be_ (rather than what it should _do_). Practically speaking, it means we now have to make things accessible for them to be considered done: accessibility is part of our baseline for quality.

## Preventing mistakes early

Web accessibility is a complex topic. It’s one of these things where everybody is convinced it’s great and it should be done, but nobody really knows how to do so. The knowledge varies from person to person. Most developers (should) have the basics, but unless they are directly confronted to the problems they are trying to solve (blindness for instance), they often tend to omit things. We’re only humans after all.

The good thing about this, is that mistakes are easily prevented with proper tooling. At N26, we introduced two ways for us to minimize the amount of accessibility problems: via linting, and through the developer tools.

### Linting

The new N26 web platform is an isomorphic React application. One of the cool things about this is that everything is written on JavaScript (don’t quote me on this statement). Including our markup, which is authored using JSX. JSX is an extension of JavaScript used to represent HTML structure in a declarative way. The reason I mention JSX is because since it’s JavaScript (even though eventually compiled), it can be linted with ESLint. And the nice thing about this, is because there is an ESLint plugin called [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y).

This plugin does static evaluation of the JSX to look for possible accessibility issues. Because it is fully static (which means it does not operate in a runtime environment, such as a browser), its effectiveness is limited. But it can help catching early mistakes such as missing alternative content for images, lack of label for fields or possible broken or inexisting keyboard support.

At N26, we run ESLint on a pre-commit hook. That is, every time a developer commits code, ESLint runs on indexed files, and aborts the commit if there is an error. This way, we can ensure committed code is free of basic mistakes. I highly recommend anyone using React to setup this plugin: it takes little time and it can make a big difference.

![eslint-plugin-jsx-a11y helps us catching mistakes early](https://i.imgur.com/zdtmkAt.png)

### Developer tools

Linting is an excellent way to avoid mistakes early, but there is only so much it can prevent. Accessibility is a lot about the environment in which it operates, and without a runtime, there is a lot of issues that are impossible to catch.

That’s why we introduced [react-aXe](https://github.com/dequelabs/react-axe) to our code base. It’s a React wrapper around [aXe](https://github.com/dequelabs/axe-core), an accessibility engine for testing HTML-based interfaces. It runs in the browser, and provides insightful information in the developer console.

![react-aXe provides information in the console about accessibility errors](https://i.imgur.com/5jjed0b.png)

Because react-aXe modifies the rendering functions from React and React DOM, it should be run in development mode only. It’s also a bit greedy in term of performance, so better make sure not to enable it in production.

```js
import React from 'react'
import ReactDOM from 'react-dom'

// …

if (__DEV__) {
  require('react-axe')(React, ReactDOM, 1000)
}
```

This developer tool helper does not prevent us from making mistakes of course, but it warns us early (during development) when we do, and tells us how to fix them. Not too bad for 2 lines of code!

## Enabling power

The bigger the code base, the more developers contribute to it, and the higher are the chances that someone makes a mistake, causing a user experience to be sub-optimal at best, unusable at worst. This will happen, that’s alright. Still there are things we can do to prevent that.

Like often in software development, the idea is to do things once correctly so they don’t have to be done again (with the increasingly likely possibility of them being done wrong).

Consider an a11y 101 rule: all form fields should have an associated label, even though visually hidden. In order to make sure never to forget it, you write a thin layer around the `<input>` element which accepts a label and renders it. In React for instance:

```jsx
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const Input = props => (
  <Fragment>
    <label htmlFor={props.id}>{props.label}</label>
    <input {...props} />
  </Fragment>
)

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}
```

This way, the label is required to render an `Input` component, making sure never to introduce an unlabelled form field. Then, you could add a prop to [make the label correctly invisible to assistive technologies](https://hugogiraudel.com/2016/10/13/css-hide-and-seek/) so that no developer has to write it by hand, risking doing something incorrect such as `display: none`.

The general idea is to make sure all accessibility related considerations don’t have to be repeated and are implicitly embedded in the development process. Again, this obviously won’t prevent all mistakes from happening, but over time it will dramatically reduce the number of flagged issues.

## Sharing knowledge

We mentioned it before: accessibility is a complex topic. It gets even more difficult when you start blurrying the line with inclusive design and consider accessibility as a way to offer anyone, regarding who they are or how they use your project, the best experience as possible.

It is because it is so complex that communication is critical to make it successful on the long run. At N26 —at least on our platform— we have a strong code review culture. Everybody contributes to it. Everybody is encouraged to ask questions, comment, suggest improvements and pinpoint possible pitfalls or mistakes. There is no one directly assigned to do reviews, it’s everyone’s job.

On top of the obvious fact that reviewing code carefully helps preventing mistakes, having everyone chiming in encourages communication across contributors and sparks discussions that might otherwise not have been had. As a result, people tend to learn from each other and understand why things are done (or not done) the way they are.

In the current team setup, I tend to be the one with the most knowledge on accessibility and inclusivity through design. I take pull-requests as an opportunity to share my knowledge on the topic so soon enough everybody understands the state of things and can contribute to making all our user interfaces as accessible as they can be.

![GitHub discussion on the need for a label on a `select` element](https://i.imgur.com/1eKJL0M.png)

We also have a Markdown document on accessibility. It contains a definition of the term and what we do about it, as well as instructions around our linting and testing setup (as explained in this article). Every time a pull-request sparks an insightful discussion around the topic, we sum it up in our documentation. At the time of writing, here is the table of contents:

* Introduction
* Linting
* Testing
* Hiding content
* Self-explanatory call-to-actions
* Alternative text
  * Icons
* Forms & errors
* DOM & Visual order
* Going further

## Testing what’s testable

Accessibility is not something trivial to test. Fortunately, some brilliant people with their heart in the right place built tooling around it, such as aXe for instance. A fantastic tool to automate accessibility testing is [pa11y](https://github.com/pa11y/pa11y).

Pa11y is a Node / CLI utility running HTML Code Sniffer (a library to analyse HTML code) in a headless browser (Phantom in v4, Puppeteer in v5). Like aXe, it embeds the rules from accessibility standards, and test them against given URLs. From their, it gives an extensive report with hints on how to fix.

We set up pa11y to run on deployment on all our pages, so that if there is an accessibility error, it fails with a non-zero error code and aborts the procedure. Essentially, we made accessibility mistakes first class errors, so that we don’t deploy broken code.

![pa11y tests our pages for accessibility errors on deployment](https://i.imgur.com/pSiDHTX.png)

In order to test dynamic URLs (articles for instance), we start by retreiving them all from our <abbr title="Content Management System">CMS</abbr> so that we can provide them to pa11y for testing. It makes testing slightly longer, and dependent on the CMS’ API health, but it really helps us making sure we don’t inadvertently break accessibility. I find it especially useful given we don’t actively do manual QA on keyboard navigation or screen-reader usage.

---

In the future, we might be able to access the Accessibility Object Model (or AOM for short) to unit-test accessibility. The Web Incubator Community Group is pushing for a proper [AOM](https://github.com/wicg/aom) implementation. If Chromium ever gets to implement it, we’ll be able to use it through Puppeteer which opens a whole new world for testing accessibility. If you are interested in the topic, I highly recommend [“Why you can’t test a screen reader (yet)!”](https://robdodson.me/why-you-cant-test-a-screen-reader-yet/) for Rob Dodson.

## Wrapping things up

As Heydon Pickering says, accessibility is not about doing more work but doing the work correctly. And it’s never truely finished. It’s something we should keep doing all the time to make our products accessible to the many.

This is hard to do. It requires expertise, and often seems like an ideal beyond reach. I hope this write-up helped you find ways to introduce an accessibility mindset to your team.

If we sum up:

* Make sure everybody is on the same page, from the product owner to the designers to the development team. It becomes much easier to implement things correctly when everybody is aware of the constraints and implications.
* Set up linting and developer tools to help you prevent mistakes, as early as possible in the development process. You should not catch a missing `alt` attribute or `label` element when deploying to production.
* Build a culture around accessibility. Involve everyone in your team. Make people ask questions. Document everything related to the topic. Share knowledge as much as possible. One shall not own all the expertise on a single topic.
* Consider implementing test automation to catch problems before they impact your users. It might require a bit of infrastructure to get started, but once set up, it just works.

Thanks for doing the Right Thing™ and happy coding!
