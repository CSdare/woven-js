const { expect } = require('chai');
const woven = require('../../index');
const path = require('path');


const functionsPath = path.resolve(__dirname, '../util/functions.js');

// want to test number of child processes being run and whether execSync
// or pool.addChildTask is called

const testReqAddTen = {
  body: {
    funcName: 'addTen',
    payload: [30],
  },
  url: '/__woven__',
};

const testReqAddAll = {
  body: {
    funcName: 'addAll',
    payload: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  url: '/__woven__',
};

const testReqWrongUrl = { url: '/not_woven' };

const testRes = {
  json(obj) {
    return JSON.stringify(obj);
  },
};

const testNext = () => 'called next()';

describe('Optimize unit tests', () => {
  describe('Optimize configured to use child processes', () => {
    before(() => woven.configure(functionsPath, { useChildProcess: true }));
    it('Uses child process pool', async () => {
      const result = await woven.optimize(testReqAddTen, testRes, testNext);
      expect(result).to.equal(JSON.stringify(40));
    });
    it('Calls next when route does not match a woven route', async () => {
      const result = await woven.optimize(testReqWrongUrl, testRes, testNext);
      expect(result).to.equal('called next()');
    });
    // it();
  });
});
