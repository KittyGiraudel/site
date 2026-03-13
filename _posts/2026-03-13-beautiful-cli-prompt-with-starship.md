---
title: Beautiful CLI prompt with Starship
description: A short article to promote Starship, a beautiful command line utility to make you happy.
tags:
  - CLI
  - git
---

I use the terminal a lot. I think it’s primarily because my brother taught me how to use git when I started working in software development, and so I’ve gotten comfortable with it. We’ve covered git and terminal customization on this blog before:

- *[How I use git](/2018/02/17/how-i-use-git/)* (on February 17th, 2018)
- *[Making sense of zsh](/2022/10/29/making-sense-of-zsh/)* (on October 29th, 2022)
- *[Git Tips & Tricks (Part 1)](/2014/03/10/git-tips-and-tricks-part-1/#use-an-awesome-prompt)* from my brother Loïc himself  (on March 10th, 2014)

And because I spend so much time in the terminal, I really enjoy when it’s pretty and helpful. The default Terminal application on macOS always makes me cringe: it’s so monochromatic and gloomy.

I’ve used a variety of shells and apps over the years: Git Bash, iTerm2, VSC embedded terminal, zsh… And I’ve recently discovered a new one,them all: [Starship](https://starship.rs/).

## What’s Starship

Starship is a minimal, fast, and customizable prompt for any shell. It’s built with compatibility in mind, it’s written in Rust and it’s highly configurable, with very sensible defaults. It’s genuinely an impressive little piece of software, and you *have* to learn about it if you haven’t yet.

I’m taking the liberty to hotlink the video from their homepage:

<video  style="width: 100%" autoplay muted loop playsinline>
  <source src="https://starship.rs/demo.webm" type="video/webm">
  <source src="https://starship.rs/demo.mp4" type="video/mp4">
</video>

## Getting started

I won’t duplicate the [installation guide](https://starship.rs/installing/), you can just read through it to get started. I will mention though that Starship approaches configuration in a very clean way:

1. **Separate configuration file:** It uses its own configuration file instead of stuffing a bunch of things in your `.bashrc` or `.zshrc` or whatever else. So you’ll end up having your configuration at `~/.config/starship.toml`.
2. **Perfect configuration format:** It uses [TOML](https://toml.io/en/) as a format which is objectively the best configuration format there is.
3. **Useful out of the box:** It has very sensible defaults, so you don’t need to spend hours configuring your prompt if all you want is something clean. Just adjust it as you go and need.
4. **Built modularly:** It’s built in a modular way, so the configuration remains well organized and easy to adjust (I’m looking at you VS Code with your ungodly flat config).

## My configuration

There are [a lot of options](https://starship.rs/config/) to play with.

For instance, there is a “prompt” module to really customize the prompt itself, and there is a “Python” module for everything specific to that language, and an AWS module for integration with the AWS CLI, and more. There are probably 50+ modules at the time of writing, covering most of the popular languages, frameworks, tools and more.

I like to rapidly see whether my last command exited successfully or not. Starship provides this off the bat, but I wanted to use a different character (and possibly different colors). I’ve configured it so that it uses the `●` unicode character, in green or in red depending on the exit code:

```toml
[character] # See https://starship.rs/config/#character
success_symbol = '[●](bold green)'
error_symbol = '[●](bold red)'
```

{% callout %}
I have noticed while working on this article that Visual Studio Code (upon which Cursor is built) [natively displays an exit code decoration](https://code.visualstudio.com/docs/terminal/shell-integration#_command-decorations-and-the-overview-ruler) so it is not strictly necessary to manage this within the prompt itself.
{% endcallout %}

I also like to see the current time next to my prompt, so I slot it on the right side, at the end of the line:

```toml
right_format = '$time'

[time] # See https://starship.rs/config/#time
disabled = false
format = '[$time]($style) '
style = 'bright-black'
```

I’ve also adjusted the prompt for both Node.js and Rust since these are the 2 languages I work with:

```toml
[nodejs] # See https://starship.rs/config/#nodejs
disabled = false
format = "[$symbol($version )]($style)"
symbol = ""

[rust] # See https://starship.rs/config/#rust
disabled = false
format = '[$symbol($version )]($style)'

[package] # See https://starship.rs/config/#package
disabled = false
format = '[$symbol$version]($style) '
```

<details>
<summary>In case you’re curious, this is my complete configuration at the time of writing.</summary>

```toml
# Get editor completions based on the config schema
"$schema" = 'https://starship.rs/config-schema.json'

# Inserts a blank line between shell prompts
add_newline = false
format = '$directory$all$character'
right_format = '$time'

[character]
success_symbol = '[●](bold green)'
error_symbol = '[●](bold red)'

[aws]
disabled = true

[gcloud]
disabled = true

[azure]
disabled = true

[nodejs]
format = "[$symbol($version )]($style)"
symbol = ""
disabled = false

[line_break]
disabled = true

[git_status]
disabled = true

[time]
disabled = false
format = '[$time]($style) '
style = 'bright-black'

[cmd_duration]
min_time = 500
format = 'took [$duration](bold yellow) '

[rust]
format = '[$symbol($version )]($style)'
disabled = false

[package]
disabled = false
format = '[$symbol$version]($style) '

[directory]
truncation_length = 3
truncate_to_repo = true
use_logical_path = true
```
</details>

## Nice details

Every time I play a bit more with Starship, I’m astounded at the level of care and detail that went into it.

For instance, the `explain` subcommand provides information about each component from your current prompt in order to better understand how to customize it. Calling `starship explain` right now in my website’s directory shows this:

```
site on main v24.14.0 ● starship explain                          10:33:47 

 Here's a breakdown of your prompt:
 "on main " (17ms)    -  The active branch of the repo in your current directory
 "v24.14.0 " (63ms)   -  The currently installed version of NodeJS
 "● " (<1ms)          -  A character (usually an arrow) beside where the text is entered in your terminal
 "site " (<1ms)       -  The current working directory
 "10:33:47 " (<1ms)   -  The current local time
```

It also provides a lot of [community presets](https://starship.rs/presets/) which are basically ready-to-use TOML configuration files. I’ve played with the [Catppuccin Powerline preset](https://starship.rs/presets/catppuccin-powerline) myself as a potential bold and colorful alternative.

<figure class="figure">
  <img src="https://starship.rs/presets/img/catppuccin-powerline.png" alt="Screenshot of a Git Bash terminal featuring the colorful rainbow-like Catppuccin Powerline theme" />
  <figcaption>Catppuccin Powerline comes in a few different flavours</figcaption>
</figure>

## Wrapping up

What was supposed to be a quick 20-minute article ended up taking me 2 hours because I couldn’t help but play with all the configuration options and redesign my prompt on a loop. 😅

As I said though, you don’t need to do that, you can largely roll with the default config and just fine tune whenever something bothers you. So if you haven’t tried Starship yet, you should. ✨