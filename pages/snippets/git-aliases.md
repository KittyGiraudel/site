---
layout: snippet
tags: snippets
title: git-aliases
permalink: /snippets/git-aliases/
language: Git
related: /2018/02/17/how-i-use-git/
---

```bash
[alias]
  # Discard duplicate leading “git” (e.g. “git git status”)
  git = "!git"

  # The basic aliases
  s = status
  cm = commit -m
  cp = cherry-pick

  # Branch related aliases
  br = branch
  co = checkout
  com = checkout master
  cod = checkout develop
  groom = "!f() { git branch --merged | egrep -v \"(^\\*|main|master|develop)\" | xargs git branch -d; }; f"

  # Syncing related aliases
  pur = pull --rebase
  prune = fetch --prune

  # Rebase related aliases
  ri = rebase -i
  rb = "!sh -c \"git rebase -i HEAD~$1\" -"
  rc = rebase --continue
  ra = rebase --abort
  rs = rebase --skip
  re = rebase --exit
  rod = rebase origin/develop
  rom = rebase origin/master

  # Stash related aliases
  poop = stash pop
  wip = commit -m "WIP" -n
  stsh = stash save --include-untracked

  # Push related aliases
  force = push --force-with-lease
  fam = "!f() { git add . && git amend && git force; }; f"

  # Mistake related aliases
  abort = checkout -- .
  wait = reset HEAD
  undo = reset --soft HEAD^
  amend = commit --amend --no-edit

  # Diff related aliases
  changes = diff --name-status
  lg = log --pretty=oneline --abbrev-commit --graph --decorate

  # Alias related aliases
  aliases = ! git config --get-regexp ^alias\\. | sed -e s/^alias\\.// -e s/\\ /\\ =\\ /
```
