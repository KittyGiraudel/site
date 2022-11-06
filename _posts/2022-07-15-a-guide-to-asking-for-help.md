---
title: 'Help me help you: a guide to asking for help'
---

Over the last few months, I have spent a considerable amount of time on the [Sanity community Slack](https://slack.sanity.io/) attempting to support people with their problems and questions. I have had the pleasure to chat with almost everyone from the Sanity team, and will most likely take part in their upcoming ambassador program. Long story short: I like [Sanity](https://sanity.io), and try to be a helpful community member.

I’m going to use this blog post to dump a bunch of advice on how to best get support, because one thing became apparent after going through literally hundreds and hundreds of requests: a lot of people have no clue how to ask for help efficiently. So let’s go through some basics, shall we?

- [Search first, ask second](#search-first-ask-second)
- [Be polite](#be-polite)
- [Be explicit](#be-explicit)
- [Be patient](#be-patient)
- [Slack specifics](#slack-specifics)
- [Wrapping up](#wrapping-up)

## Search first, ask second

The fastest support request is the one that doesn’t happen. Before jumping onto GitHub, Slack, Stack Overflow or whatnot, spend some time researching your problem. Give it a few Google searches. Browse through relevant GitHub issues, or even the code itself. Look around for something similar. Chances are that someone had a similar situation already, which has been addressed.

## Be polite

It kind of goes without saying, but you’d be surprised at how many people don’t even bother acknowledging that whoever will answer is a human being with their own day and their own stuff going on.

So you know, **start your message by saying hi** or something. Similarly, maybe **thank people who take time to support you**. Even if it is their job and they’re paid to do so. When you order food at a restaurant, you do thank the waiting staff (I hope). I don’t see why it should be any different online: if someone helps you or answers your question, say thanks? Seems so simple.

{% info %}Speaking of saying hi, maybe consider an alternative to "hi guys”, as not everyone identifies as a guy, especially at Sanity where the support team is quite gender-diverse. I’m not going to make a big deal of using “guys” generically, but please understand that even though intended as such, [it is not a gender-neutral term](https://heyguys.cc/). Alternatives: “everone”, “folks”, “friends” or just nothing.{% endinfo %}

## Be explicit

This has to be the main bottleneck for people not getting the help they need: lack of information or clarity. Too often, we see messages like:

> suddenly this morning i started to have this error in the sanity studio  
> Invalidreference filter, please check the custom "filter" option

This is a little thin. What are we talking about here? Where do you use the filter option in your schema? Can you share some code for that document type? What version of Sanity are you using, and have you done an update maybe?

Or:

> I want to load stripe prices in the studio but getting `Module parse failed Unexpected token You may need an appropriate loader to handle this file type`  
> Is there a way to fix this?

What does “loading stripe prices” mean? Connecting with a Stripe account? How? Are you following a tutorial of some sort? What have you tried so far? What are you attempting to build once connected with Stripe? Where does this error happen?

Or:

> Unable to sign-in

Okay. Sign in where? Do you have more information? What have you tried? Are you trying to log in with email and password or an auth provider? What changed?

Or:

> Hi, I'm New here, I'm having issues running Sanity init, keeps showing me errors.

What errors? Can you share a screenshot or at the very least the text message of the error you’re facing? Pretty hard to debug otherwise.

Or:

> Hi, How can I add a variant to the schema product section with next.js? like color and sıze

Sanity is an unopinionated content platform. The concepts of products, sections or variants do not exist in Sanity. They only exist in _your_ project because that’s what you’re building. So without significantly more information about your system, there is no way to help.

---

One way or another, these requests all lack critical information. Either about what is expected, or about what is happening, or more generally about the overall context of the situation.

A good way to ask for help is to follow this pattern: **Goal → Context → Problem**.

1. First, explain what you are trying to achieve: rendering an image, migrating data, updating a field, and so on.
2. Then, give some context about the situation: which framework are you using? Which version of Sanity? In which environment does the problem happen?
3. Finally, describe the problem in detail: What have you tried? Is there an error? What does it say? Maybe attach a screenshot, that can be helpful.

On a similar note, Julia Evans recently shared [this zine on Twitter](https://twitter.com/b0rk/status/1546875361002135554?s=20&t=yPe-eh-s2AKB91cQVTAyBQ) where she explains how she approaches debugging. She writes a message asking for help (akin to [rubber-ducking](https://en.wikipedia.org/wiki/Rubber_duck_debugging)):

{% capture alt_text %}strategy: write a message asking for help. When I’m REALLY stuck, I’ll write an email to a friend: “Here’s what I'm trying to do…; I did X and I expected Y to happen, but instead…; Could this be because…; This seems impossible because…; I've tried A, B, and C to fix it, but…” This helps me organize my thoughts, and often by the time I finish writing, I’ve magically fixed the problem on my own! {% endcapture %}

![{{ alt_text }}](https://pbs.twimg.com/media/FXea6nRX0AAFOex?format=jpg)

## Be patient

Getting support online—be it via Stack Overflow, GitHub or Slack—can take time. Everyone has their own day and communication is very much asynchronous (yes, even on Slack). You’re not more important than anyone else, so be patient. Namely:

- Do not post your message multiple times. It might feel like you have more chance of being seen, but it also comes out as needy and a little spammy.
- Do not expect everyone to jump on to help you just because you’re on a tight deadline. I’ve seen numerous people crying for help because of some urgency on their side, but that’s not how community support works. One’s lack of planning or urgency does not constitude anyone else’s emergency. 😅
- Do not ping people individually. It’s pretty uncommon, but I’ve seen it happen (and have been pinged as well). I get it might feel like a good way to get someone’s attention and support, but it feels a little awkward to me. Community members spend some of their time helping others, but it’s very much a proactive involvement. Similarly, support engineers have their day of tasks and projects ahead of them—they’re not sitting waiting to be pinged.

Long story short, just be patient. You might get an answer within the hour, or in a day or two. The best thing you can do to speed up the resolution time is to make your request airtight: be kind, give all the information you have in a digestible form, and hope for someone to pick it up soon.

In the meantime, take a break. Have a coffee. Take a nap. Walk the dog. Pet the cat. Have a cheese toastie. 🥪

## Slack specifics

A few more things, maybe a bit specific to Slack, but still worth keeping in mind when asking for support.

### Channels

Picking the right channel is a great way to increase your chances of getting help. For instance, there is a #groq channel frequented by developers with a lot of love and expertise with the GROQ language. There is a #nextjs channel for problems that are specific to integrating Sanity with Next.js. Better using them when possible than just #help, which is a bit of a brawl at times.

### Threads

The Sanity Slack has over 25,000 members and some channels (especially #help) are pretty active. Without threads, it would be a total mess. So try to explain your situation in one message so that people can use a single thread to discuss with you. This way there is an easy-to-follow conversation for anyone chiming in (or finding the thread).

### Code

Posting code is a good way to provide additional information about your problem. When sharing code snippets, be sure to format them as such (using the Slack editor or triple backtick fences) so it’s easier to read.

If you need to share _a lot_ of code though, consider that a link to a GitHub repository or a CodeSandbox might be better than hundreds of lines over Slack! ;)

### Emojis

Once you’ve solved your problem (either alone or thanks to contributors), mark your thread with a checkbox emoji. This is super useful for Sanity support engineers or members like me to skim through channels looking for threads that haven’t been solved yet.

## Wrapping up

It’s not overly difficult at the end of the day: be kind and provide relevant information so people have a good overview of the context. Then be patient until someone picks it up. 😊

A good way to remember it: **PEP** (as in pep talk)! It stands for “Polite, Explicit and Patient.” 😉
