# BeagleBone-IO
[Johnny-Five](http://johnny-five.io) IO Plugin for the BeagleBone Black,
BeagleBone Green Wireless and PocketBeagle.

BeagleBone-IO supports Node.js versions 8, 10, 12 and 14.

## Contents

 * [News & Updates](#news--updates)
 * [Installation](#installation)
 * [Usage](#usage)
   * [Standalone Usage of BeagleBone-IO](#standalone-usage-of-beaglebone-io)
   * [Using BeagleBone-IO with Johnny-Five](#using-beaglebone-io-with-johnny-five)
 * [Johnny-Five Features Supported](#johnny-five-features-supported)
 * [Supported Pins on the BeagleBone Black](#supported-pins-on-the-beaglebone-black)
 * [Supported Pins on the PocketBeagle](#supported-pins-on-the-pocketbeagle)
 * [Supported Pins on the BeagleBone Green Wireless](#supported-pins-on-the-beaglebone-green-wireless)
 * [Working Without Sudo/Root Privileges](#working-without-sudoroot-privileges)
 * [License](#the-mit-license-mit)

## News & Updates

### May-2020: BeagleBone-IO v4.1.0

* Support for Node.js 6 removed
* Support for Node.js 14 added

## Installation

```
npm install beaglebone-io
```

For the best user experience with BeagleBone-IO the recommended Operating
System is [Debian](http://beagleboard.org/latest-images).

## Usage

#### Standalone Usage of BeagleBone-IO

The BeagleBone Black, BeagleBone Green Wireless and PocketBeagle have four
built-in blue user LEDs mounted on the board itself. The IDs for these LEDs
are USR0, USR1, USR2 and USR3. All three boards also have an analog input with
the ID A0. The program below turns on LED USR3 and logs the value of analog
input A0 to the console each time it changes. It's possible to try this
program without connecting any additional hardware to the board.

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

Calling `analogRead`, `digitalRead` or `i2cRead` initiates a new
**continuous** data reading process for a pin not a single read. Further
details can be seen at the Johnny-Five
[IO Plugins Specification](https://github.com/rwaldron/io-plugins#reading).

Analog inputs will be disabled by default on some systems and must be enabled
before usage. To enable analog inputs remove or comment out the
following line in `/boot/uEnv.txt`
```
disable_uboot_overlay_adc=1
```
Attempting to use analog inputs that are not enabled will typically result in
ENOENT error messages:
```
Error: ENOENT: no such file or directory, open '/sys/bus/iio/devices/iio:device0/in_voltage0_raw'
```

#### Using BeagleBone-IO with Johnny-Five

To use BeagleBone-IO with Johnny-Five the beaglebone-io and the johnny-five
packages need to be installed.

```
npm install johnny-five beaglebone-io
```

The next example blinks the default LED with Johnny-Five. The built-in LED
with ID USR3 is the default LED on the BeagleBone Black, BeagleBone Green
Wireless and PocketBeagle. It's possible to try this program on any of these
boards without connecting any additional hardware to the board. Note how
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

Pulse an LED connected to P8_13 on a BeagleBone Black or BeagleBone Green
Wireless with Johnny-Five. Note that pin ID P8_13 is specific to the
BeagleBone Black and BeagleBone Green Wireless so this program can't be run on
a PocketBeagle.

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
BeagleBone Black or BeagleBone Green Wireless.

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

## Johnny-Five Features Supported

Feature | Support
:--- | :---
Analog Read | yes
Digital Read | yes
Digital Write | yes
PWM | yes
Servo | yes
I2C | yes
One Wire | no
Stepper | no
Serial/UART | no
DAC | no
Ping | no

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

## Supported Pins on the BeagleBone Green Wireless

| Pin ID | Supported Modes | Comments |
|:----|:-----|:----|
| P8_7 or GPIO66 | INPUT, OUTPUT | |
| P8_8 or GPIO67 | INPUT, OUTPUT | |
| P8_9 or GPIO69 | INPUT, OUTPUT | |
| P8_10 or GPIO68 | INPUT, OUTPUT | |
| P8_13 or GPIO23 | INPUT, OUTPUT, SERVO, PWM | |
| P8_19 or GPIO22 | INPUT, OUTPUT, SERVO, PWM | |
| P8_27 or GPIO86 | INPUT, OUTPUT | |
| P8_28 or GPIO88 | INPUT, OUTPUT | |
| P8_29 or GPIO87 | INPUT, OUTPUT | |
| P8_30 or GPIO89 | INPUT, OUTPUT | |
| P8_31 or GPIO10 | INPUT, OUTPUT | |
| P8_32 or GPIO11 | INPUT, OUTPUT | |
| P8_33 or GPIO9 | INPUT, OUTPUT | |
| P8_34 or GPIO81 | INPUT, OUTPUT | |
| P8_35 or GPIO8 | INPUT, OUTPUT | |
| P8_36 or GPIO80 | INPUT, OUTPUT | |
| P8_37 or GPIO78 | INPUT, OUTPUT | |
| P8_38 or GPIO79 | INPUT, OUTPUT | |
| P8_39 or GPIO76 | INPUT, OUTPUT | |
| P8_40 or GPIO77 | INPUT, OUTPUT | |
| P8_41 or GPIO74 | INPUT, OUTPUT | |
| P8_42 or GPIO75 | INPUT, OUTPUT | |
| P8_43 or GPIO72 | INPUT, OUTPUT | |
| P8_44 or GPIO73 | INPUT, OUTPUT | |
| P8_45 or GPIO70 | INPUT, OUTPUT | |
| P8_46 or GPIO71 | INPUT, OUTPUT | |
| | |
| P9_11 or GPIO30 | INPUT, OUTPUT | |
| P9_13 or GPIO31 | INPUT, OUTPUT | |
| P9_14 or GPIO50 | INPUT, OUTPUT, SERVO, PWM | |
| P9_15 or GPIO48 | INPUT, OUTPUT | |
| P9_16 or GPIO51 | INPUT, OUTPUT, SERVO, PWM | |
| P9_17 or GPIO5 | INPUT, OUTPUT | |
| P9_18 or GPIO4 | INPUT, OUTPUT | |
| P9_19 or GPIO13 | INPUT, OUTPUT | Optionally for I2C clock |
| P9_20 or GPIO12 | INPUT, OUTPUT | Optionally for I2C data |
| P9_21 or GPIO3 | INPUT, OUTPUT, SERVO, PWM | |
| P9_22 or GPIO2 | INPUT, OUTPUT, SERVO, PWM | |
| P9_23 or GPIO49 | INPUT, OUTPUT | |
| P9_24 or GPIO15 | INPUT, OUTPUT | |
| P9_25 or GPIO117 | INPUT, OUTPUT | |
| P9_26 or GPIO14 | INPUT, OUTPUT | |
| P9_27 or GPIO115 | INPUT, OUTPUT | |
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

## Working Without Sudo/Root Privileges

BeagleBone-IO v3.0.0 can be used without sudo/root privileges if an
appropriate Debian image and v4.11 or higher of the Linux Kernel has been
installed.

The latest recommended Debian image for the BeagleBone that is available today
at [BeagleBoard.org](https://beagleboard.org/latest-images) is
`Debian 9.2 2017-10-10 4GB SD IoT`. This image comes with v4.4.91 of the Linux
Kernel. The command `uname -r` can be used to determine which version of the
Linux Kernel is installed.

Assuming that `Debian 9.2 2017-10-10 4GB SD IoT` has has already been
installed the following commands can be used to update to Linux Kernel v4.14.

```
sudo apt-get update
cd /opt/scripts/tools
git pull
sudo ./update_kernel.sh --lts-4_14
```

After Linux Kernel v4.14 has been installed it should be possible to use
BeagleBone-IO without sudo/root privileges.

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
