---
title: "Cleaned up the network/media closet"
date: 2022-12-27T08:00:00-07:00
tags:
- home theater
- home networking
- wiring
- cable management
- hdmi
featured_image: "/images/posts/media-closet/01-closet-overview.jpg"
description: "Closet glow-up full of patch panels, storage hacks, and before/after."
---

One closet to house all our networking and media equipment. Most of the hard work was done by the previous owner with the CAT6, HDMI, and speaker wires all in wall.

![One closet to house all our networking and media equipment. Most of the hard work was done by the previous owner with the CAT6, HDMI, and speaker wires all in wall.](/images/posts/media-closet/01-closet-overview.jpg)

Here’s the network panel close up. I'm not super stoked about putting my eero gateway in here to act as the router but currently not sure what to upgrade to. Suggestions welcome.

![Network panel close up. I'm not super stoked about putting my eero gateway in here to act as the router but currently not sure what to upgrade to. Suggestions welcome.](/images/posts/media-closet/02-network-panel.jpg)

View of tools peg board (IKEA) and spare cable storage (shoe organizer from Amazon).

![View of tools peg board (IKEA) and spare cable storage (shoe organizer from Amazon)](/images/posts/media-closet/03-pegboard-storage.jpg)

Living room (behind the TV). A bunch of stuff here for Philips Hue backlight syncing + HDMI 2.1 compatibility.

![Living room (behind the TV). A bunch of stuff here for Philips Hue backlight syncing + HDMI 2.1 compatibility. More info in the diagram.](/images/posts/media-closet/04-living-room.jpg)

Detailed diagram of the wiring:

```mermaid
flowchart LR

    subgraph Media Closet
        subgraph Denon AVR X1700H
            AVR_HDMI1
            AVR_HDMI2
            AVR_HDMI3
            AVR_HDMI4
            AVR_HDMI5
            AVR_HDMI6
            AVR_HDMI_OUT

            Speakers_OUT
            Sub_OUT1
            Sub_OUT2
        end

        Nintendo_Switch --> AVR_HDMI1
        Apple_TV --> AVR_HDMI2
        PC --> AVR_HDMI4
        Xbox --> AVR_HDMI5
        PS5 --> AVR_HDMI6

    end

    subgraph Living Room

        subgraph Samsung S95B TV
            TV_HDMI1
            TV_HDMI2
            TV_HDMI3_eARC
            TV_HDMI4
        end

        subgraph Hue Play HDMI Sync Box
            HUE_HDMI_OUT
            HUE_HDMI1
            HUE_HDMI2
            HUE_HDMI3
            HUE_HDMI4
        end

        subgraph 7.2 Surround Sound
            In_Wall_Speakers
            In_Wall_Sub1
            In_Wall_Sub2
            Under_Couch_Sub
        end

        subgraph EZCOO HDMI 2.1 Splitter
            HDMI_2.1_IN
            HDMI_2.1_OUT
            HDMI_2.0_OUT
        end    

        HDMI_2.1_OUT --> TV_HDMI1
        HDMI_2.0_OUT --> HUE_HDMI2

        HUE_HDMI_OUT --> TV_HDMI2
    end
    
    AVR_HDMI_OUT --> HDMI_2.1_IN

    Speakers_OUT --> In_Wall_Speakers

    Sub_OUT1 --> In_Wall_Sub1
    Sub_OUT1 --> In_Wall_Sub2

    Sub_OUT2 -. Wireless .-> Under_Couch_Sub
```

Can't see the wires when the TV is mounted:

![Can't see the wires when the TV is mounted](/images/posts/media-closet/05-hidden-wires.jpg)

Bonus: before the cleanup:

![Bonus: before the cleanup](/images/posts/media-closet/06-before-cleanup.jpg)

[*Join the discussion on /r/HomeNetworking*](https://www.reddit.com/r/HomeNetworking/comments/zwvia0/cleaned_up_the_networkmedia_closet/).
