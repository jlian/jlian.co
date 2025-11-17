---
title: "\"Vision Pro's passthrough isn't depth-correct\"...?"
date: 2024-03-15T23:25:14Z
tags: [vision pro, passthrough, xr]
featured_image: "/images/posts/vision-pro-passthrough/vision-pro.jpeg"
description: "Deep dive on why Vision Pro’s passthrough feels good despite the math."
---

This is a long post. **TL;DR: what did Apple do to make Vision Pro's passthrough not feel like crap despite not being depth-correct?**

## Depth-correct passthrough: what's the big deal?

It's well documented that it's critical for video passthrough mixed reality to be "depth-correct" (AKA perspective correct) or you'll have issues:

- [Unpleasantness that persists even after removing the headset](https://spectrum.ieee.org/steve-mann-my-augmediated-life#:~:text=The%20camera%20was,to%20normal%20vision.)
- [Can't catch a tossed bottle](https://youtu.be/bkhA-YqstMM?t=1059)
- [Can't grab things or estimate distances, feels like flailing, looks totally weird, and feels unusably bad](https://www.reddit.com/r/virtualreality/comments/18qv6tr/is_it_worst_to_have_non_perspective_correct/)
- [Pico 4 passthrough unusable, disorienting](https://www.reddit.com/r/OculusQuest/comments/zeu68a/why_are_people_confused_about_the_passthrough/)
- ["The importance of depth-correct passthrough reprojection... absolutely cannot be understated and is a make or break for general adoption of any MR device"](https://news.ycombinator.com/item?id=34241128)

But perhaps the best analysis is [this one](https://kguttag.com/2023/09/26/apple-vision-pro-part-6-passthrough-mixed-reality-ptmr-problems/) by /u/kguttag. The conclusion is clear: if the passthrough is not corrected via *reprojection* to account for the difference between the locations of your eyeballs vs cameras looking outside ([good quick explanation](https://youtu.be/VDwcLDSimXs?t=628)), you're going to have an experience that feels weird at best and at worst unusable, disorienting, or even [dangerous](https://kguttag.com/2023/01/03/meta-quest-pro-part-1-unbelievably-bad-ar-passthrough/#It%20Can%20Be%20Hazardous%20%E2%80%94%20%E2%80%9CVR%20to%20the%20ER%E2%80%9D:~:text=Can%20Be%20Hazardous%20%E2%80%94%20%E2%80%9C-,VR%20to%20the%20ER,-%E2%80%9D). You'll have bigger problems than not being able to catch a ball. 

Its importance was apparent to Meta who decided that even having significant [bubble warping distortion](https://www.uploadvr.com/quest-3-review/#:~:text=The%20warping%20and%20ghosting%20looks%20even%20worse%20in%20the%20headset%20than%20in%20a%20recording.) is worth the tradeoff. A [method in the madness](https://kguttag.com/2023/01/03/meta-quest-pro-part-1-unbelievably-bad-ar-passthrough/#spatial-over-image).

## Vision Pro defies conventional wisdom (maybe)

To say the Vision Pro prominently features video passthrough mixed reality would be an understatement. Notably, there haven't really been widespread reports of the passthrough being disorienting. In fact, users claim the [opposite](https://www.reddit.com/r/VisionPro/comments/1asepox/comment/kqpvii1/?utm_source=share&utm_medium=web2x&context=3), that it's [*less* sickness inducing than other headsets](https://www.reddit.com/r/VisionPro/comments/1ajoeip/comment/kp317g8/?utm_source=share&utm_medium=web2x&context=3).

But according to [UploadVR's review](https://www.uploadvr.com/apple-vision-pro-review/), Vision Pro's passthrough is actually *not* depth-correct:

> But how I really know Vision Pro isn't a dynamically reprojected view is that the scale and perspective are slightly off. Yes, that's right, Apple Vision Pro's passthrough is not depth-correct. This was the most surprising aspect of Vision Pro for me, and something I've seen almost no other review mention.
> 
> Being free of the Quest warping distortion is deeply refreshing, can feel sublime in comparison, and is probably what most people mean when they praise Vision Pro's passthrough. And if you're sitting on a couch where the only thing close to you is your hands, you probably won't even notice that the view you're seeing isn't depth-correct. But if you're sat at a desk, you will definitely notice how the table and monitor in front of you skews as you rotate your head, in a way that virtual objects don’t. And at these close ranges, you'll also notice that the alignment of virtual objects with real objects is slightly off as you move your head. This isn't because of any tracking error, it's again, just that Vision Pro’s view of the real world isn't depth-correct. Lift up Quest 3 and you'll see real world objects remain in the position and scale they were at when you had the headset on. Lift up Vision Pro and you'll see everything is slightly offset. Apple prioritized geometric stability at the cost of incorrect depth and scale, while Meta prioritized depth and scale at the cost of harsh bubble warping.

As the review mentioned, there's very little coverage on this aspect. Given what we know about the importance of passthrough being depth-correct, it's hard to reconcile. Why has almost no one mentioned it other than UploadVR? How are people [playing ping pong](https://www.youtube.com/watch?v=dtp6b76pMak&t=693s), [(not really) skiing](https://youtu.be/8xI10SFgzQ8?t=404), and [walking/skateboarding around New York for hours](https://www.youtube.com/watch?v=UvkgmyfMPks) without trouble?

## It can't be magic, right?

I think only one of these can be true:

1. The importance of passthrough depth-correctness is blown of out proportion.
2. UploadVR is wrong, Vision Pro's passthrough is actually depth-correct. 
3. Vision Pro is doing *something* to give users enough depth awareness to make things feel normal(ish) without doing the full dynamic reprojection like the Quest.

(1) is unlikely. There's too much evidence and too many credible sources. A lot of people would have to collaborate to perpetuate a conspiracy like this (for unclear gains).

(2) is also unlikely. Any Vision Pro owner can independently verify the claim. Norm from Tested also [corroborates the same conclusion](https://www.youtube.com/watch?v=VDwcLDSimXs&t=709s).

That leaves only (3). As Norm said in the same video linked above:

> ... *Whatever they're doing* to correct your hands and things in the near-field - it's a perfect stereo image.

So the big question is: **what is it?** What exactly is the Vision Pro doing in the passthrough that results in a reasonably comfortable user experience without Quest's near-field distortion? 

Does anyone have a technical explanation or guesses? The most convincing possibility I've seen is [John Carmack's tweet about single depth estimation for the entire image instead of re-rendering](https://twitter.com/ID_AA_Carmack/status/1711477102854263190)? Still though, if this is the better approach, then why don't other headsets use it?

[*Join the discussion on /r/VisionPro*](https://www.reddit.com/r/VisionPro/comments/1bfrpg2/vision_pros_passthrough_isnt_depthcorrect/).
