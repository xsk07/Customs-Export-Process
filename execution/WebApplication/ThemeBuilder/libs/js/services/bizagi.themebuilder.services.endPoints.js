/*
 *   Name: BizAgi Services WorkPortal End Points
 *   Author: David Niño (based on Edward Morales and Diego Parra version)
 *   Comments:
 *   -   This script defines all the end-points used to retrieve ajax stuff
 *   -   All urls must be relative to the base application
 */

// Create or define namespace
bizagi.themebuilder = (typeof (bizagi.themebuilder) !== "undefined") ? bizagi.themebuilder : {};
bizagi.themebuilder.services = (typeof (bizagi.themebuilder.services) !== "undefined") ? bizagi.themebuilder.services : {};
bizagi.themebuilder.services.endPoints = [];

// Creates a endpoint hash factory to resolve custom requirements
bizagi.themebuilder.services.getEndPoints = function(params) {
    // Default workportal end-points
    return {
    	getMenuAuthorization: params.proxyPrefix + "Rest/Authorization/MenuAuthorization",
    	getCurrentTheme: params.proxyPrefix + "Api/Theme/Current",
        getAllThemes: params.proxyPrefix + "Rest/Theme/",
        createTheme: params.proxyPrefix + "Rest/Theme/",
        publishTheme: params.proxyPrefix + "Rest/Theme/Publish/Theme",
        updateTheme: params.proxyPrefix + "Rest/Theme/%s",
        deleteTheme: params.proxyPrefix + "Rest/Theme/%s",
        getFileData: params.proxyPrefix + "Rest/Theme/GetFileData"
    };
};