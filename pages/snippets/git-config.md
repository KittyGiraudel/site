---
layout: snippet
tags: snippets
title: git-config
description: Drop-in advanced git configuration file
permalink: /snippets/git-config/
language: Git
related: /2018/02/17/how-i-use-git/
---

Here is my personal git configuration (living in `~/.gitconfig`) with comments to explain what every option does.

```bash
[color]
  # Enable colors in color-supporting terminals
  ui = true

[core]
  # Use VSCode as main git editor
  editor = code -w
  ignoreCase = false
  pager = diff-so-fancy | less --tabs=4 -RFX
  # Don’t consider trailing space change as a cause for merge conflicts
  whitespace = -trailing-space

[diff]
  # Use better, descriptive initials (c, i, w) instead of a/b.
  mnemonicPrefix = true
  # Show renames/moves as such
  renames = true
  # Display submodule-related information (commit listings)
  submodule = log
  # Use VSCode as default diff tool when running `git difftool`
  tool = vscode

[difftool]
  prompt = false

[difftool "vscode"]
  cmd = code --wait --diff $LOCAL $REMOTE

[fetch]
  fsckobjects = true
  # Auto-fetch submodule changes (sadly, won’t auto-update)
  recurseSubmodules = on-demand

[filter "media"]
  clean = git media clean %f
  required = true
  smudge = git media smudge %f

[log]
  # Use abbrev SHAs whenever possible/relevant instead of full 40-chars
  abbrevCommit = true
  # Disable decorate for reflog
  decorate = false
  # Automatically --follow when given a single path
  follow = true

[merge]
  # Display common-ancestor blocks in conflict hunks
  conflictstyle = diff3

# Custom/dedicated merge drive for npm lock files (`package-lock.json`)
# See https://www.npmjs.com/package/npm-merge-driver
[merge "npm-merge-driver"]
  name = automatically merge npm lockfiles
  driver = npx npm-merge-driver merge %A %O %B %P

[mergetool]
  # Clean up backup files created by merge tools on tool exit
  keepBackup = false
  # Clean up temp files created by merge tools on tool exit
  keepTemporaries = false
  # Auto-accept file prompts when launching merge tools
  prompt = false
  # Put the temp files in a dedicated dir anyway
  writeToTemp = true

[pager]
  difftool = true

[push]
  default = current
  # When pushing, also push tags whose commit-ishs are now reachable upstream
  followTags = true

[rebase]
  # Automatically stash current WD and stage when running rebase
  autoStash = true

[receive]
  fsckObjects = true

[status]
  # Recursively traverse untracked directories to display all contents
  showUntrackedFiles = all
  # Display submodule rev change summaries in status
  submoduleSummary = true

[tag]
  # Sort tags as version numbers whenever applicable
  sort = version:refname

[transfer]
  fsckobjects = true

[versionsort]
  prereleaseSuffix = -pre
  prereleaseSuffix = .pre
  prereleaseSuffix = -beta
  prereleaseSuffix = .beta
  prereleaseSuffix = -rc
  prereleaseSuffix = .rc
```
