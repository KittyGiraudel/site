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

<img src="/images/banners/speaking.jpg" alt="Photography by Alexandra Lucas" />

{% include ad.html %}

It does not happen *that* often, but it happens! Why don't you come and see me at one of the few conferences I attend. I'm sure it would be nice to meet!

<ul class="events  list">
{% for event in site.data.speaking %}
  <li class="event  list__item{% if event.past %}  event--past{% endif %}">
    <span class="event__data  list__secondary-content">{{ event.date }} — {{ event.location }}</span>
    <a class="event__link  list__primary-content" href="{{ event.link }}" target="_blank">
      {{ event.event }}
    </a>
    {% if event.actions %}
    <ul class="event__actions">
    {% for action in event.actions %}
      <li><a target="_blank" href="{{ action.link }}">{{ action.name }}</a></li>
    {% endfor %}
    </ul>
    {% endif %}
  </li>
{% endfor %}
</ul>
