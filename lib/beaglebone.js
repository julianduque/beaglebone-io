var b = require("bonescript");
var Emitter = require("events").EventEmitter;
var tick = global.setImmediate || process.nextTick;
var i2c = require('i2c-bus');

var modes = Object.freeze({
  INPUT: 0,
  OUTPUT: 1,
  ANALOG: 2,
  PWM: 3,
  SERVO: 4
});

var modesMapping = {
  0: b.INPUT,
  1: b.OUTPUT,
  3: b.ANALOG_OUTPUT,
  4: b.ANALOG_OUTPUT
};


var pinMappings = [
  "P8_7", // 0
  "P8_8", // 1
  "P8_9", // 2
  "P8_13", // 3 - PWM
  "P8_10", // 4
  "P9_14", // 5 - PWM
  "P9_16", // 6 - PWM
  "P8_11", // 7
  "P8_12", // 8
  "P9_21", // 9 - PWM
  "P9_42", // 10 - PWM
  "P8_19", // 11 - PWM
  "P8_14", // 12
  "USR3", // 13
  "P9_39", // A0
  "P9_40", // A1
  "P9_37", // A2
  "P9_38", // A3
  "P9_35", // A4
  "P9_36" // A5

  /*
  i2c Pins
  These pins do not need to be included in the map

  "P9_20" SDA"
  "P9_19" SCL
  */
];


var pinModes = [{
  modes: []
}, {
  modes: []
}, {
  modes: []
}, {
  modes: []
}, {
  modes: [0, 1, 4]
}, {
  modes: [0, 1, 3, 4]
}, {
  modes: [0, 1, 3, 4]
}, {
  modes: [0, 1, 4]
}, {
  modes: [0, 1, 4]
}, {
  modes: [0, 1, 3, 4]
}, {
  modes: [0, 1, 3, 4]
}, {
  modes: [0, 1, 3, 4]
}, {
  modes: [0, 1, 4]
}, {
  modes: [0, 1, 4]
}, {
  modes: [0, 1, 2],
  analogChannel: 0
}, {
  modes: [0, 1, 2],
  analogChannel: 1
}, {
  modes: [0, 1, 2],
  analogChannel: 2
}, {
  modes: [0, 1, 2],
  analogChannel: 3
}, {
  modes: [0, 1, 2],
  analogChannel: 4
}, {
  modes: [0, 1, 2],
  analogChannel: 5
}];

var boards = [];
var reporting = [];
var _i2c; // i2c bus number
var _i2cDelay; // specified in configuring i2c, currently unused but may be needed in the future

tick(function read() {
  tick(read);
  var board;

  if (boards.length && reporting.length) {
    board = boards[0];

    reporting.forEach(function(report) {
      report.method(report.port, function(result) {
        if (!result.err) {
          var val = +result.value;

          if (report.scale) {
            val = report.scale(val);
          }

          board.pins[report.index].value = val;
          board.emit(report.event, val);
        }

      });
    });
  }
});

function BeagleBone(opts) {
  Emitter.call(this);

  if (!(this instanceof BeagleBone)) {
    return new BeagleBone(opts);
  }

  this.name = "BeagleBone-IO";

  this.pins = pinModes.map(function(pin, index) {
    var p = {
      index: index,
      port: pinMappings[index],
      supportedModes: pin.modes,
      value: 0,
      report: 0,
      mode: null,
      isPwm: false
    };

    if (typeof pin.analogChannel !== "undefined") {
      p.analogChannel = pin.analogChannel;
    }

    return p;
  }, this);

  this.analogPins = this.pins.slice(14).map(function(pin, i) {
    return i;
  });

  boards[0] = this;

  this.defaultLed = 13;
  this.isReady = false;
  tick(function() {
    this.isReady = true;
    this.emit("connect");
    this.emit("ready");
  }.bind(this));
}

BeagleBone.reset = function() {
  reporting.length = 0;
};

