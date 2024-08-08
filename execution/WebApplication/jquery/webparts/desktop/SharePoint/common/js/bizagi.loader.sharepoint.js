
var BIZAGI_USE_ABSOLUTE_PATH = typeof (BIZAGI_USE_ABSOLUTE_PATH) !== "undefined" ? BIZAGI_USE_ABSOLUTE_PATH : true;
var BIZAGI_ENABLE_LOG = false;
var BIZAGI_ENABLE_CUSTOMIZATIONS = false;
var BIZAGI_SHAREPOINT_CONTEXT = true;

//var BIZAGI_ENVIRONMENT = 'debug';
//var BIZAGI_ENABLE_LOG = true;

var BIZAGI_ENVIRONMENT = undefined;
var BIZAGI_ENABLE_LOG = false;

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};

bizagi.initializingWorkportal = typeof (bizagi.initializingWorkportal) !== "undefined" ? bizagi.initializingWorkportal : false;
bizagi.sharepointContext = typeof (BIZAGI_SHAREPOINT_CONTEXT) !== "undefined" ? BIZAGI_SHAREPOINT_CONTEXT : false;
bizagi.workportalInstances = {};

var queryString = bizagi.readQueryString();
var BIZAGI_ENVIRONMENT = typeof (BIZAGI_ENVIRONMENT) !== "undefined" ? BIZAGI_ENVIRONMENT : (queryString["environment"] || "release");

// DYNAMIC LOAD CSS 
// THIS CSS IS NECESARY BEFORE JQUERY BIZAGI ENGINE START 
// Define functions
bizagi.loadWebPartInitStyle = function (params) {

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = params.serverurl + "jquery/webparts/desktop/sharepoint/common/css/bizagi.webpart.init.css";
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

    var hostUrl = window.location.origin;
    bizagi.loadWebPartInitStyle({ serverurl: hostUrl + params.locationPrefix });
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
            loader.start("sharepoint");
            // Load extrafiles
            if (params.additionalFiles) loader.loadFile(params.additionalFiles);
            
            // Load overrides            
            loader.loadFile(
                //  bizagi.getJavaScript("bizagi.sharepoint.internals.overrides"),  //Included  in definitionjson
                bizagi.getJavaScript("bizagi.sharepoint.overrides"),   
                //  bizagi.getJavaScript("bizagi.workportal.internals.desktop.overrides"), //Included  in definitionjson
                  bizagi.getJavaScript("bizagi.workportal.desktop.overrides")
              );

            // Load workportal
            loader.then(function () {
                bizagi.initializingWorkportal = false;

                // Get user language
                $.when(bizagi.getUserLanguage(params))
				.pipe(function (language) {
				    bizagi.localization.setLanguage(language);
				    return bizagi.localization.ready();

				}).done(function () {
				    // Callback function
				    if (params.whenInitialized) bizagi.executeAfterLoad(function () { params.whenInitialized(bizagi.getWorkportalInstance(params)); });
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
    params.context = params.context || "sharepoint";
    params.sharepointProxyPrefix = params.sharepointProxyPrefix || "";

    // Cache the result and return
    bizagi.workportalInstances[project] = new bizagi.workportal.facade(params);
    return bizagi.workportalInstances[project];
};

// This method can only be executed after all workportal dependency scripts has been loaded
bizagi.getUserLanguage = function (params) {
    //Override the login function, this is only necesary in WorkPortal
    bizagi.services.ajax.loginPage = bizagi.loginFunc();

    var project = params.project || "default";
    var defer = new $.Deferred();
    // Else create a new one
    params.context = params.context || "sharepoint";
    params.sharepointProxyPrefix = params.sharepointProxyPrefix || "";

    // Create a new services proxy object 
    var services = new bizagi.workportal.services.service(params);

    $.when(services.getCurrentUser())
			.pipe(function (data) {
			    return  defer.resolve(data.language);
			}).fail(function (data) {
			    return defer.resolve("default");
			});

    return defer.promise();
};

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
}

// this funtion is necesary because this wait is out of canvas of webpart
bizagi.loader.hideWait = function(params) {
    if ($(params.waitContainer)) {
        $(params.waitContainer).addClass("ui-bizagi-sharepoint-loading-container-hidden");
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
                src: bizagi.getStyleSheet("bizagi.webparts.desktop.sharepoint.override"),
                type: "css"
            });

        }, 400);
    });
};


