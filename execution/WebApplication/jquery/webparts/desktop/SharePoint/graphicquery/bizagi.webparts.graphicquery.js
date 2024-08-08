
/*
*   Name: BizAgi Workportal CaseSummary Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.graphicquery", {}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        this.subprocesses = [];
        this.currentTasks = [];
        this.path = [];
        this.callStack = [];
        this.currentWorkflow = {
            idCase: initialParams.idCase,
            idWorkflow: initialParams.idWorkflow
        };

        // Call base
        this._super(workportalFacade, dataService, initialParams);
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;

        var template = self.getTemplate("graphicquery");
        var content = self.content = $.tmpl(template);
        return content;
    },

    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {

        var self = this;
        //get Containers

        if (!!!parseInt(params.idWorkflow)) {
            $.when(self.dataService.getCustomizedColumnsData({
                radNumber: params.caseNumber || params.idCase
            })).done(function (data) {
                if (typeof (data.cases.rows[0]) == "undefined") {
                    alert("Invalid idWorkflow");
                } else {
                    params.idWorkflow = data.cases.rows[0].idWorkFlow;
                    self.loadGraphicComponents(params);
                }
            });
        } else {
            self.loadGraphicComponents(params);
        }
    },

    loadGraphicComponents: function (params) {
        var self = this;
        self.headerContainer = $(".bz-gq-header", self.content);
        self.actionBarContainer = $("#bz-gq-actionbar-container", self.headerContainer);
        self.pvCanvasContainer = $("#bz-gq-processviewer-canvas", self.content);
        self.summaryContainer = $("#bz-gq-summary-container", self.headerContainer);
        if(bizagi.util.isSharepointContext()) {
            $(".activitiFormContainer").css("max-height", "910px");
            document.getElementById("bz-webpart").scrollIntoView();
        }
        //render process viewer
        self.instanceBizagiGraphicQuery = new bizagi.graphicquery(this);

        self.renderProcessViewer(params);

        self.eventsHandler();

        self.endWaiting();
    },

    /**
    * Render case workflow
    */
    renderProcessViewer: function () {
        var self = this;
        return self.instanceBizagiGraphicQuery.renderProcessViewer();
    },

    /*
    * Events Handler
    */
    eventsHandler: function () {
        var self = this;
        return self.instanceBizagiGraphicQuery.eventsHandler();
    }

});

