---
layout: page
theme: t-yellow
title: "Speaking events"
excerpt: "An overview of all my talks, past and to come, including slides and videos."
tags:
  - speaking
  - talks
  - conferences
---

It does not happen *that* often, but it happens! Why don't you come and see me at one of the few conferences I attend. I'm sure it would be nice to meet!

<ul class="list">
{% for event in site.data.speaking %}
  <li class="list__item">
    <div class="list__item-inner">
      <span class="list__primary-content">
        <a href="{{ event.link }}" target="_blank">{{ event.event }}</a>
      </span>
      <span class="list__secondary-content">{{ event.date|date_to_string }} — {{ event.location }}</span>
      {% if event.actions %}
      <ul>
      {% for action in event.actions %}
        <li>
          <a target="_blank" href="{{ action[1] }}">{{ action[0] }}</a>
        </li>
      {% endfor %}
      </ul>
      {% endif %}
    </div>
  </li>
{% endfor %}
</ul>
