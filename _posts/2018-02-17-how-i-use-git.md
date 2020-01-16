---
title: How I use Git
tags:
  - git
  - tips
  - workflow
  - process
---

After [a tweet about how I like Git but find it hard to use](https://twitter.com/HugoGiraudel/status/964875913371570177), I thought it would be interesting to share how I use it on a daily basis. Including some cool aliases and practices you can borrow right away. It’s a bit long so here is a table of contents:

* [Getting information](#getting-information)
* [Working with branches](#working-with-branches)
* [Doing some work](#doing-some-work)
* [Undoing some work](#undoing-some-work)
* [Getting up to date](#getting-up-to-date)
* [Rewriting history](#rewriting-history)

_If you’re unaware what Git is, I wrote [Git, the practical very basis](http://adopteungit.fr/en/methodology/2017/07/02/git-practical-very-basics.html) on my brother’s blog where I explain the baby steps in version control. Check it out._

## Getting information

I quickly realised there is no way to be comfortable with command-line Git in the default OS terminal. On macOS, I recommend installing iTerm2 and [pimping it to display the branch name as part of the prompt](https://github.com/HugoGiraudel/dotfiles/blob/master/.bashrc). Also, colors. I mean, look at that beauty:

![A display of my Git prompt including the branch name](/assets/images/how-i-use-git/git-prompt.png)

The command I type the most has to be `git status`, and given how annoying that word can be, I have `git s` for short. The other thing that’s very important, [especially when rebasing](#rewriting-history) is to be able to see what the history looks like.

There is `git log` but that’s a very blend display of the past commits, not too mention unbearable to read. Because I like my Git logs to reflect what really happened, I have a `git lg` that’s short for `git log --pretty=oneline --abbrev-commit --graph --decorate`. I am _not_ typing this by hand.

This creates a nice graph with the commits id, message, branch name, etc. Like this:

![Example output of my `git lg` alias](/assets/images/how-i-use-git/git-lg.png)

## Working with branches

To quickly jump between branches, I created a few aliases. At N26, the `master` branch is the protected release branch, and `develop` is the main one—also protected. Everything goes through pull-requests against the main branch.

I aliased `git checkout` as `git co` and `git branch` as `git br`:

```sh
$ git br -D feature/my-old-feature
$ git co -b feature/my-new-feature
```

To make it easier to move to the `master` and `develop` branches (as it can happen quite a lot, especially `develop`), I created the `git com` and `git cod` aliases respectively.

## Doing some work

The basics of Git are adding some files to the index, committing the index in history, then pushing the history diff to the remote. Also known as “add-commit-push”.

I didn’t alias the `add` command because it’s short enough that an alias is not necessarily going to bring me any value. I could alias to `git a` but at this stage it would be more annoying to deal with muscle memory than typing these two extra characters. I did alias `git commit -m` into `git cm` though.

```sh
$ git add .
$ git cm "Replace a regular expression with a split in the forwarder"
$ git push
```

When it comes to pushing, I like to avoid having to type the name of the remote (usually `origin`) and the name of the branch. Problem is Git 1.\* uses `matching` as a default configuration for the `push` command without arguments. This pushes _all_ branches using the same name locally and on the upstream repository.

Because this is a terrible default value (which has been changed in Git 2.\* for safety reasons), I updated the push configuration in my `.gitconfig` (and made all my coworkers do the same):

```sh
# See: https://git-scm.com/docs/git-config#git-config-pushdefault
[push]
  default = current
```

## Undoing some work

Git’s interface to undo things is unbearable in my opinion. `git reset --soft HEAD^`, what the hell is that? So let’s see how I make undoing/redoing things easy.

To undo a commit entirely, I created a `git undo` alias (short for `git reset --soft HEAD^`) which deletes the last commit from history but keeps the changes in the index in case I want to do something with them.

To move things out of the index (the opposite of `git add`), I have `git wait` (for `git reset HEAD`). And to remove things from the index entirely, I aliased `git checkout .` into `git abort`. I also had it under `git nope` for a while. Not sure why I ever changed though, `git nope` is gold.

So let’s say I realised my last commit was complete poppycock and I want to undo all of it and never speak of it ever again:

```sh
$ git undo  # This undoes the last commit
$ git wait  # This moves staged files out of the index
$ git abort # This cancels anything in the index
```

## Getting up to date

Updating a branch with the main one is done through fetching and rebasing with the origin (or merging but that’s not my thing). I didn’t alias `git fetch`, but I did create `git rod` for `git rebase origin/develop` —mostly because I never remember if it should be a space or a slash.

```sh
$ git fetch && git rod # Boom, up to date
```

Updating `develop` with its remote counterpart is done through `git pur` (or `git purr` for when I feel particularly kitty) for `git pull --rebase`. The `--rebase` flag unsprisingly rebases the current branch on top of the upstream branch after fetching. This avoids a merge commit whenever I get up to date with the remote branch.

## Rewriting history

When working on a branch, I commit frequently and tend to rewrite my commits many times. The goal is that once the feature is done, the [branch history should be clean, helpful and explicit](https://twitter.com/HugoGiraudel/status/963003283156631554). Someone could start reviewing my PR by checking the list of commits and have a pretty good idea of what’s happening before even looking at the code.

![Example of a clean branch commits history](/assets/images/how-i-use-git/branch-commits-history.png)

To achieve that, I rebase a lot. I know a lot of people don’t like rebasing, and that’s a shame. Rebase is an outstanding tool to make sure the history of the branch you work on is meaningful. I don’t want to open that can of worms, but if you’d like my take on rebasing vs merging: rebase feature branches until they are clean, merge them into main branches. Been running like this for years including on projects with multiple developers and it’s been great.

Anyway, the point is: I do a lot of interactive rebases. My usual workflow looks like this: do a bit of work, do a commit, realise I forgot something therefore update the history (no “fix” commit with me). Eventually push the history onto the remote.

If the commit I want to update is the very last one in history, that’s rather easy: there is `git amend` (short for `git commit --amend --no-edit`). This simply adds what’s in my index to the last commit, without even asking me if I want to change the message.

```
$ git add path/to/file/i/updated.js
$ git amend
```

If the commit is further away in the history of the branch though, I need something more powerful. Usually, I rebase `n` commits in the past. Git opens a Visual Studio Code tab/window (yep) to ask me what to do with all them commits. I edit and save this file to continue the rebase, until I’m done. Let’s unfold this.

The command to rebase `n` commits is `git rebase -i HEAD~n` but seriously, who has time for that? I created a `git rb` alias that accepts a number argument. Here it is:

```
rb = "!sh -c \"git rebase -i HEAD~$1\" -"
```

I can use it like this:

```
$ git rb 2
```

I’m not a fan a Vim, so I made Visual Studio Code my editor for Git. You can do that by updating your `.gitconfig` like so (provided `code` is in your PATH):

```
[core]
  editor = code -w
```

After running the `git rb` command, a Visual Studio Code tab gets open with content like this:

```sh
pick a22f893d3 Inline outputPath and chunkOutputPath in the client-side configuration
pick 5b861eb7f Add process.env.STATS_MODE to configure stats option

# Rebase 2ec919432..5b861eb7f onto 2ec919432 (2 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit’s log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
```

I can change the `pick` keyword to `edit` (or the action of my choice). When I save and close this window (<kbd>⌘S</kbd>, <kbd>⌘W</kbd>), the rebase starts and applies commit one by one, stopping on these I tagged for edition. On these, I can perform the changes I want, then add my files and do `git rc` (for `git rebase --continue`), until the rebase is complete. Note that I also aliases `git rebase --abort` to `git ra` and `git rebase --skip` to `git rs` for consistency.

At this stage, I might need to update the remote branch with the new history. To do so, I have a `git force` alias which is a shortcut for `git push --force-with-lease`. The `--force-with-lease` argument is a seriously underrated option which protects all remote refs that are going to be updated by requiring their current value to be the same as the remote-tracking branch we have for them. Basically, it makes sure you’re not overriding someone else’s work.

So to sum up:

```
$ git rb 2
# Tag commits for edition in VSC, ⌘S, ⌘W
$ git add path/to/file/i/updated.js
$ git rc
$ git force
```

# Wrappings things up

I have quite a few other Git tricks up my sleeve, but that will be for another article. For a complete list of my Git aliases, refer to [my dotfiles repo](https://github.com/HugoGiraudel/dotfiles/blob/master/.gitconfig).

Speaking of Git tricks, this is your reminde that my brother knows his shit and wrote on this very blog a 3-parts article on Git tips & tricks:

* [Git Tips & Tricks — part 1](https://hugogiraudel.com/2014/03/10/git-tips-and-tricks-part-1/)
* [Git Tips & Tricks — part 2](https://hugogiraudel.com/2014/03/17/git-tips-and-tricks-part-2/)
* [Git Tips & Tricks — part 3](https://hugogiraudel.com/2014/03/24/git-tips-and-tricks-part-3/)

What about you, what are your Git secrets?
