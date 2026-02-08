---
title: From ESLint and Prettier to Biome
description: A technical write-up on my journey migrating from ESLint + Prettier to Biome
---

A couple of weeks ago, I saw [Biome](https://biomejs.dev/) pop in my Twitter timeline again, and decided it was time to look into it. Here are my 2 cents on how the migration went, and what is great and not so great about Biome.

## Existing setup

The [cofenster](https://cofenster.com) monorepo is about 200,000 of code in 40+ packages, so while it’s not _huge_, it’s also not a small codebase per se.

We were using a combination of ESLint and Prettier for the longest time. And as you can imagine, a bunch of plugins like eslint-plugin-prettier, eslint-plugin-react and whatnot. The joys of ESLint and its plugin architecture. There was nothing wrong with our stack per se: it did the job fine, but it was a lot of boilerplate.

We had a package to hold our ESLint configuration and all its dependencies, and a package to hold our Prettier configuration and its dependencies. Then every other package would have these 2 first packages as dependencies, and an `.eslintrc` file + a `.prettierignore` file at times. Again, a lot of boilerplate.

Then we had [husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) to run ESLint and Prettier on staged files during a pre-commit hook.

What if we could make all of this simpler?

## Setting up Biome

Biome advertises itself as a unique toolchain for a web project, enabling linting, formatting and more at high speed. Sounds promising! It should be able to replace both ESLint **and** Prettier, which would be nice.

Back when we introduced it, Biome didn’t have a good way to migrate from ESLint and Prettier somewhat automatically [like it does now](https://biomejs.dev/guides/migrate-eslint-prettier/).

At the time, I essentially:

1. Installed Biome,
2. Ran `biome check` on the whole codebase (with `--diagnostic-level=error` to ignore warnings to begin with),
3. Looked through the output for errors that were deemed too assertive or opinionated for us,
4. Ignored these rules in our `biome.jsonc` configuration with a comment to explain why,
5. Rinced and repeated step 2 to 4 until happy.

It took me an hour or two to reach a point where the output became manageable again, but thanks to Biome’s [extensive rules documentation](https://biomejs.dev/linter/rules/), it was relatively easy to come up with the right configuration.

{% info %} One thing I love about Biome is that the configuration model is very easy, even in a monorepo. We have a _single_ configuration file at the root of the repository, and every package automatically uses that (as Biome walks up the file tree to find a configuration file). No need to specify anything in `package.json` files, and overrides can be done at the package level by having another Biome file extending from the first. {% endinfo %}

Then, I ran Biome’s auto-fixes — including the ones deemed unsafe — on the whole codebase. I double-checked that everything was alright, and in case where the fixes were indeed unsafe, I reverted them manually or updated the code so the fix became safe.

<details>
<summary>In case you’re curious, this is our Biome configuration.</summary>

```json
{
  // See: https://biomejs.dev/reference/configuration/
  "$schema": "https://biomejs.dev/schemas/1.7.0/schema.json",
  // Enable auto-sorting of imports. When using Visual Studio Code, make sure
  // that your settings contain:
  // "editor.codeActionsOnSave": {
  //   "quickfix.biome": "explicit",
  //   "source.organizeImports.biome": "explicit"
  // },
  // See: https://biomejs.dev/reference/configuration/#organizeimports
  "organizeImports": {
    "enabled": true
  },
  "files": {
    "ignoreUnknown": true,
    // Ignore generated files.
    // See: https://biomejs.dev/reference/configuration/#filesignore
    "ignore": ["generated.ts", "**/generated/*", "**/dist/*", "bundle.js"]
  },
  "linter": {
    "enabled": true,
    "rules": {
      "a11y": {
        // We use SVG a lot across our apps, but we rarely want to add a `title`
        // attribute because we use SVG decoratively, and always add a label
        // when necessary.
        // See: https://biomejs.dev/linter/rules/no-svg-without-title/
        "noSvgWithoutTitle": "off",
        // We have our thing going for subtitles, so we do not want to enforce
        // the use of captions with every native video and audio players.
        // See: https://biomejs.dev/linter/rules/use-media-caption/
        "useMediaCaption": "off"
      },
      "complexity": {
        // Opposing `Array.prototype.forEach` in favor of for..of is a bit much
        // for a linting rule. There are cases where `forEach` are perfectly
        // legitimate.
        // See: https://biomejs.dev/linter/rules/no-for-each/
        "noForEach": "off"
      },
      "correctness": {
        // Undeclared variables are not reported as a problem by default, but
        // this is a behavior we want to enforce. Note that build flags need to
        // be listed as available globals in the `javascript.global` array.
        // See: https://biomejs.dev/linter/rules/no-undeclared-variables/
        "noUndeclaredVariables": "error",
        // Undeclared imports are not reported as a problem by default, but this
        // is a behavior we want to enforce.
        // See: https://biomejs.dev/linter/rules/no-undeclared-variables/
        "noUnusedImports": "error",
        // Unused variables are not reported as a problem by default, but this
        // is a behavior we want to enforce. We have a SCM to keep track of
        // unused code and should not resort to leaving it in the code base.
        // See: https://biomejs.dev/linter/rules/no-unused-variables/
        "noUnusedVariables": "error",
        // Normally, we’d want to ensure all hooks have an exhaustive list of
        // dependencies, but we have a lot of failing cases which would take a
        // while to adjust and double-check.
        // See: https://biomejs.dev/linter/rules/use-exhaustive-dependencies/
        "useExhaustiveDependencies": "warn",
        // This is the equivalent to the ESLint “rules-of-hooks” rule, which
        // enforces using hooks inside components only, outside of conditional
        // structures like `if` and ternary statements. It is not enabled by
        // default but we should pay attention because it can avoid runtime
        // errors.
        // See: https://biomejs.dev/linter/rules/use-hook-at-top-level/
        "useHookAtTopLevel": "error"
      },
      "performance": {
        // Using the spread operator on `Array.prototype.reduce` accumulators
        // is conceptually much slower than mutating the accumulator variable
        // because it creates new data with every pass on the array. That being
        // said, it’s not our performance bottleneck and we have a lot of cases
        // where we do that, so we turn it off.
        // See: https://biomejs.dev/linter/rules/no-accumulating-spread/
        "noAccumulatingSpread": "off"
      },
      "style": {
        // This rule prevents reassigned function parameters, but we do this a
        // lot, particularly in the backend API so although we want to limit it
        // as much as possible, we don’t want the rule to be an impediment.
        // See: https://biomejs.dev/linter/rules/no-parameter-assign/
        "noParameterAssign": "off",
        // Marking type imports as such helps with readability, compatibility
        // with bundlers and can avoid some weird performance edge cases.
        // See: https://biomejs.dev/linter/rules/use-import-type/
        "useImportType": "error"
      },
      "suspicious": {
        // Yes, using the array index as a React key is an anti-pattern, but in
        // many cases, it’s all we have as a differentiator, and it’s perfectly
        // fine when the array doesn’t get reordered.
        // See: https://biomejs.dev/linter/rules/no-array-index-key/
        "noArrayIndexKey": "warn",
        // Hooks shouldn’t need to be duplicated within `describe` blocks.
        // See: https://biomejs.dev/linter/rules/no-duplicate-test-hooks/
        "noDuplicateTestHooks": "error",
        // Prevents exporting things from test files.
        // See: https://biomejs.dev/linter/rules/no-exports-in-test/
        "noExportsInTest": "error",
        // Make sure we cannot commit a `describe` or `it` block with `.only`.
        // See: https://biomejs.dev/linter/rules/no-focused-tests/
        "noFocusedTests": "error",
        // The `yup` library uses `then` for some advanced schema definitions,
        // which is why we make this rule non-erroring.
        // See: https://biomejs.dev/linter/rules/no-then-property/
        "noThenProperty": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "lineWidth": 120,
    "indentWidth": 2,
    "indentStyle": "space"
  },
  "javascript": {
    "formatter": {
      "arrowParentheses": "always",
      "jsxQuoteStyle": "double",
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingComma": "es5"
    },
    "globals": [
      // The following globals are the build flags, which need to be maintained
      // here as well for the `noUndeclaredVariables` linting rule not to flag
      // them as missing.
      "__INTEGRATED_INTRO_OUTRO_EDITOR__",
      "__DISABLE_COMOTION_NG__",
      "__VIDEO_BRIEFING__",
      "__DIRECT_TEMPLATE_BUNDLE_IMPORTS__",
      // The following globals are test-related, covering both unit tests with
      // Jest and end-to-end tests with Cypress.
      "it",
      "describe",
      "expect",
      "jest",
      "before",
      "beforeAll",
      "beforeEach",
      "after",
      "afterAll",
      "afterEach",
      "Cypress",
      "cy"
    ]
  },
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true,
    "defaultBranch": "main"
  }
}
```

</details>

## Highlights

A single dependency with a single configuration file is very refreshing in the current ecosystem. And with Biome’s very good defaults, the amount of configuration required to have it running in the first place is quite minimal.

Moreover, Biome has incredibly good error mesages (as shown on [its home page](https://biomejs.dev/)), especially when compared to ESLint. Not only are errors intelligible, they also usually contain how to address the problem in the code. It makes it very easy for people to follow the conventions, and less likely for engineers to feel like “ugh I just want to commit, leave me alone.”

## Drawbacks

While the configuration structure is simple and well designed, having to use JSON for that [truly sucks](https://www.google.com/search?q=json+for+config+sucks&udm=14). Biome supports [jsonc](https://code.visualstudio.com/docs/languages/json#_json-with-comments) at least, which allows comments, but it still sucks. It would be so nice to be able to author it in plain JavaScript (or TypeScript), especially for dynamic parts like providing a list of global variables (like feature flags).

We also lost some ESLint configuration that doesn’t exist (yet?) on Biome. For instance, we had Cypress linting via [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) which is not a thing on Biome; not a huge deal but still. We also had an ESLint rule to group imports in a particular way — we traded that for auto-imports which is probably better in the long run, but that causes inconsistencies in the code.

Speaking of imports, the import sorting feature is amazing… when it works. Sometimes [Biome on VSC just absolutely mangles a file](https://github.com/biomejs/biome/issues/1570) when rewriting imports, and you end up with something truly wrecked. Fortunately, the modifications are in the history so pressing cmd + Z a few times is enough to get it back to a healthy point. Can’t wait for this to be fixed.

On the Prettier side, we lost the ability to auto-format GraphQL files which is a shame because we have a lot of them and Prettier was doing a good job at this. There is an [open issue to support GraphQL](https://github.com/biomejs/biome/issues/1927) so it may come eventually.

## Pre-commit hook

As of version 1.7.0 of Biome, the ability to lint exclusively staged files is baked in with the `--staged` option, which means we can drop [lint-staged](https://github.com/lint-staged/lint-staged). We still rely on [husky](https://typicode.github.io/husky/) for running scripts on pre-commit.

Ultimately, these are the scripts we have in the `package.json` of our packages:

```js
"lint": "tsc --noEmit -p tsconfig.json && biome lint --diagnostic-level=error --no-errors-on-unmatched ./**/*.{js,ts}",
"lint:fix": "biome check --apply-unsafe ./**/*.{js,ts}",
"lint:staged": "biome check --error-on-warnings --no-errors-on-unmatched --staged ./**/*.{js,ts}",
```

They work like this:

- `lint`: this runs on everything, but does not report anything lower than errors. Also it runs `tsc` first. We only use this on CI, because `TSC + monorepo + staged files = trouble`, so it’s too slow for a pre-commit hook.
- `lint:fix`: this runs on everything, and applies fixes (including unsafe ones) on anything that can be auto-fixed by Biome. We typically don’t use it too much; it was mostly useful during the migration from Prettier/ESLint.
- `lint:staged`: this runs only on staged files, but fails (exit code 1) on warnings as well to ensure no new warnings get introduced.

## Wrapping up

Overall, it was a rather smooth migration (I think I worked on it for about a day in total) and we’ve been very happy with the results for the most part. The most annoying thing remains this [mangling of files](https://github.com/biomejs/biome/issues/1570) in VSC — hopefully it gets addressed.

Honestly, it’s so lightweight, fast and simple to get started, I don’t see myself setting up ESLint ever again, or Prettier for that matter.

If you haven’t yet, give it a go! :)
