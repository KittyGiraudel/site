---
layout: snippet
tags: snippets
title: groom_dead_code()
permalink: /snippets/groom-dead-code/
language: Bash
related: /2020/11/18/looking-for-dead-code/
---

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
