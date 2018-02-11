module.exports = function optimizeWrapper(options) {
  return function optimize(req, res, next) {
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
      const output = options.functions[req.body.funcName](...req.body.payload);
      res.json(output);
    } else next();
  };
};
