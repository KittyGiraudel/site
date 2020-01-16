---
title: 'Introducing Sass Guidelines'
tags:
  - sass
  - guidelines
  - release
---

> **Edit (2015/01/07):** over 20000 visits on [Sass Guidelines](https://sass-guidelin.es) during the last 24 hours. Thank you so much for your support!

I don’t know why I did not think of writing Sass guidelines when [Harry Roberts](https://csswizardry.com) first released his [CSS Guidelines](https://cssguidelin.es) a couple of months back. Anyway, on saturday evening I had a _eureka moment_:

> I SHOULD WRITE SASS GUIDELINES!
> &mdash; Me, in the shower.

After two days working on them, I am very proud and excited to release a 10000 words long styleguide on working with Sass: [sass-guidelin.es](https://sass-guidelin.es).

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p>Game on, folks! <a href="https://twitter.com/SassCSS">@SassCSS</a> guidelines, just for you: <a href="https://t.co/8ybeXdBOFY">https://t.co/8ybeXdBOFY</a>.</p>&mdash; Hugo Giraudel (@HugoGiraudel) <a href="https://twitter.com/HugoGiraudel/status/552472109797371906">January 6, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## What is that?

I think we have been on a need for Sass guidelines for months now. Here is my shot at it. However note that this document is very opinionated. This is _a_ styleguide, _the_ styleguide.

![Sass Guidelines](/assets/images/introducing-sass-guidelines/preview.png)

In it, I tackle almost all aspects of the Sass language: colors, strings, nesting, variables, mixins, extend, warnings, architecture, tools… I may have missed something, but I would be glad to complete it with your ideas.

## What now?

I worked like crazy for two days to have a first version that is good enough to be released. I think I nailed it. Now, we can always improve things. For instance, some people have been complaining about the use of double quotes, which seem to be a pain to type on an american keyboard. Fair enough. I opened a [pull request](https://github.com/HugoGiraudel/sass-guidelines/pull/27) to move to simple quotes instead.

Similarly, there is [Ian Carrico](https://github.com/iamcarrico) who seems a bit upset by my agressive _no `@extend`_ rule. While this is an opinionated document, I feel like I can still round up the edges and make things a little better for everybody so I need to rewrite the section about extending selectors.

Also, and I need your help with this, for such a styleguide to make sense, it has to get popular. It has already received some good vibes yesterday thanks to all your tweets (especially [CSS-Tricks](https://twitter.com/real_css_tricks) and [Smashing Magazine](https://twitter.com/smashingmagazine), let’s be honest).

[Tweet it](https://twitter.com/share?text=Sass%20Guidelines%2C%20a%20styleguide%20for%20writing%20sane%2C%20maintainable%20and%20scalable%20Sass%20by%20%40HugoGiraudel%20%E2%80%94%20&url=https://sass-guidelin.es), upvote it on [Hacker News](https://news.ycombinator.com/item?id=8845421) and [reddit](https://redd.it/2rj36x) and above all: tell me what you think. This is the only way for me to improve it.

Last but not least, if this project helps you getting started with Sass, if it helps your team staying consistent or if you simply like it, consider [supporting the project](https://gumroad.com/l/sass-guildelines). Like [CSS Guidelines](https://cssguidelin.es), this document is completely free. Still, it took a lot of time to write it and will take even more keeping it up-to-date. Anyway, if you want to pay me a beer through Gumroad, that would be awesome. :)
