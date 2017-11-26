'use strict';

/*
 * erhpwm0 channel 1 can be configured for output on P1_10 and/or P1_33.
 * If both P1_10 and P1_33 are defined to support PWM, Johnny-Five will
 * assume that it has two independent PWM channels but in reality there is
 * only one channel. To avoid issues here P1_33 is defined to support PWM
 * but P1_10 is not. The same applies to P1_8 and/or P1_36.
 */

var pwmSubSystems = {
  subSystem0: { addr: 0x48300000 },
  subSystem1: { addr: 0x48302000 },
  subSystem2: { addr: 0x48304000 }
};

var pwmModules = {
  ehrpwm0: { subSystem: pwmSubSystems.subSystem0, addr: 0x48300200, suffix: 'pwm' },
  ehrpwm1: { subSystem: pwmSubSystems.subSystem1, addr: 0x48302200, suffix: 'pwm' },
  ehrpwm2: { subSystem: pwmSubSystems.subSystem2, addr: 0x48304200, suffix: 'pwm' }
};

var pwmPins = {
  p1_33: { module: pwmModules.ehrpwm0, channel: 1 },
  p1_36: { module: pwmModules.ehrpwm0, channel: 0 },
  p2_1: { module: pwmModules.ehrpwm1, channel: 0 },
  p2_3: { module: pwmModules.ehrpwm2, channel: 1 }
};

