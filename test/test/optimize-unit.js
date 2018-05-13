const { expect } = require('chai');
const path = require('path');
const woven = require('../../index');
const options = require('../../src/options');

const functionsPath = path.resolve(__dirname, '../util/functions.js');

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
  // Monkey patch the pool.addChildTask and woven.optimize functions to test that
  // pool.addChildTask is being called
  it('Uses child process pool when configured to do so', async () => {
    woven.configure(functionsPath, { useChildProcess: true, writeFileSync: true });
    let calledFlag = false;
    await (async function monkeyPatchPool() {
      const oldOptimize = woven.optimize;
      woven.optimize = function optimize(req, res, next) {
        return new Promise((resolve, reject) => {
          const oldOptionsPool = options.pool;
          options.pool = {};
          options.pool.addChildTask = function addChildTask() {
            calledFlag = true;
            options.pool = oldOptionsPool;
            resolve();
          };
          oldOptimize(req, res, next).catch(err => reject(err));
        });
      };
      await woven.optimize(testReqAddTen, testRes, testNext);
      woven.optimize = oldOptimize;
    }());
    expect(calledFlag).to.equal(true);
    const result = await woven.optimize(testReqAddTen, testRes, testNext);
    expect(result).to.equal(JSON.stringify(40));
  });

  // Unable to redefine execSync within optimize function, so this tests that addChildTask
  // is NOT called, and that the correct answer is still returned
  it('Uses execSync when configured to do so', async () => {
    woven.configure(functionsPath, { useChildProcess: false, writeFileSync: true });
    let calledFlag = false;
    await (async function monkeyPatchPool() {
      const oldOptimize = woven.optimize;
      woven.optimize = function optimize(req, res, next) {
        return new Promise((resolve, reject) => {
          const oldOptionsPool = options.pool;
          options.pool = {};
          options.pool.addChildTask = function addChildTask() {
            calledFlag = true;
            options.pool = oldOptionsPool;
            resolve();
          };
          oldOptimize(req, res, next).then(() => resolve()).catch(err => reject(err));
        });
      };
      await woven.optimize(testReqAddTen, testRes, testNext);
      woven.optimize = oldOptimize;
    }());
    expect(calledFlag).to.equal(false);
    const result = await woven.optimize(testReqAddAll, testRes, testNext);
    expect(result).to.equal(JSON.stringify(55));
  });

  // Ensure that any route other than __woven__ calls next()
  it('Calls next when route does not match a woven route', async () => {
    const result = await woven.optimize(testReqWrongUrl, testRes, testNext);
    expect(result).to.equal('called next()');
  });
});
