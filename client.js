console.log('hello from woven-client');

const options = require('./src/options');
const optimal = require('./src/optimal');
const connect = require('./src/connect')(options);
const run = require('./src/run')(options, optimal);

module.exports = { connect, run };
