---
title: Parallel tests with GitHub Actions
---

First post of the year! I’ve been spending quite some time on my [Advent of Code](https://github.com/KittyGiraudel/advent-of-code) repository in December and decided I wanted to run the tests in a GitHub workflow. A short and sweet post about it.

The test suite is pretty slow though, since Advent of Code involves some brute-forcing exercises which take a long time to run. So the idea is to parallelize the tests so they don’t take as long.

I have 8 different folders: one folder per year since 2015. We can use a [matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) to create multiple job runs in parallel.

```yaml
strategy:
  fail-fast: false
  matrix:
    year: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
```

Then in our step, we can access the name of the job (and the name of our folder) and pass it to our `npm test` command (which uses Jest, or Mocha or Ava or whatever under the hood).

{% raw %}

```yaml
- name: Run tests
  run: npm test -- ${{ matrix.year }}
```

![Screenshot of a successful test run on GitHub featuring 8 jobs named after years from 2015 to 2022 having run in parallel](/assets/images/parallel-tests-with-github-actions/parallel-tests.png)

{% endraw %}

<details>
<summary>That’s it, happy new year! ✨ You can check the code for the whole <a href="https://github.com/KittyGiraudel/advent-of-code/blob/main/.github/workflows/test.yml">GitHub Workflow</a> if you want.</summary>

```yaml
name: Tests
on: [push]
jobs:
  tests:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        year: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]

    steps:
      - name: Check out repository
        uses: actions/checkout@v2

      - name: Unlock input files
        uses: sliteteam/github-action-git-crypt-unlock@1.2.0
        env:
          GIT_CRYPT_KEY: ${{ secrets.GIT_CRYPT_KEY }}

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- ${{ matrix.year }}
```

</details>
