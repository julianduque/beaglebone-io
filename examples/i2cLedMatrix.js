var five = require("johnny-five"),
    BeagleBone = require("beaglebone-io");

var board = new five.Board({
  io: new BeagleBone()
});

board.on("ready", function() {

  var heart = [
    "01100110",
    "10011001",
    "10000001",
    "10000001",
    "01000010",
    "00100100",
    "00011000",
    "00000000"
  ];

  var matrix = new five.Led.Matrix({ 
    controller: "HT16K33",
    isBicolor: true
  });

  matrix.clear();

  var msg = "johnny-five".split("");

  function next() {
    var c;

    if (c = msg.shift()) {
      matrix.draw(c);
      setTimeout(next, 500);
    }
  }

  next();

  this.repl.inject({
    matrix: matrix,
    heart: function() {
      matrix.draw(heart);
    }
  });
});

