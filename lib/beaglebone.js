'use strict';

var LinuxIO = require('linux-io'),
  util = require('util'),
  boardInfo = require('./board-info'),
  AnalogInput = require('./analog-input'),
  PwmOutput = require('./pwm-output'),
  pinmux = require('./pinmux');

var PWM_PERIOD = 1e9 / 2000, // 2000Hz
  SERVO_PERIOD = 1e9 / 50, // 50Hz
  PULSES_PER_MICROSEC = 1e9 / 1e6;

function BeagleBone() {
  var pins = boardInfo.pins();

  LinuxIO.call(this, {
    name: 'BeagleBone-IO',
    pins: pins,
    defaultI2cBus: 2,
    defaultLed: 'USR3',
    aref: 1.8,
    vref: 3.3
  });

  setImmediate(function () {
    this.emit('connect');
    this.emit('ready');
  }.bind(this));
}
util.inherits(BeagleBone, LinuxIO);

BeagleBone.prototype._pinModeInput = function(pinData) {
  pinmux.state(pinData.custom.id, 'gpio');
  BeagleBone.super_.prototype._pinModeInput.call(this, pinData);
};

BeagleBone.prototype._pinModeOutput = function(pinData) {
  pinmux.state(pinData.custom.id, 'gpio');
  BeagleBone.super_.prototype._pinModeOutput.call(this, pinData);
};

BeagleBone.prototype._pinModeAnalog = function(pinData) {
  pinData.custom.analogInput = new AnalogInput(pinData.analogChannel);
};

BeagleBone.prototype._pinModePwm = function(pinData) {
  pinData.custom.pwmOutput = new PwmOutput(pinData, PWM_PERIOD);
};

BeagleBone.prototype._pinModeServo = function(pinData) {
  pinData.custom.pwmOutput = new PwmOutput(pinData, SERVO_PERIOD);

  pinData.servoConfig = {
    min: 600, // min must be >= 544
    max: 2400
  };
};

BeagleBone.prototype._analogRead = function(pinData, callback) {
  setImmediate(function () {
    try {
      // Raw value is 0 to 4095 but J5 expects 0 to 1023.
      callback(null, pinData.custom.analogInput.rawValue() >> 2);
    } catch (err) {
      callback(err);
    }
  });
};

BeagleBone.prototype._pwmWriteSync = function(pinData, value) {
  var dutyCycle = Math.round(value / 255 * PWM_PERIOD);

  pinData.custom.pwmOutput.pwmWrite(dutyCycle);
};

BeagleBone.prototype._servoWriteSync = function(pinData, value) {
  var min = pinData.servoConfig.min,
    max = pinData.servoConfig.max,
    dutyCycle;

  // By the time flow of control reaches this point of execution one of the
  // following is true.
  // For degrees:
  //   0 <= value && value <= 180
  // For microseconds:
  //   pinData.servoConfig.min <= value && value <= pinData.servoConfig.max

  // value < 544 implies degrees
  // value >= 544 implies microseconds
  // 544 is a magic number from the arduino servo library
  if (value < 544) {
    dutyCycle = (min + (value / 180) * (max - min)) * PULSES_PER_MICROSEC;
  } else {
    dutyCycle = value * PULSES_PER_MICROSEC;
  }

  pinData.custom.pwmOutput.pwmWrite(Math.round(dutyCycle));
};

module.exports = BeagleBone;

