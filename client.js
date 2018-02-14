const optimal = require('./src/optimal');
const { Pool } = require('./src/Pool'); // does this need to reference options object? only time will tell
const { WorkerTask } = require('./src/Pool');
const performance = require('./src/performance');
const getLocation = require('./src/getLocation')(optimal);
const connect = require('./src/connect')(optimal, Pool, performance);
const run = require('./src/run')(optimal, WorkerTask);

let instance;

module.exports = function Woven() {
  if (!instance) {
    instance = {
      connect,
      run,
      getLocation,
    };
  }
  return instance;
};
