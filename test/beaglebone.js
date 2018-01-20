var rewire = require("rewire");
var BeagleBone = rewire("../lib/beaglebone");
var Emitter = require("events").EventEmitter;
var sinon = require("sinon");

function restore(target) {
  for (var prop in target) {
    if (typeof target[prop].restore === "function") {
      target[prop].restore();
    }
  }
}

exports["BeagleBone"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();
    this.proto = {};

    this.proto.functions = [{
      name: "analogRead"
    }, {
      name: "analogWrite"
    }, {
      name: "pwmWrite"
    }, {
      name: "digitalRead"
    }, {
      name: "digitalWrite"
    }, {
      name: "servoWrite"
    }, {
      name: "i2cConfig"
    }, {
      name: "i2cWrite"
    }, {
      name: "i2cWriteReg"
    }, {
      name: "i2cRead"
    }, {
      name: "i2cReadOnce"
    }, {
      name: "sendI2CWriteRequest"
    }, {
      name: "sendI2CConfig"
    }, {
      name: "sendI2CReadRequest"
    }];

    this.proto.objects = [{
      name: "MODES"
    }];

    this.proto.numbers = [{
      name: "HIGH"
    }, {
      name: "LOW"
    }];

    this.instance = [{
      name: "pins"
    }, {
      name: "analogPins"
    }];

    done();
  },

  tearDown: function(done) {
    restore(this);

    done();
  },

  shape: function(test) {
    test.expect(
      this.proto.functions.length +
      this.proto.objects.length +
      this.proto.numbers.length +
      this.instance.length
    );

    this.proto.functions.forEach(function(method) {
      test.equal(typeof this.beaglebone[method.name], "function");
    }, this);

    this.proto.objects.forEach(function(method) {
      test.equal(typeof this.beaglebone[method.name], "object");
    }, this);

    this.proto.numbers.forEach(function(method) {
      test.equal(typeof this.beaglebone[method.name], "number");
    }, this);

    this.instance.forEach(function(property) {
      test.notEqual(typeof this.beaglebone[property.name], "undefined");
    }, this);

    test.done();
  },

  readonly: function(test) {
    test.expect(11);

    test.equal(this.beaglebone.HIGH, 1);

    this.beaglebone.HIGH = 42;
    test.equal(this.beaglebone.HIGH, 1);

    test.equal(this.beaglebone.LOW, 0);

    this.beaglebone.LOW = 42;
    test.equal(this.beaglebone.LOW, 0);

    test.equal(this.beaglebone.MODES.INPUT, 0);
    test.equal(this.beaglebone.MODES.OUTPUT, 1);
    test.equal(this.beaglebone.MODES.ANALOG, 2);
    test.equal(this.beaglebone.MODES.PWM, 3);
    test.equal(this.beaglebone.MODES.SERVO, 4);

    this.beaglebone.MODES.INPUT = 42;
    test.equal(this.beaglebone.MODES.INPUT, 0);

    this.beaglebone.MODES = 42;
    test.equal(typeof this.beaglebone.MODES, "object");

    test.done();
  },

  emitter: function(test) {
    test.expect(1);

    test.ok(this.beaglebone instanceof Emitter);

    test.done();
  },

  connected: function(test) {
    test.expect(1);

    this.beaglebone.on("connect", function() {
      test.ok(true);

      test.done();
    });
  },

  ready: function(test) {
    test.expect(1);

    this.beaglebone.on("ready", function() {
      test.ok(true);

      test.done();
    });
  },

  normalize: function(test) {
    test.expect(4);

    test.equal(2, this.beaglebone.normalize(2));
    test.equal(2, this.beaglebone.normalize("P8_9"));
    test.equal(41, this.beaglebone.normalize("USR3"));
    test.equal(34, this.beaglebone.normalize("A0"));

    test.done();
  }
};

