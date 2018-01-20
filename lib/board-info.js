'use strict';

var fs = require('fs'),
  bbbPins = require('./bbb-pins'),
  pocketBeaglePins = require('./pocket-beagle-pins'),
  bbgwPins = require('./bbgw-pins');

var MODEL_FILE_PATH = '/proc/device-tree/model',
  FS_OPTIONS = {encoding: 'utf8'};

module.exports.pins = function () {
  var model;

  try {
    model = fs.readFileSync(MODEL_FILE_PATH, FS_OPTIONS);
  } catch (ignore) {
  }

  if (model === 'TI AM335x BeagleBone Black\u0000') {
    return bbbPins;
  } else if (model === 'TI AM335x PocketBeagle\u0000') {
    return pocketBeaglePins;
  } else if (model === 'TI AM335x BeagleBone Green Wireless\u0000') {
    return bbgwPins;
  } else {
    return bbbPins;
  }
};

