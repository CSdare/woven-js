/**
 * 
 * @param {Object} options - options object that will be configured in server.js file by developer
 * @param {Object} optimal - optimal computing location (optimal.location) and thread number 
 *                     (optimal.threads) based on client optimization function
 */

module.exports = function runWrapper(options, optimal, WorkerTask) {
 
  /**
   * @param {string} funcName: string referring to name of a function in functions.js
   * @param {Object} payload: arguments to be passed into the function
   */
  
  return function run(funcName, payload) {
    
    if (options.alwaysClient || (optimal.location === 'client' && !options.alwaysServer)) {
      return new Promise((resolve, reject) => {
        function workerCallback(output) {
          resolve(output);
        }
        const workerTask = new WorkerTask(funcName, payload, workerCallback);
        options.pool.addWorkerTask(workerTask);
      });
    } else if (options.alwaysServer || optimal.location === 'server') {
      return fetch('/__woven__', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funcName, payload }),
      })
      .then(res => res.json())
    }
  }
}
