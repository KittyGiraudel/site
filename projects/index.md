---
layout: default
title: "Projects"
excerpt: "A list of all my open-sourced projects, all hosted on GitHub. Fair warning: some of them are not maintained anymore."
tags:
  - projects
  - open-source
  - github
---

# Open-source Projects

<img src="/images/banners/coding.jpg" alt="Photography by Alexandra Lucas" />

{% include ad.html %}

When I can, I try to invest a lot of time in open-source projects. Here are a few of them I initiated myself:

<ul class="list">
{% for project in site.data.projects %}
  <li class="list__item">
    <a class="list__primary-content" href="{{ project.link }}" target="_blank">
      {{ project.name }}
    </a>
    <span class="list__secondary-content">{{ project.description }}</span>
  </li>
{% endfor %}
