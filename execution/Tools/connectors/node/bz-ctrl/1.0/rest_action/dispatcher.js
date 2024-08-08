/**
 *
 * @author JarveinR
 *
 */
 
var request = require('request');
var crypto = require('crypto');
var bizagiUtil = require('bz-util');
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;

function send(options, LOG, callback){
    try {
        var hash = '';
        if (LOG.isEnabled === true){
            var date = new Date();
            var time = date.getTime();
            var optionsAsString = JSON.stringify(options);
            hash = crypto.createHash('md5').update(time.toString() + optionsAsString).digest('hex');

            var optionsWithoutAuth = JSON.parse(optionsAsString);
            if (optionsWithoutAuth.headers && optionsWithoutAuth.headers.Authorization) {
                optionsWithoutAuth.headers.Authorization = "***************************";
            }

            LOG.debug(['[REST_ACTION.REQUEST - Line 27] RequestInternalId:', hash, ', Sending DataRequest:', optionsWithoutAuth]);
        }

        request(options, function (error, response, body) {
            if (error){
                var e = error;
                var statusCode = 400;
                if(response){
                    statusCode = response.statusCode;
                }

                if (error.code == 'ECONNREFUSED' || error.code == 'ENOTFOUND' || error.code == 'ENOENT'){
                    var message = ERROR('GLB.RESOURCE_NOT_FOUND', [options.url]);
                    error = RESPONSE(null, {error:'RESOURCE_NOT_FOUND', message:message, status:404}, 404, message);
                }
                else{
                    if(error instanceof Error){
                        error = error.message;
                    }
                    else if(error instanceof Object){
                        error = JSON.stringify(error);
                    }

                    error = RESPONSE(null, {error:'CONNECTION_ERROR', message:error, status:statusCode}, statusCode, error);
                }
                LOG.error(['[REST_ACTION.RESPONSE - Line 52] RequestInternalId:', hash, ', Error:', error, ', ORIGINAL_ERROR:', e]);

                callback(error);
            }
            else{
                if(response.statusCode >= 200 && response.statusCode < 300) {
                    var reply = RESPONSE(body, null, response.statusCode);
                    LOG.debug(['[REST_ACTION.RESPONSE - Line 59] RequestInternalId:', hash, ', Success:true, DataResponse: ', reply]);

                    callback(reply);
                }
                else if(response.statusCode >= 300 && response.statusCode < 400) {
                    var message = ERROR('GLB.RESOURCE_REDIRECT', [response.statusCode]);
                    error = RESPONSE(null, {error:'RESOURCE_REDIRECT', message:message, status:response.statusCode}, response.statusCode);
                    LOG.error(['[REST_ACTION.RESPONSE - Line 66] RequestInternalId:', hash, ', Error:', error, ', ORIGINAL_ERROR:', body]);

                    callback(error);
                }
                else if(response.statusCode == 400) {
                    var message = ERROR('GLB.BAD_REQUEST');
                    error = RESPONSE(null, {error:'BAD_REQUEST', message:message, status:response.statusCode}, response.statusCode);
                    LOG.error(['[REST_ACTION.RESPONSE - Line 73] RequestInternalId:', hash, ', Error:', error, ', ORIGINAL_ERROR:', body]);

                    callback(error);
                }
                else if(response.statusCode == 401) {
                    var message = ERROR('AUTH.USER_UNAUTHORIZED');
                    error = RESPONSE(null, {error:'USER_UNAUTHORIZED', message:message, status:response.statusCode}, response.statusCode);
                    LOG.error(['[REST_ACTION.RESPONSE - Line 80] RequestInternalId:', hash, ', Error:', error, ', ORIGINAL_ERROR:', body]);

                    callback(error);
                }
                else if(response.statusCode == 404) {
                    var message = ERROR('GLB.RESOURCE_NOT_FOUND', [options.url]);
                    error = RESPONSE(null, {error:'RESOURCE_NOT_FOUND', message:message, status:response.statusCode}, response.statusCode);
                    LOG.error(['[REST_ACTION.RESPONSE - Line 87] RequestInternalId:', hash, ', Error:', error, ', ORIGINAL_ERROR:', body]);

                    callback(error);
                }
                else if(response.statusCode >= 500) {
                    var message = ERROR('GLB.INTERNAL_SERVER_ERROR');
                    error = RESPONSE(null, {error:'INTERNAL_SERVER_ERROR', message:message, status:response.statusCode}, response.statusCode);
                    LOG.error(['[REST_ACTION.RESPONSE - Line 94] RequestInternalId:', hash, ', Error:', error, ', ORIGINAL_ERROR:', body]);

                    callback(error);
                }
                else{
                    var message = ERROR('GLB.RESPONSE_ERROR', [response.statusCode, body]);
                    error = RESPONSE(null, {error:body, message:message, status:response.statusCode}, response.statusCode);
                    LOG.error(['[REST_ACTION.RESPONSE - Line 101] RequestInternalId:', hash, ', ORIGINAL_ERROR:', body]);

                    callback(error);
                }
            }
        });
    } catch (e) {
        var message = ERROR('GLB.RESPONSE_ERROR', [500, e]);
        var err = RESPONSE(null, {error:'EXCEPTION', message:message, status:500}, 500);
        if (LOG){
            LOG.error(['[REST_ACTION.EXCEPTION - Line 111] Exception:', e, ', DataRequest:', options]);
        }
        callback(err);
    }
}

exports.send = send;