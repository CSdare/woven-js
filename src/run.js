/**
 * 
 * @param {Object} options - options object that will be configured in server.js file by developer
 * @param {Object} optimal - optimal computing location (optimal.location) and thread number 
 *                     (optimal.threads) based on client optimization function
 */

module.exports = function runWrapper(options, optimal) {
 
  /**
   * @param {string} funcName: string referring to name of a function in functions.js
   * @param {Object} payload: arguments to be passed into the function
   */

  return function run(funcName, payload) {
    console.log(options);
    // logic to determine if function sould be run on client or server
    // what order to handle logic for running?
    // options.alwaysServer, options.alwaysClient, optimal.location
    if (options.alwaysClient || optimal.location === 'client') {/* reference optimal.threads here */} // run web worker pool
    else if (options.alwaysServer || optimal.location === 'server') {
      return fetch('/__woven__', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funcName, payload }),
      })
      .then(res => res.json())
    }
  }
}
