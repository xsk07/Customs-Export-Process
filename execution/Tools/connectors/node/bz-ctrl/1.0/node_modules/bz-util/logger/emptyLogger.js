/**
 *
 * @author JarveinR
 *
 */
 
 var isEnabled = false;
 
function doNothing(msg){};

exports.debug = doNothing;
exports.error = doNothing;
exports.info = doNothing;
exports.warn = doNothing;
exports.trace = doNothing;
Object.defineProperty(exports, "isEnabled", {value:isEnabled});