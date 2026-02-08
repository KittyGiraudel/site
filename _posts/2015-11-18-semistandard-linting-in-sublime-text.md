---
title: Semistandard linting in Sublime Text
description: A technical write-up on using Semistandard linting in Sublime Text
keywords:
  - semistandard
  - javascript
  - sublime text
  - linting
---

At Edenspiekermann, we recently decided to drop a custom [eslint](http://eslint.org/) configuration file and to use [semistandard](https://github.com/Flet/semistandard) instead (we could have used [standard](https://github.com/feross/standard) but we do like semi-colons). This move aims at normalizing our linter configuration across projects in order to facilitate cross-team work.

One challenge has been to enable `semistandard` linting in Sublime Text, since some of us want instant feedback in our code editor. After a few unfortunate failures and a dozen of Google searches, we finally succeeded in making it work. Here is how.

- First, install semistandard into our project’s dev dependencies:

```sh
$ npm i semistandard --save-dev
```

- Install [SublimeLinter](http://www.sublimelinter.com/en/latest/) package.
- Install [SublimeLinter-contrib-semistandard](https://github.com/Flet/SublimeLinter-contrib-semistandard) package. This has to be done after having installed SublimeLinter, as it is the core dependency.

At first, we thought this and restarting Sublime Text would be enough, but it was not. Sublime Text’s console (yes, it exists) threw an error like:

```sh
SublimeLinter: env: node: No such file or directory
```

We use [nvm](https://github.com/creationix/nvm) to handle [npm](https://www.npmjs.com/) versions so there is no global install of npm. Because of this, SublimeLinter could not run semistandard. The solution was simple, we only had to make `nvm` use a default version:

```sh
$ nvm alias default stable
```

That’s enough for SublimeLinter to run `semistandard`! Also, the best thing is that it uses the local `semistandard` version (installed in your project’s `node_modules` folder as a dependency), which means no version conflicts between developers!

### Going further

Linting in an editor is great for quick feedback, but the real strength in `semistandard` or any linter is automatically linting the whole code base before a `git push`. We’ve done this with great success using [captain-git-hook](https://github.com/maxhoffmann/captain-git-hook) and configuring it from `package.json`.

Also, to avoid linting the whole code base and possibly having old and unrelated linting issues preventing us from commiting, we only lint changed files thanks to some command line magic:

```sh
git diff --name-only --staged --diff-filter=ACMRTUXB --relative | grep -E '.jsx?$' | xargs semistandard
```

Enjoy, and happy coding!
