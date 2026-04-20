---
title: Content Negotiation on Netlify
description: A technical piece on setting up an edge function on Netlify to handle Markdown negotiation for AI agents.
tags:
  - Netlify
  - AI
  - Markdown
---

Over the weekend, I was checking [Is Your Site Agent Ready?](https://isitagentready.com/) by Cloudflare, and one of the recommendations is to set up *content negotiation* to allow agents to consume Markdown instead of HTML.

I recently wrote about [serving Markdown to LLMs in Eleventy](/2026/03/11/serving-markdown-to-llms-with-11ty/). We’ll build upon it for content negotiation, so if you haven’t read the first article, now is a good time.

If you just want to get the code for the Netlify function, [head to the repository](https://github.com/KittyGiraudel/site/blob/main/netlify/edge-functions/markdown-negotiation.ts).

## Content negotiation

[Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation) is a mechanism for serving different representations of the same resource at the same URL depending on the context. It’s not a novel idea, and is used all over the place, from image formats to internationalization purposes.

When applied to AI, there is this idea that LLMs could be requesting Markdown by sending an `Accept: text/markdown` HTTP header, and servers would return a Markdown response instead of the usual HTML resource. This should significantly reduce token consumption, at least in theory.  

{% callout %}
I think it’s worth keeping in mind that last month, in March, not a single AI crawler was using content negotiation. It is likely evolving in the right direction, but this is still relatively novel in that context so it’s not going to be a game-changer overnight.
{% endcallout %}

## On Netlify

I’m hosting this site (and a few others) on Netlify, so this is what we’re going to be looking at today. While the core concept is likely transposable to other hosting platforms, the APIs we’ll be using are specific to Netlify.

Namely, we’ll be using [Netlify Edge Functions](https://docs.netlify.com/build/edge-functions/overview/), which are essentially middlewares written in JavaScript or TypeScript and running on Deno (which is similar to Node.js).

To get started, we’ll create `netlify/edge-functions/markdown-negotiation.ts`. An edge function needs 2 parts: a `config` object determining *when* the function should be executed, and a handler defining *what* should happen.

### Configuration

Let’s start with the configuration. There are quite a few [available options](https://docs.netlify.com/build/edge-functions/declarations/#declare-edge-functions-in-netlify-toml). We won’t use them all.

```ts
import type { Config } from '@netlify/edge-functions'

export const config: Config = {
  method: 'GET',
  header: { accept: 'text/markdown' },
  pattern: [
    String.raw`^/\d{4}/\d{2}/\d{2}/[^/]+/?$`,
    String.raw`^/\d{4}/\d{2}/\d{2}/[^/]+/index\.html$`,
    String.raw`^/\d{4}/\d{2}/\d{2}/[^/]+/index\.md$`,
  ],
}
```

We explicitly define 3 requirements for our function to run:

1. It should be a `GET` request. No other method will cause the function to run.
2. It should have the `Accept` HTTP header and its value should contain `text/markdown`, which is kinda the whole point. Note that this is not a strict equality check, it’s more akin to a regular expression.
3. It should be requesting a blog post (which uses the `/YYYY/MM/DD/slug` format) — any variant of it. Either the extension-less path (with or without a trailing slash), or the HTML file, or the Markdown file.

### Core logic

Before looking at the code, let’s walk through what the function should *actually* do. If requesting the HTML version of a blog post with an `Accept` header indicating it prefers Markdown, it should serve the Markdown version of the post.

In other words, and a bit more broken down:
1. Make sure we’re not already requesting the `.md` file.
2. Make sure we actually prefer Markdown for this request.
3. Find the Markdown counterpart of the requested URL.
4. Return this Markdown response with the appropriate headers.

This is the shell of our function:

```ts
export default async function markdownNegotiation(
  request: Request,
  context: Context,
): Promise<Response | undefined> {
  const url = new URL(request.url)
  const { pathname } = url

  // Our logic goes here …

  return new Response(body, { status, headers })
}
```

Let’s fill in the blanks. First, we want to return early if the Markdown file is being requested, since there is nothing to do:

```ts
if (pathname.toLowerCase().endsWith('.md')) {
  return context.next()
}
```

Then, we want to make sure the Markdown version is actually preferred. This step is not entirely necessary, it’s just to be more accurate. The `Accept` HTTP header has a concept of weights to indicate which media type is really preferred, so you’d typically want to parse it to know which format is expected. The `@hapi/accept` package does that neatly.

```ts
import Accept from '@hapi/accept'
```

```ts
const acceptHeader = request.headers.get('accept')
const acceptableTypes = ['text/html', 'text/markdown']
if (Accept.mediaType(acceptHeader, acceptableTypes) !== 'text/markdown') return
```

If we should return Markdown, the next step is to figure out the path to the Markdown counterpart of this post. I’ve created this `getMarkdownTwin` function for that:

```ts
function getMarkdownTwin(pathname: string): string | null {
  const HTML_PATH_RE    = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/index\.html$/i
  const EXTLESS_PATH_RE = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/

  // Test the HTML path first
  let m = pathname.match(HTML_PATH_RE)
  // If it fails, test the extension-less path
  if (!m?.[1] || !m[2] || !m[3] || !m[4]) {
    m = pathname.match(EXTLESS_PATH_RE)
    // If it fails, give up
    if (!m?.[1] || !m[2] || !m[3] || !m[4]) return null
  }

  const [, year, month, day, slug] = m
  return ['', year, month, day, slug, 'index.md'].join('/')
}
```

And if we cannot figure out the path to the Markdown file, give up. Note that this does not check the existence of a resource at that path, just that this matches a blog post URL for which we assume there is a Markdown version.

```ts
const markdownTwinPath = getMarkdownTwin(pathname)
if (!markdownTwinPath) return
```

Once we know where to look, we can perform a request to retrieve the content of the Markdown version. Netlify discourages same-site `fetch` calls from the Edge, so we let it load the file statically.

Note that we update the `Accept` HTTP header to `*/*` to avoid negotiating *again* on the inner pass (I’m actually not sure whether Netlify would execute our function here, but better safe than sorry).

If we cannot find a Markdown file at that location (or hit any sort of error), we just pass through and let the normal flow continue: serve the HTML resource.

```ts
const innerUrl = new URL(markdownTwinPath, url.origin).toString()
const innerHeaders = new Headers(request.headers)
innerHeaders.delete('accept')
innerHeaders.set('accept', '*/*')

const upstream = await context.next(
  new Request(innerUrl, {
    method: request.method,
    headers: innerHeaders,
    redirect: 'manual',
  }),
)

if (!upstream.ok || upstream.status === 404) {
  return context.next(request)
}
```

Now that we have our Markdown file, we can return its content. We want to adjust a few HTTP headers though:
- `Content-Type` can be adjusted to reflect that we are serving Markdown.
- `Vary: accept` can be set to indicate that the resource was modified based on the `Accept` header.
- `Content-Length` can be adjusted to reflect the length of the Markdown response (instead of the length of the original HTML response).
- `X-Markdown-Tokens` can be specified to indicate how many tokens are likely consumed by this response. This is optional, just to follow the [Cloudflare way](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/#x-markdown-tokens).
- `Transfer-Encoding` needs to be dropped since we modified the response and its content length.

```ts
const headers = new Headers(upstream.headers)
headers.set('content-type', 'text/markdown; charset=utf-8')
headers.set('vary', 'accept')

const text = await upstream.text()
const body = new TextEncoder().encode(text)
headers.set('content-length', String(body.byteLength))
headers.set('x-markdown-tokens', String(estimateTokens(body.byteLength)))
headers.delete('transfer-encoding')

return new Response(body, { status: upstream.status, headers })
```

And there you have it! You can look at the [complete version of the code on GitHub](https://github.com/KittyGiraudel/site/blob/main/netlify/edge-functions/markdown-negotiation.ts), including generous comments.

## Testing it

We can issue a curl request with the relevant `Accept` header and look at the headers we get back. Picking any article at random:

```
URL="https://kittygiraudel.com/2026/04/13/play-sound-on-claude-idle/"
```

No `Accept` header:

```
curl -sS -D - "$URL" \
  -o /dev/null | tr -d '\r' | grep -iE '^(HTTP|content-type|content-length|vary|x-markdown)'

  HTTP/2 200 
  content-type: text/html; charset=UTF-8
  content-length: 33756
```

`Accept` header with HTML preference:

```
curl -sS -D - "$URL" \
  -H "Accept: text/html;q=1, text/markdown;q=0.5" \
  -o /dev/null | tr -d '\r' | grep -iE '^(HTTP|content-type|content-length|vary|x-markdown)'

  HTTP/2 200 
  content-type: text/html; charset=UTF-8
  content-length: 33756
```

`Accept` header with Markdown preference:

```
curl -sS -D - "$URL" \
  -H "Accept: text/markdown;q=1, text/html;q=0.5" \
  -o /dev/null | tr -d '\r' | grep -iE '^(HTTP|content-type|content-length|vary|x-markdown)'

  HTTP/2 200 
  content-type: text/markdown; charset=utf-8
  vary: Accept-Encoding, accept
  x-markdown-tokens: 428
```

`Accept` header with Markdown preference on a resource without a Markdown version:

```
curl -sS -D - "https://kittygiraudel.com/" \
  -H "Accept: text/markdown;q=0.5, text/html;q=0.1" \
  -o /dev/null | tr -d '\r' | grep -iE '^(HTTP|content-type|content-length|vary|x-markdown)'

  HTTP/2 200 
  content-type: text/html; charset=UTF-8
  content-length: 25130
```

{% callout %}It is a little unclear to me why we do not see the `Content-Length` header after negotiation, even though our function sets it — although it seems to be normal and fine.

Cursor says that in HTTP/2, this header is optional because “framing already knows body boundaries (`DATA` frames + `END_STREAM`)”, so servers often omit `Content-Length`. Alternatively, a proxy layer on Netlify’s side may re-encode/compress the payload (`Vary` has `Accept-Encoding`), and once transformed, it recalculates the length, and possibly omits it.
{% endcallout %}

## Wrapping up

As mentioned in my previous article about the topic, I have somewhat mixed feelings about the whole thing, because we end up having to optimize our websites to make it easier for machines to ~~steal~~ consume our content. Maybe AEO is just the new SEO/performance. 

Nevertheless, it was a good learning opportunity since I had never used Netlify edge functions before, so this was fun.

Anyway, I hope it helps.