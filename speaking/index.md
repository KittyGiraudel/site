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

<ul class="List">
{% for event in site.data.speaking %}
  <li class="List__item">
    <div class="List__item-inner">
      <span class="List__secondary-content">{{ event.date|date_to_string }} — {{ event.location }}
      {% if event.actions %}
      <ul class="DottedList">
      {% for action in event.actions %}
        <li>
          <a target="_blank" rel="noopener noreferrer" href="{{ action[1] }}">{{ action[0] }}</a>
        </li>
      {% endfor %}
      </ul>
      {% endif %}
      </span>
      <a href="{{ event.link }}" class="List__primary-content" target="_blank" rel="noopener noreferrer">{{ event.event }}</a>
    </div>
  </li>
{% endfor %}
</ul>
