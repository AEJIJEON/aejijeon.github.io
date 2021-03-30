---
layout: page
title: ToDo List with vanila JS
permalink: /project/todo/
---

<div>

{% for post in site.categories.todo %}

  <article class="archive-item">
    <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
  </article>
  {% endfor %}
 
</div>
