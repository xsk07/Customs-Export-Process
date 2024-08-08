/*
 *   Name: BizAgi Master Loader
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a prototype that is capable to load a bizagi definition module
 */
window.oldAlert = window.alert;
window.alert = function (message) {
    if (!message || message.indexOf("UNKNOWN_ERROR") > -1) {
        console.log("Error" + message);
    } else {
        window.oldAlert(message);
    }
};



// Polyfill Array IndexOf
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;
    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

var bizagi = bizagi || {};
bizagi.override = bizagi.override || {};
bizagi.defaultWebPartDefinitionName = "webpart.definition.json.txt";

if (typeof bizagiConfig != "undefined" && bizagiConfig.environment == "release") {
    bizagi.defaultModuleDefinitionPath = "jquery/production/bizagi.module.definition.json.txt";
} else {
    bizagi.defaultModuleDefinitionPath = "jquery/bizagi.module.definition.json.txt";
}

/*
 *   Merges to objects into one
 */
bizagi.merge = function (o1, o2) {
    for (var i in o2) {
        o1[i] = o2[i];
    }
    return o1;
};

/*
 *   Creates a replace all method that is left from the String Class
 */
bizagi.replaceAll = function (text, pcFrom, pcTo) {
    return (text || '').split(pcFrom).join(pcTo);
};

/*
 *   Reads the query string parameters
 */
bizagi.readQueryString = function () {
    var queryString = window.location.search.substring(1);
    var splitQueryString = queryString.split("&");
    var queryStringHashTable = {};
    for (var i = 0; i < splitQueryString.length; i++) {
        var singleKeyValue = splitQueryString[i].split("=");
        queryStringHashTable[singleKeyValue[0]] = singleKeyValue[1];
    }
    return queryStringHashTable;
};

bizagi.isOAuth2Enabled = function () {
    return typeof (BIZAGI_AUTH_TYPE) !== "undefined" && BIZAGI_AUTH_TYPE === "OAuth";
};

bizagi.isFlatDesignEnabled = function () {
    return typeof (BIZAGI_ENABLE_FLAT) !== "undefined" && !!BIZAGI_ENABLE_FLAT;
};

bizagi.getNativeComponent = function () {
    return typeof (BIZAGI_NATIVE_COMPONENT) !== "undefined" ? BIZAGI_NATIVE_COMPONENT : "";
};

/**
 * Detect a device based on the width
 * @returns Device type
 */
bizagi.detectDevice = function () {
    // Check for a hard-coded device
    var device = (typeof (BIZAGI_DEFAULT_DEVICE) !== "undefined"
        && BIZAGI_DEFAULT_DEVICE !== "" ? BIZAGI_DEFAULT_DEVICE : null);

    if (!device) {
        // Check for a device configured in the querystring
        var queryString = bizagi.readQueryString();
        device = queryString && queryString["device"] ? queryString["device"] : null;
    }

    if (device) return device;

    // Check the so
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {

        if (navigator.userAgent.indexOf("iPad") >= 0) {            
            BIZAGI_DEFAULT_DEVICE = "tablet_ios";

            // tablet ios
            return BIZAGI_DEFAULT_DEVICE;
        }

        if (navigator.userAgent.toLowerCase().search("android") > -1 &&
            navigator.userAgent.toLowerCase().search("mobile") == -1) {
            // tablet android
            return BIZAGI_DEFAULT_DEVICE = "tablet_android";
        }

        // for test device android on smartphone
        if (navigator.userAgent.toLowerCase().indexOf("android") >= 0) {
            // smartphone for android
            return BIZAGI_DEFAULT_DEVICE = "smartphone_android";
        }

        // common smartphone use in the future for ios
        return BIZAGI_DEFAULT_DEVICE = "smartphone_ios";
    }

    return "desktop";
};

bizagi.isMobileDevice = function () {
    var device = bizagi.detectDevice();

    return ([
        "smartphone_ios",
        "smartphone_ios_native",
        "smartphone_android",
        "smartphone_android_native",
        "tablet",
        "tablet_ios",
        "tablet_ios_native",
        "tablet_android",
        "tablet_android_native"
    ].indexOf(device) > -1);
};

bizagi.detectSO = function () {
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
        if (navigator.userAgent.toLowerCase().search("android") > -1) {
            return "android";
        } else {
            return "ios";
        }
    }

    return "ios";
};

