---
title: Footnotes in 11ty
---

After having [moved from Jekyll to 11ty](/2020/11/30/from-jekyll-to-11ty/), I realised I could extend Liquid in fancy ways to make some things a little easier (or down right possible). In this article, I’d like to share how I built a tiny footnotes plugin with {% footnoteref "liquid" "I personally use Liquid at the time of writing, but this implementation should be relatively similar with Nunjucks, or even some other templating language." %}Liquid{% endfootnoteref %}. If you are not interested in how the sausage is made and just want to use the code, check [eleventy-plugin-footnotes](https://github.com/HugoGiraudel/eleventy-plugin-footnotes) for usage instructions.

{% info %}
Nicolas Hoizey pointed out on Twitter that [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote) does essentially the same thing with less integration and using Markdown syntax instead of Liquid.

*Maybe*, but my main problem with it is that it’s not super accessible (let alone by default), even considering all the customisation options. That’s because the footnote references end up being numbers (e.g. [1]) which are meaningless when listed or tabbed through because devoid of their surrounding context.
{% endinfo %}

I have recently blogged about [accessible footnotes](/2020/11/24/accessible-footnotes-and-a-bit-of-react/) again and if you haven’t read the article yet, I recommend you do so you fully grasp what comes next. To put things simply, we need 2 things: a way to register a footnote reference within the text, and a way to display the footnotes for a given page at the bottom of a post. Let’s start with the first one. 

## Registering footnotes

To author a footnote within text content, we use a `footnoteref` Liquid tag which takes the footnote identifier and the footnote content as arguments (in that order). It looks like this:

{% raw %}
```html
Something about {% footnoteref "css-counters" "CSS counters are, in
essence, variables maintained by CSS whose values may be
incremented by CSS rules to track how many times they’re used." %}
CSS counters{% endfootnoteref %} that deserves a footnote explaining
what they are.
```
{% endraw %}

The 11ty configuration would be authored like this:

```js
const FOOTNOTE_MAP = []

config.addPairedShortcode(
  'footnoteref',
  function footnoteref (content, id, description) {
    const key = this.page.inputPath
    const footnote = { id, description }

    FOOTNOTE_MAP[key] = FOOTNOTE_MAP[key] || {}
    FOOTNOTE_MAP[key][id] = footnote

    return `<a href="#${id}-note" id="${id}-ref" aria-describedby="footnotes-label" role="doc-noteref" class="Footnotes__ref">${content}</a>`
  }
)
```

Here is how it works: when rendering the `footnoteref` Liquid tag, we retrieve the registered footnotes for the current page (if any) from the `FOOTNOTE_MAP` map. We add the newly registered footnote to it, and we render an anchor link to the footnote.

{% info %}
It is important not to use an arrow function but a function declaration since we need to access the page stored on the `this` context. The ability to [access page data values within shortcode definitions](https://www.11ty.dev/docs/languages/liquid/#access-to-page-data-values) comes from 11ty. 
{% endinfo %}

## Rendering footnotes

For that I created a `footnotes.html` partial which I render at the bottom of the `post` layout (passing it the current page object), like so:

{% raw %}
```html
<article>
  {{ content }}
  {% include "components/footnotes.html", page: page %}
</article>
```
{% endraw %}

Now, we need a way to retrieve the footnotes from the page. That’s actually not too easy in Liquid unfortunately since there is no way to inject a global variable or simply assign a function call to a variable. Liquid’s utilities mostly aim at rendering HTML (as shown above) so it’s not too straightforward to return an array.

I played around a few solutions, and eventually landed with a wacky filter. Basically I expose a `footnotes` filter which expects the page as argument, and returns the footnotes for that page. 

{% raw %}
```liquid
{% assign footnotes = '' | footnotes: page %}
```
{% endraw %}

This is pretty ugly. We need a value to be able to apply a filter, even though that value can be anything since the filter will just replace it with an array of footnotes.

{% info %}
Note that this hack is rendered moot by the plugin since it exposes a `footnotes` shortcode which does the full HTML rendering. Therefore, there is no need to access the array of footnotes in the template as it’s all done from within the plugin.
{% endinfo %}

Here is how it’s defined:

```js
config.addFilter(
  'footnotes', 
  // The first argument is the value the filter is applied to,
  // which is irrelevant here.
  (_, page) => Object.values(FOOTNOTES_MAP[page.inputPath] || {})
)
```

From there, we can render the necessary markup to output the footnotes using a for loop to iterate over each of them.

{% raw %}
```html
{% assign footnotes = '' | footnotes: page %}
{% assign count = footnotes | size %}

{% if count > 0 %}
<footer role="doc-endnotes">
  <h2 id="footnotes-label">Footnotes</h2>
  <ol>
    {% for footnote in footnotes %}
    <li id="{{ footnote.id }}-note">
      {{ footnote.description | markdown }}
      <a
        href="#{{ footnote.id }}-ref"
        aria-label="Back to reference {{ forloop.index }}"
        role="doc-backlink"
        >↩</a
      >
    </li>
    {% endfor %}
  </ol>
</footer>
{% endif %}
```
{% endraw %}

## Wrapping up

So to sum up:

- We have a `footnoteref` Liquid tag to wrap footnote references in the text. It takes an id and the footnote description as arguments, and renders an anchor to the correct footnote.
- We have a `footnotes` Liquid filter which is basically a hacky way to get the footnotes for a given page so it can be assigned onto a variable. This hack is solved by using the plugin.
- We have a `footnotes.html` Liquid partial which get the footnotes for the current page and render them within the appropriate DOM structure. The plugin exposes a `footnotes` shortcode does that.

That’s about it. Pretty cool, huh? ✨

If you are interested in using these footnotes in 11ty, check out [eleventy-plugin-footnotes](https://github.com/HugoGiraudel/eleventy-plugin-footnotes) on GitHub. There are install instructions, guidelines and examples.
