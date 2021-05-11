---
layout: page
title: Algorithm
permalink: /programming/algorithm/
---

<div>

{% for post in site.categories.algorithm %}

  <article class="archive-item">
    <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
  </article>
  {% endfor %}
 
</div>
