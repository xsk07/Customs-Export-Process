/*
*   Name: BizAgi Workportal CaseSummary Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.caseSummary", {}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners       
        this.subscribe("ui-bizagi-show-summary-first", function (e, params) { self.loadFirstCase(params); });

        this.subscribe("ui-bizagi-show-summary", function (e, params) { self.showSummary(params); });

        this.subscribe("ui-bizagi-show-render", function (e, params) {
            self.showSummary(params);
        });

        bizagi.iframeCommunicator.subscribe("reload-sumary", function (e) {
            self.reloadRenderContent(e);
        });

        //waitContainer
        this.waitContainer = initialParams.waitContainer;

        //renderBehavior
        this.renderBehavior = initialParams.renderBehavior;
        //renderPageUrl
        this.renderPageUrl = initialParams.renderPageUrl;
        this.adjustButtonsToContent = initialParams.adjustButtonsToContent;
		this.graphicQueryBehavior = initialParams.graphicQueryBehavior;


        var device = bizagi.detectRealDevice();
        this.responsiveView = (device.indexOf("tablet") >= 0 || device.indexOf("smartphone") >= 0 )? true : false;
    },
    /*
    *   Renders the content for the current controller
    */
    reloadRenderContent: function (e) {
        var self = this;
        if (e.message.idCase) {
            var params = {};
            params.idCase = e.message.idCase;
            params.reloadWebpart = true;
            self.renderContent(params);
        }
    },
    renderContent: function (params) {
        var self = this;

        var defer = new $.Deferred();
        if (params.idCase) {
            $.when(self.dataService.summaryCaseDetails({
                idCase: params.idCase
            }))
            .done(function (data) {
                params.data = data;
                params.data.hasGlobalFormFlag = (params.data.hasGlobalForm === "true");
                var template = self.getTemplate("caseSummary");
                data.responsiveView = self.responsiveView;
                data.idWorkflow = data.idWorkFlow;
                data.onlySummaryForm = params.onlySummaryForm;
                if (params.reloadWebpart && !params.refreshedWebpart ) {
                    params.refreshedWebpart = true;
                    self.refresh(params);
                }
                var content = self.content = $.tmpl(template, data);
                self.callTaskDescription(data, content);
                // Format invariant dates
                bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));
                defer.resolve(content);

            }).fail(function (msg) {
                self.manageError(msg, defer);
            });
        }
        else {
            //Load first case for first load, deferred is necesary to webparts.webpart base function
            return self.loadFirstCaseWithDeferred(params);
        }
        return defer.promise();
    },
    
    /**
     * 
     * Call task description widget 
     */

    callTaskDescription: function (data, summary) {
        var self = this;
        var width = 230;
        var taskDescriptionParams = {
            classNeedsModal: "task_description_needs_modal",
            fromWebpart: true,
            width: width,
            template: self.getTemplate("task-description")
        };
        (new bizagi.workportal.widgets.task.description(self.workportalFacade, self.dataService, taskDescriptionParams)).renderManyTasksDescription(data.currentState, summary);
     },
    
    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {
        var self = this;
        var content = self.getContent();

        bizagi.iframeCommunicator = new bizagi.postmessage({
            remoteServer: params.remoteServer || document.location.origin,
            destination: window.parent,
            origin: window
        });

        self.loadExternalThemeStyles();
        var subprocessCanvas = $("#subprocess", content);
        var assigneesCanvas = $("#assignees", content);
        var eventsCanvas = $("#events", content);
        var formCanvas = $("#form", content);

        if (params.data) {
            if (params.data.hasGlobalForm === "true") {
                 self.postRenderForm($.extend(params, { canvas: formCanvas })) 
            } else {
                bizagi.iframeCommunicator.trigger("sumary-rendered");
            };
            if (params.data.showSubProcess) { self.postRenderSubprocess($.extend(params, { canvas: subprocessCanvas })); }
            if (params.data.showAssignees) { self.postRenderAssignees($.extend(params, { canvas: assigneesCanvas })); }
            if (params.data.showEvents) { self.postRenderEvents($.extend(params, { canvas: eventsCanvas })); }
        }

        $(".workonitRow", content).click(function (e) {
            e.stopPropagation();
            var buttom = $(this);
            params.title = $("h2", $(this).parent()).text();
            var idWorkItem = buttom.data("idworkitem");
            var idcase = buttom.parent().parent().parent().data("idcase");
            params.idWorkitem = idWorkItem;
            params.idCase = idcase;
            if (self.renderBehavior == "OtherPage") {
                window.open(self.renderPageUrl + "?type=activityForm&idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase);
            } else {
                self.publish("ui-bizagi-case-summary-workonit", params);
                self.displayRender(params);
            }
        });

        $(".parentProcessSummaryLink", content).click(function () {

            var parentProcesesData = $(this);
            params.idCase = parentProcesesData.data("idcase");
            params.idWorkitem = null;
            self.publish("ui-bizagi-case-summary-workonit", params);
            self.displayRender(params);
        });

        if(!self.responsiveView){
            $(".ui-bizagi-webpart-case-summary-details-tabs", content).tabs();
            $(".ui-bizagi-webpart-case-summary-details-tabs .ui-tabs-nav li", content).click(function() {
                if (self.adjustButtonsToContent) {
                    self.resizeInPopUp();
                }
            })
        }

        // In case popUp 
        if (self.adjustButtonsToContent) {
            self.resizeInPopUp();

            $(window).resize(function () {
                self.resizeInPopUp();
            });
        }


        // Add click to view workflow
        $(".ui-bizagi-wp-app-inbox-cases-graphical-view", content).click(function () {
            var idCase = $(this).data("idcase");
            var caseNumber = $(this).data("casenumber");
            var idWorkflow = $(this).data("workflowId");
			switch(self.graphicQueryBehavior) {
				case "PopUp":
					var webpartParams = $.extend({}, {
						idCase: idCase,
						caseNumber: caseNumber,
						fullScreen: true,
                        idWorkflow: idWorkflow
					}, {workportal: self.workportalFacade.workportal, isWebpartInIFrame: false});
					self.helper.displayWebPartPopUp("graphicquery", webpartParams);
					break;
				case"OtherPage":
					var baseUrl = "webpart.htm?type=graphicquery";
                    var url = baseUrl + "&idCase=" + idCase + "&caseNumber=" + caseNumber;
                    window.open(url);
					break;
                case "ParentPopUp":
                    var server = window.location.origin + window.location.pathname;
                    var url = server + "?type=graphicquery&idCase=" + idCase + "&caseNumber=" + caseNumber + "&idWorkflow=" + idWorkflow;
                    var popup = {
                        command: "BZ_OPEN_DIALOG",
                        parameters: {
                            url: url,
                            title: bizagi.util.trim(""+caseNumber),
                            allowMaximize: true,
                            showClose: true,
                            width: 1100,
                            height: 924
                        }
                    };

                    parent.postMessage(JSON.stringify(popup), '*');
                    break;
			}
            return false;
        });
        
        self.applyExternalThemeStyles();
        self.addCommListeners();
        self.endWaiting();
    },
    /* 
        Registers the post messages to establish communication between the webpart and the application that uses it
    */
    addCommListeners: function() {
        var self = this;
        var iframeCommunicationListeners = {
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
    /*
        Update token in workportal the keep alive session  in sites
    */
    updateToken: function (e) {
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer ' + e.message.token
            }
        });
    },
    /*
    postrender Form
    */
    postRenderForm: function (params) {
        var self = this;
        params.context = "sharepoint";
        params.sharepointProxyPrefix = self.sharepointProxyPrefix || "";
        var rendering = new bizagi.rendering.facade(params);
        // Executes rendering into render container
        rendering.execute({
            canvas: params.canvas,
            summaryForm: true,
            idCase: params.idCase
        }).done(function (result) {
            self.sendDimensionsiFrame();
            bizagi.iframeCommunicator.trigger("form-rendered");
            if (self.adjustButtonsToContent) {
                self.resizeInPopUp();
            }
        });
    },
    /**
    *   postRender Subprocess
    */
    postRenderSubprocess: function (params) {
        var self = this;
        var content = self.getContent();
        var htmlContent = "";
        var localCanvas = params.canvas;

        $.when(self.dataService.summarySubProcess({
            idCase: params.idCase
        }))
        .done(function (data) {
            var template = self.getTemplate("subprocess");
            htmlContent = $.tmpl(template, data);
            $(".subProcessSummaryLink", htmlContent).click(function () {
                var subProcesesData = $(this);
                params.idCase = subProcesesData.data("idcase");
                params.idWorkitem = null;
                self.publish("ui-bizagi-case-summary-workonit", params);
                self.displayRender(params);
            });

            htmlContent.appendTo(localCanvas, content);
        });
    },
    /**
    *   postRender Assignees
    */
    postRenderAssignees: function (params) {
        var self = this;
        var content = self.getContent();
        var htmlContent = "";
        var localCanvas = params.canvas;

        $.when(self.dataService.summaryAssigness({
            idCase: params.idCase
        }))
        .done(function (data) {
            var template = self.getTemplate("assignees");
            htmlContent = $.tmpl(template, data);
            htmlContent.appendTo(localCanvas, content);
        });
    },
    /**
    *   postRender Events
    */
    postRenderEvents: function (params) {
        var self = this;
        var content = self.getContent();
        var htmlContent = "";
        var localCanvas = params.canvas;

        $.when(self.dataService.summaryCaseEvents({
            idCase: params.idCase
        }))
        .done(function (data) {
            var template = self.getTemplate("events");
            htmlContent = $.tmpl(template, data);
            htmlContent.appendTo(localCanvas, content);

            $(".eventSummaryLink", htmlContent).click(function () {
                var eventData = $(this);
                params.idCase = eventData.data("idcase");
                params.idWorkitem = eventData.data("idworkitem");
                params.idTask = eventData.data("idtask");
                params.eventAsTasks = eventData.data("eventastasks");
                self.publish("ui-bizagi-case-summary-workonit", params);
                self.displayRender(params);
            });

        });
    },

    displayRender: function (params) {
        //Define Render Behavior
        var self = this;
        var title = params.title || "";
        switch (self.renderBehavior) {
            case "OtherWebPartThisPage":
                // Publish the event so any other webpart could react to that
                self.helper.publishShowRenderEvent("ui-bizagi-show-render", self, { idWorkitem: params.idWorkitem, idCase: params.idCase });
                break;
            case "OtherPage":
                if (self.isWebpartInIFrame) {
                    window.parent.location.href = self.renderPageUrl + "?idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase;
                }
                else {
                    window.location.href = self.renderPageUrl + "?idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase;
                }
                break;
            case "PopUp":

                var webpartParams = $.extend({}, params, {
                    idWorkitem: params.idWorkitem,
                    idCase: params.idCase,
                    workportal: self.workportalFacade.workportal
                });
                if (bizagi.sharepointContext) {
                    //params.sharepointProxyPrefix solo es valido en el contexto de SharePoint
                    var pathiFrame = params.sharepointProxyPrefix.substring(params.sharepointProxyPrefix.indexOf("http"), params.sharepointProxyPrefix.length);
                    webpartParams.pathiFrame = pathiFrame;
                    //webpartParams.remoteServer = remoteServer;
                    self.helper.displayWebPartPopUpinIFrame("renderComplete", webpartParams, function (e, params) { self.showCases(self.params); });
                }
                else {
                    if (typeof (self.postmessageSocket) == "undefined") {
                        var page = self.renderPageUrl + "?type=render&idCase=" + params.idCase + "&idWorkitem=" + params.idWorkitem;
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
                var url = server + "?type=render&idCase=" + params.idCase + "&idWorkitem=" + params.idWorkitem + "&adjustButtonsToContent=true&iframename=iframePopUprenderComplete";
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
    showCases: function (params) {
        var self = this;
        self.publish("ui-bizagi-show-cases", params);
        self.publish("ui-bizagi-show-processes", params);
    },
    /*
    *   View Case Summary
    */
    showSummary: function (params) {
        var self = this;
        self.helper.addWaitContainer(self.waitContainer);
        self.refresh(params);
    },
    /*
    *   View first case in load Page
    */
    loadFirstCaseWithDeferred: function (params) {
        var self = this;
        var defer = new $.Deferred();
        $.when(self.dataService.getCustomizedColumnsData({
            idWorkflow: params.idWorkflow
        })).done(function (data) {
            if (data.cases.rows.length > 0) {
                var caseNumber = data.cases.rows[0].id;
                params.idCase = caseNumber;
                $.when(self.renderContent(params)).done(function () {
                    var a = self.getContent();
                    defer.resolve(a);
                });
            }
            else {
                defer.resolve("<div class='wp-empty-data'>No cases</div>");
            }
        }).fail(function (msg) {
            self.manageError(msg, defer);
        });
        return defer.promise();
    },
    loadFirstCase: function (params) {
        var self = this;
        $.when(self.dataService.getCustomizedColumnsData({
            idWorkflow: params.idWorkflow
        })).done(function (data) {
            if (data.cases.rows.length > 0) {
                var caseNumber = data.cases.rows[0].id;
                params.idCase = caseNumber;
                self.refresh(params);
            }
        }).fail(function (msg) {
            self.manageError(msg, null);
        });
    },
    emptyCaseSummaryForm: function (params) {
        // Clear content
        this.content.empty();
    },
    resizeInPopUp: function () {
        var self = this;
        var content = self.getContent();
        var heightActivitiFormContainer = $(".activitiFormContainer").height() || 0;
        var scrollIntoView = false;
        if (bizagi.util.isSharepointContext() && typeof self.heightActivitiFormContainer !== "undefined") {
            heightActivitiFormContainer = self.heightActivitiFormContainer;
        } else {
            self.heightActivitiFormContainer = heightActivitiFormContainer;
            scrollIntoView = true;
        }
        var renderForm = $(".ui-bizagi-webpart-case-summary-workitems", content);
        renderForm.css('overflow-y', 'auto');
        
        if(bizagi.util.isSharepointContext()) {
            renderForm.height("auto");
            setTimeout(function() {
                if(renderForm.outerHeight() > heightActivitiFormContainer - 48)
                    renderForm.height(heightActivitiFormContainer - 48);
                else if (scrollIntoView)
                    document.getElementById("bz-webpart").scrollIntoView();
                
                $(".activitiFormContainer").height("auto");
            }, 0);
        } else {
            renderForm.height(heightActivitiFormContainer - 48);
        }
    },
    destroy: function () {
        var self = this;

        self.unsubscribe("ui-bizagi-show-summary-first");
        self.unsubscribe("ui-bizagi-show-summary");
    },



    loadExternalThemeStyles: function () {
        var self = this;
        bizagi.iframeCommunicator.subscribe("theme-initialize", function (e) {
            self.externalStyle = e.message;
            self.readExternalTheme(e.message);
        });
        bizagi.iframeCommunicator.trigger("awaiting-theme");

        bizagi.iframeCommunicator.subscribe("set-custom-font", function (e, params) { 
            self.addFontFromExternal(e);
        });
        bizagi.iframeCommunicator.subscribe("remove-bizagi-themes", function (e, params) { 
            self.removeBizagiThemes(e);
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
        bizagi.externalStylesApplied = true;
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
            $("input").attr('style', 'font-family:' + fontFamily + ' !important');
            $(".ui-bizagi-notifications-header").attr('style', 'font-family:' + fontFamily + ' !important');
            $("a").attr('style', 'font-family:' + fontFamily + ' !important');
            $("input.biz-wp-combo-input").css('font-family',  fontFamily + ' !important'); 
            $(".bz-button").css('font-family',  fontFamily + ' !important');
            
    
            $('<style>')
            .prop('type', 'text/css')
            .html('#bz-webpart #ui-bizagi-webpart-render-container .ui-bizagi-render textarea, #render-canvas .ui-bizagi-render input,' +
            '#bz-webpart #ui-bizagi-webpart-render-container .ui-bizagi-render input, .ui-tabs .ui-tabs-nav li a, .ui-button, .ui-bizagi-button-container .ui-bizagi-button,' + 
            'ui-bizagi-webpart-render-container .ui-bizagi-button.ui-button, #ui-bizagi-webpart-render-container .ui-button, input.biz-wp-combo-input, .bz-button-data, .bz-button'+
            '#ui-bizagi-webpart-render-container .ui-bizagi-button-container .ui-bizagi-button, #ui-bizagi-webpart-render-container .ui-button.ui-state-default, text' +
            '.ui-dialog .ui-button, .ui-bizagi-wp-app-routing-container table .ui-button, .ui-bizagi-render-search, .ui-select-data, .ui-bizagi-render-numeric, .ui-select-dropdown {font-family:' + fontFamily + ' !important;}')
            .appendTo('head');
    },

    removeBizagiThemes: function (e) { 
        $('[id="bizagi-theme"]').each(function() { 
            $(this).remove(); 
        });
        try {
            $("link[href*='jquery/overrides/css/desktop/bizagi.custom.styles.css']").prop('disabled', true);
            $("link[href*='jquery/overrides/css/desktop/bizagi.custom.styles.css']")[0].remove()
        } catch (error) {}
    },

    getFilesByFont: function(files) {
        var strFilesUrls = '';
        for (var index = 0; index < files.length; index++) {
            strFilesUrls += 'url(' + URL.createObjectURL(files[index]) + '), ';
        }
        return strFilesUrls.trim().slice(0, -1);
    }
});

