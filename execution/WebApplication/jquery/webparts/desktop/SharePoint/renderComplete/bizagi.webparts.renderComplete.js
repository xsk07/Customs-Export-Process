/*
*   Name: BizAgi Workportal Render Complete Webpart
*   Author: Fredy Vasquez
*   Comments:
*   -   This script will define a base class to all widgets 
*   -   Include render and activity selector webPart in a single webpart
*       It's usefull webpart because this two always work together
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.renderComplete", {
    ASYNC_CHECK_TIMER: 3000
}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        //namespace
        this.namespaceInternal = "renderComplete";

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Suscribe event for activity selector
        this.subscribe(self.namespaceInternal + ".ui-bizagi-show-activitySelector", function (e, params) {
            self.showActivitySelector(params);
        });

        this.subscribe(self.namespaceInternal + ".ui-bizagi-show-render", function (e, params) {
            self.showRender(params);
        });
        this.subscribe("ui-bizagi-show-render", function (e, params) {
            //self.publish(self.namespaceInternal + ".ui-bizagi-show-render", params);
        });
        this.subscribe("ui-bizagi-show-render-new", function (e, params) {
            //Can receive events
            self.renderWebPart.isVisible = true;
            self.publish(self.namespaceInternal + ".ui-bizagi-show-render-new", params);
        });

        this.subscribe("ui-bizagi-can-change-activityform", function (e, params) {
            //It is necesary for execute event
            return self.renderWebPart.canHide();
        });

        //pageWebparts
        this.renderWebPart = null;
        this.activitySelectorWebpart = null;
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        return $.when(self.loadDependantWebparts()).pipe(function () {
            var template = self.getTemplate("renderComplete");
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
        var renderCanvas = $("#render-canvas", content);
        var activitySelectorCanvas = $("#activity-selector-canvas", content);

        self.postRenderActivitySelector($.extend(params, { canvas: activitySelectorCanvas }));
        self.postRenderRender($.extend(params, { canvas: renderCanvas }));

        self.endWaiting();
    },

    /**
    *   postRender only process canvas
    */
    postRenderRender: function (params) {
        var self = this;
        //El Render en este caso esta contenido esperando evento de los otros webparts ya configurados
        if (params.canvas[0])
            bizagi.startWaiting(params.canvas[0]);

        var webpartParams = $.extend({}, params, {
            webpart: "render",
            namespace: params.namespace ? params.namespace + "." + self.namespaceInternal : self.namespaceInternal
        });

        if (params.onlyCreateRender) {
            self.createWebpart(webpartParams).done(function (result) {
                self.renderWebPart = result.webpart;
                self.renderWebPart.endWaiting();
            });
        }
        else {
            self.executeWebpart(webpartParams).done(function (result) {
                self.renderWebPart = result.webpart;
                self.renderWebPart.endWaiting();
            });
        }
       
    },

    postRenderActivitySelector: function (params) {
        var self = this;

        var webpartParams = $.extend({}, params, {
            webpart: "activitySelector",
            namespace: params.namespace ? params.namespace + "." + self.namespaceInternal : self.namespaceInternal
        });

        self.createWebpart(webpartParams).done(function (result) {
            self.activitySelectorWebPart = result.webpart;
            self.activitySelectorWebPart.hide();
            self.activitySelectorWebPart.endWaiting();
        });

    },

    loadDependantWebparts: function () {
        var webpartWorkportal = this;
        var defer = webpartWorkportal.dependantWebparts = new $.Deferred();
        $.when(bizagi.util.initWebpart(bizagi.getWebpart("render")),
                bizagi.util.initWebpart(bizagi.getWebpart("activitySelector"))
            ).done(function () {
                // Resolve dependant webparts deferred
                defer.resolve();
            });
        return defer.promise();
    },

    showRender: function () {
        var self = this;
        if (self.renderWebPart) {
            self.activitySelectorWebPart.hide(true);
            self.renderWebPart.show();
        }
    },

    showActivitySelector: function () {
        var self = this;
        if (self.renderWebPart) {
            self.renderWebPart.hide(true);
            self.activitySelectorWebPart.show();
        }
    },
    destroy: function () {
        var self = this;
        self.renderWebPart.destroy();
        self.activitySelectorWebPart.destroy();
        self.unsubscribe(self.namespaceInternal + ".ui-bizagi-show-activitySelector");
        self.unsubscribe(self.namespaceInternal + ".ui-bizagi-show-render");
        self.unsubscribe("ui-bizagi-show-render");
        self.unsubscribe("ui-bizagi-show-render-new");
    },

    canHide: function () {
        var self = this;
        return self.renderWebPart ? self.renderWebPart.canHide() : true;
    }
});
