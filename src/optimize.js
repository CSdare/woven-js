const { execSync } = require('child_process');
const { ChildTask } = require('./ChildPool');

module.exports = function optimizeWrapper(options) {
  return async function optimize(req, res, next) {
    // woven.connect function makes GET request to this route:
    if (req.url === '/__woven_first__') {
      if (options.alwaysClient === true) {
        return res.json({
          alwaysClient: true,
          alwaysServer: false,
          ping: null,
        });
      } else if (options.alwaysServer === true) {
        return res.json({
          alwaysClient: false,
          alwaysServer: true,
          ping: null,
        });
      }
      return res.json({
        alwaysClient: false,
        alwaysServer: false,
        dynamicMax: options.dynamicMax,
        ping: options.stringPing,
        maxWorkerThreads: options.maxWorkerThreads,
        fallback: options.fallback,
        useWebWorkers: options.useWebWorkers,
      });

    // woven.run makes POST request to this route:
    } else if (req.url === '/__woven__') {
      const { funcName, payload } = req.body;
      let output;
      if (options.useChildProcess) {
      // await resolution of promise -- will resolve once child process pool finishes task
        output = await new Promise((resolve, reject) => {
          const callback = data => resolve(data);
          const errorCallback = err => reject(err);
          // create new ChildTask to add to pool
          const childTask = new ChildTask(
            funcName,
            payload,
            callback,
            errorCallback,
          );
          // add created childTask to child process pool
          options.pool.addChildTask(childTask);
        });
      } else {
        // synchronous processing using execSync method of child_process
        const buffer = execSync(`node ${options.execSyncFilePath} ${funcName} ${JSON.stringify(payload)}`);
        output = JSON.parse(buffer.toString()).data;
      }
      return res.json(output);
    }
    return next();
  };
};
