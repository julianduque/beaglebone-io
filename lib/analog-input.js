'use strict';

var fs = require('fs');

var ADC_PATH = '/sys/bus/iio/devices/iio:device0/';

function AnalogInput(analogChannel) {
  var rawValueFile = ADC_PATH + 'in_voltage' + analogChannel + '_raw';

  if (!(this instanceof AnalogInput)) {
    return new AnalogInput(analogChannel);
  }

  this._rawValueFd = fs.openSync(rawValueFile, 'r');
  this._rawValueBuffer = new Buffer(5);
}

AnalogInput.prototype.rawValue = function () {
  var len = fs.readSync(
    this._rawValueFd,
    this._rawValueBuffer,
    0,
    this._rawValueBuffer.length,
    0
  );

  return parseInt(this._rawValueBuffer.toString('utf8', 0, len - 1), 10);
};

/*AnalogInput.prototype.rawValue = function (callback) {
  fs.read(
    this._rawValueFd,
    this._rawValueBuffer,
    0,
    this._rawValueBuffer.length,
    0,
    function (err, bytesRead, buffer) {
      if (err) {
        return callback(err);
      }

      callback(null, parseInt(buffer.toString('utf8', 0, bytesRead - 1), 10));
    }
  );
};*/

module.exports = AnalogInput;

