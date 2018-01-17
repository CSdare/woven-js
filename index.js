console.log('hello woven')

const run = require('./src/run');


function Woven() {
  const options = {};
  this.run = run.bind(this);
}