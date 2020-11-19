---
title: Web mono-repo at N26
---

I have recently been asked what made us go with a mono-repository approach for the N26 web platform, and I thought it was an interesting question, so here is my 2 cents on this.

## Mono-repo, not monolith

Quick back-story about web at N26: we started [rebuilding the web platform from scratch as well as the web team](/2020/02/03/lessons-from-building-n26-for-web/) about 3.5 years ago. We had a super fragmented tech stack at the time (webapp in Backbone, site in Wordpress, support center in Node + templates…) and wanted to unify all of it. We had a few options, but ultimately decided to go with a monolith approach.

For us, it works like this: the web platform is on a single repository, but serves 4 different projects (the registration flow, the online banking application, the website and the support center). We build projects individually with Webpack, but 95% of the code-base is considered shared. In a way, our repository is a framework on which we build web projects.

N26 currently have about 20+ web engineers who all work full-time on the mono-repo albeit in different cross-functional teams. On top of that, we release our 4 web projects at the same time on a daily basis. That means we need our code-base to be in a constant “ready state”. We ensure that by having an easy to use feature flagging setup, a all-hands-on-deck peer review process, and an open and quick feedback loop. Expanding on these points below.

## Easy feature flags

Because we release every day, and because most non-trivial stories need more than a day to be completed, we need a way to work without impeding live deployments.

We have build-time feature flags that can be toggled on and off per environment. They are injected as global variables with Webpack and thus benefit from dead-code elimination.

When starting a new feature, we add a new feature flag which is only enabled in local environment. Once the feature is taking shape, we enable it for the dev environment. When it’s getting ready, we enable it on staging environment. And finally, after some staging testing (both manual and automated) we can turn it on for live. We leave the flag for a day or two in the code base in case we need to turn it off, and eventually remove all the new dead code around it.

## Efficient code reviews

We take a very pragmatic approach to reviewing code: everybody should do it, regardless of seniority level, and we have no concept like “1 senior approval to merge”.

We trust people to make smart decisions. If it’s a small thing, having a single approval is fine. If it’s a critical refactoring, having multiple reviews, including from people more familiar with the code is recommended.

This loose policy as well as the fact [we don’t debate code opinions during review](/2020/02/03/lessons-from-building-n26-for-web/#dont-talk-about-code) means we go through 20 to 30 pull-requests a day, and most of them tend to be open for less than an hour.

## Quick feedback loop

We make sure we communicate, not only on pull-requests but also in person (whether physically or remotely). Most changes affecting more than a single engineer are announced on Slack, and we have a weekly meeting to talk about repo-wide improvements and refactoring so no one is left behind.

We also started doing screencast sessions, where an engineer familiar with a portion of the code-base would walk through it sharing their screen so other engineers get a sense of how things work besides documentation.

The idea is that engineers relate to the whole platform rather than their project alone. That’s critical so that we keep things aligned and not too project-specific which will lead us towards the micro-projects path.

## Core infrastructure

I think another big aspect of our structure is that we have the concept of “Web Core”. The idea is that there are always some engineers working on the web platform as a whole. Things like release process, test infrastructure, dependency updates, large-scale refactoring and so on.

This is done in a unit of a few engineers changing every 2 weeks, with permanent tech leads. This way, we can keep things moving forward and up to date, and all engineers get a feeling of how our system works besides their project.

## Drawbacks of a mono-repo

Now I must be transparent about the drawbacks of a mono-repo and a unified releasing approach.

The main thing is that we’re only as fast as our slowest project. We have a lot of automated tests for our banking application, and it can take a few hours to have a passing build. This means projects that are faster are still released only once a day at best because our slowest project cannot realistically be deployed more than once a day at the moment.

We could work towards having independent releases, but given everything is shared, that remains tricky. “Which version of the button component is currently deployed on the website?” or “Why isn’t this security patch live on the registration flow?” are not questions you want to ask.

Another possible drawback is that all projects use the exact same tech stack and system, even though that might not be the best suited approach. For instance, could we have a statically generated website instead of having server-side rendering at all? Probably. But we don’t because we didn’t design it that way, and that would be unique to a project which our codebase doesn’t quite permit.

## Wrapping up

Other than that, it’s pretty great.

We all have an impact on each other’s work—for good or for bad. That means no one is truly isolated on their own project. They are an active member of our web community and see the platform grow and improve on a daily basis, which is a good thing both from a technical standpoint but also a communication one.

All projects become better by the day by the sheer fact that they belong to the mono-repo, and that’s pretty good for maintainability (and security, performance, consistency, and whatnot). I can’t stress enough how important this all is.

TL;DR: There are quite some technical decisions I regret, but going with a mono-repo ain’t one of them.
