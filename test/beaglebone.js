var rewire = require("rewire");
var BeagleBone = rewire("../lib/beaglebone");
var Emitter = require("events").EventEmitter;
var sinon = require("sinon");

var bStub = {
  pinMode: function (pin, mode) {},
  digitalRead: function (pin, handler) {},
  analogRead: function (pin, handler) {},
  digitalWrite: function (pin, value) {},
  analogWrite: function (pin, value) {}
};

BeagleBone.__set__("b", bStub);

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
      name: "digitalRead"
    }, {
      name: "digitalWrite"
    }, {
      name: "servoWrite"
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
    BeagleBone.reset();
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
    test.expect(7);

    test.equal(this.beaglebone.HIGH, 1);

    test.throws(function() {
      this.beaglebone.HIGH = 42;
    });

    test.equal(this.beaglebone.LOW, 0);

    test.throws(function() {
      this.beaglebone.LOW = 42;
    });

    test.deepEqual(this.beaglebone.MODES, {
      INPUT: 0,
      OUTPUT: 1,
      ANALOG: 2,
      PWM: 3,
      SERVO: 4
    });

    test.throws(function() {
      this.beaglebone.MODES.INPUT = 42;
    });

    test.throws(function() {
      this.beaglebone.MODES = 42;
    });

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
  }
};


exports["BeagleBone.prototype.analogRead"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();

    this.analogRead = sinon.spy(BeagleBone.prototype, "analogRead");
    this.beaglebone = new BeagleBone();

    done();
  },
  tearDown: function(done) {
    BeagleBone.reset();

    restore(this);

    this.beaglebone.removeAllListeners("analog-read-A0");
    this.beaglebone.removeAllListeners("digital-read-9");

    done();
  },
  correctMode: function(test) {
    test.expect(1);

    // Reading from an ANALOG pin should set its mode to 1 ("out")
    this.beaglebone.analogRead("A0", function() {});

    test.equal(this.beaglebone.pins[14].mode, 1);

    test.done();
  },

  analogPin: function(test) {
    test.expect(2);

    // Reading from an ANALOG pin should set its mode to 1 ("out")
    var value = 1024;


    this.analogRead = sinon.stub(bStub, "analogRead", function(pin, cb) {
      cb(null, value);
    });

    var handler = function(data) {
      test.equal(data, value);
      test.done();
    };

    this.beaglebone.analogRead(0, handler);

    test.equal(this.beaglebone.pins[14].mode, 1);
  },

  port: function(test) {
    test.expect(1);

    var port = this.port;


    var handler = function(data) {};

    this.beaglebone.analogRead("A0", handler);
  },

  handler: function(test) {
    test.expect(1);

    var value = 1024;
    var scaled = value >> 2;



    var handler = function(data) {
      test.equal(data, scaled);
      test.done();
    };

    this.beaglebone.analogRead("A0", handler);
  },

  event: function(test) {
    test.expect(1);

    var value = 1024;
    var scaled = value >> 2;
    var event = "analog-read-0";


    this.beaglebone.once(event, function(data) {
      test.equal(data, scaled);
      test.done();
    });

    var handler = function(data) {};

    this.beaglebone.analogRead("A0", handler);
  }
};

exports["BeagleBone.prototype.digitalRead"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();

    this.port = "/sys/class/gpio/gpio18/value";

    this.beaglebone = new BeagleBone();

    done();
  },
  tearDown: function(done) {
    BeagleBone.reset();
    restore(this);

    this.beaglebone.removeAllListeners("analog-read-A0");
    this.beaglebone.removeAllListeners("digital-read-3");

    done();
  },
  correctMode: function(test) {
    test.expect(1);

    // Reading from a DIGITAL pin should set its mode to 0 ("in")
    this.beaglebone.digitalRead(3, function() {});

    test.equal(this.beaglebone.pins[3].mode, 0);

    test.done();
  },

  port: function(test) {
    test.expect(1);

    var port = this.port;

    this.readFile = sinon.stub(bStub, "readFile", function(path, flags, cb) {
      test.equal(port, path);

      test.done();
    });

    var handler = function(data) {};

    this.beaglebone.digitalRead(3, handler);
  },

  handler: function(test) {
    test.expect(1);

    var value = 256;

    this.readFile = sinon.stub(bStub, "readFile", function(path, flags, cb) {
      cb(null, value);
    });

    var handler = function(data) {
      test.equal(data, value);
      test.done();
    };

    this.beaglebone.digitalRead(3, handler);
  },

  event: function(test) {
    test.expect(1);

    var value = 256;
    var event = "digital-read-3";


    this.beaglebone.once(event, function(data) {
      test.equal(data, value);
      test.done();
    });

    var handler = function(data) {};

    this.beaglebone.digitalRead(3, handler);
  }
};


