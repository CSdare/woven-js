const { getOptions } = require('loader-utils');

module.exports = function(source, map) {

  const options = getOptions(this);
  const getExports = new RegExp(/module\.exports+(=|= | = | =)+[\{\}\,\ \w\;]+/);
  let exportedFuncs = [];

  source.replace(getExports, (expString) => {
    const varString = expString.replace(/module\.exports+(=|= | = | =)/, '');
    exportedFuncs = varString.match(/\w+/g);
  });
  
  source = source.replace(getExports, '');
  source = 'onmessage = (e) => {' + source + '};';
  console.log('Exported Funcs =>', exportedFuncs);

  // exportedFuncs.forEach(func => {source += func});
  this.callback(null, source, map);
};