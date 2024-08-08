
/*
*   Name: BizAgi Workportal Processes Webpart
*   Author: Edward Morales
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.webparts.processes.extend("bizagi.workportal.webparts.processes", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        //waitContainer
        this.waitContainer = initialParams.waitContainer;

        // Set listeners
        this.subscribe("ui-bizagi-show-render-new", function (e, params) {
            self.refresh(params);
        });
        this.subscribe("ui-bizagi-show-processes", function (e, params) {
            self.refresh(params);
        });
    },


    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        var defer = new $.Deferred();
        var template = self.getTemplate("processes");

        // Get data
        $.when(self.dataService.getAllProcesses({
            taskState: params.taskState || "all",
            onlyFavorites: params.onlyFavorites,
            smartfoldersParameters: params.smartfoldersParameters
        }))
        .done(function (data) {
            // Render content
            var content = self.content = $.tmpl(template, data);
            defer.resolve(content);
        }).fail(function (msg) {
            self.manageError(msg, defer);
        });
        return defer.promise();
    },

    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {
        var self = this;
        var content = self.getContent();

        $(".ui-bizagi-wp-app-inbox-processes-title", content).click(function () {
            $(this, content).next().toggle();
            $(this, content).children(".arrow").toggleClass("Right");
            //$(".ui-bizagi-wp-app-inbox-processes-title", content).next().hide();
        });
        // Bind processes click
        $(".ui-bizagi-wp-app-inbox-processes-ul li", content).click(function () {
            self.onWaiting();
            $(".ui-bizagi-wp-app-inbox-processes-ul li", content).removeClass("active");
            $(this).addClass("active");

            var idWorkflow = $(this).attr("data-workflow-id");
            var processName = $(this).attr("data-process-name");

            // Publish the event so any other webpart could react to that
            params.idWorkflow = idWorkflow;
            params.processName = processName;
            self.publish("ui-bizagi-show-cases", params);
            self.publish("ui-bizagi-show-summary-first", params);
            self.endWaiting();
        });

        // Get data Inbox Summary, allways reload in each refresh
        var templateInboxSummary = self.getTemplate("processesSummary");
        $.when(self.dataService.getInboxSummary()).done(function (data) {
            // Render content
            var contentInboxSummary = $.tmpl(templateInboxSummary, data);
            //contentInboxSummary.appendTo(content);
            $(".ui-bizagi-processes-tab", content).append(contentInboxSummary);

            self.postRenderSummary(data, params);
        });

        self.endWaiting();
    },


    /*
    *   Updates inbox summary
    */
    postRenderSummary: function (summary, params) {
        var self = this;
        var content = self.getContent();

        // Update values
        $(".ui-bizagi-wp-app-inbox-tab#all", content).data("taskState", "all");
        $(".ui-bizagi-wp-app-inbox-tab#red", content).data("taskState", "Red");
        $(".ui-bizagi-wp-app-inbox-tab#green", content).data("taskState", "Green");
        $(".ui-bizagi-wp-app-inbox-tab#yellow", content).data("taskState", "Yellow");
        $(".ui-bizagi-wp-app-inbox-tab#favourites", content).data("taskState", "Favorites");

        if (params.taskState) {
            $(".ui-bizagi-wp-app-inbox-tab", content).removeClass("active");
            //The rest service need that taskState must be all then this code is necesary
            if (params.onlyFavorites == true) {
                $(".ui-bizagi-wp-app-inbox-tab#favourites", content).addClass("active");
            }
            else {
                $(".ui-bizagi-wp-app-inbox-tab", content).each(function (liItem) {
                    var dataTaskState = $(this).data("taskState");
                    if (params.taskState == dataTaskState) {
                        $(this).addClass("active");
                    }
                });
            }
        }

        //click over All,Red,Green,Yellow,Favorites
        $(".ui-bizagi-wp-app-inbox-tab", content).click(function () {
            params.taskState = $(this).data("taskState");
            params.idWorkflow = null;
            self.changeTaskState(params);
        });
    },

    changeTaskState: function (params) {
        var self = this;

        if (params.taskState == "Favorites") {
            params.taskState = "all";
            params.onlyFavorites = true;
        }else {
            params.onlyFavorites = "";
        }

        params.smartfoldersParameters = "";
        //Publish event to other webParts
        self.publish("ui-bizagi-show-cases", params);
        //refrescar WebPart
        self.refresh(params);
    }
});
