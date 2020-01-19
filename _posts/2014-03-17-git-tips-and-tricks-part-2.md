---
guest: Loïc Giraudel
title: Git tips and tricks — Part 2
tags:
  - git
---

> **Edit (2014/03/24):** Part 3 is out! Go check [it](/2014/03/24/git-tips-and-tricks-part-3/).

<!-- -->

> Hi dear folks! This is the 2nd part of the _Git Tips & Tricks_ series from Loïc Giraudel. If you missed the first post, be sure to [give it a read](/2014/03/10/git-tips-and-tricks-part-1/)! And now fasten your belts folks, because this is some serious Git fu!

Hey people! I hope you enjoyed the first part of the series. In this one, I will introduce you even more tricks to improve the diff output, create some useful aliases and master (no pun intended) mandatory commands to be able to approach advanced Git concepts and commands. Ready?

## Improve diff output

### Avoid ^M in diff

Unix and Windows systems have different end-of-line characters. This is a problem when Windows and Unix developers work on the same Git project: Unix developers can see uglies `^M` symbols at the end of lines created by Windows developers.

To stop viewing those `^M` symbols, just change the `whitespace` option:

```git
$ git config --global core.whitespace cr-at-eol
```

### Remove file prefix in diff

By default, the `git diff` command displays the filename with either `a/` or `b/` prefix:

```git
$ git diff
diff --git a/Gruntfile.js b/Gruntfile.js
index 74d58f9..569449c 100755
&ndash;&ndash;&ndash; a/Gruntfile.js
+++ b/Gruntfile.js
```

This prefix can be a little bit annoying when you want to quickly copy and past the filename (for instance to paste it in a `git add` command). Thus, the prefix is quite useless so you can remove it in the diff output with the `--no-prefix` parameter:

```git
$ git diff --no-prefix
diff --git Gruntfile.js Gruntfile.js
index 74d58f9..569449c 100755
&ndash;&ndash;&ndash; Gruntfile.js
+++ Gruntfile.js
```

To avoid adding the flag on every single diff command, you can make it a default option in your config:

```git
$ git config --global --bool diff.noprefix true
```

## Create your own aliases

Do you know that you can create your own Git aliases ?

```git
$ git config --global alias.co "checkout"
$ git config --global alias.br "branch"
$ git config --global alias.cob "checkout -b"
$ git config --global alias.rh "reset HEAD"

$ git co master
$ git br someStuff origin/someStuff
$ git cob someStuff origin/someStuff
$ git rh myFile
```

My most used Git command is `git status` but instead of creating an alias like `git st`, I created a bash alias in my `~/.bashrc` file:

```git
$ cat ~/.bashrc
[…]
alias gst="git status"
```

### Create a bash alias to go back to project root

If your project has a deep directory tree, it can be useful to have a bash alias to go back to the root of the Git project in one line instead of multiple `cd ..` commands or counting `/..` in a `cd ../../../..` command.

For unix systems, this alias looks like this (put it in your `~/.bashrc` file):

```git
/home/workspace/myProject $ alias gr='[ ! -z `git rev-parse --show-cdup` ] && cd `git rev-parse --show-cdup || pwd`'
/home/workspace/myProject $ cd test/phpunit/apps/sso/lib/action/
/home/workspace/myProject/test/phpunit/apps/sso/lib/action $ gr
/home/workspace/myProject $
```

If you happen to be curious, feel free to explore the `git rev-parse` command: it’s a magic command used by many other commands to do many different things. The manual page says:

> "git-rev-parse - Pick out and massage parameters"

For instance, this command can convert a commit ref to a real SHA1:

```git
$ git rev-parse HEAD~17
7f292beec1e55e33d911a942f59e942a04828935
```

It can return the `.git` path of the current project:

```git
$ git rev-parse --git-dir
/home/workspace/myProject/.git
```

It can return the relative path to go back to project root:

