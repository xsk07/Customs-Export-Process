/* The url to test this webpart is:    
    * To query form:
        http://localhost/11.2.4/jquery/webparts/desktop/portal/pages/webpart.htm?type=queryform&queryType={QUERY_TYPE}&guidForm={GUID_FORM}&guidEntity={GUID_ENTITY}
    * To edit query form
        http://localhost/11.2.4/jquery/webparts/desktop/portal/pages/webpart.htm?type=queryform&guidEntity={GUID_ENTITY}&guidForm={GUID_FORM}&queryFormType={QUERY_FORM_TYPE}&idQueryForm={ID_QUERY_FORM}

    Where: 
    queryType = 1 -> Process queries, queryType = 2 -> Entity queries, guidForm = form guid, guidEntity = entity guid, queryFormType = CASES | ENTITIES, idQueryForm = selected query form id.
*/
bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.queryform", {
    ASYNC_CHECK_TIMER: 3000
}, {

    init: function (workportalFacade, dataService, initialParams) {
        // Call base
        this._super(workportalFacade, dataService, initialParams);
    },
    renderContent: function () {
        var self = this;
        return $.when(self.loadDependantWebparts()).pipe(function () {
            var template = self.getTemplate("queryForm");
            var content = self.content = $.tmpl(template);
            return content;
        });
    },
    postRender: function (params) {
        var self = this;
        var content = self.getContent();

        self.initializeParameters(params);

        // Define Canvas
        var renderCanvas = $("#render-canvas", content);
        self.postRenderRender($.extend(params, { canvas: renderCanvas }));

        // Iframe communication
        // var externalThemeCssUrl = "jquery/webparts/desktop/SharePoint/render/bizagi.webpart.render.externaltheme.less";

        self.bizagiIframeCommunicator = new bizagi.webpart.services.iframeCommunicator(self);

        // The styles are not applied because the styles bizagi.webpart.render.externaltheme.less are loaded in the render webpart (\jquery\webparts\desktop\SharePoint\render\bizagi.webparts.render.js).
        // Note: If a different style sheet is needed, put in true the second variable of addCommListeners and send the externalThemeCssUrl.
        self.bizagiIframeCommunicator.addCommListeners(self.iframeCommunicationListenersList(), false, ''); //(listeners list, apply external styles, styles url)

        self.endWaiting();
    },
    initializeParameters: function(params){
        var self = this;
        self.atLeastOneChecked = false;
        self.includeAllUsers = false;

        self.queryFormTypes = {
            CASES: "CASES",
            ENTITY: "ENTITIES"
        };

        self.queryFormContextTypes = {
            CASES: "metadata",
            ENTITY: "entity"
        };

        self.guidForm = params.guidForm;
        self.guidEntity = params.guidEntity;

        // When there is an idQueryForm and a queryFormType it means it is a edit query form
        if(params.idQueryForm && params.queryFormType){
            self.queryFormType = params.queryFormType;
            self.idQueryForm = params.idQueryForm;
            self.includeAllUsers = params.includeAllUsers;
        } else {
            if(params.queryType === "1"){
                self.queryFormType = self.queryFormTypes.CASES;
            } else if (params.queryType === "2") {
                self.queryFormType = self.queryFormTypes.ENTITY;
            }
        }
    },
    iframeCommunicationListenersList: function(){
        var self = this;
        var iframeCommunicationListeners = {
            "get-query-form-params": {
                // Get the parameters to search, edit and copy the query
                then: self.validateAndGetQueryFormParams
            },
            "clear-query-form": {
                then: self.clearQueryForm
            },
            "check-pending-changes": {
                then: self.detectChanges
            },
            "set-values": {
                then: self.setValues
            },
            "load-query-form": {
                then: self.loadQueryForm
            }
        };

        return iframeCommunicationListeners;
    },
    loadDependantWebparts: function () {
        var webpartWorkportal = this;
        var defer = webpartWorkportal.dependantWebparts = new $.Deferred();
        $.when(bizagi.util.initWebpart(bizagi.getWebpart("render"))).done(function () {
                // Resolve dependant webparts deferred
                defer.resolve();
            });
        return defer.promise();
    },
    postRenderRender: function (params) {
        var self = this;
        //El Render en este caso esta contenido esperando evento de los otros webparts ya configurados
        if (params.canvas[0])
            bizagi.startWaiting(params.canvas[0]);

        var webpartParams = $.extend({}, params, {
            webpart: "render",
            namespace: params.namespace ? params.namespace + "." + self.namespaceInternal : self.namespaceInternal
        });

        // Create and execute webpart
        self.executeWebpart(webpartParams).done(function s(result) {
            self.renderWebPart = result.webpart;
            self.renderQueryForm();
        });

    },
    // Set values in the query
    /* dataToSet: the array of values to set in the form, this values could be got from validateAndGetQueryFormParams method*/
    setValues: function(dataToSet){

        var self = this;
        var content = self.getContent();
        var numberOfCheckbox = 0;

        $.each($(".ui-bizagi-render-control-included", content), function(key, value) { 
            if(value.parentElement.style.display !== "none") { // Get the number of controls, with checkbox, that are not hidden
                numberOfCheckbox++;
            }
        });

        self.form = bizagi.rendering.facade.form;
        self.formReady = bizagi.rendering.facade.executionDeferred.promise();

        if (!self.form) {
            $.when(self.formReady).done(function (deferredForm) {
                self.form = deferredForm;
            }).fail(function (m) {
                console.log("Error: " + m.toString());
            });
        }
        
        $.each(dataToSet.message, function (key, value) {
           
            var controlRender = {};

            if(value.renderId) { // When the control has renderById means that the control is from @Metadata
                controlRender = self.form.getRenderById(value.renderId);
            } else {
                controlRender = self.form.getRender(value.xpath);
            }

            $.when(controlRender.ready()).done(function () {

                // Repaint to advanced queries
                if (!!value.advancedQuery) { //Based on setXpathValuesToQueryForm method in the file: jquery\workportal\js\desktop\widget\bizagi.workportal.desktop.widgets.queryform.js
                    var filterType = !!value.filterType ? value.filterType : (controlRender.defaultFilter || "");

                    controlRender.setFilter && controlRender.setFilter(filterType);
                }
                
                if(value.value) {
                    if(controlRender.properties.type === "queryCombo" || controlRender.properties.type === "querySuggest" 
                    || controlRender.properties.type === "queryCascadingCombo" || controlRender.properties.type === "queryState"
                    || controlRender.properties.type === "queryList" || controlRender.properties.type === "queryRadio"
                    || controlRender.properties.type === "queryCaseState") {
                        value.value = value.value[0];
                        controlRender.value = { id: "" }; // Initialize, on the other cases value is null
                    }
                
                    controlRender.setValue(value.value);
                    controlRender.setDisplayValue(value.value);

                    if (controlRender.properties.type === "querySearchUser") { // When it's querySearchUser the display value and the value is set as string but it is necessary the value has the id and the label of the user, for that reason the value is set here:
                        controlRender.value = value.value;
                        controlRender.properties.value = value.value
                    }
                }

                if(value.included){

                    if (!$('.ui-bizagi-render-control-included', controlRender.control[0].parentElement.parentElement).is(":checked")) {
                        $('.ui-bizagi-render-control-included', controlRender.control[0].parentElement.parentElement).trigger('click'); // It is necessary trigger the click in the checkbox because with prop('checked', true) when I get the params again after set the values, the include property doesn't change to true
                    }  
                }

            }); 

        });

        var numberOfIncluded = $(".ui-bizagi-render-control-included:checked", content).size();
         
        if(numberOfCheckbox === numberOfIncluded) {
            $('.ui-bizagi-render-control-included-all').prop('checked', true);
        } 
                
    },
    /* Queries form*/
    renderQueryForm: function(){
        var self = this;
        var contextType = "";
        
        if (self.queryFormType == self.queryFormTypes.CASES) {
            contextType = self.queryFormContextTypes.CASES;
        } else if (self.queryFormType == self.queryFormTypes.ENTITY) {
            contextType = self.queryFormContextTypes.ENTITY;
        }

        var queryFormParams = {
            h_action: "QUERYFORM",
            h_contexttype: contextType,
            h_idForm: self.guidForm
        };
      
        if (self.idQueryForm && self.idQueryForm != "") {
            queryFormParams.h_idqueryform = self.idQueryForm;
        }

        self.dataService.getQueryForm(queryFormParams).done(function (data) {

            var renderingParams = {
                data: data,
                type: "queryForm" };

            self.renderWebPart.renderingExecute(renderingParams);

            self.renderWebPart.rendering.subscribe("rendering-formRendered", function () {
                self.queryForm = self.renderWebPart.rendering.form;

                var request = {
                    "parameters": []
                };
                // Initial search params to be able to identify when there are changes in the form
                self.initialSearchParams = JSON.stringify(self.queryForm.getSearchParams(request));

                if (self.queryForm.properties && typeof (self.queryForm.properties.includeAllUsers) != "undefined") {
                    self.includeAllUsers = self.queryForm.properties.includeAllUsers;
                }
            });
        }).fail(function (error) {
            console.log("error", error.responseText);
            bizagi.iframeCommunicator.trigger("error-get-query-form", error.responseText);
        });
    },
    loadQueryForm: function (e) {

        var self = this;
    
        self.initializeParameters(e.message);

        self.renderQueryForm();
    },
    clearQueryForm: function () {
        var self = this;
        self.renderQueryForm();
    },
     // Get parameters to be sent to the iframe to search, create and copy.
    validateAndGetQueryFormParams: function (){
        var self = this;
        var request = {
            "includeAllUsers": self.includeAllUsers,
            "parameters": []
        };
        
        var content = self.getContent();
        var included = $(".ui-bizagi-render-control-included:checked", content).size();
        self.atLeastOneChecked = (included > 0);

        self.searchParams = self.queryForm.getSearchParams(request);
        if (self.searchParams !== null) { 
            if ((self.queryFormType == self.queryFormTypes.ENTITY && self.atLeastOneChecked) || self.queryFormType == self.queryFormTypes.CASES) {
                if (typeof (self.searchParams.parameters) == "string") {
                    self.searchParams.parameters = JSON.parse(self.searchParams.parameters);
                }
                bizagi.iframeCommunicator.trigger("query-form-parameters", { queryFormParams: self.searchParams });
                console.log("query-form-parameters", { queryFormParams: self.searchParams });
                console.log("JSON query-form-parameters", JSON.stringify(self.searchParams.parameters));
            }
            else {
                // Send message to tell the user at least one item has to be checked
                bizagi.iframeCommunicator.trigger("error-at-least-one-selected", bizagi.localization.getResource("workportal-widget-query-form-at-least-one-checked"));
                console.log("error-at-least-one-selected");
            }
        }   
    },
    detectChanges: function() {
        var self = this;
        var request = {
            "parameters": []
        };
        var currentSearchParams = JSON.stringify(self.queryForm.getSearchParams(request));
        var hasChanges = self.initialSearchParams !== currentSearchParams? true : false;

        console.log(hasChanges ? "form-has-changes" : "form-without-changes");
        bizagi.iframeCommunicator.trigger( hasChanges ? "form-has-changes" : "form-without-changes");
    }
});