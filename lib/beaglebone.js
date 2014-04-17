var b = require("bonescript");
var Emitter = require("events").EventEmitter;
var tick = global.setImmediate || process.nextTick;

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
  "P8_43", // 0
  "P8_44", // 1
  "P8_41", // 2
  "P8_13", // 3
  "P8_42", // 4
  "P9_14", // 5
  "P9_21", // 6
  "P8_39", // 7
  "P8_40", // 8
  "P9_42", // 9
  "P8_45", // 10 // change this, collide with hdmi
  "P8_46", // 11 // chage this, collide with hdmi
  "USR2",  // 12
  "USR3",  // 13
  "P9_39", // A0
  "P9_40", // A1
  "P9_37", // A2
  "P9_38", // A3
  "P9_35", // A4
  "P9_36"  // A5
];

var pinModes = [
  { modes: [] },
  { modes: [] },
  { modes: [0, 1, 4] },
  { modes: [0, 1, 3, 4] },
  { modes: [0, 1, 4] },
  { modes: [0, 1, 3, 4] },
  { modes: [0, 1, 3, 4] },
  { modes: [0, 1, 4] },
  { modes: [0, 1, 4] },
  { modes: [0, 1, 3, 4] },
  { modes: [0, 1, 3, 4] },
  { modes: [0, 1, 3, 4] },
  { modes: [0, 1, 4] },
  { modes: [0, 1, 4] },
  { modes: [0, 1, 2], analogChannel: 0 },
  { modes: [0, 1, 2], analogChannel: 1 },
  { modes: [0, 1, 2], analogChannel: 2 },
  { modes: [0, 1, 2], analogChannel: 3 },
  { modes: [0, 1, 2], analogChannel: 4 },
  { modes: [0, 1, 2], analogChannel: 5 }
];

var boards = [];
var reporting = [];

tick(function read() {
  tick(read);
  var board;

  if (boards.length && reporting.length) {
    board = boards[0];

    reporting.forEach(function (report) {
      report.method(report.port, function (result) {
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

function ToPinIndex(pin) {
  var offset = pin[0] === "A" ? 14 : 0;
  return ((pin + "").replace("A", "") | 0) + offset;
}

function BeagleBone(opts) {
  Emitter.call(this);

  if (!(this instanceof BeagleBone)) {
    return new BeagleBone(opts);
  }

  this.name = "BeagleBone-IO";

  this.pins = pinModes.map(function (pin, index) {
    var p = {
      index: index,
      port: pinMappings[index],
      supportedModes: pin,
      value: 0,
      report: 0,
      mode: null,
    };

    if (pin.analogChannel) {
      p.analogChannel = pin.analogChannel;
    }

    return p;
  }, this);

  this.analogPins = this.pins.slice(14).map(function (pin, i) {
    return i;
  });

  boards[0] = this;

  this.isReady = true;
  tick(function () {
    this.emit("connect");
    this.emit("ready");
  }.bind(this));
}

BeagleBone.reset = function () {
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

BeagleBone.prototype.pinMode = function (pin, mode) {
  var pinIndex;
  var port;

  if (mode === 2 && typeof pin === "number") {
    pin = "A" + pin;
  }

  pinIndex = ToPinIndex(pin);
  port = this.pins[pinIndex].port;

  this.pins[pinIndex].mode = mode;

  if (mode === 3 || mode === 4) {
    this.pins[pinIndex].isPwm = true;
  }

  b.pinMode(port, modesMapping[mode]);

  return this;
};

BeagleBone.prototype.analogRead = function (pin, handler) {
  var pinIndex;
  var event;
  var alias;
  var port;

  if (typeof pin === "number") {
    pin = "A" + pin;
  }

  pinIndex = ToPinIndex(pin);
  alias = this.pins[pinIndex].analogChannel;
  port = this.pins[pinIndex].port;
  event =  "analog-read-" + alias;

  if (this.pins[pinIndex].mode !== this.MODES.INPUT) {
    this.pinMode(pin, this.MODES.INPUT);
  }

  reporting.push({
    port: port,
    event: event,
    index: pinIndex,
    method: b.analogRead,
    scale: function (val) {
      return b.map(val, 0, 1, 0, 1024);
    }
  });

  this.on(event, handler);

  return this;
};

BeagleBone.prototype.analogWrite = function (pin, value) {
  var pinIndex = ToPinIndex(pin);
  var port = this.pins[pinIndex].port;
  var scaled = b.map(value, 0, 255, 0, 1);

  if (this.pins[pinIndex].mode !== this.MODES.PWM) {
    this.pinMode(pin, this.MODES.PWM);
  }

  this.pins[pinIndex].value = scaled;
  b.analogWrite(port, scaled);

  return this;
};

BeagleBone.prototype.digitalRead = function (pin, handler) {
  var pinIndex = ToPinIndex(pin);
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

BeagleBone.prototype.digitalWrite = function (pin, value) {
  var pinIndex = ToPinIndex(pin);
  var port = this.pins[pinIndex].port;

  if (this.pins[pinIndex].mode !== this.MODES.OUTPUT) {
    this.pinMode(pin, this.MODES.OUTPUT);
  }

  this.pins[pinIndex].value = value;
  b.digitalWrite(port, value);
  return this;
};

BeagleBone.prototype.servoWrite = BeagleBone.prototype.analogWrite;

// Not Supported
[
  "pulseIn",
  "pulseOut",
  "queryPinState",
  "sendI2CWriteRequest",
  "sendI2CReadRequest",
  "sendI2CConfig",
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
].forEach(function (method) {
  BeagleBone.prototype[method] = function () {
    throw method + " is not yet implemented.";
  };

});

module.exports = BeagleBone;
