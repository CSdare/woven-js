module.exports = function configureWrapper(options) {
  
  return function configure(functionsPath, userOptions) {
    options.functionsPath = functionsPath;
    options.functions = require(options.functionsPath);
    for (field in userOptions) {
      console.log(field, userOptions[field]);
      if (options.hasOwnProperty(field)) {
        // include code here to test if the type of data passed in is correct for the field
        options[field] = userOptions[field];
        console.log(options);
      }
      else return new Error(`${field} is not a configurable option.`);
    }
  }
}