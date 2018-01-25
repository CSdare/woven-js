//options for dynamicPing size/bytes:
const pingOptions = {
  tiny: 100,
  small: 4000,
  medium: 50000,
  large: 400000,
  huge: 1000000
}

module.exports = function configureWrapper(options, optimal) {
  
  return function configure(functions, userOptions) {
    
    if (arguments.length === 0) throw new Error('configure requires a functions argument');

    if (typeof functions !== 'object') {
      throw new Error(`${functions} must be an export object.`);
    }

    options.functions = functions;
    //add a check for the 'devServer' options object property...!
    for (let field in userOptions) {
      switch (field) {
        case 'alwaysClient':
          if (typeof userOptions[field] !== 'boolean') throw new Error(`${field} - incorrect data type.`);
          options.alwaysServer = false;
          break;
        case 'alwaysServer':
          if (typeof userOptions[field] !== 'boolean') throw new Error(`${field} - incorrect data type.`);
          options.alwaysClient = false;
          break;
        case 'dynamicMax':
          if (typeof userOptions[field] !== 'number') throw new Error(`${field} - incorrect data type.`);
          break;
        case 'fallback':
          if (userOptions[field] !== 'server' && userOptions[field] !== 'client') throw new Error(`${field} - incorrect data type.`);
          break;
        case 'functions':
          throw new Error(`Set functions in first argument of configure function.`);
          break;
        case 'maxThreads':
          if (typeof userOptions[field] !== 'number') throw new Error(`${field} - incorrect data type.`);
          break;
        case 'pingSize':
          if (typeof userOptions[field] !== 'number' && !pingOptions.hasOwnProperty(userOptions[field])) throw new Error(`${field} - incorrect data type.`);
          if (userOptions[field] > 10000000) throw new Error('pingSize is too large; should be 10M bytes or less');
          break;
        case 'stringPing':
          throw new Error(`${field} is not a configurable option`);
          break;
        default:
          throw new Error(`${field} is not a configurable option`);
      }
      options[field] = userOptions[field];
    }
    pingCheck(options);
  }
}

//first check if the ping data already exists &&
//whether it is the right size according to preferences...
function pingCheck(options) {
  if (typeof options.pingSize === 'string') {
    options.pingSize = pingOptions[options.pingSize];
  }
  if (options.stringPing !== null) {
    const preferredPingSize = options.pingSize;
    const currentPingSize = options.stringPing.length * 2;
    //if file size doesn't match preferences, remove it and build new ping that does
    if (preferredPingSize !== currentPingSize) {
      options.stringPing = '';
      buildPing(options.pingSize, options);
    }
  } else buildPing(options.pingSize, options);
}

//function to generate ping according to data size preferences:
function buildPing(pingSize, options) {
  let stringPing = '';
  let possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < pingSize / 2; i++) {
    stringPing += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  options.stringPing = stringPing;
  // console.log(options.stringPing);
}
