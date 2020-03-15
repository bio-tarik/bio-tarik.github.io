---
title: '"Current year" variable on a Jekyll website'
date: "2019-08-23T08:00:00.000Z"
---

The first thing I noticed as soon as I made my very first post was the fact that this template had a fixed _year_ value on the footer. It is not an important thing but let's fix it permanently:

<!-- more -->

The first thing I noticed as soon as I made [my very first post](https://bio-tarik.github.io/blog/why-a-blog) was the fact that this template had a fixed _year_ value on the footer. It is not an important thing but let's fix it permanently:

![useful image]({{ site.url }}/assets/2019-08-23-footer.png)

The footer template had a simple span containing the text value _2015_.

{% highlight html %}

<footer class="footer"><span>@2015 - Emerald</span></footer>

{% endhighlight %}

## Solution

I was able to achieve it by using the following jekyll liquid markup tag:

{% raw  %}

> {{ 'now' \| date: "%Y" }}

{% endraw %}

{% highlight html linenos %}

{% raw  %}
<footer class="footer">
  <span>
    {{ 'now' | date: "%Y" }} - Tarik Ayoub
  </span>
</footer>
{% endraw %}

{% endhighlight %}

The result you can check by simply scrolling all the way down :).

## What exactly is happening?

According to [the documentation](https://shopify.github.io/liquid/filters/date/) here we a using the _now_ keyword to retrieve the current time and the _date_ filter to modify its output according to the given format parameter "%Y".

Keep in mind that "current time" provided by the "now" keyword is the time when the page was generated. Do not confuse it with the client's current time.
