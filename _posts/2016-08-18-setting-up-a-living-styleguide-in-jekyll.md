---
title: Setting up a living styleguide in Jekyll
description: A technical write-up about setting up a living styleguide in Jekyll
tags:
  - Jekyll
  - Component
image: /assets/images/jekyll-styleguide/styleguide-in-jekyll.png
---

I was recently working on a small [Jekyll](https://jekyllrb.com/) project and wanted to see whether it would be possible to have a very component-ized approach driven by a styleguide, despite the fact that [Liquid](https://github.com/shopify/liquid) (the template engine behind Jekyll) is not meant to do that.

I found it out it is doable (not without some struggling though) and I’d like to show you how so you can consider using a similar approach in your next Jekyll project.

![Screenshot of the styleguide built in this article, featuring Bootstrap design](/assets/images/jekyll-styleguide/styleguide-in-jekyll.png)

There is quite a bit of setup around this example, so I recommend you check this [boilerplate on GitHub](https://github.com/KittyGiraudel/jekyll-styleguide).

## Why a Styleguide?

When working on a site or application, it is good practice to try finding common UI patterns so they can be extracted and reused across the platform. This helps maintenance, scaling and reduces overall complexity.

When pushed further, this practice can lead to the creation of a “styleguide” (or “style guide”). Very broadly speaking and [according to Wikipedia](https://en.wikipedia.org/wiki/Style_guide), a styleguide is:

> [A] set of standards for the writing and design of documents, either for general use or for a specific publication, organization, or field. A style guide establishes and enforces style to improve communication.

Now, there is no one way to do a styleguide. Ask 10 people in this industry, you will have 10 different answers. I guess that’s also the beauty of it. Some people will tell you a styleguide should not be technical, some will tell you it should. Some will call it a pattern library… and so on.

If you ask me, a component styleguide should explain what a component does, how to use it, and provide an example. That is what I expect from such a document.

## Components in Jekyll

I am getting more and more used to working with React and there is one thing I really like about it — everything, even the smallest chunk of UI, is (or could be) a component. As you will soon realize, this very concept drove my research here.

Any interface module that could theoretically be reusable ended up in its own file, inside a components folder in the Jekyll `_includes` folder.

```
my-project/
|
|– _includes/
|   |
|   |– components/
|   |   |
|   |   |– button.html
|   |   |– header.html
|   |   |– headline.html
|   |   |– nav.html
|   |   |– footer.html
|   |   |– …
|– …
```

As an example, let’s build the button component together (`button.html`). The minimum our button component should have is a type attribute, a `class` attribute and some content.

We’ll give a default class to the button that can be extended through the `class` include parameter to make it more flexible. We’ll also define the default `type` to `button`, just in case it is not being passed in.

Last but not least, we’ll make sure not to render the button if no content is being passed.

```liquid
{​% assign class = "c-button " | append: include.class %}
{​% assign type = include.type | default: "button" %}
{​% assign content = include.content %}

{​% if content %}
  <button class="{​{ class }}" type="{​{ type }}">{​{ content }}</button>
{​% endif %}
```

This file is then included through an `{​% include %}` Liquid block when used in pages, customised with [include parameters](https://web.archive.org/web/20240630100623/http://jekyllrb.com/docs/templates/#includes). Ultimately, this means pages are basically nothing but generic containers including components.

```liquid
{​% include components/button.html
  type = "submit"
  content = "Get in touch"
%}
```

## Building the Styleguide

To build the styleguide itself, we will need several things:

- A [Jekyll collection](https://web.archive.org/web/20240630100623/https://jekyllrb.com/docs/collections/) for all documented components.
- An entry per component in the collection.
- A styleguide page.
- A layout dedicated to the styleguide.

### Creating a Dedicated Jekyll Collection

First, let’s setup the collection in the configuration:

```yaml
# Styleguide settings
collections:
  styleguide:
    output: true

defaults:
  -
    scope:
      path: ""
      type: "styleguide"
    values:
      layout: "default"
```

This tells Jekyll that we will have entries from our `styleguide` collection in a `_styleguide` folder at project’s root level. Each documented component will have a matching file (using the `default` layout).

```
my-project/
|
|– _includes/
|   |
|   |– components/
|   |   |
|   |   |– button.html
|   |   |– header.html
|   |   |– headline.html
|   |   |– nav.html
|   |   |– footer.html
|   |   |– …
|
|– _styleguide/
|   |
|   |– button.html
|   |– header.html
|   |– headline.html
|   |– nav.html
|   |– footer.html
|   |– …
|
|– …
```

### An Entry Per Component

Let’s create the page for our button component (`_styleguide/button.html`). This page is not really meant to be seen on its own; it is intended to show all the information we need to be able to display everything about the component in the styleguide page.

What we need is a description of the UI module, the parameters it accepts when included, and an example. The content of the page itself will be a proper Liquid include, and this is what will be rendered as a demo inside an iframe.

```liquid
---
description: |
  The button component should be used as the call-to-action in a form, or as a
  user interaction mechanism. Generally speaking, a button should not be used
  when a link would do the trick.
parameters:
  content: "*(mandatory)* the content of the button"
  type: "*(optional)* either `button` or `submit` for the `type` HTML attribute
        (default to `button`)"
  class: "*(optional)* any extra class"
example: |
  {​% include components/button.html
    type = "button"
    content = "Click me"
    class = "pretty-button"
  %}
---

{​% include components/button.html
  type = "button"
  content = "Click me"
  class = "pretty-button"
%}
```

### A “Styleguide” Page


We now need to create the page for the styleguide. To make it easy (and because I think this is the perfect occasion for it), I added [Bootstrap](https://getbootstrap.com/) to this page to make it easier to style and faster to build. This page consists of three sections:

- A header that introduces the styleguide.
- A sidebar for the navigation.
- A main content area displaying all the entries of our collection.

To avoid having a page too long and bloated with logic, I recommend having each of these sections in a partial, living in a `_includes/styleguide` folder.

```
my-project/
|
|– _includes/
|   |
|   |– components/
|   |   |
|   |   |– button.html
|   |   |– header.html
|   |   |– headline.html
|   |   |– nav.html
|   |   |– footer.html
|   |   |– …
|   |
|   |– styleguide/
|   |   |
|   |   |– component.html   # HTML for a component display
|   |   |– header.html      # Styleguide header
|   |   |– navigation.html  # Styleguide navigation
|
|– _styleguide/
|   |
|   |– button.html
|   |– header.html
|   |– headline.html
|   |– nav.html
|   |– footer.html
|   |– …
|
|– …
```

The reason I recommend this is that it makes the code for our page quite clean and makes it pretty obvious about what it does.

```liquid
---
layout: styleguide
---

<div class="container">

  <!-- Styleguide header introducing the content -->
  {​% include styleguide/header.html %}  

  <div class="row">

    <!-- Styleguide aside navigation -->
    <div class="col-md-3">
      {​% include styleguide/navigation.html %}  
    </div>

    <!-- Styleguide main content area -->
    <div class="col-md-9">
      {​% for component in site.styleguide %}
        {​% include styleguide/component.html
          component = component
        %}
      {​% endfor %}
    </div>

  </div>

</div>
```

Here is the header (`_includes/styleguide/header.html`):

```liquid
<div class="jumbotron">
  <h1>{​{ page.title | default: "Styleguide" }}</h1>

  <p>
    This document is a component styleguide. Its purpose is to list all the UI
    modules used across the site / application, their role, how to use them and
    how they look.
  </p>

  <p>
    Furthermore, this document can be used as a single source of truth when
    refactoring HTML and CSS in order to ensure no component visually broke.
  </p>

  <a href="/" class="btn btn-primary">Back to the site</a>
</div>
```

Here is the navigation (`_includes/styleguide/navigation.html`):

```liquid
<div class="scrollspy">
  <div class="s-styleguide-aside hidden-xs hidden-sm">
    <ul class="nav">
      {​% for component in site.styleguide %}
        {​% assign component_name = component.slug | replace: "-", " " | capitalize %}
        <li>
          <a href="#{​{ component.slug }}">{​{ component_name }}</a>
        </li>
      {​% endfor %}
    </ul>
  </div>
</div>
```

{​% callout %}Note: if the name of your components do not necessarily match their file name (`slug`), you could add a `title` or `name` key to each of them instead.
{​% endcallout %}

And finally, here is the HTML for a component showcase (`_includes/styleguide/component.html`), which is admittedly the most complex part of this page:

![Screenshot of the component output, showcasing a table of information for each parameter and a visual output](/assets/images/jekyll-styleguide/component-output.png)

```liquid
{​% assign component = include.component %}
{​% assign iframe_source = component.url | prepend: site.baseurl %}
{​% assign slug = component.slug %}
{​% assign title = slug | replace: "-", " " | capitalize %}
{​% assign description = component.description | markdownify %}
{​% assign html_code = component.content %}
{​% assign liquid_code = component.example %}
{​% assign parameters = component.parameters %}
{​% assign tab_name = slug | append: "-" | append: "-tab" %}

<div class="s-styleguide-showcase" id="{​{ slug }}">

  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">{​{ title }}</h2>
    </div>

    <div class="panel-body">
      {​{ description }}

      <!-- Component include parameters -->
      <table class="table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
        {​% for parameter in parameters %}
          {​% assign parameter_name = parameter[0] %}
          {​% assign parameter_desc = parameter[1] | markdownify %}
          <tr>
            <td><code>{​{ parameter_name }}</code></td>
            <td>{​{ parameter_desc }}</td>
          </tr>
        {​% endfor %}
        </tbody>
      </table>

      <!-- Nav tabs -->
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active">
          <a href="#{​{ tab_name }}-demo" aria-controls="{​{ tab_name }}-demo" role="tab" data-toggle="tab">Demo</a>
        </li>
        <li role="presentation">
          <a href="#{​{ tab_name }}-liquid" aria-controls="{​{ tab_name }}-liquid" role="tab" data-toggle="tab">Liquid</a>
        </li>
        <li role="presentation">
          <a href="#{​{ tab_name }}-html" aria-controls="{​{ tab_name }}-html" role="tab" data-toggle="tab">HTML</a>
        </li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">

        <div role="tabpanel" class="tab-pane active" id="{​{ tab_name }}-demo">
          <iframe src="{​{ iframe_source }}" title="{​{ title }}"></iframe>
        </div>

        <div role="tabpanel" class="tab-pane" id="{​{ tab_name }}-liquid">
          {​% highlight liquid %}{​{ liquid_code }}{​% endhighlight %}
        </div>

        <div role="tabpanel" class="tab-pane" id="{​{ tab_name }}-html">
          {​% highlight html %}{​{ html_code }}{​% endhighlight %}
        </div>

      </div>
    </div>
  </div>

</div>
```

### A “Styleguide” Layout

This step is not really mandatory. Your styleguide page could definitely use the default layout for your site. In our case, since it needs to include Bootstrap assets and handlers, it is different enough to deserve a separate layout.

It needs to include:

- The main stylesheet from Bootstrap.
- jQuery since it is a Bootstrap dependency.
- The main JavaScript file from Bootstrap.
- A script to resize iframes based on their content.
- A script to initialize the affix navigation.
- The `data-spy="scroll"` and `data-target=".scrollspy"` attributes on the body element to enhance the navigation.

Since there is quite a bit of JavaScript to make the styleguide work perfectly, it might be worth adding a file for that in `_includes/styleguide/scripts.html` doing just that:

```html
<!-- jQuery -->
<script
  src="https://code.jquery.com/jquery-2.2.4.min.js"
  integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
  crossorigin="anonymous"></script>

<!-- Bootstrap -->
<script
  src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" 
  integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" 
  crossorigin="anonymous"></script>

<!-- Iframes resizing -->
<script type='text/javascript'>
  $(function () {
    $('iframe').on('load', function () {
      var height = this.contentWindow.document.body.offsetHeight + 'px'
      $(this).css('height', height)
    })
  })
</script>

<!-- Affix sidebar initialisation -->
<script>
  var $nav = $('.c-styleguide-aside')

  $nav.affix({
    offset: { top: $nav.offset().top }
  })
</script>
```

## Wrapping Things up

That’s it folks! I hope you enjoyed this experiment and have considered the benefits of having a living styleguide in your projects.

Because of Liquid, Jekyll is not the easiest playground to create such a document, but as you can see, it is still is possible to end up with a lovely solution.

Admittedly, there is quite a bit of groundwork to do to setup this styleguide, but from there adding new components turns out to be super simple:

- Create your component in `_includes/components/`.
- Create a matching page in `_styleguide/` and fill all the information you need.
- Done! ✨

If you have any idea on how to improve things, be sure to share your thoughts in the comments, or even contribute to the demo on GitHub.
