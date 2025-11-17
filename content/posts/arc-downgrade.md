---
title: "When “downgrading” to ARC fixes everything"
date: 2025-11-20T09:00:00-08:00
draft: true
tags: [home theater, hdmi, arc, samsung, denon, hdmi-cec]
featured_image: "/images/posts/arc-downgrade/featured-new.png"
description: "Backing away from Samsung eARC on the S95B made the audio stack calm down."
---

In the [HDMI-CEC post](/posts/hdmi-cec/) I mentioned that my Samsung TV is on **ARC (not eARC)**. This is the backstory: eARC wouldn’t stay put, so the “downgrade” was the only way to make the stack boring again.

## Setup

The living-room rack looks like this:

- Samsung **S95B** on its eARC HDMI port
- **Denon AVR-X1700H** acting as the switch for every input
- CEC left on everywhere, no exotic cabling

With **HDMI eARC Mode = Auto**, the S95B would:

- Boot to **TV Speakers** instead of “Receiver (HDMI-eARC)”
- Quietly flip back to TV Speakers after app changes
- After the 1651 firmware update, *always* wake up in TV Speakers even with an ARC/eARC device attached ([Samsung Community][1])

This was before the Raspberry Pi CEC automation from the other post, so the goal was simply to stop burning energy on eARC.

## The nudge

While doomscrolling for answers I ran into a Sonos Community thread titled something like **“Samsung S95C and Sonos Arc – issues with eARC”**. Different hardware, same failure mode: random dropouts, TV defaulting to its own speakers, general unreliability. The replies that reported success all did the same thing—force the Samsung back to ARC and leave everything else alone. ([Sonos Community][2]) Good enough for an experiment.

## The actual change

On the **Samsung S95B**:

- `Settings → Sound → Expert Settings → HDMI eARC Mode` → **Off**
- Leave **Anynet+ (HDMI-CEC)** on
- `Sound Output` now lists **Receiver (HDMI)** without the eARC badge—select that

On the **Denon X1700H**:

- **HDMI Control = On**
- **ARC = On**

Then power-cycle the Denon, power-cycle the TV, and let them renegotiate.

After that sequence the TV consistently booted to **Receiver (HDMI)** and stopped randomly switching back mid-app-hop. Still not perfect, but the issue fell from “daily” to “rare enough to ignore.”

## What changed (and what didn’t)

ARC can’t send Dolby TrueHD / DTS-HD MA / multichannel LPCM from TV apps to the receiver. It still carries Dolby Digital / Dolby Digital Plus 5.1 and DD+ Atmos, which is already the ceiling for Samsung’s streaming apps. ([AVForums][3]) Anything lossless that I care about (Apple TV, consoles) plugs into the Denon directly, so the audio-path downgrade cost nothing.

## Why this matters for the CEC post

Only *after* the ARC switch did I start the Raspberry Pi + `cec-client` automation described elsewhere. That work attacks a different pile of bugs: consoles waking the TV without waking the receiver, inputs drifting, etc. Trying to automate around that while the TV kept defecting to TV Speakers would have been unhinged.

So if your setup looks similar—a Samsung S95-series panel, eARC-capable AVR or soundbar, recurring “why is it on TV Speakers again?” moments—the lowest-effort move is still the one I stole from Sonos: disable **HDMI eARC Mode**, let the TV fall back to ARC, and see if the system calms down before layering in automation.

[1]: https://eu.community.samsung.com/t5/tv/s95b-update-1651-defaults-the-output-to-tv-speakers-at-startup/td-p/11349869?utm_source=chatgpt.com "S95B Update 1651 defaults the output to TV Speakers at startup"
[2]: https://en.community.sonos.com/home-theater-228993/samsung-s95c-and-sonos-arc-issues-with-earc-6888562?utm_source=chatgpt.com "Samsung S95C and Sonos Arc – issues with eARC"
[3]: https://www.avforums.com/threads/samsung-tv-s95b-and-soundbar-q990b-settings.2420641/?utm_source=chatgpt.com "Samsung TV S95B and Soundbar Q990B Settings"
