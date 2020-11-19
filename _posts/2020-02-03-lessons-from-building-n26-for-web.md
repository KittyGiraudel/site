---
title: Lessons from building “N26 for Web”
tags:
  - thoughts
  - feedback
  - process
  - team
  - N26
---

In just about a month, that will be 3.5 years I am at N26. I was hired as the first web developer to rebuild the N26 web platform. At the time, that meant rebuilding the Wordpress website, rebuilding the Backbone webapp, rebuilding the Onsen UI webviews and rebuilding the custom support center, all in a new unified tech stack. And also, building a team, that could achieve all that, and work on the new platform to bring “N26 for Web” to a whole new shiny state.

So I did, with incommensurable help from [Mike Smart](https://twitter.com/smartmike). So we did, us all, the web engineers that have been and are still with us to this day. In this article, I would like to share a few things I learnt and discovered along the way.

- [Hire people, not skills](#hire-people-not-skills)
- [Don’t talk about code](#dont-talk-about-code)
- [Documentation, documentation, documentation](#documentation-documentation-documentation)
- [Make tests first-class citizens](#make-tests-first-class-citizens)
- [So much to do, so little time](#so-much-to-do-so-little-time)
- [Just do it (yourself)](#just-do-it-yourself)
- [Wrapping up](#wrapping-up)

## Hire people, not skills

N26, like many startups, is growing fast. When I joined, we were just about 100 people. Now, it’s way over a thousand, in about 3 years. We had to hire a lot, and quickly. I am very thankful I got to lead hiring for the web team because I could made sure we balance hiring fast with hiring well.

Hiring in the tech industry is just like the tech industry itself: completely messed up. We impose unrealistic and unreasonable expectations on people. We completely overstate the value of technical skills and we think writing code is way more difficult than it is. This, in turn, creates weak homogeneous teams of fragile egos.

I [wrote extensively on how we hire](/2020/01/13/lets-talk-about-your-resume) and—while I do think I made a few mistakes along the way—I also feel like it worked exceptionally well. At the risk of sounding cheesy, the N26 web team is by far the best team I have ever worked in. It’s made of over 20 diverse individuals who respect each other to build a good product for everyone.

We are not just a group of technicians working for the same company. And by that, I don’t mean that we are necessarily all friends, or “like a family” (which I think is also an understated wrong trait of the startup culture). I mean that we are more than the sum of our skills. We have a shared vision, with shared values, like respect, trust, and inclusion (both within, and from a product standpoint).

## Don’t talk about code

As your team grows, you want to cut as many sources of friction as possible when it comes to writing code. One way to do that is to make most discussions around the _way_ to write code over before they even start.

Don’t spend time arguing about formatting: set up [Prettier](https://prettier.io/).
Don’t spend time reviewing coding errors: set up [ESLint](https://eslint.org/).
Don’t spend time discussing about common patterns: define and [document them](#documentation-documentation-documentation).

You will want your time spent discussing code to be about solving problems, not bikeshedding on the way to write said code. Writing the code truly is the easy part of our job, in part because it can be significantly eased with tools and processes.

## Documentation, documentation, documentation

I have recently [written about our documentation](/2020/01/23/technical-documentation-for-everyone). I cannot stress this enough: it’s all about documentation. I think most developers seriously tend to underestimate the benefits of properly written and maintained docs.

Here are the things that it makes easier:

👋🏻 Onboarding new team members. Having comprehensive documentation gives them autonomy, and enables them to get started faster and more comfortably. It gives people the tools to work and progress—especially to the people who crucially need these tools.

✅ Settling discussions by defining one way to do things. Of course this can change, and the one way might become another way down the line, but at any point in time, it is important to have a single common and agreed on approach.

🏝 Removing knowledge islands. One of the worst things about someone leaving (besides, you know, them leaving) is all the knowledge they are taking with them. Companies tend to think that having a month or two of overlap with the next hire is enough to minimise that, but that’s not. I can guarantee, no amount of time overlap will be enough for me to share over 3 years of company, product and code knowledge. Documentation is what will. Note that this is not too specific to someone leaving, but also applies for someone with specific knowledge not being available (other project, holidays, sickness…).

## Make tests first-class citizens

There are many reasons why a company would not invest in testing. Sometimes we “don’t have time”. Or “it’s never gonna change, no need”. Or “it’s too complicated to test”. That might be a fine decision on the spot, but that’s going to come bite you down the line.

One way to fight that problem is to not only invest in tests, but also invest in a testing framework. And by this I don’t mean Jest, Mocha or Cypress. I mean in building a tooling system that enables developers to write tests efficiently, and said tests to be run automatically at appropriate time.

We noticed that a lot of junior and mid-level engineers have only very little experience with automated testing, if at all. For most of them, it’s a bit of Jest here, and sometimes some Cypress there. Given how complex it can be to set up automated testing, I can totally understand why testing knowledge is not more widely spread.

having to mess with dependencies, environment variables, configuration and whatnot. Have them focus on the meat: writing good and relevant tests. They should not have to worry too much about where or when these tests will be run. The system should guarantee that the tests they write will be run.

Invest in your testing setup, folks. Make it good. Make it robust. Make it helpful. Don’t let it fall through the cracks.

## So much to do, so little time

As more and more engineers work on a given project, the technical debt will grow. That’s pretty normal, and that probably stands true for most projects, regardless of the amount of developers working on it. Because technical debt is inevitable, it is also somewhat okay. What is important is to not only acknowledge it, but also keep track of it. I would recommend maintaining a backlog of things to do.

Whenever something out of scope comes up in code review, add a ticket to the backlog describing the task. This makes sure it won’t be forgotten, and avoid riddling the code base with `@TODO`s. Similarly, whenever someone has an idea for improvement, add a ticket to the backlog. It can be picked up later.

I believe we should always be able to assess the health of a code base, at least on a high level. Things like large-scale refactoring and major dependency updates should be accounted for so they don’t get forgotten.

## Just do it (yourself)

If I had to reflect on my experience as a tech lead (or whatever fancy title it is) over these 3 years is that it’s important to let people experiment, make mistakes and take ownership. Micro-management is a counter-intuitive work methodology, and I certainly must have failed at this on multiple occasions.

For people to grow and feel valued in an organisation, they have to be able to take on responsibilities. I feel like we did a fair job at making sure people would not be imposed responsibilities they didn’t want or couldn’t live up to, but probably we could have done better at letting people take on more at times.

I have always felt conflicted between doing things myself so people don’t have to deal with them and can focus on their work, and letting people do these things at the risk of causing them stress or discomfort.

A good example of that is shipping code to production. We have released our web platform over 700 times in the last 3 years, and I must have orchestrated 90% of those releases. Mostly because it’s sometimes a little difficult, and more importantly, because I know it can be stressful for some people, especially less seasoned engineers. Now, some people were probably happy I took on this task repeatedly, but by doing so I also deprived some curious engineers from a learning opportunity.

I have recently been taught the word “sonder”. That is the realisation that everyone, including passers-by, has a life as complex as our own, which they are living despite our personal lack of awareness of it. I find it interesting because it’s all too obvious but also quite a discovery in itself. People are not <abbr title="Non-Playable Characters">NPCs</abbr> in our lives. Who knew, right?

I have absurdly high expectations for myself, and sometimes I expect people to do the same about themselves. That’s not quite how things work though, and every one is trying to do the best they can. The [Prime Directive of Agile](https://retrospectivewiki.org/index.php?title=The_Prime_Directive) says something similar:

> “[W]e understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand.”
> — [The Prime Directive of Agile](https://retrospectivewiki.org/index.php?title=The_Prime_Directive)

I guess the lesson here is to manage expectations. Sometimes we’re in the wrong assuming people don’t want responsibilities. What’s important is that people get to decide when they’re ready, so they remain in control of their personal growth.

## Wrapping up

There are many more things I could share about my experience at N26, but I guess that will do for now. If I have to give key takeaways for anyone having the responsibility to build a team and a platform, it’s these:

💖 Be kind. Show empathy. Trust the people you hire and work with, and constantly aim to have a safe and healthy environment for everyone. Especially for the most vulnerable people.

🤔 Don’t overthink code decisions too much. At the end of the day, this is usually not that crucial, and this is not what defines you and your team. Make sure things are clean and consistent, but don’t fall into bikeshedding.

✅ Make sure to consider tests and documentation from the start, and all the way through. They are not sprinkles on top of the cake. They should be an essential part of your actual output, and they help tremendously down the line.

Finally, enjoy what you do, and make sure other people do too. We spend so much time at work. And even when we’re not behind the desk, work is somewhat at the back of our mind. Make sure that time counts.
