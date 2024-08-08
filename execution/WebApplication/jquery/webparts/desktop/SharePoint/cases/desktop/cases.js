/*
 *   Name: BizAgi Workportal Cases Webpart
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a base class to all widgets
 */

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.cases", {}, {

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners
        this.subscribe("ui-bizagi-show-cases", function (e, params) {
            self.showCases(params);
        });

        // Set listeners
        this.subscribe("ui-bizagi-reload-cases", function (e, params) {
            self.showCases($.extend({}, self.params, params));
        });

        //waitContainer
        this.waitContainer = initialParams.waitContainer;

        //renderBehavior
        this.renderBehavior = initialParams.renderBehavior;

        //renderPageUrl
        this.renderPageUrl = initialParams.renderPageUrl;

        //renderBehavior
        this.summaryBehavior = initialParams.summaryBehavior;

        //renderPageUrl
        this.summaryPageUrl = initialParams.summaryPageUrl;
        this.graphicQueryBehavior = initialParams.graphicQueryBehavior;
        //Case Id
        this.idCase = 0;
        //showViewToggler and view this variable need maintain between request
        this.showViewToggler = null;
        this.viewWebPart = null;

        //cookieName
        this.cookieName;
        //cookieName
        this.pageSize;

        this.actualpage;

        this.radNumber;

    },
    /*
     *   Renders the content for the current controller
     */
    renderContent: function (params) {
        var self = this;
        var defer = new $.Deferred();
        var template = self.getTemplate("cases");

        self.defineCasesView(params);

        if (self.showViewToggler == null) {
            self.showViewToggler = (typeof params.showViewToggler != "undefined") ? bizagi.util.parseBoolean(params.showViewToggler) : true;
        }

        self.pageSize = self.pageSize || params.pageSize;
        var view = self.defineCasesView(params);

        // Get data
        $.when(self.dataService.getCustomizedColumnsData({
                idWorkflow: params.idWorkflow,
                taskState: params.taskState,
                onlyFavorites: params.onlyFavorites,
                page: self.actualpage,
                // Sort and order parameters
                order: params.order,
                orderFieldName: params.orderFieldName,
                orderType: params.orderType,
                pageSize: self.pageSize,
                radNumber: self.radNumber
            }))
            .done(function (data) {
                // add data for pager
                self.data = data = self.completeData(data);
                // Render content
                var content = self.content = $.tmpl(template, $.extend(data, {
                    processName: params.processName || bizagi.localization.getResource("workportal-widget-inbox-all-cases"),
                    showViewToggler: self.showViewToggler,
                    view: view
                }));
                $("#bz-wp-search-cases", content).val(self.radNumber);

                // Configure webpart habdlers
                self.configureWebPartHandlers(content, params);

                // Format invariant dates
                bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

                defer.resolve(content);
            }).fail(function (msg) {
                var noFavorites = "Internal server error. Please contact your administrator";
                if (msg.responseText.indexOf(noFavorites) == -1) {
                    self.manageError(msg, defer);
                }
                else {
                    self.content.html(noFavorites);
                    $("#cases-canvas-waiting", self.canvas).hide();
                    defer.resolve();
                }
        });
        return defer.promise();
    },

    /*
     *   Customize the web part in each device
     */
    postRender: function (params) {

        var self = this;
        var content = self.getContent();

        if (self.viewWebPart == "details") {
            self.listPostRender(params, content);
        } else {
            self.gridPostRender(params, content);
        }

        self.updateCasesViewStyle(self.viewWebPart);

        if (self.data) {
            self.casesPagination(self.data);
        }

        self.endWaiting();
        //self.helper.removeWaitContainer(self.waitContainer);
        $(".bz-wp-cases-view-principal", content).click(function (e) {
            var $viewSelector = $(".bz-wp-cases-header-viewselector", content);
            e.stopPropagation();
            if ($viewSelector.hasClass("viewselector-off")) {
                $viewSelector.addClass("viewselector-on");
                $viewSelector.removeClass("viewselector-off");
            }
            else {
                $viewSelector.addClass("viewselector-off");
                $viewSelector.removeClass("viewselector-on");
            }

            $("body").bind("click", (function (event) {
                // $("#tooltip_container").css("display", "none");
                var $target = $(event.target);
                if (!$target.parents().is(".bz-wp-cases-view-principal") && !$target.is(".bz-wp-cases-view-principal")) {
                    $(".bz-wp-cases-header-viewselector", content).addClass("viewselector-off");
                    $(".bz-wp-cases-header-viewselector", content).removeClass("viewselector-on");
                    $("body").unbind("click");
                }

            }));
        });

        $(".sortColumnsData", content).click(function (e) {
            var column = $(this);

            self.params.orderType = (column.data("order-type") == 1 || column.data("order-type") == 'desc') ? 0 : 1;
            self.params.order = column.data("order");
            self.params.orderFieldName = column.data("orderfieldname");
            self.refresh(self.params);
        });        

        //search-cases text-box input
        $("#bz-wp-search-cases", content).click(function (e) {
            if (this.value == bizagi.localization.getResource("workportal-menu-search"))
                this.value = '';
        });

        $("#bz-wp-search-cases", content).hover(function (e) {
            if (bizagi.util.isEmpty(this.value))
                this.value = bizagi.localization.getResource("workportal-menu-search");
        });

        $("#bz-wp-search-cases", content).mouseleave(function (e) {
            if (this.value == bizagi.localization.getResource("workportal-menu-search"))
                this.value = '';
        });

        var getCustomizedColumnsData = function (radNumber, searchcasesinput) {
            radNumber = radNumber || "";
            $.when(self.dataService.getCustomizedColumnsData({
                radNumber: radNumber
            })).done(function (data) {
                if (data.cases) {
                    if (data.cases.rows.length > 0) {
                        $(searchcasesinput).removeClass("bz-wp-search-cases-noresults");
                        self.radNumber = searchcasesinput.value;
                        self.refresh(params);
                        if(bizagi.util.isSharepointContext() && params.namespace === "workportalComplete") {
                            var summaryParams = {};
                            var dataCase = data.cases.rows[0];
                            summaryParams.eventSource = "thumbnail-details";
                            summaryParams.idCase = dataCase.id;
                            summaryParams.idworkflow = dataCase.idWorkFlow;
                            summaryParams.idworkitem = null;
                            if(typeof(dataCase.fields) !== "undefined" && dataCase.fields.length > 2 && typeof(dataCase.fields[2].workitems) !== "undefined" && dataCase.fields[2].workitems.length > 0)
                                summaryParams.idworkitem = dataCase.fields[2].workitems[0].idWorkItem;
                            self.displayCaseDetail(summaryParams);
                        }
                    }
                    else {
                        $(searchcasesinput).addClass("bz-wp-search-cases-noresults");
                    }
                }
                else {
                    $(searchcasesinput).addClass("bz-wp-search-cases-noresults");
                }
            });
        };

        $("#bz-wp-search-cases", content).bind("keypress", function (e) {
            var searchcasesinput = this;
            if (e.keyCode == 13) {
                self.actualpage = 1;
                getCustomizedColumnsData(this.value, searchcasesinput)
            }
        });

        $(".bz-wp-search-allcases", content).bind("click", function (e) {
            var searchcasesinput = $("#bz-wp-search-cases", content);
            getCustomizedColumnsData("", searchcasesinput);
        });

        // Apply to mobile
        if(bizagi.util.isSharepointContext()) $("#bz-webpart").addClass("bz-sharepoint-webpart");
        if(bizagi.detectRealDevice() != "desktop"){
            //$("#bz-webpart").css("height", window.innerHeight + "px");
            $("#bz-webpart").css("overflow", "auto");
        }

    },
    /**/
    listPostRender: function (params, content) {
        var self = this;
        
        // Bind cases detail in render   
        $(".ui-bizagi-wp-case-workitem-list", content).click(function (e) {
            e.stopPropagation();
            params.idWorkitem = $(this).attr("data-workitem-id");
            params.idCase = $(this).parents(".ui-bizagi-wp-case-list").data("caseId");
            params.idworkflow = $(this).parents(".ui-bizagi-wp-case-list").data("workflowId");
            params.eventSource = "link-details";
            self.displayCaseDetail(params)
        });
        $(".ui-bizagi-wp-case-list", content).click(function (e) {
            e.stopPropagation();
            params.eventSource = "thumbnail-details";
            params.idCase = $(this).data("caseId");
            params.idworkflow = $(this).data("workflowId");
            self.idCase = params.idCase;

            if ($(this).find("#caseActivity .ui-bizagi-wp-case-workitem-list").length <= 1) {
                params.idWorkitem = $(this).find("#caseActivity .ui-bizagi-wp-case-workitem-list").attr("data-workitem-id");

                if (!params.idWorkitem) {
                    //Cargar el sumary del case y averiguar el WorkItem Actual
                    $.when(
                        self.dataService.summaryCaseDetails({
                            idCase: self.idCase
                        })
                    ).done(function (data) {
                        params.idWorkitem = (data.currentState.length > 0) ? data.currentState[0].idWorkItem : 0;
                        self.displayCaseDetail(params);
                    });
                }
                else {
                    self.displayCaseDetail(params);
                }
            }
            else {

                params.idWorkitem = undefined;
                self.displayCaseDetail(params);
            }
        });

        // Select the first one
        //$(".ui-bizagi-wp-case-list:first",content).click();
    },

    gridPostRender: function (params, content) {
        var self = this;
        var columnsLength = $("thead th", content).length;

        /*$('.ui-wp-cases-grid', content).stacktable({
            headIndex: [0, 2, columnsLength - 1],
            disableTitle: true,
            cssClassTd: "ui-bizagi-wp-case-grid"
        });*/

        $(".ui-bizagi-wp-case-workitem-grid", content).click(function (e) {
            e.stopPropagation();
            params.idWorkitem = $.trim($(this).attr("data-workitem-id"));
            params.idCase = $(this).parents(".ui-bizagi-wp-case-grid").data("caseId");
            params.idworkflow = $(this).parents(".ui-bizagi-wp-case-grid").data("workflowId");
            params.eventSource = "link-grid";
            self.displayCaseDetail(params);
        });
        //Se cancelo que el tr pueda ejecutar un evento. Comentario de masivo
        $(".ui-bizagi-wp-case-tr", content).click(function (e) {
            e.stopPropagation();
        });

        $(".cases-grid-button", content).click(function (e) {
            e.stopPropagation();
            params.idCase = $(this).parents(".ui-bizagi-wp-case-grid").attr("data-case-id");
            params.eventSource = "view-summary-button-grid";
            self.displayCaseDetail(params);
        });

        // Add click to view workflow
        $(".ui-bizagi-wp-app-inbox-cases-graphical-view", content).click(function () {
            var idCase = $(this).parents(".ui-bizagi-wp-case-grid").attr("data-case-id");
            var idWorkflow = $(this).parents(".ui-bizagi-wp-case-grid").attr("data-workflow-id") || "";
            var caseNumber = caseNumber || "";

            switch (self.graphicQueryBehavior) {
                case "PopUp":
                    var webpartParams = $.extend({}, {
                        idWorkflow: idWorkflow,
                        idCase: idCase,
                        fullScreen: true
                    }, {workportal: self.workportalFacade.workportal, isWebpartInIFrame: false});
                    self.helper.displayWebPartPopUp("graphicquery", webpartParams);
                    break;
                case"OtherPage":
                    var baseUrl = "webpart.htm?type=graphicquery";
                    var url = baseUrl + "&idCase=" + idCase + "&idWorkflow=" + idWorkflow;
                    window.open(url);
                    break;
                case "ParentPopUp":
                    var server = window.location.origin + window.location.pathname;
                    var url = server + "?type=graphicquery&idCase=" + idCase+ "&idWorkflow=" + idWorkflow;
                    var popup = {
                        command: "BZ_OPEN_DIALOG",
                        parameters: {
                            url: url,
                            title: bizagi.util.trim(""+caseNumber),
                            allowMaximize: true,
                            showClose: true,
                            width: 1100,
                            height: 924
                        }
                    };

                    parent.postMessage(JSON.stringify(popup), '*');
                    break;
            }
            return false;
        });
    },

    defineCasesView: function (params) {
        var self = this;
        self.cookieName = self.cookieName || params.cookieName || "casesviewselector";
        self.viewWebPart = params.view || bizagi.cookie(self.cookieName) || self.viewWebPart || "grid";
        return self.viewWebPart;
    },

    displayRender: function (params) {
        //Define Render Behavior
        var self = this;
        switch (self.renderBehavior) {
            case "OtherWebPartThisPage":
                self.helper.publishShowRenderEvent("ui-bizagi-show-render", self, {
                    idWorkitem: params.idWorkitem,
                    idCase: params.idCase
                });
                break;
            case "OtherPage":
                if (bizagi.util.isSharepointContext()) {
                    if (self.isWebpartInIFrame) {
                        window.parent.location.href = self.renderPageUrl + "?idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase;
                    } else {
                        window.location.href = self.renderPageUrl + "?idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase;
                    }
                } else {
                    var pathOtherPage = "";
                    if (typeof (self.renderPageUrl) != "undefined" && self.renderPageUrl != "") {
                        pathOtherPage = "jquery/webparts/desktop/portal/pages/webpart.htm";
                        pathOtherPage = (self.renderPageUrl.indexOf("webpart") != -1) ? self.renderPageUrl : self.renderPageUrl + "/" + pathOtherPage;
                    }
                    window.open(pathOtherPage + "?type=activityForm&idCase=" + params.idCase + "&renderBehavior=" + self.renderBehavior);
                }
                break;
            case "PopUp":

                params.idWorkitem = params.idWorkitem;
                params.idCase = params.idCase;
                //
                params.workportal = self.workportalFacade.workportal;

                var webpartParams = $.extend({}, params, {
                    workportal: self.workportalFacade.workportal,
                    isWebpartInIFrame: false
                });

                if (bizagi.sharepointContext) {
                    //params.sharepointProxyPrefix solo es valido en el contexto de SharePoint
                    var pathiFrame = params.sharepointProxyPrefix.substring(params.sharepointProxyPrefix.indexOf("http"), params.sharepointProxyPrefix.length);
                    webpartParams.pathiFrame = pathiFrame;
                    //webpartParams.remoteServer = remoteServer;
                    self.helper.displayWebPartPopUpinIFrame("renderComplete", webpartParams, function (e, params) {
                        self.closePopUp(self.params);
                    });
                }
                else {
                    self.helper.displayWebPartPopUp("renderComplete", webpartParams, function (e, params) {
                        self.closePopUp(self.params);
                    });
                }
                break;
            case "ParentPopUp":
                var server = window.location.origin + window.location.pathname;
                var url = server + "?type=render&idCase=" + params.idCase + "&idWorkitem=" + params.idWorkitem + "&adjustButtonsToContent=true&iframename=iframePopUprenderComplete";
                var popup = {
                    command: "BZ_OPEN_DIALOG",
                    parameters: {
                        url: url,
                        title: bizagi.util.trim(""),
                        allowMaximize: true,
                        showClose: true,
                        width: 1100,
                        height: 924
                    }
                };

                parent.postMessage(JSON.stringify(popup), '*');
                break;
        }
    },

    displaySummary: function (params) {
        //Define Render Behavior
        var self = this;
        switch (self.summaryBehavior) {
            case "OtherWebPartThisPage":
                self.publish("ui-bizagi-show-summary", params);
                break;
            case "OtherPage":
                var pathOtherPage;
                if (params.idWorkitem) {
                    pathOtherPage = self.summaryPageUrl + "?idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase;
                }
                else {
                    pathOtherPage = self.summaryPageUrl + "?idCase=" + params.idCase;
                }
                if (bizagi.util.isSharepointContext()) {
                    if (self.isWebpartInIFrame) {
                        window.parent.location.href = pathOtherPage;
                    } else {
                        window.location.href = pathOtherPage;
                    }
                } else {
                    if (typeof (self.summaryPageUrl) != "undefined" && self.summaryPageUrl != "") {
                        pathOtherPage = pathOtherPage.split("?")[0].split("#")[0];
                        pathOtherPage = (self.summaryPageUrl.indexOf("webpart") != -1) ? pathOtherPage + "?" : pathOtherPage + "/jquery/webparts/desktop/portal/pages/webpart.htm?";
                    }
                    window.open(pathOtherPage + "&type=caseSummary&renderBehavior=" + self.summaryBehavior + "&idCase=" + params.idCase);
                }
                break;
            case "PopUp":
                params.idWorkitem = params.idWorkitem;
                params.idCase = params.idCase;
                var webpartParams = $.extend({}, params, {
                    workportal: self.workportalFacade.workportal,
                    isWebpartInIFrame: false
                });
                //clone objet all in javascript is by reference
                if (bizagi.sharepointContext) {
                    //params.sharepointProxyPrefix solo es valido en el contexto de SharePoint
                    var pathiFrame = params.sharepointProxyPrefix.substring(params.sharepointProxyPrefix.indexOf("http"), params.sharepointProxyPrefix.length);
                    webpartParams.pathiFrame = pathiFrame;
                    //webpartParams.remoteServer = remoteServer;
                    self.helper.displayWebPartPopUpinIFrame("caseSummaryAndRenderComplete", webpartParams, function (e, params) {
                        self.closePopUp(self.params);
                    }, self.postmessageSocket);
                }
                else {
                    self.helper.displayWebPartPopUp("caseSummaryAndRenderComplete", webpartParams, function (e, params) {
                        self.closePopUp(self.params);
                    });
                }
                break;
            case "ParentPopUp":
                var server = window.location.origin + window.location.pathname;
                var url = server + "?type=caseSummary&renderBehavior=" + self.summaryBehavior + "&graphicQueryBehavior="+ self.graphicQueryBehavior +"&idCase=" + params.idCase;
                var popup = {
                    command: "BZ_OPEN_DIALOG",
                    parameters: {
                        url: url,
                        title: bizagi.util.trim(""),
                        allowMaximize: true,
                        showClose: true,
                        width: 1100,
                        height: 924
                    }
                };

                parent.postMessage(JSON.stringify(popup), '*');
                break;
        }
    },

    /* this Method define the priority between render and summary behavior */
    displayCaseDetail: function (params, content) {
        var self = this;
        switch (params.eventSource) {
            case "view-summary-button-grid":
                self.displaySummary(params);
                break;
            case "link-grid":
                self.displayRender(params);
                break;
            case "thumbnail-details":
                self.displaySummary(params);
                break;
            case "link-details":
                self.displayRender(params);
                break;
        }
    },

    casesPagination: function (data) {
        var self = this;
        var pageSelector = $("#casesPaginationInbox", self.content);

        var paginationTemplate = self.getTemplate("pagination-inbox");
        var paginationHtml = $.tmpl(paginationTemplate, data);

        $(pageSelector).append(paginationHtml);

        // Crate pagination control 
        pageSelector.bizagiPagination({
            totalPages: data.cases.totalPages,
            actualPage: data.cases.page,
            listElement: $("ul", pageSelector),
            clickCallBack: function (options) {
                self.actualpage = options.page;
                self.refresh(self.params);
                if(self.namespace !== "workportalComplete") 
                    document.body.scrollIntoView();
            }
        });
    },
    /*
     *   Listener to ui-bizagi-show-cases event
     */
    showCases: function (params) {
        var self = this;
        self.onWaiting();
        this.refresh(params);
    },
    /*
     *   Listener to ui-bizagi-show-cases event
     */
    closePopUp: function (params) {
        var self = this;
        self.showCases(params);
        self.publish("ui-bizagi-show-processes", self.params);
    },


    changeView: function(params, view){
        var self = this;

        // Save in cookie for next executions
        bizagi.cookie(self.cookieName, view, {expires: 30});
        self.viewWebPart = view;
        self.params.view = view;
        self.publish("ui-bizagi-cases-toggle-viewselector", $.extend(params, {view: view  }));
        self.params.refreshData = false;
        self.refresh(self.params);
        self.updateCasesViewStyle(self.viewWebPart);
    },

    /*
     *   Configure general handlers
     */
    configureWebPartHandlers: function (content, params) {
        var self = this;

        // Change view Grid <- -> List
        content.delegate(".bz-wp-cases-header-viewselector span", "click", function (e) {
            var view = $(this).data("view");
            e.stopPropagation();
            if (!self.params.collapsed) {
                if (this.parentElement.parentElement) {
                    this.parentElement.parentElement.click();
                }
            }
            self.changeView(params, view);
        });
    },
    updateCasesViewStyle: function (data) {
        //implement in inheritance
    },
    getDisplayNameField: function (itemj) {
        //itemj Only have 1 key
        var keyName;
        for (var key in itemj) {
            keyName = key;
        }
        return keyName;
    },
    completeData: function (data) {
        var self = this;
        // Add paging stuff
        var pagesToShow = 4;
        var pagesToShow = (pagesToShow > data.cases.totalPages) ? data.cases.totalPages : pagesToShow;
        var pages = [];
        for (var i = 1; i <= pagesToShow; i++) {
            pages.push({
                number: i,
                active: (i == data.cases.page)
            });
        }

        //Calculate number of columns
        var columnsGridLength = 0;
        if (data.cases.rows.length > 0) {
            //Calculate number of columns
            columnsGridLength = data.cases.rows[0].fields.length + 1; //+1 for the task

            //Add CaseNumber to data case
            $.each(data.cases.rows, function (index, item) {
                $.each(item.fields, function (indexj, itemj) {
                    if (itemj != null) {
                        if (data.cases.columnTitle[indexj].fieldName == "I_RadNumber") {
                            item.caseNumber = itemj;
                        }
                        //Add support fields in format:[Object]
                        if (typeof (itemj) == "object" && itemj != null) {
                            itemj.displayName = self.getDisplayNameField(itemj);
                        }
                    }
                });
            });
        }

        $.extend(data, {
            pages: pages,
            columnsGridLength: columnsGridLength + 1
        });
        return data;
    }
});
