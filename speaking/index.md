---
layout: page
title: Speaking events
excerpt: An overview of all my talks, past and to come, including slides and videos.
tags:
  - speaking
  - talks
  - conferences
---

Over the last few years I’ve had the amazing opportunity to be a speaker at some great events. If you would like me to speak at your conference, be sure to get in touch!

<ul class="list">
{% for event in site.data.speaking %}
  <li class="list__item">
    <div class="list__item-inner">
      <span class="list__secondary-content">{{ event.date|date_to_string }} — {{ event.location }}
      {% if event.actions %}
      <ul class="dotted-list">
      {% for action in event.actions %}
        <li>
          <a target="_blank" rel="noopener noreferrer" href="{{ action[1] }}">{{ action[0] }}</a>
        </li>
      {% endfor %}
      </ul>
      {% endif %}
      </span>
      <a href="{{ event.link }}" class="list__primary-content" target="_blank" rel="noopener noreferrer">{{ event.event }}</a>
    </div>
  </li>
{% endfor %}
</ul>
