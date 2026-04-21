---
title: Introducing Sass-Compatibility
description: An announcement post for Sass-Compatibility
tags:
  - Sass
  - Release
  - Open Source
---

For weeks now, I – with the help of some folks – have been collecting inconsistencies between Ruby Sass and LibSass. At first, it was nothing but a GitHub Gist but then, I made a CodePen out of it with a custom stylesheet and everything. It still was not enough, so I made a full project out of it. Let me introduce [Sass-Compatibility](https://sass-compatibility.github.io/).

![Home page of Sass Compatibility](/assets/images/sass-compatibility/sass-compatibility-1.png)

The goal of Sass-Compatibility is to provide a list of inconsistencies between different Sass engines. Not only Ruby Sass and LibSass of course, but also Ruby Sass 3.2 and Ruby Sass 3.3, or Ruby Sass 3.3 and Ruby Sass 3.4.

The basic scenario is you wanting to move your code base over to LibSass but are unsure whether you can do it because of missing features. We’ve got you covered. Head to https://sass-compatibility.github.io, have a tour, and check for yourself if it’s okay for you to lose some features to enjoy LibSass’ speed.


## How does it work?

At the very start, it was mostly manual testing on [SassMeister](http://sassmeister.com/), then writing results in a table. Quite tedious, and not very scalable (especially since I had highlighted over 30 inconsistencies) so I quickly moved to a fully-automated system thanks to [Valérian Galliat](https://twitter.com/valeriangalliat).

You may not know it, but there is a project called [sass-spec](https://github.com/sass/sass-spec). Sass-spec aims at providing a test suite for Sass engines to make sure they are compliant with the official Ruby version of Sass. However, we should note that the project is currently in an odd state where it has some tests for LibSass only, some old tests from Ruby Sass pre-3.0, some disabled tests… Basically, kind of a mess.

That being said, LibSass maintainers are doing a tremendous job to keep all features tested with sass-spec. That means every single code snippet that gets merged in LibSass code base has a test written in the sass-spec project.

Thanks to this, we decided to pull tests from LibSass rather than rewriting them. For inconsistencies that have no tests, either I added one to sass-spec, or I wrote one specifically for Sass-Compatibility. Ultimately, the goal would be to use only sass-spec’s tests, not my own but meanwhile we gotta do what we gotta do.

Anyway, we have a [list of features](https://github.com/sass-compatibility/sass-compatibility.github.io/blob/master/_data/features.yml) with some [associated tests](https://github.com/sass-compatibility/sass-compatibility.github.io/blob/master/_data/tests.yml). A feature can (should?) have several tests to make sure it is 100% covered. Then, we have a (blazingly awesome) [Rakefile](https://github.com/sass-compatibility/sass-compatibility.github.io/blob/master/Rakefile) that iterates over all tests from all features, and run them thanks to [SassMeister’s back-end](https://github.com/sass-compatibility/sass-compatibility.github.io/blob/master/Rakefile#L63). Then, it writes a [support file](https://github.com/sass-compatibility/sass-compatibility.github.io/blob/master/_data/support.yml) that’s being used in the view to display everything.

## What now?

First, [LibSass 3.1 should be released](https://github.com/sass/libsass/issues/697) soon fixing a lot of inconsistencies with Ruby Sass 3.4, for instance:

- `transparent` not being recognized as a color ([libsass#700](https://github.com/sass/libsass/issues/700));
- `rebeccapurple` not being recognized as a color ([libsass#699](https://github.com/sass/libsass/issues/699));
- `not`, `and` and `or` not being reserved function names ([libsass#713](https://github.com/sass/libsass/issues/713));
- `@`error not being supported ([libsass#704](https://github.com/sass/libsass/issues/704));
- decrementing `@for` loops not working ([libsass#703](https://github.com/sass/libsass/issues/703));
- `feature-exists` not being supported ([libsass#702](https://github.com/sass/libsass/issues/702));
- `inspect` function not being supported ([libsass#701](https://github.com/sass/libsass/issues/701));
- `random` function not being supported ([libsass#657](https://github.com/sass/libsass/issues/657));
- `unique-id` function not being supported ([libsass#636](https://github.com/sass/libsass/issues/636));
- maps with quoted keys not able to be used as variable arguments ([libsass#721](https://github.com/sass/libsass/issues/721));
- `null` able to be concatenated ([libsass#698](https://github.com/sass/libsass/issues/698)).

I probably missed a lot of bug fixes and extra features, nevertheless, this should mean a lot more green blocks in the LibSass column for Sass-Compatibility. This could even lead me to remove some features once I’m sure they work in every engine.

![Screenshot of a support and compatibility table from Sass Compatibility](/assets/images/sass-compatibility/sass-compatibility-2.png)

Along the same lines, I’d like to avoid running [my own tests](https://github.com/sass-compatibility/sass-compatibility.github.io/tree/master/tests) and only use those from sass-spec. That should be doable since [Michael Mifsud](https://twitter.com/xzyfer) told me he, as well as Sass and LibSass teams, wants sass-spec to be the one test suite for all engines.

## How can you contribute?

There are several things you could do to contribute to Sass-Compatibility. The best one would be to find an inconsistency between LibSass and Ruby Sass (or any other engine basically) and [open an issue](https://github.com/sass-compatibility/sass-compatibility.github.io/issues) about it. From there, we will try to add it to the site, and report it to either Ruby Sass or LibSass so they can fix it.

Along the same lines, we always need more tests and better tests. If you think you can improve a test suite (either on sass-spec or on Sass-Compatibility’s own tests), it would be awesome if you could submit a little [pull request](https://github.com/sass-compatibility/sass-compatibility.github.io/pulls). Some features like `@extend` or `@at-root` are quite complex to tests in their entirety, so be sure to tell us if you have found an uncovered edge case.

Also, if you find something that looks wrong to you, please be sure to get in touch so we can check what’s going on. Mistakes happen.

Anyway, I hope this project will help Sass community to move forward.