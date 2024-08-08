/*
*   Name: BizAgi Workportal HelloWorld Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*   -   This webpart comes from adidas and has not been eliminated
*/
bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.helloWorld", {}, {



    /*
    *   Creates a new case based on the selected process
    */
    createNewCase: function (idWfClass) {
        var self = this;
        var def = new $.Deferred();
        // Creates a new case
        $.when(self.dataService.createNewCase({
            idWfClass: idWfClass
        })).done(function (data) {
            def.resolve(data);
            // Then we call the routing action
            /* self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: data.idCase
            });*/

            // Publish the event so any other webpart could react to that
            self.publish("ui-bizagi-process-newcase", { "idCase": data.idCase, "data": data });
            //console.log("The case has been created");
        }).fail(function (msg) {
            self.manageError(msg, defer);  
        });
        return def.promise();
    },


    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        var template = self.workportalFacade.getTemplate("helloWorld");

        return $.tmpl(template, { idWorkflow: params.idWorkflow });
    },

    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {
        var self = this;
        var content = self.getContent();
        //var def = new $.Deferred();

        $("#btnNewCase", content).click(function () {
            $.when(
                    self.createNewCase(params.idWorkflow)
                    ).done(function (data) {
                        //console.log("the case has been created");
                        if (data.workItems && data.workItems.length > 0) {
                            $("#idCase").val(data.idCase);
                            $("#idWorkitem").val(data.workItems[0].idWorkItem);

                            //it's not possible to send forms other than SP forms
                            $("<form id='frmCreateCAF' action='RenderCAF.aspx' method='post'><div id='innerDiv'/></form>").appendTo('body');
                            $("#innerDiv").html($("#CreateCAFContents").html());

                            //Send the request as post
                            //$("#frmCreateCAF").submit();

                            //Post is not working, just make a redirection using the querystring
                            window.location = "/CAF/Pages/Render.aspx?idCase=" + data.idCase + "&idWorkitem=" + data.workItems[0].idWorkItem;
                        }
                    }); 

        });
    }
});
