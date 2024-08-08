/**
 *
 * @author JarveinR
 *
 */
 
var bizagiOAuth = require('bz-oauth');
var OAuth2 = bizagiOAuth.OAuth2;
var oauth2 = new OAuth2();
var bizagiUtil = require('bz-util');
var ERROR = bizagiUtil.error;
var RESPONSE = bizagiUtil.getResponse;

function invoke(authData, systemProperties, restUrl, httpOperation, LOG, enableHttpsVerification, callback){
    if (authData.response_type){
        var error = RESPONSE(null, null, -400, ERROR("AUTH.INVALID_RESPONSE_TYPE"));
        LOG.error(['[authenticator.oauth2] Url: ', restUrl, ', Error: ', error]);

        callback(error);
        return;
    }
    
    if (authData.access_token){
        var access_token = authData.access_token;
        var accessTokenResponse = {
            access_token: access_token,
            token_type: 'bearer'
        };
        LOG.info(['[authenticator.oauth2] using access_token authentication for ', restUrl, 'Success:true, Response: ', accessTokenResponse]);
        getOAuthResponse(accessTokenResponse, 200, callback);
        return;
    }
    
    error = bizagiUtil.validator.requiredParameters({'authdata.grant_type': authData.grant_type});
    if (error){
        LOG.error(['[authenticator.oauth2] Url: ', restUrl, ', Error: ', error]);
        callback(error);
        return;
    }    
        
    var grant_type = authData.grant_type;
    if (grant_type === 'client_credentials'){
        clientCredentialsFlow(authData, systemProperties, restUrl, LOG, enableHttpsVerification, callback);
    }
    else if (grant_type === 'password'){
        resourceOwnerPasswordCredentialsFlow(authData, systemProperties, restUrl, LOG, enableHttpsVerification, callback);
    }    
    else{
        var error = RESPONSE(null, null, -400, ERROR('AUTH.INVALID_GRANT', [grant_type]));
        LOG.error(['[authenticator.oauth2] Url: ', restUrl, ', Error: ', error]);

        callback(error);
    }
}

function clientCredentialsFlow(authData, systemProperties, restUrl, LOG, enableHttpsVerification, callback){
    var error = bizagiUtil.validator.requiredParameters({'authdata.token_url': authData.token_url, 
                                                         'authdata.client_secret': authData.client_secret,
                                                         'authdata.client_id': authData.client_id
                                                        });
    if (error){
        LOG.error(['[authenticator.oauth2] using client_credentials flow authentication for ', restUrl, ', Error: ', error]);
        callback(error);
        return;
    }    

    var token_url = authData.token_url;
    var client_id = authData.client_id;
    var client_secret = authData.client_secret;	        
    var scope = '';
    if (authData.scope){
        scope = authData.scope;
    }
        
    oauth2.clientCredentialsFlow(token_url, client_id, client_secret, scope, systemProperties, null, enableHttpsVerification, function (error, accessTokenResponse, statusCode, access_token, token_type, expires_in){
        if (error){
            var error = error.error || error;
            if (error.error_description){
                error = error.error_description;
            }
            else if (error.message){
                error = error.message;
            }
            else if (error.error){
                error = error.error;
            }
            else if (error.description){
                error = error.description;
            }

            var error = RESPONSE(null, null, -(statusCode), error);
            
            LOG.error(['[authenticator.oauth2]  using client_credentials flow authentication for ', restUrl, ', Error: ', error]);
            callback(error);
        }
        else{     
            getOAuthResponse(accessTokenResponse, statusCode, callback);            
            LOG.debug(['[authenticator.oauth2]  using client_credentials flow authentication for ', restUrl, ', Success:true, Response: ', accessTokenResponse]);
        }
    });    
}

function resourceOwnerPasswordCredentialsFlow(authData, systemProperties, restUrl, LOG, enableHttpsVerification, callback){
    var error = bizagiUtil.validator.requiredParameters({'authdata.token_url': authData.token_url, 
                                                         'authdata.username': authData.username,
                                                         'authdata.password': authData.password
                                                        });
    if (error){
        LOG.error(['[authenticator.oauth2] using Resource Owner Password Credentials Flow authentication for ', restUrl, ', Error: ', error]);
        callback(error);
        return;
    }    

    var token_url = authData.token_url;
    var username = authData.username;
    var password = authData.password;	        
    var scope = '';
    if (authData.scope){
        scope = authData.scope;
    }

    oauth2.resourceOwnerPasswordCredentialsFlow(token_url, username, password, scope, systemProperties, null, enableHttpsVerification, function (error, accessTokenResponse, statusCode, access_token, token_type, expires_in){
        if (error){
            var error = error.error || error;;
            if (error.error_description){
                error = error.error_description;
            }
            else if (error.message){
                error = error.message;
            }
            else if (error.error){
                error = error.error;
            }
            else if (error.description){
                error = error.description;
            }

            var error = RESPONSE(null, null, -(statusCode), error);
            
            LOG.error(['[authenticator.oauth2] using Resource Owner Password Credentials Flow authentication for ', restUrl, ', Error: ', error]);
            callback(error);
        }
        else{     
            getOAuthResponse(accessTokenResponse, statusCode, callback);  
            LOG.debug(['[authenticator.oauth2] using Resource Owner Password Credentials Flow authentication for ', restUrl, ', Success:true, Response: ', accessTokenResponse]);
        }
    });
}

function getOAuthResponse(accessTokenResponse, statusCode, callback){
    var response = {'authorizationheader': 'Bearer ' + accessTokenResponse.access_token};
    if (accessTokenResponse.token_type == 'mac'){
        response = {'authorizationheader': 'MAC ' + accessTokenResponse.access_token};
    }

    for (var key in accessTokenResponse){
        response[key] = accessTokenResponse[key];
    }

    var reply = RESPONSE(response, null, statusCode);
    callback(reply);
}

exports.invoke = invoke;