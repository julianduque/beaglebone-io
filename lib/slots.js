'use strict';

var fs = require('fs');

var SLOTS_PATH = '/sys/devices/platform/bone_capemgr/slots',
  FS_OPTIONS = {encoding: 'utf8'};

/**
 * Returns the number of the slot with the specified name. Returns -1 if there
 * is no such slot.
 *
 * name: string // Slot name
 *
 * Returns - number // Slot number or -1
 */
function number(name) {
  var slots = fs.readFileSync(SLOTS_PATH, FS_OPTIONS).split('\n'),
    i;

  name = ',' + name;

  // Search backwards. Added slots are more likely to be at end of slots file.
  for (i = slots.length - 1; i >= 0; i -= 1) {
    if (slots[i].indexOf(name, slots[i].length - name.length) !== -1) {
      return parseInt(slots[i], 10);
    }
  }

  return -1;
}
module.exports.number = number;

/**
 * Adds a slot with the specified name if there is not already a slot with
 * that name. Does nothing if there is already a slot with the specified name.
 *
 * name: string // Slot name
 *
 * Returns - undefined
 *
 * Throws ENOENT Errors if the required device-tree file does not exist in
 * /lib/firmware
 */
module.exports.add = function (name) {
  var slotNumber = number(name);

  if (slotNumber === -1) {
    fs.writeFileSync(SLOTS_PATH, name, FS_OPTIONS);
  }
};

/**
 * Removes the slot with the specified name if there is a slot with that name.
 * Does nothing if there is no such slot.
 *
 * name: string // Slot name
 *
 * Returns - undefined
 */
module.exports.remove = function (name) {
  var slotNumber = number(name);

  if (slotNumber !== -1) {
    fs.writeFileSync(SLOTS_PATH, '' + -slotNumber, FS_OPTIONS);
  }
};