bizagi.isMobile = function () {
    if (typeof bizagi.util.isMobile !== "undefined") {
        return bizagi.util.isMobile;
    }

    if (bizagi.isMobileDevice()) {
        bizagi.util.isMobile = true;
        return true;
    } else {
        bizagi.util.isMobile = false;
        return false;
    }

};

bizagi.detectRealDevice = function () {
    var device;
    var settedDevice = (typeof (BIZAGI_DEFAULT_DEVICE) !== "undefined" && BIZAGI_DEFAULT_DEVICE !== "" ? BIZAGI_DEFAULT_DEVICE : null);
    BIZAGI_DEFAULT_DEVICE = "";
    device = bizagi.detectDevice();
    BIZAGI_DEFAULT_DEVICE = settedDevice;

    if (settedDevice.indexOf("native") >= 0) {
        device = device + "_native";
    }

    return device;
};

/*
 *   Creates a bizagi resource loader object definition
 *   Note: This requires steal to be loaded first
 *   Note: This requires global variable BIZAGI_PATH_TO_BASE in order to work properly
 */
bizagi.loaderPrototype = function () {
    // Variable creation
    this.xhr = null;
    this.environment = "debug";
    this.bName = "bizagi_";
    this.initializing = false;
    this.initialized = false;
    this.useAbsolutePath = false;
    this.build = "";
    this.loadedModules = {};
    this.definedModules = {};
    this.externalModules = [];
    this.resources = {
        js: {},
        css: {},
        tmpl: {},
        l10n: {},
        webparts: {}
    };
    this.webparts = {};
    this.moduleDefinition = null;
    this.moduleDefinitionUrl = null;
    this.moduleDefinitionOverrides = null;

    this.tform = function () {
        return this.bName.toUpperCase() + (typeof (arguments[0]) !== "undefined" ? arguments[0].toUpperCase().replace(/-/g, '_') : "");
    };

    this.preInit = function (params, postParams) {
        var self = this, length = params.length, i = 0, result = "", param;
        var vars = ["theme", "environment", "use-absolute-path", "path-to-base"];

        for (; i < length;) {
            param = params[i];
            if (typeof param === "string") {
                param = '"' + param + '"';
            }
            if (typeof param === "undefined") {
                param = param;
            }
            result += self.tform(vars[i]) + " = " + param + ";\n";
            i++;
        }

        if (result !== "") {
            eval(result);
        }

        if (postParams !== undefined) {
            if (typeof mapVariables != "undefined") {
                mapVariables.apply(self, [postParams]);
            } else {
                // Something went wrong, its necessary to refresh the page
                var key = Date.now();
                window.location = "index.html?_" + key;
            }
        }

    };
    
    // Method definition
    // Creation method
    this.init = function (params) {
        var self = this;
        this.xhr = null;
        var theme = params.theme || (typeof (BIZAGI_THEME) !== "undefined" ? BIZAGI_THEME : "bizagiDefault");
        var queryString = bizagi.readQueryString();
        this.environment = typeof (BIZAGI_ENVIRONMENT) !== "undefined" ? BIZAGI_ENVIRONMENT : (queryString["environment"] || this.environment);
        this.useAbsolutePath = typeof (BIZAGI_USE_ABSOLUTE_PATH) !== "undefined" ? BIZAGI_USE_ABSOLUTE_PATH : false;
        this.basePath = params.basePath ? params.basePath : location.protocol + "//" + location.host;
        var url = params.url ? params.url : bizagi.defaultModuleDefinitionPath;
        var callback = params.callback ? params.callback : (typeof (params) == "function" ? params : null);
        this.moduleDefinitionOverrides = params.overrides ? params.overrides : null;

        /*
         *   If the loader has been initialized just execute the callback
         */
        if (this.initialized) {
            // Callback function
            if (callback) callback();
            return;
        }

        if (this.initializing) {
            // Wait until the loader has been initialized and execute callback
            var doMutexLoop = function () {
                if (self.initializing) {
                    setTimeout(doMutexLoop, 50);
                } else {
                    // Callback function
                    if (callback) callback();
                }
            };
            doMutexLoop();
            return;
        }

        // Turn initializing flag on
        this.initializing = true;

        // Depending on what the browser supports, use the right way to create the XMLHttpRequest object
        if (window.XMLHttpRequest) {
            // Mozilla, Safari would use this method ...
            this.xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE would use this method ...
            this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        // Build base path
        // this.basePath = location.protocol + "//" + location.host;
        var locationParts = location.pathname.split("/");
        if (params.skipVersionCheck) {
            self.version = "";
            self.channel = "";
        } else {
            var versionUrl = this.getPathUrl("jquery/version.json.txt");
            this.nativeAjax(versionUrl, function (data) {
                self.version = JSON.parse(data.responseText).build;
                self.channel = JSON.parse(data.responseText).channel || "CURRENT";
            });
        }

        if (url.indexOf("?ver") == -1) url += "?ver=" + this.version;

        if (typeof bizagiConfig != "undefined" && bizagiConfig.cdn && bizagiConfig.cdn != "") {
            this.basePath = bizagiConfig.cdn;
            this.useAbsolutePath = true;
        }

        if (this.useAbsolutePath) {
            this.moduleDefinitionUrl = this.basePath + url;
            // Initialize steal root path
            steal.config({ root: this.basePath });
        } else {
            var pathToBaseBackwards = BIZAGI_PATH_TO_BASE.split("../").length;
            for (var i = 0; i < locationParts.length - pathToBaseBackwards; i++) {
                this.basePath += locationParts[i] + "/";
            }

            this.moduleDefinitionUrl = this.basePath + url;
            // Initialize steal root path
            steal.config({ root: this.basePath });
        }

        var proccessDefinition = function (data) {
            if (!data) return;
            self.productBuild = data.build;
            self.overridesVersion = data.overridesVersion || "";
            self.build = data.build.concat((self.overridesVersion) ? "." + self.overridesVersion : "");

            // Mix the data with the overrides
            data = bizagi.merge(data, self.moduleDefinitionOverrides);

            // Set the prefix
            if (params.locationPrefix) {
                self.locationPrefix = params.locationPrefix;
            }
            else {
                self.locationPrefix = data.locationPrefix || "";
            }
            //LocationPrefix can be "" this line is unnecesary in several cases
            //if (self.locationPrefix.length == 0) self.locationPrefix = "/";

            // Define default theme
            theme = queryString["theme"] || theme;
            var so = bizagi.detectSO();

            // Starts up dictionary
            if (data.files) {
                for (var i = 0; i < data.files.css.length; i++) {
                    self.resources.css[data.files.css[i].name] = data.files.css[i].location.replace("%theme%", theme).replace("%so%", so);
                }
                for (var i = 0; i < data.files.js.length; i++) {
                    self.resources.js[data.files.js[i].name] = data.files.js[i].location;
                }
                for (var i = 0; i < data.files.tmpl.length; i++) {
                    self.resources.tmpl[data.files.tmpl[i].name] = data.files.tmpl[i].location.replace("%device%", so);
                }
                if (data.files.l10n) {
                    for (var i = 0; i < data.files.l10n.length; i++) {
                        self.resources.l10n[data.files.l10n[i].name] = data.files.l10n[i].location;
                    }
                }
            }

            for (var i = 0; i < data.webparts.length; i++) {
                self.resources.webparts[data.webparts[i].name] = data.webparts[i].location;
            }

            for (var i = 0; i < data.modules.length; i++) {
                self.definedModules[data.modules[i].name] = data.modules[i];
            }

            self.moduleDefinition = data;

            // Turn  off flags
            self.initialized = true;
            self.initializing = false;

            // Callback function
            if (callback) callback();
        };

        if (typeof bizagiConfig != "undefined" && bizagiConfig.environment == "release" && typeof BIZAGI_MODULE_DEFINITION_JSON != "undefined") {
            proccessDefinition(BIZAGI_MODULE_DEFINITION_JSON);
        }
        else {
            // Load module definition file
            this.send(this.moduleDefinitionUrl, function (data) {
                proccessDefinition(data);
            });
        }
    };



    // Gets the location prefix
    this.getLocationPrefix = function () {
        return this.locationPrefix;
    },

        // Send method
        this.send = function (url, callback) {
            // Download the master resource file
            var xhr = this.xhr;
            xhr.open('get', url);

            // Assign a handler for the response
            this.xhr.onreadystatechange = function () {
                // Check if the response has been received from the server
                if (xhr.readyState == 4) {
                    var response;
                    try {
                        // Read and assign the response from the server
                        if (xhr.responseText) {
                            response = eval("(" + xhr.responseText + ")");
                        }

                    } catch (e) {
                        alert("Module definition file read error: please check the JSON syntax");
                        throw e;
                    }

                    // Call function
                    if (callback) callback(response);
                }
            };

            // Actually send the request to the server
            xhr.send(null);
        };
    // Return a module definition
    this.getModule = function (module) {
        return this.definedModules[module];
    };
    // Checks if a module has been loaded
    this.isModuleLoaded = function (module, device) {
        if (this.loadedModules == null || this.loadedModules[module + "_" + device] == null) return false;
        return this.loadedModules[module + "_" + device].ready == true ? true : false;
    };
    // Executes a callback when a module has been loaded
    this.whenModuleLoaded = function (module, callback, device) {
        var self = this;
        device = device || bizagi.detectDevice();
        var fn = function (_module, _callback) {
            if (self.isModuleLoaded(_module, device) && _callback) _callback();
            else setTimeout(function () {
                fn(_module, _callback);
            }, 100);
        };
        fn(module, callback);
    };
    // Load module method
    this.loadModule = function (module, device) {
        var self = this;
        device = device || bizagi.detectDevice();

        // Don't load already loaded modules        
        if (this.loadedModules[module.name + "_" + device]) return this;

        //Prevent load the same module while it is loading
        this.loadedModules[module.name + "_" + device] = { ready: false };

        // Load each javascript via steal
        this.log("Loading module:" + module.name);

        if (module.devices) {           
            for (var i = 0; i < module.devices.length; i++) {
                if (module.devices[i].name == device) {
                    if (this.environment == "release") {
                        this.loadReleaseModule(module.devices[i]);

                    } else {
                        this.loadDebugModule(module.devices[i]);
                    }
                }
            }
        } else {
            if (this.environment == "release") {
                this.loadReleaseModule(module);

            } else {
                this.loadDebugModule(module);
            }
        }

        // Add module to loaded hashtable
        this.then(function () {
            self.loadedModules[module.name + "_" + device] = module;
            self.loadedModules[module.name + "_" + device].ready = true;
        });

        // Load less at last when using debug mode
        if (this.environment == "debug") {
            this.then(function () {
                self.loadFile({
                    src: self.getResource("js", "common.base.lib.less"),
                    type: "js"
                });
            });
        }

        return this;
    };
    // Load the release version of a module
    this.loadReleaseModule = function (module) {

        if (module.components.required && module.components.required.length) {
            for (var i = 0; i < module.components.required.length; i++) {
                this.start(module.components.required[i], module.name);
            }
        }

        // Load minified files        
        this.loadFile({
            src: this.resolveReleaseFile(module.target.css),
            type: "css",
            environment: "release"
        });

        this.loadFile({
            src: this.resolveReleaseFile(module.target.js),
            type: "js",
            environment: "release"
        });
        this.loadWebparts(module.components.webparts);
    };
    // Load the debug version of a module
    this.loadDebugModule = function (module) {
        // Load default components
        this.loadRequiredModules(module.components.required, module.name);
        this.loadSubModules(module.components.modules, module.name);        
        this.loadStyleSheets(module.components.css);        
        this.loadJavaScripts(module.components.js);
        this.loadWebparts(module.components.webparts);
    };
    // Resolve release final file
    this.resolveReleaseFile = function (src) {
        return bizagi.replaceAll(src, "%build%", this.productBuild);
    };
    // Load required modules
    this.loadRequiredModules = function (modules, device) {

        if (modules != undefined) {
            var moduleslength = modules.length;
            for (var i = 0; i < moduleslength; i++) {
                var subModule = modules[i];
                this.internalLoadModule(subModule, device);
            }
        }
    };

    // Load submodules
    this.loadSubModules = function (modules, device) {

        if (modules != undefined) {
            var moduleslength = modules.length;
            for (var i = 0; i < moduleslength; i++) {
                var subModule = modules[i];
                this.internalLoadModule(subModule, device);
            }
        }
    };
    // Load stylesheets    
    this.loadStyleSheets = function (cssFiles) {

        for (var i = 0; i < cssFiles.length; i++) {
            var css = this.resources.css[cssFiles[i]];
            if (typeof (css) === "undefined") alert(cssFiles[i] + " not found in stylesheets files declaration");

            this.loadFile({
                type: "css",
                src: css
            });
        }
    };

    // Load javascripts
    this.loadJavaScripts = function (jsFiles) {

        for (var i = 0; i < jsFiles.length; i++) {
            var js = this.resources.js[jsFiles[i]];
            if (typeof (js) === "undefined") alert(jsFiles[i] + " not found in javascript files declaration");
            this.loadFile({
                type: "js",
                src: js
            });
        }
    };
    // Load a single webpart
    this.loadWebpart = function (webpartLocation) {
        var self = this;
        var prefix = this.useAbsolutePath ? this.basePath + this.getLocationPrefix() : "" + this.getLocationPrefix();
        var url = prefix + webpartLocation + bizagi.defaultWebPartDefinitionName + "?build=" + self.build;
        steal.then({
            src: url,
            id: url,
            type: "text",
            waits: true,
            onError: function (options) {
                if (bizagi.loader.environment === "release") {
                    bizagi.log("Could not load file " + options.src, options, "error");
                }
                else {
                    alert("Could not load file " + options.src);
                }
            }
        }).then(function () {
            var data = steal.resources[url].options.text;

            // Cache the webpart definition
            data = eval("(" + data + ")");
            data.location = webpartLocation;
            data["class"] = data.className || "bizagi.workportal.webparts." + data.name;

            // Add to definition
            self.webparts[data.name] = data;
        });

        return this;
    };
    // Return a cached webpart
    this.getWebpart = function (webpartName) {
        return this.webparts[webpartName];
    };
    this.loadTheme = function (themeFiles) {
        themeFiles = themeFiles || [];
        var themeContent = "";

        for (var i = 0, l = themeFiles.length; i < l; i++) {
            var theme = themeFiles[i].src;
            themeContent += this.loadFile({
                type: "theme",
                src: theme
            })
        }

        // Apply file
        return themeContent;
    };

    /**
     * Replace var within css content and apply style to dom
     * @param cssContent
     * @param cssVars
     */
    this.applyWebpartTheme = function (cssContent, cssVars) {
        var self = this;
        var css = document.createElement("style");
        var processedCss = "";
        var processedVars = ""
        var head = document.head || document.getElementsByTagName('head')[0];

        for (name in cssVars) {
            processedVars += ((name.slice(0, 1) === '@') ? '' : '@') + name + ': ' +
                ((cssVars[name].slice(-1) === ';') ? cssVars[name] : cssVars[name] + ';');
        }

        less.render(cssContent + processedVars, function (err, processedCss) {
            processedCss = (processedCss && processedCss.css) ? processedCss.css : "";

            if (processedCss != "") {

                css.type = "text/css";
                css.title = "theme.less"
                if (css.styleSheet) { // IE
                    css.styleSheet.cssText = processedCss;
                } else {
                    css.appendChild(document.createTextNode(processedCss));
                }
                head.appendChild(css);
            }
        });
    };


    this.initWebpart = function (webpart, device, callback) {
        var self = this;
        if (webpart != null) {
            if (!webpart.initialized) {

                // Load javascripts and stylesheets
                steal.then(function () {
                    var targetWebpart, alias;
                    var build = "?build=" + self.build;

                    for (var i = 0; i < webpart.js.length; i++) {
                        self.loadFile({
                            type: "js",
                            src: webpart.location + webpart.js[i].src
                        });
                    }

                    //load css
                    for (var i = 0; i < webpart.css.length; i++) {
                        if (webpart.css[i].src) {
                            // Direct source
                            self.loadFile({
                                type: "css",
                                src: webpart.location + webpart.css[i].src,
                                wait: true
                            });
                        } else if (webpart.css[i].reuse) {
                            // Reference to another webpart
                            targetWebpart = self.webparts[webpart.css[i].reuse.webpart];
                            self.loadFile({
                                type: "css",
                                src: targetWebpart.location + webpart.css[i].reuse.src,
                                wait: true
                            });
                        }
                    }

                    //load templates
                    for (var i = 0; i < webpart.tmpl.length; i++) {
                        if (webpart.tmpl[i].src) {
                            // Direct source
                            alias = "webpart." + webpart.name + "." + webpart.tmpl[i].alias;
                            self.resources.tmpl[alias] = webpart.location + webpart.tmpl[i].src;
                            webpart.tmpl[i].originalAlias = webpart.tmpl[i].alias;
                            webpart.tmpl[i].alias = alias;

                        } else if (webpart.tmpl[i].reuse) {
                            // Reference to another webpart
                            targetWebpart = self.webparts[webpart.tmpl[i].reuse.webpart];

                            // Find referenced webpart template src
                            alias = "webpart." + webpart.name + "." + webpart.tmpl[i].alias;

                            for (var j = 0; j < targetWebpart.tmpl.length; j++) {
                                if (targetWebpart.tmpl[j].alias == webpart.tmpl[i].reuse.alias) {
                                    self.resources.tmpl[alias] = targetWebpart.location + targetWebpart.tmpl[j].src;
                                }
                            }

                            webpart.tmpl[i].originalAlias = webpart.tmpl[i].alias;
                            webpart.tmpl[i].alias = alias;
                        }
                    }

                    //Load theme
                    if (typeof webpart.theme == "object" && webpart.theme.src) {
                        self.loadFile({
                            type: "theme",
                            src: webpart.location + webpart.theme.src
                        }).then(function () {
                            if (typeof bizagi.theme !== "undefined" && bizagi.theme.type != "predefined") {
                                var lessVars = bizagi.theme.value || {};
                                var content = steal.resources[webpart.location + webpart.theme.src + build].options.text;

                                self.applyWebpartTheme(content, lessVars);
                            }
                        })
                    }

                    steal.then(function () {
                        // Invokes callback
                        webpart.initialized = true;
                        if (callback) callback();
                    });
                });

            } else {
                steal.then(function () {
                    // Invokes callback
                    if (callback) callback();
                });
            }
        }

        return this;
    };
    // Load webparts
    this.loadWebparts = function (moduleWebparts) {

        if (moduleWebparts != undefined) {
            for (var i = 0; i < moduleWebparts.length; i++) {
                var webpart = moduleWebparts[i];
                if (webpart == "*") {

                    for (var j = 0; j < this.resources.webparts.length; j++) {
                        this.loadWebpart(this.resources.webparts[j]);
                    }
                } else {
                    if (typeof (this.resources.webparts[webpart]) === "undefined") alert(webpart + " not found in javascript files declaration");
                    this.loadWebpart(this.resources.webparts[webpart]);
                }
            }
        }
    };

    // Load custom files
    this.loadFile = function (params) {
        var build = "?build=" + this.build;
        if (arguments.length > 1) {

            for (var i = 0; i < arguments.length; i++) {
                this.loadFile(arguments[i]);
            }
            return this;
        }

        if (typeof (params) == "object" && params.length > 1) {

            for (var i = 0; i < params.length; i++) {
                this.loadFile(params[i]);
            }
            return this;
        }
        //Internet Explorer bug in case that is object, 1 element
        if (params[0] && typeof (params) == "object") {
            this.loadFile(params[0]);
            return this;
        }

        // Skip some files when in release mode
        var environment = typeof (params.environment) !== "undefined" ? params.environment : "release";
        if (environment != "release" && this.environment == "release") return this;

        var file = params && params.src ? params.src : params;
        var type = params && params.type ? params.type : "js";
        var prefix = this.useAbsolutePath ? this.basePath + this.getLocationPrefix() : "" + this.getLocationPrefix();

        // Remove build variable content if the url already has a build in the querystring
        if (file.indexOf && file.indexOf(build) > 0) build = "";

        // Load each javascript via steal
        var wait;
        if (type == "css") {
            wait = typeof (params.wait) !== "undefined" ? params.wait : false;
            this.log("Loading css:" + file + " route to load:" + prefix + file + build);
            steal({
                id: prefix + file + build,
                src: prefix + file + build,
                type: "css",
                waits: wait
            });
        } else if (type == "js") {
            wait = typeof (params.wait) !== "undefined" ? params.wait : true;
            this.log("Loading js:" + file + " route to load:" + prefix + file + build);

            // Enable javascript coverage
            var enableCoverage = (typeof BIZAGI_ENABLE_COVERAGE !== "undefined" && BIZAGI_ENABLE_COVERAGE) ? true : false;
            enableCoverage = typeof params.coverage !== "undefined" ? params.coverage : enableCoverage;
            if (!enableCoverage) {

                steal.then({
                    id: prefix + file + build,
                    src: prefix + file + build,
                    type: "js",
                    waits: wait,
                    onError: function (options) {
                        if (bizagi.loader.environment === "release") {
                            bizagi.log("Could not load file " + options.src, options, "error");
                        }
                        else {
                            alert("Could not load file " + options.src);
                        }
                        if (params.onError) params.onError();
                    }
                });
            }
        } else if (type == "theme") {
            // Get file
            return steal.then({
                id: prefix + file + build,
                src: prefix + file + build,
                type: "text",
                waits: true,
                onError: function (options) {
                    if (bizagi.loader.environment === "release") {
                        bizagi.log("Could not load file " + options.src, options, "error");
                    }
                    else {
                        alert("Could not load file " + options.src);
                    }
                    if (params.onError) params.onError();
                }
            });
        }

        return this;
    };

    // Start method
    this.start = function (module, device) {
        var self = this;

        // Prevent load the same module while it is loading
        device = device || bizagi.detectDevice();
        var moduleToLoad = this.loadedModules[module + "_" + device];
        if (moduleToLoad && !moduleToLoad.ready) return { then: function(){} }; 

        // useful for unit tests
        window.setLongTimeoutJasmine && window.setLongTimeoutJasmine();

        // Add to external modules loaded
        self.externalModules.push(module);
        var modulesToShowLoading = ["activity"];

        if (modulesToShowLoading.indexOf(module) > -1 && typeof $ != "undefined" && typeof bizagi.loadModuleStatus != "undefined") {
            self.transition = (self.transition) ? self.transition : new bizagi.loadModuleStatus();
            bizagi.templateService.getTemplate(bizagi.getTemplate("bizagi.workportal.desktop.loadModuleStatus", false, device))
                .done(function (resolvedTemplate) {
                    self.transition.setTemplate(resolvedTemplate);
                    self.transition.setModule(module);
                    self.transition.show();
                });
        }
        // Load module
        self.internalLoadModule(module, device, "").then(function () {
            // useful for unit tests
            window.setShortTimeoutJasmine && window.setShortTimeoutJasmine();
            if (self.transition) {
                self.transition.hide();
            }
        });

        return self;
    };
    this.internalLoadModule = function (module, device) {
        var self = this;

        // Load each module
        for (var i = 0; i < self.moduleDefinition.modules.length; i++) {
            if (module == self.moduleDefinition.modules[i].name) {
                self.loadModule(self.moduleDefinition.modules[i], device);
            }
        }
        return this;
    };
    // Method to retrieve resources from the dictionary
    this.getResource = function (type, alias) {
        var resource = this.resources[type][alias];
        if (!resource) return null;
        return resource + "?build=" + this.build;
    };
    // Method to iterative call itself when needed
    this.then = function (args) {
        steal.then(args);
        return this;
    };

    this.startAndThen = function (module) {
        steal.reset();
        return this.start(module);
    };

    // Quick logging method
    this.log = function (message) {
        // if (typeof(console) !== "undefined") console.log(message);
    };
    // Method to retrieve the module that contains a template
    this.getProductionTemplate = function (src, device) {

        for (var i = 0; i < this.externalModules.length; i++) {
            var externalModule = this.externalModules[i];
            var module = this.getModule(externalModule);

            if (module) {
                var bFoundInModule = this.searchTemplateInModule(module, src, device);
                if (bFoundInModule) {
                    if (module.devices) {
                        // Search in a multi-device module
                        device = device || bizagi.detectDevice();

                        for (var j = 0; j < module.devices.length; j++) {
                            if (module.devices[j].name == device) {
                                return this.resolveReleaseFile(module.devices[j].target.tmpl);
                            }
                        }

                    } else {
                        return this.resolveReleaseFile(module.target.tmpl);
                    }
                }
            }
        }
        console.warn(src + " not defined in any of these modules: " + this.externalModules.toString());
        return null;
    };
    // Method to search a template in a module
    this.searchTemplateInModule = function (module, tmpl, device) {
        var bFoundInSubModule;
        if (module.devices) {
            // Search in a multi-device module
            device = device || bizagi.detectDevice();

            for (var j = 0; j < module.devices.length; j++) {
                if (module.devices[j].name == device) {

                    for (var k = 0; k < module.devices[j].components.tmpl.length; k++) {
                        if (module.devices[j].components.tmpl[k] == tmpl) {
                            return true;
                        }
                    }
                    if (module.devices[j].components.modules) {
                        for (var k = 0; k < module.devices[j].components.modules.length; k++) {
                            var subModule = this.getModule(module.devices[j].components.modules[k]);
                            bFoundInSubModule = this.searchTemplateInModule(subModule, tmpl, device);
                            if (bFoundInSubModule) return true;
                        }
                    }
                }
            }

        } else {

            for (var i = 0; i < module.components.tmpl.length; i++) {
                if (module.components.tmpl[i] == src) {
                    return true;
                }
            }

            for (var i = 0; i < module.components.modules.length; i++) {
                bFoundInSubModule = this.searchTemplateInModule(module.components.modules[i], tmpl, device);
                if (bFoundInSubModule) return true;
            }
        }
        return false;
    };

    this.getPathUrl = function (url) {
        var locationParts = location.pathname.split("/");
        var basePath = location.protocol + "//" + location.host;
        var pathToBaseBackwards = BIZAGI_PATH_TO_BASE.split("../").length;
        for (var i = 0; i < locationParts.length - pathToBaseBackwards; i++) {
            basePath += locationParts[i] + "/";
        }

        basePath = basePath[basePath.length - 1] === "/" ? basePath : basePath + "/";

        return basePath + url;
    };

    //Method call ajax native
    this.nativeAjax = function (url, callbackFunction, errorCallback) {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        var timestamp = new Date().getTime();
        xhr.open('get', url + '?ts=' + timestamp, true);

        // Assign a handler for the response
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    return (callbackFunction) ? callbackFunction(xhr) : xhr.response;
                } else {
                    return (errorCallback) ? errorCallback(xhr) : xhr.response;
                }
            }
        };
        xhr.setRequestHeader('X-BZXSRF-TOKEN', bizagi.getXSRFToken());
        // Actually send the request to the server
        xhr.send(null);
    };
};
// Create global instance
bizagi.loader = typeof (bizagi.loader) !== "undefined" ? bizagi.loader : (new bizagi.loaderPrototype());

