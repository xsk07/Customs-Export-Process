// sometimes the load bizagi.loader.js?_4352 get HTTP error 302
if (typeof bizagi === "undefined") {
    window.location.reload();
}

// Gets the loader instance, and load the module
var loader = bizagi.loader;
BIZAGI_PATH_TO_BASE = "./";

loader.nativeAjax(loader.getPathUrl(bizagiConfig.proxyPrefix + "Api/Authentication/BizagiConfig"), function (response) {
    var bizagiConfig = JSON.parse(response.responseText);
    if (bizagiConfig.redirectErrorPage) {
        window.location.href = bizagiConfig.redirectErrorPage;
        return;
    }
    for (var k in bizagiConfig) { window.bizagiConfig[k] = bizagiConfig[k] };
}, function (response) {
    // Error callback
    window.alert("Something went wrong! " + response.responseURL + " " + response.responseText);
});

loader.preInit(["bizagiDefault", bizagiConfig.environment, undefined, "./"], [
      bizagiConfig.defaultLanguage || session.language || "en", bizagiConfig.log || false, bizagi.override.Inbox_RowsPerPage || "",
    [session.symbol || "$", session.decimalSeparator || ",", session.groupSeparator || ".", session.decimalDigits || "2"],
    [session.shortDateFormat || "dd/MM/yyyy", session.timeFormat || "H:mm", session.longDateFormat || "dddd, dd' de 'MMMM' de 'yyyy"],
    [session.uploadMaxFileSize || bizagiConfig.uploadMaxFileSize || "1048576"], "",
    "ASP.NET_SessionId"
]);

loader.init(function () {
    // Check if Bizagi its a oAuth server provider
    var path = location.pathname.split("/");
    var urlParameters = bizagi.readQueryString();
    
    loader.start("common")
          .start("bizagi.services")
          .then(function () {
               var callback = document.referrer;
               var queryString = bizagi.util.getQueryString();
               if (queryString["redirect"]) {
                   // Case no.1 - redirect to user callback url
                   callback = queryString["redirect"];
               }
               
               // Perform logout
               var service = new bizagi.workportal.services.service();
               service.logout(callback);               
          });    
});