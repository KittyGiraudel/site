---
layout: snippet
tags: snippets
title: groom_dead_code()
description: Small bash function to find dead code in a JavaScript project
permalink: /snippets/groom-dead-code/
language: Bash
related: /2020/11/18/looking-for-dead-code/
---

This `groom_dead_code` Bash function performs loose grep checks to figure out whether files & folders in a given directory are imported in JavaScript files (either with `require` or `import`). It can lead to false positives though, tread carefully.

Add this function to `.zshrc` or `.bashrc`:

```bash
function groom_dead_code {
  root="${2:-.}"
  for entry in "$1"/*
  do
    name=$(basename $entry)
    if [[ -z "$(grep -r "/$name'" $root)" ]]; then
      echo "$entry is unused"
    fi
  done
}
```

Then use it like this:

```bash
groom_dead_code src/components
```
