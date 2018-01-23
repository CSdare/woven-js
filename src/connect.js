module.exports = function connectWrapper(optimal, Pool) {

  return function connect(workerFile) {

    fetch('/__woven_first__', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optimal }), // include information for optimization here? navigator... etc.
    })
    .then(res => res.json())
    .then(newOptimal => {

      optimal.clientDefaults = false;
      console.log('changed front end optimal', optimal);

    });
    /* TESTING ONLY -- REMOVE THIS LATER */ optimal.threads = 5; /* TESTING ONLY -- REMOVE THIS LATER */
    optimal.location = 'client';
    // need to pass optimal in, or get this directly from server?



    
    // declare pool as part of object? after optimization data is in
    optimal.pool = new Pool(optimal.threads, workerFile);
    optimal.pool.init();

    // will need to pass Pool into connect but not import into client side

  }
}