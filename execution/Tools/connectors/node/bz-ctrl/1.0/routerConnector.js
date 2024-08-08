/**
 *
 * @author JarveinR
 *
 */

var util = require('util');
var path = require('path');

var bizagiUtil = require('bz-util');
var bizagiDigest = require('bz-digest');
var config = bizagiUtil.config;
var LOGGER = bizagiUtil.LOG;
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;
var authenticators = require("./auth/authenticators");

function invokeRestAction(globals, httpOperation, restUrl, authenticationType, restContentType, data, callback, enableLog) {
    try {
        var result = bizagiUtil.validator.isValidGlobalsJson(globals);
        if (result.success) {
            globals = result.response.outputs.output;
        }
        else {
            callback(result);
            return;
        }

        var log = (String(enableLog) === "true");
        var LOG = LOGGER(globals.projectname + '-' + config.logFileName, log);
        LOG.debug(['[routerConnector.invokeRestAction - Line 31] restUrl:', restUrl, ', globals.projectname:', globals.projectname, ', globals.systemproperties:', globals.systemproperties, ', globals.authdata:*********', ', data:', data, ', httpOperation:', httpOperation, ', authenticationType:', authenticationType, ', restContentType:', restContentType]);

        var error = bizagiUtil.validator.requiredParameters({
            'httpoperation': httpOperation,
            'resturl': restUrl,
            'authenticationtype': authenticationType,
            'restcontenttype': restContentType,
            'data': data,
            'callback': callback
        });
        if (error) {
            LOG.error(['[routerConnector.invokeRestAction - Line 42] restUrl:', restUrl, ', Error: ', error]);
            callback(error);
            return;
        }

        result = bizagiUtil.validator.isValidDataJson({"data": data});
        if (result.success) {
            data = result.response.outputs.output;
        }
        else {
            LOG.error(['[routerConnector.invokeRestAction - Line 52] restUrl:', restUrl, ', Error: ', result]);
            callback(result);
            return;
        }

        var enableHttpsVerification = config.enableHttpsVerification ? config.enableHttpsVerification : false;

        httpOperation = httpOperation.toUpperCase();
        var options = {
            url: restUrl,
            method: httpOperation,
            forever:true,
            rejectUnauthorized: enableHttpsVerification,
            headers: {
            }
        };

        if (authenticationType == "digest") {
            globals.authdata.uri = restUrl;
            globals.authdata.method = httpOperation;

            var digest = bizagiDigest.create();
            digest.getAuthorizationHeader(globals.authdata, function (error, reply) {
                if (error) {
                    var error = RESPONSE(null, error, -400, ERROR('AUTH.ERROR', [error.error]));
                    callback(error);

                    LOG.error(['[authenticator.digest - Line 76] restUrl:', restUrl, ', Error: ', ERROR('AUTH.ERROR', [error.error])]);
                }
                else {
                    options.headers.Authorization = reply.authorization;
                }
            });
        }
        else if (authenticationType != "none") {
            var authorizationHeader = globals.authdata.authorizationheader;
            if (authorizationHeader) {
                options.headers.Authorization = authorizationHeader;
            }
        }

        if (httpOperation == "GET" || httpOperation == "DELETE") {
            options.qs = data.inputs.input;
        }
        else {
            options.headers['Content-Type'] = restContentType;

            if (restContentType == 'text/plain'){
                options.body = JSON.stringify(data.inputs.input);
            }
            else if(restContentType == 'application/json') {
                options.json = true;
                options.body = data.inputs.input;
            }
            else if(restContentType == 'application/x-www-form-urlencoded'){
                options.form = data.inputs.input;
            }
            else{
                throw Error(restContentType + ' Content-Type unsupported.');
            }
        }

        var dispatcher = bizagiUtil.loadModule(path.join(__dirname, 'rest_action', 'dispatcher.js'));
        dispatcher.send(options, LOG, callback);

    } catch (e) {
        var code = e.code;
        var err = null;
        if (code == "MODULE_NOT_FOUND") {
            err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, 'rest_action', 'dispatcher.js')]));
        }
        else {
            err = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-ctrl.routerConnector.invokeRestAction']));
        }
        if (LOG){
            LOG.error(['[routerConnector.invokeRestAction - Line 124] restUrl:', restUrl, ', Exception:', e, ', globals:', globals, ', data:', data]);
        }
        callback(err);
    }
}