```git
/home/workspace/myProject/test/phpunit/apps/sso/lib/action $ git rev-parse --show-cdup
../../../../../../
```

## Change default message editor

In Unix system, the default commit message editor is VI. To use your favorite editor, edit the core.editor option:

```git
$ git config --global core.editor "~/Sublime\ Text\ 3/sublime_text -w"
```

## Track a remote branch

Large scale projects have many Git branches: developers create new ones every day, do many merges, switch to branches created by workmates, co-develop features in shared branches and so on.

It’s possible to track a remote branch, which displays useful informations in the `git status` command:

```git
$ git status
# On branch infinite-scroll
# Your branch and 'origin/sharedBranches/frontendTeam/infinite-scroll' have diverged,
# and have 1 and 2 different commits each, respectively.
nothing to commit (working directory clean)
```

In the previous example, I’m on a local _infinite-scroll_ branch which is tracking a _sharedBranches/frontendTeam/infinite-scroll_ branch in the _origin_ repository. My branch and the remote one have differed: my branch contains 1 commit which is not in the remote branch and the remote branch contains 2 commits which are not in my local branch. I will have to merge or rebase the remote branch if I want to push in the same remote location.

To track a remote branch you can type the following command:

```git
$ git branch --set-upstream [name of the local branch] [name of the remote branch]
```

For instance:

```git
$ git branch --set-upstream infinite-scroll origin/sharedBranches/frontendTeam/infinite-scroll
```

If you happen to be running Git version >= 1.8.0, you can use the `-u` or `--set-upstream-to` parameter:

```git
$ git branch -u [remote branch]
$ git branch -u origin/sharedBranches/frontendTeam/infinite-scroll
$ git branch --set-upstream-to origin/sharedBranches/frontendTeam/infinite-scroll
```

When you create a new branch, you can specify a starting point. If this starting point is a remote branch (and not a local branch or a commit), the new branch will track the starting point.

```git
$ git branch foo origin/master
Branch foo set up to track remote branch master from origin.
$ git checkout foo
Switched to branch 'foo'
Your branch is up-to-date with 'origin/master'.
```

This is the default behavior but can be changed in your configuration with the `branch.autosetupmerge` parameter. The default value is `true` but if you want to track the starting point even if it’s a local branch, switch it to `always`.

```git
$ git config --global branch.autosetupmerge always
$ git branch bar foo
Branch bar set up to track local branch foo.
```

If you don’t want to track the starting point neither it’s a local nor remote branch, use `false`.

```git
$ git config --global branch.autosetupmerge false
$ git branch foo origin/master
$ git checkout foo
Switched to branch 'foo'
$ git status
# On branch foo
nothing to commit, working directory clean
```

## How to delete a remote branch

It’s quite easy to delete a local branch with the `-d` and `-D` parameters of `git branch` command, but the syntax to delete a remote branch is not so instinctive. Actually you don’t really _delete_ a remote branch per se; instead you push _nothing_ to an existing destination.

The `git push origin master` command is a shortcut to the command `git push origin master:master`. The `master:master` syntax means `local-branch-name:destination-branch-name`. So to push _nothing_ to a remote branch, you can use the following command:

```git
$ git push origin :myBranch
```

Luckily, since Git 1.7.0, there is an easier syntax to do this:

```git
$ git push origin --delete myBranch
```

## Use a Git message template

> Using a message template for Git commits is a good practice.

Using a message template for Git commits is a good practice, especially in big projects with a lot of people involved. It helps finding commits relative to a specific feature, relative to a specific work team, etc.

To change the default template, you can write a small text file somewhere on your disk, then reference it in your Git configuration:

```git
$ git config --global commit.template /home/loic/git/committemplate.txt
```

Here’s what my `committemplate.txt` looks like:

```git
$ cat /home/loic/git/committemplate.txt
[MyTeam] [#FeatureId] - Description of the feature
More informations about the feature
```

Unfortunately, it’s not possible to use a bash script instead of a text message, to &mdash; let’s say &mdash; dynamically add the branch name. Fortunately, the same thing can be done with Git hooks.