exports["BeagleBone.prototype.analogWrite"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();

    // this.port = "/sys/class/gpio/gpio18/value";

    this.beaglebone = new BeagleBone();

    done();
  },
  tearDown: function(done) {
    BeagleBone.reset();
    restore(this);
    done();
  },

  mode: function(test) {
    test.expect(3);

    var value = 255;

    // Set pin to INPUT...
    this.beaglebone.pinMode("A0", 0);
    test.equal(this.beaglebone.pins[14].mode, 0);

    // Writing to a pin should change its mode to 1
    this.beaglebone.analogWrite("A0", value);
    test.equal(this.beaglebone.pins[14].mode, 3);
    test.equal(this.beaglebone.pins[14].isPwm, true);

    test.done();
  },

  write: function(test) {
    test.expect(2);

    var value = 255;

    this.beaglebone.analogWrite("A0", value);

    test.ok(this.write.calledOnce);
    test.deepEqual(this.write.firstCall.args, [value]);

    test.done();
  },

  stored: function(test) {
    test.expect(1);

    var value = 255;
    this.beaglebone.analogWrite("A0", value);

    test.equal(this.beaglebone.pins[14].value, value);

    test.done();
  }
};


exports["BeagleBone.prototype.digitalWrite"] = {
  setUp: function(done) {
    this.clock = sinon.useFakeTimers();

    // this.port = "/sys/class/gpio/gpio18/value";

    this.beaglebone = new BeagleBone();

    done();
  },
  tearDown: function(done) {
    BeagleBone.reset();
    restore(this);
    done();
  },

  mode: function(test) {
    test.expect(3);

    var value = 1;

    // Set pin to INPUT...
    this.beaglebone.pinMode(3, 0);
    test.equal(this.beaglebone.pins[3].mode, 0);

    // Writing to a pin should change its mode to 1
    this.beaglebone.digitalWrite(3, value);
    test.equal(this.beaglebone.pins[3].mode, 1);
    test.equal(this.beaglebone.pins[3].isPwm, false);

    test.done();
  },

  write: function(test) {
    test.expect(2);

    var value = 1;

    this.beaglebone.digitalWrite(3, value);

    test.ok(this.write.calledOnce);
    test.deepEqual(this.write.firstCall.args, [value]);

    test.done();
  },

  stored: function(test) {
    test.expect(1);

    var value = 1;
    this.beaglebone.digitalWrite(3, value);

    test.equal(this.beaglebone.pins[3].value, value);

    test.done();
  }
};

exports["BeagleBone.prototype.servoWrite"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    done();
  },
  alias: function(test) {
    test.expect(1);
    test.equal(
      BeagleBone.prototype.servoWrite,
      BeagleBone.prototype.analogWrite
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

    this.beaglebone.pinMode("A0", 1);

    test.equal(this.beaglebone.pins[14].mode, 1);

    test.done();
  },
  analogIn: function(test) {
    test.expect(3);

    this.beaglebone.pinMode("A0", 0);
    test.equal(this.beaglebone.pins[14].mode, 0);

    this.beaglebone.pinMode(0, 2);

    test.equal(this.beaglebone.pins[14].direction, "in");
    test.equal(this.beaglebone.pins[14].mode, 2);


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

    this.beaglebone.pinMode(3, 1);

    test.equal(this.beaglebone.pins[3].mode, 1);

    test.done();
  },
  digitalIn: function(test) {
    test.expect(1);

    this.beaglebone.pinMode(3, 0);

    test.equal(this.beaglebone.pins[3].mode, 0);

    test.done();
  }
};
