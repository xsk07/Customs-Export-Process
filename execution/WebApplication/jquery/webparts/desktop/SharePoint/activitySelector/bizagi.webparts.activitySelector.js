/**
 * Activity selector webpart, this module is called from routing service
 *
 * @author Edward J Morales
 */

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.activitySelector", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners
        this.subscribe("ui-bizagi-show-activitySelector", function (e, params) {
            self.showRoutes(params);
        });
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        var template = self.workportalFacade.getTemplate("activitySelector");
        var def = new $.Deferred();

        params = params || self.params || {};

        self.params = params;
        //check subprocess
        if (params.data.checkProcess || params.data.checkWorkItems) {
            $.when(
                    self.dataService.getCaseSubprocesses({
                        idCase: params.data.idCase
                    })
                ).done(function (process) {
                    params.data.subProcessPersonalized = process["subProcesses"];
                    // Loads case workitems
                    var content = self.content = $.tmpl(template, params.data);

                    def.resolve(content);

                });
        }
        return def.promise();
    },

    /*
    *   Customize the web part in each device
    */
    postRender: function () {
        var self = this;
        var content = self.getContent();

        var workOnITActivitySelector = $("#ui-bizagi-wp-app-routing-activity-wf tbody tr", content);
        var workOnITProcessSelector = $("#ui-bizagi-wp-app-routing-process-wf tbody tr", content);

        var onlyUserWorkItems = (self.params.data.fromSearchWidget) ? "false" : "true";
        var eventAsTasks = (self.params.data.fromSearchWidget) ? "true" : "false";

        // Assing even style
        $("tr:nth-child(even)", content).addClass("event");

        $(".workonitRow", content).button();

        $(workOnITActivitySelector).click(function () {
            self.showWorkitem({
                idCase: $(this).children(":first").children("#idCase").val(),
                idWorkitem: $(this).children(":first").children("#idWorkItem").val(),
                idTask: $(this).children(":first").children("#idTask").val(),
                onlyUserWorkItems: onlyUserWorkItems,
                eventAsTasks: eventAsTasks
            });
        });

        $(workOnITProcessSelector).click(function () {
            self.publish("ui-bizagi-show-activitySelector", {
                action: "routing",
                idCase: $(this).children(":first").children("#idCase").val(),
                onlyUserWorkItems: onlyUserWorkItems,
                eventAsTasks: eventAsTasks
            });
        });
        self.sendDimensionsiFrame(true);
        self.showTitle(self.params);

        // Notify to parent iframe
        bizagi.iframeCommunicator.trigger("activity-selector-rendered");
    },
    /*
    *   Shows the rendering widget
    */
    showWorkitem: function (params) {
        var self = this;
        // Shows render widget        
        self.publish("ui-bizagi-show-render", { idWorkitem: params.idWorkitem, idCase: params.idCase, idTask: params.idTask });
    },

    showTitle: function (params) {
        var self = this;
        var content = self.getContent();
        var currentIdCase = params.idCase || params.data.idCase;
        // Executes routing service
        $.when(self.dataService.getCaseSummary({
            idCase: currentIdCase,
            onlyUserWorkItems: true
        }))
		.done(function (data) {
		    //Add Title
		    //clear all posible headers
		    $(".ui-bizagi-webpart-header-container").empty();
		    var titleTemplate = self.workportalFacade.getTemplate("title-activity-selector");
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
		    //add only this content
		    titleMessageHtml.appendTo(".ui-bizagi-webpart-header-container", content);

		    // delete buttons
		    if ($(".ui-bizagi-button-container").length > 0) {
		        $(".ui-bizagi-button-container").remove();
		    }

		});
    },

    /**
    * Show Async widget
    */
    showAsyncWidget: function (params) {
        var self = this;

        // Shows dialog widget with async template
        self.publish("ui-bizagi-show-activitySelector", {
            widgetName: "async",
            data: data,
            modalParameters: parameters
        });
    },

    showRoutes: function (params) {
        var self = this;
        self.refresh(params);
    },
    destroy: function () {
        var self = this;
        self.unsubscribe("ui-bizagi-show-activitySelector");
    }
});
