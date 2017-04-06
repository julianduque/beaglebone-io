'use strict';

var five = require('johnny-five');
var BeagleBone = require('..');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var temperature = new five.Thermometer({
    controller: "TMP36",
    pin: "A0"
  });

  temperature.on("change", function() {
    console.log(this.celsius + "°C", this.fahrenheit + "°F");
  });
});