// Mini-wrappers for old-fashion methods
bizagi.getTemplate = function (src, onDemand, device) {

    onDemand = onDemand || false;
    if (bizagi.loader.environment == "release" && onDemand == false) {
        // Release mode
        var productionSrc = bizagi.loader.getProductionTemplate(src, device);
        var prefix = bizagi.loader.useAbsolutePath ? bizagi.loader.basePath + bizagi.loader.getLocationPrefix() : "" + bizagi.loader.getLocationPrefix();
        return prefix + productionSrc + "#" + bizagi.replaceAll(src, ".", "_");

    } else {
        // Debug mode
        if (src.length == 0) alert("No source defined for bizagi.getTemplate call");

        var template = bizagi.loader.getResource("tmpl", src);
        if (template == null) alert("No entry found for " + src + " in bizagi.getTemplate call");
        prefix = bizagi.loader.useAbsolutePath ? bizagi.loader.basePath + bizagi.loader.getLocationPrefix() : "" + bizagi.loader.getLocationPrefix();
        return prefix + template;
    }
};
bizagi.getJavaScript = function (src) {
    if (src.length == 0) alert("No source defined for bizagi.getJavaScript call");

    var javascript = bizagi.loader.getResource("js", src);
    if (javascript == null) alert("No entry found for " + src + " in bizagi.getJavaScript call");
    return javascript;
};
bizagi.getStyleSheet = function (src) {
    if (src.length == 0) alert("No source defined for bizagi.getStyleSheet call");
    var styleSheet = bizagi.loader.getResource("css", src);
    if (styleSheet == null) alert("No entry found for " + src + " in bizagi.getStyleSheet call");
    return styleSheet;
};
bizagi.getWebpart = function (src) {
    if (src.length == 0) alert("No src defined for bizagi.getWebpart call");
    var webpart = bizagi.loader.getWebpart(src);
    if (webpart == null) {
        alert("No entry found for " + src + " in bizagi.getWebpart call");
        bizagi.util.defaultWidget("");
        window.location.hash = "";
    }
    var defaultDevice = (webpart && webpart.defaultDevice) ? webpart.defaultDevice : "desktop";

    // Linked resource from other device
    var resolveResource = function (device) {
        var targetResource = (webpart.devices[device]) ? webpart.devices[device] : webpart.devices[defaultDevice];
        var resource = (targetResource.reuseResourceFrom) ? resolveResource(targetResource.reuseResourceFrom) : targetResource || [];
        return resource;
    };

    if (webpart && webpart.devices) {
        // This widget has multidevice support
        var device = bizagi.detectRealDevice();
        var resource = resolveResource(device);

        //add resources by device in the first level
        webpart.js = resource.js || [];
        webpart.css = resource.css || [];
        webpart.tmpl = resource.tmpl || [];
        webpart.theme = resource.theme || [];
    }

    return webpart;
};

bizagi.cookie = function (key) {
    // key and possibly options given, get cookie...    
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decodeURIComponent(result[1]) : null;
};

/**
 * Get XSRF Value
 */
bizagi.getXSRFToken = function () {
    return !!window.sessionStorage ? (sessionStorage.getItem('XSRFToken') || ''): '';
};

bizagi.setWorkPortalVersion = function (data) {
    bizagi.loader.productBuildToAbout = data;
    bizagi.loader.buildToAbout = data + "." + bizagi.loader.overridesVersion;
    bizagi.loader.currentYearVersion = new Date().getFullYear();
};
