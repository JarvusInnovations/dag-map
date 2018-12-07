"use strict";
const DAG_LAST = require("dag-map");
const DAG_DEV = require("../dag-map.umd");
const fs = require("fs");

function print(msg) {
  fs.writeSync(process.stdout.fd, msg + "\n");
}

const DATA = JSON.parse(fs.readFileSync(__dirname + "/data.json", "utf8"));

print("RELEASE");
runTest(DAG_LAST);
print("DEV");
runTest(DAG_DEV);

function runTest(DAG) {
  function createMap() {
    return new DAG.default();
  }

  function addKeys(map, data) {
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      map.add(row.key, row.value, row.before, row.after);
    }
  }

  function measure(cb) {
    var s = Date.now();
    cb();
    print(Date.now() - s + "ms");
  }

  var map;

  measure(function() {
    map = createMap();
    addKeys(map, DATA["set1"]);
    map.each(k => {});
  });

  measure(function() {
    var c = 100000;
    while (c--) {
      map = createMap();
      addKeys(map, DATA["set2"]);
      map.each(k => {});
    }
  });
}
