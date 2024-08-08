/**
 *
 * @author JarveinR
 *
 */
 
 var loggers = require('./loggersCache');
 var loadModule = require('../loadModule').loadModule;
 var validator = require('../validator');
 var path = require('path');
var bizagiUtil = require('../index');
var config = bizagiUtil.config;

function log(logname, enabled){
    enabled = (String(enabled) === "true");
    if (config.forceEnableLogger){
        var forceEnableLogger = (String(config.forceEnableLogger) === "true");
        if (forceEnableLogger === true){
            enabled = true;
        }
    }

    if(enabled === true) {        
        var error = validator.requiredParameters({'globals.projectname': logname});
        if (error) {
            throw error;
        }
        var log = loggers(logname + '.log');        
        return log;
    }
    else{        
        return loadModule(path.join(__dirname, 'emptyLogger'));;
    }
}

exports.log = log;