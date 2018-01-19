import woven from '../index';

woven.connect();

window.onload = function() {
  const button = document.getElementById('button');
  const numbers = Array.from(document.getElementsByClassName('number'));
  button.onclick = function() {
    numbers.forEach(node => {
      let num = Number(node.innerHTML);
      woven.run('addTen', num)
        .then(newNum => node.innerHTML = newNum);
    });
  }
}


// setTimeout(woven.run('addTen', 20).then(output => console.log('output from run function is ', output)), 1000);

// woven.run('addTen', 30)
//   .then(output => console.log('output from run function is ', output));
