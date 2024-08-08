/**
 *
 * @author JarveinR
 *
 */
 
var MODULES = {};

function loadModule (modulePath){
    if (modulePath in MODULES){
        return MODULES[modulePath];
    }
    else{
        var module = require(modulePath);
        MODULES[modulePath] = module;
        return module;
    }
}

function cleanAllModulesCache(){
    MODULES = {};
}

function cleanModuleCache(modulePath){
    delete MODULES[modulePath];
}

exports.loadModule = loadModule;
exports.cleanAllModulesCache = cleanAllModulesCache;
exports.cleanModuleCache = cleanModuleCache;