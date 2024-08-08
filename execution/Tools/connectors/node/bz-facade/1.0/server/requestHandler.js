/**
 *
 * @author JarveinR
 *
 */
 
var path = require('path');
var facade = require("../facade");
var bizagiUtil = require('bz-util');
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;

function invokeRestAction(request, response) {       
    try{
        var controllerVersion = request.body.controllerversion;
        var enableLog = request.body.enablelog;
        
        facade.getInvokeRestActionFunction(controllerVersion, function (error, callback) {
            if (error){
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(error));
                response.end();
            }
            else{                
                var ctrl = bizagiUtil.loadModule(path.join(__dirname, 'controllerVersions', controllerVersion + '.js'));                
                ctrl.invokeRestAction(request, response, callback);                
            }
        }, enableLog);        
    }catch(e){        
        var error = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.server.requestHandler.invokeRestAction']));
        response.writeHead(200, {"Content-Type": "application/json"});            
        response.write(JSON.stringify(error));            
        response.end();        
    }
}

function invokeCustomAction(request, response) {    
    try{
        var controllerVersion = request.body.controllerversion;
        var enableLog = request.body.enablelog;
        
        facade.getInvokeCustomActionFunction(controllerVersion, function (error, callback) {
            if (error){
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(error));
                response.end();
            }
            else{                
                var ctrl = bizagiUtil.loadModule(path.join(__dirname, 'controllerVersions', controllerVersion + '.js'));                
                ctrl.invokeCustomAction(request, response, callback);                
            }
        }, enableLog);        
    }catch(e){        
        var error = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.server.requestHandler.invokeRestAction']));
        response.writeHead(200, {"Content-Type": "application/json"});            
        response.write(JSON.stringify(error));            
        response.end();        
    }
}

function authenticator(request, response){
    try{
        var controllerVersion = request.body.controllerversion;
        var enableLog = request.body.enablelog;
        
        facade.getAuthenticatorFunction(controllerVersion, function (error, callback) {
            if (error){
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(error));
                response.end();
            }
            else{                
                var ctrl = bizagiUtil.loadModule(path.join(__dirname, 'controllerVersions', controllerVersion + '.js'));                
                ctrl.authenticator(request, response, callback);                
            }
        }, enableLog);        
    }catch(e){        
        var error = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.server.requestHandler.invokeRestAction']));
        response.writeHead(200, {"Content-Type": "application/json"});            
        response.write(JSON.stringify(error));            
        response.end();        
    }
}

function customAuthenticator(request, response) {    
    try{
        var controllerVersion = request.body.controllerversion;
        var enableLog = request.body.enablelog;
        
        facade.getCustomAuthenticatorFunction(controllerVersion, function (error, callback) {
            if (error){
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(error));
                response.end();
            }
            else{                
                var ctrl = bizagiUtil.loadModule(path.join(__dirname, 'controllerVersions', controllerVersion + '.js'));                
                ctrl.customAuthenticator(request, response, callback);                
            }
        }, enableLog);        
    }catch(e){        
        var error = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.server.requestHandler.invokeRestAction']));
        response.writeHead(200, {"Content-Type": "application/json"});            
        response.write(JSON.stringify(error));            
        response.end();        
    }
}

exports.invokeRestAction = invokeRestAction;
exports.invokeCustomAction = invokeCustomAction;
exports.authenticator = authenticator;
exports.customAuthenticator = customAuthenticator;