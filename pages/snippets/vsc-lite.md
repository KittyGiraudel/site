---
layout: snippet
tags: snippets
title: VSC Lite
description: Short VSC configuration to trim out all the distracting fluff
permalink: /snippets/vsc-lite/
language: VSC
---

I _love_ Visual Studio Code. It’s a fantastic editor, and I could not picture myself using anything else. But it’s so distracting in many aspects. There is _so much_ going on. So many things on the screen you don’t even realise is there.

Here are part of my VSC configuration aiming at reducing visual noise and distractions. You can [read the rational behind some of the choices](https://twitter.com/KittyGiraudel/status/1365237163105939457?s=20) on Twitter.

```json
{
  "editor.acceptSuggestionOnCommitCharacter": false,
  "editor.codeLens": false,
  "editor.copyWithSyntaxHighlighting": false,
  "editor.dragAndDrop": false,
  "editor.hover.delay": 1200,
  "editor.lightbulb.enabled": false,
  "editor.minimap.enabled": false,
  "editor.parameterHints.enabled": false,
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "editor.suggestOnTriggerCharacters": false,
  "explorer.openEditors.visible": 1,
  "extensions.ignoreRecommendations": true,
  "git.enabled": false,
  "keyboard.touchbar.enabled": false,
  "update.showReleaseNotes": false,
  "workbench.enableExperiments": false,
  "workbench.startupEditor": "none",
  "workbench.tips.enabled": false
}
```

Additional things I hid from the UI itself:

- “Source control”, “Run” and “Accounts” from the activity bar
- “Output” and “Debug console” from the integrated terminal
- “Editor indentation”, “Editor encoding”, “Editor End of Line”, “Tweet feedback” and “Notifications” from the status bar
