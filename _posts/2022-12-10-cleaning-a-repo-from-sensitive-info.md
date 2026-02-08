---
title: Cleaning a repo from sensitive info
description: A technical write-up on how to clean up a git repository from sensitive information that was inadvertently committed
---

I am participating in [Advent of Code](https://adventofcode.com) this year again, and I stumbled upon [a Reddit post](https://www.reddit.com/r/adventofcode/comments/zh2hk0/2022friendly_reminder_dont_commit_your_input/) that reminds people that [they should not publish their input data](https://twitter.com/ericwastl/status/1465805354214830081?s=20&t=f6i5IqlGF6UuzCou33ToLg). I won’t go too much into details here — feel free to read the thread — but the rationale is that it protects Advent of Code from malicious clones.

I want to comply with the author’s wishes, but I also want to be able to just run my code for all the days I participated in without having to manually copy and paste my inputs from the site.

Fortunately, the aforementioned Reddit thread mentions [git-crypt](https://github.com/AGWA/git-crypt), a piece of software that can encrypt and decrypt files on push and pull respectively. This way, I have all my input files locally but when pushing them to my repository, they get encrypted so that they’re not actually readable or usable by anyone else.

Here is a quick and dirty article on doing just that.

## Setting up git-crypt

First we install `git-crypt`. I’m on macOS so I install it via Homebrew, but this may vary by operating system of course.

```bash
brew install git-crypt
```

Then within the repository folder, we initialize `git-crypt` and export our secret key in a file.

```bash
cd aoc
git-crypt init
git-crypt export-key ./aoc-gitcrypt.key
```

Then we make sure never to commit that key file by adding it to the `.gitignore`. I also backed it up on 1Password so that I can share it across my devices if needed.

```bash
# .gitignore
aoc-gitcrypt.key
```

Then we tell Git which files should be encrypted with a `.gitattributes` file:

```bash
# .gitattributes
**/input.txt filter=git-crypt diff=git-crypt
```

That’s basically it for the setup. We can commit these changes so that in the future any `input.txt` file gets encrypted on push and decrypted on pull (if we have our key).

## Encrypting all input files

Now that the setup works, we need to encrypt files that are already there because they’re still plain text right now. This can be done with the following command:

```bash
git-crypt status -f
```

## Encrypting files in git history

So far so good. Unfortunately, all previous commits in our git history contains the raw text files so we need to rewrite the history to clean that up. The clean way to do it is with [git-filter-repo](https://github.com/newren/git-filter-repo) but who has time for that.

Let’s hack it with `git filter-branch` although it’s not recommended. Please make sure to back up your repository before trying anything.

```bash
git filter-branch --index-filter 'git rm --cached --ignore-unmatch **/input.txt' HEAD
git push --force
```

This works well! All the `input.txt` files got removed from all the commits in our git history. The problem is that they also got removed from the HEAD so we no longer have any input file.

This is why it’s nice to have backed up the folder before. We can now copy over all the text files from the backup onto the actual repository. I wrote a quick and dirty bash script for that:

```bash
# aoc-backup/migration.sh
find . -name "input.txt" -print0 | while read -d $'\0' file
do
  echo "Restoring input file at $file"
  cp $file "../aoc/$file"
done
```

Now we’ve brought back all our input files onto our repository. The last thing to do is to encrypt them once more before pushing them.

```bash
git-crypt unlock ./aoc-gitcrypt.key
git-crypt status -f
git commit -am "Restore encrypted input files"
git push
```

And that’s about it. We cleaned out our history from all input files, then we brought them back, encrypted them and pushed them. The only downside of this approach is that we can checkout an old commit and run our code since the input files are missing but oh well. It’s not like we were going to do that anyway.

I hope this helps!
