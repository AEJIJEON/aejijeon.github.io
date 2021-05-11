---
layout: page
title: Studying
permalink: /studying/
---

[Redux](http://aejijeon.github.io/studying/redux)  
[React](http://aejijeon.github.io/studying/react)  
[javascript](http://aejijeon.github.io/studying/javascript)  
[styled-components](http://aejijeon.github.io/studying/styledcomponent)

<div>

{% for post in site.categories.studying %}

  <article class="archive-item">
    <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
  </article>
  {% endfor %}
 
</div>
