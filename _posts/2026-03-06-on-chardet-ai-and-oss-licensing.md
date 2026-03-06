---
title: On chardet, AI and OSS licensing
description: A summary of the licensing situation unfolding at chardet, its ties with AI and its ramifications for open-source.
tags:
  - AI
  - Open Source
---

There is a concerning controversy happening in the [chardet](https://github.com/chardet/chardet) open-source library, which I believe people should be aware of.

It concerns software licensing, the use of AI in the making of software, as well as general ethical and etiquette considerations when contributing to open source work. I tried my best to summarize the situation in this article. 

{% info %}
**Disclaimer:** This article touches on legal topics, and I am **not** a lawyer or an expert on copyright law. I do my best to understand and explain legal concepts in this blog post, but at the end of the day, this is not my area of expertise. Please kindly point out any issue in the comments.
{% endinfo %}

## Overview

`chardet` is a widely used Python library for character encoding detection. It was originally created by [Mark Pilgrim](https://github.com/a2mark) and released under the <abbr title="Lesser General Public License 2.1">LGPL 2.1</abbr> license. Eventually, Mark delegated the maintenance of the library to other people, most notably to [Dan Blanchard](https://github.com/dan-blanchard).

On March 4th, Dan released [version 7.0.0](https://github.com/chardet/chardet/releases/tag/7.0.0), an alleged complete rewrite of chardet from the ground up, and updated the license to MIT.

The change of license is at the heart of the controversy, something that [Mark Pilgrim kindly pointed out](https://github.com/chardet/chardet/issues/327) and asked to revert. Quoting from his original message:

> […] it has been brought to my attention that, in the release 7.0.0, the maintainers claim to have the right to “relicense” the project. They have no such right; doing so is an explicit violation of the LGPL. Licensed code, when modified, must be released under the same LGPL license. Their claim that it is a "complete rewrite" is irrelevant, since they had ample exposure to the originally licensed code (i.e. this is not a "clean room" implementation). Adding a fancy code generator into the mix does not somehow grant them any additional rights.

## Understanding licenses

To understand the problem, we need to understand the two licenses. Again, this is a complicated legal topic, so here is my best shot at explaining the differences between both with the help of Mistral and the amazing [TL;DR Legal](https://www.tldrlegal.com) website.

### MIT

You are probably familiar with the MIT License, one of the most permissive open-source licenses. It allows anyone to use, modify, and distribute the code (even in proprietary software) with almost no restrictions. The only requirement is to include the original copyright notice and license text. There’s no obligation to share your modifications or source code, making it ideal for projects that want maximum adoption and flexibility.

> A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source. There are many variations of this license in use.  
> — [MIT on TL;DR Legal](https://www.tldrlegal.com/license/mit-license)

### LGPL v2.1

The LGPL v2.1 (Lesser General Public License) is less common in the open-source world. It is what’s called a “weak copyleft” license. It allows you to use the library in proprietary software, but with important restrictions: if you modify the library itself, you must release those changes under the LGPL as well. This license is designed to ensure that improvements to the library remain open, while still allowing proprietary software to use it.

> This license mainly applies to libraries. You may copy, distribute and modify the software provided that you state modifications and license them under LGPL-2.1. Anything statically linked to the library can only be redistributed under LGPL, but applications that use the library don't have to be. You must allow reverse engineering of your application as necessary to debug and relink the library.  
> — [LGPL 2.1 on TL;DR Legal](https://www.tldrlegal.com/license/gnu-lesser-general-public-license-v2-1-lgpl-2-1)

### Main differences

The main practical difference is *freedom* versus *reciprocity*. MIT gives total freedom to do whatever you want with the code, while LGPL ensures that any improvements to the library itself stay open-source, something the MIT license does not enforce. LGPL is more common in libraries where authors want improvements to stay open; MIT is popular in commercial ecosystems that value minimal friction.

This is why the chardet license change from LGPL to MIT is controversial: it removes the reciprocity requirement, making the library more attractive for commercial use but potentially undermining the original intent of keeping improvements open.

## Changing the license

There are a lot of things to discuss, and one important point is whether the change of license was allowed in the first place. Can you just go from a copyleft to a permissive one? If yes, what is the point of the non-permissive license to start with?

Mark, the original author, argues that maintainers do not have the right to relicense the project. He’s very explicit about this. And by all accounts, it seems he’s right: the LGPL license clearly requires that derivative works (or modifications) remain under the LGPL license. 

On the other hand, Dan, the main maintainer and rewriter, claims that this version is a “ground-up […] rewrite” — the term {% footnoteref "clean-room" "To put it simply (and to the extent I understand it), the concept of “clean room” is when someone authors software based on specifications without access to an existing implementation or proprietary materials. It’s a way to reimplement something while avoiding legal issues." %}“clean room”{% endfootnoteref %} pops up a lot in the long GitHub issue. And because it’s supposedly a clean room rewrite, the license can be freely changed since it’s ultimately a different software.

## Was it *clean room*

Again, this is not exactly a straightforward answer. But the more you look at it, the more it sure seems like it was *not*. Ultimately, only a court (or at least qualified legal analysis) can decide this, but based on the facts available, the clean-room claim looks very weak.

### The “sure was” side

Let’s start with the argument that suggests this is all legit, since they’re fewer (and weaker from my perspective, but that’s subjective). 

Some people, including Dan himself, point out to the fact that there is extremely low code similarity between version 7 and prior (about 1–2%), as an evidence that this is therefore a clean room implementation. Others argue that functional or structural similarity (even if the code *looks* different) could still make it a derivative work under copyright law.

### The “definitely not” side

Now, let’s look at why the whole clean room implementation angle doesn’t really hold when you start deconstructing the pieces a little.

For starters, Dan is a maintainer of chardet ([for 12+ years](https://github.com/chardet/chardet/releases/tag/2.2.0) at that), which means he has prime access and knowledge of the original software. Even if he decided *not* to use it to restart from scratch, he likely knows the code intimately. This undermines the clean room defense, as true clean room processes require the implementor to have no prior exposure to the original work.

Secondly, he used AI (Claude Anthropic) to generate the code, which is how he argues that the new version is based on a high-level description and not the original code, thus being a clean room implementation. {% footnoteref "ai-training" "<a href='https://github.com/chardet/chardet/issues/327#issuecomment-4004572121'>Aleksandr Petrosyan</a> points out that whether or not the AI was trained on the original code is irrelevant. It <em>cannot</em> be construed as fair use, because it uses the same name, uses the original code to design the new version, and claims copyright over a derivative work, which is dubious." %}AI may have been trained on the original chardet code{% endfootnoteref %}, which could mean the output is still a derivative work — where LGPL would apply. 

Moreover, the notion that the AI agent was only fed a *high-level description* without using the existing code is demonstrably false. [Claude’s own implementation plan](https://github.com/chardet/chardet/commit/925bccbc85d1b13292e7dc782254fd44cc1e7856#diff-704d0561e3e878b036836b56870212b2d8b7e4a813bf2805df868a1bf9e0094cR309-R314) which was committed to the repository directly references chardet’s version 6 intricacies:

> **Context:** The registry maps every supported encoding to its metadata.
> Era assignments MUST match chardet 6.0.0's [`chardet/metadata/charsets.py`](https://raw.githubusercontent.com/chardet/chardet/f0676c0d6a4263827924b78a62957547fca40052/chardet/metadata/charsets.py)
>
> Fetch that file and use it as the authoritative reference for which encodings belong to which era. Do not invent era assignments.

## On AI-written software

One interesting point that is raised in the midst of the conversation is about the ability to copyright AI output. I think laws are catching up with the matter, but from my understanding, AI output on its own is not copyrightable:

- In the United States, AI output is not copyrightable unless a human’s creative contribution is significant enough to make the work an original expression (see [U.S. Copyright Office AI Policy (2023)](https://www.copyright.gov/ai/ai_policy_guidance.pdf) and [U.S. Copyright Compendium, Section 313.2](https://www.copyright.gov/comp3/chap300/ch300-copyrightable-authorship.pdf)).
- In Europe, the EU’s AI Act and copyright directives are still evolving, but the general principle aligns with the US in that human authorship is required (see [EU Copyright Directive (2019)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0790) and [EU AI Act (2024)](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)).
- Some countries are experimenting with limited protections for AI-generated content, but these are exceptions, not the rule. Generally speaking, it needs to be a human work (see [German Copyright Act (English translation)](https://www.gesetze-im-internet.de/englisch_urhg/englisch_urhg.html#p0002) and [French Intellectual Property Code, Article L111-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278864/)).

If AI-generated code is not copyrightable, it cannot be licensed under MIT, LGPL, or any other license. This would place it in the public domain, but it also raises a paradox: if the AI was trained on LGPL-licensed code, the output might still be considered a derivative work, even if it’s not copyrightable. This is why this whole situation is muddy and complicated.

## Why should we care

Licensing is legal stuff, why do we even care? Well, you don’t have to care, but if you use open-source software in your work (and if you’re reading this, there is a good chance you do), I think you *should* care.

{% info %}
During my time at Scilife (medical compliance), we had to show to our customers under which license our software and all its dependencies were distributed. As a result, our reliance on dependencies published under non-permissive licenses such as GPL was challenging, and we had to revisit some technical decisions.
{% endinfo %}

At the end of the day, this is the story of the maintainer of a software deciding to relicense said software in a more permissive license, and justifying the decision under the guise of a complete rewrite, AI-assisted no less.

It is concerning, because if that flies, it sets a dangerous precedent. Found a cool library but it’s distributed under a non-permissive license? Ask Claude to rewrite it until the code looks different enough, and you’re good to go. This isn’t how licensing works (as far as I understand). 

As [Aditya Shankhar](https://github.com/chardet/chardet/issues/327#issuecomment-4003786038) puts it:

> I have to admit this sounds like an argument to why licensing is useless altogether due to an agent always being able to reconstruct a project on the basis it's inputs and outputs, which may be true, but I think this opens the pathway to many more questions about the point of licensing in the first place

This situation is a microcosm of larger issues in both open source and AI (and where they intersect). This raises some difficult questions: 
- Will this influence other OSS projects considering AI-assisted rewrites?
- Can this lead to more projects adopting contributor license agreements (CLA), or even some explicit relicensing policies?
- What role does AI transparency (such as disclosing training data) play in resolving these issues?

At a minimum, it’s a reminder to check the licenses of critical dependencies and stay alert to sudden relicensing moves.

## What’s next

It’s hard to say. At the moment, version 7.0.0 remains available under MIT, and all previous versions are available under LGPL. Dan Blanchard neither replied nor contributed to the GitHub issue where the debate unfolds.

[Madison Taylor](https://github.com/chardet/chardet/issues/331) from Nvidia suggests a few options to correct course:

> - Retract chardet v7.0.0 and do not use v7.x.x as tags going forward.
> - If you deem it prudent, at your own risk, release `aichardet` […] as a fork, allowing users downstream to choose among classic `chardet` under the original license, `PyYoshi/cchardet` (existing MPL project), or the new AI-written edition, as their risk profiles dictate.

This makes a lot of sense to me. A {% footnoteref "fork" "It does seem like a fork would have been a more appropriate move for that rewrite, especially given most people using the chardet library would most likely never notice a licensing change." %}fork{% endfootnoteref %} with a new name avoids the confusion and legal ambiguity of reusing the chardet name and versioning. It would allow users to choose between the original LGPL-licensed chardet and the new MIT-licensed rewrite, based on their needs and risk tolerance.

For now, we wait and see. I will update this article as the situation evolves (if it does).