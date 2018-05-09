const { expect } = require('chai');
const woven = require('../../index');
const path = require('path');

const functionsPath = path.resolve(__dirname, '../util/functions.js');

// want to test number of child processes being run and whether execSync
// or pool.addChildTask is called