exports["BeagleBone.prototype.analogRead"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();

    done();
  },

  tearDown: function(done) {
    restore(this);
    this.beaglebone._analogReports = [];

    done();
  },

  correctMode: function(test) {
    test.expect(1);

    this.pinModeAnalog = sinon.stub(this.beaglebone, "_pinModeAnalog");

    this.beaglebone.pinMode("A0", 2);

    test.equal(this.beaglebone.pins[this.beaglebone.normalize("A0")].mode, 2);

    test.done();
  },

  analogPin: function(test) {
    test.expect(2);

    var value = 1023;

    this.pinModeAnalog = sinon.stub(this.beaglebone, "_pinModeAnalog");
    this.analogRead = sinon.stub(this.beaglebone, "_analogRead")
      .callsFake(function(pinData, cb) {
        cb(null, value);
      });

    this.beaglebone.pinMode("A0", 2);

    test.equal(this.beaglebone.pins[this.beaglebone.normalize("A0")].mode, 2);

    var handler = function(data) {
      test.equal(data, value);

      test.done();
    };

    this.beaglebone.analogRead("A0", handler);

    this.clock.tick(5);
  },

  channel: function(test) {
    test.expect(1);

    var channel = 0;

    this.pinModeAnalog = sinon.stub(this.beaglebone, "_pinModeAnalog")
      .callsFake(function(pinData) {
        test.equal(pinData.analogChannel, channel);

        test.done();
      });

    this.beaglebone.pinMode("A0", 2);
  },

  handler: function(test) {
    test.expect(1);

    var value = 511;

    this.pinModeAnalog = sinon.stub(this.beaglebone, "_pinModeAnalog");
    this.analogRead = sinon.stub(this.beaglebone, "_analogRead")
      .callsFake(function(pinData, cb) {
        cb(null, value);
      });

    this.beaglebone.pinMode("A0", 2);

    var handler = function(data) {
      test.equal(data, value);

      test.done();
    };

    this.beaglebone.analogRead("A0", handler);

    this.clock.tick(5);
  },

  event: function(test) {
    test.expect(1);

    var value = 255;
    var event = "analog-read-" + this.beaglebone.normalize("A0");

    this.pinModeAnalog = sinon.stub(this.beaglebone, "_pinModeAnalog");
    this.analogRead = sinon.stub(this.beaglebone, "_analogRead")
      .callsFake(function(pinData, cb) {
        cb(null, value);
      });

    this.beaglebone.once(event, function(data) {
      test.equal(data, value);
      test.done();
    });

    this.beaglebone.pinMode("A0", 2);
    this.beaglebone.analogRead("A0", function(data) {});

    this.clock.tick(5);
  }
};

exports["BeagleBone.prototype.digitalRead"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();

    done();
  },

  tearDown: function(done) {
    restore(this);
    this.beaglebone._digitalReports = [];

    done();
  },

  correctMode: function(test) {
    test.expect(1);

    this.pinModeInput = sinon.stub(this.beaglebone, "_pinModeInput");

    this.beaglebone.pinMode("P8_13", 0);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].mode,
      0
    );

    test.done();
  },

  port: function(test) {
    test.expect(1);

    this.pinModeInput = sinon.stub(this.beaglebone, "_pinModeInput");
    this.digitalReadSync = sinon.stub(this.beaglebone, "_digitalReadSync")
      .callsFake(function(pinData) {
        test.equal("P8_13", pinData.custom.id);
        test.done();
      });

    this.beaglebone.pinMode("P8_13", 0);
    this.beaglebone.digitalRead("P8_13", function() {});

    this.clock.tick(5);
  },

  handler: function(test) {
    test.expect(1);

    var value = 1;

    this.pinModeInput = sinon.stub(this.beaglebone, "_pinModeInput");
    this.digitalReadSync = sinon.stub(this.beaglebone, "_digitalReadSync")
      .callsFake(function(pinData) {
        return value;
      });

    var handler = function(data) {
      test.equal(data, value);
      test.done();
    };

    this.beaglebone.pinMode("P8_13", 0);
    this.beaglebone.digitalRead("P8_13", handler);

    this.clock.tick(5);
  },

  event: function(test) {
    test.expect(1);

    var value = 1;
    var pinNo = this.beaglebone.normalize("P8_13");
    var event = "digital-read-" + pinNo;

    this.pinModeInput = sinon.stub(this.beaglebone, "_pinModeInput");
    this.digitalReadSync = sinon.stub(this.beaglebone, "_digitalReadSync")
      .callsFake(function(pinData) {
        return value;
      });

    this.beaglebone.once(event, function(data) {
      test.equal(data, value);
      test.done();
    });

    var handler = function(data) {};
    this.beaglebone.pinMode("P8_13", 0);
    this.beaglebone.digitalRead("P8_13", handler);

    this.clock.tick(5);
  }
};

