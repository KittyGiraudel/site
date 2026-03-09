---
title: No more Carbon
description: TBA
tags:
  - TBA
---

In 2013, a fellow web developer recommended putting ads on my website to make some money. I was originally hesitant, not wanting to be too intrusive to my audience. They suggested looking into [Carbon Ads](https://www.carbonads.net/), an ad network dedicated to the tech industry. It seemed alright, so I enrolled into their program. 

Fastforward today, and I’ve finally removed the ads from this website. This article is a summary od my thought process (including data visualization) and the benefits from this decision.

{% callout %}
**Disclaimer:** This article is not a diss on Carbon. Honestly, they’ve been totally fine. The ads have always been clean and minimal. The few times I had a question, they answered right away. No shade on their services, they’re good — I’m just not the right candidate.
{% endcallout %}

## Analyzing the data

Before making this decision, I wanted to look at the data. Unfortunately, Carbon doesn’t have an export feature, so I manually extracted the data from the React Dev Tools (god bless the right-click-to-copy-as-JSON feature), and created a big JSON file with every single payout transaction.

Then, I asked Cursor to create a little dashboard for me to visualize the data (including the amount of articles published on this blog during that time). Here it is:

{% include "demos/carbon/index.liquid" %}

$670 over 8 years (excluding 2026). That’s about $80 per year, or $7 per month. And that’s because my earlier years were significantly more profitable (more on that later). Last year was closer to $2 per month. I’ve served *millions* of ads over the last decade, and I made just about enough for an outdated mid-range smartphone.

### Missing data

It’s worth noting that Carbon does not show any payout before June 7th 2018, but I know for a fact that I was rendering their ads as far back as [May 14th 2015](https://github.com/KittyGiraudel/site/commit/3a095525082e3d0363f5dd93f549dc475408251e#diff-1f4e21ccc4bb8bc46f8d390a9a174ee5b7ca533e9c0929ca5c511be8112a9909), and found email exchanges dated March 13th 2013. That means 5 years of unaccounted for data. You can check the checkbox in the dashboard to enable estimated backtracking.

I wanted to get more accurate data for that missing period, but Carbon pays via PayPal, and PayPal is a terrible product that doesn’t let you access data more than a year old so no luck. I could ask Carbon for that data, but if it’s not in the dashboard, I doubt a CSM will be able to magically pull it — especially now that I’m gone.

### Takeaways

To me, the main takeaways are that:

- 2021 and 2022 paid well, with about $150 per year including a $24 payout in October 2022. I also wrote 22 articles in [2021](/2021/12/27/2021-in-review/), 20 in [2022](/2022/12/28/2022-in-review/), so that drove traffic, which led to higher payouts.
- The last 3 years have been very under-performing, progressively getting worse: $25 made in the last 12 months, $60 in the last 2 years, $100 in the last 3 years. 
- I’ve authored almost 100 articles from 2020 to 2022 and made $375. For context, this is a little over {% footnoteref "sitepoint-fare" "It is mind-boggling to me that I made more money by selling <em>a single article</em> to SitePoint than I did from Carbon in my 3 most profitable years <em>combined</em>. I wrote 40 articles for SitePoint in 2014, and I could typically come up with a full article in a couple of hours." %}what SitePoint used to pay me *per article*{% endfootnoteref %} as one of their primary CSS/Sass authors back in 2015.

To be clear, it’s not the service that has changed: it’s me. I’ve gotten older, less interested in technology, got into management, wrote less technical pieces, had less traffic on this website and ultimately earned less money. The system works as expected, this website is just low traffic.

Speaking of traffic, it’s hard to quantify because I removed Google Analytics in 2021 because I simply didn’t care. My Netlify dashboard shows {% footnoteref "data-oddity" "I also do not believe these numbers, because it recorded 1,103,938 page views for <a href='/2020/02/03/lessons-from-building-n26-for-web/'>Lessons from building “N26 for Web”</a> for that period. I’ve noticed that this article has had an abnormal amount of traffic for years now, but to this day I still cannot figure out why. Google searches for <code>link:&lt;url&gt;</code> yield nothing either. That means if we remove that outlier, that’s half a million page views per month. Almost nothing." %}1,617,642 by 33,250 unique visitors{% endfootnoteref %} over the last 30 days. It’s not nothing, but it’s certainly not a lot. And with all major search engines now scrapping content for their AI summaries, there is even less traffic flowing through little websites like this one.

> Free money is free money, why don’t you just keep serving ads?  
> — Someone who could be asking this legitimate question.

I never *loved* running ads on my personal website. I’ve done it at a time where I earned less money and ads were more profitable based on my traffic and audience. It was meaningful to me when I made $15–20 in ads every month, because it felt like it paid for my coffee or something — and it encouraged me to write more.

I’ve held senior engineering positions for the last 7 years or so, where the monthly income vastly overshadows whatever meager earnings Carbon would pay for serving ads. And the vast disparity between both sources of income became only bigger with years gone by. 

I’m at a point where ads basically don’t pay, but I still have to deal with them being a thing: layout, performance, etc. Which leads us to our next section.

## Benefits

**Comfort:** I mean, the main benefit is for you all not to see ads anymore. Even though I assume everyone is running an ad-blocker, it’s simpler and easier this way. No more ad, no more screen estate dedicated to something that doesn’t render.

**Maintenance:** On my end, it makes the code quite a bit simpler. I recently wrote how I [injected the ad inside Liquid content](/2026/02/27/injecting-element-in-liquid-content/) — which is no longer a thing. I also had to place the ad widget and the table of contents side-by-side at the top of articles, which was visually heavy — no more.

**Performance:** The page should also be a tad faster, since we no longer load the JavaScript bundle from Carbon, which *had* to be hosted on their CDN as per their rendering guidelines. It was lightweight and fast, but the fastest JavaScript bundle is the one you don’t load.

## Wrapping up

One more time, because I don’t want there to be any confusion: it’s not that Carbon is a bad network, or that they do not remunerate well. It’s just that this is a small personal website which doesn’t have a lot of visits, let alone ad clicks — so serving ads isn’t exactly a reliable source of income.

I’m sure larger publications with high traffic, such as CSS-Tricks or SitePoint, make a ton of money from ads. When you have several million page views per month, even ad with cheap return really starts to matter by accumulating. This site is just not the right target.