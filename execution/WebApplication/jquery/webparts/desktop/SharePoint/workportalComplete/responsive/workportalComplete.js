/*
 *   Name: BizAgi Workportal Workportal complete Webpart
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a base class to all widgets
 *   -   It's usefull webpart because you can interact with all webparts
 */
bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.workportalComplete", {}, {

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Reset initial params
        initialParams.showViewToggler = false;
        initialParams.view ="grid";

        //namespace
        this.namespaceInternal = "workportalComplete";

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners
        this.subscribe(this.namespaceInternal + ".ui-bizagi-cases-toggle-viewselector", function (e, params) {
            self.changeView(params);
        });

        // Set listeners
        this.subscribe(this.namespaceInternal + ".ui-bizagi-cases-list", function (e, params) {
            $("#back-button",self.content).click();
        });

        //el webPart de processes lanza este envento a cases, en ese momento la información del render sería inconsistente, en caseSummary se carga el primer caso, y en complete se vuelve a mostrar cases and summary
        this.subscribe(this.namespaceInternal + ".ui-bizagi-show-summary-first", function (e, params) {
            self.loadCasesAndCaseSummary(params);
        });

        //el webPart de newCase lanza este envento
        this.subscribe(this.namespaceInternal + ".ui-bizagi-show-render-new", function (e, params) {
            self.showRender(params);
        });

        this.subscribe(self.namespaceInternal + ".ui-bizagi-show-activitySelector", function (e, params) {
            self.showActivitySelector(params);
        });

        this.subscribe(self.namespaceInternal + ".ui-bizagi-show-render", function (e, params) {
            self.showRender(params);
        });

        this.subscribe(self.namespaceInternal + ".ui-bizagi-can-change-activityform", function (e, params) {
            //It is necesary for execute event
            self.renderWebPart.isVisible = true;
        });

        //waitContainer
        this.waitContainer = initialParams.waitContainer;

        //pageWebparts
        this.newCaseWebPart = null;
        this.processesWebPart = null;
        this.casesWebPart = null;
        this.renderWebPart = null;
        this.caseSummaryWebPart = null;
        this.activitySelectorWebpart = null;
        this.workitemSummaryWebpart = null;
        this.backButton = null;
        //cookieName
        this.cookieName;
        //visible process column
        this.processColumnIsVisible = true;
    },
    /*
     *   Renders the content for the current controller
     */
    renderContent: function (params) {
        var self = this;
        return $.when(self.loadDependantWebparts()).pipe(function () {
            var template = self.getTemplate("workportalComplete");
            var content = self.content = $.tmpl(template);
            return content;
        });
    },

    /**
     *   To be overriden in each device to apply layouts
     */
    postRender: function (params) {
        var self = this;
        var content = self.getContent();

        // Execute inner webparts
        var newCaseCanvas = $("#newcase-canvas", content);
        var processesCanvas = $("#processes-canvas", content);
        var casesCanvas = $("#cases-canvas", content);
        var renderCanvas = $("#render-canvas-wkc", content);
        var caseSummaryCanvas = $("#caseSummary-canvas", content);
        var activitySelectorCanvas = $("#activitySelector-canvas", content);
        var workitemSummaryCanvas = $("#workitemSummary-canvas", content);

        self.postRenderNewCase($.extend(params, { canvas: newCaseCanvas, namespace: self.namespaceInternal }));
        self.postRenderProcess($.extend(params, { canvas: processesCanvas, namespace: self.namespaceInternal }));
        self.postRenderCases($.extend(params, { canvas: casesCanvas, namespace: self.namespaceInternal }));
        self.postRenderRender($.extend(params, { canvas: renderCanvas, namespace: self.namespaceInternal }));
        self.postRenderCaseSummary($.extend(params, { canvas: caseSummaryCanvas, namespace: self.namespaceInternal }));
        self.postRenderActivitySelector($.extend(params, { canvas: activitySelectorCanvas, namespace: self.namespaceInternal }));
        self.postRenderWorkitemSummary($.extend(params, { canvas: workitemSummaryCanvas, namespace: self.namespaceInternal }));
        self.postRenderBackButton(params);

        self.configureSlider();

        // Collapse slider in mobile view
        var proccesColumn = $(".process-column", content);
        var sliderPanel =  $("#panelArrowContainer", content);
        self.hideProcessColumn(proccesColumn, sliderPanel);

        self.endWaiting();
    },

    postRenderBackButton: function (params) {
        var self = this;
        var content = self.getContent();
        var backButton = self.backButton = $("#back-button", content);
        backButton.hide();
        backButton.removeClass("visible-inline-block");
        backButton.click(function () {
            self.showInitialProcessList(params);
        });
    },

    /**
     *   postRender only new case canvas
     */
    postRenderNewCase: function (params) {
        var self = this;
        if (params.canvas[0])
            bizagi.startWaiting(params.canvas[0]);
        var webpartParams = $.extend({}, params, {
            webpart: "newcase",
            renderBehavior: "OtherWebPartThisPage",
            renderPageUrl: ""
        });

        self.executeWebpart(webpartParams).done(function (result) {
            self.newCaseWebPart = result.webpart;
        });
    },
    /**
     *   postRender only process canvas
     */
    postRenderProcess: function (params) {
        var self = this;
        if (params.canvas[0])
            bizagi.startWaiting(params.canvas[0]);
        var webpartParams = $.extend({}, params, {
            webpart: "processes"
        });

        self.executeWebpart(webpartParams).done(function (result) {
            self.processesWebPart = result.webpart;
        });
    },
    /**
     *   postRender only process canvas
     */
    postRenderCases: function (params) {
        var self = this;
        if (params.canvas[0])
            bizagi.startWaiting(params.canvas[0]);
        var webpartParams = $.extend({}, params, {
            webpart: "cases",
            renderBehavior: "OtherWebPartThisPage",
            renderPageUrl: "",
            summaryBehavior: "OtherWebPartThisPage",
            summaryPageUrl: ""
        });

        self.executeWebpart(webpartParams).done(function (result) {
            self.casesWebPart = result.webpart;
        });

    },
    /**
     *   postRender only process canvas
     */
    postRenderRender: function (params) {
        var self = this;

        var webpartParams = $.extend({}, params, {
            webpart: "render", adjustButtonsToContent: false
        });

        //El Render en este caso esta contenido esperando evento de los otros webparts ya configurados
        self.createWebpart(webpartParams).done(function (result) {
            self.renderWebPart = result.webpart;
            self.renderWebPart.hide(true);
            self.renderWebPart.endWaiting();
        });
    },

    /**
     *   postRender only process canvas
     */
    postRenderCaseSummary: function (params) {
        var self = this;
        if (params.canvas[0])
            bizagi.startWaiting(params.canvas[0]);
        var webpartParams = $.extend({}, params, {
            webpart: "caseSummary",
            renderBehavior: "OtherWebPartThisPage"
        });

        self.executeWebpart(webpartParams).done(function (result) {
            self.caseSummaryWebPart = result.webpart;

            //find initial view of cases
            var viewCases = self.defineCasesView(params);
            if (viewCases == "details") {
                self.caseSummaryWebPart.show();
            } else {
                self.caseSummaryWebPart.hide(true);
            }
        });
    },

    /**
     *   postRender only process canvas
     */
    postRenderWorkitemSummary: function (params) {
        var self = this;

        var webpartParams = $.extend({}, params, {
            webpart: "workitemSummary",
            renderBehavior: "OtherWebPartThisPage"
        });

        self.createWebpart(webpartParams).done(function (result) {
            self.workitemSummaryWebpart = result.webpart;
            self.workitemSummaryWebpart.hide(true);
        });
    },

    postRenderActivitySelector: function (params) {
        var self = this;

        var webpartParams = $.extend({}, params, {
            webpart: "activitySelector"
        });

        self.createWebpart(webpartParams).done(function (result) {
            self.activitySelectorWebPart = result.webpart;
            self.activitySelectorWebPart.hide(true);
            self.activitySelectorWebPart.endWaiting();
        });
    },

    loadDependantWebparts: function () {
        var webpartWorkportal = this;
        var defer = webpartWorkportal.dependantWebparts = new $.Deferred();
        $.when(bizagi.util.initWebpart(bizagi.getWebpart("newcase")),
            bizagi.util.initWebpart(bizagi.getWebpart("processes")),
            bizagi.util.initWebpart(bizagi.getWebpart("cases")),
            bizagi.util.initWebpart(bizagi.getWebpart("render")),
            bizagi.util.initWebpart(bizagi.getWebpart("caseSummary")),
            bizagi.util.initWebpart(bizagi.getWebpart("activitySelector"))
        ).done(function () {
            // Hack webpart
            bizagi.workportal.webparts.cases.prototype.displayCaseDetail = function (params) {
                var webpartCases = this;
                //Por defecto en este caso se agreron todos en self.summaryBehavior = "OtherWebPartThisPage" aqui lo importante es el origen del evento
                switch (params.eventSource) {
                    case "view-summary-button-grid": //summary in PopUp
                        params.idWorkitem = params.idWorkitem;
                        params.idCase = params.idCase;
                        params.workportal = webpartWorkportal.workportalFacade.workportal;

                        webpartWorkportal.helper.displayWebPartPopUp("caseSummaryAndRenderComplete", params, function (e, params) { webpartCases.showCases(webpartCases.params); });

                        break;
                    case "link-grid": //render in WebPart and hidden cases-grid
                        webpartCases.summaryBehavior = "OtherWebPartThisPage";
                        webpartCases.updateCasesViewStyle("details");
                        webpartWorkportal.casesWebPart.hide(true);
                        webpartWorkportal.caseSummaryWebPart.hide(true);
                        webpartWorkportal.renderWebPart.show();
                        webpartWorkportal.activitySelectorWebPart.hide(true);

                        webpartWorkportal.publish(webpartWorkportal.namespaceInternal + ".ui-bizagi-show-render", { idWorkitem: params.idWorkitem, idCase: params.idCase, idWorkflow: params.idworkflow });

                        break;
                    case "thumbnail-details": //caseSummary in OtherWebPartThisPage in this case the webpart caseSummary is visible
                        webpartCases.summaryBehavior = "OtherWebPartThisPage";
                        webpartWorkportal.publish(webpartWorkportal.namespaceInternal + ".ui-bizagi-show-summary", { idWorkitem: params.idWorkitem, idCase: params.idCase, idWorkflow: params.idworkflow });
                        break;
                    case "link-details": //render in WebPart and hidden cases-details and caseSummary
                        webpartCases.summaryBehavior = "OtherWebPartThisPage";

                        webpartWorkportal.casesWebPart.hide(true);
                        webpartWorkportal.caseSummaryWebPart.hide(true);
                        webpartWorkportal.renderWebPart.show();
                        webpartWorkportal.activitySelectorWebPart.hide(true);

                        webpartWorkportal.publish(webpartWorkportal.namespaceInternal + ".ui-bizagi-show-render", { idWorkitem: params.idWorkitem, idCase: params.idCase, idWorkflow: params.idworkflow  });

                        break;
                }
            };
            bizagi.workportal.webparts.cases.prototype.updateCasesViewStyle = function (view) {
                if (view == "grid") {
                    $(".cases-column").addClass("cases-column-grid");
                    $(".cases-column").removeClass("cases-column-details");
                } else {
                    $(".cases-column").addClass("cases-column-details");
                    $(".cases-column").removeClass("cases-column-grid");
                }
            };


            // Resolve dependant webparts deferred
            defer.resolve();
        });

        return defer.promise();
    },

    changeView: function (params) {
        var self = this;
        self.casesWebPart.updateCasesViewStyle(params.view);
        switch (params.view) {
            case "details": //visible cases and caseSummary
                self.casesWebPart.show();
                self.caseSummaryWebPart.show();
                self.renderWebPart.hide(true);
                self.activitySelectorWebPart.hide(true);
                break;
            case "grid": //visible cases
                self.casesWebPart.show();
                self.caseSummaryWebPart.hide(true);
                self.renderWebPart.hide(true);
                self.activitySelectorWebPart.hide(true);
                break;
        }
    },

    loadCasesAndCaseSummary: function (params) {
        var self = this;
        //find initial view of cases
        self.changeView($.extend(params, { view: self.defineCasesView(params) }));
    },

    defineCasesView: function (params) {
        var self = this;
        self.cookieName = self.cookieName || params.cookieName || "casesviewselector";
        self.viewWebPart = params.view || bizagi.cookie(self.cookieName) || self.viewWebPart || "grid";
        return self.viewWebPart;
    },

    webpartsAreLoaded: function () {
        return this.dependantWebparts.promise();
    },

    /*
     *   configures the slide event
     */
    configureSlider: function () {
        var self = this;
        var content = self.getContent();
        if (!content) {
            return;
        }

        var sliderPanel = $("#panelArrowContainer", content);

        sliderPanel.click(function () {
            var processColumn = $(".process-column");
            if (self.processColumnIsVisible) {
                // Hide left panel
                self.hideProcessColumn(processColumn, sliderPanel);
            } else {
                // Show left panel
                self.showProcessColumn(processColumn, sliderPanel);
            }
        });
    },

    /*
     *   Hides the summary component
     */
    hideProcessColumn: function (processColumn, sliderPanel) {
        var self = this;
        var content = self.getContent();
        processColumn.hide();

        var panelArrow = $("#panelArrow", sliderPanel);
        panelArrow.removeClass("panelArrowLeft");
        panelArrow.addClass("panelArrowRight");

        self.processColumnIsVisible = false;
    },
    /*
     *   Show the summary component
     */
    showProcessColumn: function (processColumn, sliderPanel) {
        var self = this;
        var content = self.getContent();
        processColumn.show();

        var panelArrow = $("#panelArrow", sliderPanel);
        panelArrow.addClass("panelArrowLeft");
        panelArrow.removeClass("panelArrowRight");

        self.processColumnIsVisible = true;
    },

    showInitialProcessList: function (params) {
        var self = this;
        if (self.renderWebPart) {
            $.when(self.renderWebPart.canHide())
                .done(function () {
                    // The render wepart can hide now
                    self.casesWebPart.showCases(params);
                    self.processesWebPart.refresh(params);
                    self.caseSummaryWebPart.refresh(params);
                    self.renderWebPart.avoidVerifyCanHide = true;
                    self.processesWebPart.show();
                    self.workitemSummaryWebpart.hide(true);
                    self.backButton.hide();
                    self.backButton.removeClass("visible-inline-block");
                    $(".cases-column", self.getContent()).removeClass("cases-column-grid-hide");
                    self.changeView($.extend(params, { view: self.defineCasesView(params) }));
                });
        }
    },
    showRender: function () {
        var self = this;
        if (self.renderWebPart) {
            self.processesWebPart.hide(true);
            self.casesWebPart.hide(true);
            self.caseSummaryWebPart.hide(true);
            self.renderWebPart.show();
            self.renderWebPart.avoidVerifyCanHide = undefined;
            self.activitySelectorWebPart.hide(true);
            self.workitemSummaryWebpart.show();
            self.backButton.show();
            self.backButton.addClass("visible-inline-block"); //fix IE
            $(".cases-column", self.getContent()).addClass("cases-column-grid-hide");
        }
    },
    showActivitySelector: function () {
        var self = this;
        if (self.renderWebPart) {
            self.processesWebPart.hide(true);
            self.renderWebPart.hide(true);
            self.casesWebPart.hide(true);
            self.caseSummaryWebPart.hide(true);
            self.activitySelectorWebPart.show();
            self.workitemSummaryWebpart.show();
            self.backButton.show();
            self.backButton.addClass("visible-inline-block"); //fix IE
        }
    }
});
