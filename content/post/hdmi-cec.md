---
title: "Fixing HDMI-CEC weirdness with a Raspberry Pi and a $5 cable"
date: 2025-11-15T10:00:00-07:00
draft: true
tags: [home theater, hdmi-cec, raspberry pi, automation]
---

For years I treated HDMI-CEC like a kind of house spirit: sometimes helpful, mostly temperamental, never fully understood.

My current setup:

- Samsung TV (ARC, not eARC)
- Denon AVR-X1700H in a media closet
- Apple TV, PS5, Switch 2, Xbox all plugged into the Denon
- Raspberry Pi 4 in the same closet, already running Homebridge

Symptom:

- Apple TV “just works”: press any button on the Apple TV remote, TV turns on, Denon turns on, ARC connects, life is good.
- Consoles do **not** just work: turning on PS5 / Switch 2 wakes the TV, switches to the right HDMI input, but leaves the Denon asleep. No sound until I manually wake the Denon or flip audio outputs in the TV menu.

I couldn’t rewire (everything’s in a closet) and I couldn’t turn off HDMI-CEC (other people in the house expect Apple TV to stay magical). So the question became:

> Can I *fix* HDMI-CEC, not fight it, with just a Raspberry Pi and a micro-HDMI cable?

Short answer: yes.

The Pi now sits quietly on the HDMI bus, watching for consoles to turn on, and injects one tiny CEC command that Samsung + Denon should have been sending by themselves.

The rest of this post is:

- A quick mental model for HDMI-CEC
- How I reverse-engineered what Apple TV was doing “right”
- How to reproduce that behavior in code with `cec-client` + Python
- How to run it as a systemd service
- How you can adapt the same process for *your* weird HDMI-CEC problem

## A tiny HDMI-CEC primer (just enough to be dangerous)

CEC is a low-bandwidth control signal that runs alongside HDMI video/audio. Devices talk on a shared bus using:

- **Logical addresses** – “who” is talking (TV = `0`, Audio system = `5`, Playback devices = `4`, `8`, `9`, `B`, etc.)
- **Physical addresses** – “where” they are in the HDMI topology (`3.0.0.0` = “behind the AVR on HDMI 3”, etc.)
- **OpCodes** – 1-byte commands like:
  - `0x82` – **Active Source** (a device says “I’m the current source”)
  - `0x84` – **Report Physical Address**
  - `0x72` – **Set System Audio Mode**
  - `0x70` – **System Audio Mode Request**

In my setup, the important logical addresses:

- `0` – TV (Samsung)
- `5` – Audio (Denon AVR)
- `4/8/9/B` – Playback devices (Apple TV, PS5, Switch 2, etc.)
- `F` – Broadcast (everyone)

Conceptually, what I *wanted*:

1. Console turns on and becomes **Active Source**.
2. TV sees “oh, there is an external audio system on ARC”.
3. TV or AVR sends the appropriate “please become audio system” handshake.
4. Denon wakes up, ARC links, game audio comes out of the speakers.

In reality that was only happening when Apple TV was involved.

## Sniffing the CEC bus with `cec-client`

