const { fork } = require('child_process');

class ChildThread {
  constructor(pool, childProcessFile) {
    this.pool = pool;
    this.childProcessFile = childProcessFile;
  }

  run(childTask) {
    const childProcess = fork(this.childProcessFile);
    childProcess.on('message', (msg) => {
      childTask.callback(msg.data);
      this.pool.freeChildThread(this);
      childProcess.kill();
    });
    childProcess.on('error', (err) => {
      childTask.errorCallback(err);
      this.pool.freeChildThread(this);
      childProcess.kill();
    });
    childProcess.send({ funcName: childTask.funcName, payload: childTask.payload });
  }
}

class ChildPool {
  constructor(size, childProcessFile) {
    this.size = size;
    this.childProcessFile = childProcessFile;
    this.taskQueue = [];
    this.childQueue = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized === false) {
      for (let i = 0; i < this.size; i += 1) {
        this.childQueue.push(new ChildThread(this, this.childProcessFile));
      }
      this.initialized = true;
    } else throw new Error('Cannot re-initialize child process pool.');
  }

  addChildTask(childTask) {
    if (this.childQueue.length > 0) {
      const childThread = this.childQueue.shift();
      childThread.run(childTask);
    } else this.taskQueue.push(childTask);
  }

  freeChildThread(childThread) {
    if (this.taskQueue.length > 0) {
      const childTask = this.taskQueue.shift();
      childThread.run(childTask);
    } else this.childQueue.push(childThread);
  }
}

class ChildTask {
  constructor(funcName, payload, callback, errorCallback) {
    this.funcName = funcName;
    this.payload = payload;
    this.callback = callback;
    this.errorCallback = errorCallback;
  }
}

module.exports = { ChildPool, ChildTask };