_Hooking_ is a common programming pattern to allow user to improve the behavior of a software by allowing custom piece of code to run at a specific moment.

With Git, you can create a client-side hook running before user writes his commit message. A hook can retrieve some informations to pre-fill the commit message. Let’s create one in order to fill the commit message with the local branch name, shall we?

```git
$ cat .git/hooks/prepare-commit-msg
#/bin/bash

branchname=`git rev-parse --abbrev-ref HEAD`
commitMsgFile=$1
commitMode=$2

# $2 is the commit mode
# if $2 == 'commit'  => user used `git commit`
# if $2 == 'message' => user used `git commit -m '…'`

existingMsg=`cat $commitMsgFile`
if [ "$commitMode" = "message" ]; then

  echo -n "[$branchname] " > $commitMsgFile
  echo $existingMsg >> $commitMsgFile

else

  firstline=`head -n1 $commitMsgFile`

  # We check the fist line of the commit message file.
  # If it’s an empty string then user didn’t use `git commit --amend` so we can fill the commit msg file
  if [ -z "$firstline" ]; then
    echo "[$branchname] " > $commitMsgFile
  fi

fi
```

Now let’s try our new hook:

```git
$ git checkout -b my-local-branch
Switched to a new branch 'my-local-branch'
$ echo 'Some text' > file1
$ git add file1
$ git commit
```

My text editor opens with the following content:

```git
[my-local-branch]
```

I can update this message to add some informations. If I amend my commit to change the message, it shouldn’t overwrite my message :

```git
$ git log -1 --oneline
cd2b660 [my-local-branch] This is my awesome feature.
$ git commit --amend
```

My text editor opens with the following content:

```git
[my-local-branch] This is my awesome feature.

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch my-local-branch
# Changes to be committed:
#   new file:   file1
#
# Untracked files:
#   commit
#
```

And if I try to commit with a `-m` parameter:

```git
$ echo 'Some text' > file2
$ git add file2
$ git commit -m 'This is another feature'
$ git log -1 --oneline
4d169f5 [my-local-branch] This is another feature
```

## Split a file modification into two commits

Now we’ve covered the basics, let’s move on to some advanced Git techniques. Those tricks get useful when you have a complex Git environment which can require:

* to regularly merge or rebase with other developers' stuff (which can introduce conflicts)
* to play with commits (split, inject, merge, reorder)
* to dig deep in your commit history to find the origin of a bug
* to juggle with many branches
* to use some submodules to split your project into several parts

> Each commit must have only one purpose.

