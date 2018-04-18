const { ChildTask } = require('./ChildPool');

module.exports = function optimizeWrapper(options) {
  return async function optimize(req, res, next) {
    // woven.connect function makes GET request to this route:
    if (req.url === '/__woven_first__') {
      if (options.alwaysClient === true) {
        res.json({
          alwaysClient: true,
          alwaysServer: false,
          ping: null,
        });
      } else if (options.alwaysServer === true) {
        res.json({
          alwaysClient: false,
          alwaysServer: true,
          ping: null,
        });
      } else {
        res.json({
          alwaysClient: false,
          alwaysServer: false,
          dynamicMax: options.dynamicMax,
          ping: options.stringPing,
          maxThreads: options.maxThreads,
          fallback: options.fallback,
        });
      }

    // woven.run makes POST request to this route:
    } else if (req.url === '/__woven__') {
      // await resolution of promise -- will resolve once child process pool finishes task
      const output = await new Promise((resolve, reject) => {
        const callback = data => resolve(data);
        const errorCallback = err => reject(err);
        // create new ChildTask to add to pool
        const childTask = new ChildTask(
          req.body.funcName,
          req.body.payload,
          callback,
          errorCallback,
        );
        // add created childTask to child process pool
        options.pool.addChildTask(childTask);
      });

      res.json(output);
    } else next();
  };
};
