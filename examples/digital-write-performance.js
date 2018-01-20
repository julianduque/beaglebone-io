'use strict';

var five = require('johnny-five');
var BeagleBone = require('..');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var pin = board.io.normalize('P8_7'),
    writesPerSecond,
    time,
    i;

  this.pinMode(pin, five.Pin.OUTPUT);

  time = process.hrtime();

  for (i = 1; i <= 250000; i += 1) {
    this.digitalWrite(pin, i & 1);
  }

  time = process.hrtime(time);
  writesPerSecond = Math.floor(i / (time[0] + time[1] / 1E9));

  console.log(writesPerSecond + ' digitalWrite calls per second');
});

