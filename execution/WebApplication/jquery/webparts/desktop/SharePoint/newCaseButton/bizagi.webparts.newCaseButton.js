/*
*   Name: BizAgi Workportal new case button Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*   -   This webpart display a single button for create cases
*/
bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.newCaseButton", {}, {

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        self.onWaiting();
        //No workFlow Asigned
        if (!params.idWfClass) {
            return self.viewEmptyErrorMsg();
        }

        var defer = new $.Deferred();

        $.when(self.dataService.isCaseCreationAuthorized({ idWfClass: params.idWfClass })
        ).pipe(function (data) {
            if (data.authorized) {

                var template = self.workportalFacade.getTemplate("newCaseButton");
                defer.resolve($.tmpl(template, { idWorkflow: params.idWfClass, buttonName: params.buttonName }));
            }
            else {
                params.canvas.parent().css('visibility', 'hidden');
                defer.resolve(null);
            }
        }).fail(function (msg) {
            params.canvas.parent().css('visibility', 'hidden');
            /* Para este caso es posible que este usuario de intranet no este en BizagiBPM por lo mismo no debería mostrarse*/
            /* Para todos los casos se oculta el canvas*/
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
        var deferError = new $.Deferred();

        $("#btnNewCase", content).click(function () {

            //Define Render Behavior
            switch (params.renderBehavior) {
                case "OtherWebPartThisPage":
                    //Trigger event to SharePoint Render WebPart                    
                    self.helper.publishShowRenderEvent("ui-bizagi-show-render-new", self, { "idWfClass": params.idWfClass });
                    break;
                case "OtherPage":
                    window.open(params.renderPageUrl + "?type=activityForm&idWfClass=" + params.idWfClass);
                    break;
                case "PopUp":
                    var webpartParams = $.extend({}, params, { idWfClass: params.idWfClass,
                        idWorkflow: null,
                        idWorkitem: null,
                        idCase: null,
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
        });
        self.endWaiting();
    },

    showCases: function (params) {
        var self = this;
        self.publish("ui-bizagi-show-cases", params);
        self.publish("ui-bizagi-show-processes", params);
    },

    viewEmptyErrorMsg: function (params) {
        var self = this;
        var defer = new $.Deferred();
        var msg = 'Not assigned any process Id';
        self.manageError(msg, defer);
        return defer.promise();
    }
});
