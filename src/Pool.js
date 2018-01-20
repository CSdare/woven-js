function Pool(size) {
  this.taskQueue = [];
  this.workerQueue = [];
  this.poolSize = size;

  this.addWorkerTask = function(workerTask) {
    if (this.workerQueue.length > 0) {
      const workerThread = this.workerQueue.shift();
      workerThread.run(workerTask);
    } else this.taskQueue.push(workerTask);
  }

  this.init = function() {
    for (let i = 0; i < this.poolSize; i++) {
      this.workerQueue.push(new WorkerThread(this));
    }
  }

  this.freeWorkerThread = function(workerThread) {
    if (this.taskQueue.length > 0) {
      const workerTask = this.taskQueue.shift();
      workerThread.run(workerTask);
    } else this.workerQueue.push(workerThread);
  }

  this.addWorkerTask.bind(this);
  this.init.bind(this);
  this.freeWorkerThread.bind(this);
}

function WorkerThread(pool) {
  this.pool = pool;
  this.workerTask = {};

  this.run = function(workerTask) {
    this.workerTask = workerTask;
    if (this.workerTask.funcName !== null) {
      const worker = new Worker(/* how do we store worker reference here?*/);
      worker.addEventListener('message', dummyCallback, false);
      worker.addEventListener('error', (msg, line, fileName) => {
        console.error(msg + `\nerror in worker at line ${line} in ${fileName}`);
      });
      worker.postMessage({ funcName: workerTask.funcName, payload: workerTask.payload });
    }
  }
  
  function dummyCallback(event) {
    this.workerTask.callback(event.data);
    this.pool.freeWorkerThread(this);
  }

  this.run.bind(this);
}

function WorkerTask(funcName, payload, callback) {
  this.funcName = funcName;
  this.payload = payload;
  this.callback = callback;
}

module.exports = { Pool, WorkerTask };

/*
  modified from original code by jos.dirksen:
  http://www.smartjava.org/content/html5-easily-parallelize-jobs-using-web-workers-and-threadpool
*/
