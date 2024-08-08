/**
 *
 * @author JarveinR
 *
 */
 
var util = require('util');
var path = require('path');
var moment = require('moment');
var textLog;

module.exports = function (msg, parameters){
    if(!textLog){
        try{
            textLog = require(path.join(__dirname, 'textLog'));
        }catch(e){
            console.log(e);
        }
    }

    var now = moment().year() + '-' + (moment().month() + 1) + '-' + moment().date() + ' ' + moment().hour() + ':' + moment().minute() + ':' + moment().second();
    var prefix = '[' + now + '] [INFO] server - ';

    if (msg in textLog){
        if (typeof parameters !== 'undefined' && parameters.constructor === Array){            
            if (parameters.length > 0){
                var param = '';
                for (var i = 0; i < parameters.length; i++){
                    var value = parameters[i];
                    if (typeof value === 'object'){
                        value = JSON.stringify(value);
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

                var call = "util.format('" + textLog[msg] + "', " + param + ");";
                var msg = eval(call);

                return prefix + msg + '\n';
            }            
        }        
        return prefix + textLog[msg] + '\n';
    }    
    return '\n';
}