console.log('hello from woven');

const options = require('./src/options');
const optimal = require('./src/optimal');
const configure = require('./src/configure')(options, optimal);
const optimize = require('./src/optimize')(options);

module.exports = { configure, optimize };
