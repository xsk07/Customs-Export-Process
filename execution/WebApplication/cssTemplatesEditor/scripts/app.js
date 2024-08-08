/**
 * Created by RicardoPD on 1/27/2016.
 */

var app = (function(){

    var app = {};
    app.dataInitialized = false;
    app.formInitialized = false;


    function initialize(workportal){
        if (app.workportal){
            return;
        }
        app.workportal = workportal;

        bizagi.render.services.multiactionservice.extend("bizagi.render.services.multiactionservice",{},
            {
                execute: function(params){
                    return $.when(this._super(params)).then(function(response){

                        var form = response[0].result.form;

                        if (!app.formInitialized){
                            editor.setHtml(form.elements[0].container.properties.html);
                            editor.setCSS(form.elements[0].container.properties.css);
                            app.formInitialized = true;
                        }
                        else{
                            form.elements[0].container.properties.html = editor.getHtml();
                            form.elements[0].container.properties.css = editor.getCSS();
                        }

                        return response;
                    });
                }
            });


        var dataService = new bizagi.render.services.service({ proxyPrefix:  app.workportal.dataService.serviceLocator.proxyPrefix });

        var renderFactory = (BIZAGI_DEFAULT_DEVICE === "desktop" ? new bizagi.rendering.desktop.factory(dataService): (BIZAGI_DEFAULT_DEVICE == "smartphone_ios" ? new bizagi.rendering.smartphone.factory(dataService): new bizagi.rendering.tablet.factory(dataService)));

        //Sets a promise in order to know when the template engine is loaded
        return $.when(renderFactory.initAsyncStuff()).then(function () {
            //Creates TemplatesEngine
            app.engine = new bizagi.templateEngine({
                renderFactory: renderFactory,
                cache: false,
                forcePersonalizedColumns: true
            });

            app.engine.subscribe("onLoadDataNavigation", function (ev, params) {
                reset();
                params.filters = [];
                params.calculateFilters = params.calculateFilters || true;
                params.data.entityId = params.data.guidEntityCurrent;
                context.navigation = params;
                context.render(params.data);//bizagi.webpart.publish("homeportalShow", {what: "stuffTemplates", title: params.data.displayName, params: params});
            });
        });

    }

    function getEntityData(params){
        params.guidEntityCurrent = params.entityId;

        return app.workportal.dataService.getCollectionEntityData(params).then(function(resp){
            var returnObj = resp.entities[0];
            if ("undefined" === typeof returnObj) {
                editor.setData("No data");
                editor.setCSS("No data");
                editor.setHtml("No data");
                return;
            }

            if (!app.dataInitialized) {
                editor.setData(returnObj.data);
                app.dataInitialized = true;
            }
            else {
                returnObj.data = editor.getData();
            }

            return returnObj;
        });
    }

    function renderTemplate(params){
        return $.when(getEntityData(params)).then(function (entityData) {
            if (typeof entityData !== 'undefined') {
                return app.engine.render(entityData);
            }
            else{
                return "<h2>No hay datos para mostrar</h2>";
            }
        });
    }

    function reset(){
        app.dataInitialized = false;
        app.formInitialized = false;
    }

    function getUserStuff(params) {
        var self = this,
            data = {},
            url = app.workportal.dataService.serviceLocator.getUrl("stuff-handler-getUserStuff");

        if (params && params.icon && typeof params.icon !== "undefined") {
            data.icon = true;
        }

        // Call ajax and returns promise
        return $.read(url, data);
    }

    return {
        initialize: initialize,
        renderTemplate: renderTemplate,
        getMyStuffDesktop: getUserStuff,
        reset: reset
    };
})();