/* Overrides SharePoint js Methods*/
/* This is necesary because bizagi override 'for' function */
/* Less.js  Array.prototype line 103*/

if (!window.notHackedGetOnLoad) {
    
    if (typeof GetOnLoad != 'undefined') {
        var oldGetOnLoad = GetOnLoad;
        GetOnLoad = function (_, s) {
            executeSharepointWPAdderHacksCoreDebug();
            var fn = oldGetOnLoad.apply(this, arguments);
            var result;
            if (s.src.indexOf("wpadder.debug.js") > 0) {
                result = function () {
                    fn();
                    executeSharepointWPAdderHacks();
                };
            }
            else if (s.src.indexOf("wpadder.js") > 0) {
                result = function () {
                    fn();
                    executeSharepointWPAdderHacks2();
                };
            }
            else {
                result = fn;
            }
            return result;
        };
        window.notHackedGetOnLoad = true;
    }
};

function executeSharepointWPAdderHacksCoreDebug() {
    if (typeof (String.prototype.trim) !== "undefined") {
        String.prototype.trim = function () {
            ULSsa6: ;
            try {
                return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            }
            catch (e) {
                // statements to handle any exceptions 
                return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            }
        };
    }
}
function executeSharepointWPAdderHacks() {
    if (typeof (_WPAdder) !== "undefined") {
        _WPAdder.prototype._layout = function (layoutData) {
            ULScPV: ;
            var descriptionContent = this._saveDescriptionForLayout();
            if (this._lastLayoutWidth == -1) {
                var container = this._getCategoryContainer();
                for (var i = 0; i < this._cats.length; i++) {
                    container.appendChild(this._cats[i].el);
                }
            }
            if (this._table.clientHeight != this._lastLayoutHeight) {
                if (this._selCat != -1) this._removeItemHover();
                this._layoutCategoryColumn();
                this._getNavigationTable().parentNode.colSpan = 1;
                var widestColumn = 0, maxCols = 0;
                var testItem = document.createElement('DIV'),
			container = this._itemContainerTemplate.cloneNode(true);
                testItem.style.whiteSpace = 'nowrap';
                testItem.style.width = '1px';
                testItem.style.height = '1px';
                testItem.style.overflow = 'auto';
                testItem.innerHTML = 'Quick Brown Fox!<br/>It jumped!';
                this._getFirstChild(container).appendChild(testItem);
                this._getItemContainer().appendChild(container);
                var textWidth = testItem.scrollWidth, textHeight = testItem.scrollHeight;
                this._removeElement(container);
                if (layoutData && (parseInt(layoutData[0][0]) != textWidth ||
				parseInt(layoutData[0][1]) != textHeight ||
				parseInt(layoutData[0][2]) != this._table.clientHeight)) {
                    layoutData = null;
                }
                if (layoutData) {
                    widestColumn = parseInt(layoutData[0][3]);
                    for (var i = 0; i < this._cats.length; i++) {
                        var itemCols = this._fillCachedItems(this._cats[i].items, this._itemContainerTemplate,
						layoutData[i + 1]);
                        if (itemCols.length > maxCols) maxCols = itemCols.length;
                        this._cats[i].itemCols = itemCols;
                    }
                }
                else {
                    layoutData = '';
                    for (var i = 0; i < this._cats.length; i++) {
                        var itemCols = new Array();
                        var colData = this._fillItems(itemCols, this._cats[i].items, this._getItemContainer(),
					this._itemContainerTemplate, _WPAdder_maximumItemWidth);
                        if (colData[1] > widestColumn) widestColumn = colData[1];
                        if (itemCols.length > maxCols) maxCols = itemCols.length;
                        this._cats[i].itemCols = itemCols;
                        layoutData += ';' + colData[0];
                    }
                    layoutData = textWidth + ',' + textHeight + ',' + this._table.clientHeight + ',' + widestColumn + layoutData;
                    this._getHiddenField('layout').value = this._layoutHash + ';' + layoutData;
                }
                for (var i = 0; i < this._cats.length; i++) {
                    var divs = this._cats[i].itemCols;
                    for (var j = 0; j < divs.length; j++) this._finishColumn(divs[j], widestColumn);
                }
                for (var i = 0; i < this._dummyCols.length; i++) this._finishColumn(this._dummyCols[i], widestColumn);
                this._maxCols = maxCols;
                this._widestColumn = widestColumn;
            }
            if (this._table.clientWidth != this._lastLayoutWidth ||
			this._table.clientHeight != this._lastLayoutHeight) {
                this._calculateVisibleItemColumns();
            }
            this._restoreDescriptionAndLayout(descriptionContent);
            this._lastLayoutWidth = this._table.clientWidth;
            this._lastLayoutHeight = this._table.clientHeight;
        }

        _WPAdder.prototype._removeItemHover = function () {
            ULScPV: ;
            var items = this._getItems();
            for (var i = 0; i < items.length; i++) items[i].removeHover();
        }
    }
};

