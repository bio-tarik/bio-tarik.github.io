---
title: 'Trying out Blazor (part 2): Guided Tour'
date: "2019-09-01T08:00:00.000Z"
---

In the last post we have created a "Hello World" application using Microsoft's Blazor ServerSide template application. This time let's analyse the generated code.

<!-- more -->

In the [last post]({% post_url 2019-08-25-blazor-getting-started %}) we have created a "Hello World" application using Microsoft's Blazor ServerSide template application. This time let's analyse the generated code.

## Folder structure

Let's take a look at the main folder structure and then break down each one to better understand its contents:

``` sh
.
├── Data
├── Pages
├── Shared
└── wwwroot
```

- *Data*: This folder holds all the structure related to retrieving some fake data to our routes. It contains the _WeatherForecast_ model along with the _WeatherForecastService_ service to retrieving it;
- *Pages*: The Pages folder our App entry point file __Host.cshtml_ as well as our components, identifiable by the .razor extension. In this case, each component define a different page via the @page directive.;
- *Shared*: Contains common components that define the page layout and the navigation menu.
- *wwwroot*: Has the page's css and some libs.

## Further exploring the app

Now let's take a look at some interesting aspects of our app.

### Hello Blazor

Our Index page isn't that interesting since it just delivers some html content to the client. Notice the _@page_ directive that will be used by the Router to match the correct page according to the request URL.

{% highlight csharp %}
  @page "/"
{% endhighlight %}

Keep in mind though that this html will be processed by the compiler and the content will be delivered to the client-side by the SignalR endpoint.

### Show me some C# #

Jumping to the Counter component we have something more interesting. Here we can see the _@code_ directive in which there is some simple C# code:

{% highlight csharp linenos %}
@code {
    int currentCount = 0;

    void IncrementCount()
    {
        currentCount++;
    }
}
{% endhighlight %}

Nothing fancy, just a variable declaration followed by a method that increases its value. This block of code is then used in the html as follows:

{% highlight html linenos %}
  <p>Current count: @currentCount</p>
  <button class="btn btn-primary" @onclick="IncrementCount">Click me</button>
{% endhighlight %}

The <p> tag displays the value of the _currentCount_ variable and the button has an on click event defined that calls the _IncrementCount_ method. Every time the onclick event is fired, the method is called, the _currentCount_ value is updated and finally, the component is rerendered.

Also, by activating Firefox's paint flashing we can see that just the Counter component is being rerendered.
![useful image]({{ site.url }}/assets/2019-09-01-blazor-02-01.png)

### And what about data?

The next component is the _fetchData_ component that simulates a weather forecast page. The idea is to use the WeatherForecastService class to fetch the data and then display it in the component.

To do so the component needs to receive an instance of WeatherForecastService. That is defined in the following directive:

{% highlight csharp %}
  @inject WeatherForecastService ForecastService
{% endhighlight %}

That instance is created and injected in runtime. It works because it has been previously configured as a Service in the Startup.cs file:

{% highlight csharp linenos %}
  public void ConfigureServices(IServiceCollection services)
  {
      services.AddRazorPages();
      services.AddServerSideBlazor();
      services.AddSingleton<WeatherForecastService>();
  }
{% endhighlight %}

Then in the _@code_ block we can see a variable responsible for storing the weather information that is filled by an async call to the forecast service. The service is called during the _OnInitializedAsync_, a component lifecycle event that is executed *once* when the component is first instantiated in the page.

{% highlight csharp linenos %}
  WeatherForecast[] forecasts;

  protected override async Task OnInitializedAsync()
  {
      forecasts = await ForecastService.GetForecastAsync(DateTime.Now);
  }
{% endhighlight %}

Moving then to the html, there is an if block that checks whether or not the _forecasts_ value has been already initialized or not. It is necessary because, since it is an async call, it is not guaranteed to finish before the page rendering finishes.

{% highlight csharp linenos %}
  @if (forecasts == null)
  {
      <p><em>Loading...</em></p>
  }
  else
  {
      //Displays the retrieved data
  }
{% endhighlight %}

## Conclusion

Despite being an extremely simple application, it allowed us to have a glance on some basic features and to get some context on the Blazor syntax. But enough code reading, next time we will create our first component.
