module.exports = function connectWrapper(options, optimal, Pool) {
  return function connect(workerFile) {
    fetch('/__woven_first__', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options }),
    })
    .then(res => res.json())
    .then(newOptions => {
      // for (let field in options) {
      //   options[field] = newOptions[field];
      // }
      console.log('changed front end options:', options);
    });
    /* TESTING ONLY -- REMOVE THIS LATER */ optimal.threads = 5; /* TESTING ONLY -- REMOVE THIS LATER */
    optimal.location = 'client';
    // need to pass optimal in, or get this directly from server?
    // declare pool as part of options object? after optimization data is in
    options.pool = new Pool(optimal.threads, workerFile);
    options.pool.init();
    // will need to pass Pool into connect but not import into client side

  }
}