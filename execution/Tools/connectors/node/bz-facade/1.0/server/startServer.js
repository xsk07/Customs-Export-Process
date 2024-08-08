/**
 *
 * @author JarveinR
 *
 */
var path = require('path');
var fs = require('fs');
var fsmk = require('node-fs');
var express = require("express");
var server = express();
var stdio = require('stdio');
var requestHandler = require("./requestHandler");
var tools = require("./tools");
var cluster = require('cluster');
var bizagiUtil = require('bz-util');
var ERROR = bizagiUtil.error;
var config = bizagiUtil.config;
var LOG = require('../etc/logger');
var CPU_NUM = require('os').cpus().length;
var properties = require('properties-parser');
var workers = require('../etc/workers');

var argsCommandLine = stdio.getopt({
    'schema': {
        key: 'schema',
        args: 1,
        description: 'Schema of connection, http and https are allowed'
    },
    'server': {
        key: 'server',
        args: 1,
        description: 'Server host, if one is not specified, localhost is used by default'
    },
    'port': {
        key: 'port',
        args: 1,
        description: 'Server listening port, if one is not specified, 16541 is used by default'
    },
    'limit': {
        key: 'limit',
        args: 1,
        description: 'Limit the HTTP request size in MB'
    },
    'workers': {
        key: 'workers',
        args: 1,
        description: 'Number of workers in the cluster.'
    },
    'logsPath':{
        key: 'logsPath',
        args: 1,
        description: 'Log directory absolute path.'
    }
});

var port = config.port;
if (argsCommandLine.port) {
    port = argsCommandLine.port;
}

var limit = config.maxRequestLengthSize;
if (argsCommandLine.limit){
    limit = argsCommandLine.limit;
}

var numWorkers = CPU_NUM;
if (config.clusterWorkerNumber != 'auto'){
    numWorkers = config.clusterWorkerNumber;
}
var userNumWorkers = parseInt(argsCommandLine.workers);
if (!isNaN(userNumWorkers) && userNumWorkers > 0 && userNumWorkers <= CPU_NUM){
    numWorkers = userNumWorkers;
}

var loggerDirectory = config.logsPath;
if (argsCommandLine.logsPath) {
    loggerDirectory = argsCommandLine.logsPath;
}
var fileLog = path.join(loggerDirectory, 'server.log');
if (!fs.existsSync(loggerDirectory)) {
    fsmk.mkdirSync(loggerDirectory, 0666, true);
}

if (cluster.isMaster) {
    var pidDirectory = path.join(__dirname, '../../../pid');
    if (!fs.existsSync(pidDirectory)) {
        fsmk.mkdirSync(pidDirectory, 0666, true);
    }
    fs.writeFileSync(path.join(pidDirectory, 'nodejs'), process.pid + '=master\n');

    fs.appendFileSync(fileLog, LOG('INIT_SERVER'));
    fs.appendFileSync(fileLog, LOG('MASTER_STARTING', [process.pid, numWorkers]));

    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('fork', function (worker) {
        fs.appendFileSync(fileLog, LOG('WORKER_FORK', [worker.process.pid]));
    });

    cluster.on('listening', function (worker, address) {
        var addressType = 'Unknow';
        if (address.addressType == '4') {
            addressType = 'TCPv4';
        }
        else if (address.addressType == '6') {
            addressType = 'TCPv6';
        }
        else if (address.addressType == '-1') {
            addressType = 'UNIX Domain Socket';
        }
        else if (address.addressType == 'udp4') {
            addressType = 'UDP4';
        }
        else if (address.addressType == 'udp6') {
            addressType = 'UDP6';
        }

        if (!address.address) {
            address.address = 'localhost';
        }

        fs.appendFileSync(path.join(pidDirectory, 'nodejs'), worker.process.pid + '=worker' + '\n');
        fs.appendFileSync(fileLog, LOG('WORKER_LISTENING', [worker.process.pid, address.address, address.port, addressType]));
    });

    cluster.on('disconnect', function (worker) {
        fs.appendFileSync(fileLog, LOG('WORKER_DISCONNECT', [worker.process.pid]));
    });

    cluster.on('exit', function (worker, code, signal) {
        properties.read(path.join(pidDirectory, 'nodejs'), function (error, data) {
            if (!error) {
                fs.writeFileSync(path.join(pidDirectory, 'nodejs'), '');
                for (var item in data) {
                    if (item != worker.process.pid) {
                        fs.appendFileSync(path.join(pidDirectory, 'nodejs'), item + '=' + data[item] + '\n');
                    }
                }
            }
        });

        workers.removeWorker(worker);

        fs.appendFileSync(fileLog, LOG('WORKER_KILLED', [worker.process.pid, code, signal]));
        if (worker.suicide === false) {
            fs.appendFileSync(fileLog, LOG('WORKER_RESTART'));
            cluster.fork();
        }
    });
}
else {
    workers.workerRegister(cluster.worker);

    server.configure(function () {
        server.use(express.json({limit: limit}));
        server.use(express.urlencoded({limit: limit}));
        server.use(express.methodOverride());
        server.use(express.bodyParser());
        server.use(server.router);
    });

    server.post("/connector/invokeRestAction", requestHandler.invokeRestAction);
    server.post("/connector/invokeCustomAction", requestHandler.invokeCustomAction);
    server.post("/connector/authenticator", requestHandler.authenticator);
    server.post("/connector/customAuthenticator", requestHandler.customAuthenticator);
    server.post("/connector/tools/cleanModuleCache", tools.cleanModuleCache);
    server.get("/connector/tools/isServiceUp", tools.isServiceUp);

    server.listen(port, function () {
    });
}

process.on('uncaughtException', function (err) {
    var code = err.code;
    if (code == 'EADDRINUSE'){
        fs.appendFileSync(fileLog, LOG('PORT_ALREADY_IN_USE', [port]));

        var ws = workers.getAllWorkers();
        for (var id in ws) {
            ws[id].kill();
        }
        workers.removeAllWorkers();
    }
    else if (code == 'EACCES'){
        fs.appendFileSync(fileLog, LOG('PORT_ACCESS_DENIED', [port]));

        var ws = workers.getAllWorkers();
        for (var id in ws) {
            ws[id].kill();
        }
        workers.removeAllWorkers();
    }
    else{
        fs.appendFileSync(fileLog, LOG('ERROR', [code  + ' ' + err]));
    }
    process.exit(0);
});
