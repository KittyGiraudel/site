---
layout: default
title: "Speaking"
comments: false
---

# Speaking events

<img src="https://pbs.twimg.com/profile_banners/551949534/1401302499/1500x500" alt="Photography by Alexandra Lucas" />

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
