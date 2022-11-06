---
title: Making sense of zsh
---

If you use a relatively recent macOS version, chances are good you’re using zsh ([Z shell](https://en.wikipedia.org/wiki/Z_shell)) as a terminal—even if you use a terminal that’s integrated to your IDE (like in Visual Studio Code for instance).

Having a nice and clean terminal is important (to me at least) and I’ve done my fair share on copying and pasting configuration snippets until I was happy enough over the years. For some reason, I decided to dig into exactly how things work under the hood, and since this is all new to me, I thought I’d write about my findings.

This blog post is a little unusual because I’m writing it as I’m doing research, so it may not be very straightforward and potentially contain inaccurate information. It’s a “learn-by-teaching” kind of thing so please, kindly point out any mistake to me on Twitter (or [edit this blog post on GitHub](https://github.com/KittyGiraudel/site/blob/main/_posts/2022-10-29-making-sense-of-zsh.md) directly).

<figure class="figure">
<img src="/assets/images/making-sense-of-zsh/zsh-prompt.png" alt="Screenshot of a zsh prompt featuring: a green or red bullet based on the status of the previous command; the name of the current folder in pink; the name of the current branch in blue; the command in white; and the current time in gray on the right side." />
<figcaption>
This is what my zsh prompt looks like, and this is what we’re going to dig into today.
</figcaption>
</figure>

## Git completion

Setting up autocompletion for Git (for branch names for instance) used to be a little tricky, but with zsh on new macOS versions, it can be done by adding the following line to one’s `~/.zshrc` file (the configuration file for zsh).

```bash
autoload -Uz compinit && compinit
```

I didn’t know what `autoload` is, so I dug a little. It appears `autoload` is a Z shell utility to load code, specifically _functions_. This [StackOverflow answer](https://stackoverflow.com/a/30840986) gives a bit more detail into what exactly it does, so I won’t go too deep into it here.

And with `autoload`, we load `compinit`. It looks like `compinit` is the [completion system](https://zsh.sourceforge.io/Doc/Release/Completion-System.html) from Z shell. Allow me to quote the docs:

> To initialize the system, the function `compinit` should be […] autoloaded (`autoload -U compinit` is recommended), and then run […] as `compinit`. This will […] re-define all widgets that do completion[…].

In other words: we instruct Z shell to use its loading module to load its completion system so that we can benefit from autocompletion, particularly for Git purposes. Neat.

## Customizing the prompt

### Displaying the branch name

I really enjoy seeing the name of the branch I am on as part of my terminal prompt. It brings clarity and saves me from mistakes. This is made possible with the `vcs_info` module. Just like we did for the completion module, we need to load this module by adding this line to our `~/.zshrc` file:

```bash
autoload -Uz vcs_info
```

This, however, is not changing our prompt. It’s just letting us access the VCS (Version Control Software) information (typically Git, but perhaps SVN or Mercurial). Now we need to do something with it.

I am clueless, but fortunately zsh comes with [nice prose about this very feature](https://github.com/zsh-users/zsh/blob/master/Misc/vcs_info-examples), and as they explain, there are plenty ways to achieve this. They say the easiest way to update one’s prompt with the VCS info is to—and I quote:

> […] drop a `vcs_info` call to your `precmd` (or into a `precmd_functions[]` entry) and include a single-quoted `${vcs_info_msg_0_}` in your `PS1` definition.

```bash
precmd() { vcs_info }
setopt PROMPT_SUBST
PS1='%3~ ${vcs_info_msg_0_} '
```

Okay. 🙃 Let’s try to understand what that means.

First, `precmd` appears to be nothing more than a function that gets executed before every command we run in the terminal. We can verify this by adding an `echo` statement to it and see it printed out every time we type in any command. Cool.

So what do we do in that pre-command hook? We call `vcs_info`, which I can only assume grants us access to the VCS information. I _think_ it exposes a variable called `vcs_info_msg_0_` (amongst others) which contains the branch name. We can confirm that by commenting out that line (or emptying the function body) and restarting the terminal: the prompt no longer contains the branch name.

Then, while the documentation doesn’t explicitly tell us to run `setopt PROMPT_SUBST`, it actually includes that line in the code snippet, so let’s have a glance at it. Looking at the [documentation](https://zsh.sourceforge.io/Doc/Release/Prompt-Expansion.html), it says:

> If the `PROMPT_SUBST` option is set, the prompt string is first subjected to parameter expansion, command substitution and arithmetic expansion.

What that means is that without that option enabled, `${vcs_info_msg_0_}` gets printed literally, instead of replaced by the actual name of the branch. So we need to turn it on in order for it to work.

Finally, the actual prompt. `PS1` (or `PROMPT`, both refer to the same variable) is the variable defining how our terminal prompt looks like. In the example above, `%3~` is the path to the current folder (to a maximum depth of 3 folders), and `${vcs_info_msg_0_}` is our VCS branch name.

Let’s pimp that up though. Here is mine:

```bash
PROMPT='%(?.%F{green}●.%F{red}●%f) %F{211}%1~%f ${vcs_info_msg_0_} '
```

It’s a bit of a beast though, so let’s break that down into digestible chunks:

1. `%(?.%F{green}●.%F{red}●%f)` is a ternary expression:

   - `?` means the exit status of the previous command. It returns `true` if the previous command exited successfully.
   - `.` acts as a separator in the ternary expression. Everything between the two `.` is evaluated when the condition is truthy; everything after the second `.` otherwise.
   - `%F{…}` updates the text color (if supported by the terminal); here to green (and red later on in the expression).
   - `●` is a litteral character we want to print. It’s just a little bullet we use as an indicator.
   - `%f` restores the text color to the default one.

2. `%F{211}%1~%f` prints the current directory in pink.

   - `%F{211}` updates the text color to a lovely pink.
   - `%1~` is the name of the current directory (technically the current path to a single directory deep).
   - Again, `%f` resets the color to the default one.

3. `${vcs_info_msg_0_}` prints the VCS name and the name of the current branch; something like `(git)-[main]-`.

To make that last part a little better, we can run the following command (_before_ defining our prompt):

```bash
zstyle ':vcs_info:git:*' formats '%F{153}%b%f'
```

`zstyle` is a Z shell module to do styling. The way I understand the first argument is that it essentially acts as scoping. Here, it says that we want to apply styling/formatting for anything within the `git` scope of the `vsc_info` module.

In the `formats` argument, `%F{153}` is a light blue color code, `%b` stands for the branch name, and `%f` resets the text color to the default one, as always.

{% info %}Changing the color of the bullet (`●`) from red to green might not be sufficient if you’re color-blind. In that case, you could use different characters, like `✓` and `𐄂`.{% endinfo %}

### Displaying the time

Z shell also exposes a `PS2` (or `RPROMPT`) variable to customize what appears on the right side of line, if anything. I personally like to display the time of the day here. This way I know when I executed a command.

```bash
RPROMPT='%F{245}%*%f'
```

By now, you should be able to get the gist of such an expression:

- `%F{245}` updates the text color to a medium grey.
- `%*` is the current time.
- And as always `%f` resets the color to the default one.

## Wrapping up

Phew! There we have it folks. A customized zsh prompt that actually makes sense. Well, for the most part that is. I hope this post was instructive! If you’re looking to make the move from bash to zsh, Armin Briegel has a fantastic series on [moving to zsh](https://scriptingosx.com/2019/06/moving-to-zsh/) (and even [a book](https://scriptingosx.com/2019/11/new-book-release-day-moving-to-zsh/)).

Here is [the full code snippet](/snippets/zsh-prompt/).
