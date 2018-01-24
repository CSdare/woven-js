
/**
 * 
 */

// questions:
// do we need to require in the options.js file and the optimal.js file??
// /_woven_first__' => '/_woven_' => server-side process:

module.exports = function optimizeWrapper(options) {
  return function optimize(req, res, next) {
    let basicPingMark;
  
    if (req.url === '/__woven_first__') {
      //handling for developer overrides
      if (options.alwaysClient === true){
        res.json({alwaysClient: true, ping: null});
      } else if(options.alwaysServer === true){
        res.json({alwaysServer: true, ping: null});
      } else{
        pingTime = Date.now();
        startingMark = Date.now();
        res.json({responseMin: options.responseMin, transferMin: options.transferMin, pingResolution: pingTime, startDynamicPing: startingMark, ping: options.stringPing});
      }
    //recieving route for run() function calls where server is the optimal location
    } else if (req.url === '/__woven__') {
      const output = options.functions[req.body.funcName](req.body.payload);
      res.json(output);
    }
    else next();
  }
}