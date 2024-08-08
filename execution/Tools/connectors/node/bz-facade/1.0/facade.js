/**
 *
 * @author JarveinR
 *
 */ 
 
var path = require('path');
var bizagiUtil = require('bz-util');
var config = bizagiUtil.config;
var LOGGER = bizagiUtil.LOG;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;

function getInvokeRestActionFunction(controllerVersion, callback, enableLog) {
    try{           
        var log = (String(enableLog) === "true");        
        var LOG = LOGGER(config.logFileName, log);                
        
        var error = bizagiUtil.validator.requiredParameters({'controllerversion': controllerVersion, 'callback': callback});
        if (error){
            LOG.error(['[facade.getInvokeRestActionFunction - Line 21] Error: ', error]);
            callback(error);
            return;
        }        
        LOG.debug(['[facade.getInvokeRestActionFunction - Line 25] controllerversion: ', controllerVersion]);
        var routerConnector = bizagiUtil.loadModule(path.join(__dirname, '../..', 'bz-ctrl', controllerVersion, 'routerConnector.js'));        
        if (routerConnector){            
            callback(null, routerConnector.invokeRestAction);
         }
         else{             
            var err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
            LOG.error(['[facade.getInvokeRestActionFunction - Line 32] Error: ', err]);
            callback(err);    
         }
    }catch(e){
        var code = e.code;
        var er = null;
        if (code == "MODULE_NOT_FOUND"){
            var message = e.message || path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js');
            er = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [message]));
        }
        else{
            er = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.getInvokeRestActionFunction']));
        }

        LOG.error([ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.getCustomAuthenticatorFunction  - Line 45'])]);
        callback(er);
    }
}
 
