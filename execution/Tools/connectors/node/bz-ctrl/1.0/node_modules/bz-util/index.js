/**
 *
 * @author JarveinR
 *
 */

var propertiesMgr = require('properties-parser');
var loadModule = require('./loadModule');
var path = require('path');
var validator = require('./validator');
var autotesting  = require('./autotesting');
var config = require('./config');

exports.getResponse = require('./response').getResponse;
exports.error = require('./error');
exports.loadModule = loadModule.loadModule;
exports.cleanAllModulesCache = loadModule.cleanAllModulesCache;
exports.cleanModuleCache = loadModule.cleanModuleCache;
exports.validator = validator;
exports.config = config.config;
exports.LOG = require('./logger/logFactory').log;
exports.autotesting = require('./autotesting');
exports.REQUIRED = function(moduleName){
    if (!autotesting.isAutotestingEnable())
        return loadModule.loadModule(path.join(__dirname, '../../node_modules/', moduleName));
    else
        return loadModule.loadModule(path.join(__dirname, '../../autotesting/', moduleName));
}