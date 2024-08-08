/*
*   Name: BizAgi Workportal new case Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*   -   This webpart is similar to create cases control in BizagiBPM
*   -   This webpart display cases list from a inner button
*/
bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.newcaselist", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        //waitContainer
        this.waitContainer = initialParams.waitContainer;

        //renderBehavior
        this.renderBehavior = initialParams.renderBehavior;

        //renderPageUrl
        this.renderPageUrl = initialParams.renderPageUrl;
        //buttonName
        this.buttonName = initialParams.buttonName;

        var device = bizagi.detectRealDevice();
        this.responsiveView = (device.indexOf("tablet") >= 0 || device.indexOf("smartphone") >= 0 )? true : false;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        self.buttonName = self.buttonName || params.buttonName || self.getResource('workportal-menu-new');
        var defer = new $.Deferred();

        $.when(self.dataService.getMenuAuthorization()).done(function (data) {

            if (data.permissions[0].Cases.indexOf("NewCase") != -1) {
                var template = self.getTemplate("newcase");
                defer.resolve($.tmpl(template, { buttonName: self.buttonName }));
            }
            else {
                params.canvas.parent().css('visibility', 'hidden');
                defer.resolve(null);
            }
        }).fail(function (msg) {
            //En cualquier escenario en el que falle la consulta el Menu de NewCase no se debe ver nunca
            params.canvas.parent().css('visibility', 'hidden');
            self.manageError(msg, defer);
        });
        return defer.promise();
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function (params) {
        var self = this;
        self.params = params;
        var content = self.getContent();

        // Reset state
        bizagi.idCategory = undefined;

        // Bind scroll buttons
        self.scrollVertical({
            "autohide": false
        });

        // Bind tree navigation
        self.configureTreeNavigation();
        // Bind recent process
        $("#frecuentCases", content).click(function () {
            // Block multi click on this element
            if ($(this).hasClass('frecuentCasesOn')) {
                return;
            }
            // Hide search field
            $("#ui-bizagi-wp-app-search", content).hide();

            // Set title
            $('#modalTitle', content).html(self.getResource('workportal-widget-newcase-recent'));
            // Change to recent process 
            self.renderRecentProcess();
            // Change css selected
            $(this).addClass("frecuentCasesOn");
            $("#casesList", content).removeClass("casesListOn");

            $("#ui-bizagi-webpart-newcase-container.modalMenuBt #categories").css("max-height", "220px");

        });



        // Bind recent process
        $("#casesList", content).click(function () {
            // Block multi click on this element
            if ($(this).hasClass('casesListOn')) {
                return;
            }
            // Show search field and empty element
            $("#ui-bizagi-wp-app-search", content).show();
            $("#searchNewCase", content).focus();
            $("#searchNewCase", content).val("");

            // Set title
            $('#modalTitle', content).html(self.getResource('workportal-widget-newcase-create'));
            // Change to recent process 
            self.renderCategories();
            // Change css selected
            $(this).addClass("casesListOn");
            $("#frecuentCases", content).removeClass("frecuentCasesOn");

            $("#ui-bizagi-webpart-newcase-container.modalMenuBt #categories").css("max-height", "160px");
        });

        // Bind Search tab
        $("#search", content).click(function () {
            if ($(this).hasClass("searchOn")) {
                $(this).removeClass("searchOn");

            } else {
                $(this).addClass("searchOn");
            };
        });

        $("#frecuentCases", content).click();
        $("html").addClass("bz-sharepoint-webpart");
        self.addCommListeners();
        self.endWaiting();
    },

    addCommListeners: function() {
        var self = this;
        var iframeCommunicationListeners = {
            "set-custom-language": {
                then: self.updateDataPreferences
            },
            "update-token": {
                then: self.updateToken
            }
        };

        $.each(iframeCommunicationListeners, function(key, value) {
            self.addIframeCommunicationListener(key, {
                runBefore: (value.runBefore ? value.runBefore : undefined),
                then: (value.then ? value.then : function(){})
            });
        });
    },

    addIframeCommunicationListener: function (eventName, callbacks) {
        var self = this;
        if (callbacks.runBefore) {
            callbacks.runBefore();
        }
        if (!bizagi.iframeCommunicator.subscribers[eventName]) {
            bizagi.iframeCommunicator.subscribe(eventName, function (params) {
                var thenCallback = callbacks.then.bind(self);
                thenCallback(params);
            });
        } 
    },

    /**
    * Render List categories for each idCategory
    */
    renderCategories: function (idParentCategory, appId) {
        var self = this;
        var defer = new $.Deferred();
        var content = self.getContent();
        var template = self.getTemplate("newCase-categories");
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);
        var filtered = false;
        var categoryContent;
        var filterData = {};
        var elemToShow = 100;
        var defer = new $.Deferred();
        // Create critic section to prevent double click event
        bizagi.criticSection = (bizagi.criticSection == 1) ? 1 : 0;

        // Load categories
        $.when(
            self.dataService.getCategories({
                idCategory: idParentCategory,
                idApp: appId || ""
            })
            ).done(function (data) {
                // Renders the categories
                categoryContainer.empty();
                categoryTree.show();
                if (data.totalApps > 1) {
                    var transformedData = {
                        category: []
                    };
                    // Transform data and mark with appId flag
                    $.each(data.category, function (key, value) {
                        transformedData.category.push({
                            "appId": value.appId,
                            "idCategory": '',
                            "categoryName": value.appName,
                            "isProcess": "false",
                            "description": " "
                        })
                    });
                    // Change data value with transformed data
                    data = transformedData;
                }

                // Improve load time
                if (data.category.length > elemToShow) {
                    filterData.category = {};
                    for (i = 0; i <= elemToShow; i++) {
                        filterData.category[i] = data.category[i];
                    }
                    filterData.truncate = true;
                    categoryContent = $.tmpl(template, filterData);
                    categoryContent.appendTo(categoryContainer);

                    self.loadAllElementEvent(data);

                } else {
                    filterData = data;
                    categoryContent = $.tmpl(template, filterData);
                    categoryContent.appendTo(categoryContainer);
                }
                // Bind scroll vertical
                self.scrollVertical({
                    "autohide": false
                });


                // Define autocomplete information for search cases
                var filteredDataCases = {};
                filteredDataCases.category = [];
                var i = 0;
                $.each(data.category, function (key, obj) {
                    // Add label and value to item object
                    data.category[key].label = obj.categoryName;
                    data.category[key].value = obj.idCategory;
                })

                // Add auto focus 
                $("#searchNewCase", content).focus();

                $(content).delegate("#searchNewCase", "keyup", function (e) {
                    e.stopPropagation();
                    if ($("#searchNewCase", content).val().length == 0 && filtered) {
                        categoryContent = $.tmpl(template, filterData);
                        categoryContent.appendTo(categoryContainer);
                        self.assignEvent();
                        self.loadAllElementEvent(data);
                        // reset flag
                        filtered = false;
                    }
                });

                // Define search results
                $("#searchNewCase", content).autocomplete({
                    messages: {
                        noResults: null, //"No search results.",
                        results: function () { }
                    },
                    minLength: 3,
                    source: data.category,
                    autoFocus: true,
                    position: {
                        my: "left top",
                        at: "left top",
                        of: "body",
                        offset: "-10 -10",
                        collision: "none",
                        delay: 800
                    },

                    /* OPEN METHOD */
                    open: function (event, ui) {
                        // Reset values
                        i = 0;
                        filteredDataCases.category = [];
                    },

                    /* SELECT METHOD */
                    select: function (event, ui) {
                        // If list only have one element, open them
                        if ($("#categories ul").length == 1) {
                            $("#categories ul").trigger("click");
                        }
                        return false;
                    }

                    /* FILTER DATA FOR AUTOCOMPLE */
                }).data("ui-autocomplete")._renderItem = function (ul, item) {

                    if (i >= 15) {
                        return true;
                    }
                    filteredDataCases.category[i++] = item;

                    // Render template with new filtered data
                    categoryContent = $.tmpl(template, filteredDataCases);
                    categoryContent.appendTo(categoryContainer);

                    // Set flag 
                    filtered = true;
                    // Assign click event for new content
                    var li = $("li", categoryContainer);
                    // Reset state
                    bizagi.idCategory = undefined;
                    self.assignEvent(li);
                    self.loadAllElementEvent(data);
                    return categoryContent;
                };

                // Assign click event for new content
                self.assignEvent();
                defer.resolve();
            }).fail(function (msg) {
                self.manageError(msg, defer, $("#categories"));
            });
        return defer.promise();
    },

    /*
    * Assign click event to load all elements
    */
    loadAllElementEvent: function (data) {
        var self = this;
        var content = self.getContent();
        var template = self.getTemplate("newCase-categories");
        var categoryContainer = $("#categories", content);

        $(".loadMoreElements", categoryContainer).click(function (e) {
            e.stopPropagation();
            $(this).find("#loadMoreElementsIcon").removeClass("plus_load_icon").addClass("loading_icon");
            categoryContainer.empty();
            var categoryContent = $.tmpl(template, data);
            categoryContent.appendTo(categoryContainer);
            self.assignEvent();
        });
    },


    /**
    * Assign click event to list elements
    */
    assignEvent: function (elem, data) {
        var self = this;
        var content = self.getContent();
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);

        var li = elem || $("li", categoryContainer);
        $(li).click(function (e) {

            e.stopPropagation();

            $("li .processIco", categoryContainer).removeClass("wait");
            $("li", categoryContainer).removeClass("active");
            var idCategory = $(this).attr("data-idCategory");
            var isProcess = $(this).attr("data-isProcess");
            var categoryName = $(this).attr("data-categoryName");
            var appId = $(this).parent().data('appid');

            // check critic section
            if ((bizagi.criticSection == 1 || idCategory == bizagi.idCategory) && !bizagi.util.parseBoolean(isProcess)) {
                return true;
            }

            // Define last idcategory
            bizagi.idCategory = idCategory;

            // Clear autocomplete field value
            $("#searchNewCase", content).val("");

            // up critic section
            bizagi.criticSection = 1;

            if (bizagi.util.parseBoolean(isProcess) == true) {

                var idWfClass = $(this).data("idwfclass");

                if (!idWfClass) //Mozilla
                    idWfClass = e.currentTarget.dataset.idwfclass;


                $(this).find(".processIco").addClass("wait");
                $(this).addClass("active");
                //**//

                self.processRenderBehavior({ idWfClass: idWfClass, title: $(this).text() });

            } else {
                // Append category header
                var headerTemplate = self.getTemplate("newCase-categories-tree");
                $.tmpl(headerTemplate, {
                    idParentCategory: idCategory,
                    categoryName: categoryName,
                    appId: appId
                }).appendTo(categoryTree);

                // Set bind event for last element
                self.configureTreeNavigation();

                // Reset state
                bizagi.idCategory = undefined;


                // Render sub-categories
                self.renderCategories(idCategory, appId);
            }

            // Reset critical section
            bizagi.criticSection = 0;
        });
    },
    showCases: function (params) {
        var self = this;
        self.publish("ui-bizagi-show-cases", params);
        self.publish("ui-bizagi-show-processes", params);
    },
    /**
    *  Render the recent process category
    */
    renderRecentProcess: function () {
        var self = this;
        var defer = new $.Deferred();
        var content = self.getContent();
        var categoryContainer = $("#categories", content);
        var categoryTree = $("#categoryTree", content);

        var template = self.getTemplate("newCase-categories-recent-process");

        categoryContainer.empty();

        // reset content of category tree
        $("li:first", categoryTree).nextAll().remove();
        categoryTree.hide();


        // Define New Content
        $.when(
            self.dataService.getRecentProcesses()
            ).done(function (data) {
                $.tmpl(template, data).appendTo(categoryContainer);
                // this is for IE9. to prevent an undesirable visual effect.
                if (data.processes.length === 0 && $.browser.msie) {
                    categoryContainer.blur();
                    self.busyLoop();
                    categoryContainer.hide();
                    categoryContainer.remove();
                }
                // Bind recent process
                $("ul", categoryContainer).click(function () {

                    var idWfClass = $(this).children("#idWfClass").val();
                    // Creates a new case
                    $(this).parent().find(".processIco").removeClass("wait");
                    $(this).find(".processIco").addClass("wait");
                    //**//
                    self.processRenderBehavior({ idWfClass: idWfClass, title: $(this).text() });

                });
            }).fail(function (msg) {
                self.manageError(msg, defer, $("#categories"));
            });
    },
    /***/
    processRenderBehavior: function (parameters) {
        var self = this;
        var title = parameters.title || "";
        // depending on the behavior configurated
        switch (self.renderBehavior) {
            case "OtherWebPartThisPage":
                //Trigger event to SharePoint Render WebPart                            
                self.helper.publishShowRenderEvent("ui-bizagi-show-render-new", self, { "idWfClass": parameters.idWfClass });
                break;
            case "OtherPage":
                if (bizagi.util.isSharepointContext()) {
                    if (self.isWebpartInIFrame) {
                        window.parent.location.href = self.renderPageUrl + "?idWfClass=" + parameters.idWfClass;
                    } else {
                        window.location.href = self.renderPageUrl + "?idWfClass=" + parameters.idWfClass;
                    }
                } else {
                    var pathOtherPage = "jquery/webparts/desktop/portal/pages/webpart.htm";
                    pathOtherPage = (self.renderPageUrl.indexOf("webpart") != -1) ? self.renderPageUrl : self.renderPageUrl + "/" + pathOtherPage;
                    if (typeof (bizagi.util.getQueryString().renderPageUrl) == "undefined") pathOtherPage = "http://" + document.location.hostname + document.location.pathname;
                    window.open(pathOtherPage + "?type=activityForm&idWfClass=" + parameters.idWfClass);
                }
                break;

            case "PopUp":
                var params = {};
                params = self.params;
                params.idWfClass = parameters.idWfClass;
                //clone objet all in javascript is by reference
                var webpartParams = $.extend({}, params, { workportal: self.workportalFacade.workportal });
                if (bizagi.sharepointContext) {
                    //params.sharepointProxyPrefix solo es valido en el contexto de SharePoint
                    var pathiFrame = params.sharepointProxyPrefix.substring(params.sharepointProxyPrefix.indexOf("http"), params.sharepointProxyPrefix.length);
                    webpartParams.pathiFrame = pathiFrame;
                    //webpartParams.remoteServer = remoteServer;
                    self.helper.displayWebPartPopUpinIFrame("renderComplete", webpartParams, function (e, params) { self.showCases(self.params); });
                }
                else {
                    if (typeof(self.postmessageSocket) == "undefined") {
                        var page = self.renderPageUrl + "?type=render&idWfClass=" + parameters.idWfClass;
                        var $dialog = $('<div></div>')
                                       .html('<iframe style="border: 0px; " src="' + page + '" width="100%" height="100%"></iframe>')
                                       .dialog({
                                           autoOpen: false,
                                           modal: true,
                                           height: 625,
                                           width: '100%',
                                           title: title
                                       });
                        $dialog.dialog('open');
                        $(".ui-widget-overlay.ui-front").height("100%");
                    }
                    else if (self.isWebpartInIFrame) {
                        webpartParams.pathiFrame = window.location.href.substring(0, window.location.href.indexOf("jquery"));
                        self.helper.displayWebPartPopUpExternalIframe("renderComplete", webpartParams, function (e, params) { self.showCases(self.params); }, self.postmessageSocket);
                    } else {
                        self.helper.displayWebPartPopUp("renderComplete", webpartParams, function (e, params) { self.closePopUp(self.params); });
                    }

                }
                break;
            case "ParentPopUp":
                var server = window.location.origin + window.location.pathname;
                var url = server + "?type=render&idWfClass=" + parameters.idWfClass + "&adjustButtonsToContent=true&iframename=iframePopUprenderComplete";
                var popup = {
                    command: "BZ_OPEN_DIALOG",
                    parameters: {
                        url: url,
                        title: bizagi.util.trim(title),
                        allowMaximize: true,
                        showClose: true,
                        width: 1100,
                        height: 924
                    }
                };

                parent.postMessage(JSON.stringify(popup), '*');
                break;
        }

    },

    updateDataPreferences: function(e) {
        var self = this; 
        var preferencesParams = {
            h_action: "LOADUSERPREFERENCESFORM",
            h_contexttype: "entity",
            h_guidForm: "0" 
        };
        self.dataService.getPreferencesForm(preferencesParams).done(function (data) {
            self.updateDataMultiactionService(data, e.message);
        });
    },

    updateToken: function (e) {
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer ' + e.message.token
            }
        });
    },

    updateDataMultiactionService: function(data, lang){
        var self = this;
        var serviceRender = new bizagi.render.services.service();
        var element;
        var dataLang;
        for (var index = 0; index < data.form.elements.length; index++) {
            if(data.form.elements[index].render && data.form.elements[index].render.properties.xpath == 'language'){
                element = data.form.elements[index];
                break;
            }
        }
        if (element) {
            var bpmLangValue;
            dataLang = element.render.properties.data.find(function(d) {
                bpmLangValue = d.value.substring(
                    d.value.lastIndexOf("[") + 1, 
                    d.value.lastIndexOf("]")
                );
                return bpmLangValue === lang;
            });
            if (!dataLang) {
                dataLang = element.render.properties.data.find(function(d) {
                    bpmLangValue = d.value.substring(
                        d.value.lastIndexOf("[") + 1, 
                        d.value.lastIndexOf("]")
                    );
                    return lang.indexOf(bpmLangValue) >= 0;
                });
                bizagi.iframeCommunicator.trigger("language-loaded-error", bpmLangValue);
            }
            if (dataLang) {
                var langId = dataLang.id;
                $.when(self.dataService.getCurrentUser()).done(function (currentUserDataBefore) {
                    $.when(serviceRender.multiactionService.submitData({
                        action: "SAVEUSERPREFERENCES",
                        contexttype: "entity",
                        data: { language: langId },
                        idPageCache: data.form.pageCacheId,
                        surrogatekey: currentUserDataBefore.idUser
                    })).done($.proxy(function () {
            
                    $.when(assignLanguage(bpmLangValue)).done(function () {
                        bizagi.util.changeData({ language: bpmLangValue });
                    }).fail(function (data) { 
                        console.error(data);
                    });
                    
                    bizagi.iframeCommunicator.trigger("language-loaded", bpmLangValue);
            
                    }, data)).fail(function (data) {
                    });
                });
                
            }
        }
    },

    /**
    * Bind tree navigation
    */
    configureTreeNavigation: function () {
        var self = this;
        var content = self.getContent();

        var categoryTree = $("#categoryTree", content);



        // Bind header events
        $("li:last-child", categoryTree).click(function () {
            // Remove all elements
            $(this).nextAll().remove();
            // Clear autocomplete field value
            $("#searchNewCase", content).val("");
            var idCategory = $(this).children("#idParentCategory").val();
            var appId = $(this).data('appid');
            if ($("li", categoryTree).length == 1) {
                bizagi.idCategory = undefined;

            }
            // if it has appId, reset bizagi.idCategory in orden to unlock criticSection
            if (appId) {
                bizagi.idCategory = undefined;
            }
            // Render category again
            self.renderCategories(idCategory, appId);
        });
    },

    /**
    *  Bind the vertical scroll buttons
    */
    scrollVertical: function (options) {
        var self = this;
        var content = self.getContent();
        options = options || {};
        //$("#categories", content).bizagiScrollbar(options);
    },

    busyLoop: function (options) {
        var x = 1;
        var y = null; // To keep under proper scope

        setTimeout(function () {
            x = x * 3 + 2;
            y = x / 2;
        }, 100);
    }
});
