---
title: Play sound when Claude idles (on macOS)
description: A tiny article about configuring Claude to play sound notifications when requesting input (for macOS specifically).
tags:
  - AI
  - Claude
---

One thing from Cursor I really missed in Claude was the little sound when it requests input. I tend to juggle a few Claude sessions and my own stuff, so having to manually check when it needs my help is a bit tedious.

Turns out it’s pretty easy thanks to [Claude’s hooks interface](https://code.claude.com/docs/en/hooks). Update your `.claude/settings.json` file to include these hooks:

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

{% callout %}I’ve noticed that the `idle_prompt` event tends to fire quite late. Like sometimes a minute after being idle or something. It’s still useful, but it’s worth noting that it’s probably queued somewhere and not immediate.
{% endcallout %}

The command I use is specific to macOS though:

- `afplay` is a built-in macOS command-line utility used to play audio files directly from the terminal. 
- The referenced files are native macOS sound files that come pre-installed with the system.

I suppose this can be tweaked for Windows and other operating systems to something equivalent. Anyway, I hope this helps. :)