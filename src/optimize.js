module.exports = function optimizeWrapper(options) {

  return function optimize(req, res, next) {
  
    if (req.url === '/__woven_first__') {
      //handling for developer overrides
      if (options.alwaysClient === true) {
        res.json({
          alwaysClient: true,
          alwaysServer: false,
          ping: null
        });
      } else if(options.alwaysServer === true) {
        res.json({
          alwaysClient: false,
          alwaysServer: true,
          ping: null
        });
      } else {
        const pingMarkerServer = Date.now();
        res.json({
          alwaysClient: false,
          alwaysServer: false,
          responseMin: options.responseMin,
          dynamicMin: options.dynamicMin,
          pingMarkerServer: pingMarkerServer,
          ping: options.stringPing,
          maxThreads: options.maxThreads,
          fallback: options.fallback,
        });
      }

    //recieving route for run() function calls where server is the optimal location
    } else if (req.url === '/__woven__') {
      const output = options.functions[req.body.funcName](req.body.payload);
      res.json(output);
    }
    else next();
  }
}