/**
 * Sift Mqtt. DAG's 'Classify' node implementation
 */
'use strict';

// Entry point for DAG node
module.exports = function (got) {
  const inData = got['in'];
  const query = got['query'];
  
  let key = query[0];
  let len = inData.data.length

  console.log('sift-mqtt: count.js: running...', key, len);
  
  return { key: key, value: ''+len };
};
