'use strict';

var five = require('johnny-five');
var BeagleBone = require('..');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var led = new five.Led('P8_7');
  var button = new five.Button('P8_8');

  button.on('down', function() {
    led.on();
  });

  button.on('up', function() {
    led.off();
  });
});

