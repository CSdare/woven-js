const { getOptions } = require('loader-utils');

module.exports = function(source, map) {
  const options = getOptions(this);
  source = source.replace(/dog/g, options.animal);
  source = source.replace(/woof/g, options.saying);
  this.callback(null, source, map);
};