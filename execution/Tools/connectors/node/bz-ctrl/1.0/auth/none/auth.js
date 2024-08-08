/**
 *
 * @author JarveinR
 *
 */
 
var bizagiUtil = require('bz-util');
var RESPONSE = bizagiUtil.getResponse;

function invoke(authData, systemProperties, restUrl, httpOperation, LOG, enableHttpsVerification, callback){
    var reply = RESPONSE({}, null, 200);
    
    LOG.info(['[authenticator.none] restUrl: ', restUrl, ', response: ', reply]);
	callback(reply);
}

exports.invoke = invoke;