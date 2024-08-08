/**
 *
 * @author JarveinR
 *
 */
function invokeRestAction(request, response, callback) {
	var enableLog = request.body.enablelog;    
    var globals = request.body.globals;		
    var data = request.body.data;
    var httpOperation = request.body.httpoperation;
    var restUrl = request.body.resturl;
    var authenticationType = request.body.authenticationtype;
    var restContentType = request.body.restcontenttype;

    callback(globals, httpOperation, restUrl, authenticationType, restContentType, data, function (reply){
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(reply));
        response.end();
    }, enableLog);    
}

function invokeCustomAction(request, response, callback) {
    var enableLog = request.body.enablelog;    
    var globals = request.body.globals;	
    var actionName = request.body.actionname;
    var connectorPath = request.body.connectorpath;
    var data = request.body.data;
    var authenticationType = request.body.authenticationtype;

    callback(globals, actionName, connectorPath, data, authenticationType, function (reply){
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(reply));
        response.end();
    }, enableLog);
}

function authenticator(request, response, callback){
    var enableLog = request.body.enablelog;
    var globals = request.body.globals;
    var authenticationType = request.body.authenticationtype;
    var restUrl = request.body.resturl;
    var httpOperation = request.body.httpoperation;        

    callback(globals, authenticationType, restUrl, httpOperation, function (reply){
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(reply));
        response.end();
    }, enableLog);
}

function customAuthenticator(request, response, callback) {   
    var enableLog = request.body.enablelog;
    var globals = request.body.globals;
    var connectorPath = request.body.connectorpath;

    callback(globals, connectorPath, function (reply, error){
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(reply));
        response.end();
    }, enableLog);
}

function cleanModuleCache(request, response, callback) {
    var enableLog = request.body.enablelog;
    var globals = request.body.globals;
    var connectorPath = request.body.connectorpath;

    callback(globals, connectorPath, function (reply){
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(reply));
        response.end();
    }, enableLog);
}

exports.invokeRestAction = invokeRestAction;
exports.invokeCustomAction = invokeCustomAction;
exports.authenticator = authenticator;
exports.customAuthenticator = customAuthenticator;
exports.cleanModuleCache = cleanModuleCache;