BeagleBone.prototype = Object.create(Emitter.prototype, {
  constructor: {
    value: BeagleBone
  },
  MODES: {
    value: modes
  },
  HIGH: {
    value: b.HIGH
  },
  LOW: {
    value: b.LOW
  }
});

BeagleBone.prototype.normalize = function(pin) {
  if (typeof pin === "string" && pin[0] !== "A") {
    var index = pinMappings.indexOf(pin);

    if (index > 0) {
      pin = index;
    }
  }

  var offset = pin[0] === "A" ? 14 : 0;
  return ((pin + "").replace("A", "") | 0) + offset;
};


BeagleBone.prototype.pinMode = function(pin, mode) {
  var pinIndex;
  var port;

  if (mode === 2 && typeof pin === "number" && pin < 14) {
    pin = "A" + pin;
  }

  pinIndex = this.normalize(pin);
  port = this.pins[pinIndex].port;

  this.pins[pinIndex].mode = mode;

  if (mode === 3 || mode === 4) {
    this.pins[pinIndex].isPwm = true;
  }

  var mappedMode = modesMapping[mode];

  if (mappedMode) {
    b.pinMode(port, mappedMode);
  }

  return this;
};

BeagleBone.prototype.analogRead = function(pin, handler) {
  var pinIndex;
  var event;
  var alias;
  var port;

  if (typeof pin === "number" && pin < 14) {
    pin = "A" + pin;
  }

  pinIndex = this.normalize(pin);

  alias = this.pins[pinIndex].analogChannel;
  port = this.pins[pinIndex].port;
  event = "analog-read-" + alias;

  if (this.pins[pinIndex].mode !== this.MODES.ANALOG) {
    this.pinMode(pin, this.MODES.ANALOG);
  }

  reporting.push({
    port: port,
    event: event,
    index: pinIndex,
    method: b.analogRead,
    scale: function(val) {
      return b.map(val, 0, 1, 0, 1024);
    }
  });

  this.on(event, handler);

  return this;
};

BeagleBone.prototype.analogWrite = function(pin, value) {
  var pinIndex = this.normalize(pin);
  var port = this.pins[pinIndex].port;
  var scaled = b.map(value, 0, 255, 0, 1);

  if (this.pins[pinIndex].mode !== this.MODES.PWM) {
    this.pinMode(pin, this.MODES.PWM);
  }

  this.pins[pinIndex].value = value;
  b.analogWrite(port, scaled);

  return this;
};

BeagleBone.prototype.pwmWrite = BeagleBone.prototype.analogWrite;

BeagleBone.prototype.digitalRead = function(pin, handler) {
  var pinIndex = this.normalize(pin);
  var port = this.pins[pinIndex].port;
  var event = "digital-read-" + pin;

  if (this.pins[pinIndex].mode !== this.MODES.INPUT) {
    this.pinMode(pin, this.MODES.INPUT);
  }

  reporting.push({
    event: event,
    port: port,
    index: pinIndex,
    method: b.digitalRead
  });

  this.on(event, handler);

  return this;
};

BeagleBone.prototype.digitalWrite = function(pin, value) {
  var pinIndex = this.normalize(pin);
  var port = this.pins[pinIndex].port;

  if (this.pins[pinIndex].mode !== this.MODES.OUTPUT) {
    this.pinMode(pin, this.MODES.OUTPUT);
  }

  this.pins[pinIndex].value = value;
  b.digitalWrite(port, value);
  return this;
};

BeagleBone.prototype.servoWrite = function(pin, value, frequency) {
  frequency = frequency || 60;

  var pinIndex = this.normalize(pin);
  var port = this.pins[pinIndex].port;
  var scaled;

  if (this.pins[pinIndex].mode !== this.MODES.SERVO) {
    this.pinMode(pin, this.MODES.SERVO);
  }

  this.pins[pinIndex].value = value;
  scaled = b.map(value, 0, 180, 0.03, 0.145);
  b.analogWrite(port, scaled, frequency);
  return this;
};


// deprecated i2c support

