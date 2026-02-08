---
layout: snippet
tags: snippets
title: getMacOsVersion()
description: Retrieving the macOS version
permalink: /snippets/get-mac-os-version/
language: Node.js
related: /2020/09/09/writing-a-debug-script/
---

If you ever need to programmatically display the current macOS version from a Node.js script but do not want to rely on external dependencies such as [macos-release](https://github.com/sindresorhus/macos-release) or [os-name](https://github.com/sindresorhus/os-name), you can use the following technique:

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
