---
title: 'Trying out Blazor (part 1): Setup'
date: "2019-08-25T08:00:00.000Z"
---

It's been more than a year since Microsoft first announced Blazor. Back then it was only an "experimental" web assembly project, a way of running C# code on the web. But then the thing evolved, became an official preview project and it is planned to be released on September 2019 on its server-side version as a part of the Net Core 3. That means we will have to wait a little bit until we see its power as a client-side technology.

<!-- more -->

It's been more than a year since Microsoft first announced Blazor. Back then it was only an "experimental" web assembly project, a way of running C# code on the web. But then the thing evolved, [became an official preview project](https://devblogs.microsoft.com/aspnet/blazor-now-in-official-preview/) and it is planned to be released on September 2019 on its server-side version as a part of the Net Core 3. That means we will have to wait a little bit until we see its power as a client-side technology.

And to be clear, no, I don't believe it will be a JavaScript killer. JavaScript doesn't need to be killed, it is perfectly fit for some projects and some teams and terrible for a bunch of others. Stop complaining and accept that the world is broader than our visions.

Ok, let's begin by making our first server-side Hello World project (yeah, I know... Not that exciting. But I gotta start somewhere).

## Instalation

Since it is a Preview feature, we have to install the .Net Core 3 Preview SDK. I will be doing it on an Ubuntu machine because... Why not? Nowadays "Microsoft ❤️ Linux" so let's embrace that spirit.

From the [.Net Core 3 download page](https://dotnet.microsoft.com/download/dotnet-core/3.0) download the last version of the SDK.

Extract the tar package using the command:
> tar -xf name-of-the-package-file

Move the contents of the package to the following path (create it if necessary):
> /usr/share/dotnet

That is it. Now if I open the terminal and type _dotnet --version_ I get the following response indicating that I got the preview version:

![useful image]({{ site.url }}/assets/2019-08-25-blazor-01-01.png)

## Install the project template

To create my very first Blazor application I will be using Microsoft's sample project. It requires me to download the project template. The way to go here is to use the dotnet CLI to get it. Type the following command on the terminal:
 > dotnet new -i Microsoft.AspNetCore.Blazor.Templates::3.0.0-preview8.19405.7

Breaking down this simple command, we got the "dotnet new" command that is used to create new projects via dotnet CLI followed by the *-i* option that aims to  *I*nstall  the template Microsoft.AspNetCore.Blazor.Templates::3.0.0-preview8.19405.7.

## Creating a new project using the Blazor template

Now that we installer our template it is possible to create a new project using the command:
> dotnet new blazorserver -o Blazoring

It will create a new project called _Blazoring_ using the template "blazorserver". It will be placed on a folder called (you guessed it) Blazoring.

We can then access the new folder and start the project:
> cd Blazoring
> dotnet run

Open the browser and access <https://localhost:5001/> and behold our first Blazor application running :)

![Screenshot of the Index page displaying the Hello World message]({{ site.url }}/assets/2019-08-25-blazor-01-02.png)

Next up we will explore this application and understand what exactly is Blazor doing for us.
