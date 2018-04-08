'use strict';

var fs = require('fs');

var OCP_PATH = '/sys/devices/platform/ocp/',
  FS_OPTIONS = {encoding: 'utf8'};

module.exports.state = function (pinId, state) {
  fs.writeFileSync(
    OCP_PATH + 'ocp:' + pinId + '_pinmux/state',
    state,
    FS_OPTIONS
  );
};

