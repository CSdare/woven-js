const add = (x, y) => {
  return x + y;
}

function multiply(x, y) {
  let total = 0;
  for (let i = 0; i < y; i++) {
    total = add(total, x);
  }
  return total;
}

module.exports = { add, multiply };