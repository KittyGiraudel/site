---
title: Making sense out of Node
keywords:
  - node
  - npm
  - tutorial
---

My partner has started getting into test automation and has had fun playing with Cypress, Backstop and Faker recently. However, the whole Node/npm/npx jargon was very obscure to them, so I wrote the little beginner’s guide you can find below.

## The jargon

**[Node](http://jargon.js.org/_glossary/NODEJS.md):** Node (or Node.js) is a “runtime environment”. It’s a server-side environment that runs JavaScript code. The same way your browser has a JavaScript engine, well Node has one as well. This allows you to execute JavaScript code, like scripts, outside of a browser environment.

**[npm](http://jargon.js.org/_glossary/NPM.md):** npm is the package manager for Node (despite claims it doesn’t stand for “Node Package Manager”). All languages have a package manager (Java has Maven, PHP has Composer, Ruby has RubyGems, etc.). Npm allows you to manage Node dependencies (packages), such as installing and removing them. Npm comes bundled with Node by default, so you don’t have to install it yourself.

**Packages:** Packages are versioned little bundles of code that people write and publish for other to use. Cypress and Faker, amongst many many others, are packages (and big ones at that).

**[npx](https://www.npmjs.com/package/npx):** npx is another command-line utility provided by npm. It’s a bit of an all-in-one command to execute the binary (see [below](#using-dependencies)) of the given package name. It will try within the local project if installed, or globally on your machine if installed, or it will temporarily install it otherwise.

## Managing dependencies

When you want to use a package, such as Cypress or Faker, you need to install it. There are two ways to do that: you can install it globally on your machine (with the `-g` option) which is usually discouraged because a little obscure and not very manageable. Or you can install locally for your project. This is the recommended option.

When you do `npm install <package>` in a directory that has a `package.json` file, it will do 3 things:

1. It will add a line inside your `package.json` file to note that the package you just installed is now a dependency of your project. That means your project relies on it.

2. It will add the package’s code, as well as the code of all the dependencies of that package (and their dependencies, and so on and so forth) into a directory called `node_modules`. This automatically-generated directory contains the source code of all the dependencies of your project. It is usually listed in `.gitignore` so that it doesn’t get committed (as it’s freaking huge and not your own code). You can safely delete this directory and reinstall all the dependencies of your project with `npm install` at any time. “Have you tried reinstalling your node_modules?” is basically the debug-101 of projects using Node. 😅

3. It will generate (or update) a file called `package-lock.json`. This is an automatically generated file that should never be updated by hand. It contains the version of all your dependencies (as well as their dependencies, and the dependencies of your dependencies, and so on and so forth). This file is a manifest that makes it possible for someone to come after you (or yourself), run `npm install`, and have the exact same packages as you did. Think of it as a snapshot of all your project’s dependencies.

## Using dependencies

Alright, so let’s recap a little bit what we just learnt.

1. Node is an environment to execute JavaScript code. It has a package manager called npm, which is used to install (and reinstall) packages.

2. A project usually has dependencies, because not everything should be coded from scratch. These dependencies are installed through npm, and listed in the `package.json` file. When installed, their code is in `node_modules`.

Okay, so now that we have dependencies installed for our project, how do we use them? Well, that depends what these dependencies do. Let’s take two different examples: `cypress` and `faker`.

[Cypress](https://cypress.io) is a tool. It gives you commands like `cypress open` and `cypress run`. That’s what we call a “binary”. Basically it means it gives you something you can execute from your terminal. This executable is exposed by Cypress in the `node_modules/.bin` folder. Any package that provides an executable will be located in that folder. That’s why you can run `./node_modules/.bin/cypress` (or `$(npm bin)/cypress` which is the exact same thing).

[Faker](https://github.com/marak/Faker.js/), on the other hand, does not provide an executable. It gives you JavaScript utilities you can import in your JavaScript code. You import that dependency doing `import faker from 'faker'` in your JavaScript files. Node can magically resolve `from 'faker'` by going into `node_modules/faker` and finding the relevant files. That’s pretty handy so you don’t have to do `import faker from './node_modules/faker/lib/something/specific/to/faker/index.js`.

## Wrapping up

Alright, so let’s sum up what we just learnt:

Some packages provide executables, some don’t. All packages providing an executable can be executed with `./node_modules/.bin/<package>`.

Most packages do not provide a command-line executable, and are made to be imported within a JavaScript file. This can be done with `import something from '<package>'`. What is being imported depends on the package and can be figured out by reading its documentation.

I hope this helps!
