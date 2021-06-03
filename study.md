---
layout: page
title: Studying
permalink: /studying/
---

<div>

{% for post in site.categories.studying %}

  <article class="archive-item">
    <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
  </article>
  {% endfor %}
 
</div>
