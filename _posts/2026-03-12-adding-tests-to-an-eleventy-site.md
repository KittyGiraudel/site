---
title: Adding Tests to an Eleventy site
description: A small walkthrough on how I added automated tests to this website to stop breaking it.
tags:
  - Eleventy
  - JavaScript
  - Testing
---

I’ve been {% footnoteref "website-changes" "See <em><a href='/2026/02/26/nerdy-design-details/'>Nerdy Design Details</a></em>, <em><a href='/2026/02/27/injecting-element-in-liquid-content/'>Injecting element in Liquid content</a></em>, <em><a href='/2026/03/01/tag-pages-with-eleventy/'>Tag pages with Eleventy</a></em>, <em><a href='http://localhost:8080/2026/03/02/stats-page-with-11ty/'>Stats Page with Eleventy</a></em>, <em><a href='/2026/03/04/automatic-toc-with-11ty/'>Automatic Table of Contents with Eleventy</a></em>, <em><a href='/2026/03/10/no-more-carbon/'>No more Carbon</a></em> and <em><a href='/2026/03/11/serving-markdown-to-llms-with-11ty/'>Serving Markdown to LLMs with Eleventy</a></em> — all released in the last 2 weeks." %}working a lot on this website recently{% endfootnoteref %}, and with every significant change, I end up doing a lot of poking around after every deployment to make sure I didn’t break anything.

Some things like making sure the layout still looks fine are easy to spot, but there are more subtle points of failure like SEO and RSS files, static assets and more. Seems like a good case for automated tests.

{% callout %}
I think it’s worth pointing out that nothing in this article is specific to Eleventy per se. The premise can be applied to any statically generated website, be it with Astro, Hugo, or whatever else you use. It’s just written in the context of this website, which is built with Eleventy.
{% endcallout %}

## What to test

There is virtually no limit to how far you can go with tests. Of course, it comes with trade-offs: every test needs to be maintained, and takes time to run. So I didn’t want to go overboard with it, especially since regressions bear very little significance. Worst case my website is down or broken for a moment, big whoop.

There are specific things that are cumbersome to check manually, so that’s what I wanted to cover:

- The [sitemap](/sitemap.xml): it should remain accurate and exhaustive to avoid hurting SEO.
- The [RSS feed](/rss/): it needs not to break, because it’s typically heavily cached, so this would be a problem.
- The [blog search](/blog/search/): it’s not critical but it’s held together with duct tape and prayers.
- The static assets: things like `robots.txt`, `manifest.json`, `favicon.ico`…

## How to test

I wanted a relatively minimal setup in order to keep things simple. That meant:

