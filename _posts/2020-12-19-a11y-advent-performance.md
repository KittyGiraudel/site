---
title: 'A11yAdvent Day 19: Performance'
description: A11yAdvent entry on performance as an accessibility topic
---

Performance, or rather the lack thereof, can definitely be considered an accessibility topic. If the content never shows up, it’s not accessible — in the most basic sense of the word.

A few years back, [Harry Roberts mentioned an anecdote in one of his talks]() where he got the opportunity to ask a developer from Nepal whether his website was fast enough. Here is the transcript:

> I said, “[W]hilst I have your attention, my analytics told me that Nepal is a problem region for my website. Nepal is apparently a very slow area to visit my website from. Is that true?”
>
> His reply almost knocked me out. He said, “No, no, I don’t think so. I click on your site and it loads within a minute,” and that doesn’t feel slow, right? Imagine a minute load time not feeling slow.
>
> Here in the middle of Germany, if we experienced a one-minute load time, we’d assume the site was down. We’d assume they were having an outage, and we’d probably go elsewhere.

Nepal, like many regions of the world, suffers from what most of us would consider poor connectivity. A website as optimised as Harry’s takes almost a minute to load. Harry continues:

> [M]y site is incredibly highly optimized. It has to be. It’s my job to sell fast websites. If you’re visiting my site from, say, Dublin or West Coast USA, it would be fully loaded, fully rendered within 1.3 seconds. The exact same website on the exact same hosting on the exact same code base takes a minute for this person, over 45 times slower just because of where he lives. That’s the geographic penalty, the geographic tax that a lot of people in the world have to pay.

Performance is a critical topic, for many reasons. In e-commerce, any extra tenth of a second to display a page can have massive cost repercussions. Besides economical ramifications, ensuring sites are fast is important so that people from any region of the world can access them — regardless of bandwidth and internet speed. There is so much to discuss on the topic and this article should not become a guide on frontend performance (nor would I be able to write such guide anyway).

One specific thing I would like to mention though: [icon fonts are notoriously bad](https://css-tricks.com/icon-fonts-vs-svg/) for a variety of reasons — one of them being that they do not render until the font **and** styles have been fully downloaded, parsed and evaluated. When iconography is used as main content (such as in links and buttons), using an icon font might mean a broken and inaccessible interface until the font eventually shows up. The font could also fail to load, or be overwritten entirely by custom styles, leaving the UI in an awkward and possibly unusable state.

If you are interested in frontend performance and would like to ramp up your skills, I cannot recommend [this series by Harry Roberts](https://gumroad.com/l/eihdtmcwf) enough — definitely worth the money and a goldmine of information.
