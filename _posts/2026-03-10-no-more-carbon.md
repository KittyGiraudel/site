---
title: No more Carbon
description: TBA
tags:
  - TBA
---

Over 13 years ago, a fellow web developer recommended putting ads on my website to make some money. I was originally hesitant, not wanting to be too intrusive to my audience. They suggested looking into [Carbon Ads](https://www.carbonads.net/), an ad network dedicated to the tech industry. It seemed alright, so I enrolled into their program. Fastforward 10+ years, and I’ve finally removed the ads from this website.

{% info %}
**Disclaimer!** This article is not a diss on Carbon. Honestly, they’ve been totally fine. The ads have always been clean and minimal. The few times I had a question, they answered on the spot. No shade on their services, they’re good — I’m just not the right audience.
{% endinfo %}

## Analyzing the data

Before making this decision, I wanted to look at the data. Unfortunately, Carbon doesn’t have an export feature, so I manually extracted the data from the React Dev Tools (god bless the right-click-to-copy-as-JSON feature), and created a big JSON file with every single payout transaction.

Then, I asked Cursor to create a little dashboard for me to visualize the data. Here it is:

{% include "demos/carbon/index.liquid" %}

### Missing data

It’s worth noting that Carbon does not show any payout before June 7th 2018, but I know for a fact that I was rendering their ads as far back as [May 14th 2015](https://github.com/KittyGiraudel/site/commit/3a095525082e3d0363f5dd93f549dc475408251e#diff-1f4e21ccc4bb8bc46f8d390a9a174ee5b7ca533e9c0929ca5c511be8112a9909), and found email exchanges dated March 13th 2013. That means 5 years of unaccounted for data. You can check the checkbox in the dashboard to enable estimated backtracking.

I wanted to get more accurate data for that missing period, but Carbon pays via PayPal, and PayPal is a terrible product that doesn’t let you access data more than a year old so no luck. I could ask Carbon for that data, but if it’s not in the dashboard, I doubt a CSM will be able to magically pull it — especially now that I’m gone.

### Takeaways

To me, the main takeaways are that:

- 2021 and 2022 paid well, with about $150 per year including a $24 payout in October 2022. I also wrote 25 articles in [2021](/2021/12/27/2021-in-review/), 19 in [2022](/2022/12/28/2022-in-review/), so that drove traffic, which led to higher payouts.
- The last 3 years have been very under-performing, progressively getting worse: $25 made in the last 12 months, $60 in the last 2 years, $100 in the last 3 years. 

To be clear, it’s not the service that has changed: it’s me. I’ve gotten older, less interested in technology, got into management, wrote less technical pieces, had less traffic on this website and ultimately earned less money. The system works as expected, this website is just low traffic.

Speaking of traffic, it’s hard to quantify because I removed Google Analytics in 2021 because I simply didn’t care. My Netlify dashboard shows {% footnoteref "data-oddity" "I also do not believe these numbers, because it recorded 1,103,938 page views for <a href='/2020/02/03/lessons-from-building-n26-for-web/'>Lessons from building “N26 for Web”</a> for that period. I’ve noticed that this article has had an abnormal amount of traffic for years now, but to this day I still cannot figure out why. Google searches for <code>link:&lt;url&gt;</code> yield nothing either. That means if we remove that outlier, that’s half a million page views per month. Almost nothing." %}1,617,642 by 33,250 unique visitors{% endfootnoteref %} over the last 30 days. It’s not nothing, but it’s certainly not a lot. And with all major search engines now scrapping content for their AI summaries, there is even less traffic flowing through little websites like this one.