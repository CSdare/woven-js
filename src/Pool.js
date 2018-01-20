function Pool(size) {
  this.taskQueue = [];
  this.workerQueue = [];
  this.poolSize = size;


}

function WorkerThread(pool) {
  this.pool = pool;
  this.workerTask = {};

  this.run = function(workerTask) {
    this.workerTask = workerTask;
  }
}

function WorkerTask(funcName, )