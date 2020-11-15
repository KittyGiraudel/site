---
layout: page
title: Hi there, I’m Hugo.
tags:
  - Hugo “Kitty” Giraudel
  - author
  - speaker
  - developer
---

I’m a non-binary web developer in Berlin. I have led the web team at [N26](https://n26.com) for over 4 years and am about to get started at [Gorillas](https://gorillas.io). I specialise in accessibility and inclusivity. For a longer version, [read more about me](/about/).

{% assign latest_articles = site.posts | slice: 0, 3 %}
{% assign articles_copy = "I love writing, and have been sharing my thoughts — mainly about web development — on this blog for years. If you are looking for something specific, [try the search](/search). I also had the pleasure of hosting [guest authors](/guests) and would recommend you read their posts!" | markdownify %}
{% include components/showcase.html
  type = "article"
  title = "Latest articles"
  copy = articles_copy
  link_url = "/blog"
  link_label = "Read more articles"
  items = latest_articles
%}

{% assign main_projects = site.data.projects | where_exp: "project", "project.showcase" | slice: 0, 3 %}
{% include components/showcase.html
  type = "project"
  title = "Main projects"
  copy= "I used to be quite involved in open-source development. I have initiated and contributed to many projects, most of which about Sass or digital accessibility."
  link_url = "/projects"
  link_label = "Browse more projects"
  items = main_projects
%}

{% assign latest_events = site.data.speaking | slice: 0, 3 %}
{% include components/showcase.html
  type = "event"
  title = "Last events"
  copy = "I enjoy talking at conferences when I find time. If you would like me to attend one of your events, feel free to get in touch! In the mean time, feel free to have a look at my past talks."
  link_url = "/speaking"
  link_label = "Check more events"
  items = latest_events
%}
