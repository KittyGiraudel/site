---
layout: snippet
tags: snippets
title: groom_dependencies()
permalink: /snippets/groom-dependencies/
language: Bash
related: /2020/11/19/managing-npm-dependencies/
---

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
```
