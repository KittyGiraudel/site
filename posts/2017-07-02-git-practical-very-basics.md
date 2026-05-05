---
title: Git, the Practical Very Basics
description: A beginner friendly walkthrough to git, what you should know to get started and how not to lose your sanity.
tags:
  - git
---

Git is a version control system. Practically speaking, it’s a rather tiny program that maintains an history of the changes from your project such as additions, deletions, editions…

Git is a beast. It’s one of those things that look scary as fuck from the ground up, so much that very few people master completely. But it doesn’t have to be dramatically hard to grasp.

Lately, I taught the core concept of Git to a friend and thought it might be interesting to publish online for other people to read. Here is the draft that came up of our discussion.

## Creating a repository

The `init` command initializes a “git repository” in the current folder. It creates a (hidden) `.git` folder with a lot of sub-folders you don’t have to know about.

```
$ git init

> Initialized empty Git repository in /Users/Path/To/Your/Folder/.git/
```

Git does not necessarily need an online repository (GitHub, Bitbucket…). You can have a local git project that is not backed up anywhere. But if you ever want to back it up, you’ll need a “remote” repository. A remote is basically a copy of your project on a server (e.g. GitHub).

The `remote` command has sub-commands to manipulate remotes. This is not something you’ll use frequently thought. But the very first time you want to backup your work on GitHub, you’ll need to use it. More specifically, you’ll need to use the `add` sub-command to bind a remote repository to the current git project.

The word “origin” here serves as a name for the remote and is the default name whenever you “clone” a project from GitHub. We’ll stick to the convention and name it “origin”.

```
$ git remote add origin https://github.com/YourGitHubHandle/YourProject
```

## Doing a commit

Let’s make a change in our project. We’ll do it from the command line for the sake of simplicity but it can also be made manually.

Let’s create a file called “README.md” containing the string “Hello world”.

```
$ echo "Hello world" > README.md
```

It’s time to do our first commit. A commit is a bundle of (one or more) changes (additions, deletions and editions) bound to a certain point in time. A series of commits is a git history. This is core principe.

Writing into the history is a 2 steps process: first, we add files to some sort of “staging area” then we tell git to register all the changes to these staged files into a commit. The step is made with the command `add`.

Here, we add the `README.md` file to the “staging area” in preparation of a commit.

```
$ git add README.md
```

It is possible to have a look at the current state of things with the command `status`. This will display which files have been changed, and which of them have been added to the staging area.

```
$ git status

> Changes to be committed:
>   (use "git rm --cached <file>..." to unstage)
>
>   new file:   README.md
```

Now that we have our file in the staging area, we can properly commit it with the `commit` command. We associate a message with the `-m` option, describing the changes we did or why we did them.

```
$ git commit -m "Add README.md file"

> [master (root-commit) e63214c] Add README.md file
> 1 file changed, 1 insertion(+)
> create mode 100644 README.md
```

Now if we have a look at the current status of things again, it will be empty because there is no pending modifications.

```
$ git status

> On branch master
> nothing to commit, working tree clean
```

Would we want to inspect the recent history of the project, we would use the `log` command which lists latest commits.

```
$ git log

> commit e63214cf6fe03954fd8cbc7ee72ff913ec65c8b9
> Author: Your Name <your.name@gmail.com>
> Date:   Sat Jun 17 12:37:02 2017 +0200
>
>   Add README.md file
```

## Pushing things online

Now that we have made our first contribution to the project history, we want to back it up to our remote GitHub repository. Not only will other people be able to see that change (in case of a public repo) but we’ll also be able to take over on any other machine.

To push our changes to the remote repository (configured earlier with the `remote` command) we use the `push` command, followed by the name of the remote (`origin`) and then the name of the branch we push to (`master`).

```
$ git push origin master

> Counting objects: 3, done.
> Writing objects: 100% (3/3), 237 bytes | 0 bytes/s, done.
> Total 3 (delta 0), reused 0 (delta 0)
> To github.com:YourGitHubHandle/YourProject.git
>  * [new branch]      master -> master
```

## Merging branches

A git repository can be drawn across several “branches”. Branches are deviations of the git history at a certain point in time. They can later be merged together.

You can display all the existing branches of your project with the `branch` command.

```
$ git branch

> * master
```

By passing a name to the `branch` command, we can create a new branch. We then can move onto it with the `checkout` command. A shortcut for these 2 commands is `checkout -b <branch_name>`.

```
$ git branch my-new-branch
$ git checkout my-new-branch

> Switched to branch 'my-new-branch'
```

Let’s have a look at our branches now that we have several of them:

```
$ git branch

>   master
> * my-new-branch
```

Let’s add some new content in the README.md file, and commit our changes.

```
$ echo "peekaboo" >> README.md
$ git add README.md
$ git commit -m "Added peekaboo to the README"

> [my-new-branch e281fd0] Added peekaboo to the README
> 1 file changed, 1 insertion(+)
```

We can look at the logs to make sure everything went well. As you can see, the `my-new-branch` also contains the commit from `master`. This is because it has been created from this commit in the master branch, therefore it contains the whole history happening before it.

```
$ git log

> commit e281fd051af7d037486f6eec420664cf08fc9418
> Author: Your Name <your.name@gmail.com>
> Date:   Sat Jun 17 12:52:26 2017 +0200
> 
>     Added peekaboo to the README
> 
> commit e63214cf6fe03954fd8cbc7ee72ff913ec65c8b9
> Author: Your Name <your.name@gmail.com>
> Date:   Sat Jun 17 12:37:02 2017 +0200
> 
>     Add README.md file
```

Provided we are happy with our changes, we might decide to incorporate that work into `master` (our main branch). To do so, we can “merge” the new branch into the main one. First, we jump on the `master` branch, then we use the `merge` command to integrate the commits from `my-new-branch` that are not in `master`.

```
$ git checkout master

> Switched to branch 'master'

$ git merge my-new-branch

> Updating e63214c..e281fd0
> Fast-forward
> README.md | 1 +
> 1 file changed, 1 insertion(+)
```

## Wrapping up

That’s pretty much it. Of course, it gets more complex when going back in time to update the history, rebasing commits, or resolving conflicts, but you don’t have to know about any of that just now 

This is all you need to start playing with git. I hope you do!