function invokeCustomAction(globals, actionName, connectorPath, data, authenticationType, callback, enableLog) {
    try {
        var result = bizagiUtil.validator.isValidGlobalsJson(globals);
        if (result.success) {
            globals = result.response.outputs.output;
        }
        else {
            callback(result);
            return;
        }

        var log = (String(enableLog) === "true");
        var LOG = LOGGER(globals.projectname + '-' + config.logFileName, log);
        LOG.debug(['[routerConnector.invokeCustomAction - Line 143] connectorPath:', path.resolve(connectorPath), ', globals.projectname:', globals.projectname, ', globals.systemproperties:', globals.systemproperties, ', globals.authdata:*********', ', actionName:', actionName, ', data:', data]);

        var error = bizagiUtil.validator.requiredParameters({
            'actionname': actionName,
            'connectorpath': connectorPath,
            'data': data,
            'authenticationtype': authenticationType,
            'callback': callback
        });
        if (error) {
            LOG.error(['[routerConnector.invokeCustomAction - Line 153] connectorPath:', path.resolve(connectorPath), ', Error: ', error]);
            callback(error);
            return;
        }

        result = bizagiUtil.validator.isValidDataJson({"data": data});
        if (result.success) {
            data = result.response.outputs.output;
        }
        else {
            LOG.error(['[routerConnector.invokeCustomAction - Line 163] connectorPath:', path.resolve(connectorPath), ', Error: ', result]);
            callback(result);
            return;
        }

        var bizagiRouter = bizagiUtil.loadModule(path.join(connectorPath, 'bizagiRouter'));
        bizagiRouter.invokeAction(globals, actionName, data, authenticationType, callback, enableLog);

    } catch (e) {
        var code = e.code;
        var err = null;
        if (code == "MODULE_NOT_FOUND") {
            err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(connectorPath, 'bizagiRouter')]));
        }
        else {
            err = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-ctrl.routerConnector.invokeCustomAction']));
        }
        if (LOG){
            LOG.error(['[routerConnector.invokeCustomAction - Line 181] connectorPath:', path.resolve(connectorPath), ', Exception:', e, ' globals:', globals, ' actionName:', actionName, ' data:', data]);
        }
        callback(err);
    }
}

function authenticator(globals, authenticationType, restUrl, httpOperation, callback, enableLog) {
    try {
        var result = bizagiUtil.validator.isValidGlobalsJson(globals);
        if (result.success) {
            globals = result.response.outputs.output;
        }
        else {
            callback(result);
            return;
        }

        var log = (String(enableLog) === "true");
        var LOG = LOGGER(globals.projectname + '-' + config.logFileName, log);
        LOG.debug(['[routerConnector.authenticator - Line 200] restUrl:', restUrl, ' globals.projectname:', globals.projectname, ', globals.systemproperties:', globals.systemproperties, ', globals.authdata:*********', ' authenticationType:', authenticationType, ' httpOperation:', httpOperation]);

        var error = bizagiUtil.validator.requiredParameters({
            'authenticationtype': authenticationType,
            'resturl': restUrl,
            'httpoperation': httpOperation,
            'callback': callback
        });
        if (error) {
            LOG.error(['[routerConnector.authenticator - Line 209] restUrl:', restUrl, ', Error: ', error]);
            callback(error);
            return;
        }

        if (authenticationType in authenticators) {
            var auth = bizagiUtil.loadModule(path.join(__dirname, 'auth', authenticationType, 'auth'));
            auth.invoke(globals.authdata, globals.systemproperties, restUrl, httpOperation, LOG, config.enableHttpsVerification, callback);
        }
        else {
            var err = RESPONSE(null, null, -200, ERROR('AUTH.UNKNOW', [authenticationType]));
            LOG.error(['[routerConnector.authenticator - Line 220] restUrl:', restUrl, ', Error: ', error]);

            callback(err);
        }

    } catch (e) {
        var code = e.code;
        var er = null;
        if (code == "MODULE_NOT_FOUND") {
            er = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(__dirname, 'auth', authenticationType, 'auth')]));
        }
        else {
            er = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-ctrl.routerConnector.authenticator']));
        }
        if (LOG){
            LOG.error(['[routerConnector.authenticator - Line 235] restUrl:', restUrl, ', globals:', globals, ', authenticationType:', authenticationType, ', Exception:', e, ]);
        }
        callback(er);
    }
}

