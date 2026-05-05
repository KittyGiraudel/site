---
title: You Cannot Spell “Pain” Without AI
description: A short heartfelt rant about the current state of AI in our industry.
tags:
  - AI
  - Retrospective
edits:
  - date: 2026/04/29
    md: A mere *hours* after I published this post, an AI news website scrapped my content and republished some AI-generated summary with zero added value. You can’t make this up.
---

This article started as some kind of brain dump. I kept having minor frustrations about the use of AI in our industry, so I started scribbling them down. I touch on a lot of different angles: the use of AI on social platforms, the needless reinventing of the wheel, focusing on the wrong outcomes, and the open web.

The major <abbr title="Too Long; Didn’t Read">TL;DR</abbr> is that AI can be useful, but it’s not without consequences, and forced and performative adoption is harmful.

## Where we are

{% assign ai_coding_history_ref = "David Kravets has written <a href='https://www.coderabbit.ai/blog/a-very-brief-history-of-ai-coding-from-copilot-to-next-gen-agents'>a brief yet comprehensive history of AI coding</a> for the CodeRabbit blog." %}

<abbr title="Artificial Intelligence">AI</abbr> is everywhere. It feels like it goes without saying, but it’s surprisingly new. It’s only late 2025 that coding models like Opus 4.5 and GPT-5.2 became genuine game-changers. And although {% footnoteref "ai-coding-history" ai_coding_history_ref %}ChatGPT has been around since 2022{% endfootnoteref %}, I feel like it’s only in 2024 that it became ubiquitous. 

When I joined Scilife back in October 2024, it wasn’t really much of a thing in our company. Documents and reports were written by humans, research and analysis were done on Google, and code was authored by engineers. We weren’t “orchestrating agents”, and it would have been ridiculous to suggest it. 

So although it feels very normal that AI is shoved down our throat absolutely everywhere and all the time, it is actually a rather recent phenomenon in the grand scheme of things.

And look, I’m not anti-AI. I’m not *bullish* on it, but I’m certainly not opposed to it:

