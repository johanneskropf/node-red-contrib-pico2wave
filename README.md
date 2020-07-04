# node-red-contrib-pico2wave

## About

A simple wrapper around the SVox pico TTS pico2wave commandline tts tool for use in nodered on linux.
This suite consists of one node that converts a string to spoken audio using svox pico tts.

## Prerequisites

To use this node you need to have the pico2wave libraries installed. On most systems with [the apt package manager](https://en.wikipedia.org/wiki/APT_(software)) you can just
use ```sudo apt-get install libttspico-utils``` to install it.

### Raspberrypi OS

Unfortunately on Raspberrypi OS non-free Debian packages are not included by default. As an alternative you can download and install the packages manually
as follows:
```
wget http://ftp.us.debian.org/debian/pool/non-free/s/svox/libttspico0_1.0+git20130326-9_armhf.deb
wget http://ftp.us.debian.org/debian/pool/non-free/s/svox/libttspico-utils_1.0+git20130326-9_armhf.deb
sudo apt-get install -f ./libttspico0_1.0+git20130326-9_armhf.deb ./libttspico-utils_1.0+git20130326-9_armhf.deb
```
or you can compile it from [source](https://github.com/naggety/picotts).

## Installing the node

To install the node execute ```npm install johanneskropf/node-red-contrib-pico2wave``` from your node-red folder (typically ```~/.node-red```).

## Usage

The node is very barebones right now. It accepts the text to be spoken as a string in the configured **msg** or **context** property or as a string directly entered in the nodes config screen. In the nodes config you can also set the language to be used (en-US, en-GB, de-DE, es-ES, fr-FR, it-IT) and if the node should output the tts audio as a buffer in the configured **msg** property or write it to a file on the file system. Either way the audio is output as mono 16000 kHz wav audio.
