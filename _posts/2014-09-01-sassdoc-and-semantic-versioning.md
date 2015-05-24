---
layout: post
sassmeister: true
title: "SassDoc and Semantic Versioning"
---

If you are not familiar with the concept of Semantic Versioning, I invite you to read [my article](http://www.sitepoint.com/semantic-versioning-why-you-should-using/) on topic at SitePoint. To sum things up, it is a way to version softwares in ordre to provide meaning across version number bumps.

It looks like this: `major.minor.patch` (e.g. `1.3.37`). *Major* version is for API changes and backward incompatibilities, *minor* is for backward compatible features and *patch* is for bug fixes.

[npm](http://npmjs.org) using Semantic Versioning for its packages, it is no surprise we use it at [SassDoc](https://github.com/SassDoc/sassdoc). Meanwhile, we have seen quite a few suprises regarding our version bumps, so I thought I would clarify some things in a short article.

## Isn't it too soon for `1.0.0`?

> ... I mean, project is not even a month old.

We have started working on SassDoc mid-June and released the stable version of `1.0.0` on July 17th according to npm, so we basically took a month for the launch.

When we were first talking about `1.0.0`, someone told us it was too soon because the projet needed to mature a bit first.

While it makes sense in some way, I think releasing a stable version after a month of such a small project as SassDoc isn't *too soon*, especially when 4 developers have been working on it.

The project mature as we are working on it and as people start using it. There is no need to wait weeks or months before launching it: we need feedbacks. And you don't get feedbacks when project is on `0.4.3`.

## You've released 4 minor versions in 2 weeks!

Version `1.1.0` came on July 20th (3 days after `1.0.0`). Version `1.2.0` has been released on August 11th ([announced on Tuts+](http://webdesign.tutsplus.com/articles/new-features-and-a-new-look-for-sassdoc--cms-21914) the next day). Version `1.3.0` came one week later, on August 18th, and version `1.4.0` has been launched 2 days later, on August 20th. Finally, version `1.5.0` (latest stable as of writing) came on August 25th.

<blockquote class="pull-quote--right">Between 10/08 and 25/08, we went from <code>1.1.0</code> to <code>1.5.0</code>.</blockquote>

So indeed, between August 10th and August 25th, we went from `1.1.0` to `1.5.0`. So what?

Here is how we plan versions minor versions: we have a list of features we'd like to work on. Small features are planned for the next minor version, while features that require a reasonable amount of work are delayed for 1 or 2 versions.

Version `1.2.0` has been quite long to build because we released a major feature: custom themes and templates. Not only did this required to build a whole [theming engine](https://github.com/themeleon/themeleon), but we also had to make sure the [data structure](https://github.com/SassDoc/sassdoc/wiki/SassDoc-Data-Interface) we hand over to the theme is fixed and documented so that people are able to build their own themes right away.

But for other minor versions, we just group a couple of features and bundle them together once they are ready. There is no need to wait a specific amount of time. I suppose we could release one version every two weeks as agile methodology dictates, but I'm not sure that would help us whatsoever.

In the end, we've seen some positive effects with this feature-rush. People seem enthusiastic about SassDoc and willing to get their hands on a project that is being improved on a daily basis.

## You'll hit `2.0.0` in no time!

And so what? Is there some specific rule telling that v2 should happend like one year after v1? Here is the thing: we push as many things in v1 as possible as long as they do not introduce backward incompatible changes. When this won't be possible anymore, we'll move on to the next major version.

For instance, if we ever come up with a way to allow both invisible comments and C-styles comments, chances are high that we will break something. Thus, we push it back to `2.0.0`. It may be in `2.0.0` or `2.4.0`, we don't know.

Along the same line, we are considering providing a way to document BEM architecture (`@module`, `@element`...) but since this is likely to be one of the biggest feature we've ever shipped, we'll probably break something; probably minor, but still. So this is delayed to `~2.0.0`.

Meanwhile, while we're able to add new features without breaking the API, we keep going. I can already tell there will be a `1.6.0` that we are currently working on (bringing YAML configuration on the tabl)e, and while I don't exclude a `1.7.0`, I think we will jump on `2.0.0` at this point.

## You don't use patches!

Well, this is wrong for starter. Plus, when you release a minor version every 3 days, you are less likely to have bug reports. Anyway, when we find a bug in stable version, we immediately push a patch (hence `1.1.1` to `1.1.6`, `1.3.1`, `1.3.2`, `1.4.1`), and we'll keep doing so.

## Final thoughts

We've been working like crazy on SassDoc lately because not only is this Node project very fun to work on, but we've realized our 4-people crew is working quite well. Each of us have some special skills that fit very well with others.

Plus, we have noticed people were really interested in having a powerful tool to document their Sass projects. We only hope SassDoc will soon be the go-to tool for this.

By the way, we need feedbacks. And opinions. Consider joining us on [the repository](https://github.com/SassDoc/sassdoc) to chat on opened issues!
