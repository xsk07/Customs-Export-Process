/**
 *
 * @author JarveinR
 *
 */
 
var request = require('request');
var bizagiUtil = require('bz-util');
var bizagiDigest = require('bz-digest');
var RESPONSE = bizagiUtil.getResponse;
var ERROR = bizagiUtil.error;

function invoke(authData, systemProperties, restUrl, httpOperation, LOG, enableHttpsVerification, callback){
	LOG.debug(['[authenticator.digest] Invoke: restUrl: ', restUrl, ' authdata: ', authData, ' systemproperties: ', systemProperties]);
    
    var error = bizagiUtil.validator.requiredParameters({'authdata.username': authData.username, 'authdata.password': authData.password});
    if (error){
        LOG.error(['[authenticator.digest] restUrl: ', restUrl, ', Error: ', error]);
        callback(error);
        return;
    }    
    
    var username = authData.username;
	var password = authData.password;

    var digest = bizagiDigest.create();

    var requestOptions = {
        url: restUrl,
        method: httpOperation
    };

    digest.getAuthParamsFromChallenge(username, password, requestOptions, function(error, reply){
        if (error){
            var error = RESPONSE(null, error, -400, ERROR('AUTH.ERROR',[error.error]));
            callback(error);

            LOG.error(['[authenticator.digest] restUrl: ', restUrl, ', Error: ', ERROR('AUTH.ERROR',[error.error])]);
        }
        else{
            var reply = RESPONSE(reply, null, 200);
            callback(reply);

            LOG.debug(['[authenticator.digest] restUrl: ', restUrl, ', Success:true, response: ', reply]);
        }
    });
}

exports.invoke = invoke;