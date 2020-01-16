---
guest: Loïc Giraudel
title: Git tips and tricks — Part 3
tags:
  - git
---

> Hey folks! This is the 3rd part of the _Git Tips & Tricks_ series from Loïc Giraudel. If you missed the [first post](https://hugogiraudel.com/2014/03/10/git-tips-and-tricks-part-1/) and the [the second one](https://hugogiraudel.com/2014/03/17/git-tips-and-tricks-part-2/), be sure to give them a read! And now roll up your sleeves, because this is getting wicked!

Hi people ! Welcome to the third part of this Git Tips & Tricks series ! This week I’m going to start with 2 useful tricks to fix conflicts or just see diff in a graphical tool instead of command line. Then we’ll explore the magic of the Git `bisect` command. Finally I will show how to merge commits into a single one before pushing it. What do you think? Let’s go?

## Fix merge conflicts with a graphical tool

Whenever you face a merge conflict, you can use a merge tool to resolve it without too much headache. Just use the `git mergetool` command, it will ask you which tool to use.

## Use a graphical tool for diff

Like `git mergetool` to resolve merge conflicts, there is a `git difftool` to see diff results in a graphical tool. Unfortunately, `git difftool` opens files sequentially: after checking a file, you have to close the diff tool so Git can reopen it with the next file.

Fortunately since version 1.7.11, Git allows to see diff on a whole directory with the `--dir-diff` parameter. If you are using an older version, worry not! It’s possible to install a [small script](https://github.com/wmanley/git-meld) to do the same thing:

```git
/home/workspace $ git clone git@github.com:wmanley/git-meld.git
Cloning into git-meld...
remote: Counting objects: 64, done.
remote: Compressing objects: 100% (34/34), done.
remote: Total 64 (delta 31), reused 57 (delta 25)
Receiving objects: 100% (64/64), 17.83 KiB, done.
Resolving deltas: 100% (31/31), done.
```

Then, create a new alias _meld_ in Git, for example by adding the following line in the **[alias]** part of you _.git/config_ file:

```bash
meld = !/home/workspace/git-meld/git-meld.pl
```

Now, you just have to use `git meld` command for your diff:

```git
$ git meld HEAD HEAD~4
$ git meld myBranch myOtherBranch
```

This command will ask you which diff tool to use, then open the whole directory in the tool instead of each file sequencially.

## Find a bug with a dichotomous process

When a new bug appears in your application, the best way to fix the bug is to find which commit introduced it. Git has an awesome method to find a specific commit with a dichotomic search solution.

> In computer science, a dichotomic search is a search algorithm that operates by selecting between two distinct alternatives (dichotomies) at each step. It is a specific type of divide and conquer algorithm. A well-known example is binary search. &mdash; [Wikipedia - Dichotomic Search](https://en.wikipedia.org/wiki/Dichotomic_search)

The magic Git command is `git bisect`. This command requires 2 commits SHA1 (or references) to work: an old commit where the bug is not there and a recent commit where the bug is there. The command will checkout the commit in the middle of the interval of the two commits.

Once checkout of the _middle commit_ has been done, user has to test if the bug is still there or not and inform `git bisect` command. According to user answer, `git bisect` will checkout a commit in the middle of the first or the second half of the initial interval.

Then the user has to check the bug again and inform `git bisect`. At each step of the process, `git bisect` reduce the interval and finally returns the SHA1 of the commit which has introduced the bug.

### Manual version

Let’s take an example. I’m going to create 20 commits; each commit adding a new line “line number #” in _file.txt_. One of the insertions will have a typing error _"numer"_ instead of _"number"_. We are going to try to find the commit which has the typo with `git bisect`.

```bash
$ # I create 20 commits here
$ cat file.txt | grep number | wc -l
19
$ cat file.txt | grep numer | wc -l
1
```

Ok, I have 19 occurences of _"number"_ and 1 occurrence of _"numer"_, let’s find which commit inserted the typo. To do so, I run `git bisect` with two commits references. I know that the bug was not there 20 commits ago and is present now. So I can pass `HEAD` and `HEAD~20` for my two references.

```git
$ git bisect start HEAD HEAD~20
Bisecting: 9 revisions left to test after this (roughly 3 steps)
[2128ffe8f612d40bc15b617600b6de5f5231d58e] Commit 10
```

Git checks my interval and calculates that I will need 3 steps to find the wrong commit after current step. The commit in the middle of my interval has been checkout ("Commit 10"). If I look at my _master_ branch in Gitg (or Gitk, Gitx or any Git graphical tool…), I can see that Git has created two references _refs/bisect/start_ and _refs/bisect/good-[…]_ next to my `HEAD` and `HEAD~20` commits.

_Note: It’s possible to use `git bisect visualize` or `git bisect view` to see the remaining interval in graphical tool. For a console view, you can use `git bisect view --stat`._

![After starting git bisect](/assets/images/git-tips-and-tricks-part-3/bisect-1.png)

Now I have to check if the bug is still there or not and inform Git according to my check.

```bash
$ cat file.txt | grep numer | wc -l
1
```

The bug is still there, so I use `git bisect bad` to tell Git bisect that the current state is still broken.

```git
$ git bisect bad
Bisecting: 4 revisions left to test after this (roughly 2 steps)
[2c935028965bd60a8fe15d428feb1f3972245e75] Commit 5
```

Git bisect has reduced the commit interval and checkout the “Commit 5”. I will find the typo bug in 2 steps from now. In gitg, my master branch looks like this:

![After first git bisect bad](/assets/images/git-tips-and-tricks-part-3/bisect-2.png)

The _refs/bisect/bad_ reference has been moved to the “Commit 10”. I check if the bug is still there or not.

```bash
$ cat file.txt | grep numer | wc -l
1
$ git bisect bad
Bisecting: 2 revisions left to test after this (roughly 1 step)
[7ab0afc851dc3cdd1bee795b6bc0656d57497ca5] Commit 2
```

Now Gitg show this:

![After second git bisect bad](/assets/images/git-tips-and-tricks-part-3/bisect-3.png)

```bash
$ cat file.txt | grep numer | wc -l
0
$ git bisect good
Bisecting: 0 revisions left to test after this (roughly 1 step)
[a21e6e97e003b614793cffccbdc1a53985fc11d4] Commit 4
```

The bug wasn’t there in this step, so I use `git bisect good` instead of `git bisect bad`. Gitg has created a new _refs/bisect/good-[…]_ reference.

![After first git bisect good](/assets/images/git-tips-and-tricks-part-3/bisect-4.png)

```bash
$ cat file.txt | grep numer | wc -l
1
$ git bisect bad
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[7ae5192025b3a96520ee4897bd411ee7c9d0828f] Commit 3
```

![After third git bisect bad](/assets/images/git-tips-and-tricks-part-3/bisect-5.png)

```bash
$ cat file.txt | grep numer | wc -l
1
$ git bisect bad
7ae5192025b3a96520ee4897bd411ee7c9d0828f is the first bad commit
commit 7ae5192025b3a96520ee4897bd411ee7c9d0828f
Author: lgiraudel <lgiraudel@mydomain.com>

    Commit 3

:100644 100644 d133004b66122208e5a1841e01b77db5862548c0 cd8061d8bb277cb08d8965487ff263181a82e2e4 M  file.txt
```

Finally, Git bisect gives me the guilty commit. Let’s check its content:

```git
$ git log -1 -p
commit 7ae5192025b3a96520ee4897bd411ee7c9d0828f
Author: lgiraudel <lgiraudel@mydomain.com>

    Commit 3

diff --git file.txt file.txt
index d133004..cd8061d 100644
-- - file.txt
+++ file.txt
@@ -1,2 +1,3 @@
 line number 1
 line number 2
+line numer 3
```

Now that I have found the commit which has introduced the typo, I can read its content to find how to fix my bug. Once the bisect is finished, I can use `git bisect reset` to go back to the HEAD and clean references in my branch. This command can be used in the middle of a bisect process to stop it.

### Skip a bisect step

Sometimes, it’s not possible to check if a bug is still present on a specific commit. In this case, instead of using `git bisect good` or `git bisect bad` commands, you can use `git bisect skip` to ask a commit near the current one.

```git
$ git bisect start HEAD HEAD~20
Bisecting: 9 revisions left to test after this (roughly 3 steps)
[2128ffe8f612d40bc15b617600b6de5f5231d58e] Commit 10
$ cat file.txt | grep numer | wc -l
1
$ git bisect bad
Bisecting: 4 revisions left to test after this (roughly 2 steps)
[2c935028965bd60a8fe15d428feb1f3972245e75] Commit 5
$ git bisect skip
Bisecting: 4 revisions left to test after this (roughly 2 steps)
[7ae5192025b3a96520ee4897bd411ee7c9d0828f] Commit 3
$ cat file.txt | grep numer | wc -l
1
$ git bisect bad
Bisecting: 0 revisions left to test after this (roughly 1 step)
[7ab0afc851dc3cdd1bee795b6bc0656d57497ca5] Commit 2
$ cat file.txt | grep numer | wc -l
0
$ git bisect good
7ae5192025b3a96520ee4897bd411ee7c9d0828f is the first bad commit
commit 7ae5192025b3a96520ee4897bd411ee7c9d0828f
Author: lgiraudel <lgiraudel@mydomain.com>

    Commit 3

:100644 100644 d133004b66122208e5a1841e01b77db5862548c0 cd8061d8bb277cb08d8965487ff263181a82e2e4
```

Of course, if you skip the last steps of the bisect process, Git won’t be able to tell you which commit has introduced the bug and will return a commit range instead of a commit.

### Use a test script

If you want to avoid testing manually each step of the bisect process, you can use a test script to do it for you. Of course, it’s not always possible and sometimes you’ll spend more time creating the test than running the bisect manually. The script must return 0 if the code is good or 1 if the code is bad.

The test script is really easy to write for our usecase. For real usecases, it usually requires to use a testing techno like test unit frameworks, BDD frameworks or sanity frameworks.

```bash
#/bin/sh

exit `cat file.txt | grep numer | wc -l`
```

Now, let’s just launch `git bisect` with the script:

```git
$ git bisect start HEAD HEAD~20
Bisecting: 9 revisions left to test after this (roughly 3 steps)
$ git bisect run ./bisect_auto.sh
running ./bisect_auto.sh
Bisecting: 4 revisions left to test after this (roughly 2 steps)
[2c935028965bd60a8fe15d428feb1f3972245e75] Commit 5
running ./bisect_auto.sh
Bisecting: 2 revisions left to test after this (roughly 1 step)
[7ab0afc851dc3cdd1bee795b6bc0656d57497ca5] Commit 2
running ./bisect_auto.sh
Bisecting: 0 revisions left to test after this (roughly 1 step)
[a21e6e97e003b614793cffccbdc1a53985fc11d4] Commit 4
running ./bisect_auto.sh
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[7ae5192025b3a96520ee4897bd411ee7c9d0828f] Commit 3
running ./bisect_auto.sh
7ae5192025b3a96520ee4897bd411ee7c9d0828f is the first bad commit
commit 7ae5192025b3a96520ee4897bd411ee7c9d0828f
Author: lgiraudel <lgiraudel@mydomain.com>

    Commit 3

:100644 100644 d133004b66122208e5a1841e01b77db5862548c0 cd8061d8bb277cb08d8965487ff263181a82e2e4 M  file.txt
bisect run success
```

## Merge several commits into a single one before pushing

If you are working on a big task, it’s a good thing to regularly commit, especially if you have to switch to other branches and don’t want to stash all your work. But you should remind that each commit must let the branch in a stable state: it will be easier to pick up a specific commit to another branch, revert a specific commit that doesn’t work as expected or just do a `git bisect` without skipping commits.

You can add new files to the last commit with the `git commit --amend` command instead of creating a new commit but there is a solution to merge commits easily with the interactive `git rebase` command.

Let’s take our 20 commits adding a new line to a text file:

![20 commits to merge into a single one](/assets/images/git-tips-and-tricks-part-3/interactive-rebase.png)

If my 20 commits haven’t been pushed to the remote repository yet, I can consider to merge them into a single commit.

The command to do this:

```git
$ git rebase -i HEAD~20
```

Git will open editor with one line per commit:

```git
pick b2be46f Commit 1
pick 7d028f1 Commit 2
pick 90b2d43 Commit 3
pick b08b7ae Commit 4
pick 95d6490 Commit 5
pick 3ed326e Commit 6
pick 0472b8e Commit 7
pick 87ec4b6 Commit 8
pick 4aa29a1 Commit 9
pick b83b606 Commit 10
pick d5bcde4 Commit 11
pick b8bda01 Commit 12
pick b84c747 Commit 13
pick 880e179 Commit 14
pick b4b2c0c Commit 15
pick c2bfa94 Commit 16
pick dc4579d Commit 17
pick 8082b63 Commit 18
pick f40292b Commit 19
pick bb09305 Commit 20

# Rebase 36b95b2..bb09305 onto 36b95b2
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit’s log message
#  x, exec = run command (the rest of the line) using shell
#
# If you remove a line here THAT COMMIT WILL BE LOST.
# However, if you remove everything, the rebase will be aborted.
#
```

If I want to merge my 20 commits, I can replace **pick** by **squash** or **s** for each commit except first one.

```git
pick b2be46f Commit 1
s 7d028f1 Commit 2
s 90b2d43 Commit 3
s b08b7ae Commit 4
s 95d6490 Commit 5
s 3ed326e Commit 6
s 0472b8e Commit 7
s 87ec4b6 Commit 8
s 4aa29a1 Commit 9
s b83b606 Commit 10
s d5bcde4 Commit 11
s b8bda01 Commit 12
s b84c747 Commit 13
s 880e179 Commit 14
s b4b2c0c Commit 15
s c2bfa94 Commit 16
s dc4579d Commit 17
s 8082b63 Commit 18
s f40292b Commit 19
s bb09305 Commit 20

# Rebase 36b95b2..bb09305 onto 36b95b2
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit’s log message
#  x, exec = run command (the rest of the line) using shell
#
# If you remove a line here THAT COMMIT WILL BE LOST.
# However, if you remove everything, the rebase will be aborted.
#
```

If I save the content and close the editor, Git will merge the 20 commits into a single one and then open the editor (again) to display the 20 commits messages. I can keep or change my commits message, then save and close the editor to finish the merging process.

Now I have a single commit which adds 20 lines in the text file, instead of having 20 commits, each one adding only one line:

```git
$ git log -1 -p
commit f523330f8db0030eadc41836b54713aac2baf18b
Author: lgiraudel <lgiraudel@mydomain.com>

    Many commits instead of 20

diff --git file.txt file.txt
new file mode 100644
index 0000000..b636d88
--- /dev/null
+++ file.txt
@@ -0,0 +1,20 @@
+line number 1
+line number 2
+line numer 3
+line number 4
+line number 5
+line number 6
+line number 7
+line number 8
+line number 9
+line number 10
+line number 11
+line number 12
+line number 13
+line number 14
+line number 15
+line number 16
+line number 17
+line number 18
+line number 19
+line number 20
```

## Final thoughts

That’s all folks! I hope those tricks will help you in your daily work. Git bisect has deeply changed the way I search for weird bug : finding the guilty commit is easier than digging in the code. And merging commits before pushing help to keep a clean commit log.

> Loïc Giraudel works as a front-end developer at Best Of Media (Grenoble, France). He is a JavaScript and Git expert. You can catch him on Twitter: [@l_giraudel](https://twitter.com/l_giraudel).
