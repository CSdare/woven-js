class WorkerThread {
  constructor(pool, WorkerFile) {
    this.pool = pool;
    this.WorkerFile = WorkerFile;
  }

  run(workerTask) {
    if (workerTask.funcName) {
      const worker = new this.WorkerFile();
      worker.addEventListener('message', (event) => {
        workerTask.callback(event.data);
        this.pool.freeWorkerThread(this);
        worker.terminate();
      });
      worker.addEventListener('error', (event) => {
        workerTask.errorCallback(`${event.message}\nerror in worker at line ${event.lineno} in ${event.filename}`);
        this.pool.freeWorkerThread(this);
        worker.terminate();
      });
      worker.postMessage({ funcName: workerTask.funcName, payload: workerTask.payload });
    } else {
      console.error('invalid function name passed to worker pool');
      this.pool.freeWorkerThread(this);
    }
  }
}

class Pool {
  constructor(size, WorkerFile) {
    this.taskQueue = [];
    this.workerQueue = [];
    this.WorkerFile = WorkerFile;
    this.size = size;
  }

  addWorkerTask(workerTask) {
    if (this.workerQueue.length > 0) {
      const workerThread = this.workerQueue.shift();
      workerThread.run(workerTask);
    } else this.taskQueue.push(workerTask);
  }

  init() {
    for (let i = 0; i < this.size; i += 1) {
      this.workerQueue.push(new WorkerThread(this, this.WorkerFile));
    }
  }

  freeWorkerThread(workerThread) {
    if (this.taskQueue.length > 0) {
      const workerTask = this.taskQueue.shift();
      workerThread.run(workerTask);
    } else this.workerQueue.push(workerThread);
  }
}

class WorkerTask {
  constructor(funcName, payload, callback, errorCallback) {
    this.funcName = funcName;
    this.payload = payload;
    this.callback = callback;
    this.errorCallback = errorCallback;
  }
}

module.exports = { Pool, WorkerTask };

/*
  modified from original code by jos.dirksen:
  http://www.smartjava.org/content/html5-easily-parallelize-jobs-using-web-workers-and-threadpool
*/
