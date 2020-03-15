---
title: 'Trying out Blazor (part 4): Style it up'
date: "2019-11-03T08:00:00.000Z"
---

Following up our last post in which we created a simple component, we will now investigate different approaches on how to add styles to Blazor components.

<!-- more -->

Following up our [last post]({% post_url 2019-10-31-blazor-building-things %}) in which we created a simple component, we will now investigate different approaches on how to add styles to Blazor components.

## Yup... Inline styles 🧵

The first approach is the simplest, it is the plain old inline style. Just like with regular HTML, here we can change the aspect of our elements by using the style attribute.

For example, to make our component text red we can do:

{% highlight html %}
  <h1 style="color:red">@Greet() @Who</h1>
{% endhighlight %}

It works, of course. But this is bad! My eyes are bleeding from looking at this too much. This way, every instance of <Hello/> WILL be red and it is hard to override it if you ever need. Besides, now we have some filthy presentation markup mixed with our structural HTML. Seriously, don't do it.

## *The* CSS file

A slightly better way of adding styles to our component is to use the _site.css_ file located inside the wwwroot folder. We should declare classes in that file and then use them in the components:

*Site.css*
{% highlight css %}
  .red-text {
    color: red;
  }
{% endhighlight %}

*Hello.razor*
{% highlight html %}
  <h1 class="red-text">@Greet() @Who</h1>
{% endhighlight %}

This way we can achieve the same result without using any inline style. Although this is more elegant than the previous approach, it is far from the ideal solution. The _site.css_ is a global scope style sheet, meaning that changes you add there can have unintentional side effects on other components. Besides, the bigger your project, the bigger this file. Someday in the future, you can end up having a huge spaghetti CSS file that is hard to maintain, full of repeated classes and that increasingly forces you to be highly creative when creating new super-specific CSS classes.

## Say hello to my little friend

Now we will use big guns to deal with this issue. We will be using an amazing NuGet package called [BlazorStyled](https://blazorstyled.io/) that allows us to write our CSS classes directly in the components. It is open-source and free thanks to the nice [person who created it](https://github.com/chanan). Even though this is a more complicated approach, it solves many problems:

* Scoped CSS to avoid class collisions;
* All the component code concentrated on a single file and yet respecting the separation of concerns;
* Auto-generated class names.

We will install the package using the dotnet CLI. To do so, navigate to the project's folder in the terminal and type the following command:
> dotnet add package BlazorStyled

Now we need to load the library during the project startup. It is done by adding the following lines to the _Startup.cs_ file:

*Startup.cs*
{% highlight csharp %}
  (...)
  using BlazorStyled;

  namespace Blazoring
  {
      public class Startup
      {
          (...)

          public void ConfigureServices(IServiceCollection services)
          {
              (...)
              services.AddBlazorStyled();
          }

          (...)
      }
  }
{% endhighlight %}

Then, to make the BlazorStyled component available, open the _\_Host.cshtml_ and add the following line to the <head> tag:

*_Host.cshtml*
{% highlight html %}
<html>
  <head>
      (...)
      @(await Html.RenderComponentAsync<BlazorStyled.ServerSideStyled>(RenderMode.ServerPrerendered))
  </head>
</html>
{% endhighlight %}

Finally, import the component in the _\_Imports.razor_ file to allow it to be used in our component:

*\_Imports.razor*
{% highlight csharp %}
  (...)
  @using BlazorStyled
{% endhighlight %}

After the long setup part, we are finally able to use the library capabilities in our component. It is done via a custom component called <Styled> that accepts our stylesheet as the content value. The _Hello.razor_ component final result will be like this:

*Hello.razor*
{% highlight csharp %}
  <Styled @bind-Classname="@RedText">
      color: red;
  </Styled>

  <h1 class="@RedText">@Greet() @Who</h1>

  @code {
    [Parameter] public string Who { get; set; }
    [Parameter] public Func<string> Greet { get; set; }
    private string RedText;
  }
{% endhighlight %}

Let's breakdown what we did here. First, we bind the _RedText_ to the Styled component that will generate a class name to us. Then we can use that class name in the HTML content. Then we provide the styles we want to apply as content of the <Styled> component. The resulting HTML and CSS are:

![Screenshot of the Index page displaying the message Good evening Ma'am in red along with the generated CSS displaying a randomly generated class name]({{ site.url }}/assets/2019-11-03-blazor-04-01.png).

## Conclusion

Through the usage of a smart third-party library, we were able to find a suitable solution for our needs. Even though I still have some worries about it (like performance), it seems like a good way to create an easily maintainable website with complex styling.
Speaking of complexity, I think that I've already stretched too much this dummy "Hello world" kind of example. I know that this is the worst kind of example, so next time we will begin to build something a little bit more meaningful.