function customAuthenticator(globals, connectorPath, callback, enableLog) {
    try {
        var result = bizagiUtil.validator.isValidGlobalsJson(globals);
        if (result.success) {
            globals = result.response.outputs.output;
        }
        else {
            callback(result);
            return;
        }

        var log = (String(enableLog) === "true");
        var LOG = LOGGER(globals.projectname + '-' + config.logFileName, log);
        LOG.debug(['[routerConnector.customAuthenticator - Line 254] connectorPath:', path.resolve(connectorPath), ', authData:*********', ', systemProperties:', globals.systemproperties]);

        var error = bizagiUtil.validator.requiredParameters({'connectorpath': connectorPath, 'callback': callback});
        if (error) {
            LOG.error(['[routerConnector.customAuthenticator - Line 258] connectorPath:', path.resolve(connectorPath), ', Error: ', error]);
            callback(error);
            return;
        }

        var bizagiRouter = bizagiUtil.loadModule(path.join(connectorPath, 'bizagiRouter'));
        bizagiRouter.authenticator(globals, callback, enableLog);

    } catch (e) {
        var code = e.code;
        var err = null;
        if (code == "MODULE_NOT_FOUND") {
            err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(connectorPath, 'bizagiRouter')]));
        }
        else {
            err = RESPONSE(null, null, -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-ctrl.routerConnector.customAuthenticator']));
        }
        if (LOG){
            LOG.error(['[routerConnector.customAuthenticator - Line 276] connectorPath:', path.resolve(connectorPath), ', Exception:', e, ', globals:', globals, ', connectorPath:', connectorPath]);
        }
        callback(err);
    }
}

function cleanModuleCache(globals, connectorPath, callback, enableLog) {
    try {
        var result = bizagiUtil.validator.isValidGlobalsJson(globals);
        if (result.success) {
            globals = result.response.outputs.output;
        }
        else {
            callback(result);
            return;
        }

        var log = (String(enableLog) === "true");
        var LOG = LOGGER(globals.projectname + '-' + config.logFileName, log);

        var error = bizagiUtil.validator.requiredParameters({'connectorpath': connectorPath});
        if (error) {
            LOG.error(['[routerConnector.cleanModuleCache - Line 298] connectorPath:', connectorPath, ', Error: ', error]);
            callback(error);
            return;
        }

        var bizagiRouter = bizagiUtil.loadModule(path.join(connectorPath, 'bizagiRouter'));
        bizagiUtil.cleanModuleCache(path.join(connectorPath, 'bizagiRouter'));

        bizagiRouter.cleanAllModulesCache(globals, callback, enableLog);

        LOG.debug(['[routerConnector.cleanModuleCache - Line 308] connectorPath:', connectorPath, ', Clean Module:', path.join(connectorPath, 'bizagiRouter')]);

    } catch (e) {
        var code = e.code;
        var err = null;
        if (code == "MODULE_NOT_FOUND") {
            err = RESPONSE(null, null, -200, ERROR('GLB.RESOURCE_NOT_FOUND', [path.join(connectorPath, 'bizagiRouter')]));
        }
        else {
            err = RESPONSE(null, null -200, ERROR('GLB.EXCEPTION', [e.message, e, 'bz-ctrl.routerConnector.cleanModuleCache']));
        }
        if (LOG){
            LOG.error(['[routerConnector.cleanModuleCache - Line 320] connectorPath:', connectorPath, ', Exception:', e, ', globals:', globals]);
        }
        callback(err);
    }
}

process.on('uncaughtException', function (err) {
    var fs = require('fs');
    var fsmk = require('node-fs');
    var LOG = require('./etc/logger');

    var fileLog = path.join(config.logsPath, 'ctrl-exceptions.log');
    if (!fs.existsSync(config.logsPath)) {
        fsmk.mkdirSync(config.logsPath, 0666, true);
    }

    fs.appendFileSync(fileLog, LOG('ERROR - Line 336', [err]));
    process.exit(0);
});

exports.invokeCustomAction = invokeCustomAction;
exports.invokeRestAction = invokeRestAction;
exports.customAuthenticator = customAuthenticator;
exports.authenticator = authenticator;
exports.cleanModuleCache = cleanModuleCache;