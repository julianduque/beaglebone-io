# BeagleBone-IO
[Johnny-Five](http://johnny-five.io) IO Plugin for the BeagleBone Black and
PocketBeagle.

BeagleBone-IO supports Node.js version 0.10, 0.12, 4, 5, 6, 7, 8 and 9.

## News & Updates

### November-2017: PocketBeagle support

BeagleBone-IO v2.3.0 adds support for the
[PocketBeagle](https://beagleboard.org/pocket).

### August-2017: Debian Stretch support

BeagleBone-IO v2.2.0 adds support for Debian Stretch and the Linux 4.9 kernel.
This is not a breaking change and v2.2.0 continues to support Debian Jessie and
the Linux 4.4 kernel.

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
npm install beaglebone-io
```

For the best user experience with BeagleBone-IO the recommended Operating
System is [Debian](http://beagleboard.org/latest-images).

## Usage

#### Standalone Usage of BeagleBone-IO

Both the BeagleBone Black and the PocketBeagle have four built-in blue user
LEDs mounted on the board itself. The IDs for these LEDs are USR0, USR1, USR2
and USR3. Both boards also have an analog input with the ID A0. The program
below turns on LED USR3 and logs the value of analog input A0 to the console
each time it changes. It's possible to try this program without connecting any
additional hardware to the board.

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

To use BeagleBone-IO with Johnny-Five the beaglebone-io and the johnny-five
packages need to be installed.

```
npm install johnny-five beaglebone-io
```

The next example blinks the default LED with Johnny-Five. The built-in LED
with ID USR3 is the default LED on both the BeagleBone Black and the
PocketBeagle. It's possible to try this program on either a BeagleBone Black
or PocketBeagle without connecting any additional hardware to board. Note how
the `Led` constructor is called without any arguments. If no arguments are
passed to the `Led` constructor Johnny-Five assumes that the default LED
should be used.

``` js
var five = require('johnny-five');
var BeagleBone = require('beaglebone-io');

var board = new five.Board({ 
  io: new BeagleBone()
});

board.on('ready', function () {
  var led = new five.Led();
  led.blink();
});
```

Pulse an LED connected to P8_13 on a BeagleBone Black with Johnny-Five. Note
that pin ID P8_13 is specific to the BeagleBone Black so this program can't be
run on a PocketBeagle.

``` js
var five = require('johnny-five');
var BeagleBone = require('beaglebone-io');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var led = new five.Led('P8_13');
  led.pulse(1000);
});
```

Pulse an LED connected to P2_1 on a PocketBeagle with Johnny-Five. Note that
pin ID P2_1 is specific to the PocketBeagle so this program can't be run on a
BeagleBone Black.

``` js
var five = require('johnny-five');
var BeagleBone = require('beaglebone-io');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var led = new five.Led('P2_1');
  led.pulse(1000);
});
```

## Supported Pins on the BeagleBone Black

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
| | |
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
| P9_33 or A4 | ANALOG | Don't input more than 1.8V |
| P9_35 or A6 | ANALOG | Don't input more than 1.8V |
| P9_36 or A5 | ANALOG | Don't input more than 1.8V |
| P9_37 or A2 | ANALOG | Don't input more than 1.8V |
| P9_38 or A3 | ANALOG | Don't input more than 1.8V |
| P9_39 or A0 | ANALOG | Don't input more than 1.8V |
| P9_40 or A1 | ANALOG | Don't input more than 1.8V |
| P9_41 or GPIO20 | INPUT, OUTPUT | |
| P9_42 or GPIO7 | INPUT, OUTPUT, SERVO, PWM | |
| | |
| USR0 | OUTPUT | Built-in user LED 0 |
| USR1 | OUTPUT | Built-in user LED 1 |
| USR2 | OUTPUT | Built-in user LED 2 |
| USR3 | OUTPUT | Built-in user LED 3 / Default LED |

Below are two images of the BeagleBone Black expansion headers from the
[BeagleBone 101](http://beagleboard.org/Support/bone101/).

The header pins that are colored orange in the first image are reserved for
the on-board eMMC storage and HDMI and can't be used with BeagleBone-IO.
Although P9_25 isn't colored orange it's also reserved and can't be used by
BeagleBone-IO.

<img src="http://beagleboard.org/static/images/cape-headers.png">

The following image of the expansion headers shows the GPIO numbers for the
header pins.

<img src="http://beagleboard.org/static/images/cape-headers-digital.png">

## Supported Pins on the PocketBeagle

| Pin ID | Supported Modes | Comments |
|:----|:-----|:----|
| P1_2 or GPIO87 | INPUT, OUTPUT | |
| P1_4 or GPIO89 | INPUT, OUTPUT | |
| P1_6 or GPIO5 | INPUT, OUTPUT | |
| P1_8 or GPIO2 | INPUT, OUTPUT | |
| P1_10 or GPIO3 | INPUT, OUTPUT | |
| P1_12 or GPIO4 | INPUT, OUTPUT | |
| P1_19 or A0 | ANALOG | Don't input more than 1.8V |
| P1_20 or GPIO20 | INPUT, OUTPUT | |
| P1_21 or A1 | ANALOG | Don't input more than 1.8V |
| P1_23 or A2 | ANALOG | Don't input more than 1.8V |
| P1_25 or A3 | ANALOG | Don't input more than 1.8V |
| P1_26 or GPIO12 | INPUT, OUTPUT | Optionally for I2C data |
| P1_27 or A4 | ANALOG | Don't input more than 1.8V |
| P1_28 or GPIO13 | INPUT, OUTPUT | Optionally for I2C clock |
| P1_29 or GPIO117 | INPUT, OUTPUT | |
| P1_30 or GPIO43 | INPUT, OUTPUT | |
| P1_31 or GPIO114 | INPUT, OUTPUT | |
| P1_32 or GPIO42 | INPUT, OUTPUT | |
| P1_33 or GPIO111 | INPUT, OUTPUT, SERVO, PWM | |
| P1_34 or GPIO26 | INPUT, OUTPUT | |
| P1_35 or GPIO88 | INPUT, OUTPUT | |
| P1_36 or GPIO110 | INPUT, OUTPUT, SERVO, PWM | |
| | |
| P2_1 or GPIO50 | INPUT, OUTPUT, SERVO, PWM | |
| P2_2 or GPIO59 | INPUT, OUTPUT | |
| P2_3 or GPIO23 | INPUT, OUTPUT, SERVO, PWM | |
| P2_4 or GPIO58 | INPUT, OUTPUT | |
| P2_5 or GPIO30 | INPUT, OUTPUT | |
| P2_6 or GPIO57 | INPUT, OUTPUT | |
| P2_7 or GPIO31 | INPUT, OUTPUT | |
| P2_8 or GPIO60 | INPUT, OUTPUT | |
| P2_9 or GPIO15 | INPUT, OUTPUT | |
| P2_10 or GPIO52 | INPUT, OUTPUT | |
| P2_11 or GPIO14 | INPUT, OUTPUT | |
| P2_17 or GPIO65 | INPUT, OUTPUT | |
| P2_18 or GPIO47 | INPUT, OUTPUT | |
| P2_19 or GPIO27 | INPUT, OUTPUT | |
| P2_20 or GPIO64 | INPUT, OUTPUT | |
| P2_22 or GPIO46 | INPUT, OUTPUT | |
| P2_24 or GPIO44 | INPUT, OUTPUT | |
| P2_25 or GPIO41 | INPUT, OUTPUT | |
| P2_27 or GPIO40 | INPUT, OUTPUT | |
| P2_28 or GPIO116 | INPUT, OUTPUT | |
| P2_29 or GPIO7 | INPUT, OUTPUT | |
| P2_30 or GPIO113 | INPUT, OUTPUT | |
| P2_31 or GPIO19 | INPUT, OUTPUT | |
| P2_32 or GPIO112 | INPUT, OUTPUT | |
| P2_33 or GPIO45 | INPUT, OUTPUT | |
| P2_34 or GPIO115 | INPUT, OUTPUT | |
| P2_35 or GPIO86 | INPUT, OUTPUT | |
| | |
| USR0 | OUTPUT | Built-in user LED 0 |
| USR1 | OUTPUT | Built-in user LED 1 |
| USR2 | OUTPUT | Built-in user LED 2 |
| USR3 | OUTPUT | Built-in user LED 3 / Default LED |

Below is an image of the PocketBeagle expansion headers from the
[PocketBeagle repository on GitHub](https://github.com/beagleboard/pocketbeagle).

Note that although the image indicates that GPIO109 is available on P1_3 this
isn't the case as P1_3 is reserved for USB1-V_EN. In addition, the analog mode
capabilities of P1_2, P2_35 and P2_36 are not supported by BeagleBone-IO.

<img src="https://raw.githubusercontent.com/beagleboard/pocketbeagle/master/docs/PocketBeagle_pinout.png">

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
