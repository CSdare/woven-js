module.exports = function connectWrapper(optimal, Pool, Performance) {

  return function connect(workerFile) {

    fetch('/__woven_first__', {
      method: 'GET', 
    })
    .then(res => res.json())
    .then(data => {
      roundtripMarker = Date.now()
      let responseSpeed = data.pingResolution 
      let dynamicSpeed = roundtripMarker - data.startDynamicPing
      Performance(optimal.threads, optimal.location);
    });

    //POOLS:
    optimal.pool = new Pool(optimal.threads, workerFile);
    optimal.pool.init();

  }
}
