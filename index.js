console.log('hello from woven');

const options = require('./src/options');
const configure = require('./src/configure')(options);
const optimize = require('./src/optimize')(options);

module.exports = { configure, optimize };
