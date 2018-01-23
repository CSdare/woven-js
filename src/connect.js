module.exports = function connectWrapper(optimal, Pool) {

  return function connect(workerFile) {

    fetch('/__woven_first__', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optimal }), // include information for optimization here? navigator... etc.
    })
    .then(res => res.json())
    
    //ADD IN THE BASIC PING ---> Date.now()

    .then(newOptimal => {
       optimal.clientDefaults = false;
      console.log('changed front end optimal', optimal);

    });
    /* TESTING ONLY -- REMOVE THIS LATER */ optimal.threads = 5; /* TESTING ONLY -- REMOVE THIS LATER */
    optimal.location = 'client';

    // add fetch request for sending the dynamic ping (performance calculation)
    fetch('/__woven_performance__', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({dynamicPing})
    })
    .then(res => res.json)  

    // declare pool as part of object? after optimization data is in
    optimal.pool = new Pool(optimal.threads, workerFile);
    optimal.pool.init();

    // will need to pass Pool into connect but not import into client side

  }
}