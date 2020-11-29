---
layout: page
title: Recipes
excerpt: |
  Recipes from my kitchen.
keywords:
  - recipes
  - cooking
  - food
---

<p>Not everything has to be about coding. I do enjoy cooking (and eating, needless to say) as well as taking notes. Find below some of my recipes.</p>

<ul class="List">
{% for recipe in site.recipes %}
  <li class="List__item">
    <div class="List__item-inner">
      <span class="List__secondary-content">
        For {{ recipe.serves }} · About {{ recipe.preparation_time }}
      </span>

      <a class="List__primary-content" href="{{ recipe.url }}">
        {{ recipe.name }}
      </a>
    </div>
  </li>
{% endfor %}
</ul>
