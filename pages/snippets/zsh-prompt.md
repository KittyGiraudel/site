---
layout: snippet
tags: snippets
title: zsh prompt
description: zsh configuration to have a pretty custom prompt
permalink: /snippets/zsh-prompt/
language: zsh
related: /2022/10/29/making-sense-of-zsh/
---

A small and neat zsh configuration to enable Git autocompletion and customize the prompt.

![Screenshot of a zsh prompt featuring: a green or red bullet based on the status of the previous command; the name of the current folder in pink; the name of the current branch in blue; the command in white; and the current time in gray on the right side.](/assets/images/making-sense-of-zsh/zsh-prompt.png)

```bash
autoload -Uz compinit && compinit
autoload -Uz vcs_info
precmd() { vcs_info }
setopt PROMPT_SUBST
zstyle ':vcs_info:git:*' formats '%F{153}%b%f'
PROMPT='%(?.%F{green}●.%F{red}●%f) %F{211}%1~%f ${vcs_info_msg_0_} '
RPROMPT='%F{245}%*%f'
```

If you want to make sense of the `PROMPT` variable, here is a commented out version:

```bash
#       %(                       )                                  ternary expression
#         ?                                                         result of the previous command
#          .          .                                             ternary separators
#           %F{green}  %F{red}     %F{211}                          text color codes
#                    ●        ●                                     bullet character
#                              %f            %f                     text color reset
#                                         %1~                       current directory
#                                               ${vcs_info_msg_0_}  VCS branch name
PROMPT='%(?.%F{green}●.%F{red}●%f) %F{211}%1~%f ${vcs_info_msg_0_} '
```
