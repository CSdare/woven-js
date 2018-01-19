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
        } else if (field === 'defaults') {
          return new Error(`${field} is not a configurable option.`);
        }
        options[field] = userOptions[field];
      } else return new Error(`${field} is not a configurable option`);
    }
    pingCheck(options);
  }
}

//first check if the ping data already exists &&
//whether it is the right size according to preferences...
function pingCheck(options) {
  if (options.stringPing !== null) {
    let preferredPingSize = options.pingSize;
    let currentPingSize = 0;

    //to check file size against expected...
    fs.stat('./pingdata.txt', function(error, stats) {
      currentPingSize = stats.size;
    });

    //if file size doesn't match preferences, remove it and build new ping that does
    if (preferredPingSize !== currentPingSize) {
      fs.unlink('pingdata.txt', function (err) {
        if (err) console.log('error with deleting ping file');
        console.log('Ping data file deleted!');
      });
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
  
  fs.appendFile('pingdata.txt', stringPing, function (err) {
    if (err) console.log('error with creating ping file');
    console.log('Saved!');
  });
//need to assign the path to new ping file to options.stringPing...HALP?
  options.stringPing = './pingdata.txt';
}