exports["BeagleBone.prototype.analogWrite"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();

    done();
  },

  tearDown: function(done) {
    restore(this);

    done();
  },

  mode: function(test) {
    test.expect(1);

    this.pinModePwm = sinon.stub(this.beaglebone, "_pinModePwm");

    this.beaglebone.pinMode("P8_13", 3);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].mode,
      3
    );

    test.done();
  },

  write: function(test) {
    test.expect(3);

    var value = 255;

    this.pinModePwm = sinon.stub(this.beaglebone, "_pinModePwm");
    this.pwmWriteSync = sinon.stub(this.beaglebone, "_pwmWriteSync");

    this.beaglebone.pinMode("P8_13", 3);
    this.beaglebone.analogWrite("P8_13", value);
    test.ok(this.pwmWriteSync.calledOnce);
    test.equal(this.pwmWriteSync.firstCall.args[0].custom.id, "P8_13");
    test.equal(this.pwmWriteSync.firstCall.args[1], value);

    test.done();
  },

  stored: function(test) {
    test.expect(1);

    var value = 255;

    this.pinModePwm = sinon.stub(this.beaglebone, "_pinModePwm");
    this.pwmWriteSync = sinon.stub(this.beaglebone, "_pwmWriteSync");

    this.beaglebone.pinMode("P8_13", 3);
    this.beaglebone.analogWrite("P8_13", value);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].value,
      value
    );

    test.done();
  }
};

exports["BeagleBone.prototype.pwmWrite"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();

    done();
  },

  tearDown: function(done) {
    restore(this);

    done();
  },

  mode: function(test) {
    test.expect(1);

    this.pinModePwm = sinon.stub(this.beaglebone, "_pinModePwm");

    this.beaglebone.pinMode("P9_42", 3);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P9_42")].mode,
      3
    );

    test.done();
  },

  write: function(test) {
    test.expect(3);

    var value = 255;

    this.pinModePwm = sinon.stub(this.beaglebone, "_pinModePwm");
    this.pwmWriteSync = sinon.stub(this.beaglebone, "_pwmWriteSync");

    this.beaglebone.pinMode("P9_42", 3);
    this.beaglebone.pwmWrite("P9_42", value);
    test.ok(this.pwmWriteSync.calledOnce);
    test.equal(this.pwmWriteSync.firstCall.args[0].custom.id, "P9_42");
    test.equal(this.pwmWriteSync.firstCall.args[1], value);

    test.done();
  },

  stored: function(test) {
    test.expect(1);

    var value = 127;

    this.pinModePwm = sinon.stub(this.beaglebone, "_pinModePwm");
    this.pwmWriteSync = sinon.stub(this.beaglebone, "_pwmWriteSync");

    this.beaglebone.pinMode("P9_42", 3);
    this.beaglebone.pwmWrite("P9_42", value);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P9_42")].value,
      value
    );

    test.done();
  }
};