- No third-party test runner, since [Node.js has one](https://nodejs.org/api/test.html). The developer experience is not as enjoyable as ava or vitest, but I’m going to write and update tests so occasionally that it doesn’t matter. 
- No Cypress or Playwright since it’s a bit heavy for my needs (pages are essentially static). The [client-side blog search](/blog/search/) really is the only thing that would deserve an end-to-end test, but I don’t think it’s worth the overhead.
- No unit testing framework since I just want to run some sanity checks on the build artifact.

I decided to have a couple of JavaScript files using the native Node.js test runner, and a small [XML parsing library](https://github.com/NaturalIntelligence/fast-xml-parser) to help validate XML. That should be enough. 

Here is what the tests to validate the sitemap look like:

```js
// _tests/sitemap.test.mjs
import assert from 'node:assert/strict'
import test from 'node:test'
import { XMLParser } from 'fast-xml-parser'
import { getSiteUrl, readText } from './helpers/site-paths.mjs'

test('The sitemap should be valid', async () => {
  const siteUrl = await getSiteUrl()
  const xml = await readText('sitemap.xml')
  const parser = new XMLParser({ ignoreAttributes: false })
  const site = new URL(siteUrl)

  const doc = parser.parse(xml)
  assert.ok(doc.urlset, 'sitemap should have a <urlset> root element')

  const urls = Array.isArray(doc.urlset.url) ? doc.urlset.url : [doc.urlset.url]
  assert.ok(urls.length > 0, 'sitemap should contain at least one <url> entry')

  const locs = urls.map(entry => entry.loc).filter(Boolean)
  assert.ok(locs.length === urls.length, 'every <url> should have a <loc>')

  for (const loc of locs) {
    assert.equal(typeof loc, 'string')

    const { origin, pathname } = new URL(loc)
    assert.equal(origin, site.origin, 'sitemap URL should use the correct site domain')
    assert.ok(pathname.endsWith('/'), `sitemap URL path should use a trailing slash: ${pathname}`)
  }

  // Static pages to expect to see in the sitemap
  const expectedPaths = ['/', '/blog/', '/projects/', '/snippets/', '/talks/', '/stats/', '/resume/', '/about/', '/accessibility-statement/']
  for (const path of expectedPaths) {
    const expected = new URL(path, site.origin).toString()
    assert.ok(locs.includes(expected), `sitemap should include ${expected}`)
  }

  // Dev artifacts not to compile or present in the sitemap
  const forbiddenPaths = ['/blog/index-markdown/', '/README.md', '/404.html']
  for (const path of forbiddenPaths) {
    const forbidden = new URL(path, site.origin).toString()
    assert.ok(!locs.includes(forbidden), `sitemap should not include ${forbidden}`)
  }
})
```

To ensure some files exist in the built website directory, we can do something like this:

```js
// _tests/assets.test.mjs
import assert from 'node:assert/strict'
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { siteDir } from './helpers/site-paths.mjs'

async function expectFile(relativePath) {
  const full = path.join(siteDir, relativePath)
  const s = await stat(full)
  assert.ok(s.isFile(), `${relativePath} should exist as a file`)
}

async function expectDirectoryWithFiles(relativePath) {
  const full = path.join(siteDir, relativePath)
  const s = await stat(full)
  assert.ok(s.isDirectory(), `${relativePath} should exist as a directory`)
  const files = await readdir(full)
  assert.ok(files.length > 0, `${relativePath} should not be empty`)
}

test('Core assets exist in built site', async () => {
  await Promise.all([
    expectFile('robots.txt'),
    expectFile('humans.txt'),
    expectFile('apple-touch-icon.png'),
    expectFile('favicon.ico'),
    expectFile('blog/search/data.json'),
    expectFile('manifest.json'),
    expectFile('sitemap.xml'),
    expectFile('rss/index.xml'),
    expectFile('_headers'),
    expectFile('_redirects'),
    expectFile('404.html'),
    expectDirectoryWithFiles('assets'),
    expectDirectoryWithFiles('assets/js'),
    expectDirectoryWithFiles('assets/images'),
  ])
})
```

<details>
<summary>At this point, I am sure you get the idea. You can expand this section to look at the other tests for the RSS feed and the search.</summary>

```js
// _tests/rss.test.mjs
import assert from 'node:assert/strict'
import test from 'node:test'
import { XMLParser } from 'fast-xml-parser'
import { getSiteUrl, readText } from './helpers/site-paths.mjs'

test('RSS feed is valid Atom with correct URLs', async () => {
  const siteUrl = getSiteUrl()
  const xml = readText('rss/index.xml')
  const parser = new XMLParser({ ignoreAttributes: false })
  const doc = parser.parse(xml)

  // Top-level feed structure
  assert.ok(doc.feed, 'RSS feed should have a <feed> root element')
  assert.ok(doc.feed.title, 'RSS feed should contain <title>')
  assert.ok(doc.feed.subtitle, 'RSS feed should contain <subtitle>')
  assert.ok(doc.feed.id, 'RSS feed should contain <id>')
  assert.ok(doc.feed.updated, 'RSS feed should contain <updated>')

  const links = Array.isArray(doc.feed.link) ? doc.feed.link : [doc.feed.link]
  const linkByRel = new Map()
  for (const link of links) if (link['@_rel']) linkByRel.set(link['@_rel'], link)

  const site = new URL(siteUrl)
  const selfLink = linkByRel.get('self')
  assert.ok(selfLink, 'RSS feed should have a self <link>')
  assert.equal(
    selfLink['@_href'],
    new URL('/rss/index.xml', site.origin).toString(),
    'self link href should match site RSS URL',
  )

  const altLink = linkByRel.get('alternate')
  assert.ok(altLink, 'RSS feed should have an alternate HTML <link>')
  assert.equal(
    altLink['@_href'],
    site.origin,
    'alternate HTML link href should match site URL',
  )

  const entries = Array.isArray(doc.feed.entry) ? doc.feed.entry : [doc.feed.entry]
  assert.ok(entries.length > 0, 'RSS feed should contain at least one <entry>')

  for (const entry of entries) {
    // Basic data for each entry
    assert.ok(entry.title, 'entry should have a title')
    assert.ok(entry.id, 'entry should have an id')
    assert.ok(entry.published, 'entry should have a published date')
    assert.ok(entry.summary, 'entry should have a summary')

    const entryLinks = Array.isArray(entry.link) ? entry.link : [entry.link]
    assert.ok(entryLinks.length > 0, 'entry should have at least one link')

    const primaryLink = entryLinks[0]
    const primaryHref = primaryLink['@_href']
    assert.equal(typeof primaryHref, 'string')
    
    const primaryUrl = new URL(primaryHref)
    assert.ok(primaryUrl.href.length > 0, 'primary entry link href should be a valid URL')

    const pathname = primaryUrl.pathname
    const looksLikeFile = /\.[^/]+$/.test(pathname)
    if (primaryUrl.origin === site.origin && !looksLikeFile) {
      assert.ok(pathname.endsWith('/'), `internal entry link path should use a trailing slash: ${pathname}`)
    }

    const hasMarkdownAlternate = entryLinks.some(
      l => l['@_rel'] === 'alternate' && l['@_type'] === 'text/markdown',
    )

    assert.ok(entry.content, 'internal entry should have <content>')
    assert.ok(hasMarkdownAlternate, 'internal entry should have an alternate markdown <link>')
  }
})
```

```js
// _tests/search-data.test.mjs
import assert from 'node:assert/strict'
import test from 'node:test'
import { readJson } from './helpers/site-paths.mjs'

test('Search data JSON has expected shape', async () => {
  const data = await readJson('blog/search/data.json')

  assert.ok(Array.isArray(data), 'search data should be an array')
  assert.ok(data.length > 0, 'search data should not be empty')

  for (const entry of data) {
    assert.equal(typeof entry.title, 'string')
    assert.ok(entry.title.length > 0)

    assert.equal(typeof entry.lang, 'string')
    assert.ok(entry.lang.length > 0)

    assert.ok(Array.isArray(entry.tags), 'tags should be an array')

    assert.equal(typeof entry.url, 'string')
    assert.ok(entry.url.length > 0, 'url should not be empty')
    assert.ok(
      entry.url.startsWith('http') || entry.url.startsWith('/'),
      `url should be absolute or root-relative: ${entry.url}`,
    )

    if (entry.url.startsWith('/')) {
      const looksLikeFile = /\.[^/]+$/.test(entry.url)
      if (!looksLikeFile) {
        assert.ok(
          entry.url.endsWith('/'),
          `internal search URL should use a trailing slash: ${entry.url}`,
        )
      }
    }

    assert.equal(typeof entry.date, 'string')
    assert.ok(entry.date.length > 0)

    assert.equal(typeof entry.guest, 'string')
    assert.equal(typeof entry.external, 'string')
  }
})
```

</details>

To run our tests, we can add a `test` script in our `package.json` file:

```json
"scripts": {
  "build": "npx @11ty/eleventy",
  "test": "node --test _tests/*.test.mjs"
}
```

## Where to run

A host-agnostic strategy is to have a GitHub workflow build the website with Netlify, and subsequently run the tests. It would look like this:

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
      - run: npm install
      - run: npm run build # Or `npx @11ty/eleventy` directly
        env:
          NODE_ENV: production
      - run: npm test
```

That does the job pretty well: every commit will result in a GitHub action, which installs Node.js and dependencies, build the project with the Eleventy CLI, and run our `test` script. Easy peasy.

### Netlify

I host my website on Netlify. I also have continuous deployments: Netlify is connected to my GitHub repository and automatically deploys every new commit on the `main` branch. A build consists on calling `npm run build` (which executes Eleventy under the hood), and then publishing the resulting `_site` directory.

The problem with running tests on GitHub is that they wouldn’t prevent a build, even if they fail. After all, Netlify doesn’t know anything about our GitHub Workflow: all it knows is that every commit to `main` should trigger a deployment.

What we want is to run the tests *after* Netlify has executed the build command but *before* it has published the `_site` directory. This way, if tests were to fail, so would the deployment and the broken version wouldn’t be published.

I think the idiomatic way is to have a [Netlify Build Plugin](https://docs.netlify.com/extend/install-and-use/build-plugins/) which is the official way to hook into Netlify’s different build stages. But this seems quite overkill when we can just modify our build command to run the tests as well:

```diff
- npm run build
+ npm run build && npm test
```

This does what we want: it triggers a build, and then runs the tests. It exits with a non-0 code if the tests fail, which would abort the whole deploy.

## Wrapping up

It’s not sophisticated, but it does the job well. It gives me some confidence when refactoring code, and it saves me time not having to do manual checks with every change. 

*It ain’t much, but it’s honest work.*