---
title: "Dealing with themes and layouts with Twig"
tags:
  - templates
  - Twig
  - themes
  - layouts
---

Hey people! This post is going to be quite different from what I usually write about since it will talk about [Twig](http://twig.sensiolabs.org/), the template engine used by [Symfony 2](http://symfony.com/). I came across a pretty complicated case at work so I thought I'd write a little something about it.

But let's put some context first: Twig presents itself as a *template engine for PHP*. Kind of Jekyll, but far more powerful. The basic idea is to create reusable templates also called "views" (basically HTML blocks) to avoid repeating the same code again and again.

## Some leveling-up about Twig

Since not all of you are Twig masters (neither am I though), I am going to explain a couple of things before entering the topic.

### Extend

Twig is mostly about extending templates ([`@extend`](http://twig.sensiolabs.org/doc/tags/extends.html)). Thus we start with setting up a base template outputing some HTML (`<html>`, `<head>`, `<body>`...) and defining Twig blocks. Quick example:

```html
{% raw %}<!-- base.html.twig -->
<!DOCTYPE html>
<html>
  <head><!-- whatever --></head>
  <body>
    {% block header %}{% endblock %}
    {% block main   %}{% endblock %}
    {% block footer %}{% endblock %}
  </body>
</html>{% endraw %}
```

When a second template extends from the first one, it can dump stuff into those blocks that will bubble up into the first one to finally output content. There is no maximum level of nesting for such a thing so you can do this as deep as you want. Let's continue our example:

```html
{% raw %}<!-- page.html.twig -->
{% extends 'base.html.twig' %}

{% block header %}
  <h1>Title</h1>
{% endblock %}

{% block main %}
  <p>My first page</p>
{% endblock %}

{% block footer %}
  <footer>Credits & copyright</footer>
{% endblock %}{% endraw %}
```

That's pretty much how you work a project with Twig.

### Include

Now you also can also include files ([`@include`](http://twig.sensiolabs.org/doc/tags/include.html)) which work has you would expect: this is basically the `@include` from PHP. So if you have some static content, like a footer for example, you can include a partials (a bunch of HTML if you will) directly into your footer block like this:

```html
{% raw %}
{% block footer %}
  {% include 'partials/footer.html.twig' %}
{% endblock %}
{% endraw %}
```

### Embed

And finally, you can embed ([`@embed`](http://twig.sensiolabs.org/doc/tags/embed.html)) files which is more complex. Embeding is a mix between both extending and including. Basically it includes a template with the ability to make blocks bubbling down instead of up. We'll come back to this.

## The problem

The problem I faced at work was finding a way to manage both themes and layouts in Twig with *themes* being design schemes (mostly color-based) and *layouts* basically being the number of columns we use for the layout as well as their size.

So the theme is passed as a class to the body element (e.g. `<body class="shopping">`), while the layout defines what kind of dom nodes / HTML classes we will use for the main content of the site.

We have half a dozen of themes &mdash; one per section of site &mdash; (`shopping`, `news`, `admin`, `regular`, ...) and 4 different layouts based on the 12-columns grid system from Bootstrap (`12` for a full-width one-column template, `9-3` for two columns with a 3/1 ratio, `8-4` for a two columns with a 2/1 ratio and `2-7-3` for 3-columns).

Back to the issue: we had to be able to define both the theme and the layout on a page per page basis. Something like this:

```html
{% raw %}<!-- This doesn't work. -->
{% extends '@layout' %}
{% extends '@theme' %}{% endraw %}
```

Unfortunately, it's not possible to extend multiple templates in Twig (which seems obvious) so we had to find a workaround.

## The ultra dirty solution we didn't even try

One possible way to go &mdash; the one we wanted to avoid at all costs &mdash; was having either every layouts for every themes, or every themes for every layouts. Basically something like this:

* admin (theme)
    * 12 (layout)
    * 8-4 (layout)
    * 9-3 (layout)
    * 2-7-3 (layout)
* shopping (theme)
    * 12 (layout)
    * 8-4 (layout)
    * 9-3 (layout)
    * 2-7-3 (layout)
* ...

With this solution, you could do somethink like {% raw %}`{% extends 'shopping/12' %}`{% endraw %}. Or the other way around:

* 12 (layout)
    * shopping (theme)
    * news (theme)
    * ...
* 9-3 (layout)
    * shopping (theme)
    * news (theme)
    * ...
* ...

With this solution, you could do somethink like {% raw %}`{% extends '12/shopping' %}`{% endraw %}.

Both sucks. Really bad. It is not only very ugly but also a nightmare to maintain. Guys, don't do this. This is not a good idea. Especially since Twig is the most powerful template engine out there: there is a better way.

## A clean solution

After some searches, we finally found a way to do what we wanted with the `embed` directive. As I said earlier, embed really comes in handy when trying to achieve complicated systems like this. From the official Twig documentation:

> The embed tag combines the behaviour of include and extends. It allows you to include another template's contents, just like include does. But it also allows you to override any block defined inside the included template, like when extending a template.

In the end, we need 4 files to create a page:

* `base.html.twig` which defines the page core and the major blocks
* `{theme}.html.twig` with `{theme}` being the name of the theme we want (e.g. `shopping`) which extends `base.html.twig` and defines the class for the body element (and if necessary some other theme-specific stuff)
* `{layout}.html.twig` with `{layout}` being the layout we want (e.g. `9-3`), defining content blocks
* `page.html.twig` which is the actual page, embeding the layout file in the main content to override its blocks

This may sound a bit complicated so why not doing this step by step, shall we?

### Setting up the base file

As seen previously, the base file creates the HTML root document, the major HTML tags and defines the major Twig blocks, especially the one used to define the HTML class on the body element.

```html
{% raw %}<!DOCTYPE html>
<html>
  <head><!-- whatever --></head>
  <body class="{% block theme %}default{% endblock %}">
    {% block layout %}{% endblock %}
  </body>
</html>{% endraw %}
```

### Defining a theme

Next, we need to define a theme. A theme file will directly extends the base file, and will be extended by the page file. The content of the theme file is very light. Let's say we have a *shopping* theme; so we have the `shopping.html.twig` file:

```html
{% raw %}{% extends 'base.html.twig' %}

{% block theme 'shopping' %}{% endraw %}
```

The last line of this code example may look a little weird to you: it is the short way for {% raw %}`{% block theme %}shopping{% endblock %}`{% endraw %}. I like this way better when the content block is like a word or two without any HTML.

Anyway, when using this theme, the `theme` block defined in `base.html.twig` will be filled with `shopping`, setting a `shopping` class to the body element.

### Defining a layout

Let's say our page will use the shopping theme we just created with a 2-columns layout with a 2/1 ratio. Right? As I said previously, I like to call my themes the way they work with columns so in this case: `9-3.html.twig`.

```html
{% raw %}<div class="wrapper">
  <div class="col-md-9  content">
    {% block content %}{% endblock %}
  </div>
  <div class="col-md-3  sidebar">
    {% block sidebar %}{% endblock %}
  </div>
</div>{% endraw %}
```

### Creating the page

We only need the last piece of the puzzle: the page file. In this file, not much to do except dumping our content in the accurate blocks:

```html
{% raw %}{% extends 'shopping.html.twig' %}

<!-- Filling the 'layout' block defined in base template -->
{% block layout %}
  {% embed '9-3.html.twig' %}
    {% block content %}
      My awesome content
    {% endblock%}
    {% block sidebar %}
      My sidebar content
    {% endblock %}
  {% endembed %}
{% endblock %}{% endraw %}
```

### Rendered HTML

```html
<!DOCTYPE html>
<html>
<head><!-- whatever --></head>
<body class="shopping">
  <div class="col-md-9  content">
    My awesome content
  </div>
  <div class="col-md-3  sidebar">
    My sidebar content
  </div>
</body>
</html>
```

Voila! Pretty neat, right?

## Final words

That's pretty much it. From there, dealing with color schemes is quite simple since you have a specific class on the body element. To ease the pain of working out design schemes on the CSS-side, I use a couple of Sass mixins and a bunch of Sass variables. It makes everything fits in a couple of lines instead of large amount of vanilla CSS.

Long story short: Twig is really powerful and so is the embed directive.
