---
layout: snippet
tags: snippets
title: getMacOsVersion()
permalink: /snippets/getmacosversion/
language: Node.js
related: /2020/09/09/writing-a-debug-script/
---

```js
const { readFileSync } = require('fs')
const xml2js = require('xml2js')

const getMacOsVersion = async () => {
  const path = '/System/Library/CoreServices/SystemVersion.plist'
  const content = readFileSync(path, 'utf8')
  const { plist } = await xml2js.parseStringPromise(content)

  // Returns `Mac OS X` (at index 2) and `10.15.6` (at index 3)
  return plist.dict[0].string.slice(2, 4).join(' ')
}
```
