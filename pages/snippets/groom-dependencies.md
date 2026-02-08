---
layout: snippet
tags: snippets
title: groom_dependencies()
description: Small bash function to retrieve unused npm dependencies
permalink: /snippets/groom-dependencies/
language: Bash
related: /2020/11/19/managing-npm-dependencies/
---

This `groom_dependencies` Bash function performs loose grep checks to figure out whether `package.json` dependencies are imported in JavaScript files (either with `require` or `import`). It can lead to false positives though, tread carefully.

Add this function to `.zshrc` or `.bashrc`:

```bash
function groom_dependencies {
  key=${1:-dependencies}
  for dep in $(cat package.json | jq -cr ".$key|keys|.[]");
  do [[ -z "$(grep -r  --exclude-dir=node_modules "'${dep}" .)" ]] && echo "$dep appears unused";
  done
}
```

Then use it like this:

```bash
groom_dependencies devDependencies
groom_dependencies dependencies
```
