const os = require('os');

module.exports = {
  alwaysClient: false,
  alwaysServer: false,
  dynamicMax: 500,
  execSyncFilePath: '',
  fallback: 'server',
  functions: null,
  maxChildThreads: os.cpus().length,
  maxWorkerThreads: 12,
  pingSize: 100,
  stringPing: null,
  useChildProcess: true,
  useWebWorkers: true,
  writeFileSync: false,
};
