---
title: "Fixing HDMI-CEC weirdness with a Raspberry Pi and a $5 cable"
date: 2025-11-15T10:00:00-07:00
draft: true
tags: [home theater, hdmi-cec, raspberry pi, automation]
featured_image: "/images/posts/hdmi-cec/featured.jpg"
---

For years I treated HDMI-CEC like a house spirit: sometimes helpful, mostly temperamental, never fully understood. My living-room stack is straightforward—Samsung TV on ARC, Denon AVR-X1700H hidden in a closet, Apple TV plus a stack of consoles hanging off the receiver, and a Raspberry Pi 4 already doing Homebridge duty. Apple TV behaves like demo hardware from Cupertino; every console behaves like it missed the last week of CEC school. They wake the TV, switch the input, then leave the Denon asleep so I’m back to toggling audio outputs by hand.

![Placeholder – wide “hero” shot for the featured image: living room with TV, consoles, and AVR visible.](PLACEHOLDER: wide hero photo for featured image.)

![Placeholder – capture the “messy media closet” showing the Denon, Pi, and HDMI cabling.](PLACEHOLDER: shoot a wide photo of the closet wiring once tidied.)

Rewiring wasn’t an option and disabling CEC wasn’t politically viable (people like Apple TV’s magic), so the question became: can I fix it with the gear I own, ideally with one more $5 micro‑HDMI cable? The short version: yes. The Pi now sits quietly on the HDMI bus, watching for consoles to announce themselves and issuing the single command Samsung + Denon should have exchanged on their own.

This write-up mirrors the structure of my notebook: build a small mental model of CEC, sniff the bus, copy whatever Apple TV does right, wrap it in Python, then ship it as a systemd unit. Along the way I’ll point out where you can drop in photos/diagrams; shoot those once you have daylight.

## A tiny HDMI-CEC primer (just enough to be dangerous)

CEC is a low-bandwidth side channel that rides alongside HDMI video/audio. Everyone on the bus speaks in logical addresses (`0` for TV, `5` for audio systems, `4/8/9/B` for playback devices) and tiny opcodes such as `0x82` (Active Source) or `0x72` (Set System Audio Mode). Physical addresses are “lat/long” references inside the topology—`3.0.0.0` might mean “behind the AVR on HDMI 3”. In a healthy system the flow goes like this: console wakes and declares itself active, the TV notices there’s an ARC partner, somebody sends “please be the audio system”, the receiver wakes up, and audio never leaves the big speakers. That path only fired when Apple TV was involved.

![Placeholder – sketch a diagram of the HDMI topology and logical IDs.](PLACEHOLDER: diagram showing TV, AVR, playback devices, logical IDs.)

## Sniffing the CEC bus with `cec-client`

