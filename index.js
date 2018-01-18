console.log('hello from woven');

const options = require('./src/options');
const optimal = require('./src/optimal');
const run = require('./src/run')(options, optimal);
const configure = require('./src/configure')(options);
const optimize = require('./src/optimize')(options);
const connect = require('./src/connect')(options);

module.exports = { run, optimize, configure, connect }