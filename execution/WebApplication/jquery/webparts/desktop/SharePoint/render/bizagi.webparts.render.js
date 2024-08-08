/*
 *   Name: BizAgi Workportal Render Webpart
 *   Author: Fredy Vasquez
 *   Comments:
 *   -   This script will define a base class to all widgets
 */

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.render", {
    ASYNC_CHECK_TIMER: 3000
}, {

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;
        self.hasIdWorkitem = typeof(initialParams.idWorkitem) !== 'undefined';
        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners
        this.subscribe("ui-bizagi-show-render", function (e, params) {
            self.renderForm(params);
        });

        // Se genera un evento desde NewCase para que se despliegue la info en el Render
        this.subscribe("ui-bizagi-show-render-new", function (e, params) {
            self.newCaseRenderForm(params);
        });

        // The process webpart fire this event to cases, and render display a old case, it's preferably show empty form
        this.subscribe("ui-bizagi-show-cases", function (e, params) {
            self.emptyRenderForm(params);
        });

        // Other webpart try hide render, but render prevent this action if autosave not finish
        this.subscribe("ui-bizagi-can-change-activityform", function () {
            return self.canHide();
        });

        // fix double scroll when open form-detail modal in webparts 
        $(document).off("hide-webpart-scroll"); 
        $(document).on("hide-webpart-scroll", function(_, params) { 
            $('#bz-webpart').css('overflow-y', 'hidden'); 
        });
        $(document).off("show-webpart-scroll"); 
        $(document).on("show-webpart-scroll", function(_, params) { 
            $('#bz-webpart').css('overflow-y', 'auto'); 
        });

        self.VALID_APPLICATION_PARENT = [ 'WORKPORTAL', 'NEWWORKPORTAL', 'SITES' ];
        var applicationParent = (initialParams.applicationParent || "");
        if (self.VALID_APPLICATION_PARENT.indexOf(applicationParent.toUpperCase()) >= 0) {
            /*
        * If this flag is true when the next action is launched the current activity is processed but the next activity don't
        */
            self.applicationParent = applicationParent;
        }
        self.timeoutTriggerHandler = {};

        //waitContainer
        this.waitContainer = initialParams.waitContainer;
        this.previousLoadRender = false;
        this.adjustButtonsToContent = initialParams.adjustButtonsToContent;
    },

    /*
     *   Renders the content for the current controller
     */
    renderContent: function () {
        var self = this;

        var template = self.workportalFacade.getTemplate("render");
        var content = self.content = $.tmpl(template);

        return content;
    },

    /*
     *   Customize the web part in each device
     */
    postRender: function (params) {
        var self = this;
        params.context = "sharepoint";
        params.sharepointProxyPrefix = self.sharepointProxyPrefix;

        var getApplicationParam = location.search.match(/application=([^&]*)/);
        if (getApplicationParam) {
            if (self.VALID_APPLICATION_PARENT.indexOf(((getApplicationParam)[0].split("="))[1].toUpperCase()) >= 0) {
                params.context = "workflow";
            }
        }

        // If params.loadExternalWebpart is true means that the render is being loaded from other webpart
        if(!params.loadExternalWebpart){
            if (params.idWfClass != null) {
                if (params.newWorkportalStartForm) {
                    self.loadStartProcess(params);
                } else {
                    self.newCaseRenderForm(params);
                }
            } 
            else if (params.idWorkitem) {
                self.renderingExecute(params);
            } else if(params.loadPreferences) {
                self.renderPreferences(params.idUser);
            } 
             else {
                self.params = params;
                self.performRouting();
            }
        }

        var externalThemeCssUrl = "jquery/webparts/desktop/SharePoint/render/bizagi.webpart.render.externaltheme.less";

        self.bizagiIframeCommunicator = new bizagi.webpart.services.iframeCommunicator(self);

        self.bizagiIframeCommunicator.addCommListeners(self.iframeCommunicationListenersList(), true, externalThemeCssUrl);  //(listeners list, apply external styles, styles url)

        // Apply external theme styles
        self.applyExternalThemeStyles();

        self.endWaiting();

        document.getElementById("bz-webpart").style["overflow-y"] = "auto";

        
 
    },
    iframeCommunicationListenersList: function(){
        var self = this;

        var iframeCommunicationListeners = {};

        // If params.loadExternalWebpart is true means that the render is being loaded from other webpart
        // So, these events are not necessary in the other webpart. example: queryForm webpart
        if(!self.params.loadExternalWebpart){
            iframeCommunicationListeners = {
            "go-down": {
                then: self.subscribeToGoDown
            },
            "load-form-case": {
                then: self.loadFormCase
            },
            "load-activity-form": {
               then: self.performRouting
            },
            "load-global-form": {
                then: self.loadGlobalForm
            },
            "check-pending-changes": {
                then: self.pendingChanges

            },
            "save-form": {
                then: self.saveForm
            },
            "create-case": {
                then: self.createCase
            },
            "set-custom-font": {
                then: self.addFontFromExternal
            },
            "remove-bizagi-themes": {
                then: self.removeBizagiThemes
            },
            "without-pending-changes": {
                then: self.withoutPendingChanges
            },
            "dispose-form": {
                then: self.disposeForm
            },
            "update-token": {
                then: self.updateToken
            },
            "update-preferences": {
                then: self.updateDataPreferences
            },
            "keep-alive-session": {
                then: self.keepAliveSession

            }
            };
        }
        return iframeCommunicationListeners;
    },
    /*
     *   Listener to ui-bizagi-show-render event
     */
    renderForm: function (params) {
        //Creates a new case based on the selected process        
        var self = this;
        self.helper.addWaitContainer(self.waitContainer);
        self.params = params;
        self.refresh(self.params);
    },

    /*
     *   Creates a new case based on the selected process
     */
    newCaseRenderForm: function (params) {
        var self = this;
        
        self.helper.addWaitContainer(self.waitContainer);

        if (params.guidAction) {
            // Perform the mapping  
            return $.when(self.dataService.getMapping({
                guidAction: params.guidAction,
                accumulatedContext: { context: params.accumulatedContext }
            })).pipe(function (mappings) {

                return self.startProcess(params, mappings);
            });
        } 

        return $.when(self.startProcess(params));
    },

    startProcessPostMessage: function (params, mappings) {
        var self = this;
        var idWfClass = params.idWfClass;
        var organization = params.idOrganization;
        var defer = new $.Deferred();
        $.when(self.dataService.startProcess({
            idProcess: idWfClass,
            entityMapping: JSON.stringify(mappings),
            idOrganization: organization
        })).pipe(function (data) {
            self.showTitle(data);
            bizagi.iframeCommunicator.trigger("form-rendered");
            if (data.hasStartForm) {
                // Creates a new case
                var data = {
                    h_action: "LOADSTARTFORM",
                    h_mappingstakeholders: true,
                    h_idProcess: idWfClass
                };
                if (mappings) {
                    for (var i = 0; i < mappings.length; i++) {
                        data[mappings[i].xpath] = mappings[i].surrogateKey[0];
                    }
                }
                
                if(bizagi.util.detectRealDevice() === "desktop") {
                    $.when(self.dataService.getStartForm(data)).then(function (data) {
                        self.renderingExecute({data: data, type: ""});
                    });
                } else {
                    self.renderingExecute({
                        idWfClass: idWfClass
                    });
                }

            } else {
                //Load NewCase data in render form
                params.idCase = data.caseInfo.idCase;
                params.idWorkitem = data.caseInfo.workItems && data.caseInfo.workItems.length > 0 ? data.caseInfo.workItems[0].idWorkItem : "";
                self.renderingExecute(params);
            }

            return data;
        }).fail(function (msg) {
            self.manageError(msg, defer);
        });
    },

    startProcess: function (params, mappings) {
        var self = this;
        var idWfClass = params.idWfClass;
        var organization = params.idOrganization;
        var defer = new $.Deferred();
        // Start a process
        return $.when(self.dataService.startProcess({
            idProcess: idWfClass,
            entityMapping: JSON.stringify(mappings),
            idOrganization: organization
        })).pipe(function (data) {
                    if (data.hasStartForm) {
                        // Creates a new case
                        var data = {
                            h_action: "LOADSTARTFORM",
                            h_mappingstakeholders: true,
                            h_idProcess: idWfClass
                        };
                        if (mappings) {
                            for (var i = 0; i < mappings.length; i++) {
                                data[mappings[i].xpath] = mappings[i].surrogateKey[0];
                            }
                        }
                        if(bizagi.util.detectRealDevice() === "desktop") {
                            $.when(self.dataService.getStartForm(data)).then(function (data) {
                                self.renderingExecute({data: data, type: ""});
                                self.publish("ui-bizagi-show-summary", params);
                            });
                        } else {
                            self.renderingExecute({
                                idWfClass: idWfClass
                            })
                        }

                    } else {
                        //Load NewCase data in render form
                        params.idCase = data.caseInfo.idCase;
                        params.data = data.caseInfo;
                        params.idWfClass = null;
                        self.renderForm(params);
                    }
                    return data;
                }).fail(function (msg) {
                    self.manageError(msg, defer);
                });
    },

    loadStartProcess: function (params) {
        var self = this;
        var idWfClass = params.idWfClass;
      
            // Creates a new case
            var data = {
                h_action: "LOADSTARTFORM",
                h_mappingstakeholders: true,
                h_idProcess: idWfClass
            };
        
            $.when(self.dataService.getStartForm(data)).then(function (data) {
                self.renderingExecute({data: data, type: ""});
            });
    },

    emptyRenderForm: function () {
        // Clear content
        this.content.empty();
    },

    performRouting: function (e=null) {
        var self = this;
        var params = self.params;
        params.idCase = e && e.message? e.message.idCase : self.params.idCase;
        params.fromWorkItemId = e && e.message? e.message.idWorkitem : self.params.idWorkitem;

        if ( params.idCase == '-1') {
            return bizagi.iframeCommunicator.trigger("form-rendered-error", 'process does not exist');
        }

        $.when(self.dataService.routing.getRoute(params)).done(function (route) {
            route = route || {};
            route.moduleParams = route.moduleParams || {};
            self.workItemsRestResponse = route.moduleParams.workItemsRestResponse || {};

            if (!self.applicationParent) {
                self.defaultRouting(route);
            } else {
                switch( self.applicationParent ) {
                    case "NEWWORKPORTAL":
                        self.customRouteWorkportal(route);
                        break;
                }
            }
        });
    },

    defaultRouting: function(route) {
        var self = this;
        var params = self.params;
        params.fromWorkItemId = self.params.idWorkitem;

        switch (route.module) {
            case "projectDashboard":
            case "activityform":
                if (route.moduleParams.idWorkitem) {
                    //The autosave verification always be before this step, not necesary autosave in this place
                    self.publish("ui-bizagi-show-render", {
                        idWorkitem: route.moduleParams.idWorkitem,
                        idCase: route.moduleParams.idCase,
                        idTask: route.moduleParams.idTask
                    });
                }
                else {
                    if (route.moduleParams.messageForm) {
                        self.showFinishMessage(route.moduleParams.messageForm)
                    }
                    else {
                        if (route.moduleParams.withOutGlobalForm) {
                            //Render Finish Message 
                            self.showFinishMessage(self.resources.getResource("render-without-globalform"))
                        }
                        else {
                            //Render summary form
                            params.idWorkitem = null;
                            params.data = null;
                            params.idCase = route.moduleParams.idCase;
                            params.guid = route.moduleParams.guid;
                            self.renderingExecute(params);
                        }
                    }
                    self.publish("ui-bizagi-show-summary", route.moduleParams);
                    self.hideButtons();
                }
                break;
            case "oldrenderintegration":
                // TODO: Implement route for old render v1
                break;
            case "async":
                self.checkAsyncProcessingStatus();
                break;
            case "routing":
                self.publish("ui-bizagi-show-activitySelector", route.moduleParams)
                break;
        }
    },

    customRouteWorkportal: function(route) {
        var self = this;
        self.hideButtons();
        // Cuando idWorkitem = 0 significa que no hay más actividades pendientes. Sin embargo cuando
        // hay tareas paralelas y la siguiente actividad a trabajar puede ser cualquiera de ellas, el idWorkitem queda en 0 y
        // y se setea route.moduleParams.data.workItems con las tareas siguientes (jquery\workportal\js\services\bizagi.workportal.services.routing.js en el método getRoute, esto ocurre porque en workportal actual sale un dialog de routing para que el usuario seleccione la tarea en la que va a trabajar), 
        // en este caso route.module = 'routing'
        // por lo tanto si idWorkItem = 0 pero existe route.moduleParams.data.workItems, significa que si hay tareas siguientes.
        withoutNextActivity = !route.moduleParams.idWorkitem && !(route.moduleParams.data && route.moduleParams.data.workItems)
        if (route.module === 'async') {
            return self.checkAsyncProcessingStatus();
        }
        var message = route.moduleParams.messageForm
            ? route.moduleParams.messageForm
            : ( withoutNextActivity ? self.resources.getResource("render-without-globalform"): "");
        var showGlobalForm = withoutNextActivity && !route.moduleParams.messageForm && !route.moduleParams.withOutGlobalForm;
        var isCustomMessage = !!route.moduleParams.messageForm;

        window.clearTimeout(self.timeoutTriggerHandler);
        self.timeoutTriggerHandler = setTimeout(function() {
            self.sendDataToCustomRouting({
                idCase: route.moduleParams.idCase,
                message: message,
                showGlobalForm: showGlobalForm,
                isCustomMessage: isCustomMessage
            });
        }, 100);
    },

    sendDataToCustomRouting: function (params) {
        var self = this;
        self.sendDimensionsiFrame(true);
        var finishMessage = params.message || '';
        var showGlobalForm = params.showGlobalForm;
        $.when(self.dataService.getCaseSummary({
            idCase: params.idCase,
            onlyUserWorkItems: true
        }))
        .done(function (data) {
            // When the form is a start form, data is null
            data = data || {};
            data.finishMessage = finishMessage;
            data.hasPendingActivities = !finishMessage;
            data.showGlobalForm = showGlobalForm;
            data.isCustomMessage = params.isCustomMessage;
            var workItemsResponse = data.currentState.lenght? data.currentState : (self.workItemsRestResponse || []);

        
            if(!self.fromNextButton && (data.isClosed === 'true' || data.isAborted || !data.hasPendingActivities)) {
                // When the routing is not generated from a click on the next button and the case is already closed, or aborted or doesn't have pending activities, the routing event in new workportal doesn't have to be triggered
                // this avoids that the case cannot be opened when is already closed, aborted or without pending activities and the goToInbox in preferences is turned on.
                bizagi.iframeCommunicator.trigger("form-rendered", { summaryResponse: data, workItemsResponse: workItemsResponse });
            } else {
                // Send message to new workportal to let it know how to do  the routing, this happens for example when next is applied
                bizagi.iframeCommunicator.trigger("routing-performed", { summaryResponse: data, workItemsResponse: workItemsResponse });
            }
            self.fromNextButton = false;
        });
    },

    renderingExecute: function (params) {
        params = params || {};
        var self = this;
        self.previousLoadRender = true;
        self.showTitleReady = false;

        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-render-container", content);
        if (!canvas.length) {
            canvas = content;
        }
        var mobileTemplate = self.workportalFacade.getTemplate("render-mobile");
        var loading = self.workportalFacade.getTemplate("loading-render");

        if (typeof bizagi.theme !== "undefined" && bizagi.theme.type != "predefined" && bizagi.theme.value) {
            try {
                params.themeVars = JSON.stringify(bizagi.theme.value);
            } catch (e) {
                params.themeVars = null;
            }
        }
        
        if ( self.applicationParent ) {
            params.applicationParent = self.applicationParent;
        }

        $.tmpl(loading).appendTo(canvas);
        
        var mashupRef = location.search.match(/mashup=([^&]*)/);
        var loadMashup = true;
        if (mashupRef) {
            loadMashup = mashupRef[1] === 'true'? true : false;
        }

        // Detect device and initialize their facade
        if (bizagi.detectRealDevice() != "desktop" && loadMashup) {
            // initialize mashups
            var mashup;
            var device = bizagi.detectRealDevice();
            device = (device == "tablet") ? "tablet_android" : device;
            device = (device == "smartphone") ? "smartphone_android" : device;

            // Get oAuth Credentials
            var bizagiAuthentication = sessionStorage.getItem("bizagiAuthentication") || "{}";
            bizagiAuthentication = JSON.parse(bizagiAuthentication);
            var accessToken = bizagiAuthentication.accessToken || "";
            var refreshToken = bizagiAuthentication.refreshToken || "";
            var oAuthQueryStringParams = "&accessToken="+accessToken+"&refreshToken="+refreshToken;

            $(canvas).empty();
            var urlParameters = { device: device };

            $.each(params, function (key, value) {
                // Take only strings and number parameters
                if(typeof (value) === "string") {
                    urlParameters[key] = $.trim(value);
                } else if (typeof(value) == "number") {
                    urlParameters[key] = value;
                }
            });

            //Get external theme variables
            var themeVars =(self.externalStyle)?"&themeVars="+(JSON.stringify(self.externalStyle) || ""):"";
            urlParameters.remoteServer = window.location.toString().split("?")[0];
            var url = "../../../../mashup/index.webparts.html?" + $.param(urlParameters) + themeVars + oAuthQueryStringParams;
            var height = window.innerHeight - 2;
            var iframe = $.tmpl(mobileTemplate, {url: url, device: device, height: height});
            if(bizagi.detectRealDevice().search("ios") !== -1 && urlParameters.iframeidentifier == "iframePopUprenderComplete") {                
                iframe.css("height", "90vh");
            }

            $(canvas).append(iframe);
            bizagi.iframeCommunicator.subscribe("mashup-resize-content", function (params) {
                iframe.css("height", params.message.height + "px");
                bizagi.iframeCommunicator.send({
                    message: {
                        iframeHeight: params.message.height,
                        iframeName: BIZAGI_IFRAME_IDENTIFIER
                    }
                });
            });

        } else {
            // initialize desktop render   
            var rendering = self.rendering = new bizagi.rendering.facade(params);
            rendering.execute($.extend(params, {
                canvas: canvas
            }));

            rendering.subscribe("rendering-formRendered", function () {
                //se detecto una situaci�n, hay ocasiones en donde por cada ejecuci�n del rendering.execute ingresa varias veces al done.
                //Se agrego un filtro para minimizar la cantidad de veces que entra al m�todo showTitle
                //if (!self.showTitleReady) {

                //-- Solo para user preferences form
                if(self.params.loadPreferences){
                    self.preferenceForm = self.rendering.form;
                }

                self.sendDimensionsiFrame(true);
                self.showTitle(params);
                $.when(self.dataService.getCaseSummary({
                    idCase: params.idCase,
                    onlyUserWorkItems: true
                }))
                .done(function (data) {
                    // When the form is a start form, data is null
                    data = data || {};
                    var workItemsResponse = data.currentState || [],
                        _processName = bizagi.util.tryCatch(
                            function() { return params.data.properties.breadCrumb[0];},
                            ""
                        ),
                        _activityName = bizagi.util.tryCatch(
                            function() { return params.data.properties.breadCrumb[1];},
                            ""
                        );
                    bizagi.iframeCommunicator.trigger("form-rendered", {
                        summaryResponse: data,
                        workItemsResponse: workItemsResponse,
                        processName: _processName,
                        activityName: _activityName,
                        fromLoadFormCase: self.params.fromLoadFormCase
                    });
                });
            });

            rendering.subscribe("rendering-formRenderedError", function(ev, message) {
                bizagi.iframeCommunicator.trigger("form-rendered-error", { message: message } );
            });

            $(window).resize(function () {
                self.rendering.resize({
                    forceResize: true
                });
            });
            // Attach handler to render container to subscribe for routing events
            if (canvas) {
                canvas.bind("routing", function (_, args) {
                    if(args.errorType) {
                        bizagi.iframeCommunicator.trigger("form-rendered-error", {errorType: args.errorType, message:args.message});
                    } else {
                        self.params.idCase = args.idCase;
                        self.routingDisabled = args.routingDisabled;
                        if(self.params.newWorkportalStartForm){ 
                            bizagi.iframeCommunicator.trigger("case-created-after-start-form", { idCase: args.idCase });
                        } else{
                            window.clearTimeout(self.timeoutTriggerHandler);
                            self.timeoutTriggerHandler = setTimeout(function() {
                                self.fromNextButton = true;
                                self.performRouting();
                            }, 100);
                        }
                    }
                });
            }
        }
    },
    /* User preferences form*/
    renderPreferences: function(idUser){
        var self = this;
        var preferencesParams = {
            h_action: "LOADUSERPREFERENCESFORM",
            h_contexttype: "entity",
            h_guidForm: "0" 
            // En desktop.widgets.admin.preferences.js se llama al servicio getPreferenceFormParams() para obtener este guidForm,
            // el servicio siempre responde "0". Estos casos ya no se presentan, debido a que este servicio es muy viejo. 
            // Por lo tanto, se fija el valor "0" directamente.
        };

        if(idUser){
            bizagi.currentUser = { idUser: idUser }; 
        }
        
        self.dataService.getPreferencesForm(preferencesParams).done(function (data) {
            self.renderingExecute({ data: data });
        });
    },
    updateDataPreferences: function(){
        var self = this; 
        if (self.preferenceForm.validateForm()) { 
            // UserConfig object sent from new-workportal when user clicks on update button 
            self.updateDataMultiactionService();
        }
    },
    updateDataMultiactionService: function(){
        var self = this;
        var serviceRender = new bizagi.render.services.service();
        var data = self.preferenceForm.collectRenderValuesForSubmit();
            
        $.when(serviceRender.multiactionService.submitData({
            action: "SAVEUSERPREFERENCES",
            contexttype: "entity",
            data: data,
            surrogatekey: bizagi.currentUser.idUser,
            idPageCache: self.preferenceForm.idPageCache
        })).done($.proxy(function () {

            $.when(self.dataService.getCurrentUser()).done(function (currentUserData) {

                //Change language on sessionStorage if change language on preferences
                if (data.language) {
                    // Changing languaje
                    $.when(assignLanguage(currentUserData.language)).done(function () {
                        bizagi.util.changeData({ language: currentUserData.language });
                        // Rendering
                        self.renderPreferences();
                        bizagi.iframeCommunicator.trigger("preferences-updated-successfully", currentUserData);
                    }).fail(function (data) { 
                        bizagi.iframeCommunicator.trigger("preferences-updated-fail", data.message);
                    });
                    
                } else {
                    // Rendering
                    self.renderPreferences();
                    bizagi.iframeCommunicator.trigger("preferences-updated-successfully", currentUserData);
                }
            });

        }, data)).fail(function (data) {
            bizagi.iframeCommunicator.trigger("preferences-updated-fail", data.message);
            self.renderPreferences();
        });
    },
    checkAsyncProcessingStatus: function (params) {
        var self = this;
        var params = params || self.params;

        $.when(self.dataService.getAsynchExecutionState({ idCase: params.idCase }))
            .done(function (response) {

                // Check what to do next
                if (response.state == "Processing") {
                    // Verify errors in response
                    if (response.state == "Error" && response.errorMessage != undefined) {
                        // Change default error
                        response.errorMessage = bizagi.localization.getResource("render-async-error");

                    } else {
                        // Re-draw async feedback until finished
                        setTimeout(function () {
                            self.hideAsyncFeedback();
                            self.performRouting();
                        }, self.Class.ASYNC_CHECK_TIMER);
                    }

                    // Show feedback
                    self.showAsyncFeedback(response);


                } else if (response.state == "Finished") {
                    // Re-execute routing to draw next activity
                    self.performRouting();
                }
            });
    },
    showAsyncFeedback: function (response) {
        var self = this;
        var template = self.getTemplate("render-async");
        var asyncMessage = $.tmpl(template, response);
        var canvas = self.canvas;
        canvas.append(asyncMessage);
    },

    hideAsyncFeedback: function () {
        var self = this;
        var canvas = self.canvas;
        var asyncMessage = $("#ui-bizagi-webpart-render-async-wrapper", canvas);
        asyncMessage.remove();
    },
    hideButtons: function () {
        var self = this;
        var buttonContainer = $(".ui-bizagi-button-container", self.getContent());
        if (buttonContainer.lenght > 0) {
            buttonContainer.remove();
        }
        else {
            //because performance
            var buttonContainerbody = $(".ui-bizagi-button-container");
            buttonContainerbody.remove();
        }
    },
    showFinishMessage: function (message) {
        var self = this;
        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-render-container", content);
        //Add finish message when case is finish
        var errorTemplate = self.workportalFacade.getTemplate("info-render");
        var endMessageHtml = $.tmpl(errorTemplate, {
            message: message
        });
        // Load end Message   
        canvas.empty();
        endMessageHtml.appendTo(canvas);
    },

    showTitle: function (params) {
        var self = this;
        var content = self.getContent();
        if (!params.idCase) {
            $(".ui-bizagi-webpart-header-container", content).empty();
            return;
        }
        // Call case summary service for header case
        $.when(self.dataService.getCaseSummary({
                idCase: params.idCase,
                onlyUserWorkItems: true
            }))
            .done(function (data) {
                // When the form is a start form, data is null
                data = data || {};

                //Add Title
                var titleTemplate = self.workportalFacade.getTemplate("title-render");
                var caseNumber = data.caseNumber;
                var processPath = data.processPath + data.process;
                var workItemState;

                if (params.idWorkitem) {
                    $.each(data.currentState, function (index, dataValue) {
                        if (dataValue.idWorkItem == params.idWorkitem) {
                            workItemState = dataValue.state;
                        }
                    });
                }

                var titleMessageHtml = $.tmpl(titleTemplate, {
                    caseNumber: caseNumber,
                    workItemState: workItemState,
                    processPath: processPath
                });
                //$(".ui-bizagi-webpart-header-container", content).html(titleMessageHtml);
                $(".ui-bizagi-webpart-header-container", content).empty();
                titleMessageHtml.appendTo(".ui-bizagi-webpart-header-container", content);

                self.resizeInPopUp(titleMessageHtml, params);

                //Filtro de veces de ejecucion
                self.showTitleReady = true;

            });
    },

    hideTitle: function () {
        self = this;
        var content = self.getContent();
        var titleHeader = $(".ui-bizagi-webpart-header-container", content);
        if (titleHeader.length > 0) {
            titleHeader.empty();
        }
    },
    resizeInPopUp: function (titleMessageHtml, params) {
        var self = this;
        if (self.adjustButtonsToContent && (self.adjustButtonsToContent == "true" || self.adjustButtonsToContent == true)) {
            if (self.isWebpartInIFrame) {
                self.resizeInPopUpinIFrame(titleMessageHtml, params);

                $(window).resize(function () {
                    self.resizeInPopUpinIFrame(titleMessageHtml, params);
                });
            }
            else {
                self.resizeInPopUpHTML(titleMessageHtml, params);

                $(window).resize(function () {
                    self.resizeInPopUpHTML(titleMessageHtml, params);
                });
            }
        }
        var height =  $("#bz-webpart").height();
        bizagi.iframeCommunicator.trigger("bz-webpart-size", { height: height});
    },

    resizeInPopUpHTML: function (titleMessageHtml, params) {
        var self = this;
        var heightHeader = titleMessageHtml.outerHeight() || 0;
        if ($(".activitiFormContainer").length > 0) {
            $(".activitiFormContainer").css("height", "90%");
            var heightActivitiFormContainer = $(".activitiFormContainer").outerHeight() || 0;
            var renderForm = $("#ui-bizagi-webpart-render-container", self.getContent());
            if (params.idWorkitem) {
                //display buttons
                var buttonContainer = $(".ui-bizagi-button-container", self.getContent());
                var heightButtonContainer = buttonContainer.outerHeight() || 0;
                buttonContainer.appendTo(renderForm.parent());
                buttonContainer.addClass("ui-bizagi-button-container-popup");
                var fixedHeight = heightActivitiFormContainer - heightHeader - 38 - heightButtonContainer;
                if(bizagi.util.isSharepointContext()) {
                    renderForm.css("height","auto");
                    if(renderForm.outerHeight() > fixedHeight) {
                        renderForm.height(fixedHeight);
                    } else {
                        $(".activitiFormContainer").css("padding-bottom", "38px");
                        $(".activitiFormContainer").height("auto");
                        document.getElementById("bz-webpart").scrollIntoView();
                    }
                } else {
                    renderForm.height(fixedHeight);
                }
                
            }
            else {
                //NOT display buttons
                renderForm.height(heightActivitiFormContainer - heightHeader - 48);
            }

            renderForm.css('overflow-y', 'auto');
            renderForm.css('overflow-x', 'hidden');
        }
    },

    resizeInPopUpinIFrame: function (titleMessageHtml, params) {
        var self = this;
        var renderForm = $('body');
        if (params.idWorkitem) {
            var buttonContainer = $(".ui-bizagi-button-container", self.getContent());
            buttonContainer.appendTo(renderForm);
            buttonContainer.addClass("ui-bizagi-button-container-popup");

            buttonContainer.css({ 'position': 'fixed', 'bottom': '0px', 'width': '100%', 'margin':'0','background-color': '#F3F3F3','z-index':'auto'});

            var heightButtonContainer = buttonContainer.height() || 0;
            heightButtonContainer = heightButtonContainer * 2;
            renderForm.css({'padding-bottom': heightButtonContainer + 'px'});
            renderForm.css({'height': '100%'});
        }
    },

    destroy: function () {
        var self = this;

        self.unsubscribe("ui-bizagi-show-render");
        self.unsubscribe("ui-bizagi-show-render-new");
        self.unsubscribe("ui-bizagi-show-cases");

    },

    canHide: function () {
        var self = this;
        if (self.avoidVerifyCanHide) {
            self.avoidVerifyCanHide = undefined;
            //send a deferred whit always resolve promise
            var deferred = $.Deferred().resolve();
            return deferred.promise();
        }
        // Check if there asre some pending changes
        return bizagi.util.autoSave();
    },

    prepareForRefresh: function () {
        var self = this;
        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-render-container", content);
        canvas.off();
        $(window).unbind("resize");

        // Dispose current rendering instance
        if (this.rendering) {
            this.rendering.dispose();
            delete this.rendering;
        }
    },
    subscribeToGoDown: function () {
        window.scrollTo(0, document.body.scrollHeight);
    },

    loadGlobalForm: function(e) {
        var self = this;
        var params = {};
        params.idCase = e.message.idCase;
        params.idWorkitem = null;
        params.data = null;
        params.guid = null;
        self.renderingExecute(params);
    },

    loadFormCase: function (e) {
        var self = this;
        self.params.idCase = e.message.idCase;
        self.params.idWorkitem = e.message.idWorkItem;
        self.params.fromLoadFormCase = true;

        var params = {};
        params.idCase = e.message.idCase;
        params.idWorkitem = e.message.idWorkItem;
        params.data = null;
        params.guid = null;
        if (params.idWorkitem && params.idCase) {
            self.renderingExecute(params);
        } else if (!params.idWorkitem && params.idCase) {
            $.when(self.dataService.getCaseSummary({
                idCase: params.idCase,
                onlyUserWorkItems: true
            }))
            .done(function (summaryResponse) {
                var currentState =  summaryResponse.currentState[0];
                if ( currentState ) {
                    params.idWorkitem = currentState.idWorkItem;
                    self.renderingExecute(params);
                } else {
                    self.performRouting();
                }
            });
        }
    },

    createCase: function (e) {
        var self = this;
        self.hideTitle();
        self.params.fromLoadFormCase = false;
        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-render-container", content);
        if (canvas.length > 0) {
            $(canvas).empty();
        }
        var params = {
            idWfClass : e.message.idWfClass,
            accumulatedContext: e.message.accumulatedContext,
            guidAction: e.message.guidAction
        };
        self.params.idWfClass = parseInt(params.idWfClass);
        self.params.accumulatedContext = params.accumulatedContext || [];
        if( self.params.idWorkitem ) delete self.params.idWorkitem;
        if( self.params.fromWorkItemId ) delete self.params.fromWorkItemId;
        self.params.guidAction = params.guidAction;
        if (params.guidAction) {
            // Perform the mapping  
            return $.when(self.dataService.getMapping({
                guidAction: params.guidAction,
                accumulatedContext: { context: JSON.parse(params.accumulatedContext) }
            })).pipe(function (mappings) {
                return self.startProcessPostMessage(params, mappings);
            });
        } 
        return $.when(self.startProcessPostMessage(params));
    },

    pendingChanges: function () {
        var self = this;
        var changes = [];
        if (self.rendering && self.rendering.form) {
            self.rendering.form.hasChanged(changes);
        }
        bizagi.iframeCommunicator.trigger( changes.length > 0 ?  "form-has-changes" : "form-without-changes");
    },

    // Discard changes and close form
    withoutPendingChanges: function () {
        var self = this;
        self.rendering.form.refreshForm().done(function () {
            bizagi.iframeCommunicator.trigger("refresh-finished");
        });
    },

    disposeForm: function () {
        var self = this;
        self.rendering.form.dispose();
    },

    saveForm: function () {
        var self = this;
        var data = {};
        self.rendering.form.collectRenderValues(data);
        $.when(self.rendering.form.saveForm(data)).done(function () {
            bizagi.iframeCommunicator.trigger("form-saved");
        });
    },

    updateToken: function (e) {
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer ' + e.message.token
            }
        });
    },

    readExternalTheme: function (theme) {
        var self = this;

        // Apply external styles to custom override theme
        var externalThemeCssUrl = "jquery/webparts/desktop/SharePoint/render/bizagi.webpart.render.externaltheme.less";
        $.ajax({ url: externalThemeCssUrl, dataType: "text" })
            .done(function (text) {
                var processedVars = ""
                for (name in theme) {
                    processedVars += ((name.slice(0, 1) === '@') ? '' : '@') + name + ': ' +
                        ((theme[name].slice(-1) === ';') ? theme[name] : theme[name] + ';');
                }
                less.render(text + processedVars, function(err, processedCss) {
                    if (!err) {
                        self.createDynamicStyleSheet(processedCss.css);
                    }
                });
            });
    },

    applyExternalThemeStyles: function () {
        var self = this;

        // Set up a global flag to avoid apply this every time this webpart is rendered
        if (bizagi.externalStylesApplied) return;
        
        self.createDynamicStyleSheet(self.externalStyle);
        self.bizagiIframeCommunicator.createDynamicStyleSheet(self.externalStyle);
        bizagi.externalStylesApplied = true;
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

    jsonToStyle: function (json) {
        var result = "";
        for (var key in json) {
            result += '' + key + ': ' + json[key] + ';'
        }
        return result;
    },
    
    createDynamicStyleSheet: function (styles) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styles;
        document.getElementsByTagName('head')[0].appendChild(style);
    },

    addFontFromExternal: function (e) {
        var self = this;
        var fontFamily;

        if (typeof e.message === "string") {
            fontFamily = e.message;
        } else {
            fontFamily = "sitesCustomFont";
            $("head").prepend("<style type=\"text/css\">" +
            "@font-face {\n" +
            "\tfont-family: \"sitesCustomFont\";\n" +
    
            "\tsrc:"+ self.getFilesByFont(e.message) +"\n" +
            "}\n" +
            "</style>");
        }

        $("body").attr('style', 'font-family:' + fontFamily + ' !important');
        $("input").css('font-family',  fontFamily + ' !important');
        $(".ui-bizagi-notifications-header").attr('style', 'font-family:' + fontFamily + ' !important');
        $("a").attr('style', 'font-family:' + fontFamily + ' !important');
        $(".ui-button").css('font-family',  fontFamily + ' !important');
        $(".ui-bizagi-render-text").css('font-family',  fontFamily + ' !important');
        $(".ui-bizagi-render-button").css('font-family',  fontFamily + ' !important');
        $(".ui-bizagi-button").css('font-family',  fontFamily + ' !important');
        
        $('<style>')
            .prop('type', 'text/css')
            .html('#bz-webpart #ui-bizagi-webpart-render-container .ui-bizagi-render textarea, #render-canvas .ui-bizagi-render input,' +
            '#bz-webpart #ui-bizagi-webpart-render-container .ui-bizagi-render input, .ui-tabs .ui-tabs-nav li a, .ui-button, .ui-bizagi-button-container .ui-bizagi-button,' + 
            '.ui-bizagi-webpart-render-container .ui-bizagi-button.ui-button, #ui-bizagi-webpart-render-container .ui-button, .bz-button-data, .bz-button, .closeCanvas' +
            '#ui-bizagi-webpart-render-container .ui-bizagi-button-container .ui-bizagi-button, #ui-bizagi-webpart-render-container .ui-button.ui-state-default, .ui-bizagi-container-group-header a, text' +
            '.ui-dialog .ui-button, .ui-bizagi-wp-app-routing-container table .ui-button, .ui-bizagi-render-search, .ui-select-data, .ui-bizagi-render-numeric, .ui-select-dropdown {font-family:' + fontFamily + ' !important;}')
            .appendTo('head');
            
    },

    getFilesByFont: function(files) {
        var strFilesUrls = '';
        for (var index = 0; index < files.length; index++) {
            strFilesUrls += 'url(' + URL.createObjectURL(files[index]) + '), ';
        }
        return strFilesUrls.trim().slice(0, -1);
    },

    keepAliveSession: function(e) {
        var self = this;
        $.when(self.dataService.ping()).done(function () {
        });
    },

    /*
        Remove custom themes and styles applied in workportal 
    */
    removeBizagiThemes: function (e) {
        $('[id="bizagi-theme"]').each(function() {
            $(this).remove();
        });
        try {
            $("link[href*='jquery/overrides/css/desktop/bizagi.custom.styles.css']").prop('disabled', true);
            $("link[href*='jquery/overrides/css/desktop/bizagi.custom.styles.css']")[0].remove();
            $(".bz-signature__canvas").each(function() {
                $(this).jSignature("updateSetting", "color", "#000000", true);
            });
        } catch (error) {}
        bizagi.iframeCommunicator.trigger("session-timeout", { sessionTimeout: bizagiConfig.sessionTimeout});
    },


});
