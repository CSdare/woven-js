const { expect } = require('chai');
const path = require('path');
const { ChildPool, ChildTask } = require('../../src/ChildPool');
const woven = require('../../index');

const functionsPath = path.resolve(__dirname, '../util/functions.js');
const childProcessFilePath = path.resolve(__dirname, '../util/functions_woven_child_process.js');
const size = 4; // size of the pool - max concurrent threads

describe('ChildPool', () => {
  woven.configure(functionsPath, { useChildProcess: true, writeFileSync: true });
  let pool = new ChildPool(size, path.resolve(childProcessFilePath));

  describe('Initializiation of ChildPool', () => {
    it(`Initializing the pool should add ${size} threads to the childQueue`, () => {
      pool.init();
      expect(pool.size).to.equal(size);
      expect(pool.childQueue.length).to.equal(4);
      expect(pool.taskQueue.length).to.equal(0);
    });

    it('Initializing the pool should set the correct child process file path', () => {
      expect(pool.childProcessFile).to.equal(childProcessFilePath);
    });

    it('Pool should only be able to initialize once', () => {
      expect(pool.init.bind(pool)).to.throw('Cannot re-initialize');
    });
  });

  describe('Adding tasks to pool', () => {
    let callbackCalledFlag = false;

    const callback = () => {
      callbackCalledFlag = true;
    };

    const errorCallback = () => {};

    const task = new ChildTask('nthFib', [30], callback, errorCallback);
    const task2 = new ChildTask('addTen', [30], callback, errorCallback);

    it('adding tasks should remove children from childQueue', () => {
      expect(pool.childQueue.length).to.equal(size);
      pool.addChildTask(task);
      expect(pool.childQueue.length).to.equal(size - 1);
      pool.addChildTask(task);
      expect(pool.childQueue.length).to.equal(size - 2);
    });

    it('adding many tasks to should add tasks to taskQueue', () => {
      pool = new ChildPool(size, path.resolve(childProcessFilePath));
      pool.init();
      for (let i = 0; i < pool.size + 2; i += 1) {
        pool.addChildTask(task);
      }
      expect(pool.childQueue.length).to.equal(0);
      expect(pool.taskQueue.length).to.equal(2);
    });

    it('completed task should call the callback', (done) => {
      const pool2 = new ChildPool(size, path.resolve(childProcessFilePath));
      pool2.init();
      pool2.addChildTask(task2);
      setTimeout(() => {
        expect(callbackCalledFlag).to.equal(true);
        done();
      }, 400);
    });

    it('threads should be freed when task is done', (done) => {
      const pool3 = new ChildPool(size, path.resolve(childProcessFilePath));
      pool3.init();
      pool3.addChildTask(task2);
      pool3.addChildTask(task2);
      expect(pool3.childQueue.length).to.equal(pool3.size - 2);
      setTimeout(() => {
        expect(pool3.childQueue.length).to.equal(pool3.size);
        done();
      }, 500);
    });
  });
});
