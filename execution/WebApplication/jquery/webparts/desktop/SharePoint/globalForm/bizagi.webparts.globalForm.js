
/*
*   Name: BizAgi Workportal GlobalForm Webpart
*   Author: Carlos I Mercado
*   Comments:
*   -   This file is meant to be the base to render the GlobalForm webpart of a process
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.globalForm", {
    ASYNC_CHECK_TIMER: 3000
}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        //waitContainer
        this.waitContainer = initialParams.waitContainer;
        this.previousLoadRender = false;
        this.adjustButtonsToContent = initialParams.adjustButtonsToContent;
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var content = "";
        var self = this;
        if (typeof (self.params.idCase) == "undefined") {
            content = ("<div class='wp-empty-data'>No idCase</div>");
        } else {
            //gets the webpart template
            var template = self.workportalFacade.getTemplate("globalForm");
            content = self.content = $.tmpl(template);
        }
        //and returns the html content
        return content;
    },

    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {
        var self = this;
        params.context = "sharepoint";
        params.sharepointProxyPrefix = self.sharepointProxyPrefix;

        if (params.idWorkitem) {
            self.renderingExecute(params);
        }
        else {
            self.params = params;
            self.performRouting();
        }
        self.endWaiting();
    },

    /*
    *   Listener to ui-bizagi-show-render event
    */
    renderForm: function (params) {
        //Creates a new case based on the selected process        
        var self = this;
        self.helper.addWaitContainer(self.waitContainer);
        self.params = params;
        self.refresh(self.params);
    },



    emptyRenderForm: function () {
        // Clear content
        this.content.empty();
    },

    performRouting: function () {
        var self = this;
        var params = self.params;
        params.fromWorkItemId = self.params.idWorkitem;

        $.when(self.dataService.routing.getRoute(params)).done(function (route) {
            route = route || {};
            route.moduleParams = route.moduleParams || {};
            if (route.moduleParams.messageForm) {
                self.showFinishMessage(route.moduleParams.messageForm);
            }
            else {
                if (route.moduleParams.withOutGlobalForm) {
                    //sets the title of the process
                    self.showTitle(params);
                    //Render Finish Message
                    self.showFinishMessage(self.resources.getResource("render-without-globalform"));
                }
                else {
                    //Render global form
                    params.idWorkitem = null;
                    params.data = null;
                    params.action = 'LOADFORM';
                    params.idCase = route.moduleParams.idCase;
                    self.renderingExecute(params);
                }
            }
        });
    },
    renderingExecute: function (params) {
        var self = this;
        self.previousLoadRender = true;
        self.showTitleReady = false;

        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-global-form-container", content);

        //sets the loading animation
        var loading = self.workportalFacade.getTemplate("loading-render");
        $.tmpl(loading).appendTo(canvas);

        //executes the rendering
        var rendering = self.rendering = new bizagi.rendering.facade(params);
        rendering.execute($.extend(params, {
            canvas: canvas
        })).done(function (form) {
            //indicates the global form is not set and the process is not finished yet
            if (form.children && form.children.length === 0) {
                //Render Finish Message
                self.showFinishMessage(self.resources.getResource("render-without-globalform"));
            }
            self.showTitle(params);
        });

        $(window).resize(function () {
            self.rendering.resize({
                forceResize: true
            });
        });
        // Attach handler to render container to subscribe for routing events
        if (canvas) {
            canvas.bind("routing", function () {
                self.performRouting(params);
            });
        }
    },

    showFinishMessage: function (message) {
        var self = this;
        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-global-form-container", content);
        //Add finish message when case is finish
        var errorTemplate = self.workportalFacade.getTemplate("info-render");
        var endMessageHtml = $.tmpl(errorTemplate, {
            message: message
        });
        // Load end Message   
        canvas.empty();
        endMessageHtml.appendTo(canvas);
    },

    showTitle: function (params) {
        var self = this;
        var content = self.getContent();

        // Call case summary service for header case
        $.when(self.dataService.getCaseSummary({
            idCase: params.idCase,
            onlyUserWorkItems: true
        }))
		.done(function (data) {
		    //Add Title

		    var titleTemplate = self.workportalFacade.getTemplate("title-render");
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
		    //$(".ui-bizagi-webpart-header-container", content).html(titleMessageHtml);
		    $(".ui-bizagi-webpart-header-container", content).empty();
		    titleMessageHtml.appendTo(".ui-bizagi-webpart-header-container", content);

		    self.resizeInPopUp(titleMessageHtml, params);

		    //Filtro de veces de ejecucion
		    self.showTitleReady = true;

		});
    },

    resizeInPopUp: function (titleMessageHtml, params) {
        var self = this;
        if (self.adjustButtonsToContent && (self.adjustButtonsToContent == "true" || self.adjustButtonsToContent == true)) {
            if (self.isWebpartInIFrame) {
                self.resizeInPopUpinIFrame(titleMessageHtml, params);

                $(window).resize(function () {
                    self.resizeInPopUpinIFrame(titleMessageHtml, params);
                });
            }
            else {
                self.resizeInPopUpHTML(titleMessageHtml, params);

                $(window).resize(function () {
                    self.resizeInPopUpHTML(titleMessageHtml, params);
                });
            }
        }
    },

    resizeInPopUpHTML: function (titleMessageHtml, params) {
        var self = this;
        var heightHeader = titleMessageHtml.height() || 0;
        if ($(".activitiFormContainer").length > 0) {
            var heightActivitiFormContainer = $(".activitiFormContainer").height() || 0;
            var renderForm = $("#ui-bizagi-webpart-render-container", self.getContent());
            if (params.idWorkitem) {
                //display buttons
                var buttonContainer = $(".ui-bizagi-button-container", self.getContent());
                var heightButtonContainer = buttonContainer.height() || 0;
                buttonContainer.appendTo(renderForm.parent());
                buttonContainer.addClass("ui-bizagi-button-container-popup");
                renderForm.height(heightActivitiFormContainer - heightHeader - 38 - heightButtonContainer);
            }
            else {
                //NOT display buttons
                renderForm.height(heightActivitiFormContainer - heightHeader - 48);
            }

            renderForm.css('overflow-y', 'auto');
            renderForm.css('overflow-x', 'hidden');
        }
    },

    resizeInPopUpinIFrame: function (titleMessageHtml, params) {
        var self = this;
        var renderForm = $('body');
        if (params.idWorkitem) {
            var buttonContainer = $(".ui-bizagi-button-container", self.getContent());
            buttonContainer.appendTo(renderForm);
            buttonContainer.addClass("ui-bizagi-button-container-popup");

            buttonContainer.css({ 'position': 'fixed', 'bottom': '0px' });

            var heightButtonContainer = buttonContainer.height() || 0;
            heightButtonContainer = heightButtonContainer * 2;
            renderForm.css({ 'padding-bottom': heightButtonContainer + 'px' });
            renderForm.css({ 'height': '100%' });
        }
    },

    prepareForRefresh: function () {
        var self = this;
        var content = self.getContent();
        var canvas = $("#ui-bizagi-webpart-render-container", content);
        canvas.off();
        $(window).unbind("resize");

        // Dispose current rendering instance
        if (this.rendering) {
            this.rendering.dispose();
            delete this.rendering;
        }
    }

});