The Raspberry Pi 4 exposes CEC on its micro-HDMI ports as `/dev/cec0`. The excellent [`libcec`](https://github.com/Pulse-Eight/libcec) stack ships with a handy CLI tool: `cec-client`.

On the Pi:

```bash
sudo apt-get update
sudo apt-get install cec-utils
````

Check that CEC is wired up and your devices are visible:

```bash
echo "scan" | cec-client -s
```

You should see something like:

```text
CEC bus information
===================
device #0: TV            (Samsung)
device #5: Audio         (Denon)
device #4/8/9/B: Playback (Apple TV, PS5, Switch 2…)
...
```

To watch live traffic in a human-ish format:

```bash
cec-client -m -d 8
```

* `-m` – monitor-only (don’t claim a logical address)
* `-d 8` – log level = `TRAFFIC` (enough to see CEC messages, not full debug)

You’ll get lines like:

```text
TRAFFIC: [...] >> bf:82:36:00
```

You can read that as:

* `b` – from logical `B` (Playback 3, my PS5)
* `f` – to `F` (broadcast)
* `82` – opcode **Active Source**
* `36:00` – physical address (`3.6.0.0` behind the Denon)

This is the “PS5 just woke up and wants to be the input” packet.

## The Apple TV behaves differently

With everything in standby:

* Start `cec-client -m -d 8` on the Pi.
* Turn on **Apple TV**.
* Watch the log.

Relevant bits (simplified):

```text
>> 8f:82:32:00             # Apple TV: Active Source
...
>> 5f:72:01                # Denon: Set System Audio Mode (on)
```

Translated:

1. Apple TV (`8`) broadcasts Active Source (`82`).
2. Very soon after, the Denon (`5`) broadcasts `72:01` – **Set System Audio Mode (on)**.

Combined with some other boilerplate traffic, this handshake causes:

* TV to wake up
* Denon to wake up
* ARC to go active
* Output to stay on “Receiver” instead of flipping back to TV speakers

Now do the same experiment with **PS5**:

```text
>> bf:82:36:00             # PS5: Active Source
# ...and then a lot of noise, but no 5f:72:01
```

So the core bug for my specific stack:

> When a console becomes Active Source, nobody asks the Denon to enable System Audio Mode. When Apple TV becomes Active Source, something proprietary happens and the Denon happily turns on.

Crucially: we don’t need to fully reverse-engineer whatever Apple + Samsung + Denon are doing. We just need to know the **one packet** that fixes it:

```text
5f:72:01  # Audio (5) -> Broadcast (F): Set System Audio Mode (on)
```

And, more portably, the **request** that *causes* that response:

```text
15:70:00:00  # TV (1) -> Audio (5): System Audio Mode Request
```

When I run this from `cec-client`’s interactive shell:

```text
tx 15:70:00:00
```

…my Denon wakes up and ARC is fully happy.

So the fix writes itself:

* When we see *any console* become Active Source
* And the Denon isn’t already awake
* Ask nicely on the bus with `System Audio Mode Request`
* Let the Denon do the rest

## Don’t spam the bus: one long-running `cec-client`

A common pattern you see online is:

* cron job / shell loop
* runs `cec-client` every N seconds
* sends a one-off `on 5` or similar

That works, but:

* It’s slow.
* It’s brittle (repeated open/close of `/dev/cec0`).
* It’s blind; you’re not reacting to actual bus events.

I wanted:

* A **single** long-running `cec-client` process
* That I can both **read** from and **write** to
* And a small Python script that reacts to events in real time

Key trick: don’t use `-m` in this mode. Monitor-only clients cannot transmit. Instead:

```bash
cec-client -d 8
```

In this mode:

* `cec-client` grabs a logical address (Recorder 1, in my case).
* It still prints all bus `TRAFFIC` lines.
* It lets you send `tx ...` commands over stdin.

We can wrap that in Python and treat `cec-client` as:

* A CEC event source (stdout)
* A CEC command sink (stdin)

## The Python script

Here is a simplified, fully-commented version of the script that’s currently running on my Pi.

It does:

* Start `cec-client -d 8` as a subprocess.
* Parse `TRAFFIC` lines.
* Look for **Active Source (0x82)** coming from any **Playback** logical address.
* Avoid doing anything if the Denon just did a `Set System Audio Mode` recently (Apple TV case).
* Send `System Audio Mode Request` (`tx 15:70:00:00`) once per “console wake” event.

Save this as `cec_auto_audio.py` somewhere like `/opt/cec-auto-audio/cec_auto_audio.py` on the Pi.

{{< gist jlian 18f98ee679106d552b3f378d77afeb39 >}}

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

Because we print both our own `[INFO]` / `[AUTO]` lines *and* the raw `cec-client` output, you get a nice stream to debug from. `journald` will rotate logs automatically; you shouldn’t need to hand-tune it unless your Pi is incredibly storage-constrained.

## Generalizing this approach for your own HDMI-CEC problems

My problem was “consoles don’t wake the AVR; Apple TV does”.

Your problem might be:

* DTS never negotiates properly.
* Soundbar falls back to stereo.
* TV keeps snapping back to TV speakers.
* Wrong source gets selected when some device wakes up.

You can use the same process:

1. **Get the Pi on the bus**

   * Micro-HDMI from the Pi into the ARC/eARC HDMI port on the TV (or the right link in your chain).
   * Install `cec-utils`.

2. **Baseline your CEC topology**

   ```bash
   echo "scan" | cec-client -s
   ```

   * Confirm the devices and logical addresses.
   * Note the logical IDs for TV, audio system, and playback devices.

3. **Record a “good” scenario**

   * Start `cec-client -m -d 8`.
   * Trigger the scenario that *works* (maybe some device that behaves correctly).
   * Save the log.

4. **Record a “bad” scenario**

   * Same `cec-client -m -d 8`.
   * Trigger the scenario that fails.
   * Save the log.

5. **Diff the two**

   * Look specifically at `TRAFFIC` lines:

     * Which opcodes appear in the good case but not the bad one?
     * Are there missing `Active Source`, `Report Physical Address`, `Set System Audio Mode`, routing change (`0x80`), or similar?

6. **Test injecting the missing piece by hand**

   * Switch to interactive `cec-client` (no `-m`).

     ```bash
     cec-client -d 8
     ```

   * Type `tx ...` commands that match the “good” scenario and see if they fix the “bad” one.

   * Once you’ve found “the magic packet,” you’re basically done.

7. **Wrap it in code**

   * Keep the Pi as close to the HDMI bus as possible.
   * Avoid multi-hop setups through Home Assistant / HomeKit / whatever if you care about latency.
   * Use the long-running `cec-client` pattern above to watch and react in real time.

I think the important mindset shift is:

> HDMI-CEC is not a black box. It’s a chatty little serial bus and you’re allowed to listen in and participate.

Once you can see the traffic, it stops being “my soundbar is haunted” and becomes “oh, the TV never sends a System Audio Mode Request for this device; I can do that myself.”

## Where this leaves my setup

After this:

* Apple TV behavior is unchanged and still “just works”.
* Turning on PS5 or Switch 2:

  * Wakes the TV.
  * Wakes the Denon via our little helper.
  * Keeps audio on the receiver without anyone touching the TV’s audio menu.
* Latency is low enough that it feels instant in practice.

The Pi just sits in the closet, pretending to be a slightly overqualified CEC remote.

If you end up using this pattern to fix some other HDMI-CEC horror story (DTS, weird soundbars, projectors, whatever), I’d love to see the packet traces and what you discovered.

There’s probably a small cottage industry of “two-page CEC scripts” waiting to be written.
