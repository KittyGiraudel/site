---
layout: snippet
tags: snippets
title: hasInternetAccess()
permalink: /snippets/has-internet-access/
language: Node.js
related: /2020/09/09/writing-a-debug-script/
---

I needed a way to detect internet access as part of a local Node.js script and it turns out to be a little convoluted as there is no built-in way to do that (which is not too surprising either). The gist is to try resolving the Google DNS (or any other, really but Google felt like a fine choice). 

```js
const { promisify } = require('util')
const dns = require('dns')
const resolve = promisify(dns.resolve)

const hasInternetAccess = async () => {
  try {
    await resolve('www.google.com')
    return true
  } catch {
    return false
  }
}
```
