---
title: Dev possibilities with the new iPhone Dynamic Island
date: 2022-09-09 09:45:47 +07:00
modified: 2022-09-09 09:45:47 +07:00
tags: [iphone14, dynamic-island, ios-dev]
description: All the services are free, a source code this site placed on github repository and intergration with netlify service, another service that you can use is github page for hosting your own static site.
---

Yesterday Apple announced the brand-new iPhone 14 Pro, which includes a surprising new feature regarding the aesthetics of the device and the interaction between it and the user: the Dynamic Island.

## The Dynamic Island
In simple terms, the Dynamic Island consists of a software extension of the notch at the top of the screen. Thanks to the ability of OLED screens to completely turn off pixels to appear pitch black, the notch is "extended" through the UI showing various information such as alerts, notifications and background activities such as calls and music.

*In the course of the article I will use the abbreviation D.I. to indicate the Dynamic Island.*

<center style="padding: 20px">
<iframe width="560" height="315" src="https://www.youtube.com/embed/WuEH265pUy4?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</center>

Apple said:
> The Dynamic Island enables new ways to interact with iPhone, featuring a design that blends the line between hardware and software, adapting in real time to show important alerts, notifications, and activities.

While the D.I. is definitely a top feature of the new iPhone Pro lineup, in this article I would like to analyze what possibilities this new way of interacting opens up for developers.

## Let's make it...SwiftUI's way

As Serenity Caldwell [stated on Twitter](https://twitter.com/settern/status/1567617031427735552)
> Dynamic Island it's part of [Live Activities](https://developer.apple.com/news/?id=hi37aek8) and ActivityKit — not available in the RC, but will be coming to iOS 16 & Xcode later this year!

So we can expect by the end of the year (probably with iOS 16.1?) the arrival of these new APIs to enrich our apps with specific features for the Dynamic Island. It's not hard to imagine that some big apps like Spotify will roll out such integrations shortly.

Even if Live Activities and ActivityKit won’t be included in the initial publicly released version of iOS 16, Xcode 14 beta already includes APIs for building powerful and useful Lock Screen Widgets through WidgetKit. Live Activities works like any Widget Extension we used so far since iOS 14 and enables code sharing between our widgets.

However, while widgets use a timeline mechanism to receive updates, Live Activities receive updated data from our app through ActivityKit or by receiving remote push notifications.

## Feature ideas
Going back to our Dynamic Island, let's see some ideas to extend existing apps through it.

#### Shazam
After starting the Shazam's search for a song from the control center, the search result could be displayed on the D.I. complete with album cover, without showing an intrusive notification.

#### Apple Find My
In Apple's video we saw an integration with the directions of Apple Maps in the D.I. A similar feature could be implemented for the Find My app, for example giving indications on the direction in which our AirTag is located.

#### Spotify
As said before, Spotify could be one of the first apps to add Dynamic Island support. An obvious implementation on their part would be a music mini-player (like the one shown for Apple Music).

#### Apple Reminders
Leaving the Reminders app with an expired reminder could result in a little badge on the D.I., so that we do not forget the reminder still to be completed.

## A permanent widget area?
An interesting and useful alternative way of using the Dynamic Island that Apple could introduce would be to make it a space for permanent widgets, like the ones on the home screen.

Given the small size of the area, the widget could be a simple dynamic icon (like the complications on Apple Watch), or if possible something more elaborate such as essential information about the next event coming up for Calendar app.

The choice of displaying a static widget or making the Island dynamic, with notifications and background activity, could then be left to the user.

I don't have much difficulty imagining a new `WidgetFamily` size in WidgetKit like `.systemIsland`.

## Conclusion

The Dynamic Island is certainly an innovative way of making an annoying hardware element such as the notch useful and pleasant.

Like all the extensions Apple has added in recent years, such as Widgets and App Clips, I'm sure we developers will be able to get the best out of it.