'use strict';

var pwmSubSystems = {
  subSystem0: { addr: 0x48300000 },
  subSystem1: { addr: 0x48302000 },
  subSystem2: { addr: 0x48304000 }
};

var pwmModules = {
  ecap0: { subSystem: pwmSubSystems.subSystem0, addr: 0x48300100, suffix: 'ecap' },
  ehrpwm0: { subSystem: pwmSubSystems.subSystem0, addr: 0x48300200, suffix: 'pwm' },
  ehrpwm1: { subSystem: pwmSubSystems.subSystem1, addr: 0x48302200, suffix: 'pwm' },
  ehrpwm2: { subSystem: pwmSubSystems.subSystem2, addr: 0x48304200, suffix: 'pwm' }
};

var pwmPins = {
  p8_13: { module: pwmModules.ehrpwm2, channel: 1 },
  p8_19: { module: pwmModules.ehrpwm2, channel: 0 },
  p9_14: { module: pwmModules.ehrpwm1, channel: 0 },
  p9_16: { module: pwmModules.ehrpwm1, channel: 1 },
  p9_21: { module: pwmModules.ehrpwm0, channel: 1 },
  p9_22: { module: pwmModules.ehrpwm0, channel: 0 },
  p9_42: { module: pwmModules.ecap0,   channel: 0 }
};

