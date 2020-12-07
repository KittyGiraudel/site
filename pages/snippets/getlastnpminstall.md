---
layout: snippet
tags: snippets
title: getLastNpmInstall()
permalink: /snippets/getlastnpminstall/
language: Node.js
related: /2020/09/09/writing-a-debug-script/
---

```js
const { stat } = require('fs')
const { promisify } = require('util')
const moment = require('moment')
const getStats = promisify(stat)

const getLastNpmInstall = () => {
  const stats = await getStats('./node_modules/moment')
  const lastInstall = moment(stats.birthtime)

  return lastInstall.fromNow() // E.g. 3 days
}
```
