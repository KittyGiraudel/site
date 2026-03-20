---
title: Merging GitHub Repositories
description: A short walkthrough on my journey merging several repositories into a brand new one.
tags:
  - git
  - GitHub
---

I am currently hyper-fixating on footnotes, and I have decided to bring my various implementations and content (current and future) together into a single repository: [KittyGiraudel/accessible-footnotes](https://github.com/KittyGiraudel/accessible-footnotes). That meant migrating [react-a11y-footnotes](https://github.com/KittyGiraudel/react-a11y-footnotes) and [eleventy-plugin-footnotes](https://github.com/KittyGiraudel/eleventy-plugin-footnotes) into this new repository.

## Goal

I know GitHub has some way to migrate a repository from an organization onto another, but that’s not really what I needed. I wanted to _merge several repositories into a new repository_, and in the process preserve:

- All the commits from both repositories.
- All the releases from both repositories.
- All the {% footnoteref "git-tags" "This is unfortunately not exactly possible since they would be colliding. For instance, both repositories had their own 0.1.0 tag pointing to different commits, so although I brought all releases + tags, I had to rename them." %}tags from both repositories{% endfootnoteref %}.

What I decided not to bother with: issues and pull-requests. I also didn’t make use of discussions, environments, or wikis, so that made things easier.

## Preserving histories

Making sure the git history of both repositories remained visible and usable was important to me. It’s not like my repos are popular in any way, but I do believe in the value of the git history, and I didn’t want the new repo to have a single commit with everything in it. Additionally, to be able to preserve releases, I needed to preserve the git history, since every release points to a specific commit.

Fortunately, this is made trivial with the [`git subtree` command](https://www.atlassian.com/git/tutorials/git-subtree). After creating a new empty repository on GitHub and cloning it locally, I ran the following commands:

```sh
# Add remotes for each of the repository
git remote add -f react-a11y-footnotes https://github.com/KittyGiraudel/react-a11y-footnotes.git
git remote add -f eleventy-plugin-footnotes https://github.com/KittyGiraudel/eleventy-plugin-footnotes.git

# Define a new subtree for each package
git subtree add --prefix=packages/react-a11y-footnotes react-a11y-footnotes main
git subtree add --prefix=packages/eleventy-plugin-footnotes eleventy-plugin-footnotes main
```

The `subtree` command adds all the code from the referenced repository into the indicated folder, and brings all the commits into the history as well. It’s not just a reference to a remote repository, nor is it a git submodule.

### HEAD-scratching issue

It took me a few attempts to make it work. I kept facing the following issue when attempting to add a subtree:

```sh
fatal: ambiguous argument 'HEAD': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
fatal: working tree has modifications.  Cannot add.
```

What’s interesting is that the error is very opaque, because my working tree was clean — it didn’t have any modification. Mistral AI wasn’t helpful either, because it relied on that error and kept suggesting I clear my local modifications before attempting again.

It eventually clicked that the problem may be that the repository doesn’t have any commit yet. The “ambiguous argument 'HEAD'” error is something I’ve seen a few times when attempting to undo the very first commit of a repo with `git reset --soft HEAD^`, since `HEAD` doesn’t exist yet.

So I created an empty commit with `git commit -m "Initial commit" --allow-empty` and tried again and everything worked.

## Migrating releases

Now that I had both repositories moved into the new one, and a shared git history containing all commits every created on either repository, I was ready to migrate the releases.

I’ve decided to go with a Bash script using the [GitHub CLI](https://cli.github.com/). The logic goes like this: list all releases from the old target repo, then for each release:

1. Resolve the commit to which the release is associated.
2. Download the assets from GitHub (e.g. tarballs).
3. Create a new release on the new repository.
4. Upload the assets onto the new release.

Here is {% footnoteref "script-dependencies" "It’s worth pointing out that the script relies on the <code>gh</code> and <code>jq</code> to work." %}the script{% endfootnoteref %} in all its glory, cleaned up and simplified a little compared to when I ran it. It has a generous amount of comments to make it easier to understand.

```bash
#!/bin/bash
set -euo pipefail

# Old repo to migrate from
# OLD_REPO="KittyGiraudel/react-a11y-footnotes"
OLD_REPO="KittyGiraudel/eleventy-plugin-footnotes"
NEW_REPO="KittyGiraudel/accessible-footnotes"

# Derive a package prefix from the repo name, e.g.
#   KittyGiraudel/react-a11y-footnotes -> react-a11y-footnotes
#   KittyGiraudel/eleventy-plugin-footnotes -> eleventy-plugin-footnotes
PKG_PREFIX="${OLD_REPO##*/}"

echo "Migrating releases from $OLD_REPO to $NEW_REPO with tag prefix '$PKG_PREFIX-'"

# Fetch releases from the old repo
gh api "repos/$OLD_REPO/releases" | jq -r '.[].tag_name' | while read -r tag; do
  if [[ -z "$tag" ]]; then
    continue
  fi

  # Compute new tag name, namespaced by package to avoid collisions
  # 0.1.0 on eleventy-plugin-footnotes becomes eleventy-plugin-footnotes-0.1.0
  # 0.1.0 on react-a11y-footnotes becomes react-a11y-footnotes-0.1.0
  new_tag="${PKG_PREFIX}-${tag}"

  echo "Processing old tag '$tag' -> new tag '$new_tag'"

  # Check if release with this new tag already exists in the new repo
  # This makes sure we can run the script multiple times without it creating
  # too many releases or failing: if the tag exists, it skips that release
  if gh api "repos/$NEW_REPO/releases/tags/$new_tag" >/dev/null 2>&1; then
    echo "Release with tag '$new_tag' already exists in $NEW_REPO, skipping."
    continue
  fi

  # Get release details from old repo
  release_data=$(gh api "repos/$OLD_REPO/releases/tags/$tag")

  # Extract title, body, assets, and URL
  title=$(echo "$release_data" | jq -r '.name // ""')
  body=$(echo "$release_data" | jq -r '.body // ""')
  assets=$(echo "$release_data" | jq -r '.assets[].browser_download_url?')
  original_url=$(echo "$release_data" | jq -r '.html_url // ""')

  # Resolve the original commit-ish
  original_commit=$(gh api "repos/$OLD_REPO/git/ref/tags/$tag" 2>/dev/null | jq -r '.object.sha // empty')

  # Prepend the package name to the release title for clarity
  # 0.1.0 from eleventy-plugin-footnotes becomes eleventy-plugin-footnotes@0.1.0
  # 0.1.0 from react-a11y-footnotes becomes react-a11y-footnotes@0.1.0
  title="$PKG_PREFIX@$title"

  # Prepend a note about the original release for traceability.
  body=$'_(Migrated from [$OLD_REPO@$tag]($original_url) at commit $original_commit)_\n\n$body'

  # Create the release in the new repo
  echo "Creating release '$title' with tag '$new_tag' (target: $original_commit)"
  gh api \
  --method POST \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2026-03-10" \
    "repos/$NEW_REPO/releases" \
    -F "tag_name=$new_tag" \
    -F "name=$title" \
    -F "body=$body" \
    -F "target_commitish=$original_commit"

  # Download and re-upload assets (if any)
  if [[ -n "$assets" ]]; then
    for asset_url in $assets; do
      [[ -z "$asset_url" || "$asset_url" == "null" ]] && continue

      filename=$(basename "$asset_url")
      echo "  Migrating asset '$filename' from $asset_url"

      curl -L -o "$filename" "$asset_url"
      gh release upload "$new_tag" "$filename" --repo "$NEW_REPO"
      rm "$filename"
    done
  fi
done
```

This worked a charm:

- We now have [all the tags](https://github.com/KittyGiraudel/accessible-footnotes/tags) onto the new repo.
- As well as [all the releases](https://github.com/KittyGiraudel/accessible-footnotes/releases). The commit of each of these releases still exist and can be linked to in order to browse the state of the code at that point.

The last thing I had to do was a bit of cleaning in the releases’ content. Some of them used GitHub’s PR shorthand (e.g. `#14`), which no longer worked, since the pull-request #14 lives in the old repository. So I just changed these to proper URLs to the old repo. Same thing with the links to the commit comparison:

```diff
- https://github.com/KittyGiraudel/react-a11y-footnotes/compare/0.7.0...0.8.0
+ https://github.com/KittyGiraudel/accessible-footnotes/compare/react-a11y-footnotes-0.7.0...react-a11y-footnotes-0.8.0
```

I decided not to automate that and just do it by hand for the 20ish releases I had in total. It’s definitely scriptable for larger migrations though.

## Merging tooling

The final thing I got to do was to clean up every individual ~~repository~~ package directory and centralize the tooling at the top-level: GitHub workflows, `.gitignore`, Biome configuration (also replaced ESLint and Prettier), license file…

## Wrapping up

Overall I’m very pleased with how convenient it was to merge both repositories and keep the essentials like commit, tags and releases. I was expecting a massive headache, and it turned out to be mostly smooth-sailing.
