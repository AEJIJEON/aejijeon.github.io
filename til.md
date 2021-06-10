---
layout: page
title: Today I Learned
permalink: /til/
---

   <style>
     .post-link {
  color: black;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
}
.post-link:hover{
  opacity: 0.7;
}
.post-date {
  color: #aaa;
  font-weight: normal;
  margin-right: 15px;
}
.post-category{
  color: #aaa;
}
.archive-item {
  margin-bottom: 25px;
}


   </style>
<div>
<p>
              {{site.categories.til.size}} posts
            </p>
{% for post in site.categories.til %}

  <article class="archive-item">
    <h4><a class="post-link" href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
     <span class="post-date">
             <time>{{ post.date | date_to_string }}</time>&nbsp;
          <!-- {{ post.date }} -->
        </span>
        <span class="post-category">
          #
          {{ post.categories}}
        </span>
  </article>
  {% endfor %}
 
</div>
