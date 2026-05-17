---
title: On Take-Home Coding Assignments
description: A reflection on take-home coding assignments as part of the hiring process, why I find them generally unhelpful, and some alternatives.
tags:
  - Hiring
  - Interviews
  - Engineering
  - Retrospective
image: /assets/images/on-take-home-coding-assignments/take-home-coding-assignments-banner.jpg
---

<style>
@media (min-width: 769px) {
  .PnC {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
  }
}

</style>

{% assign footnote_softened = "Say what you will, I am mellowing with age. I am less abrasive than I used to. For instance, I have removed all swear words from this website." %}

**Disclaimer:** this piece is a rework of [this Twitter thread of mine](https://x.com/KittyGiraudel/status/1447528254957555717) from 2021, in an effort to move meaningful content out of Twitter. It was edited, {% footnoteref "softened" footnote_softened %}softened{% endfootnoteref %} and actualized for the 2026 landscape.

{% callout %}In this article, I’ll use take-home/coding/technical assignment/challenge/test/exercise interchangeably to refer to the interview step where candidates are asked to produce code or a small project on their own time.{% endcallout %}

## Overview

Interviewing for a job is stressful enough. Then come the dreaded _coding challenge_ or _take-home test_. The shape and flavor vary from company to company, but at the end of the day, it’s homework given by the potential employer to evaluate the candidate’s technical skills.

Opinions on the validity and benefits of this exercise vary wildly, and there are certainly pros and cons for doing — or deliberately avoiding — coding exercises. I have spent a lot of time thinking about this as a hiring manager, and I keep coming back to the same conclusion: for most engineering roles, I believe these exercises are generally unhelpful. That being said, I can empathize with what they’re trying to solve.

In this piece, I’d like to highlight some reasons why I think they are not a terribly effective solution, as well as provide some alternatives.

## What’s wrong with them?

### Time investment

Home assessments eat into people’s lives. This can be minimized by time-boxing the exercise, or by limiting its scope so it fits within an hour or so. But one way or another, the candidate has to spend private and potentially precious time on this.

It’s good to remember that some people juggle multiple jobs to make ends meet. Many people have kids to care for. Some have relatives to spend time with. Some people have health problems. Or, god forbid, hobbies! And many people looking for a new job are actively employed already, looking for an escape to a toxic environment or simply a better position some place else.

Being able to spend several hours on unpaid work is a privilege not everyone has. That alone hurts diversity: you filter out capable candidates who simply cannot afford to do the assignment.

{% assign footnote_time_ai = "This is likely less true nowadays, as AI has gotten surprisingly good at performing code reviews. You could potentially let something like CodeRabbit thoroughly review candidates’ code and output a helpful summary for the hiring manager." %}

On the hiring side, reviewing the candidates’ output also takes time. An {% footnoteref "time-ai" footnote_time_ai %}inordinate amount of time in fact{% endfootnoteref %}. And that time could be better spent actually talking to candidates or working with my team on code that will eventually ship.

### Relevance to the job

{% assign footnote_ai_coding = "It is also worth asking what is really being tested now that AI coding agents are omnipresent. How interesting is it really to have an engineer prompt their way through a whole exercise? Even if that’s essentially what they’ll end up doing on the job — what does it really highlight during the interview process?" %}

I find it surprisingly difficult to come up with a technical exercise that is genuinely meaningful to the day-to-day of the position. Software engineering is fluid and ever-changing, so much so that synthetic challenges are often {% footnoteref "ai-coding" footnote_ai_coding %}too technical or not enough{% endfootnoteref %}, off-topic, or unrepresentative of what the person will actually do.

Not only that, but they’re also far away from what working in a team is like: an engineer should never end up working alone and under stress. They should be able to ask for help when needed, brainstorm with others, get feedback, and bounce ideas with their peers. A take-home test ends up highlighting the ability to work in isolation when we want to encourage collaboration.

Worse, some companies use them as a way to get free work out of candidates — for example case studies or ideas that will be used later. That’s just exploitative.

### Signal it sends

Spending half the interview process on a coding task implies that the main challenges people will face will be overwhelmingly technical. In reality they are usually anything but. Technical difficulty is rarely the bottleneck for product teams. Communication differences, expectation mismatches, organizational issues, prioritization mistakes, process inefficiency — these are what make a difference day to day. Not whether or not an engineer knows how to reverse a binary tree, or how to implement a data fetching library from scratch.

As a hiring manager, I’ve always felt weird at the idea of enforcing a coding test. It’s like giving homework to someone who’s going to be my peer — it’s a bit weird. I also want people to relax outside of work, not work even more.

So, coding exercises tend to be stressful, often lack relevancy to day-to-day work, are inherently time-consuming, and risk hurting hiring diversity. What are they good for?

## What are they good for?

### Technical overview

While they come with their caveats, technical tests can be a decent way to see what people consider when they develop a feature.

With the omnipresence of AI coding agents, they’re not actually great at judging code — unless you actively forbid using AI but a) good luck enforcing that and b) back to lack of relevancy to the job. But because code is now a cheap commodity, they can help see what the candidate has considered: did they add tests? Did they write documentation? Did they implement some good error handling? Did they polish the UI? Is their implementation secure?

