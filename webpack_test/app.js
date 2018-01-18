const dogLogger = (saying) => {
  console.log('The dog says ' + saying + '!');
};

const helloButton = document.getElementById('hello').addEventListener('click', () => dogLogger('woof'));