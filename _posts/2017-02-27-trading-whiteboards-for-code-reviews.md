---
title: Trading whiteboards for code reviews
keywords:
  - interview
  - thought
  - code review
---

Yesterday night, hundreds of developers, engineers, tech leads and more generally IT workers have [shared on Twitter](https://twitter.com/i/moments/835942450103451649) their inability to perform some simple tasks without help despite being entirely qualified and doing a respectful job. It is a great thread of comically funny short stories that I highly recommend you to read. All this to protest against whiteboard interviews.

“Whiteboard interview” is a term describing the practice of asking a candidate to perform a coding exercise on a whiteboard (hence the name) to judge their technical skills. The usual example is to ask an applying engineer to revert a binary tree using nothing but a pen.

While it may sound stupid, whiteboard interviews are actually quite popular including in very large corporations, and sometimes referred to as a good way to judge the technical ability for a candidate to fulfill a position.

Well, this is fucking bullshit.

## What’s wrong with whiteboard interviews?

Short answer: it has little to no connection to the real world and what the candidate will actually do in their job would they be hired.

Now for the long answer. I understand the idea behind the whiteboard exercise: testing the ability for a candidate to solve a problem without focusing too much on the code itself. On paper, that makes sense. In practice, it’s quite irrelevant. As the aforementioned Twitter thread shows, no developer —no matter the experience— is able to function fully without a little help from StackOverflow once in a while. Nor should they.

Secondly, it puts a hell lot of pressure on the candidate. Not all of them can handle that. Hell, I’d be terrible. You know how you hate when someone stands behind your shoulder when you’re working? Well, guess what, it’s the same fucking thing. Nobody likes that. Ever heard of impostor syndrom? Nothing like someone silently judging every move to trigger that. I know some fantastic developers who would be petrified in such a session. They would be fully adequate to do the job though, and they would friggin’ nail it.

I hear some people say “yes, but you can judge resilience to pressure”. Fuck. That. Putting pressure on employees is not a safe space and a good way to improve productivity. How about giving them the right mindset and environment so they feel empowered and willing to commit to their work?

Also, it usually puts the focus on the wrong point. Don’t ask someone to demonstrate algorithmic understanding on a whiteboard if they are going to be implementing REST APIs or CSS layers for the next two years. At least try to ask something related to what they will actually do. At the very least.

Anyway, this is not an article about why I think whiteboard interviews are a bad idea. [Some people did that better than I would](https://modelviewculture.com/pieces/technical-interviews-are-bullshit). I actually wanted to share an idea to improve the situation (hopefully): **replacing the whiteboard challenge with a code review**. It’s not a new idea, but it seems so uncommon compared to code challenges that I thought it might be worth a few lines.

## What’s good with code reviews?

I have been thinking about this quite a lot, and I found many benefits to conducting a code review in place of a technical challenge, so bare with me for a long list.

**It’s an encouraging setup.** Reviewing code is much less stressful than writing code. Both the candidate and the interviewer can sit side-by-side to do it. It is basically going to be a discussion, slowly going through the code and commenting things that pop out, maybe even making suggestions. The risk of a candidate under-performing due to pressure is much lower. Therefore the outcome is more likely to be representative. This is pairing to improve code, not fighting to prove who’s smarter.

**It’s real-world work.** Unlike coding on paper or a whiteboard, reviewing code is something one is actually likely to do on daily basis. Be it through the GitHub interface or by sitting with someone during a pair-programming session. This is a direct glimpse into how the candidate will approach this exercise, which is what they will do once hired.

**Perfect to judge technical skills.** There is no need to see someone code to judge their ability to write code. If you can trust someone’s technical knowledge from a Twitter timeline, you can definitely do that by watching them comment code. By skimming through a pull-request, a candidate can definitely show they know their thing (or not). Did not spot the obvious mistakes from the PR? Well, that’s worrying. Actually found a bug that silently sneaked in? Pretty impressive.

**Excellent to get the full picture.** Provided the pull-request is not too narrowed down, reviewing code can tell a lot about the candidate’s attention to detail and general knowledge about the stack the company works with. In the case of a frontend developer for instance, a complete feature PR could involve HTML, CSS, JavaScript, accessibility, performance, design, documentation, security, etc. A good way to see if the candidate is curious about other topics or very much focused on a specific technology.

**Focused on empathy.** Code review is not exclusively about code. It is also about empathy. It’s about phrasing comments in a positive, non-blaming way. It’s about focusing on the things that matter, and not necessarily nitpicking on details. It’s about sharing positive comments as well, and showing appreciation. For instance, I used to perform code reviews the way a code linter throws errors. I learnt to be more tactful.

**Tells about the company.** Bringing code review and knowledge sharing in the interview tells a lot about the mindset of the company. It shows code review is a thing (hint: it’s not the case everywhere), and that people actually work as a team by helping each others. It might also introduce the tech stack, the standards in place, the conventions, etc; it basically gives a good glimpse at the way code is written in the company which is definitely something the candidate is interested in.

## Crafting the perfect pull-request

Now it’s always the same: the content still matters. You can’t ask any candidate to review any kind of code. I think the best would be to create a pull-request specifically for that.

If hiring a senior JavaScript engineer to build an engine, you don’t want them to review CSS code, but you definitely want to test their knowledge about performance and their attention to documentation and testing. Similarly, if hiring a frontend designer, you want to make sure they know a good deal of valid, accessible HTML/CSS and have an eye for design.

Here are a few topics you could involve when hiring a frontend position:

* HTML
* CSS
* JavaScript
* Design
* Accessibility
* Performance
* Documentation
* Testing
* Tooling
* Security

For a more general approach, I recommend creating a pull-request that covers an entire feature, for instance the implementation of a UI component (for instance a dropdown, a slider, a media object…).

Now there are several ways to tackle this. Either you create this pull-request the way you would write and submit it for review. Or you make it contain some errors to see if the candidate would notice them.

If you go this way, you might want to include some admittedly big issues: invalid HTML, unsupported CSS with no fallback, JavaScript bug, accessibility mistake, XSS vulnerability, poorly performing code… Then you could introduce some smaller issues, like typos in documentation, lack of comment on something obscure, duplicated code, non-tested edge-case, inconsistent naming convention, etc.

If you want to test git knowledge, work on your commits. Craft a commit that leave the branch in an unstable state, one that do several things at once, one that does not respect the wording convention, and so on.

Don’t forget to add a bit of description to the pull-request like a developer would normally do. It should give the context: what does this do, why, and how.

## How to conduct the interview

If you receive the candidate, I’d suggest sitting side-by-side to go through the pull-request together. Just ask the candidate to comment what they spot. There is no right or wrong answer per se, it’s just a matter of seeing how they approach this exercise. Try to get the big picture.

* Did they take the code review seriously or did they just skimmed quickly through the code?
* Did they find anything you wanted them to spot?
* Did they present a particular attention to detail?
* Did they ask questions about the code and/or the context?
* Did they only go through the code or did they also read the PR title, description and commit messages?

If you perform the interview remotely, their might not be a need to do this exercise live. If the candidate has access to the repository, they can submit their review and the whole process can be done asynchronously. It’s up to you, but I would recommend doing this face-to-face or during a call, if only to make the whole thing a bit more human.

## Wrapping up

I have never had the chance to conduct an interview like this so far. I am convinced it is more relevant than whiteboard or code challenges most of the time. I shared this thought on Twitter and some people told me they have been doing this successfully for a while.

A good open-source project would be to create a solid pull-request to conduct code review interviews and put it on GitHub, at least to give an idea on how it could look like.

Anyway, I hope I convinced you as well! If you ever try this, either as a candidate or an interviewer, please tell me how it was. I’m very interested.
