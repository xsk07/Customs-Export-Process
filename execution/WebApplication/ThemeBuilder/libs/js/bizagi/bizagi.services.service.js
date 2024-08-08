/*
*   Name: BizAgi Services
*   Author: Diego Parra
*   Comments:
*   -   This class will provide a facade to access to all REST services available in Bizagi
*   -   Can be extendable by each sub-module ex. rendering
*/

$.Class.extend("bizagi.services.service", {}, {
    /* 
    *   Constructor
    */
    init: function () {

    },
    getResourceDictionaryFrankie: function () {
        var proxyPrefix =  BIZAGI_THEME_WPORTAL;
        var language = bizagi.language.substring(0, 2);
        return $.ajax({
            url:proxyPrefix+  "Rest/Multilanguage/Client?cultureName="+ language,
            rpcEnabled: false,
            dataType: "json",
            async: true
        });
    },

    getResourceDictionary: function (url) {
        return $.ajax({
            url: url,
            rpcEnabled: false,
            dataType: "json",
            async: true
        });
    }
});
