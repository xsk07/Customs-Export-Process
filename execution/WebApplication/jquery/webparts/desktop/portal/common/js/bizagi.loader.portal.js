//var BIZAGI_ENABLE_LOG = true;
//var BIZAGI_ENABLE_CUSTOMIZATIONS = false;

//var BIZAGI_ENVIRONMENT = 'debug';
//var BIZAGI_ENABLE_LOG = true;

var BIZAGI_ENVIRONMENT = undefined;
var BIZAGI_ENABLE_LOG = false;

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};

bizagi.initializingWorkportal = typeof (bizagi.initializingWorkportal) !== "undefined" ? bizagi.initializingWorkportal : false;
bizagi.workportalInstances = {};

var queryString = bizagi.readQueryString();
var BIZAGI_ENVIRONMENT = typeof (BIZAGI_ENVIRONMENT) !== "undefined" ? BIZAGI_ENVIRONMENT : (queryString["environment"] || "release");

// DYNAMIC LOAD CSS 
// THIS CSS IS NECESARY BEFORE JQUERY BIZAGI ENGINE START 
// Define functions
bizagi.loadWebPartInitStyle = function (params) {

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = params.serverurl + "jquery/webparts/desktop/portal/common/css/bizagi.webpart.init.css";
    link.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(link);

};

// If not defined for IE8+, will define this function using getElementsByTagName("*")
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (classname) {
        var a = [];
        var re = new RegExp('(^| )' + classname + '( |$)');
        var els = this.getElementsByTagName("*");
        for (var i = 0, j = els.length; i < j; i++)
            if (re.test(els[i].className)) a.push(els[i]);
        return a;
    };
    Element.prototype.getElementsByClassName = document.getElementsByClassName;
}



bizagi.startWaiting = function (canvas) {

    var waiting = document.createElement('div');
    var divWaitingId = canvas.id + '-waiting';
    waiting.setAttribute('id', divWaitingId);
    waiting.setAttribute('class', 'ui-bizagi-sharepoint-loading-container');
    var waitingIcon = document.createElement('div');
    var divWaitingIconId = canvas.id + '-waiting-icon';
    waitingIcon.setAttribute('id', divWaitingIconId);
    waitingIcon.setAttribute('class', 'ui-bizagi-sharepoint-loading-icon');
    waiting.appendChild(waitingIcon);
    canvas.appendChild(waiting);
};


bizagi.endWaiting = function (canvas) {
    if (canvas != null) {
        //Se hicieron pruebas en varios portales y es posible que el portal incluya .js que ya tengan definida la funcion getElementsByClassName la cual puede comportarse diferente en cada caso por lo tanto es necesario asegurar que borre los wait
        var waitingElementVector = canvas.getElementsByClassName("ui-bizagi-sharepoint-loading-container");
        if (waitingElementVector != null) {
            //implementación similar a la de Bizagi
            var i = 0;
            while (element = waitingElementVector[i++]) {
                canvas.removeChild(element);
            }
        }
        waitingElementVector = canvas.getElementsByClassName("ui-bizagi-sharepoint-loading-container");
        if (waitingElementVector != null) {
            //implementación Chrome, mozilla y SHP2013
            while (waitingElementVector.length > 0) {
                var element = waitingElementVector[0];
                canvas.removeChild(element);
            }
        }
    }
};


//Init to use functions
var canvasCollection = document.getElementsByClassName('bz-webpart');
for (var i = 0; i < canvasCollection.length; i++) {
    bizagi.startWaiting(canvasCollection[i]);
}




