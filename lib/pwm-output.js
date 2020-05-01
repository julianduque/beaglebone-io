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

function waitForAccessPermission(paths) {
  // This is a bit of a hack but it works and it's not as bad as it initially
  // looks. When a pwm is exported with kernel v4.11+ udev will set the
  // permissions on the files used to control pwm to allow these files to be
  // accessed without root privileges. It takes udev a while to set the
  // permissions and we need to wait for it to complete its work to avoid
  // EACCES errors. To determine when udev has finished its work we
  // continuously try to access the appropriate files until they are
  // successfully accessed. We stop after 10000 tries. Under normal conditions
  // approximately 200 tries are needed to successfully access the first path
  // in the paths array. The remaining paths can typically be accessed
  // successfully on the first try. On kernels prior to v4.11 the code will
  // actually attempt to access the file 10000 times if Node.js was started
  // without root privileges. The 10000 attemps take approximately 2 seconds
  // to complete and in the end an EACCES is thrown.

  paths.forEach(function (path) {
    var tries = 0,
      fd;

    while (true) {
      try {
        tries += 1;
        fd = fs.openSync(path, 'r+');
        fs.closeSync(fd);
        break;
      } catch (e) {
        if (tries === 10000) {
          throw e;
        }
      }
    }
  });
}

function PwmOutput(pinData, period) {
  var matches,
    pwmChipPath,
    pwmChannelPattern,
    pwmChannelPath,
    channel;

  if (!(this instanceof PwmOutput)) {
    return new PwmOutput(pinData, period);
  }

  // The paths for PWM files vary from kernel to kernel.
  // On kernel v4.4 and v4.9 they will look something like this:
  // /sys/devices/platform/ocp/48302000.epwmss/48302200.pwm/pwm/pwmchip*/pwm0/duty_cycle
  // On kernel v4.11+ they will look something like this:
  // /sys/devices/platform/ocp/48302000.epwmss/48302200.pwm/pwm/pwmchip*/pwm-*:0/duty_cycle

  matches = glob.sync(pwmChipPattern(pinData));
  if (matches.length !== 1) {
    throw new Error(
      'Can\'t find unique directory macthing "' + pwmChipPattern(pinData) + '"'
    );
  }

  pwmChipPath = matches[0];
  channel = pinData.custom.pwm.channel;
  pwmChannelPattern = pwmChipPath + '/pwm*' + channel;

  matches = glob.sync(pwmChannelPattern);
  if (matches.length === 0) {
    // The pwm channel hasn't been exported yet, so export it.
    fs.writeFileSync(pwmChipPath + '/export', '' + channel, FS_OPTIONS);
    matches = glob.sync(pwmChannelPattern);
  }

  if (matches.length !== 1) {
    throw new Error(
      'Can\'t find unique directory macthing "' + pwmChannelPattern + '"'
    );
  }

  pwmChannelPath = matches[0];

  // On kernel v4.11+ we wait for udev to set the permissions on the files
  // used to control pwm enabling the files to be accessed without root
  // privileges.
  waitForAccessPermission([
    pwmChannelPath + '/period',
    pwmChannelPath + '/enable',
    pwmChannelPath + '/duty_cycle'
  ]);

  this.period = period;
  fs.writeFileSync(pwmChannelPath + '/period', '' + period, FS_OPTIONS);

  this.enableFd = fs.openSync(pwmChannelPath + '/enable', 'r+');
  fs.writeSync(this.enableFd, '1', FS_OPTIONS);

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
    fs.writeSync(this.enableFd, '0', FS_OPTIONS);
  }

  fs.writeSync(this.dutyCycleFd, '' + dutyCycle, FS_OPTIONS);

  if (dutyCycle < 10) {
    fs.writeSync(this.enableFd, '1', FS_OPTIONS);
  }
};

module.exports = PwmOutput;

