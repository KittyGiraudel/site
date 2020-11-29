---
layout: page
title: Open-source projects
excerpt: 'A list of all my open-sourced projects, all hosted on GitHub. Fair warning: some of them are not maintained anymore.'
keywords:
  - projects
  - open-source
  - github
---

I used to be an active member of the open-source community. I contributed to many projects, and started a few of my own. Below you can find a list of all projects I’ve taken part in over the years. Fair warning: many of them are no longer maintained.

{% assign groups = site.data.projects | group_by: "category" %}
{% assign groups = groups | sort: "name" %}

{% for category in groups %}
  <h2 class="visually-hidden">{{ category.name }}</h2>
  <ul class="List">
  {% assign projects = category.items | sort:"name" %}
  {% for project in projects %}
    <li class="List__item">
      <div class="List__item-inner">
        <a href="{{ project.link }}" class="List__primary-content" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
        <span class="List__secondary-content">{{ category.name }} · {{ project.description }}</span>
      </div>
    </li>
  {% endfor %}
  </ul>
{% endfor %}
