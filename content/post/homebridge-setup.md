---
title:  "Deal with Homebridge crashing"
date: 2018-02-16T19:30:35-05:00
tags: [homekit, home automation, homebridge]
featured_image: "/images/homebridge.jpg"
description: "Revive your homebridge automatically"
---

[Homebridge](https://github.com/nfarina/homebridge) is a key part to my home automation setup. I run it on a Raspberry Pi (gen 1, pictured in header) and it allows me to integrate my TV, Apple TV, and robot vacuum into HomeKit. However, it does crash quite a bit. Here are some things I did to make Homebridge easier to deal with.

# Use systemmd to keep Homebridge always running

To get Homebridge to start automatically on boot and restart on crashes, check out [these instructions from Tim](https://timleland.com/setup-homebridge-to-start-on-bootup/). After you get `systemmd` set up, always go to `/var/homebridge` to edit your `config.json`.

To check the logs, I'd recommend:

{{< highlight bash >}}
sudo journalctl -fexu homebridge
{{< /highlight >}}

From [here](https://serverfault.com/questions/738547/centos-7-systemctl-no-feedback-or-status-output).

# Set up a web interface to quickly check status

To set up a cool web interface for monitoring your homebridge status, check out [homebridge-config-ui](https://www.npmjs.com/package/homebridge-config-ui).

{{< figure src="/images/homebridge.png" >}}

Since you're now using `systemmd` with it, add this to your config:

{{< highlight json >}}
{
    "platform": "config",
    "port": 8080,
    "log": "/var/log/daemon.log",
    "restart": "sudo systemctl restart homebridge"
}
{{< /highlight >}}

The log view might take a while to show anything, but the config should be right.