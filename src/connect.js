module.exports = function connectWrapper(optimal, Pool) {
  
  return function connect() {
    fetch('/__woven_first__', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optimal }), // include information for optimization here? navigator... etc.
    })
    .then(res => res.json())
    .then(newOptimal => {
      for (let field in optimal) {
        optimal[field] = newOptimal[field];
      }
      optimal.clientDefaults = false;
      console.log('changed front end optimal', optimal);
    });
    /* TESTING ONLY -- REMOVE THIS LATER */ optimal.threads = 5; /* TESTING ONLY -- REMOVE THIS LATER */
    // need to pass optimal in, or get this directly from server?
    // declare pool as part of optimal object? after optimization data is in
    optimal.pool = new Pool(optimal.threads);
    optimal.pool.init();
    // will need to pass Pool into connect but not import into client side

  }
}