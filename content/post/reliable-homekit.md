---
title:  "Get reliable connection with your HomeKit devices"
date: 2018-02-19T19:33:06-05:00
tags: [homekit, home automation]
featured_image: "/images/home2.jpg"
description: ""
draft: true
---

I've had pretty good experiences with HomeKit with Philips Hue and Lutron Caseta. However, I noticed that standalone devices (ones that don't have hubs) would often not respond or show properly in HomeKit. This post shows somethings that I learned trying to get all my devices to be reliable.

# The problem is almost certainly with your router

*But, but, my router is [almost $300](http://a.co/16d0YZQ)!!* If that's what you said then great because that's what I said. It turns out that there are a few factors that make it hard for HomeKit to be on every wifi setup.

#### To get good wifi in an apartment building you have to use 5Ghz

Today, the 2.4Ghz band in a most populated areas are almost unusable. There're too many competing routers for the 12 bands available[^1]. If your router is newer it's probably dual-band, and your device is probably then also smart enough to figure out to use the 5Ghz band because it's less congested. Your wifi probably isn't terrible all the time.

#### HomeKit devices are all 2.4Ghz

#### Bonjour services can sometimes work poorly across bands

# Disable your router's "advanced features"

[^1]: What ends up happening is that since most routers are set to `channel = auto` they end up hopping from channel to channel, trying to get the lowest interference. But since everybody hops this way it becomes a game of musical chairs. The result is you're using a phone and suddenly your internet is slow. Your neighbor's router just decided to hop in your channel. Sup.



- HomeKit is ok
- Devices are most of time ok 
- Your problems are almost certainly with your Wifi and router, more than anything
- Biggest mistake that people make: not using 5Ghz
- Bonjour services can sometimes get out of wack across bands
- Since most IoT devices are 2.4Ghz
- Use this app to check if you phone can discover them on Bonjour
- If not, your router is doing something funky
- I solved it by following this blog to disable advanced features for my router
- Always solid now