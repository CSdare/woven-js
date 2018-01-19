// for testing purposes only ! ! ! !

const noise = () => {
  return Math.random() * 0.5 + 0.5;
};

const colorDistance = (scale, dest, src) => {
  return (scale * dest + (1 - scale) * src);
};

const processSepia = (binaryData, l) => {
  for (let i = 0; i < l; i += 4) {
      const r = binaryData[i];
      const g = binaryData[i + 1];
      const b = binaryData[i + 2];

      binaryData[i] = colorDistance(noise(), (r * 0.393) + (g * 0.769) + (b * 0.189), r);
      binaryData[i + 1] = colorDistance(noise(), (r * 0.349) + (g * 0.686) + (b * 0.168), g);
      binaryData[i + 2] = colorDistance(noise(), (r * 0.272) + (g * 0.534) + (b * 0.131), b);
  }
};

const addTen = (num) => {
  console.log('we got here');
  return num + 10;
}

const nthFib = num => {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return nthFib(num - 1) + nthFib(num - 2);
}

module.exports = { processSepia, addTen, nthFib };

