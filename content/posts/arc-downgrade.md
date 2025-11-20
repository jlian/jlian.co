---
title: "When “downgrading” to ARC fixes everything"
date: 2025-11-18T09:00:00-08:00
tags:
- home theater
- hdmi
- arc
- samsung
- denon
- hdmi-cec
featured_image: "/images/posts/arc-downgrade/arc.jpeg"
description: "Backing away from Samsung eARC on the S95B made the audio stack calm down."
---

In the [Raspberry Pi CEC automation](/posts/hdmi-cec/) I mentioned that my Samsung TV is on **ARC (not eARC)**. This is the backstory: eARC wouldn’t stay put, so dropping back to ARC was the only reliable option.

## Setup

Samsung **S95B** hangs on the wall, its eARC port feeds a **Denon AVR-X1700H**, and every source runs through the receiver with CEC enabled.

With **HDMI eARC Mode = Auto**, the S95B would sometimes boot to TV Speakers instead of “Receiver (HDMI-eARC),” silently fall back to TV Speakers after source changes, and after the 1651 firmware update it would wake up that way every single time even with an ARC/eARC device attached ([Samsung Community][1]).

I hadn't thought about the CEC automation via Raspberry Pi yet, I just wanted an improvement with minimal work.

## I don't even use Sonos but it's great that their community is so active about HDMI/ARC/eARC issues

While looking for answers I ran into a Sonos Community thread titled [Samsung S95C and Sonos Arc – issues with eARC][2]. Different hardware, same failure mode: random dropouts, TV defaulting to its own speakers, general unreliability. The replies that reported success all did the same thing—force the Samsung back to ARC and leave everything else alone. That was enough to try it myself.

- On the Samsung S95B
  - Go to **Settings → Sound → Expert Settings → HDMI eARC Mode**,
  - Set it to **Off**,
  - Keep **Anynet+ (HDMI-CEC)** enabled, and
  - Pick the now-listed **Receiver (HDMI)** output without the eARC badge.
- On the Denon X1700H
  - Keep **HDMI Control** on and 
  - Verify **ARC** stays on.
- Power-cycle the receiver and TV so they negotiate again.

After that sequence the TV consistently booted to **Receiver (HDMI)** and stopped randomly switching back mid-source-change. It is not perfect, but the issue fell from daily to [only when consoles wake the TV](/posts/hdmi-cec/).

## The tradeoff (or not)

ARC can’t send high-bandwidth sound like Dolby TrueHD / DTS-HD MA / multichannel LPCM from TV apps to the receiver. It still carries Dolby Digital 5.1. This is fine since we never use the TV apps anyway. Anything lossless that matters (Apple TV, consoles) already plugs into the Denon, so the change cost nothing.

If your setup looks similar - a Samsung S95-series panel, eARC-capable AVR or soundbar, and recurring “why is it on TV Speakers again?” moments - start by disabling **HDMI eARC Mode**, let the TV fall back to ARC, and see if the system stabilizes before adding automation.

[1]: https://eu.community.samsung.com/t5/tv/s95b-update-1651-defaults-the-output-to-tv-speakers-at-startup/td-p/11349869?utm_source=chatgpt.com "S95B Update 1651 defaults the output to TV Speakers at startup"
[2]: https://en.community.sonos.com/home-theater-228993/samsung-s95c-and-sonos-arc-issues-with-earc-6888562?utm_source=chatgpt.com "Samsung S95C and Sonos Arc – issues with eARC"
[3]: https://www.avforums.com/threads/samsung-tv-s95b-and-soundbar-q990b-settings.2420641/?utm_source=chatgpt.com "Samsung TV S95B and Soundbar Q990B Settings"