exports["BeagleBone.prototype.digitalWrite"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();

    done();
  },

  tearDown: function(done) {
    restore(this);

    done();
  },

  mode: function(test) {
    test.expect(1);

    this.pinModeOutput = sinon.stub(this.beaglebone, "_pinModeOutput");

    this.beaglebone.pinMode("P8_13", 1);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].mode,
      1
    );

    test.done();
  },

  write: function(test) {
    test.expect(3);

    var value = 1;

    this.pinModeOutput = sinon.stub(this.beaglebone, "_pinModeOutput");
    this.digitalWriteSync = sinon.stub(this.beaglebone, "_digitalWriteSync");

    this.beaglebone.pinMode("P8_13", 1);
    this.beaglebone.digitalWrite("P8_13", value);
    test.ok(this.digitalWriteSync.calledOnce);
    test.equal(this.digitalWriteSync.firstCall.args[0].custom.id, "P8_13");
    test.equal(this.digitalWriteSync.firstCall.args[1], value);

    test.done();
  },

  stored: function(test) {
    test.expect(1);

    var value = 1;

    this.pinModeOutput = sinon.stub(this.beaglebone, "_pinModeOutput");
    this.digitalWriteSync = sinon.stub(this.beaglebone, "_digitalWriteSync");

    this.beaglebone.pinMode("P8_13", 1);
    this.beaglebone.digitalWrite("P8_13", value);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].value,
      value
    );

    test.done();
  }
};

exports["BeagleBone.prototype.servoWrite"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();

    done();
  },

  tearDown: function(done) {
    restore(this);

    done();
  },

  mode: function(test) {
    test.expect(1);

    this.pinModeServo = sinon.stub(this.beaglebone, "_pinModeServo");

    this.beaglebone.pinMode("P8_13", 4);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].mode,
      4
    );

    test.done();
  },

  write: function(test) {
    test.expect(3);

    var value = 90;

    this.pinModeServo = sinon.stub(this.beaglebone, "_pinModeServo");
    this.servoWriteSync = sinon.stub(this.beaglebone, "_servoWriteSync");

    this.beaglebone.pinMode("P8_13", 4);
    this.beaglebone.servoWrite("P8_13", value);
    test.ok(this.servoWriteSync.calledOnce);
    test.equal(this.servoWriteSync.firstCall.args[0].custom.id, "P8_13");
    test.equal(this.servoWriteSync.firstCall.args[1], value);

    test.done();
  },

  stored: function(test) {
    test.expect(1);

    var value = 180;

    this.pinModeServo = sinon.stub(this.beaglebone, "_pinModeServo");
    this.servoWriteSync = sinon.stub(this.beaglebone, "_servoWriteSync");

    this.beaglebone.pinMode("P8_13", 4);
    this.beaglebone.servoWrite("P8_13", value);

    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].value,
      value
    );

    test.done();
  }
};

exports["BeagleBone.prototype.pinMode (analog)"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();

    done();
  },

  tearDown: function(done) {
    restore(this);

    done();
  },

  analogOut: function(test) {
    test.expect(1);

    this.pinModePwm = sinon.stub(this.beaglebone, "_pinModePwm");

    this.beaglebone.pinMode("P9_42", 3);
    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P9_42")].mode,
      3
    );

    test.done();
  },

  analogIn: function(test) {
    test.expect(1);

    this.pinModeAnalog = sinon.stub(this.beaglebone, "_pinModeAnalog");

    this.beaglebone.pinMode("A0", 2);
    test.equal(this.beaglebone.pins[this.beaglebone.normalize("A0")].mode, 2);

    test.done();
  }
};

exports["BeagleBone.prototype.pinMode (digital)"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();
    this.beaglebone = new BeagleBone();

    done();
  },

  tearDown: function(done) {
    restore(this);

    done();
  },

  digitalOut: function(test) {
    test.expect(1);

    this.pinModeOutput = sinon.stub(this.beaglebone, "_pinModeOutput");

    this.beaglebone.pinMode("P8_13", 1);
    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].mode,
      1
    );

    test.done();
  },

  digitalIn: function(test) {
    test.expect(1);

    this.pinModeInput = sinon.stub(this.beaglebone, "_pinModeInput");

    this.beaglebone.pinMode("P8_13", 0);
    test.equal(
      this.beaglebone.pins[this.beaglebone.normalize("P8_13")].mode,
      0
    );

    test.done();
  }
};

