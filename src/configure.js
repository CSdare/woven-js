const fs = require('fs');

module.exports = function configureWrapper(options) {
  
  return function configure(functions, userOptions) {

    if (typeof functions !== 'Object') {
      return new Error(`${functions} must be an export object.`);
    } 

    options.functions = functions;

    //add a check for the 'devServer' options object property...!
    for (let field in userOptions) {
      if (options.hasOwnProperty(field)) {
        if (field === 'pingSize') {
          if (typeof userOptions[field] !== 'Number') {
            return new Error(`${field} - incorrect data type.`);
          }
        } else if (field === 'stringPing') {
          if (typeof userOptions[field] !== 'String') {
            return new Error(`${field} - incorrect data type.`);
          }
        } else if (field === 'responseSpeed') {
          if (typeof userOptions[field] !== 'Number') {
            return new Error(`${field} - incorrect data type.`);
          }
        } else if (field === 'transferSpeed') {
          if (typeof userOptions[field] !== 'Number') {
            return new Error(`${field} - incorrect data type.`);
          }
        } else if (field === 'maxThreads') {
          if (typeof userOptions[field] !== 'Number') {
            return new Error(`${field} - incorrect data type.`);
          }
        } else if(field === 'alwaysClient') {
          if (typeof userOptions[field] !== 'Boolean') {
            return new Error(`${field} - incorrect data type.`);
          }
        } else if (field === 'alwaysServer') {
          if (typeof userOptions[field] !== 'Boolean') {
            return new Error(`${field} - incorrect data type.`);
          }

        } else if (field === 'functions') {
            return new Error(`Use first argument of configure function to assign ${field}.`);
        } else if (field === 'fallback') {
          if (typeof userOptions[field] !== 'String') {
            return new Error(`${field} - incorrect data type.`);
          }
        options[field] = userOptions[field];
      } else return new Error(`${field} is not a configurable option`);
    }
    pingCheck(options);
  }
}

//options for dynamicPing size:
const pingOptions = {
  tiny: 100,
  small: 4000,
  default: 50000,
  large: 400000,
  huge: 1000000000
}

//first check if the ping data already exists &&
//whether it is the right size according to preferences...
function pingCheck(options) {
  if (options.stringPing !== null) {
    let preferredPingSize = options.pingSize;
    let currentPingSize = options.stringPing/2;
    //if file size doesn't match preferences, remove it and build new ping that does
    if (preferredPingSize !== currentPingSize) {
      options.stringPing = null;
      buildPing(options.pingSize);
    } else console.log('ping size matches dev preferences!');
  } else buildPing(options.pingSize);
}

//function to generate ping according to data size preferences:
function buildPing(pingSize) {
  let stringPing = '';
  let possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < pingSize/2; i++) {
    stringPing += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  options.stringPing = stringPing;
}