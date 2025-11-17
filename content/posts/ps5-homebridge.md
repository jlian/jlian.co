---
title: "PS5 works great with homebridge now"
date: 2021-12-14T00:59:04Z
tags: [home automation, homebridge, ps5, homekit, hdmi, hdmi-cec]
featured_image: "/images/posts/ps5-homebridge/lab-ps5.jpg"
description: "Homebridge to the rescue for HDMI-CEC woes, again."
---

## Steps I took

1. Go to the homebridge terminal, you can SSH or I just used the homebridge UI.
1. Install [Playactor](https://github.com/dhleong/playactor) `sudo npm install -g playactor`.
1. Run `playactor browse` and find your PS5, remember its name like "PS5-XXX", you'll need it later.
1. Run `playactor login --host-name PS5-XXX --no-open-urls` to register your device as a remote play controller. The `--no-open-urls` is important here because by default it tries to open a browser which isn't gonna work if you're using SSH or homebridge UI.
1. Follow prompts to finish setting it up. You'll need to turn on your PS5.
1. Use your favorite method to install [homebridge-cmdswitch2](https://github.com/luisiam/homebridge-cmdswitch2).
1. Configure the `cmdswitch2` plugin, I did it like this below. It polls the state every second in my example, which is important to me. More on that later.

   ```json
   {
       "name": "homebridge-cmdswitch2",
       "switches": [
           {
               "name": "PlayStation 5",
               "on_cmd": "playactor wake --host-name PS5-XXX",
               "off_cmd": "playactor standby --host-name PS5-XXX",
               "state_cmd": "playactor check --host-name PS5-XXX | grep -i '200 Ok'",
               "polling": true,
               "interval": 1,
               "timeout": 30,
               "manufacturer": "Sony",
               "model": "PS5"
           }
       ],
       "platform": "cmdSwitch2"
   }
   ```

2. Restart homebridge, try it!

## Why bother connecting PS5 to homebridge?

For me, I have Apple TV, PS5, Xbox, and Nintendo Switch all connected to my receiver which connects to my TV using HDMI. Because HDMI-CEC is a mess, Apple TV and PS5 end up "fighting" over the input selection when any of the devices is turned on. Homebridge helps me here because now I can turn off HDMI-CEC on the PS5, and set up automations to control switching inputs when PS5 turns on. My automation goes when PS5 turns on -> if TV is off -> turn on TV -> wait 30 seconds -> end if -> set receiver input to PS5. I have to make it wait 30 seconds for the TV/receiver/Apple TV all to turn on and settle. Here's also why I poll PS5 state every second, so that this automation doesn't take even longer. It's pretty ridiculous but at least now it's all automated. If you have a better way of solving this issue let us know.

## More details

These posts might help https://github.com/dhleong/playactor/issues/15 and https://github.com/dhleong/playactor/discussions/22

[*Join the discussion on /r/homebridge*](https://www.reddit.com/r/homebridge/comments/rfv37n/ps5_works_great_with_homebridge_now*). 
