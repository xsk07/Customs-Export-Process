bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.anonymous", {}, {


    /*
    *   Creates a new case for the given workflow class
    */
    createNewCase: function (idWfClass) {
        var self = this;

        return self.dataService.createNewCase({
            idWfClass: idWfClass
        });
    },

    /*
    *   Renders the next pending activity for the new case
    */
    renderForm: function (params) {
        var self = this;
        var content = self.getContent();
        params.context = "sharepoint";
        params.sharepointProxyPrefix = self.sharepointProxyPrefix;

        //Hide all controls
        self.clearScreen();

        // Render form 
        var rendering = new bizagi.rendering.facade(params);
        var renderingContainer = $(".ui-bizagi-webpart-anonymous-render", content);
        renderingContainer.show();

        renderingContainer.height($(window).height() - 50);
        $(window).resize(function () {
            renderingContainer.height($(window).height() - 50);
        })

        // Executes rendering into render container
        rendering.execute($.extend(params, {
            canvas: renderingContainer
        }));

        $(window).resize(function () {
            rendering.resize({
                forceResize: true
            });
        });


        // Attach handler to render container to subscribe for routing events
        renderingContainer.unbind("routing");
        renderingContainer.bind("routing", function () {

            // Executes routing service
            $.when(self.dataService.getWorkitems({
                idCase: params.idCase,
                onlyUserWorkItems: true
            }))
            .done(function (data) {
                if (data.workItems.length == 1) {
                    self.renderForm({ idWorkitem: data.workItems[0].idWorkItem, idCase: params.idCase });
                }
                else {
                    //No more pending activities for the current user. 
                    self.clearScreen();

                    //Allow create a new case again
                    $(".ui-bizagi-webpart-anonymous-finishmessage", content).show();
                    $(".ui-bizagi-webpart-anonymous-createbutton", content).show();
                }
            });
        });
    },


    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        var template = self.workportalFacade.getTemplate("anonymous");

        return $.tmpl(template,
            {
                buttonCaption: params.buttonCaption,
                createMessage: params.createMessage,
                finishMessage: params.finishMessage
            });
    },

    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {
        var self = this;
        var content = self.getContent();

        //Apply button plugin
        var oNewCaseButton = $("input[type='button']", content);
        oNewCaseButton.button();

        //Hide all controls
        self.clearScreen();

        //Allow create a new case 
        $(".ui-bizagi-webpart-anonymous-createmessage", content).show();
        $(".ui-bizagi-webpart-anonymous-createbutton", content).show();

        //Bind click to create a new case
        oNewCaseButton.click(function () {
            oNewCaseButton.button("disable");
            $.when(

                self.createNewCase(params.idWfClass)

			).done(function (data) {

			    self.renderForm({ "idCase": data.idCase, "idWorkitem": data.workItems[0].idWorkItem });
			    oNewCaseButton.button("enable");

			}).fail(function (context, args) {

			    self.clearScreen();

			    $(".ui-bizagi-webpart-anonymous-failmessage", content).html("Cannot create a case for process with ID = <" + params.idWfClass + ">. Please refresh the page and try again...<br>" + context.responseText);
			    $(".ui-bizagi-webpart-anonymous-failmessage", content).show();
			});
        });
    },

    clearScreen: function () {
        var self = this;
        var content = self.getContent();
        $("div", content).each(function () { $(this).hide(); });
    }

});
