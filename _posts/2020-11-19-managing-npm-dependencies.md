---
title: Managing npm dependencies
keywords:
  - npm
  - dependencies
  - node
---

Dependencies are part of software development. It is unrealistic to expect running a project of any decent size without external dependencies. Not all code is worth writing, and a lot of clever people have written clever code which we would be clever to use in our projects.

But managing dependencies can be tricky. In this article, I’ll share some thoughts on how we stayed sane with dependencies at N26.

- [Documenting dependencies](#documenting-dependencies)
- [Auditing dependencies](#auditing-dependencies)
- [Unused dependencies](#unused-dependencies)
- [Outdated dependencies](#outdated-dependencies)

## Documenting dependencies

As a project grows bigger and older, it sometimes becomes difficult to know which dependency serves what purpose. For some of them, it’s pretty obvious, but for dependencies around tooling for instance, it can get tricky to keep track of what’s needed.

A good practice could be to document when to add a dependency, and why a dependency is being used if not obvious. Our documentation on the matter contains the following cheatsheet to figure out how to decide to add a new package:

- Is the dependency needed or can it easily be done internally?
- Is the dependency covered with tests and safe to use?
- Is the dependency provided under a permissive license (e.g. MIT)?
- Is the dependency maintained (date of last commit, number of open issues and pull-requests…)?
- Is the dependency a decent size (can be checked with [bundlephobia](https://bundlephobia.com/))?

## Auditing dependencies

Auditing dependencies is important to make sure we do not use packages afflicted with known vulnerabilities. Various projects tackle this issue at scale such as [Snyk](https://snyk.io/) or [npm audit](https://docs.npmjs.com/cli/v6/commands/npm-audit/).

I personally like `npm audit` because it’s baked by npm and free to use, but the console output can be daunting. That’s why I wrote a Node script wrapping `npm audit` to make the CLI output a little more digestable and actionable.

It’s not published on npm because who has time for that, but it’s [available as a GitHub Gist](https://gist.github.com/HugoGiraudel/37438267cb36448a85d56b8501d91aab) and then can be copied and pasted in a JavaScript file in one’s project. Cool features include:

- The ability to define a severity threshold, above which the script will return a non-zero exit code. For instance, finding a `critical` dependency would throw an error. This makes it easy to include it in CI/CD pipelines.
- Similar dependencies are grouped, so they are not announced multiple times. That makes it more convenient to see the actual overview. npm audit might announce 9 vulnerabilities, but it could very well be only 2 issues to be fixed, because they occur in more than one package.

## Unused dependencies

Looking for unused dependencies is not very convenient. There might be projects out there doing it, but who has time to deal with thirt-party dependencies to manage dependencies. So I wrote a very small Bash script to look whether dependencies are referenced at all in a project.

The idea is pretty straightforward: go through all the `dependencies` (or `devDependencies`), and then search within the project whether they are referenced, prefixed with an open quote (e.g. `'lodash`).

This specific search pattern will make sure to work for:

- `require` calls (e.g. `require('lodash')`)
- `import` statements (e.g. `import lodash from 'lodash'`)
- non-root paths (e.g. `import lodash from 'lodash/fp`)

{% info %} If you happen to use double-quotes, you will need to update the script to reference a double-quote (`"`) instead of single-quote (`'`). {% endinfo %}

When extracted as a little `groom_deps` function in one’s `.zshrc` or `.bashrc` file, it can be used within any project pretty conveniently. The type of dependencies (`dependencies`, `devDependencies` or `peerDependencies`) can be passed as an argument and defaults to `dependencies`.

```bash
function groom_deps {
  key=${1:-dependencies}
  for dep in $(cat package.json | jq -cr ".$key|keys|.[]");
  do [[ -z "$(grep -r  --exclude-dir=node_modules "'${dep}" .)" ]] && echo "$dep appears unused";
  done
}
```

```bash
groom_deps devDependencies
```

Note that some dependencies are required while not being imported anywhere in JavaScript code. For instance, `@babel/polyfill`, `iltorb` or other similar dependencies can be necessary while not being explicitly mentioned in JavaScript code. Therefore, tread carefully.

{% info %} The above script requires [jq](https://stedolan.github.io/jq/), which is a command-line utility to manipulate JSON. {% endinfo %}

## Outdated dependencies

You might be familiar with third-party tools like [Dependabot](https://dependabot.com/) or [Greenkeeper](https://greenkeeper.io/) to automatically submit pull-requests to update dependencies. They are nice, but they also have downsides:

- They require some initial setup.
- They create a lot of noise, and a permanent stream of updates.
- They could fail to pass security approvals in some organisation.

That’s why a long time ago I authored [a small Node program to look for outdated dependencies](https://github.com/HugoGiraudel/dependency-checker). Similar packages exist as well, this is just my take on it.

It works like this: it goes through the `dependencies` (and optionally `devDependencies` and `peerDependencies`) of the given `package.json` file. For each package, it requests information from the npm registry, and compares the versions to see if the one listed is the latest one. If it is not, it mentions it.

The output could look something like this:

```bash
Unsafe updates
==============
Major version bumps or any version bumps prior to the first major release (0.y.z).

* chalk @ 4.1.0 is available (currently ^2.4.2)
* commander @ 6.2.0 is available (currently ^3.0.0)
* ora @ 5.1.0 is available (currently ^3.4.0)
* pacote @ 11.1.13 is available (currently ^9.5.8)
* semver @ 7.3.2 is available (currently ^6.3.0)
* ava @ 3.13.0 is available (currently ^2.3.0)
* standard @ 16.0.3 is available (currently ^14.1.0)

npm install --save chalk@4.1.0 commander@6.2.0 ora@5.1.0 pacote@11.1.13 semver@7.3.2
npm install --save-dev ava@3.13.0 standard@16.0.3
```

I actually never published the package on npm because I couldn’t be bothered to find a name that wasn’t already taken yet. The current recommended usage is to clone it locally and use it through Node or the CLI. I personally added the little snippet to my `.zshrc` file so it provides me a `deps` function I can run in a project to look for dependency updates.

```bash
function deps() {
  node ../dependency-checker/bin -p package.json --dev --no-pr
}
```

The script is by no mean perfect:

- As mentioned, it’s not published on npm, so right now you need to clone it to use it. Not the most convenient, but heh, also not the worst.
- If a dependency has a major available update, it will shadow any potential minor (safe) updates, so you might be missing on minor/patches if you’re down one or more major versions.
- It doesn’t provide a link to changelogs (since there is no standardised way to do that), so you would have to search for them yourself.

That’s all I have. What about you, what are your tricks to keep your sanity when dealing with lots of dependencies in large projects?
