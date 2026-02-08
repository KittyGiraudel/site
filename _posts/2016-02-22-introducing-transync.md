---
title: Introducing transync
description: An announcement post for Transync, a small library to manage translation files
keywords:
  - translations
  - locales
  - sync
---

Hey folks, another day, another open-source module at Edenspiekermann! Today, I’d like to talk about translation files. We tend to do a lot of multilingual websites here at the company.

For instance [Amaphiko](https://amaphiko.redbull.com/en) exists in both English and Brazilian Portuguese. And the [home page for the ESPI Card Builder](http://cards.edenspiekermann.com) project will soon be released in German as well as English. We have international clients and international teams, so it only makes sense for us to work a lot with several languages at the same time (which is a shame for me because I only speak French and English).

Anyway, sometimes we need a way to synchronise translation files between them (depending on the tech stack; Rails handles everything pretty smoothly as far as I can tell). As we work in English, other languages often end up lagging behind and do not have all the translation keys from the English locale. So allow me to introduce [transync](https://github.com/edenspiekermann/transync).

## What is this all about?

[transync](https://github.com/edenspiekermann/transync) is a tiny Node.js script [packaged on npm](https://www.npmjs.com/package/transync) to do just that™. It takes a source locale file (`--from`), a destination locale file (`--to`), and just make sure the latter shares the same keys with the former.

You can install it like this:

```sh
npm install transync --save
```

Then to make sure the German translation (located in `locales/de.yml`) is up-to-date (in a matter of keys) with the English one (located in `locales/en.yml`), you could use transync like this:

```sh
node_modules/.bin/transync --from locales/en.yml --to locales/de.yml
```

And if you know that the English version is always your base file and want a shorther version, you could create a npm script in your `package.json` that looks like this:

```json
{
  "script": {
    "sync": "transync --from locales/en.yml --to"
  }
}
```

Then you can use it like this:

```sh
npm run sync -- locales/de.yml
```

Note that you don’t have to use YAML; the script works with both YAML and JSON seamlessly. You can even mix and match them (one file in YAML, one file in JSON) although I’m not quite sure why you’d do that.

## Anything else?

Under the hood, it’s basically a file reader (Node.js [fs](https://nodejs.org/api/fs.html)) and an [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). As you can see, it doesn’t do much. But it doesn’t shine by its complexity but by its efficiency. This is the kind of simple operation that you end up doing a lot, therefore that should be automated.

On a side note, I suppose you could use it for other things than locales. It’s just the most common use case for it I guess. And also gave me the idea for the name.

Anyway, if you feel like trying it, using it, testing it, breaking it, contributing to it, feel free to do so. I’ll be happy to assist you. Cheers! :)
