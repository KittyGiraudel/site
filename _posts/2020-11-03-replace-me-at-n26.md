---
title: Replace me at N26
---

After about more than 4 years, my co-worker [Mike Smart](https://twitter.com/smartmike) and I both have resigned from our position of web tech leads at N26. We will be sticking around for a few more weeks/months during our notice period, giving us enough time to look for someone to replace us as _tech lead of the Core segment_ (more on what it means further down).

- [Terminology](#terminology)
- [The team](#the-team)
- [The role](#the-role)
- [The candidate](#the-candidate)
- [Why it’s a good opportunity](#why-its-a-good-opportunity)

**Disclaimer: this is not an official job offer.** Please refer to the position on the N26 website to formally apply (which will be published in the next few days on the [N26 Careers](https://n26.com/en/careers/departments/13426)).

## Terminology

I will use certain terms over and over in this post, so I’d like to clarify terminology first and foremost so the rest makes sense:

- _Web team:_ this refers to the community of web engineers working on customer-facing applications at N26. It is not a team per se, since they are distributed across product teams and work on different topics. Consider it a synonym to “web discipline”.
- _Web platform:_ The range of features and products served by the web team to N26 prospects and customers. This encompasses the [website](https://n26.com), the [support center](https://support.n26.com), the [signup](https://get.n26.com), the [web-app](https://app.n26.com) and some webviews.
- _Web code base:_ the [single repository containing the entire code base](/2020/03/25/web-mono-repo-at-n26) used to build, deploy, test and serve the web platform.
- _Segment:_ a division of the N26 product organisation, with its own responsibilities, goals and objectives. For instance, the Growth segment, or Memberships segment, or Core segment.

## The team

As of today, there are about 15 engineers working on the customer-facing web platform, distributed across the product department in cross-functional teams, and located in our 4 offices (well, at least officially; they are currently working home)—Berlin, Barcelona, Vienna and New-York.

The web team is absolutely fantastic. 💖 Not only is it quite mature with people having been there for several years, it also values inclusion and respect at its core. There are no overly inflated egos, no openly passive-aggressive behaviours.

It is a diverse group of people, from various genders, nationalities, backgrounds, with a common understanding of what it means to work with one another in a highly toxic and biased industry that stacked cards against certain groups of people.

## The role

While it did serve us to have two core tech leads for the longest time, the truth is there is less of a need for such bi-headed leadership at this stage. Thanks to a bit of restructuring to decentralise authority in order to empower our most senior engineers to move towards tech lead positions within their segment of work, we are now looking for a single person to replace the both of us as tech lead for the Core segment.

This role is definitely a little hybrid. Surprisingly enough, there is not a whole lot of feature development involved as this person would not work in a cross-functional team on product features. The goal is mainly to care after the web team and the web platform and its underlying code base, maintaining the high quality standards already in place, and caring for web engineers all across.

A non-exhaustive list of responsibilities would go like this:

- Make sure web engineers get to do their best work without being limited or restrained by technical decisions. That implies a good deal of communication with them on a regular basis to make sure they are doing alright, can progress and understand what’s going on.

- Ensure the [web mono-repo](/2020/03/25/web-mono-repo-at-n26) remains up-to-date and tech-debt free, and continues to serve the goals of the company by enabling fast and continuous delivery of features and improvements across all web projects (website, support center, signup, web-app and webviews).

- Continue to uphold high quality standards, especially when it comes to accessibility, security, testing and documentation. We have always gone to great lengths to deliver stellar work, which scales and stands the test of time, and it should continue this way.

- Look after testability, deliverability and observability of the web platform. That might mean improving testing stability and speed, optimising the deployment pipelines, and working towards having necessary stats and metrics necessary to ensure permanent good health for the code base and the team.

- Own the continuous integration and deployment pipeline of the web platform (and its testing and reporting strategy), and lead the migration from Jenkins to GitHub Actions and Kubernetes.

## The candidate

We need someone with strong understanding of frontend development. While the mileage may vary, I think anyone who hasn’t worked in frontend and beyond for at least 5 years might be falling a little short for such a role. The code base is vast and somewhat complex, and this has to be balanced with difficult topics such as legal compliance, inclusive design, incident management, infrastructure work and of course, diplomacy and cross-team communication. This is not as scary as it sounds, but it definitely requires some experience. In other words, we probably need a senior fullstack engineer here.

More than that, we need someone who can join a team that puts people at the center of what they do—before code, before design, before product and bureaucracy. I believe this is one of the reasons people enjoy working in this environment, and I expect the next person to cultivate that empathetic mindset. That means making sure we run stress-free, we can make mistakes, we can learn from them.

Summing up what kind of candidate we would like to see taking on that role:

- At least 5 years of frontend experience with some degree of expertise in accessibility, security, testing, documentation and observability. Additionally, due to the “fullstackiness” of the role, it is important to have experience with Node, Apollo GraphQL and desire to work on CI/CD.

- Being able to show empathy and people skills (for lack of a better term). Even though this role has no direct reporting lines, a non-trivial part of the job will be managing expectations, aligning teams/goals, and ensuring everyone is doing well and can work efficiently. It’s important to be comfortable in that aspect, and be willing to do it.

- Some diplomacy, stability, and ability to work through difficult situations such as production incidents. Fortunately, there are very few incidents impacting web, but it happens. Being able to investigate issues, communicate outcomes, inform other departments such as customer support; it’s all to be expected.

## Why it’s a good opportunity

If you’ve been following along this post, I think you’ll know what I’m going to say next. Here are a few reasons I would recommend that opportunity:

- 👩🏽‍💻 The web team is quite diverse, and cares about the environment in which we work and the way we communicate with each other. If you know anyone who’s interviewed for our team, they’ll tell you we actually discuss diversity and inclusion during out tech interview. It’s genuinely a wonderful team to be a part of.

- ⚙️ The web code base is modern and, for all intents and purposes, pretty damn clean. Keeping things tidy and understandable was a non-trivial part of my job for the last few years, and I hope that shows. Things are mostly consistent through and through, and all web features are built the same way, so the learning curve is essentially non-existent when navigating projects.

- 📖 We have _a lot_ of documentation. If you have been following my work, you know how passionate I am about technical documentation. I have written about it on many occasions, and our docs is the pinnacle of my role at N26. I encourage you to [read more about the N26 docs](/2020/01/23/technical-documentation-for-everyone).

- ♿️ We really care about accessibility. We have baked this topic in our ways of working virtually since day 1 and have been leading the topic at N26 for a long time. We automate accessibility testing where possible, and have documentation and knowledge sharing on the topic. This is not that common, and it’s a great environment to work in.

- ✅ Our motto has long been “do your work and go home on time” (or “stay home” since, you know, COVID). I’ve spoken repeatedly against people working too early or too late or during weekends (although I have done it myself on many occasions, thus being both hypocritical and a poor leadership example). This means we focus on testing automation, so people _never_ have to deal with incidents. There is a formal on-call process which is opt-in and incredibly chill for web as anything seldom happens.

---

If all of this sounds interesting to you, and you think you’d be a good fit, please apply on the official job posting. If you would like more information about the role or have any question, you can ask me on Twitter—my DMs are open.

Last but not least, **I would absolutely highly encourage people from under-represented groups** to apply. Please, please, do apply. ✨
