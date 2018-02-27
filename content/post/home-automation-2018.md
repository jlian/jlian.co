---
title: "State of my home automation in 2018"
date: 2018-02-21T20:07:29-08:00
draft: true
featured_image: "/images/pier.jpg"
description: "The absolute best guide to home automation in 2018."
---

Since moving to Seattle I got increasingly into the idea of having my home automated. I know that there's a lot of hate of the internet (see Internet of Shit) but, in my experience, home automation isn't just a dream in 2018. It's pretty expensive and not everything works as smoothly as you'd like, but if you're willing to put in the work (and money!) you'd be able to achieve some pretty cool results.

# Where We Are and How We Got Here

- Was in bed and was like wow I wish I didn't have to get up to turn off the lights
- Hmm I've heard of Hue Lights before I wonder if that's any good
- Realized that I never use my TV and Apple TV
- Probably because it's too much friction to turn it on
- Decided to look into Hue Lights to begin with

## Lamps

- Bought the Hue starter kit because I wanted also coloured bulbs
- Installed them in my bedroom and achieved the first scenario
- Don't have to get up to turn off lights anymore!
- Integration with HomeKit and Siri actually really solid
- Bought some more to make my living room lamps also connected
- Realized that there's much more to this
- Just lamps doesn't do anything other than automated colouring

## Apple TV

- The story is to have my TV and Apple TV turn on when I get home, so that I actually start watching my TV instead just being on my phone
- I know this sounds incredibly first world problems
- No way to control Apple TV via HomeKit
- No way to control LG TV via HomeKit
- Bought Raspberry Pi, Logitech Harmony, and set up HomeBridge with `homebridge-harmony` and `homebridge-webos` to control
- Integrates with Siri ok
- Link to blog for homebridge reliability
- Problems: no state detection, goes out of sync when your roommate turns it off
- Or if it goes to sleep on its own
- Future work to fix and state detection

## Door Lock

- Story: no longer have to carry keys, auto unlock when I'm near
- Originally wanted to build my own lock with servo
- Concerned with security
- Just bought August Smart Lock 3rd gen, it's alright
- Looks goofy, and home sharing is broken
- Unblock on approach is possible via HomeKit hack
- Link to other blog

## Light Switches on the Wall

- To realize the story of being able to never use the wall switches
- Figure out if you have ground wires or not, if not you're stuck with Lutron Caseta
- Another hub, yay!
- Installation pretty easy
- Multi switch is possible via Pico remote

## Shouting Commands

- Tapping on my phone is too hard and hostile to guests, they should be able to control as well
- Bought Google Home Mini - it's pretty good

## Vacuum

- I want to very rarely vacuum and still have clean floor
- Also want to be able to remotely start and see progress
- Bought Xiaomi vacuum, can be automated
- Needed to hack and get token

## Building Buzzer

# Principles and "Engineering Process"

## Choosing the Platform

- HomeKit + HomeBridge
- Google Home
- Alexa

## Prioritized Backlog

## "You Should Never Have to Adapt to Technology" and Observing Your Customers

# Future Work

## Thermostat

## Blinds

## Automatic Music

## Coffee