If you can no longer judge the narrow technical expertise of an engineer, you can at least assess whether they understand _everything_ that has to make its way into a feature. In other words, test for breadth, not depth.

### Conversation starter

Another interesting case for the take-home assignment is to use it in a subsequent in-person interview as a conversation starter. “Walk me through your implementation”, and then start asking questions and engage in a meaningful technical conversation from there. It’s often easier for people to talk when they have something concrete in front of them instead of having to dig through their memories to find a relevant answer.

{% callout %}
Shout out to [Ellipsus](https://ellipsus.com/) who uses the take-home assignment challenge this way. While they do acknowledge all the problems previously highlighted, they conduct a very healthy and engaging technical interview based on the coding exercise.
{% endcallout %}

## What are the alternatives?

### Live-coding sessions

If you are adamant about having the candidate actually type code, you do that as part of a live-coding session. You have them set up a small development environment prior to the interview to save time. Then when the call starts, you share a Figma link, a spec document, what have you, and you ask them to code it live and talk through their thought process.

On the bright side, you get to see them code, as well as explain the way they approach a problem. It’s almost like pair-programming or rubber-ducking, and not awfully remote from what the day-to-day may be like. 

On the other hand, this can be quite stressful and some people — especially at lower seniority levels — may be uncomfortable being observed, and underperform as a result. So it’s not perfect, but at least it solves the time constraint problem.

<div class="PnC">
<div>

#### Pros
- Grants visibility on the code
- Highlights communication skills
- Isn’t too time-consuming
- Needs no follow-up work from interviewers

</div>

<div>

#### Cons
- Can be stressful
- Is ultimately a time-crunch
- Feels bad on blockers

</div></div>

{% callout %}
Shoutout to [Duna](https://duna.com/) who runs very healthy live-coding assessments, with minimal overhead and low stress. Definitely up there in terms of hiring culture.
{% endcallout %}

### Technical conversations

For the last few years I’ve used longer in-person (or remote) technical interviews where we discuss software engineering in a non-tricky, conversational way. We spend between one and two hours going through a lot of topics: stack, accessibility, performance, security, agile, teamwork, and so on.

By increasing time spent with the candidate, we also get to see how they communicate, how they interact, how they approach questions they don’t necessarily have an answer to, and generally what it will feel like working with them every day.

Note that this is not infallible. For instance, some people make a tremendous impression despite being rather mediocre. On the other hand, some very talented engineers do not interview very well because it’s ultimately a skill to practice.

<div class="PnC">
<div>

#### Pros
- Is rather low stress
- Highlights communication skills
- Builds early social connections
- Needs no follow-up work from interviewers

</div>

<div>

#### Cons
- Risks yielding false-positives
- Over-indexes communication skills
- Is hard to fact-check on the spot

</div></div>

### Technical showcases

Another (non-exclusive) approach is to ask the candidate to showcase something they have worked on and are proud of. It can be anything: some code, a blog post, open source, a conference talk, a project, a case study… This way we put them at ease by letting them show something they know. It’s more informative than a synthetic puzzle and less stressful.

I interviewed at Sanity many years ago and got to pick one of my personal projects, and talk to them about it for like half an hour or so. After that, there was a more in-depth dive into the accessibility of a particular UI component. Even though I ended up declining the offer, it was an enjoyable interview. :)

<div class="PnC">
<div>

#### Pros
- Is low stress
- Highlights communication skills
- Builds early social connections
- Needs no follow-up work from interviewers

</div>

<div>

#### Cons
- Requires a public and presentable project (sometimes hard)
- Works best on a meaningful and complex system

</div></div>

### Code reviews

Some companies have traded coding exercises for code reviews: the candidate and the interviewer go through a standardized pull request together. That highlights technical knowledge, communication skills, attention to detail, and sparks interesting conversations. I’ve written about this approach before in *[Trading whiteboards for code reviews](/2017/02/27/trading-whiteboards-for-code-reviews/)*.

<div class="PnC">
<div>

#### Pros
- Is rather low stress
- Highlights communication skills
- Highlights attention to detail

</div>

<div>

#### Cons
- Requires meaningful demo pull-request
- Works best for more senior profiles

</div></div>

## Wrapping up

It’s 2026, machines have taken to writing more of the code, and yet we still interview like it’s 2003. As AI is overtaking the mechanical part of software development, now more than ever we need to assess communication, collaboration, and the often misnomed “soft” skills.

If you’re a hiring manager with a say in the interview process, consider restructuring it and dropping the take-home test. You can always try it for a few months and see how it goes. I’m confident it will be better for both candidates and hiring teams down the line.