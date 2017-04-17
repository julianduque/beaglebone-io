'use strict';

var five = require('johnny-five');
var BeagleBone = require('..');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var servo = new five.Servo({
    pin: 'P9_14'
  });

  (function next() {
    servo.to(45);
    setTimeout(function () {
      servo.to(135);
      setTimeout(next, 2000);
    }, 2000);
  }());
});

