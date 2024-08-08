/**
 *
 * @author JarveinR
 *
 */
 
var WORKERS = {};

function workerRegister (worker){
    WORKERS[worker.process.pid] = worker;
}

function removeAllWorkers(){
    WORKERS = {};
}

function removeWorker(worker){
    delete WORKERS[worker.process.pid];
}

function getAllWorkers(){
    return WORKERS;
}

exports.workerRegister = workerRegister;
exports.removeAllWorkers = removeAllWorkers;
exports.removeWorker = removeWorker;
exports.getAllWorkers = getAllWorkers;