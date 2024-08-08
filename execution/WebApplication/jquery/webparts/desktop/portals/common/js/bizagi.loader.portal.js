
var BIZAGI_USE_ABSOLUTE_PATH = typeof (BIZAGI_USE_ABSOLUTE_PATH) !== "undefined" ? BIZAGI_USE_ABSOLUTE_PATH : true;
var BIZAGI_ENABLE_LOG = true;
var BIZAGI_ENABLE_CUSTOMIZATIONS = true;

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};

bizagi.initializingWorkportal = typeof (bizagi.initializingWorkportal) !== "undefined" ? bizagi.initializingWorkportal : false;
bizagi.workportalInstances = {};

var queryString = bizagi.readQueryString();
var BIZAGI_ENVIRONMENT = typeof (BIZAGI_ENVIRONMENT) !== "undefined" ? BIZAGI_ENVIRONMENT : (queryString["environment"] || "release");

// Gets the loader instance, and load the module
bizagi.initializeWorkportal = function (params) {

    if (bizagi.initializingWorkportal) {
        // Wait until the loader has been initialized and execute callback
        var doMutexLoop = function () {
            if (bizagi.initializingWorkportal) {
                setTimeout(doMutexLoop, 50);
            } else {

                setTimeout(function () {
                    // Callback function
                    if (params.whenInitialized) params.whenInitialized(bizagi.getWorkportalInstance(params));    
                }, 300);
            }
        };
        doMutexLoop();
        return;
    }

    bizagi.initializingWorkportal = true;
    var loader = bizagi.loader;
    loader.init({
        url: params.moduleDefinitionFile,
        overrides: params.moduleDefinitionOverrides,
        locationPrefix: params.locationPrefix,
        callback: function () {
            // Load module
            loader.start("portals");
            // Load extrafiles
            if (params.additionalFiles) loader.loadFile(params.additionalFiles);
            // Load workportal
            loader.then(function () {
                bizagi.initializingWorkportal = false;

                // Callback function
                if (params.whenInitialized) params.whenInitialized(bizagi.getWorkportalInstance(params));
            });
        }
    });
    
};

// This method can only be executed after all workportal dependency scripts has been loaded
bizagi.getWorkportalInstance = function (params) {
    var project = params.project || "default";
    if (bizagi.workportalInstances[project]) {
        return bizagi.workportalInstances[project];
    }

    // Else create a new one
    params.context = params.context || "sharepoint";
    params.sharepointProxyPrefix = params.sharepointProxyPrefix || "";
    
    // Cache the result and return
    bizagi.workportalInstances[project] = new bizagi.workportal.facade(params);
    return bizagi.workportalInstances[project];
};

bizagi.AddLoadHandlers = function (functionByParam) {
    if (window.attachEvent) {
        window.attachEvent('onload', functionByParam);
    } else {
        if (window.onload) {
            var curronload = window.onload;
            var newonload = function () {
                curronload();
                functionByParam();
            };
            window.onload = newonload;
        } else {
            window.onload = functionByParam;
        }
    }
}