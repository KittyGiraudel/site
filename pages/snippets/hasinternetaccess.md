---
layout: snippet
tags: snippets
title: hasInternetAccess()
permalink: /snippets/hasinternetaccess/
language: Node.js
related: /2020/09/09/writing-a-debug-script/
---

```js
const { promisify }= require('util')
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