function executeSharepointWPAdderHacks2() {
    if (typeof (_WPAdder) !== "undefined") {
        _WPAdder.prototype._layout = function (a) {
            ULSior: ;
            var l = this._saveDescriptionForLayout();
            if (this._lastLayoutWidth == -1) {
                var g = this._getCategoryContainer();
                for (var i = 0; i < this._cats.length; i++) {
                    g.appendChild(this._cats[i].el)
                }
            }
            if (this._table.clientHeight != this._lastLayoutHeight) {
                this._selCat != -1 && this._removeItemHover();
                this._layoutCategoryColumn();
                this._getNavigationTable().parentNode.colSpan = 1;
                var d = 0,
            f = 0,
            c = document.createElement("DIV"),
            g = this._itemContainerTemplate.cloneNode(true);
                c.style.whiteSpace = "nowrap";
                c.style.width = "1px";
                c.style.height = "1px";
                c.style.overflow = "auto";
                c.innerHTML = "Quick Brown Fox!<br/>It jumped!";
                this._getFirstChild(g).appendChild(c);
                this._getItemContainer().appendChild(g);
                var j = c.scrollWidth,
            i = c.scrollHeight;
                this._removeElement(g);
                if (a && (parseInt(a[0][0]) != j || parseInt(a[0][1]) != i || parseInt(a[0][2]) != this._table.clientHeight)) a = null;
                if (a) {
                    d = parseInt(a[0][3]);
                    for (var b = 0; b < this._cats.length; b++) {
                        var e = this._fillCachedItems(this._cats[b].items, this._itemContainerTemplate, a[b + 1]);
                        if (e.length > f) f = e.length;
                        this._cats[b].itemCols = e
                    }
                } else {
                    a = "";
                    for (var b = 0; b < this._cats.length; b++) {
                        var e = [],
                    h = this._fillItems(e, this._cats[b].items, this._getItemContainer(), this._itemContainerTemplate, _WPAdder_maximumItemWidth);
                        if (h[1] > d) d = h[1];
                        if (e.length > f) f = e.length;
                        this._cats[b].itemCols = e;
                        a += ";" + h[0]
                    }
                    a = j + "," + i + "," + this._table.clientHeight + "," + d + a;
                    this._getHiddenField("layout").value = this._layoutHash + ";" + a
                }
                for (var b = 0; b < this._cats.length; b++) {
                    var k = this._cats[b].itemCols;
                    for (var m = 0; m < k.length; m++) this._finishColumn(k[m], d)
                }
                for (var b = 0; b < this._dummyCols.length; b++) this._finishColumn(this._dummyCols[b], d);
                this._maxCols = f;
                this._widestColumn = d
            } (this._table.clientWidth != this._lastLayoutWidth || this._table.clientHeight != this._lastLayoutHeight) && this._calculateVisibleItemColumns();
            this._restoreDescriptionAndLayout(l);
            this._lastLayoutWidth = this._table.clientWidth;
            this._lastLayoutHeight = this._table.clientHeight
        };

        _WPAdder.prototype._removeItemHover = function () {
            ULSior: ;
            var a = this._getItems();
            for (var b = 0; b < a.length; b++) a[b].removeHover()
        };
    }
};
