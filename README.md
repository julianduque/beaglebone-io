# BeagleBone-IO
BeagleBone Black IO Plugin for [Johnny-Five](http://johnny-five.io)

## Install

```
$ npm install beaglebone-io
```

For the best user experience with BeagleBone-IO the recommended Operating
System is [Debian](http://beagleboard.org/latest-images).

## Usage

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

With Johnny-Five
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

## Pin Mappings

| Pin | Type |
|-----|------|
| P8_7 or GPIO66 | INPUT, OUTPUT |
| P8_8 or GPIO67 | INPUT, OUTPUT |
| P8_9 or GPIO69 | INPUT, OUTPUT |
| P8_10 or GPIO68 | INPUT, OUTPUT |
| P8_11 or GPIO45 | INPUT, OUTPUT |
| P8_12 or GPIO44 | INPUT, OUTPUT |
| P8_13 or GPIO23 | INPUT, OUTPUT, SERVO, PWM |
| P8_14 or GPIO26 | INPUT, OUTPUT |
| P8_15 or GPIO47 | INPUT, OUTPUT |
| P8_16 or GPIO46 | INPUT, OUTPUT |
| P8_17 or GPIO27 | INPUT, OUTPUT |
| P8_18 or GPIO65 | INPUT, OUTPUT |
| P8_19 or GPIO22 | INPUT, OUTPUT, SERVO, PWM |
| P8_26 or GPIO61 | INPUT, OUTPUT |
| P9_11 or GPIO30 | INPUT, OUTPUT |
| P9_12 or GPIO60 | INPUT, OUTPUT |
| P9_13 or GPIO31 | INPUT, OUTPUT |
| P9_14 or GPIO50 | INPUT, OUTPUT, SERVO, PWM |
| P9_15 or GPIO48 | INPUT, OUTPUT |
| P9_16 or GPIO51 | INPUT, OUTPUT, SERVO, PWM |
| P9_17 or GPIO5 | INPUT, OUTPUT |
| P9_18 or GPIO4 | INPUT, OUTPUT |
| P9_19 | I2C2 SCL |
| P9_20 | I2C2 SDA |
| P9_21 or GPIO3 | INPUT, OUTPUT, SERVO, PWM |
| P9_22 or GPIO2 | INPUT, OUTPUT, SERVO, PWM |
| P9_23 or GPIO49 | INPUT, OUTPUT |
| P9_24 or GPIO15 | INPUT, OUTPUT |
| P9_26 or GPIO14 | INPUT, OUTPUT |
| P9_27 or GPIO115 | INPUT, OUTPUT |
| P9_30 or GPIO112 | INPUT, OUTPUT |
| P9_33 or A4 | ANALOG |
| P9_35 or A6 | ANALOG |
| P9_36 or A5 | ANALOG |
| P9_37 or A2 | ANALOG |
| P9_38 or A3 | ANALOG |
| P9_39 or A0 | ANALOG |
| P9_40 or A1 | ANALOG |
| P9_41 or GPIO20 | INPUT, OUTPUT |
| P9_42 or GPIO7 | INPUT, OUTPUT, SERVO, PWM |
| USR0 | OUTPUT / User LED 0 |
| USR1 | OUTPUT / User LED 1 |
| USR2 | OUTPUT / User LED 2 |
| USR3 | OUTPUT / User LED 3 / Default LED |


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
