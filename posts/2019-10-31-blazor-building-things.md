---
title: 'Trying out Blazor (part 3): Our first component'
date: "2019-10-31T08:00:00.000Z"
---

It is been a while since the last post. In fact, it took so long that Microsoft already released .Net Core 3.0. So without further due, let's start building something with Blazor.

<!-- more -->

It is been a while since the last post. In fact, it took so long that Microsoft already released .Net Core 3.0. So without further due, let's start building something with Blazor.

## But first...

Since the final version has been released, we don't need to fool around with the Preview version anymore. You can download the new .Net Core 3.0 SDK binaries from the [official download page](https://dotnet.microsoft.com/download/dotnet-core/3.0). The process of installation is the very same described in the [first post]({% post_url 2019-08-25-blazor-getting-started %}).

Another issue I found is that the previously created project stopped working. Microsoft changed something in the project structure. I got to admit that, since we did not build anything at all with that project, I prefer dumping that and creating a new one using the new .net version.

## Hello Blazor

One of the biggest strengths of Blazor is that it allows you to reuse your UI code via components. So let's begin by creating our very first component. First, I will create a Components folder in which I will keep all my generated components. It is not an advisable approach in bigger projects (since it tends to become messy very fast) but it will do for now.

Our very first component will just print a "Hello Blazor" message, so I will call it Hello. Create a _Hello.razor_ file inside the Components folder. This file will just contain the following HTML content:

{% highlight html %}
  <h1>Hello Blazor</h1>
{% endhighlight %}

The Index.razor page is pretty polite and is responsible for greeting us to the application. So let's use our new component there.

As default, our component is available to be used in the form of an HTML tag named after the file name. In the case of this Hello.razor component, the tag is <Hello />. Since it is not a standard HTML tag it has no meaning until we point where it is defined. To do so we need to add an @using directive to our Index.razor file. The final result will be something like this:

{% highlight csharp %}
  @page "/"
  @using Blazoring.Components

  <Hello />
{% endhighlight %}

![Screenshot of the Index page displaying the Hello component renderized]({{ site.url }}/assets/2019-10-31-blazor-03-01.png)

## Hello Anyone

Our first component did its job and displayed the correct message. It is not very impressive though. An ideal Hello component would greet anyone, not just Blazor 👀. To do so we will need to change our component so that it will receive as a parameter the subject we want to greet, like this:

{% highlight csharp %}
  @page "/"
  @using Blazoring.Components

  <Hello who="Doctor"/>
{% endhighlight %}

For it to work we will add an attribute called "who" to our component that will receive this value. Then we will be able to use it properly inside the Hello component. It can be done by declaring a property decorated with a _Parameter_ attribute.

{% highlight csharp %}
  <h1>Hello @Who</h1>

  @code {
    [Parameter]
    public string Who { get; set; }
  }
{% endhighlight %}

![Screenshot of the Index page displaying the message Hello Doctor]({{ site.url }}/assets/2019-10-31-blazor-03-02.png).

## Morning ma'am

Our first component is good at saying Hello. But what if we want a different greet according to the time of the day? Easy! Just create a method on Hello.razor that builds a greeting string according to the current time, right? Well, sort of...

It would do the job, sure. But it is a good practice to separate components responsible for displaying the data from those that gather and process it. Ideally, presentational components shouldn't be very smart. We should keep the greeting logic in the Index page and send it via a parameter to the Hello component, that would be specialized in displaying the information properly.

> Keep in mind that for the sake of simplicity I will be using DateTime.Now in this example. This is not good at all since it would probably return the current time in the server, not the client. The wise solution should be somewhere around [here](https://github.com/jsakamoto/Toolbelt.Blazor.TimeZoneKit).

We just have to create our function in the _Index.razor_ file and send it as a parameter to the Hello component.

{% highlight csharp %}
  @page "/"
  @using Blazoring.Components

  <Hello Greet=Greet Who="Ma'am" />

  @code {
    public string Greet() {
      //Notice that DateTime.Now is a bad approach in this case.
      //Since this is server-side blazor, it would probably return the time of the server. 
      var hour = DateTime.Now.Hour;

      if (hour > 2 && hour <= 12)
        return "Good morning";

      if (hour > 12 && hour <= 20 )
        return "Good afternoon";
      
      return "Good evening";
    }
  }
{% endhighlight %}

Then in the _Hello.razor_ we receive the method as an attribute and use it properly in the HTML.

{% highlight csharp %}
  <h1>@Greet() @Who</h1>

  @code {
    [Parameter] public string Who { get; set; }
    [Parameter] public Func<string> Greet { get; set; }
  }
{% endhighlight %}

The result is, as expected, a very polite Home page for our website:

![Screenshot of the Index page displaying the message Good evening Ma'am]({{ site.url }}/assets/2019-10-31-blazor-03-03.png).

## Conclusion

Our silly example allowed us to have a look at how to do some basic data exchange between components. But everything is still very ugly. Next time we will have a look at styling our component.