module.exports = [
  /* P8_1 - P8_2: DGND */
  /* P8_3 - P8_6: EMCC */
  { ids: ['P8_7', 'GPIO66'], gpioNo: 66, modes: [0, 1], custom: { id: 'P8_07' } },
  { ids: ['P8_8', 'GPIO67'], gpioNo: 67, modes: [0, 1], custom: { id: 'P8_08' } },
  { ids: ['P8_9', 'GPIO69'], gpioNo: 69, modes: [0, 1], custom: { id: 'P8_09' } },
  { ids: ['P8_10', 'GPIO68'], gpioNo: 68, modes: [0, 1], custom: { id: 'P8_10' } },
  { ids: ['P8_11', 'GPIO45'], gpioNo: 45, modes: [0, 1], custom: { id: 'P8_11' } },
  { ids: ['P8_12', 'GPIO44'], gpioNo: 44, modes: [0, 1], custom: { id: 'P8_12' } },
  { ids: ['P8_13', 'GPIO23'], gpioNo: 23, modes: [0, 1, 3, 4], custom: { id: 'P8_13', pwm: pwmPins.p8_13 } },
  { ids: ['P8_14', 'GPIO26'], gpioNo: 26, modes: [0, 1], custom: { id: 'P8_14' } },
  { ids: ['P8_15', 'GPIO47'], gpioNo: 47, modes: [0, 1], custom: { id: 'P8_15' } },
  { ids: ['P8_16', 'GPIO46'], gpioNo: 46, modes: [0, 1], custom: { id: 'P8_16' } },
  { ids: ['P8_17', 'GPIO27'], gpioNo: 27, modes: [0, 1], custom: { id: 'P8_17' } },
  { ids: ['P8_18', 'GPIO65'], gpioNo: 65, modes: [0, 1], custom: { id: 'P8_18' } },
  { ids: ['P8_19', 'GPIO22'], gpioNo: 22, modes: [0, 1, 3, 4], custom: { id: 'P8_19', pwm: pwmPins.p8_19 } },
  /* P8_20 - P8_25: EMCC */
  { ids: ['P8_26', 'GPIO61'], gpioNo: 61, modes: [0, 1], custom: { id: 'P8_26' } },
  /* P8_27 - P8_46: HDMI */

  /* P9_1 - P9_2: DGND */
  /* P9_3 - P9_4: VDD_3V3 */
  /* P9_5 - P9_6: VDD_5V */
  /* P9_7 - P9_8: SYS_5V */
  /* P9_9: PWR_BUT */
  /* P9_10: SYS_RESETn */
  { ids: ['P9_11', 'GPIO30'], gpioNo: 30, modes: [0, 1], custom: { id: 'P9_11' } },
  { ids: ['P9_12', 'GPIO60'], gpioNo: 60, modes: [0, 1], custom: { id: 'P9_12' } },
  { ids: ['P9_13', 'GPIO31'], gpioNo: 31, modes: [0, 1], custom: { id: 'P9_13' } },
  { ids: ['P9_14', 'GPIO50'], gpioNo: 50, modes: [0, 1, 3, 4], custom: { id: 'P9_14', pwm: pwmPins.p9_14 } },
  { ids: ['P9_15', 'GPIO48'], gpioNo: 48, modes: [0, 1], custom: { id: 'P9_15' } },
  { ids: ['P9_16', 'GPIO51'], gpioNo: 51, modes: [0, 1, 3, 4], custom: { id: 'P9_16', pwm: pwmPins.p9_16 } },
  { ids: ['P9_17', 'GPIO5'], gpioNo: 5, modes: [0, 1], custom: { id: 'P9_17' } },
  { ids: ['P9_18', 'GPIO4'], gpioNo: 4, modes: [0, 1], custom: { id: 'P9_18' } },
  /* P9_19: I2C2 SCL */
  /* P9_20: I2C2 SDA */
  { ids: ['P9_21', 'GPIO3'], gpioNo: 3, modes: [0, 1, 3, 4], custom: { id: 'P9_21', pwm: pwmPins.p9_21 } },
  { ids: ['P9_22', 'GPIO2'], gpioNo: 2, modes: [0, 1, 3, 4], custom: { id: 'P9_22', pwm: pwmPins.p9_22 } },
  { ids: ['P9_23', 'GPIO49'], gpioNo: 49, modes: [0, 1], custom: { id: 'P9_23' } },
  { ids: ['P9_24', 'GPIO15'], gpioNo: 15, modes: [0, 1], custom: { id: 'P9_24' } },
  /* P9_25: AUDIO */
  { ids: ['P9_26', 'GPIO14'], gpioNo: 14, modes: [0, 1], custom: { id: 'P9_26' } },
  { ids: ['P9_27', 'GPIO115'], gpioNo: 115, modes: [0, 1], custom: { id: 'P9_27' } },
  /* P9_28 - P9_29: AUDIO */
  { ids: ['P9_30', 'GPIO112'], gpioNo: 112, modes: [0, 1], custom: { id: 'P9_30' } },
  /* P9_31: AUDIO */
  /* P9_32: VDD_ADC */
  { ids: ['P9_33', 'A4'], analogChannel: 4, modes: [2], custom: { id: 'P9_33' } },
  /* P9_34 - GNDA_ADC */
  { ids: ['P9_35', 'A6'], analogChannel: 6, modes: [2], custom: { id: 'P9_35' } },
  { ids: ['P9_36', 'A5'], analogChannel: 5, modes: [2], custom: { id: 'P9_36' } },
  { ids: ['P9_37', 'A2'], analogChannel: 2, modes: [2], custom: { id: 'P9_37' } },
  { ids: ['P9_38', 'A3'], analogChannel: 3, modes: [2], custom: { id: 'P9_38' } },
  { ids: ['P9_39', 'A0'], analogChannel: 0, modes: [2], custom: { id: 'P9_39' } },
  { ids: ['P9_40', 'A1'], analogChannel: 1, modes: [2], custom: { id: 'P9_40' } },
  { ids: ['P9_41', 'GPIO20'], gpioNo: 20, modes: [0, 1], custom: { id: 'P9_41' } },
  { ids: ['P9_42', 'GPIO7'], gpioNo: 7, modes: [0, 1, 3, 4], custom: { id: 'P9_42', pwm: pwmPins.p9_42 } },
  /* P9_43 - P9_46: DGND */

  { ids: ['USR0'], ledPath: '/sys/class/leds/beaglebone:green:usr0', modes: [1] },
  { ids: ['USR1'], ledPath: '/sys/class/leds/beaglebone:green:usr1', modes: [1] },
  { ids: ['USR2'], ledPath: '/sys/class/leds/beaglebone:green:usr2', modes: [1] },
  { ids: ['USR3'], ledPath: '/sys/class/leds/beaglebone:green:usr3', modes: [1] }
];

