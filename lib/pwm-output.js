'use strict';

var fs = require('fs'),
  glob = require('glob'),
  pinmux = require('./pinmux');

var OCP_PATH = '/sys/devices/platform/ocp/',
  FS_OPTIONS = {encoding: 'utf8'};

function pwmChipPattern(pinData) {
  return OCP_PATH +
    pinData.custom.pwm.module.subSystem.addr.toString(16) +
    '.epwmss/' +
    pinData.custom.pwm.module.addr.toString(16) +
    '.' +
    pinData.custom.pwm.module.suffix +
    '/pwm/pwmchip*';
}

function PwmOutput(pinData, period) {
  var matches,
    pwmChipPath,
    pwmChannelPath,
    channel;

  if (!(this instanceof PwmOutput)) {
    return new PwmOutput(pinData);
  }

  matches = glob.sync(pwmChipPattern(pinData));
  if (matches.length !== 1) {
    throw new Error(
      'Can\'t find unique directory macthing "' + pwmChipPattern(pinData) + '"'
    );
  }

  pwmChipPath = matches[0];
  channel = pinData.custom.pwm.channel;
  pwmChannelPath = pwmChipPath + '/pwm' + channel;

  matches = glob.sync(pwmChannelPath);
  if (matches.length !== 1) {
    // The pwm channel hasn't been exported yet, so export it.
    fs.writeFileSync(pwmChipPath + '/export', channel, FS_OPTIONS);
  }

  this.period = period;
  fs.writeFileSync(pwmChannelPath + '/period', period, FS_OPTIONS);

  this.enableFd = fs.openSync(pwmChannelPath + '/enable', 'r+');
  fs.writeSync(this.enableFd, 1, FS_OPTIONS);

  this.dutyCycleFd = fs.openSync(pwmChannelPath + '/duty_cycle', 'r+');

  pinmux.state(pinData.custom.id, 'pwm');
}

PwmOutput.prototype.pwmWrite = function (dutyCycle) {
  // There are glitches if an attempt is made to set the duty cycle to a value
  // less that 10. This is very visible when pulsing an LED. Setting the duty
  // cycle to a value less than 10 should make the LED very very dim, however,
  // it results in the LED becoming very bright for a fraction of a second.
  // Disabling PWM while setting the duty cycle appears to work around the
  // issue.

  if (dutyCycle < 10) {
    fs.writeSync(this.enableFd, 0, FS_OPTIONS);
  }

  fs.writeSync(this.dutyCycleFd, dutyCycle, FS_OPTIONS);

  if (dutyCycle < 10) {
    fs.writeSync(this.enableFd, 1, FS_OPTIONS);
  }
};

module.exports = PwmOutput;