The Raspberry Pi exposes `/dev/cec0` on its micro‑HDMI ports and Pulse‑Eight’s [`libcec`](https://github.com/Pulse-Eight/libcec) gives us `cec-client`. Install it, run `echo "scan" | cec-client -s`, make sure your devices show up, then park on `cec-client -m -d 8` to record traffic. That command keeps the Pi quiet (monitor mode) yet gives you every bus transaction. A line such as `TRAFFIC: [...] >> bf:82:36:00` reads as “logical `B` (PS5) broadcast Active Source with physical address `3.6.0.0`”. That’s the packet you expect any console to send.

![Placeholder – take a close-up photo of the Pi plugged into the TV’s ARC HDMI input, HDMI adapters visible.](PLACEHOLDER: macro shot of Pi + adapter.)

## Apple TV vs. everyone else

Put the system in standby, start logging, then wake Apple TV. You get the expected `Active Source` burst, followed immediately by `5f:72:01` (the Denon telling everyone “System Audio Mode is on”). Do the exact experiment with PS5 or Switch and that second packet never arrives. The fix is therefore boring: watch for any playback device to become Active Source, and if the receiver doesn’t immediately declare itself, send `15:70:00:00` (System Audio Mode Request). The moment I typed `tx 15:70:00:00` by hand the Denon sprang to life and ARC anchored itself to the receiver. That’s all this project does—codify the polite nudge Apple TV already sends.

![Placeholder – capture a still of the TV OSD showing ARC staying on “Receiver” after waking a console.](PLACEHOLDER: photo of TV UI confirming receiver output.)

## Don’t spam the bus

Most forum scripts loop `cec-client` every few seconds and blast `on 5`. That’s wasteful and blind. Run a single `cec-client -d 8` (no monitor flag) and it happily prints every `TRAFFIC` line while also listening for `tx ...` commands on stdin. Wrap that subprocess, read stdout for events, write stdin when you need to react. Treat it like a unixy bridge between HDMI land and your own logic.

## The Python script

Below is the trimmed version that runs on my Pi. It starts `cec-client -d 8`, parses `TRAFFIC` lines, remembers the last time the Denon declared System Audio Mode, and sends `tx 15:70:00:00` once per console wake. Drop it into `/opt/cec-auto-audio/cec_auto_audio.py`.

```python
#!/usr/bin/env python3
import subprocess
import sys
from datetime import datetime, timedelta

LOGICAL_AUDIO = 0x5
PLAYBACK = {0x4, 0x8, 0x9, 0xB}
PENDING_WINDOW = timedelta(seconds=0.5)
SAM_GRACE = timedelta(seconds=10)
CEC_CLIENT = "/usr/bin/cec-client"
DRY_RUN = False

def log(level, msg):
    print(f"[{level} {datetime.now():%H:%M:%S}] {msg}", flush=True)

def parse_line(line):
    marker = ">> "
    if marker not in line:
        return None
    try:
        payload = line.split(marker, 1)[1].strip()
        parts = [int(p, 16) for p in payload.split(":")]
        src, dst = divmod(parts[0], 0x10)
        opcode = parts[1]
        params = parts[2:]
        return src, dst, opcode, params
    except Exception:
        return None

class AutoAudio:
    def __init__(self):
        self.proc = subprocess.Popen(
            [CEC_CLIENT, "-d", "8"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
        self.pending = None
        self.last_sam = datetime.min

    def send(self, cmd):
        if DRY_RUN:
            log("AUTO", f"[DRY RUN] {cmd}")
            return
        self.proc.stdin.write(cmd + "\n")
        self.proc.stdin.flush()
        log("AUTO", f"Sent {cmd}")

    def maybe_nudge(self):
        if not self.pending:
            return
        src, phys, t0 = self.pending
        if datetime.now() - t0 > PENDING_WINDOW:
            self.pending = None
            return
        if datetime.now() - self.last_sam < SAM_GRACE:
            self.pending = None
            return
        self.send("tx 15:70:00:00")
        self.pending = None

    def handle(self, src, _, opcode, params):
        if src == LOGICAL_AUDIO and opcode == 0x72 and params[:1] == [0x01]:
            self.last_sam = datetime.now()
            log("INFO", "Denon broadcast System Audio Mode On.")
        if opcode == 0x82 and src in PLAYBACK:
            phys = ":".join(f"{p:02x}" for p in params[:2]) or "??"
            self.pending = (src, phys, datetime.now())
            log("AUTO", f"Playback {src:X} became Active Source ({phys}).")
            self.maybe_nudge()
        elif opcode == 0x82:
            self.pending = None

    def loop(self):
        for line in self.proc.stdout:
            print(line, end="", flush=True)
            if "TRAFFIC:" not in line:
                continue
            parsed = parse_line(line)
            if parsed:
                self.handle(*parsed)
        log("ERROR", "cec-client exited; stopping.")

def main():
    log("INFO", f"Starting watcher (DRY_RUN={DRY_RUN})")
    AutoAudio().loop()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("INFO", "Interrupted, exiting.")
        sys.exit(0)
```

A few notes:

* This script doesn’t hard-code anything about PS5 / Switch names, vendors, or physical addresses.
* It treats **any Playback logical address** turning into Active Source as a “console wake” event.
* It stays **passive** when Apple TV / Samsung / Denon manage to do the right thing themselves (because we observe a real `5f:72:01`).
* It runs as a single long-lived process tied to a single `cec-client` instance.

You can temporarily set `DRY_RUN = True` while sniffing behavior; you’ll see log lines like:

```text
[AUTO 00:18:19] Playback/console at logical B became Active Source, phys 36:00.
[AUTO 00:18:20] [DRY RUN] Would send: tx 15:70:00:00
```

Once you’re happy, flip `DRY_RUN = False`.

## Running it as a systemd service

On the Pi, create a service file:

```bash
sudo nano /etc/systemd/system/cec-auto-audio.service
```

Example unit:

```ini
[Unit]
Description=CEC auto audio helper (Denon + consoles)
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/cec-auto-audio/cec_auto_audio.py
Restart=on-failure
User=pi
Group=pi
WorkingDirectory=/opt/cec-auto-audio
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cec-auto-audio.service
sudo systemctl start cec-auto-audio.service

# Tail logs
journalctl -u cec-auto-audio.service -f
```

Because we print both our own `[INFO]` / `[AUTO]` lines and the raw `cec-client` output, the journal doubles as a trace buffer. `journald` handles rotation automatically.

## Generalizing this approach

Maybe your pain point isn’t consoles; maybe DTS never negotiates, or your TV keeps snapping back to its tiny speakers. The workflow is the same: get the Pi onto the ARC port (photo idea: shoot the Pi sitting behind the TV for scale), run `echo "scan" | cec-client -s` to baseline addresses, record a “good” scenario and a “bad” one with `cec-client -m -d 8`, diff the `TRAFFIC` lines, then inject the missing opcode by hand. Once you know the magic packet, wrap it in code and let the Pi be the polite bus participant nobody else is.

![Placeholder – grab a diagram or whiteboard sketch showing the “good vs bad handshake” timeline.](PLACEHOLDER: capture hand-drawn timeline or diagram.)

## Where this leaves my setup

Apple TV keeps doing its thing. PS5 or Switch now wake the TV, the helper nudges the Denon within half a second, and audio stays glued to the receiver. Latency is low enough that it feels native. The Pi sits in the closet pretending to be a slightly overqualified remote. If you adapt this trick for some other CEC horror story, send me the packet traces—I’m collecting folklore.

![Placeholder – shoot a final glamour photo of the TV running a console, AVR input lights on, maybe a controller in frame.](PLACEHOLDER: lifestyle shot to close the piece.)

There’s probably a small cottage industry of “two-page CEC scripts” waiting to be written.
