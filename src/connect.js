module.exports = function connectWrapper(optimal, Pool, performance) {
  return function connect(WorkerFile) {
    const pingMarkerClient = Date.now();
    fetch('/__woven_first__', {
      method: 'GET',
    }).then(res => res.json())
      .then((data) => {
        const clientData = {
          dynamicSpeed: Date.now() - pingMarkerClient,
          userAgent: navigator.userAgent, // risky
          networkSpeed: null,
          threads: navigator.hardwareConcurrency,
          browser: null,
          missingDeviceInfo: false,
          dynamicMax: data.dynamicMax,
          maxThreads: data.maxThreads,
          fallback: data.fallback,
          alwaysClient: data.alwaysClient,
        };
        optimal.serverDefaults = false;
        if (data.alwaysServer === true || !window.Worker) {
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
          optimal.pool = new Pool(optimal.threads, WorkerFile);
          optimal.pool.init();
        }
      });
  };
};