module.exports = [
  /* P1_1: VIN */
  { ids: ['P1_2', 'GPIO87'], gpioNo: 87, modes: [0, 1], custom: { id: 'P1_02' } },
  /* P1_3: USB1-V_EN */
  { ids: ['P1_4', 'GPIO89'], gpioNo: 89, modes: [0, 1], custom: { id: 'P1_04' } },
  /* P1_5: USB1-VBUS */
  { ids: ['P1_6', 'GPIO5'], gpioNo: 5, modes: [0, 1], custom: { id: 'P1_06' } },
  /* P1_7: USB1-VIN */
  { ids: ['P1_8', 'GPIO2'], gpioNo: 2, modes: [0, 1], custom: { id: 'P1_08' } },
  /* P1_9: USB1-DN */
  { ids: ['P1_10', 'GPIO3'], gpioNo: 3, modes: [0, 1], custom: { id: 'P1_10' } },
  /* P1_11: USB1-DP */
  { ids: ['P1_12', 'GPIO4'], gpioNo: 4, modes: [0, 1], custom: { id: 'P1_12' } },
  /* P1_13: USB1-ID */
  /* P1_14: 3.3V */
  /* P1_15: USB1-GND*/
  /* P1_16: GND */
  /* P1_17: AIN-VREF- */
  /* P1_18: AIN-VREF+ */
  { ids: ['P1_19', 'A0'], analogChannel: 0, modes: [2], custom: { id: 'P1_19' } },
  { ids: ['P1_20', 'GPIO20'], gpioNo: 20, modes: [0, 1], custom: { id: 'P1_20' } },
  { ids: ['P1_21', 'A1'], analogChannel: 1, modes: [2], custom: { id: 'P1_21' } },
  /* P1_22: GND */
  { ids: ['P1_23', 'A2'], analogChannel: 2, modes: [2], custom: { id: 'P1_23' } },
  /* P1_24: VOUT-5V */
  { ids: ['P1_25', 'A3'], analogChannel: 3, modes: [2], custom: { id: 'P1_25' } },
  { ids: ['P1_26', 'GPIO12'], gpioNo: 12, modes: [0, 1], custom: { id: 'P1_26' } },
  { ids: ['P1_27', 'A4'], analogChannel: 4, modes: [2], custom: { id: 'P1_27' } },
  { ids: ['P1_28', 'GPIO13'], gpioNo: 13, modes: [0, 1], custom: { id: 'P1_28' } },
  { ids: ['P1_29', 'GPIO117'], gpioNo: 117, modes: [0, 1], custom: { id: 'P1_29' } },
  { ids: ['P1_30', 'GPIO43'], gpioNo: 43, modes: [0, 1], custom: { id: 'P1_30' } },
  { ids: ['P1_31', 'GPIO114'], gpioNo: 114, modes: [0, 1], custom: { id: 'P1_31' } },
  { ids: ['P1_32', 'GPIO42'], gpioNo: 42, modes: [0, 1], custom: { id: 'P1_32' } },
  { ids: ['P1_33', 'GPIO111'], gpioNo: 111, modes: [0, 1, 3, 4], custom: { id: 'P1_33', pwm: pwmPins.p1_33 } },
  { ids: ['P1_34', 'GPIO26'], gpioNo: 26, modes: [0, 1], custom: { id: 'P1_34' } },
  { ids: ['P1_35', 'GPIO88'], gpioNo: 88, modes: [0, 1], custom: { id: 'P1_35' } },
  { ids: ['P1_36', 'GPIO110'], gpioNo: 110, modes: [0, 1, 3, 4], custom: { id: 'P1_36', pwm: pwmPins.p1_36 } },

  { ids: ['P2_1', 'GPIO50'], gpioNo: 50, modes: [0, 1, 3, 4], custom: { id: 'P2_01', pwm: pwmPins.p2_1 } },
  { ids: ['P2_2', 'GPIO59'], gpioNo: 59, modes: [0, 1], custom: { id: 'P2_02' } },
  { ids: ['P2_3', 'GPIO23'], gpioNo: 23, modes: [0, 1, 3, 4], custom: { id: 'P2_03', pwm: pwmPins.p2_3 } },
  { ids: ['P2_4', 'GPIO58'], gpioNo: 58, modes: [0, 1], custom: { id: 'P2_04' } },
  { ids: ['P2_5', 'GPIO30'], gpioNo: 30, modes: [0, 1], custom: { id: 'P2_05' } },
  { ids: ['P2_6', 'GPIO57'], gpioNo: 57, modes: [0, 1], custom: { id: 'P2_06' } },
  { ids: ['P2_7', 'GPIO31'], gpioNo: 31, modes: [0, 1], custom: { id: 'P2_07' } },
  { ids: ['P2_8', 'GPIO60'], gpioNo: 60, modes: [0, 1], custom: { id: 'P2_08' } },
  { ids: ['P2_9', 'GPIO15'], gpioNo: 15, modes: [0, 1], custom: { id: 'P2_09' } },
  { ids: ['P2_10', 'GPIO52'], gpioNo: 52, modes: [0, 1], custom: { id: 'P2_10' } },
  { ids: ['P2_11', 'GPIO14'], gpioNo: 14, modes: [0, 1], custom: { id: 'P2_11' } },
  /* P2_12: PWR-BTN */
  /* P2_13: VOUT */
  /* P2_14: BAT-VIN */
  /* P2_15: GND */
  /* P2_16: BAT-TEMP */
  { ids: ['P2_17', 'GPIO65'], gpioNo: 65, modes: [0, 1], custom: { id: 'P2_17' } },
  { ids: ['P2_18', 'GPIO47'], gpioNo: 47, modes: [0, 1], custom: { id: 'P2_18' } },
  { ids: ['P2_19', 'GPIO27'], gpioNo: 27, modes: [0, 1], custom: { id: 'P2_19' } },
  { ids: ['P2_20', 'GPIO64'], gpioNo: 64, modes: [0, 1], custom: { id: 'P2_20' } },
  /* P2_21: GND */
  { ids: ['P2_22', 'GPIO46'], gpioNo: 46, modes: [0, 1], custom: { id: 'P2_22' } },
  /* P2_23: 3.3V */
  { ids: ['P2_24', 'GPIO44'], gpioNo: 44, modes: [0, 1], custom: { id: 'P2_24' } },
  { ids: ['P2_25', 'GPIO41'], gpioNo: 41, modes: [0, 1], custom: { id: 'P2_25' } },
  /* P2_26: NRST */
  { ids: ['P2_27', 'GPIO40'], gpioNo: 40, modes: [0, 1], custom: { id: 'P2_27' } },
  { ids: ['P2_28', 'GPIO116'], gpioNo: 116, modes: [0, 1], custom: { id: 'P2_28' } },
  { ids: ['P2_29', 'GPIO7'], gpioNo: 7, modes: [0, 1], custom: { id: 'P2_29' } },
  { ids: ['P2_30', 'GPIO113'], gpioNo: 113, modes: [0, 1], custom: { id: 'P2_30' } },
  { ids: ['P2_31', 'GPIO19'], gpioNo: 19, modes: [0, 1], custom: { id: 'P2_31' } },
  { ids: ['P2_32', 'GPIO112'], gpioNo: 112, modes: [0, 1], custom: { id: 'P2_32' } },
  { ids: ['P2_33', 'GPIO45'], gpioNo: 45, modes: [0, 1], custom: { id: 'P2_33' } },
  { ids: ['P2_34', 'GPIO115'], gpioNo: 115, modes: [0, 1], custom: { id: 'P2_34' } },
  { ids: ['P2_35', 'GPIO86'], gpioNo: 86, modes: [0, 1], custom: { id: 'P2_35' } },
  //{ ids: ['P2_36', 'A7'], analogChannel: 7, modes: [2], custom: { id: 'P2_36' } }, // Doesn't appear to work

  { ids: ['USR0'], ledPath: '/sys/class/leds/beaglebone:green:usr0', modes: [1] },
  { ids: ['USR1'], ledPath: '/sys/class/leds/beaglebone:green:usr1', modes: [1] },
  { ids: ['USR2'], ledPath: '/sys/class/leds/beaglebone:green:usr2', modes: [1] },
  { ids: ['USR3'], ledPath: '/sys/class/leds/beaglebone:green:usr3', modes: [1] }
];

