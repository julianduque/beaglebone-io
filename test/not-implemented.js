var BeagleBone = require("../lib/beaglebone");
var sinon = require("sinon");
var title = "Not Implemented";

exports[title] = {};

[
  "pulseIn",
  "pulseOut",
  "queryPinState",
  "_sendOneWireRequest",
  "_sendOneWireSearch",
  "sendOneWireWriteAndRead",
  "sendOneWireDelay",
  "sendOneWireDelay",
  "sendOneWireReset",
  "sendOneWireRead",
  "sendOneWireSearch",
  "sendOneWireAlarmsSearch",
  "sendOneWireConfig",
  "stepperConfig",
  "stepperStep"
].forEach(function(method) {
  exports[title][method] = function(test) {
    test.expect(2);
    test.ok(BeagleBone.prototype[method]);
    test.throws(function() {
      BeagleBone.prototype[method].call({});
    });
    test.done();
  };
});
