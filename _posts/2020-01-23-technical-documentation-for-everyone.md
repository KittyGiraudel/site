---
title: Technical documentation for everyone
description: A reflection on the web documentation we built at N26
keywords:
  - documentation
  - N26
  - docs
---

I have [tweeted a few times about the web documentation](https://twitter.com/KittyGiraudel/status/1189941096559861760) we built at N26 and how I think this is one of the things we have truly nailed over the last few years. In this article, I would like to share my experience more in details, and give suggestions on how to write helpful documentation.

- [Documentation 101](#documentation-101)
- [Fighting obsolescence](#fighting-obsolescence)
- [Keeping it real](#keeping-it-real)
  - [Publishing documentation](#publishing-documentation)
  - [Promoting documentation](#promoting-documentation)
- [Wrapping up](#wrapping-up)

## Documentation 101

The purpose of technical documentation is to help people, of any level, perform the task at hand. It should serve as a knowledge base and a guide. It should explain how things work and how to do things in a given project.

Having said that, the first thing I personally feel strongly about when it comes to documentation is that **it is not a history document**. It should not tell the tale of how things were back in the days™, or how they will eventually maybe hypothetically be in a distant future. It should describe the current state of things only.

Similarly, technical documentation **is not a litterary essay** aiming as entertaining its readers with anecdotes and jokes. It should be straightforward and efficient. Contrary to a blog of some sort, documentation is not centered around its author but around its readers.

Speaking of the author, I believe it should be non-existent. The personal experience and viewpoint of the author is irrelevant to the purpose of technical documentation. I recommend using “we” or “you” all over, depending on whichever you prefer or is more suited to the content. Remember that the more consistent the better.

## Fighting obsolescence

The biggest problem of technical documentation — probably after the lack thereof — is keeping it up-to-date. You know how it goes: someone writes a handy guide for a feature of some sort. Then, months later, someone else changes the way the feature works, but completely forgets about the documentation. Then months later, someone finds the documentation to update the feature again, but it is completely obsolete and makes no sense whatsoever. And everybody’s sad.

N26, like many companies, uses the Atlassian tools suite, including Confluence for documentation. Most of the company’s documentation lives there so it can be searched, used and most importantly audited. That mostly matters for topics that are likely to be audited such as product, legal, compliance, data privacy, banking regulations, security and such.

Having said that, let me share my personal opinion: Confluence is absolute garbage when it comes to technical documentation. It is clumsy to write on Confluence. It is cumbersome to read on Confluence. It is slow, it is ugly, it is far away from the code… That’s why we (the web team) decided from day 1 not to use Confluence for our technical documentation.

We keep our documentation on GitHub, alongside the code. The web platform is stored in a single repository, which makes it even easier. We have a `docs` folder at the root level which contains all our documentation in Markdown format. A few benefits to that:

- Searches within the code editor brings up documentation hits as well. Even better, because `docs` comes before `src` alphabetically, documentation comes up first in search results.
- Documentation is treated just as code, which means it can be reviewed.
- Because documentation is commited, its history is preserved through git (or whatever SCM one uses).
- Markdown is a fantastic authoring **and** reading format, which is portable and convertible to HTML. Take it from someone who wrote two books, one in proprietary ODT templates, the other in Markdown: Markdown is goddamn bliss.

To make it even less likely to forget updating documentation, we also mention it in our GitHub pull-request template, so we have an extra reminder when submitting a pull-request for review.

![Documentation being mentioned in the pull-request template](/assets/images/technical-documentation-for-everyone/pull-request-template.png)

## Keeping it real

Documentation is only as useful as it is read. There is no point having the best docs in the world if nobody knows it exists. So it’s important not only to emphasise on the fact that documentation is a first-class citizen like code, but also to make it available to everyone.

### Publishing documentation

In order not to restrict access to GitHub users, we decided to build it with [Gitbook](https://github.com/GitbookIO/gitbook-cli) and publish it on a route of our testing servers. The nice thing about Gitbook is that it comes with a search engine, a soft design, a robust navigation system and some accessibility features out of the box.

Somewhere in our deployment pipeline, we run the following command:

```bash
npx --package gitbook-cli gitbook build . build/docs
```

And our Express server has the following route:

```js
if (!LIVE) {
  server.use('/docs', express.static('build/docs'))
}
```

And voilà, look at this beauty:

![N26 web platform documentation published with GitBook](/assets/images/technical-documentation-for-everyone/gitbook.jpeg)

### Promoting documentation

Once our documentation is up and running, it is important to actively promote it. Getting-started guides and related READMEs should mention and link to it. The documentation itself should be generous with links to other parts of itself, cross-referencing pages to encourage people to browse through it.

When answering someone’s question, it is a good idea to join a link to the relevant section of the documentation if it contains the answer or related content. And if it doesn’t, this is likely to be a good opportunity for an addition.

Similarly, I recommend openly announcing (in an organisation tech channel of some sort) when new pages are being added to the hub. This contributes to growing the influence of the documentation hub within the company.

## Wrapping up

So if I had to sum up, here is a <abbr title="Too Long; Didn’t Read">TL;DR</abbr> of what I would recommend in regard to documentation:

- Keep technical documentation alongside the code. That is the best advice I can keep to fight obsolescence.
- Make sure documentation is both easy to read **and** easy to write. The more convenient it is to just hop in and write/update a few lines, the more likely people will.
- Talk about your documentation, link it, and refer people to it. Make sure your organisation knows about it so it becomes an active part of your work.

Documentation is a living organism. Our hub is 3 years old and keeps growing on a daily basis. As of writing, it is almost 60,000 words (or the equivalent of ~200 pages book) spread across about 60 Markdown files.

The more people rely on it, the better its quality as there are more and more authors and maintainers. It is everyone’s responsibility to keep it alive and healthy, from the new-comer to the most senior person on the team. Everyone reads docs, ergo everyone should write docs.

Oh, and in case you came for the memes, you’ll be pleased to know that this has been in our README for pretty much ever:

![Parody of the “they’re good dogs Brent” meme as “they’re good docs Brent”](/assets/images/technical-documentation-for-everyone/good-docs-brent.png)
