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

    console.log('sift-mqtt: classify.js: got:', k, o.param);
    return [
      { name: 'last', key: 'VALUE', value: o.param },
      { name: 'category', key: (parseInt(o.param) < 50 ? 'under/' : 'over/') + k, value: o.param }
    ];
  });
};
