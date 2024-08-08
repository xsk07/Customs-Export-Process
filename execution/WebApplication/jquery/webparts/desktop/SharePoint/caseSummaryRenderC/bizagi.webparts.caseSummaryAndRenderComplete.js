
/*
*   Name: BizAgi Workportal Case Summary And render Complete Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets 
*   -   Include casesummary and render Complete webPart in a single webpart
*       It's usefull for popUp 
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.caseSummaryAndRenderComplete", {
    ASYNC_CHECK_TIMER: 3000
}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        //pageWebparts
        this.renderCompleteWebPart = null;
        this.caseSummaryWebpart = null;

        //namespace
        this.namespaceInternal = "caseSummaryAndRenderComplete";

        this.subscribe(this.namespaceInternal + ".ui-bizagi-case-summary-workonit", function (e, params) {
            self.caseSummaryWorkOnIt(params);
        });
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        return $.when(self.loadDependantWebparts()).pipe(function () {
            var template = self.getTemplate("caseSummaryAndRenderComplete");
            var content = self.content = $.tmpl(template);
            return content;
        });
    },

    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {

        var self = this;
        var content = self.getContent();

        // Define Canvas
        var caseSummaryCanvas = $("#case-summary-canvas", content);
        var renderCompleteCanvas = $("#render-complete-canvas", content);

        var webpartParams = $.extend({}, params, { webpart: "caseSummary", renderBehavior: "OtherWebPartThisPage", namespace: params.namespace ? params.namespace + "." + self.namespaceInternal : self.namespaceInternal });

        self.postRenderCaseSummary($.extend(webpartParams, { canvas: caseSummaryCanvas }));
        self.postRenderRenderComplete($.extend(webpartParams, { canvas: renderCompleteCanvas}));

        self.endWaiting();
    },

    /**
    *   postRender only process canvas
    */
    postRenderCaseSummary: function (params) {
        var self = this;
        if (params.canvas[0])
            bizagi.startWaiting(params.canvas[0]);

        var webpartParams = $.extend({}, params, { webpart: "caseSummary", renderBehavior: "OtherWebPartThisPage" });

        self.executeWebpart(webpartParams).done(function (result) {
            self.caseSummaryWebpart = result.webpart;
            self.caseSummaryWebpart.displayRender = function (params) {
                var self = this;
                self.publish("ui-bizagi-show-render", { idWorkitem: params.idWorkitem, idCase: params.idCase });
            };
            self.caseSummaryWebpart.endWaiting();
        });
    },

    postRenderRenderComplete: function (params) {
        var self = this;

        var webpartParams = $.extend({}, params, { webpart: "renderComplete", adjustButtonsToContent: true, onlyCreateRender: true, isWebpartInIFrame:false });

        self.executeWebpart(webpartParams).done(function (result) {
            self.renderCompleteWebPart = result.webpart;
            self.renderCompleteWebPart.hide();
            self.renderCompleteWebPart.endWaiting();
        });
    },

    loadDependantWebparts: function () {
        var webpartWorkportal = this;
        var defer = webpartWorkportal.dependantWebparts = new $.Deferred();
        $.when(bizagi.util.initWebpart(bizagi.getWebpart("caseSummary")),
                bizagi.util.initWebpart(bizagi.getWebpart("renderComplete"))
            ).done(function () {
                // Resolve dependant webparts deferred
                defer.resolve();
            });
        return defer.promise();
    },

    caseSummaryWorkOnIt: function () {
        var self = this;
        self.caseSummaryWebpart.hide();
        self.renderCompleteWebPart.show();
    },
    destroy: function () {
        var self = this;
        self.caseSummaryWebpart.destroy();
        self.renderCompleteWebPart.destroy();
        self.unsubscribe(this.namespaceInternal + ".ui-bizagi-case-summary-workonit");
    },

    canHide: function () {
        var self = this;
        return self.renderCompleteWebPart.canHide();
    }
});
