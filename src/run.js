/**
 *
 * @param {Object} optimal - optimal computing location (optimal.location) and thread number
 *                     (optimal.threads) based on client optimization function
 */

module.exports = function runWrapper(optimal, WorkerTask) {
  return function run(funcName, ...payload) {
    // use Web Worker pool if processing will be done on client
    if (optimal.location === 'client') {
      return new Promise((resolve, reject) => {
        function workerCallback(output) {
          resolve(output);
        }
        function errorCallback(error) {
          reject(error);
        }
        const workerTask = new WorkerTask(funcName, payload, workerCallback, errorCallback);
        optimal.pool.addWorkerTask(workerTask);
      });
    // POST request to server if processing will be done on server
    } else if (optimal.location === 'server') {
      return fetch('/__woven__', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funcName, payload }),
      }).then(res => res.json());
    }
  };
};
