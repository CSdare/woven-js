
// in server.js:

const woven = require('woven-js');

const wovenOptions = { // defaults
  clientOnly: false,
  serverOnly: false,
  avgDataPing: 0,
  defaultThreads: 4,
}

// set config pointing to file of tools/functions
// optional options object passed in to set defaults
woven.config(__dirname + 'functions.js', wovenOptions);

app.use(woven.optimize);

// in App.js:

import woven from 'woven-js';

woven.run('functionName', payload)
  // woven runs the function on the client or server depending on config
  .then(wovenOutput => {
    return wovenOutput;
  });