/**
 *
 * @author JarveinR
 *
 */
 
var util = require('util');
var path = require('path');
var errors;

module.exports = function (error, parameters){
    if(!errors){
        try{
            errors = defaultErrors();
            var userErrors = require(path.join(__dirname, '../../etc/errors'));
            if (userErrors){
                for(var key in userErrors){
                    if (!errors[key]){
                        errors[key] = userErrors[key];
                    }
                }
            }
        }catch(exception){
            errors = defaultErrors();
        }
    }
    
    if (error in errors){
        if (typeof parameters !== 'undefined' && parameters.constructor === Array){            
            if (parameters.length > 0){
                var param = '';
                for (var i = 0; i < parameters.length; i++){
                    var value = parameters[i];
                    if(value instanceof Object){
                        value = JSON.stringify(value);
                    }
                    else if(value instanceof Error) {
                        value = value.message;
                    }
                    else{
                        value = String(value);
                    }

                    if(value) {
                        value = value.replace(/\"/g, "");
                        value = value.replace(/\'/g, "");
                        value = value.replace(/\\/g, "/");
                    }
                    param += "'" + value + "'";
                    if (i != (parameters.length - 1)){
                        param += ",";
                    }
                }

                var call = "util.format('" + errors[error] + "', " + param + ");";
                var msg = eval(call);            

                return msg;
            }            
        }        
        return errors[error];            
    }    
    return "";    
}

function defaultErrors(){
    errors = {
        "GLB.EXCEPTION": "Exception Error, %s, %s, location: %s",
        "GLB.IS_NOT_A": "%s is not a %s",
        "GLB.IS_NOT_AN": "%s is not an %s",
        "GLB.UNKNOW_ACTION": "Unknown action: %s",
        "GLB.RESOURCE_REDIRECT": "Server is requesting the client to perform a redirect, the HttpCode is: %s",
        "GLB.RESOURCE_NOT_FOUND": "Resource not found: %s",
        "GLB.RESPONSE_ERROR": "An error was obtained by processing the request, the HttpCode is : %s, the server response was: %s",
        "VAL.REQUIRED_PARAM": "The Parameter -%s- is required",
        "VAL.REQUIRED_ELEMENT": "The element -%s- is required in -%s-",
        "VAL.REQUIRED_PARAMS": "The Parameters are required: %s",
        "VAL.PARAM_TYPE": "The -%s- parameter must be a valid %s"
    };

    return errors;
}