// sendI2cConfig is a "do-nothing function since the pins are pre-mapped in the BBB
// In Arduino Firmata there is a read delay parameter which is not
// being used, and so will be ignored here. The Arduino StandardFirmata
// code states that this delay is used for device like the Wii Nunchuck..
// The johnny-five support of this device does not use this parameter,
// so the assumption is it will not be needed
BeagleBone.prototype.sendI2CConfig = function() {
  if (_i2c === undefined) {
    _i2c = i2c.openSync(1);
  }
  return this;
};

BeagleBone.prototype.sendI2CWriteRequest = function(address, bytes) {
  var i2cWriteBuffer = new Buffer(bytes);

  _i2c.i2cWriteSync(address, i2cWriteBuffer.length, i2cWriteBuffer);
  return this;
};

BeagleBone.prototype.sendI2CReadRequest = function(address, length, cb) {
  var i2cReadBuffer = new Buffer(length);
  _i2c.i2cRead(address, length, i2cReadBuffer, function(i2cError, i2cNumBytes, i2cReadBuffer) {
    if (i2cError) {
      this.emit("error", i2cError);
      return;
    }
    cb(i2cReadBuffer);

  });
  return this;
};

// end of deprecated i2c support


// current i2c support methods

/*
Mapping plugin methods to i2c-bus method provided by Brian Cooke - author of i2c-bus

IO Plugin Method                                         i2c-bus Method
-----------------                                        ---------------

i2cConfig(delay)                                        openSync(busNumber)

i2cWrite(address, inBytes)                              i2cWriteSync(addr, length, buffer)

i2cWrite(address, register, inBytes)                    writeI2cBlockSync(addr, cmd, length, buffer)

i2cWriteReg(address, register, value)                   writeByteSync(addr, cmd, byte)

i2cRead(address, register, bytesToRead, handler)	    readI2cBlock(addr, cmd, length, buffer, cb)

i2cRead(address, bytesToRead, handler)                  i2cRead(addr, length, buffer, cb)

i2cReadOnce(address, register, bytesToRead, handler)	readI2cBlock(addr, cmd, length, buffer, cb)

i2cReadOnce(address, bytesToRead, handler)	            i2cRead(addr, length, buffer, cb)
*/

BeagleBone.prototype.i2cCConfig = function(delay) {
  if (_i2c === undefined) {
    _i2c = i2c.openSync(1);
    _i2cDelay = delay;
  }
  return this;
};

// this method supports both
// i2cWrite(address, register, inBytes)
// and
// i2cWrite(address, inBytes)
BeagleBone.prototype.i2cWrite = function(address, register, inBytes) {
  console.log("i2cWrite TBD");
  return this;
};

BeagleBone.prototype.i2cWriteReg = function(address, register, value) {
  console.log("i2cWriteReg TBD");
  return this;
};

// this method supports both
// i2cRead(address, register, bytesToRead, handler)
// and
// i2cRead(address, bytesToRead, handler)
BeagleBone.prototype.i2cRead = function(address, register, bytesToRead, handler) {
  console.log("i2cRead TBD");
  return this;
};

// this method supports both
// i2cReadOnce(address, register, bytesToRead, handler)
// and
// i2cReadOnce(address, bytesToRead, handler)
BeagleBone.prototype.i2cReadOnce = function(address, register, bytesToRead, handler) {
  console.log("i2cReadOnce TBD");
  return this;
};


// Not Supported
[
  "pulseIn",
  "pulseOut",
  "queryPinState",
  "_sendOneWireRequest",
  "_sendOneWireSearch",
  "sendOneWireWriteAndRead",
  "sendOneWireDelay",
  "sendOneWireDelay",
  "sendOneWireReset",
  "sendOneWireRead",
  "sendOneWireSearch",
  "sendOneWireAlarmsSearch",
  "sendOneWireConfig",
  "stepperConfig",
  "stepperStep"
].forEach(function(method) {
  BeagleBone.prototype[method] = function() {
    throw method + " is not yet implemented.";
  };

});

module.exports = BeagleBone;
