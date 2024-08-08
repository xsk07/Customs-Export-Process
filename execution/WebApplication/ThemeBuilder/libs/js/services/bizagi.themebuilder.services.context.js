/*
*   Name: BizAgi Theme Builder Service Context Factory
*   Author: Diego Parra (based on Edward Morales version)
*   Comments:
*   -   This script will define the endpoints to be used based on the given context
*/

$.Class.extend("bizagi.themebuilder.services.context", {}, {
//$.extend("bizagi.themebuilder.services.context", {}, {
    /* 
    *   Constructor
    */
    init: function (params) {
        this.context = params.context;
        this.endPoints = bizagi.themebuilder.services.getEndPoints(params);

        //this.proxyPrefix = !bizagi.util.isEmpty(params.proxyPrefix) ? params.proxyPrefix : "";
        this.proxyPrefix = "";
    },

    /*
    *   Returns the given url for a specified service
    */
    getUrl: function (service) {
        if (this.endPoints[service] == undefined) {
            bizagi.log("Url not found","No endpoint defined for: " + service);
        }
        return this.endPoints[service];
    }
});
