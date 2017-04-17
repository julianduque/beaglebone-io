'use strict';

var five = require('johnny-five');
var BeagleBone = require('..');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var led = new five.Led('P8_13');

  (function next() {
    led.brightness(10);
    setTimeout(function () {
      led.brightness(255);
      setTimeout(next, 1000);
    }, 1000);
  }());
});

