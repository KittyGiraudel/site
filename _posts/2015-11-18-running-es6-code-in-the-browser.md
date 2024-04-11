---
title: Running ES6 code in the browser
keywords:
  - javascript
  - es6
  - babel
  - browserify
---

I recently wanted to create a tiny tiny React component outside of any React project I am currently working on. Something small, to be tested in the browser, just as an experiment. It actually took me some time to figure out the best way to work on this, so I thought it might be worth a short blog post in case you are in such a need too.

Before getting started, I shall mention that I came to the point where I exclusively write ES6 code (sorry, ES2015…) so I wanted to be able to write my React component in ES6 (oops, I did it again) and compile it to some JavaScript the browser can understand. To do so, there is [Babel](https://babeljs.io/).

And because I wanted to import React as a dependency inside my component, and not rely on global variables and import React as a script in the browser, I needed a way to make `import`/`require` work in the browser. To do so, there is [Browserify](http://browserify.org/).

Now, using them both could be tricky if it was not for [Babelify](https://github.com/babel/babelify). It is a Babel plugin doing both ES6 to 5 compilation and Browserify magic. To be entirely honest with you right now, I am not entirely sure what I’m saying. But that’s basically how it works.

Last but not least, I came across [Watchify](https://github.com/substack/watchify), a _watch mode for Browserify builds_. This extra tool allowed me to have a watcher running to make Babelify recompile the dist file every time there is a change. Handy!

![-ify all the things](http://i.imgur.com/yHiAcVZ.jpg)

From there, we can create our `package.json` file, starting with (dev)dependencies:

```sh
# Dependencies for the React component itself
npm install react react-dom --save
# Development dependencies to compile all the stuff
npm install babelify browserify --save-dev
```

Now, we only need to create a pair of _npm scripts_ to make our life easier and save us from typing some long commands again and again. The first script we need is a _build_ task. It runs `browserify` binary on our main file, compile it with `babelify` binary, then output in a new file.

```sh
browserify src/browser.js -t babelify -o dist/index.js
```

Our second script is the watcher. It works exactly the same except it uses `watchify` instead of `browserify`:

```sh
watchify src/browser.js -t babelify -o dist/index.js
```

Last but not least, we put them in our `package.json`:

```json
{
  "scripts": {
    "build": "browserify src/browser.js -t babelify -o dist/index.js",
    "watch": "watchify src/browser.js -t babelify -o dist/index.js"
  }
}
```

Done! At this point, the basic `index.html` page can safely link to `dist/index.js` script which has been converted to ES5 compliant JavaScript, and bundles every dependency needed for the project to work (React and such).

```html
<script src="dist/index.js"></script>
```
