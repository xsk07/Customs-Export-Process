/*
*   Name: BizAgi Workportal WorkItem Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*   -   This webpart display workitem information
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.workitemSummary", {}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;
        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners
        this.subscribe("ui-bizagi-show-summary", function (e, params) { self.showSummary(params); });

        this.subscribe("ui-bizagi-show-render", function (e, params) { self.showSummary(params); });

        this.subscribe("ui-bizagi-show-activitySelector", function (e, params) { self.showSummary(params); });

        //waitContainer
        this.waitContainer = initialParams.waitContainer;

        //renderBehavior
        this.renderBehavior = initialParams.renderBehavior;
        //renderPageUrl
        this.renderPageUrl = initialParams.renderPageUrl;
        this.adjustButtonsToContent = initialParams.adjustButtonsToContent;
        this.graphicQueryBehavior = initialParams.graphicQueryBehavior;
        this.taskOptionsWidget = new bizagi.workportal.widgets.task.options(workportalFacade, dataService, initialParams);
        bizagi.iframeCommunicator.subscribe("form-rendered", this.taskOptionsWidget.renderEnds.bind(this.taskOptionsWidget));
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;

        var defer = new $.Deferred();
        if (params.idCase) {
            $.when(self.dataService.summaryCaseDetails({
                idCase: params.idCase,
                idWorkitem: params.idWorkitem
            }), self.taskOptionsWidget.getTaskOptions(params.idCase, params.idWorkitem)).done(function (data, dataTaskOptions) {
                data.idWorkflow = data.idWorkFlow;
                params.data = data;
                data.params = params;
                data.showRelease=dataTaskOptions.showRelease;
                var template = self.getTemplate("workitemSummary");
                var content = self.content = $.tmpl(template, data);
                self.renderTaskDescription(content, data);

                // Format invariant dates
                bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

                defer.resolve(content);

            }).fail(function (msg) {
                self.manageError(msg, defer);
            });
        }
        else {
            defer.reject("<div>whit out params</div>")
        }
        return defer.promise();
    },
    /*
    *   Customize the web part postRender
    */
    postRender: function (params) {
        var self = this;
        var content = self.getContent();

        var subprocessCanvas = $("#subprocess", content);
        var assigneesCanvas = $("#assignees", content);
        var eventsCanvas = $("#events", content);
        var activitiesCanvas = $("#activities", content);

        if (params.data) {
            if (params.data.showSubProcess) { self.postRenderSubprocess($.extend(params, { canvas: subprocessCanvas })); }
            if (params.data.showAssignees) { self.postRenderAssignees($.extend(params, { canvas: assigneesCanvas })); }
            if (params.data.showEvents) { self.postRenderEvents($.extend(params, { canvas: eventsCanvas })); }
            if (params.data.showActivities) { self.postRenderActivities($.extend(params, { canvas: activitiesCanvas })); }
        }

        $(".workonitRow", content).click(function (e) {
            e.stopPropagation();
            var buttom = $(this);

            var idWorkItem = buttom.data("idworkitem");
            var idcase = buttom.parent().parent().parent().data("idcase");
            params.idWorkitem = idWorkItem;
            params.idCase = idcase;
            self.displayRender(params);
        });

        $(".parentProcessSummaryLink", content).click(function () {

            var parentProcesesData = $(this);
            params.idCase = parentProcesesData.data("idcase");
            params.idWorkitem = null;
            self.displayRender(params);
        });

        $(".ui-bizagi-webpart-case-summary-details-tabs", content).tabs();

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
            var idWorkflow = $(this).data("idworkflow") || 0;
            switch (self.graphicQueryBehavior) {
                case "PopUp":
                    var webpartParams = $.extend({}, {
                        idWorkflow: idWorkflow,
                        idCase: idCase,
                        fullScreen: true
                    }, {workportal: self.workportalFacade.workportal, isWebpartInIFrame: false});
                    self.helper.displayWebPartPopUp("graphicquery", webpartParams);
                    break;
                case"OtherPage":
                    var baseUrl = "webpart.htm?type=graphicquery";
                    var url = baseUrl + "&idCase=" + idCase + "&idWorkflow=" + idWorkflow;
                    window.open(url);
                    break;
            }
            return false;
        });

        $("#bt-case-action-release", content).click(function (e) {
            e.stopPropagation();
            var releaseConfirmTemplate = self.getTemplate("release");
            var confirmContent = $.tmpl(releaseConfirmTemplate);

            // Open dialog with confirm message
            $(confirmContent).dialog({
                resizable: false,
                modal: true,
                title: self.getResource("render-actions-release"),
                buttons: [
                    {
                        text: self.getResource("workportal-widget-dialog-box-release-ok"),
                        click: function () {
                            var paramsRelease = {
                                idCase: params.idCase,
                                idWorkItem: params.idWorkitem
                            };
                            $.when(self.dataService.releaseActivity(paramsRelease)).done(function (data) {
                                var status = data.status ? data.status : '';
                                switch (status) {
                                    case "Success":
                                        //go to inbox
                                        self.showListCases();
                                        break;

                                    case "ConfigurationError":
                                        var message = self.getResource("workportal-widget-dialog-box-release-configuration-error-message").replace("{0}", params.idWorkItem);
                                        bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                                        break;

                                    default:
                                        var message = self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", params.idWorkItem);
                                        bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                                        break;
                                }
                            }).fail(function () {
                                    var message = self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", params.idWorkItem);
                                    bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                                }
                            );
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: self.getResource("workportal-widget-dialog-box-release-cancel"),
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        });

        self.endWaiting();
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
            var template = self.getTemplate("wisubprocess");
            htmlContent = $.tmpl(template, data);
            $(".subProcessSummaryLink", htmlContent).click(function () {
                var subProcesesData = $(this);
                params.idCase = subProcesesData.data("idcase");
                params.idWorkitem = null;
                self.displayRender(params);
            });

            htmlContent.appendTo(localCanvas, content);
        });
    },

    /**
     * render the task descriptions of the data that exists in to the container
     * @param {Jquery Element} content container
     * @param {Json} data of the case
     */
    renderTaskDescription: function (content, data) {
        var self = this;
        var width = 120;
        var taskDescriptionParams = {
            classNeedsModal: "task_description_needs_modal",
            fromWebpart: true,
            width: width,
            template: self.getTemplate("task-description")
        };
        (new bizagi.workportal.widgets.task.description(self.workportalFacade, self.dataService, taskDescriptionParams)).renderManyTasksDescription(data.currentState, content);
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
            var template = self.getTemplate("wiassignees");
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
            var template = self.getTemplate("wievents");
            htmlContent = $.tmpl(template, data);
            htmlContent.appendTo(localCanvas, content);

            $(".eventSummaryLink", htmlContent).click(function () {
                var eventData = $(this);
                params.idCase = eventData.data("idcase");
                params.idWorkitem = eventData.data("idworkitem");
                params.idTask = eventData.data("idtask");
                params.eventAsTasks = eventData.data("eventastasks");
                self.displayRender(params);
            });

        });
    },
    /**
    *   postRender Activities
    */
    postRenderActivities: function (params) {
        var self = this;
        var content = self.getContent();
        var htmlContent = "";
        var localCanvas = params.canvas;

        $.when(self.dataService.summaryActivities({
            data: params.data,
            idWorkitem: params.idWorkitem
        }))
        .done(function (data) {
            var template = self.getTemplate("wiactivities");
            htmlContent = $.tmpl(template, data);
            htmlContent.appendTo(localCanvas, content);
            
            self.renderTaskDescription(htmlContent, data);
            $(".activitiesSummaryLink", htmlContent).click(function () {
                var activityData = $(this);
                var webpartParams = $.extend({}, params, { idCase: params.idCase });
                webpartParams.idWorkitem = activityData.data("idworkitem");
                self.displayRender(webpartParams);
            });
        });
    },

    displayRender: function (params) {
        //Define Render Behavior
        var self = this;
        switch (self.renderBehavior) {
            case "OtherWebPartThisPage":
                self.helper.publishShowRenderEvent("ui-bizagi-show-render", self, { idWorkitem: params.idWorkitem, idCase: params.idCase });
                break;
            case "OtherPage":
                window.location.href = self.renderPageUrl + "?idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase;
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
                } else {
                    self.helper.displayWebPartPopUp("renderComplete", webpartParams, function (e, params) { self.showCases(self.params); });
                }
                break;
        }
    },
    showCases: function (params) {
        var self = this;
        self.publish("ui-bizagi-show-cases", params);
        self.publish("ui-bizagi-show-processes", params);
       //self.publish("ui-bizagi-cases-list", params);
    },

    showListCases: function () {
        var self = this;
        self.publish("ui-bizagi-cases-list");
    },
    /*
    *   View Case Summary
    */
    showSummary: function (params) {
        var self = this;
        self.helper.addWaitContainer(self.waitContainer);
        self.refresh(params);
    },

    emptyCaseSummaryForm: function (params) {
        // Clear content
        this.content.empty();
    },
    resizeInPopUp: function () {
        var self = this;
        var content = self.getContent();
        var heightActivitiFormContainer = $(".activitiFormContainer").height() || 0;
        var renderForm = $(".ui-bizagi-webpart-case-summary-workitems", content);
        renderForm.css('overflow-y', 'auto');
        renderForm.height(heightActivitiFormContainer - 48);
    },
    destroy: function () {
        var self = this;
        self.unsubscribe("ui-bizagi-show-summary");
    }
});

