---
title: Looking for dead code
keywords:
- dead code
- maintenance
- bash
---

The N26 web platform has about 1,000 components and over 300 helpers. It’s not a huge code base per se (certainly not Facebook size anyway), but with over 250,000 lines of code, it is definitely on the big side of the spectrum.

In an ever-growing code base, it can be tedious, not to mention difficult, to look for code that is no longer used (or “dead code”). It cannot realistically done by hand, and I don’t know any solid tool that can automate that entirely.

So I wrote a small Bash script to take its best guess as to which files were no longer used. To detect that, I rely on the fact that all our imports look the same. For instance:

```js
import Input from "@components/Input";
import looksLikeEmail from "@helpers/looksLikeEmail";
```

{% info %}
The leading at-sign (`@`) is a Webpack alias to mean “from the root of the project”. This makes it more convenient to import files from anywhere. It has no incidence on the purpose of this article however.
{% endinfo %}

**This means if we search for `/Input'` and find no result, it means the `Input` component is never imported anywhere.** This only works because we never add `/index` or `/index.js` at the end of our imports.

Now, we only have to loop through all paths in our `components` directory (or any other), and perform a search for every one of them. If the search yields nothing, the component is unused.

```bash
# Loop over every entry within the given path
for entry in src/components/*
do
  # Grab only the directory name
  # (e.g. `Input` from `src/components/Input`)
  name=$(basename $entry)

  # Perform a search in the `./src` directory
  # and echo the path if it yields nothing
  if [[ -z "$(grep -r "/$name'" ./src)" ]]; then
    echo "$entry is unused"
  fi
done
```

A convenient way to execute that code is to define it as a function in one’s `.bashrc` or `.zshrc` file. When wrapped as a function, it might look like this:

```bash
function groom {
  root="${2:-.}"
  for entry in "$1"/*
  do
    name=$(basename $entry)
    if [[ -z "$(grep -r "/$name'" $root)" ]]; then
      echo "$entry is unused"
    fi
  done
}
```

It can then be used by passing the folder to ‘groom’ as an argument, and the root directory for the code search as a second argument (`./` by default):

```bash
groom src/components
groom src/components src
```

It’s not much, but I hope this helps you finding some dead code without having to rely on build tools or dependencies. It’s a pretty low hanging fruit. ✨
