---
layout: snippet
title: Claude notifications on macOS
description: Emitting a macOS sound notification when Claude becomes idles.
permalink: /snippets/claude-notifications-macos/
language: JSON
date: 2026-04-13
related: /2026/04/13/play-sound-on-claude-idle/
tags:
  - AI
  - JSON
  - Claude
  - macOS
---

Insert the following in your Claude configuration (`.claude/settings.json`):

```json
{
	"hooks": {
		"Notification": [
			{
				"matcher": "permission_prompt",
				"hooks": [
					{
						"type": "command",
						"command": "afplay /System/Library/Sounds/Basso.aiff"
					}
				]
			},
			{
				"matcher": "idle_prompt",
				"hooks": [
					{
						"type": "command",
						"command": "afplay /System/Library/Sounds/Hero.aiff"
					}
				]
			}
		]
	}
}
```