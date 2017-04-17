'use strict';

var five = require('johnny-five');
var BeagleBone = require('..');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var led2 = new five.Led('USR2'),
    led3 = new five.Led('USR3');

  led2.blink(500);
  led3.blink(500);
});

