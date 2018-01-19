
/**
 * 
 */

module.exports = function optimizeWrapper(options) {
  return function optimize(req, res, next) {
    
    if (req.url === '/__woven_first__') {
      // compare options from server with options on client side
      // need to be more specific about which options are sent
      options.defaults = false;
      console.log('back end options before sending:', options);
      res.json(options);
    }

    else if (req.url === '/__woven__') {
      console.log('got to optimize');
      const output = options.functions[req.body.funcName](req.body.payload);
      res.json(output);
    }
    else next();
  }
}

