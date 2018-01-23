
/**
 * 
 */

// questions:
// do we need to require in the options.js file and the optimal.js file??
// /_woven_first__' => '/_woven_' => server-side process:

module.exports = function optimizeWrapper(options) {
  return function optimize(req, res, next) {
    
    if (req.url === '/__woven_first__') {

    // no "client only"/"server only" setting ---> Woven will evaluate 
    // the most performant process using runOptimization()
    if(options.alwaysClient === false && options.alwaysServer === false){
      if(!clientData.dynamicPing){
        sendDynamicPing(options.stringPing);
      }
      combinedOptimization(options, clientData, optimal);
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

//PLACEHOLDER
//client Data storage:
const clientData = {
  pingSpeed: null,
  dynamicSpeed: null,
  browser: null,
  userAgent: null,
  networkSpeed: null,
  threads: null,
  missingDeviceInfo: false
};

//send the dynamic ping string:
function sendDynamicPing(options){
  let start = Date.now();
  res.json(stringPing);
  

};

//run browser, network, thread, and troubleshoot and update optimal obj
function combinedOptimization(options, clientData, optimal){

  browserCheck(clientData);
  networkCheck(options,clientData);
  threadCheck(options, clientData);
  troubleshoot(optimal);

  
  //browserCheck()
  //differentiate client's primary browser from secondary browser sessions
  function browserCheck(clientData) {
    let browserOptions = ['Chrome', 'Firefox', 'Safari', 'Opera', 'IE'];
    let firstIndex = Infinity;
    let browser = null;
  
    if(clientData.browser === null || undefined){
      clientData.missingDeviceInfo = true; 
      next();
    }else if (clientData.browser){
    //if browser information is populated, determine the primary session
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
    if(clientData.pingSpeed > options.responseSpeed){
      //if client standard ping is slow
      clientData.networkSpeed = false;
    }else if(clientData.dynamicSpeed > options.transferSpeed){
      //if client dynamic ping is slow
      clientData.networkSpeed = false;
    }else if(clientData.dynamicPing === null || undefined){
      //if client dynamic ping did not run properly
      clientData.missingDeviceInfo = true;
    }else{
      //both standard ping and dynamic ping are reasonably fast
      next();
    }
  }

  //threadCheck()
  //check for developer thread # settings
  //bring dev specified thread # down to match browser capacities
  function threadCheck(options, clientData) {
    let idealThreads = 0;

  //determine optimal # and assign
  if(options.threads !== null){
  if (clientData.browser === 'Chrome') {
    if (options.maxThreads > 60) optimal.threads = 25;
      else optimal.threads = options.maxThreads;
  }
  else if (clientData.browser === 'Firefox' || browser === 'Safari') {
    if (threads > 20) { 
      optimal.threads = 14;
    } else optimal.threads = threads;
  }else if (clientData.browser === 'Opera') {
    if (threads > 16) optimal.threads = 10;
      else optimal.threads = threads;
  }else if (clientData.browser){}
      //add IE and Edge
      else optimal.threads = 4;
  }
  next();
}

  function troubleshoot(optimal, clientData) {
    const ideals = {
      Chrome: 40,
      Firefox: 20,
      Safari: 16,
      Opera: 16,
      IE: 4,
      Edge: 4
    }
    //if dev options exceed recommendations given client browser -->
    //reduce threads to below threshold...
    if(clientData.missingDeviceInfo === true) {
      console.log("Warning: missing client device data");
      optimal.location = options.fallback;
    }else if(options.maxThreads > ideal[clientData.browser]){
      optimal.threads = ideal[clientData.browser];
    }else{
      optimal.threads = options.maxThreads;
    }
    console.log('will be processed here: ', optimal.location);
    }

  res.json(optimal);
}