function getInvokeCustomActionFunction(controllerVersion, callback, enableLog) {
    try{
        var log = (String(enableLog) === "true");
        var LOG = LOGGER(config.logFileName, log);        
        
        var error = bizagiUtil.validator.requiredParameters({'controllerversion': controllerVersion, 'callback': callback});
        if (error){
            LOG.error(['[facade.getInvokeCustomActionFunction - Line 57] Error: ', error]);
            callback(error);
            return;
        }
        
        LOG.debug(['[facade.getInvokeCustomActionFunction - Line 62] controllerversion: ', controllerVersion]);
        var routerConnector = bizagiUtil.loadModule(path.join(__dirname, '../..', 'bz-ctrl', controllerVersion, 'routerConnector.js'));
        if (routerConnector){
            callback(null, routerConnector.invokeCustomAction);
        }
        else{
            var err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
            LOG.error(['[facade.getInvokeRestActionFunction - Line 69] Error: ', err]);
            callback(err);    
        }
    }catch(e){
        var code = e.code;
        var er = null;
        if (code == "MODULE_NOT_FOUND"){
            er = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
        }
        else{
            er = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.getInvokeCustomActionFunction']));
        }

        LOG.error([ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.getCustomAuthenticatorFunction  - Line 82'])]);
        callback(er);
    }
}

function getAuthenticatorFunction(controllerVersion, callback, enableLog) {
    try{
        var log = (String(enableLog) === "true");
        var LOG = LOGGER(config.logFileName, log);        
        
        var error = bizagiUtil.validator.requiredParameters({'controllerversion': controllerVersion, 'callback': callback});
        if (error){
            LOG.error(['[facade.getAuthenticatorFunction - Line 94] Error: ', error]);
            callback(error);
            return;
        }
        
        LOG.debug(['[facade.getAuthenticatorFunction - Line 99] controllerversion: ', controllerVersion]);
        var routerConnector = bizagiUtil.loadModule(path.join(__dirname, '../..', 'bz-ctrl', controllerVersion, 'routerConnector.js'));
        if (routerConnector){
            callback(null, routerConnector.authenticator);
        }
        else{
            var err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
            LOG.error(['[facade.getInvokeRestActionFunction - Line 106] Error: ', err]);
            callback(err);    
        }
    }catch(e){
        var code = e.code;
        var er = null;
        if (code == "MODULE_NOT_FOUND"){
            er = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
        }
        else{
            er = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.getAuthenticatorFunction']));
        }

        LOG.error([ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.getCustomAuthenticatorFunction - Line 119'])]);
        callback(er);
    }
}

function getCustomAuthenticatorFunction(controllerVersion, callback, enableLog) {
    try{
        var log = (String(enableLog) === "true");
        var LOG = LOGGER(config.logFileName, log);        
        
        var error = bizagiUtil.validator.requiredParameters({'controllerversion': controllerVersion, 'callback': callback});
        if (error){
            LOG.error(['[facade.getCustomAuthenticatorFunction - Line 131] Error: ', error]);
            callback(error);
            return;
        }
        
        LOG.debug(['[facade.getCustomAuthenticatorFunction - Line 136] controllerversion: ', controllerVersion]);
        var routerConnector = bizagiUtil.loadModule(path.join(__dirname, '../..', 'bz-ctrl', controllerVersion, 'routerConnector.js'));
        if (routerConnector){
            callback(null, routerConnector.customAuthenticator);
        }
        else{
            var err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
            LOG.error(['[facade.getInvokeRestActionFunction - Line 143] Error: ', err]);
            callback(err);    
        }
    }catch(e){
        var code = e.code;
        var er = null;
        if (code == "MODULE_NOT_FOUND"){
            er = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
        }
        else{
            er = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.getCustomAuthenticatorFunction']));
        }

        LOG.error([ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.getCustomAuthenticatorFunction - Line 156'])]);
        callback(er);
    }
}

function cleanModuleCacheFunction(controllerVersion, callback, enableLog){
    try{
        var log = (String(enableLog) === "true");
        var LOG = LOGGER(config.logFileName, log);

        LOG.debug(['cleanModuleCache for controllerversion - Line 166: ', controllerVersion]);

        var routerConnector = bizagiUtil.loadModule(path.join(__dirname, '../..', 'bz-ctrl', controllerVersion, 'routerConnector.js'));
        bizagiUtil.cleanModuleCache(path.join(__dirname, '../..', 'bz-ctrl', controllerVersion, 'routerConnector.js'));
        if (routerConnector){
            callback(null, routerConnector.cleanModuleCache);
        }
        else{
            var err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
            LOG.error(['[facade.cleanModuleCache - Line 175] Error: ', err]);
            callback(err);
        }
    }catch(e){
        var code = e.code;
        var er = null;
        if (code == "MODULE_NOT_FOUND"){
            er = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, '..', 'bz-ctrl', controllerVersion, 'routerConnector.js')]));
        }
        else{
            er = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.cleanModuleCache']));
        }

        LOG.error([ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.facade.cleanModuleCache - Line 188'])]);
        callback(er);
    }
}

process.on('uncaughtException', function (err) {
    var fs = require('fs');
    var fsmk = require('node-fs');
    var LOG = require('./etc/logger');

    var fileLog = path.join(config.logsPath, 'facade-exceptions.log');
    if (!fs.existsSync(config.logsPath)) {
        fsmk.mkdirSync(config.logsPath, 0666, true);
    }

    var code = err.code;
    if (code == 'EACCES'){
        fs.appendFileSync(fileLog, LOG('ACCESS_DENIED - Line 205', [code + ' ' + err]));
    }
    else{
		fs.appendFileSync(fileLog, 'ERROR - Line error 208 ');
        fs.appendFileSync(fileLog, err);
    }
    process.exit(0);
});


exports.getInvokeRestActionFunction = getInvokeRestActionFunction;
exports.getInvokeCustomActionFunction = getInvokeCustomActionFunction;
exports.getAuthenticatorFunction = getAuthenticatorFunction;
exports.getCustomAuthenticatorFunction = getCustomAuthenticatorFunction;
exports.cleanModuleCacheFunction = cleanModuleCacheFunction;