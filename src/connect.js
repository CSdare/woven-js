module.exports = function connectWrapper(options) {
  return function connect() {
    fetch('/__woven_first__', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options }),
    })
    .then(res => res.json())
    .then(newOptions => {
      for (let field in options) {
        options[field] = newOptions[field];
      }
      console.log('changed front end options:', options);
    })
  }
}