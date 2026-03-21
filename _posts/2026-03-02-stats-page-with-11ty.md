---
title: Stats Page with Eleventy
description: A short technical write-up about aggregating blogging stats and displaying them on a page with Eleventy.
tags:
  - Eleventy
  - JavaScript
  - Liquid
---

The nice thing about having blogged for so long is that there is a lot of data to play with! I was curious whether I could pull some vanity metrics from all my writing and yes, it’s certainly possible! I’ll show how I’ve done it.

{% assign stats = collections.postStats %}

Here are the stats in case you’re curious: <strong>{{ stats.postCount }}</strong> posts between {{ stats.firstPostDate | time }} and {{ stats.lastPostDate | time }}. An average of <strong>{{ stats.avgPostsPerYear }}</strong> articles per year, <strong>{{ stats.avgPostsPerMonth }}</strong> per month, <strong>{{ stats.avgPostsPerWeek }}</strong> per week, with <strong>{{ stats.avgDaysBetweenPosts }}</strong> days between articles on average. Check out [the stats page](/stats/) for the full breakdown!

## Aggregating data

I initially had a look at the [eleventy-plugin-post-stats](https://github.com/johnwargo/eleventy-plugin-post-stats) package. It’s well put together, but I didn’t like that it relies on post tags to collect data. That means you need a specific tag that is used by *all* posts, like `post` or something. I do not have that. It would have been easy to add of course, but I didn’t like having to keep a tag for data collection’s sake, because that meant having to filter it out in the frontend to avoid rendering it.

Conceptually, it was on the money though: have an [Eleventy plugin](https://www.11ty.dev/docs/plugins/) that pulls all posts, computes a bunch of data, and exposes it back as a collection to make it consumable in Liquid pages.

```js
export default function postStatsPlugin(eleventyConfig, options = {}) {
  eleventyConfig.addCollection('postStats', collection => {
    const posts = collection
      .getFilteredByGlob('_posts/*.md')
      .sort((a, b) => b.date - a.date)

    // Aggregate a bunch of data from posts
    // …

    // Return the final stats
    const stats = {
      firstPostDate,
      lastPostDate,
      postCount,
      avgPostsPerWeek,
      avgPostsPerMonth,
      avgPostsPerYear,
      avgDaysBetweenPosts,
      avgCharacterCount,
      avgWordCount,
      avgParagraphCount,
      popularTags,
    }

    return [stats]
  })
}
```

By default, Eleventy collections are arrays. That doesn’t make a whole lot of sense for our case though, because we want a singleton object to be able to access `postStats.postCount`, for instance.

So we still return an array with a single object (our stats), but also assign all the properties from that object onto the array itself — taking advantage of everything being an object in JavaScript.

```js
const collection = [stats]
Object.assign(collection, stats)
return collection
```

To be clear, we could totally skip the `Object.assign(..)` part and then access `postStats[0].postCount`, but that’s a bit more cumbersome, and also less obvious how the data is structured.

- Before: `collections.postStats[0].postCount`
- After: `collections.postStats.postCount`

{% callout %}You can find the [complete code for the plugin](https://github.com/KittyGiraudel/site/blob/main/_plugins/post-stats.js) on GitHub. Be warned: there is a fair bit of proprietary logic, and most of it was written by Cursor. Still, you should be able to reuse most of it if you wanted.{% endcallout %}

### Dealing with the front-matter

To avoid considering the YAML front-matter when computing article lengths, we need to strip it out. There are some libraries to access that data, like [js-yaml-front-matter](https://github.com/dworthen/js-yaml-front-matter). But I thought since I wasn’t interested in its content and just wanted to get rid of it, I could do it myself:

```js
function stripFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  return match ? match[2].trim() : content.trim()
}
```

```js
for (const post of posts) {
  let body = ''

  try {
    const raw = fs.readFileSync(post.inputPath, 'utf8')
    body = stripFrontMatter(raw)
  } catch {
    console.warn(`Could not strip out the YAML front-matter for ${post.inputPath}`)
    continue
  }

  const stats = getContentStats(body)
  // … Add the stats to a shared object for all posts
}
```

### Caching data

I noticed while working on this article that the plugin makes Eleventy compilation slower. It’s totally fine at build time, but when working in watch mode, Eleventy recomputes all stats — which involves hitting the file system for every single post. It’s not very efficient.

So I’ve set up some lightweight caching for the plugin. It maintains a map of paths to their computed stats + the last time they were modified. When compiling, it looks into the cache to see if we have an entry for that post. If it does, and the last modified date hasn’t changed, it just returns the data from the cache, otherwise it computes the stats for that post.

```js
const CONTENT_STATS_CACHE = new Map()

function getCachedContentStats(post) {
  const inputPath = post.inputPath
  if (!inputPath) return null

  let stat
  try {
    stat = fs.statSync(inputPath)
  } catch {
    return null
  }

  const lastModifiedTime = stat.mtimeMs
  const cachedEntry = CONTENT_STATS_CACHE.get(inputPath)

  if (cachedEntry?.lastModifiedTime === lastModifiedTime) {
    return cachedEntry.stats
  }

  let body = ''

  try {
    const raw = fs.readFileSync(inputPath, 'utf8')
    body = stripFrontMatter(raw)
  } catch {
    console.warn(`Could not strip out the YAML front-matter for ${post.inputPath}`)
    return null
  }

  const stats = getContentStats(body)
  CONTENT_STATS_CACHE.set(inputPath, { lastModifiedTime, stats })

  return stats
}
```

This brought down incremental compilation time from about 10 seconds to ~1 second or so, which is what I would consider acceptable for incremental builds.

## Displaying stats

Once we’ve added our custom plugin to the configuration, Eleventy exposes a `postStats` collection in all our Liquid templates (or whatever templating engine). Now, we can create a [dedicated page](/stats/) which consumes that collection.

```liquid
---
layout: default
title: Blog Statistics
description: Vanity metrics about my writing habits on this blog over the years.
permalink: /stats/
---

{​% assign stats = collections.postStats %}

<table>
  <tbody>
    <tr>
      <th scope="row">First post</th>
      <td>{​{ stats.firstPostDate | time }}</td>
    </tr>
    <tr>
      <th scope="row">Last post</th>
      <td>{​{ stats.lastPostDate | time }}</td>
    </tr>
    <tr>
      <th scope="row">Total posts</th>
      <td>{​{ stats.postCount }}</td>
    </tr>
  </tbody>
</table>
```

{% if stats.years and stats.years.size > 0 %}
## Displaying graphs

For funsies, I thought I’d add some data visualisation to my stats page. First, we need to dump some data into a global variable so our script can read it. I made the plugin return an array of years, each year with its own discrete stats. Then we can use a loop to populate a JavaScript variable.

{% raw %}
```js
window.__STATS_YEARS__ = {{ stats.years | json }};
```
{% endraw %}

Ultimately {% footnoteref "rendered-script" "Fun fact: This code block showcasing the <code>window.__STATS_YEARS__</code> is an actual <code>script</code> tag with <code>display: block</code> — so meta. It’s the data source used by the visualization in this article. Inspect it in your browser!" %}it spits this out{% endfootnoteref %}: 

<pre class="language-js"><code><script style="display:block">window.__STATS_YEARS__={{ stats.years | json }};</script></code></pre>

Then, we can have some JavaScript read that global variable, and use [ApexCharts](https://apexcharts.com/) to render a chart. I let Cursor deal with that, because it’s much faster and better at processing documentation than I am.

```js
const years = window.__STATS_YEARS__
const categories = years.map(year => String(year.year))
const counts = years.map(year => year.postCount)

const chart = new ApexCharts(container, {
  chart: { type: 'bar' },
  series: [{ name: 'Posts', data: counts }],
  xaxis: { categories },
  dataLabels: { enabled: true },
  tooltip: { y: { formatter } },
})

chart.render()
```

<div id="stats-posts-per-year"></div>

Tadaaaa — pretty cool if you ask me! The huge bump in 2020 is because I released my [accessibility advent calendar](/2020/12/01/a11y-advent-calendar) that year, which added 31 posts to the count. As for 2025, well I just didn’t write at all besides my year in review. Fortunately I’m correcting that this year!

{% include "script.liquid", partials: "utilities, stats", inline: true %}
{% endif %}

## Wrapping up

It’s all very vain of course, not to mention very unnecessary. But it was a good opportunity to play with Eleventy custom plugins, do some data visualisation, and satisfy my love for metrics. Maybe it’ll inspire you to do something similar on your own blog. :)

<script>
  // Ugly hack to undo the aggressive compression from html-minifier for that element specifically
  document.addEventListener('DOMContentLoaded', () => {
    const script = document.querySelector('script[style="display:block"]')
    if (!script) return 
    script.innerText = script.innerText
      .replace(/=\[{/, ' = [\n  { ') // Start
      .replace(/}]/, ' }\n]')        // End
      .replace(/},{/g, ' },\n  { ')  // Lines
      .replace(/([:,])/g, '$1 ')     // Inner
  })
</script>