const fs = require('fs');

const { ChildPool } = require('./ChildPool');

// options for dynamicPing size/bytes:
const pingOptions = {
  tiny: 100,
  small: 4000,
  medium: 50000,
  large: 400000,
  huge: 1000000,
};

// function to generate ping according to data size preferences:
function buildPing(pingSize, options) {
  let stringPing = '';
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < pingSize / 2; i += 1) {
    stringPing += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  options.stringPing = stringPing;
}

// check if the ping data already exists & whether it is the right size according to preferences...
function pingCheck(options) {
  if (typeof options.pingSize === 'string') {
    options.pingSize = pingOptions[options.pingSize];
  }
  if (options.stringPing !== null) {
    const preferredPingSize = options.pingSize;
    const currentPingSize = options.stringPing.length * 2;
    // if file size doesn't match preferences, remove it and build new ping that does
    if (preferredPingSize !== currentPingSize) {
      options.stringPing = '';
      buildPing(options.pingSize, options);
    }
  } else buildPing(options.pingSize, options);
}

module.exports = function configureWrapper(options) {
  return function configure(functionsPath, userOptions = {}) {
    // checks to make sure functionsPath argument is correct
    if (arguments.length === 0) throw new Error('configure requires a functions filepath argument');
    if (typeof functionsPath !== 'string') {
      throw new Error(`${functionsPath} must be an absolute filepath string.`);
    }

    // configure using passed in options object, testing for correct data types
    Object.keys(userOptions).forEach((field) => {
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
        case 'functionsPath':
          throw new Error('Set functions filepath in first argument of configure function.');
        case 'maxChildThreads':
          if (typeof userOptions[field] !== 'number') throw new Error(`${field} - incorrect data type.`);
          break;
        case 'maxWorkerThreads':
          if (typeof userOptions[field] !== 'number') throw new Error(`${field} - incorrect data type.`);
          break;
        case 'pingSize':
          if (typeof userOptions[field] !== 'number' && !(userOptions[field] in pingOptions)) throw new Error(`${field} - incorrect data type.`);
          if (userOptions[field] > 10000000) throw new Error('pingSize is too large; should be 10M bytes or less');
          break;
        case 'useChildProcess':
          if (typeof userOptions[field] !== 'boolean') throw new Error(`${field} - incorrect data type.`);
          break;
        case 'useWebWorkers':
          if (typeof userOptions[field] !== 'boolean') throw new Error(`${field} - incorrect data type.`);
          break;
        case 'writeFileSync':
          if (typeof userOptions[field] !== 'boolean') throw new Error(`${field} - incorrect data type.`);
          break;
        default:
          throw new Error(`${field} is not a configurable option`);
      }
      options[field] = userOptions[field];
    });

    // create path for woven child process file and exec sync file
    const childProcessFilePath = `${functionsPath.slice(0, -3)}_woven_child_process.js`;
    const execSyncFilePath = `${functionsPath.slice(0, -3)}_woven_exec_sync.js`;

    // string to append to woven_child_process file
    const childProcessFileString = `const functions = require('${functionsPath}');
process.on('message', (msg) => {
  const data = functions[msg.funcName](...msg.payload);
  process.send({ data });
});`;

    const execSyncFileString = `const functions = require('${functionsPath}');
const funcName = process.argv[2];
const payload = JSON.parse(process.argv[3]);
const data = functions[funcName](...payload);
process.stdout.write(JSON.stringify({ data }));
`;

    // write the child process file
    if (options.writeFileSync) {
      fs.writeFileSync(childProcessFilePath, childProcessFileString);
    } else {
      fs.writeFile(childProcessFilePath, childProcessFileString, (error) => {
        if (error) console.error('error writing child process file');
      });
    }

    // set execSyncFilePath for reference later
    options.execSyncFilePath = execSyncFilePath;
    // write the execSync file
    if (options.writeFileSync) {
      fs.writeFileSync(execSyncFilePath, execSyncFileString);
    } else {
      fs.writeFile(execSyncFilePath, execSyncFileString, (error) => {
        if (error) console.error('error writing exec file sync file');
      });
    }

    // initialize new ChildPool stored on options object
    options.pool = new ChildPool(options.maxChildThreads, childProcessFilePath);
    options.pool.init();

    // create ping if necessary
    pingCheck(options);
  };
};
