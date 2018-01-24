module.exports = function connectWrapper(optimal, Pool, performance) {

  return function connect(workerFile) {
    
    const pingMarkerClient = Date.now();

    fetch('/__woven_first__', {
      method: 'GET', 
    })
    .then(res => res.json())
    .then(data => {
      const clientData = {
        responseSpeed: data.pingMarkerServer - pingMarkerClient,
        dynamicSpeed: Date.now() - data.pingMarkerServer,
        userAgent: navigator.userAgent, // risky
        networkSpeed: null,
        threads: navigator.hardwareConcurrency,
        browser: null,
        missingDeviceInfo: false,
        responseMin: data.responseMin,
        dynamicMin: data.dynamicMin,
        pingMarkerServer: data.pingMarkerServer,
        maxThreads: data.maxThreads,
        fallback: data.fallback,
        alwaysClient: data.alwaysClient,
      }
      optimal.serverDefaults = false;
      if (data.alwaysServer === true) {
        optimal.location = 'server';
        optimal.clientDefaults = false;
        return;
      } else if (data.alwaysClient === true) {
        optimal.location = 'client';
        clientData.alwaysClient = true;
        performance(clientData, optimal);
        optimal.clientDefaults = false;
      } else {
        performance(clientData, optimal);
        optimal.clientDefaults = false;
      }
      if (optimal.location === null) optimal.location = data.fallback;
      if (optimal.location === 'client') {
        optimal.pool = new Pool(optimal.threads, workerFile);
        optimal.pool.init();
      }
    });
  }
}