- I’ve fully embraced AI-assisted software development,
- I use [Mistral](https://mistral.ai/) on a daily basis for mundane tasks and research,
- I have Cursor or Claude review my articles before publication,
- I’ve [played with MidJourney on a side project](/2026/04/09/an-interactive-cover-component/),
- I keep an eye on AI-related news in other fields to better understand the world we live in.

And yet, probably from reading so much about AI constantly, I am a little irritated.

## Not-so-social networks

{% assign genuineness_ref = "Oh wow, that is a <em>weird</em> word." %}

For ~~good or for~~ bad, I spend a lot of time on LinkedIn as [I am looking for a job](https://www.linkedin.com/posts/kitty-giraudel_dear-network-im-still-looking-for-my-next-activity-7451986756494663680-6Br8). And it’s quite shocking how terrible that platform is. 

- Vocal posters are ridiculously performative. There is not an ounce of {% footnoteref "genuineness" genuineness_ref %}genuineness{% endfootnoteref %}, and a reason why is because AI is increasingly writing more and more of the content we consume. People have opinions, things to say, products to sell. And yet are too lazy, or bothered, or frustrated to deal with formulating their thoughts themselves, so end up outsourcing that to a machine.
- This is not just for posts and influencers either. AI also shows up in replies and comments, which is just so bizarre to me. Having something to broadcast to the world and letting a machine write the “perfect” pitch for you is one thing. But having your AI agent going on people’s posts and replying on your behalf is another. What’s the value? And for whom?
- As a result, the network is less and less social, as more and more of the interactions are automated, scripted, event-driven. Bots communicating with one another, with the occasional human coordinating the mildly inconvenient steps in between — until this gets automated too.

And it’s not limited to LinkedIn. I’m sure other platforms are the same. Twitter has turned to crap since its acquisition, Facebook has been spiraling for decades and TikTok is getting less and less usable by the day. It’s not all because of AI though. It’s a mix of late stage capitalism pushing the bottom line at all costs, rage-baiting creating engagement, and attention being monetized above everything else. A perfect cocktail of mud.

## Just because we can …

Social scenes predominantly showcase bold claims about AI, supposedly killing an entire profession or industry, or making whatever tool, process or product suddenly obsolete. And that’s primarily because AI made building software incredibly convenient.

{% assign approachability_ref = "In my first draft, I used the word “accessibility”, because I think it’s accurate: it gives people “access” to building software. But considering I talk a lot about digital accessibility on this website, I found it better to pick another word to avoid any confusion." %}

This is both the thing I love the most about AI in our industry and also what bothers or scares me the most: its {% footnoteref "approachability" approachability_ref %}approachability{% endfootnoteref %}. Everyone gets to build things, because the barrier of entry to start building has been lowered to practically zero.

I love AI for that. I’ve always despised gate-keeping. I want people to have access and opportunities. I want people to be able to build software, for fun, for profit or to solve problems. This is aligned with the fundamental principles of the web: that it’s for everyone. And in a way, AI coding assistance is the ultimate crystallization of this: everyone can build for the web (more on [the bad side of that later](#crippling-of-the-open-web)). 

{% assign usefulness_ref = "I do not mean to imply that every software should have a purpose. I am all for useless software that’s just there for entertainment or goofing around. I have a problem with software that wants to be useful, but actually solves nothing. It just creates noise and risks." %}

On the other hand, because building things is now cheap and easy and requires significantly less skill than before, we are getting absolutely flooded with software. And most of it is not only very mediocre but also completely {% footnoteref "usefulness" usefulness_ref %}useless{% endfootnoteref %}. People now build and push out things just because they can, not because it actually benefits anyone.

{% assign popular_apps_ref = "It certainly can happen! There is the occasional niche app coming out of left field that genuinely solves something and gain popularity, but it’s incredibly rare." %}

Solo devs and SaaS subreddits are swarmed with people launching their SaaS only to realize they can’t get users (exhibits [A](https://www.reddit.com/r/buildinpublic/comments/1swwrsv/how_did_you_get_your_first_real_users_not_traffic/), [B](https://www.reddit.com/r/TheFounders/comments/1swdkkj/is_my_posture_sabotaging_me/), [C](https://www.reddit.com/r/micro_saas/comments/1sxz8j8/i_am_lost_with_marketing/), [D](https://www.reddit.com/r/SaaS/comments/1sxp93e/launched_a_handwriting_transcription_app_last/) and the list goes on). It’s unfortunate, but it’s not a surprise. If anyone has the ability to build anything, that also means that professionals have had the opportunity to build that same product for years. There is no reason for their vibe-coded calorie tracker, fitness workout, or AI calendar to {% footnoteref "popular-apps" popular_apps_ref %}suddenly make waves and gain traction{% endfootnoteref %}. 

Just because we can build anything and everything doesn’t mean that anything and everything is worth building. And if it is worth building as an individual, it also doesn’t mean it has a broader audience. 

### On solving solved problems

I’ve read a lot of takes from indie founders and large corporations alike who decided to replace their SaaS subscriptions with in-house vibe-coded solutions, either to reduce costs or take ownership of their software stack. 

For instance, [Klarna decided to rebuild some internal tools (like Salesforce or Workday) with AI](https://www.inc.com/sam-blum/klarna-plans-to-shut-down-saas-providers-and-replace-them-with-ai.html). Mind you, it is valued at $15B, so it is beyond me why it decided it was worth investing time and effort into rebuilding solved software, thus solving nothing new in the process. Whatever invoice is removed from the balance sheet is paid 10-fold in manpower and wasted opportunities. In the end, [they just switched to other SaaS providers](https://www.cxtoday.com/crm/klarna-didnt-replace-salesforce-it-replaced-them-with-alternative-saas-apps/).

That $5,000 Slack invoice the indie founder gets rid of by “rebuilding Slack in a weekend” is not vanishing out of thin air: it’s flattened across the whole year (and beyond), in maintenance, accumulating technical debt, distractions, lack of focus, and a potentially very serious and very costly data security breach. It’s not worth it.

{% callout %}
I think the most ironic thing is that some of the very same people will brag about how much money they spend on tokens. Either you optimize your costs, or you don’t. But nuking your SaaS invoices only to spend 10 times as much in fictional currency is not exactly a masterful gambit in my opinion.
{% endcallout %}

## AI as a metric

The other problem of AI in the corporate world, is that it ends up optimizing for itself. Picture this: 

- Postulate: AI is getting better by the month.
- Some people find creative ways to become more productive using AI.
- Executive teams therefore mandate the use of AI to gain productivity.
- Teams report their adoption metrics.
- Managers and investors are happy jumping on this bandwagon.
- People now optimize for AI adoption and usage, not problem solving.

When you start having adoption metrics, AI-utilization coverage and token-consumption dashboards, you’re not actually improving your productivity. You’re shifting your focus on what and how many tools you use, whether you’re actually deliver anything valuable.

[The AI Great Lead Forward](https://leehanchung.github.io/blogs/2026/04/05/the-ai-great-leap-forward/), by Han Lee, is such a brilliant read and covers this topic more in depth. I wish I could be so eloquent.

> Your AI usage is now a KPI. You are being evaluated on how much grain you reported, not how much grain you grew. This is Goodhart’s Law at organizational scale: when a measure becomes a target, it ceases to be a good measure. The metric was supposed to track whether AI is making the company better. Instead, the entire company is now optimizing to make the metric look better. The beatings will continue until adoption improves.  
> — Han Lee, in [The AI Great Lead Forward](https://leehanchung.github.io/blogs/2026/04/05/the-ai-great-leap-forward/)

## The death of writing

I’d like to leave the corporate world aside for just a minute, and reflect on something more personal.

I’ve always loved writing. Since I’m a teenager. It’s been an outlet to push through difficult times, a hobby to fill my nights and weekends, a breadwinner as a professional writer. Ask people who worked with me, they’ll tell you I’m anal about documentation. For instance, it was [a whole thing at N26](https://kittygiraudel.com/2020/01/23/technical-documentation-for-everyone/).

And while I’ve never really gotten into enjoying fiction, I’ve always enjoyed reading pieces. Opinions. Articles. Walkthroughs. It’s why I’m still a sucker for personal blogs, where people share their personal thoughts. Not through Claude or ChatGPT, but with their own words. Writing as a medium feels like it’s inevitably shifting into a commodity for AI to deal with.

Recently, Dave Rupert posted *[I don’t want a screenshot of your Claude conversation](https://daverupert.com/2026/04/claude-no/)*, which really resonated with me. In an ideal world, the only AI-generated content I want to consume is the one I request myself. I’m not interested in what Claude has to say when I’m trying to interact with a human being, otherwise I’d be prompting Claude directly.

It sure seems like writing as a medium is fading, as more people turn to LLMs at the first opportunity, throwing genuineness and authenticity out of the window in the process.

{% assign onboarding_ref = "Even with stellar onboarding documentation, you should still sit with new-joiners (even virtually). Removing the social aspect of professional interactions, especially the early ones, is the best way to demotivate employees and lose them rapidly." %}

The most recent example of that I’ve come across was someone having apparently “solved onboarding” because they had Claude generate an `ONBOARDING.md` document instead of {% footnoteref "onboarding" onboarding_ref %}having to sit with new employees{% endfootnoteref %}. Here is the thing: you should have had that document pre-LLM era already. This isn’t new, or groundbreaking, or some AI-possible breakthrough. This is onboarding-101, and claiming it’s made possible by AI is appalling.

### Crippling of the open web

Zooming out from my own experience, AI (mostly in the form of LLMs) is ultimately a threat to the open web. Everything is getting commoditized, adjusted and optimized for machines to consume web content, and for machines to produce web content. So much so that what makes the web open in the first place — us humans — are slowly being removed from the equation altogether.

Don’t take my word for it either:

- Anil Dash wrote *[Endgame for the open web](https://www.anildash.com/2026/03/27/endgame-open-web/)*, a masterpiece on the topic (also *[What Would “Good” AI look like?](https://www.anildash.com/2025/05/01/what-would-good-ai-look-like/)* is worth a read).
- Julien Genestoux [published a similar piece](https://ouvre-boite.com/the-open-web-isnt-dying-were-killing-it/), while insisting it’s more of a capitalistic problem than an AI one.
- Hidde de Vries is [pushing the topic at the W3C](https://hidde.blog/web-ai-breakout/).

What scares me is that I don’t think there is a good way to backtrack on this. The cat is out of the bag, the die has been cast. *<span lang="la">Alea iacta est</span>*. We cannot go back to a world without AI, without LLMs. The new way of producing and consuming the web is here to stay, for better or for worse, and we just have to cope with it.

## Closing thoughts

The status quo is a little bleak and it’s difficult not to feel demotivated at times. Things are moving at an exhaustingly fast rate, and there is so much constant noise that it’s difficult to extract what’s genuinely meaningful in the midst of the performance and slop.

I think being able to recognize the [tremendous value of AI across so many domains and industries](https://today.ucsd.edu/story/nine-breakthroughs-made-possible-by-ai), *while* being able to acknowledge it is [profoundly damaging in many other ways](https://www.ibm.com/think/insights/10-ai-dangers-and-risks-and-how-to-manage-them), is important.

~~*This article was written by AI.*~~ Psyche! Could you imagine?  (:
