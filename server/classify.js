/**
 * Sift Mqtt. DAG's 'Classify' node implementation
 */
'use strict';

let i = 0;

// Entry point for DAG node
module.exports = function (got) {
  //TODO: SDK hack
  i = i + 1;

  const inData = got['in'];

  console.log('sift-mqtt: classify.js: running...');

  return inData.data.map(function (datum) {
    let k = i; // datum.key
    let o = JSON.parse(datum.value);
    let v = parseInt(o.param);

    if (isNaN(v)) {
      console.error('sift-mqtt: classify.js:', o.param, 'is not a number');
      return null;
    } else {
      console.log('sift-mqtt: classify.js: ok:', k, v);
      return [
        { name: 'last', key: 'VALUE', value: o.param },
        { name: 'category', key: (v >= 50 ? 'over/' : 'under/') + k, value: o.param }
      ];
    }
  });
};
