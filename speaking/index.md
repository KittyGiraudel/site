---
layout: default
title: "Speaking"
excerpt: "An overview of all my talks, past and to come, including slides and videos."
tags:
  - speaking
  - talks
  - conferences
---

# Speaking events

{% include ad.html %}

It does not happen *that* often, but it happens! Why don't you come and see me at one of the few conferences I attend. I'm sure it would be nice to meet!

<ul class="list">
{% for event in site.data.speaking %}
  <li class="list__item">
    <p class="list__primary-content">
      <a href="{{ event.link }}" target="_blank">{{ event.event }}</a>
    </p>
    <span class="list__secondary-content">{{ event.date|date_to_string }} — {{ event.location }}</span>
    {% if event.actions %}
    <ul>
    {% for action in event.actions %}
      <li><a target="_blank" href="{{ action.link }}">{{ action.name }}</a></li>
    {% endfor %}
    </ul>
    {% endif %}
  </li>
{% endfor %}
</ul>
