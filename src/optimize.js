
/**
 * 
 */

// require in the options.js file and the optimal.js file??


// /_woven_first__' => '/_woven_' => server-side process:

module.exports = function optimizeWrapper(options) {
  return function optimize(req, res, next) {
    
    if (req.url === '/__woven_first__') {

    // no "client only"/"server only" setting ---> Woven will evaluate 
    // the most performant process using runOptimization()
    if(options.alwaysClient === false && options.alwaysServer === false){
        combinedOptimization(options,);
    }
      options.defaults = false;
      console.log('developer options before sending:', options);
      res.json(options);
    }

    //"client only" -- run threadCheck(), update options obj, always route to client
    if (options.alwaysClient === true){
      threadCheck(clientinfo.cores, clientinfo.browser);
      optimal.location = "client";
    //"server only" -- always route to sever functionality
    }else if(options.alwaysServer === true){
      const output = options.functions[req.body.funcName](req.body.payload);
      res.json(output);
    }

    //recieving route for "server only" and server optimal run() function calls
    else if (req.url === '/__woven__') {
      const output = options.functions[req.body.funcName](req.body.payload);
      res.json(output);
    }
    else next();

    //else?
  }
}

//run browser, network, thread, and troubleshoot and update optimal obj
function combinedOptimization(options, clientData, optimal){
  browserCheck(clientData);
  networkCheck(options,clientData);
  threadCheck();


  //browserCheck()
  //differentiate client's primary browser from secondary browser sessions
  function browserCheck(clientData) {
    let browserOptions = ['Chrome', 'Firefox', 'Safari', 'Opera', 'IE'];
    let firstIndex = Infinity;
    let browser = null;
  
    if(clientData.browser === null || undefined){
    //if lacking client browser information from navigator.appName -->  ???
      next();
    }else if (clientData.browser){
    //if browser information is populated, differentiate primary session
      for (let i = 0; i < browserOptions.length; i++) {
        if (clientData.userAgent.includes(browserOptions[i])) {
          let index = clientData.userAgent.indexOf(browserOptions[i]);
          if (index >= 0 && index < firstIndex) {
            firstIndex = index;
            clientData.browser = browserOptions[i];
            next();
          }
        }
      }
    }else{
      next();
    }
  }

  //networkCheck()
  //should extrapolate network quality from both
  //standard ping && dynamic ping...
  function networkCheck(options, clientData){
    if(clientData.ping > options.responseSpeed){
      //if client standard ping is slow
      optimizeData.networkSpeed = false;

    }else if(clientData.dynamicPing > options.transferSpeed){
      //if client dynamic ping is slow
      optimizeData.networkSpeed = false;

    }else if(clientData.dynamicPing === null || undefined){
      //if client dynamic ping did not run properly
      optimizeData.missingDeviceInfo = true;
    }else{
      //both standard ping and dynamic ping are resolve && reasonably fast
      next();
    }
  }

  //threadCheck()
  //check for developer thread # settings
  function threadCheck(options, clientData) {
    let idealThreads = 0;
  
    //determine optimal # and assign
  if(options.threads !== null){
  if (browser === 'Chrome') {
    if (threads > 14) optimal.threads = 14;
      else optimal.threads = threads;
  }
  else if (browser === 'Firefox' || browser === 'Safari') {
    if (threads > 12) optimal.threads = 12;
      else optimal.threads = threads;
  }else if (browser === 'Opera') {
    if (threads > 10) optimal.threads = 10;
      else optimal.threads = threads
  }else if (browser){}
      //add IE and Edge
      else optimal.threads = 4;
  }
  
    
  //bring dev specified thread # down to match browser capacities
  if(options.maxThreads !== null){
    //if dev options exceed recommendations given client browser -->
    //reduce threads to below threshold...
    if(option.maxThreads>idealThreads){
      optimal.threads = idealThreads;
    }else{
      optimal.threads = options.maxThreads;
    }
  }else{
      optimal.threads = idealThreads;
    }
  next();
  }

  function troubleshoot(optimalProcess) {
    if(optimizeData.missingDeviceInfo){
      console.log("Warning: missing client device data");
      optimal.location = options.fallback;


    }else if(optimizeData.networkSpeed === false){
      optimal.location = "client";

    }

  }

  console.log('will be processed here: ', optimal.location);
  return optimal;
}