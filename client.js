console.log('hello from woven-client');

const options = require('./src/options');
const optimal = require('./src/optimal');
const Pool = require('./src/Pool').Pool; // does this need to reference options object? only time will tell
const WorkerTask = require('./src/Pool').WorkerTask;
const connect = require('./src/connect')(optimal, Pool);
const run = require('./src/run')(optimal, WorkerTask);

let instance;

module.exports = function Woven() {
  if (!instance) {
    instance = {
      connect,
      run,
      WorkerTask,
    }
  }
  return instance;
}