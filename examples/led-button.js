'use strict';

var five = require('johnny-five');
var BeagleBone = require('..');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var led = new five.Led('GPIO46');
  var button = new five.Button('GPIO47');

  button.on('down', function() {
    led.on();
  });

  button.on('up', function() {
    led.off();
  });
});

