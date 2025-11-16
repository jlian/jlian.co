---
title: "Automatically unlock your HomeKit smart lock without taking out your phone"
date: 2018-06-25T19:47:28-05:00
draft: true
tags:
  - homekit
  - automation
  - august
featured_image: "/images/posts/unlock-via-location-homekit/featured.jpg"
description: "Use a hidden Hue bulb as a presence proxy so HomeKit silently unlocks your August Smart Lock when you arrive."
---

HomeKit draws a hard line between "nice to have" automations (turn on lights) and "security" automations (unlock a door). If you try to build a geofence rule that unlocks the front door, the Home app prompts for confirmation on your phone every single time. That keeps Apple happy, but it defeats the point of hands-free arrival after grocery runs.

This post walks through the loophole: use a hidden [Philips Hue](https://www.philips-hue.com) bulb as a proxy presence sensor, let the [Eve app](https://apps.apple.com/app/eve-for-homekit/id917695792) watch for a specific color change, and have Eve trigger the unlock command to the [August Smart Lock](https://august.com/products/august-smart-lock-pro-connect). Hue handles the geofence, Eve handles the automation rule, and HomeKit thinks we are just reacting to a light changing color. The result: the door clicks open as soon as I cross the geofence, with no prompts.

![Placeholder – hero image of the apartment door with the August lock and a concealed Hue bulb in frame.](PLACEHOLDER: capture door and hidden bulb setup.)

## Why HomeKit nags about unlocking

HomeKit classifies door locks as a "secure" service. Any automation that involves `LockTargetState = Unsecured` from Home, Shortcuts, or Siri demands explicit approval on the nearest iOS device. That is perfect for random scenes but impossible when your hands are full. I wanted the same behavior August's own app offers—geo-unlock as I approach the front door—but inside HomeKit so scenes, HomePods, and other automations stay in sync.

The workaround is simple: remove the lock from the trigger side of the automation. Instead of "when I arrive, unlock the door," we say "when this light turns a very specific shade of green, unlock the door." Hue is allowed to change colors unattended, and Eve can react to that state change without Apple demanding confirmation.

## Gear and apps involved

The stack is straightforward: a hidden Hue White & Color Ambiance bulb that stays powered in a closet, the Hue Bridge that already handles everything else in the apartment, an August Smart Lock Pro linked to HomeKit through August Connect, and the Eve for HomeKit app because it can build value-based rules Apple still hides. Add an iPhone and a Home hub (Apple TV or HomePod) and every piece is in place.

![Placeholder – diagram showing Hue geofence feeding Eve rule, which sends unlock command to August lock.](PLACEHOLDER: simple flow diagram.)

## Step 1 – Teach Eve to arm the proxy

Open the Eve app and build a location rule. Choose **Location → When I arrive** (or limit it to specific people) and add an action that sets the hidden Hue bulb to an unmistakable color: Hue 90°, Saturation 100%, Brightness 100% in my case. Save that action as a reusable scene called `Arrival Proxy`. In the same session, capture a companion scene named `Proxy Reset` that returns the bulb to warm white at 1%. Eve now owns the geofence and drives the bulb to a known state the moment I cross the boundary, independent of Apple’s confirmation prompts.

## Step 2 – Use Eve to catch the signal

The second half of the chain also lives in Eve, this time as a value-triggered rule. Configure it like this:

- **Trigger:** Hidden Hue Bulb → Hue equals 90°.
- **Extra guard:** Add Saturation equals 100% so only the proxy color fires.
- **Action:** Run a scene called `Unlock on arrival` that unlocks the August and applies `Proxy Reset` to the bulb.

Once saved, Eve writes the rule into HomeKit so the Home hub can execute it even when my phone stays in my pocket.

```text
WHEN
	Hidden Hue Bulb – Hue equals 90° AND Saturation equals 100%
DO
	Run scene "Unlock on arrival" (Unlock August + set bulb to Proxy Reset)
```

## Reliability notes after a few months

Color-based rules fire faster than I expected: the Hue Bridge pushes the characteristic change almost instantly and Eve responds before I reach the front step. Battery level on the August lock matters, though—anything under roughly 30% adds noticeable lag, so I now swap cells on a seasonal schedule. The only failure mode I have seen is when the bulb fails to reset; pairing the hue and saturation checks with the `Proxy Reset` scene keeps that from happening twice.

![Placeholder – screenshot of the Eve rule showing the hue trigger and unlock action.](PLACEHOLDER: Eve rule screenshot.)

## Security considerations

The hack still assumes everyone with Home access is trusted; anyone who can set the bulb to that neon color can open the door, so keep control of scenes tight. I run the geofence radius at the smallest value that still catches me reliably—"When I arrive in the neighborhood" with the slider almost touching the building—so the unlock fires close to the door instead of a block away. August's activity feed records each event and my Twilio buzzer script (`text-me.js`) sends an SMS whenever the passphrase flow fires, giving me redundant logs if something odd happens.

## What I would like to improve next

There is still room to tighten the setup. A [Hue Smart Plug](https://www.philips-hue.com/en-us/p/hue-smart-plug/046677552343) could stand in for the color bulb so I am not hiding a pricey lamp in a closet, and a Shortcuts automation that arms the proxy only when my phone is nearby would cut down on noise from other residents. I also want the unlock to land in my Home Assistant logbook so the whole apartment history lives in one place.

Until Apple allows silent unlock automations, this Hue color proxy is the least finicky approach I have tried. It keeps everything inside HomeKit, plays nicely with scenes, and respects the "hands full of groceries" scenario that started this whole project.

