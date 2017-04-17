# BeagleBone-IO
BeagleBone Black IO Plugin for [Johnny-Five](http://johnny-five.io).

BeagleBone-IO supports Node.js v0.10, v0.12, v4, v5, v6 and v7.

## News & Updates

### April-2017: Major changes for BeagleBone-IO v2.0.0

BeagleBone-IO v2.0.0 is a complete rewrite that fixes a number of
long-standing issues related to support for the Linux 4.4 kernel, support
for the latest versions of Node.js, additional pin support, performance
improvements and improved analog to digital conversion. This results in a
number of **BREAKING CHANGES** which are documented in the
[migration guide](https://github.com/julianduque/beaglebone-io#migrating-from-beaglebone-io-v1-to-v2).
Support for Linux kernel versions prior to 4.4 has been dropped.

## Install

```
$ npm install beaglebone-io
```

For the best user experience with BeagleBone-IO the recommended Operating
System is [Debian](http://beagleboard.org/latest-images).

## Usage

#### Standalone Usage of BeagleBone-IO

Turn built-in user LED 3 on and log the value of analog input A0 to the
console each time it changes. The BeagleBone Black has row of four built-in
blue LEDs mounted on the board itself. User LED 3 is the LED closest to
Ethernet port. It's possible to try this program without connecting any
hardware to the BeagleBone Black.

``` js
var BeagleBone = require('beaglebone-io');
var board = new BeagleBone();

board.on('ready', function () {
  this.pinMode('USR3', this.MODES.OUTPUT);
  this.digitalWrite('USR3', this.HIGH);

  this.pinMode('A0', this.MODES.ANALOG);
  this.analogRead('A0', function (value) {
    console.log(value);
  });
});
```

#### Using BeagleBone-IO with Johnny-Five

Blink the default LED with Johnny-Five. Built-in User LED 3 is the default
LED. It's possible to try this program without connecting any hardware to
the BeagleBone Black. For this program to run Johnny-Five also needs to
be installed with the command `npm install johnny-five`

``` js
var five = require('johnny-five');
var BeagleBone = require('beaglebone-io');

var board = new five.Board({ 
  io: new BeagleBone()
});

board.on('ready', function () {
  var led = new five.Led();
  led.blink();
  
  this.repl.inject({ led: led });
});
```

## Supported Pins

| Pin ID | Supported Modes | Comments |
|:----|:-----|:----|
| P8_7 or GPIO66 | INPUT, OUTPUT | |
| P8_8 or GPIO67 | INPUT, OUTPUT | |
| P8_9 or GPIO69 | INPUT, OUTPUT | |
| P8_10 or GPIO68 | INPUT, OUTPUT | |
| P8_11 or GPIO45 | INPUT, OUTPUT | |
| P8_12 or GPIO44 | INPUT, OUTPUT | |
| P8_13 or GPIO23 | INPUT, OUTPUT, SERVO, PWM | |
| P8_14 or GPIO26 | INPUT, OUTPUT | |
| P8_15 or GPIO47 | INPUT, OUTPUT | |
| P8_16 or GPIO46 | INPUT, OUTPUT | |
| P8_17 or GPIO27 | INPUT, OUTPUT | |
| P8_18 or GPIO65 | INPUT, OUTPUT | |
| P8_19 or GPIO22 | INPUT, OUTPUT, SERVO, PWM | |
| P8_26 or GPIO61 | INPUT, OUTPUT | |
| P9_11 or GPIO30 | INPUT, OUTPUT | |
| P9_12 or GPIO60 | INPUT, OUTPUT | |
| P9_13 or GPIO31 | INPUT, OUTPUT | |
| P9_14 or GPIO50 | INPUT, OUTPUT, SERVO, PWM | |
| P9_15 or GPIO48 | INPUT, OUTPUT | |
| P9_16 or GPIO51 | INPUT, OUTPUT, SERVO, PWM | |
| P9_17 or GPIO5 | INPUT, OUTPUT | |
| P9_18 or GPIO4 | INPUT, OUTPUT | |
| P9_19 | I2C2 SCL | Reserved for I2C |
| P9_20 | I2C2 SDA | Reserved for I2C |
| P9_21 or GPIO3 | INPUT, OUTPUT, SERVO, PWM | |
| P9_22 or GPIO2 | INPUT, OUTPUT, SERVO, PWM | |
| P9_23 or GPIO49 | INPUT, OUTPUT | |
| P9_24 or GPIO15 | INPUT, OUTPUT | |
| P9_26 or GPIO14 | INPUT, OUTPUT | |
| P9_27 or GPIO115 | INPUT, OUTPUT | |
| P9_30 or GPIO112 | INPUT, OUTPUT | |
| P9_33 or A4 | ANALOG | |
| P9_35 or A6 | ANALOG | |
| P9_36 or A5 | ANALOG | |
| P9_37 or A2 | ANALOG | |
| P9_38 or A3 | ANALOG | |
| P9_39 or A0 | ANALOG | |
| P9_40 or A1 | ANALOG | |
| P9_41 or GPIO20 | INPUT, OUTPUT | |
| P9_42 or GPIO7 | INPUT, OUTPUT, SERVO, PWM | |
| USR0 | OUTPUT | Built-in user LED 0 |
| USR1 | OUTPUT | Built-in user LED 1 |
| USR2 | OUTPUT | Built-in user LED 2 |
| USR3 | OUTPUT | Built-in user LED 3 / Default LED |

## Migrating from BeagleBone-IO v1 to v2

There are two **BREAKING CHANGES** in BeagleBone-IO v2 that need to be taken
into account when migrating from v1 to v2. Both breaking changes can be seen
when the following v1 program

``` js
var BeagleBone = require('beaglebone-io');
var board = new BeagleBone();

board.on('ready', function () {
  this.digitalWrite(12, this.HIGH);
});
```

is compared with its v2 equivalent.

``` js
var BeagleBone = require('beaglebone-io');
var board = new BeagleBone();

board.on('ready', function () {
  this.pinMode('P8_14', this.MODES.OUTPUT);
  this.digitalWrite('P8_14', this.HIGH);
});
```

#### Arduino Pin Numbers

In v1 each pin had a documented Arduino pin number.

| BBB Port | Arduino Pin | Type |
|----------|-------------|------|
|P8_14|12|Digital|

In v2 this is no longer the case.

| Pin ID | Supported Modes | Comments |
|:----|:-----|:----|
| P8_14 or GPIO26 | INPUT, OUTPUT | |

In v2 pin IDs should be used in place of Arduino pin numbers. For example,
the following v1 code

``` js
  this.digitalWrite(12, this.HIGH);
```

should be replaced with the following v2 code.

``` js
  this.pinMode('P8_14', this.MODES.OUTPUT);
```

#### Setting Pin Modes Implicitly

The observant reader may also have noticed the addition of the following line
of code to the v2 example code above.

``` js
  this.pinMode('P8_14', this.MODES.OUTPUT);
```

In v1 calling `digitalWrite` implicitly set the mode of the appropriate pin
to OUTPUT. In v2 pin modes are no longer implicitly set. Note that if you
don't call IO Plugin methods like `digitalWrite` directly yourself then
there is nothing to do here as Johnny-Five will explicitly set pin modes
to the appropriate values.

## The MIT License (MIT)

Copyright (c) Julian Duque, Alan Yorinks, Brian Cooke 2017

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
