/**
 *
 * @author JarveinR
 *
 */

var bizagiUtil = require('bz-util');
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var facade = require("../facade");
var path = require('path');

function isServiceUp(request, response) {
    try{
        var reply = RESPONSE({isServiceUp:true}, null, 200);

        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(reply));
        response.end();
    }catch(e){
        e.isServiceUp = false;
        var error = RESPONSE(null, null, 404, ERROR('GLB.EXCEPTION', [e.message, e.message, e, 'bz-facade.server.tools.isServiceUp']));
        response.writeHead(200, {"Content-Type": "application/json"});            
        response.write(JSON.stringify(error));            
        response.end();        
    }
}

function cleanModuleCache(request, response) {
    try{
        var controllerVersion = request.body.controllerversion;
        var enableLog = request.body.enablelog;

        facade.cleanModuleCacheFunction(controllerVersion, function (error, callback) {
            if (error){
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(error));
                response.end();
            }
            else{
                var ctrl = bizagiUtil.loadModule(path.join(__dirname, 'controllerVersions', controllerVersion + '.js'));
                bizagiUtil.cleanModuleCache(path.join(__dirname, 'controllerVersions', controllerVersion + '.js'));
                ctrl.cleanModuleCache(request, response, callback);
            }
        }, enableLog);
    }catch(e){
        var error = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-facade.server.tools.cleanModuleCache']));
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(error));
        response.end();
    }
}

exports.isServiceUp = isServiceUp;
exports.cleanModuleCache = cleanModuleCache;