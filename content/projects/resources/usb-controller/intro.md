+++
title = "Project: Custom USB HID Devices"
+++

<!-- TODO what the hell -->

## Introduction

This project focuses on designing and building custom USB Human Interface
Devices (HIDs), such as gamepads, mice, keyboards, and other creative input
devices.

The development process begins with rapid prototyping on a breadboard using a
Raspberry Pi Pico. Students will write firmware from the ground up, handling
everything from GPIO input and device logic to USB HID communication. As
projects mature, designs can be transitioned to custom PCBs and 3D-printed or
custom-designed enclosures.

We encourage experimentation with unconventional input methods, including:

- Motion sensors and gyroscopes
- Touchpads and capacitive inputs
- Custom mouse or keyboard controls
- Environmental or other specialty sensors

Our goal is to provide a beginner-friendly introduction to embedded systems, USB
communication, hardware prototyping, and product design.

[pico]: https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html#pico1
[vscode]: https://code.visualstudio.com/download
[pico-vscode]: https://marketplace.visualstudio.com/items?itemName=raspberry-pi.raspberry-pi-pico
[clang-format]: https://marketplace.visualstudio.com/items?itemName=xaver.clang-format
[proposal-template]: https://z.umn.edu/ProposalTemplateIEEE

<!-- TODO update this proposal template stuff -->

## Why the Raspberry Pi Pico?

The [Raspberry Pi Pico][pico], powered by the RP2040 microcontroller, is an ideal
platform for this project because it is:

- **Affordable and widely available**
- **Breadboard-friendly**, making rapid prototyping simple
- **Well documented**, with a readable datasheet and excellent SDK support

## Development Tools

The Pico ecosystem provides a straightforward development experience:

- **Pico SDK** for low-level C development
- **Standard build tools** with simple command-line workflows
- **VS Code Pico Extension** for project creation, debugging, and single-click
  flashing of firmware

### Recommended Setup

- [Visual Studio Code][vscode]
- [Raspberry Pi Pico VS Code Extension][pico-vscode]
- [Clang Format extension][clang-format] (optional)

## Understanding USB HID

Human Interface Device (HID) is the USB device class used by peripherals such as
keyboards, mice, gamepads, and other input devices.

A major advantage of HID is that modern operating systems already support it
natively. As long as a device presents a valid HID report descriptor, it can
communicate with the host without requiring custom drivers.

> Most modern operating systems recognize standard USB HID devices automatically.

### TinyUSB

To simplify USB development, we use TinyUSB, a lightweight open-source USB stack
integrated with the Pico SDK.

TinyUSB handles the low-level USB protocol details, allowing us to focus
on device behavior and input logic rather than USB handshakes and packet
management.

**Why TinyUSB?**

- Already integrated into the Pico SDK
- Actively maintained
- Solid example projects to use as a base
- Supports HID devices out of the box

## Project Learning Objectives

Participants will gain experience in:

- **USB HID Development**: Learn how USB input devices communicate with
  computers and how to implement custom HID devices using TinyUSB.
- **Embedded Systems Programming**: Write firmware in C to interface with
  sensors, buttons, encoders, and other hardware peripherals.
- **PCB Design & Hardware Prototyping**: Move from breadboard prototypes to
  custom printed circuit boards.
- **CAD & Enclosure Design**: Design custom enclosures using SolidWorks or
  another CAD package of your choice.

Completed projects and progress updates may be featured on this website,
providing material for portfolios, resumes, and personal projects.

---

# Project Organization

## Tech Committee Structure

### Weekly Technical Meetings

- Dedicated project work sessions
- Progress check-ins
- Technical support from mentors and peers
- Teams of up to five members

### Team Formation

- Individual and team projects are welcome
- Groups are formed by submitting a project proposal
- Each team receives a dedicated discussion thread in the IEEE Discord

## Expectations

### Progress Reports (Required)

Regular progress updates should include:

- What was completed since the last update
- Goals for the upcoming week
- Technical blockers or challenges

### Parts Ordering

Components can be requested through the project parts-ordering form.

To ensure resources are being used effectively, parts orders are approved only
after a valid progress report has been submitted.

## Getting Started

1. Review the project proposal template and start brainstorming.
2. Form a team or choose to work individually.
3. Submit your proposal.
4. Set up the development environment.
5. Begin prototyping your HID device on a breadboard.

**Project Proposal:** [Template][proposal-template]
