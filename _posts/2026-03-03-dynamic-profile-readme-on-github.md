---
title: Dynamic profile README on GitHub
description: A short technical write-up on how I created an always up-to-date README for my GitHub profile.
tags:
  - git
  - GitHub
  - Process
---

GitHub has this concept of [profile README](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme). It’s basically a Markdown document that shows up on your public GitHub profile. It works by having a `README.md` file in a repository named after your GitHub username. For instance, my GitHub username is KittyGiraudel, so the `README.md` file of my `KittyGiraudel` repository would get displayed ([see it in action](https://github.com/KittyGiraudel)).

It would be nice if this file could list my latest articles, so that it links back to my website for people to discover my content. But also I shouldn’t have to manually update that file because it’s cumbersome and we live in the age of automation.

Someone on LinkedIn shared that they asked Claude to set up a CRON job, and that got me thinking. GitHub Actions support CRON workflows, so that’s probably all we need?

## How it works

Here is the gist of it: the `README.md` file contains a fenced section that gets wiped and replaced with recent articles. A Node.js script fetches my RSS feed, grabs the last entries, and generates a Markdown table to list them. It then injects it in the `README.md` file. Finally, a GitHub Action runs that script and push a commit to update the file on the remote repository.

## Templating the README

The nice thing about Markdown is that we can use HTML comments. This way, they are invisible when rendering the file. We put a placeholder sentence in between them so that if the script fails for any reason, the content remains meaningful.

```markdown
## Latest writing

<!-- BLOG-POST-LIST:START -->
Find my latest blog posts on [kittygiraudel.com](https://kittygiraudel.com/blog).
<!-- BLOG-POST-LIST:END -->
```

## Creating the Node.js script

Our script needs to do 3 different things:

1. Get the latest articles.
2. Generate a Markdown table to list them.
3. Inject that table in the `README.md` file.

### Retrieving latest articles

First, let’s fetch the latest articles. It’s made very easy by using my RSS feed and a small library to parse XML:

```js
import { XMLParser } from 'fast-xml-parser'

async function fetchFeed() {
  try {
    // Fetch the RSS feed
    const response = await fetch('https://kittygiraudel.com/rss/index.xml')
    if (!response.ok) {
      console.error(`Failed to fetch feed: ${response.status} ${response.statusText}`)
      return null
    }

    // Parse the resulting XML
    const xml = await response.text()
    const parser = new XMLParser({ ignoreAttributes: false })
    const data = parser.parse(xml)

    // Ensure we have some data to work with
    const entries = data?.feed?.entry
    if (!entries || (Array.isArray(entries) && entries.length === 0)) {
      console.error('No entries found in feed.')
      return null
    }

    // For each entry, resolve the necessary data (name, date, link)
    const items = Array.isArray(entries) ? entries : [entries]
    return items.slice(0, 5).map(entry => {
      const title = entry.title ?? 'Untitled'
      const url = entry.link?.['@_href']
      const date = new Date(entry.published)
        .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

      return { title, url, date }
    })
  } catch (error) {
    console.error('Error while fetching or parsing feed:', error)
    return null
  }
}
```

### Generating Markdown table

The second thing we need is to generate the Markdown table for our data:

```js
function buildMarkdown(posts) {
  if (!posts || posts.length === 0) {
    return 'Find my latest blog posts on [kittygiraudel.com](https://kittygiraudel.com/blog).'
  }

  const rows = posts
    .map(post => {
      const link = post.url || 'https://kittygiraudel.com'
      const title = post.title.replace(/\|/g, '\\|')
      return `| ${post.date} | [**${title}**](${link}) |`
    })
    .join('\n')

  return [
    '| Date | Post |',
    '| ---- | ---- |',
    ...rows,
  ].join('\n')
}
```

### Updating README

Finally, we want to update the `README.md` file.

```js
const MARKER_START = '<!-- BLOG-POST-LIST:START -->'
const MARKER_END = '<!-- BLOG-POST-LIST:END -->'

function updateReadmeBlock(content, block) {
  const startIndex = content.indexOf(MARKER_START)
  const endIndex = content.indexOf(MARKER_END)

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    console.error('Could not find blog post markers in README.md')
    return content
  }

  const before = content.slice(0, startIndex + MARKER_START.length)
  const after = content.slice(endIndex)

  return `${before}\n${block}\n${after}`
}
```

## Running our script

We want to run our script on a regular basis — such as every day — to keep our profile README updated. We can create a GitHub workflow executing a CRON job.

```yaml
name: Update profile README

on:
  schedule:
    - cron: '0 6 * * *' # Every day at 6am

permissions:
  contents: write # Needed to let GitHub issue commits

jobs:
  update-readme:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Update README with latest posts
        run: npm run update-readme

      - name: Commit and push changes
        run: |
          if git diff --quiet; then
            echo "No changes to commit"
            exit 0
          fi

          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

          git add README.md
          git commit -m "chore: update README with latest blog posts"
          git push
```

{% info %}I had to investigate a little to figure out which email address to use when issuing an automated commit. Some people recommended github-actions[bot]@users.noreply.github.com, but [some articles](https://www.junian.net/dev/github-actions-bot-username-email-address/) suggest using 41898282+github-actions[bot]@users.noreply.github.com. That’s what I’ve done, and it works, so good enough for me.
{% endinfo %}

We also want to run our workflow when pushing onto the `main` branch so that we can safely update our `README.md` template and have the script run. 

```yaml
on:
  schedule:
    - cron: '0 6 * * *'
  push:
    branches: [ main ]
```

### Caveats

One downside of issuing an automated commit is that our local branch ends up behind its remote counterpart, since there are some missing commits. We can of course pull to bring these commits in, but they end up containing a non-templated version of the `README.md` file, which is not really what we want.

I think a decent way is to just force push locally, to just ignore these generated commits. It’s questionable, but I have found that this works fine for me:

```bash
git add README.md
git commit -m "Update README.md template"
git push --force
```

## Wrapping up

Short and sweet, a fun 15-minute experiment. I hope it will inspire you to do something similar with your own GitHub profile! You can [browse the code on GitHub](https://github.com/KittyGiraudel/KittyGiraudel).