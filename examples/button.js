'use strict';

var five = require('johnny-five');
var BeagleBone = require('..');

var board = new five.Board({
  io: new BeagleBone()
});

board.on('ready', function() {
  var button = new five.Button('P8_8');

  button.on('down', function() {
    console.log('down');
  });

  button.on('up', function() {
    console.log('up');
  });
});

