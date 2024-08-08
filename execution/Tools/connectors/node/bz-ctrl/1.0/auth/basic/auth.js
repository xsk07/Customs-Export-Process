/**
 *
 * @author JarveinR
 *
 */
 
var bizagiUtil = require('bz-util');
var RESPONSE = bizagiUtil.getResponse;

function invoke(authData, systemProperties, restUrl, httpOperation, LOG, enableHttpsVerification, callback){
    var error = bizagiUtil.validator.requiredParameters({'authdata.username': authData.username, 'authdata.password': authData.password});
    if (error){
        LOG.error(['[authenticator.basic] restUrl: ', restUrl, ', Error: ', error]);
        callback(error);
        return;
    }    
    
    var username = authData.username;
	var password = authData.password;

	var auth = new Buffer(username + ":" + password).toString('base64');
	auth = "Basic " + auth;			
	
    var reply = RESPONSE({authorizationheader: auth}, null, 200);
    
    LOG.info(['[authenticator.basic] restUrl: ', restUrl, ', Success:true, response: ', reply]);
	callback(reply);
}

exports.invoke = invoke;