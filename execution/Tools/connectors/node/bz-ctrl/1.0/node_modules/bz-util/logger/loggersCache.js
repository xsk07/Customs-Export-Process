/**
 *
 * @author JarveinR
 *
 */
 
var LOGGERS = {};

module.exports = function (loggername){
    try {
        if (loggername in LOGGERS) {
            return LOGGERS[loggername];
        }
        else {
            var BizagiLogger = require('./bizagiLogger').BizagiLogger;                     
            LOGGERS[loggername] = new BizagiLogger(loggername);
            return LOGGERS[loggername];
        }
    }catch (e){
        throw e;
    }
}