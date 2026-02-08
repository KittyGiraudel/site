---
layout: snippet
tags: snippets
title: getLastNpmInstall()
description: Retrieving the last time npm dependencies were installed
permalink: /snippets/get-last-npm-install/
language: Node.js
related: /2020/09/09/writing-a-debug-script/
---

For debugging purposes, I needed to figure out when were `node_modules` last installed. It turns out to be surprisingly tricky to do.

The gist is to read the `birthtime` of a directory in the `node_modules` folder (here `moment` as an example). Note that upon installation, the `node_modules` folder is emptied and not recreated, so it shouldn’t be used to determine creation date.

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