// Gets the loader instance, and load the module
bizagi.initializeWorkportal = function (params) {
    //Load css file for waiting image


    var bizagiServerURL = window.location.href.substring(0, window.location.href.indexOf("jquery"));
    bizagi.loadWebPartInitStyle({ serverurl: bizagiServerURL });
    if (bizagi.initializingWorkportal) {
        // Wait until the loader has been initialized and execute callback
        var doMutexLoop = function () {
            if (bizagi.initializingWorkportal) {
                setTimeout(doMutexLoop, 50);
            } else {

                setTimeout(function () {
                    // Callback function
                    if (params.whenInitialized){
                        bizagi.executeAfterLoad(function () { 
                            params.whenInitialized(bizagi.getWorkportalInstance(params)); 
                        });
                    }
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
            loader.start("portal");
            // Load extrafiles
            if (params.additionalFiles) loader.loadFile(params.additionalFiles);

            // Load overrides
            //loader.loadFile(bizagi.getJavaScript("sharepoint.internals.overrides"), bizagi.getJavaScript("sharepoint.overrides"), bizagi.getJavaScript("wp.internals.desktop.overrides"), bizagi.getJavaScript("wp.desktop.overrides"));
            loader.loadFile(
              //  bizagi.getJavaScript("bizagi.sharepoint.internals.overrides"),  //Included  in definitionjson
              bizagi.getJavaScript("bizagi.sharepoint.overrides"),   
              //  bizagi.getJavaScript("bizagi.workportal.internals.desktop.overrides"), //Included  in definitionjson
                bizagi.getJavaScript("bizagi.workportal.desktop.overrides")
            );
            //bizagi.getJavaScript("common.base.lib.less"), 
            // Load workportal
            loader.then(function () {
                bizagi.initializingWorkportal = false;

                // Get user language
                $.when(bizagi.getUserSettings(params), bizagi.getTheme() ) 
				.pipe(function (data, theme) {
				    if (data) {
                        if (bizagi.override && typeof (bizagi.override.renderDateFormat) != "undefined") {
                            data.shortDateFormat = bizagi.override.renderDateFormat;
                        }
				        bizagi.localization.setLanguage(data.language);
				        bizagi.loader.preInit(["bizagiDefault", BIZAGI_ENVIRONMENT, undefined, BIZAGI_PATH_TO_BASE], [
                            data.language, "debug" == BIZAGI_ENVIRONMENT, "10",
                            [data.symbol, data.decimalSeparator, data.groupSeparator, data.decimalDigits],
                            [data.shortDateFormat, data.timeFormat, data.longDateFormat, data.twoDigitYearMax, data.twoDigitYearMaxDelta],
                            [undefined, undefined], undefined,
                            "ASP.NET_SessionId", undefined
                        ]);
				    }
				    return bizagi.localization.ready();
				}).done(function () {
                    // Callback function
                    if (bizagi.override && typeof(bizagi.override.renderDateFormat) != "undefined") {
                        BIZAGI_DEFAULT_DATETIME_INFO.shortDateFormat = bizagi.override.renderDateFormat;
                    }
				    if (BIZAGI_DEFAULT_DATETIME_INFO) {
				        if (BIZAGI_DEFAULT_DATETIME_INFO.shortDateFormat) bizagi.localization.overrideSpecificResource("dateFormat", BIZAGI_DEFAULT_DATETIME_INFO.shortDateFormat);
				        if (BIZAGI_DEFAULT_DATETIME_INFO.shortDateFormat) bizagi.localization.overrideSpecificResource('timeFormat', BIZAGI_DEFAULT_DATETIME_INFO.timeFormat);
				    }
				    if (params.whenInitialized){
                        bizagi.executeAfterLoad(function () { 
                            params.whenInitialized(bizagi.getWorkportalInstance(params)); 
                        });
                    }
				});
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
    params.context = params.context || "portal";

    // Cache the result and return
    bizagi.workportalInstances[project] = new bizagi.workportal.facade(params);
    return bizagi.workportalInstances[project];
};

// This method can only be executed after all workportal dependency scripts has been loaded
bizagi.getUserSettings = function (params) {
    //Override the login function, this is only necesary in WorkPortal
    bizagi.services.ajax.loginPage = bizagi.loginFunc();

    var project = params.project || "default";
    var defer = new $.Deferred();
    // Else create a new one
    params.context = params.context;

    // Create a new services proxy object 
    var services = new bizagi.workportal.services.service(params);

    $.when(services.getCurrentUser())
			.pipe(function (data) {
			    return defer.resolve(data);
			}).fail(function (data) {
			    return defer.resolve(null);
			});

    return defer.promise();
};

bizagi.getTheme = function(forceToGet){
    var services = new bizagi.workportal.services.service();
    forceToGet = (typeof forceToGet == "undefined")? false : forceToGet;

    if(typeof bizagi.theme == "object" && bizagi.theme.length > 0 && !forceToGet){
        return bizagi.theme;
    }

    return $.when(services.getCurrentTheme()).done(function (data) {
                data = data || [];

                if (data.css) {
                    //Define theme as a global var to access from webparts
                    bizagi.theme = data;
                    if(bizagi.theme.value){
                        try{
                            bizagi.theme.value = JSON.parse(bizagi.theme.value);
                        }catch(e){}
                    }

                    // Create new css element
                    var styles = $('head link [rel="stylesheet"]');
                    var customStyles;

                    for (var i = 0; i < styles.length; i++) {
                        var href = $(styles[i]).attr('href');

                        var match = href.indexOf('bizagi.custom.styles.css');

                        if (match != -1) {
                            customStyles = $(styles[i]);
                            break;
                        }
                    };


                    if (customStyles) {
                        $('<style id="bizagi-theme">' + data.css + '</style>').insertBefore(customStyles);
                    } else {
                        $('head').append('<style id="bizagi-theme">' + data.css + '</style>');
                    }
                }
            });

}

bizagi.loginFunc = function (params) {
    return null;
};

bizagi.addLoadHandlers = function (functionByParam) {
    if (window.attachEvent) {
        window.attachEvent('onload', functionByParam);
    } else {
        if (window.onload) {
            window.addEventListener('load', functionByParam);
        } else {
            window.onload = functionByParam;
        }
    }
};

bizagi.executeAfterLoad = function (fn) {
    $.when(fn())
    .then(function () {
        window.clearTimeout(bizagi.loadTimeoutID);
        bizagi.loadTimeoutID = window.setTimeout(function () {

       bizagi.util.loadFile({
                src: bizagi.getStyleSheet("bizagi.overrides.desktop.custom.styles"),
                type: "css"
            });
            bizagi.util.loadFile({
                src: bizagi.getStyleSheet("bizagi.webparts.desktop.portal.override"),
                type: "css"
            });

        }, 400);
    });
};
