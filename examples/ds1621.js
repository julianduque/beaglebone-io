var BeagleBone = require('../lib/beaglebone');
var board = new BeagleBone();

var DS1621_ADDR = 0x48;
var CMD_ACCESS_CONFIG = 0xac;
var CMD_READ_TEMP = 0xaa;
var CMD_START_CONVERT = 0xee;

function toCelcius(rawTemp) {
  var halfDegrees = ((rawTemp & 0xff) << 1) + (rawTemp >> 15);

  if ((halfDegrees & 0x100) === 0) {
    return halfDegrees / 2; // Temp +ve
  }

  return -((~halfDegrees & 0xff) / 2); // Temp -ve
}

function readTemperatureOnce(board, cb) {
  board.i2cReadOnce(DS1621_ADDR, CMD_READ_TEMP, 2, function (data) {
    var rawTemp = (new Buffer(data)).readUInt16LE(0);
    cb(toCelcius(rawTemp));
  });
}

function readTemperatureForever(board, cb) {
  board.i2cRead(DS1621_ADDR, CMD_READ_TEMP, 2, function (data) {
    var rawTemp = (new Buffer(data)).readUInt16LE(0);
    cb(toCelcius(rawTemp));
  });
}

function whenConversionComplete(board, cb) {
  board.i2cReadOnce(DS1621_ADDR, CMD_ACCESS_CONFIG, 1, function (data) {
    if ((data[0] & 0x80) === 0) {
      return whenConversionComplete(board, cb);
    }
    cb();
  });
}

function performConversion(board, cb) {
  board.i2cWrite(DS1621_ADDR, [CMD_START_CONVERT]);
  whenConversionComplete(board, cb);
}

function whenMemoryReady(board, cb) {
  board.i2cReadOnce(DS1621_ADDR, CMD_ACCESS_CONFIG, 1, function (data) {
    if (data[0] & 0x10) {
      return whenMemoryReady(board, cb);
    }
    cb();
  });
}

function startOneShotMode(board, cb) {
  board.i2cWriteReg(DS1621_ADDR, CMD_ACCESS_CONFIG, 1);
  whenMemoryReady(board, cb);
}

board.on('ready', function () {
  this.i2cConfig(100);

  startOneShotMode(board, function () {
    performConversion(board, function () {
      readTemperatureOnce(board, function (temperature) {
        console.log(temperature);
        readTemperatureForever(board, function (temperature) {
          console.log(temperature);
        });
      });
    });
  });
});

