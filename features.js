// in server.js:

const woven = require('woven-js');
const wovenOptions = { // defaults
  clientOnly: false,
  serverOnly: false,
  defaultThreads: 4,
} // what else?

woven.config(__dirname + 'functions.js', wovenOptions);

// in App.js:

import woven from 'woven-js';

woven.run('functionName', payload)
  // woven runs the function on the client or server depending on config
  .then(wovenOutput => {
    return wovenOutput;
  });