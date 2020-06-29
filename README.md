# node-red-contrib-pico2wave

## About

A simple wrapper around the pico2wave commandline tts tool for use in nodered on linux.
This suite consists of one node that converts a string to spoken audio using svox pico tts.

## Prerequisites

To use this node you need to have pico2wave installed. Unfortunately on Raspberrypi OS non-free Debian packages are not included by default. Some info on how to install it can be found in this [raspberrypi forum thread](https://www.raspberrypi.org/forums/viewtopic.php?t=220494) in the 5th post or you can compile it from [source](https://github.com/naggety/picotts).

## Usage

The node is very barebones right now. It accepts the text to be spoken as a string in the message payload. In the nodes config you can choose the language to be used (en-US, en-GB, de-DE, es-ES, fr-FR, it-IT) and if the node should output the tts audio as a buffer in the msg.payload or write it to a file on the file system. Either way the audio is output as mono 16000 kHz wav audio.