Each commit must have only one purpose (c.f. Law #2 at the beginning of the Git Tips & Tricks - Part 1), but it’s easy to find some small mistakes when editing a file. If you don’t want to add those little fixes when you’re creating your commit in order to put them in a dedicated commit, the best way is to split the file modifications when adding the file to the staging area.

To do this you can use the `--patch` (or `-p`) parameter with the `git add` command.

Let’s take an example:

```git
$ echo "Here’s my tetx file" > file.txt
$ git add -A
$ git commit -m 'Initial commit'
```

I’ve just created a text file with only one line. Now, I just want to add a second line but while editing my file, I see that I wrote “tetx file” and not “text file” so I add my new line and I fix the first one in the same time. Let’s see what our diff looks like:

```git
$ git diff
diff --git file.txt file.txt
index 6214953..1d54a52 100644
&ndash;&ndash;&ndash; file.txt
+++ file.txt
@@ -1 +1,2 @@
-Here’s my tetx file
+Here’s my text file
+And this is the second line
```

If I want to split the two changes in two separate commits, I can use the `--patch` parameter. Let’s try to create a first commit fixing the mistake and a second commit adding the new line:

```git
$ git add --patch file.txt
diff --git a/file.txt b/file.txt
index 6214953..1d54a52 100644
&ndash;&ndash;&ndash; a/file.txt
+++ b/file.txt
@@ -1 +1,2 @@
-Here’s my tetx file
+Here’s my text file
+And this is the second line
Stage this hunk [y,n,q,a,d,/,e,?]?
```

At the end of the `git add` command, there is a prompt message asking me if I want to add this hunk to the commit. The available options are:

* **y**es,
* **n**o,
* **q**uit,
* **a**ll later hunks (including current one),
* **d**on’t add all the later hunks (included current one),
* search for a hunk with a regexp (**/**),
* **e**dit the current hunk,
* show some help (**?**).

If I type **e**, the hunk will be opened in my text editor:

```git
# Manual hunk edit mode -- see bottom for a quick guide
@@ -1 +1,2 @@
-Here’s my tetx file
+Here’s my text file
+And this is the second line
# &ndash;&ndash;&ndash;
# To remove '-' lines, make them ' ' lines (context).
# To remove '+' lines, delete them.
# Lines starting with # will be removed.
#
# If the patch applies cleanly, the edited hunk will immediately be
# marked for staging. If it does not apply cleanly, you will be given
# an opportunity to edit again. If all lines of the hunk are removed,
# then the edit is aborted and the hunk is left unchanged.
```

The first commit should only fix the mistake so let’s remove the **+And this is the second line** line and save the change:

Now, if I launch a `git status` command, I can see this:

```git
$ git status
# On branch master
# Your branch is ahead of 'origin/master' by 1 commit.
#
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
# modified:   file.txt
#
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#   (use "git checkout -- <file>..." to discard changes in working directory)
#
# modified:   file.txt
#
```

My file is partially staged. If I want to see the staged part:

```git
$ git diff --cached
diff --git file.txt file.txt
index 6214953..cc58d14 100644
&ndash;&ndash;&ndash; file.txt
+++ file.txt
@@ -1 +1 @@
-Here’s my tetx file
+Here’s my text file
```

If I want to see the unstaged part:

```git
$ git diff
diff --git file.txt file.txt
index cc58d14..1d54a52 100644
&ndash;&ndash;&ndash; file.txt
+++ file.txt
@@ -1 +1,2 @@
 Here’s my text file
+And this is the second line
```

Now, I can create my first commit easily, then create the second one:

```git
$ git commit -m 'Typo fix'
[master 87edc4a] Typo fix
 1 file changed, 1 insertion(+), 1 deletion(-)

$ git add file.txt
$ git commit -m 'Add of a new line'
[master a11a14e] Add of a new line
 1 file changed, 1 insertion(+)

$ git log
commit a11a14ef7e26f2ca62d4b35eac455ce636d0dc09
Author: lgiraudel <lgiraudel@mydomain.com>

    Add of a new line

commit 87edc4ad8c71b95f6e46f736eb98b742859abd95
Author: lgiraudel <lgiraudel@mydomain.com>

    Typo fix

commit 3102416a90c431400d2e2a14e707fb7fd6d9e06d
Author: lgiraudel <lgiraudel@mydomain.com>

    Initial commit
```

## Pick a commit from another branch

It’s sometimes useful to pick a commit from another branch to add it in the current branch.

The command to do this is really simple:

```git
$ git cherry-pick [commit SHA1]
```

This command has some useful parameters:

* `-e` to edit git message
* `-x` to add a line "Cherry-picked commit" in the commit message
* `--no-commit` or `-n` to apply the commit changes in the unstaged area (unstead of creating a commit in the branch)

## Final thoughts

That’s it for today folks! In the next parts, we’ll deal with the following subjects:

* fix conflicts with graphical tools
* find a bug with a dichotomous process
* why push must be forced sometimes
* understand difference between merge and rebase
* submodules

Meanwhile keep practicing!

> Loïc Giraudel works as a front-end developer at Best Of Media (Grenoble, France). He is a JavaScript and Git expert. You can catch him on Twitter: [@l_giraudel](https://twitter.com/l_giraudel).
