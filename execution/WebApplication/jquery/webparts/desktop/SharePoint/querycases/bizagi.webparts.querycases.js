
/*
*   Name: BizAgi Workportal QueryCases Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.querycases", {}, {

    /*
    *   Constructor 
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;
        //Set initial filter

        self.initialParams = initialParams;
        self.title = initialParams.title;
        //Load initial filter as json:
        var initialFilter = [];
        if (typeof (self.initialParams.filter) == "object") {
            initialFilter = initialParams.filter;
        } else {
            try {
                initialFilter = JSON.parse(self.initialParams.filter);
            } catch (e) {
                initialFilter = [];
            }
        }
        self.initialFilter = initialFilter;


        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners
        this.subscribe("ui-bizagi-applyfilter-QCases", function (e, params) {
            //Set variables to reload the data:
            self.initialParams.refreshData = true;

            self.initialParams.dynamicFilter = params.filter;
            self.refresh(self.initialParams);
        });


        self.paginationTemplate = self.workportalFacade.getTemplate("inbox-common-pagination-grid");

    },
    addDynamicFilter: function (params) {
        var self = this;
        var dynamicFilter = params.dynamicFilter
        if (typeof (dynamicFilter) != "object") {
            try {
                dynamicFilter = JSON.parse(dynamicFilter);
            } catch (e) {
                dynamicFilter = [];
            }
        }
        else {
            //dynamicFilter = $.extend(true, {}, dynamicFilter);
            dynamicFilter = bizagi.clone(dynamicFilter);
        }

        var fullFilter = [];
        //Add original filter
        $.each(self.initialFilter, function (key, value) {
            fullFilter.push(value);
        })
        //var baseXPath = "CAFRequest.AssetInfo.";
        //Add dynamic filter
        $.each(dynamicFilter, function (key, value) {
            //Verificar que no haya sido agregado previamente
            var ifExist = false;
            for (var ind = 0; ind < fullFilter.length; ind++)
                if (fullFilter[ind].xpath == value.xpath)
                { ifExist = true; break; }
            //Luego de verificarlo ahi si agregarlo
            if (!ifExist) {
                value.xpath = value.xpath;
                fullFilter.push(value);
            }
        })
        var fullParams = $.extend(true, {}, params);

        fullParams.filter = JSON.stringify(fullFilter);
        return fullParams;
    },
    /*Transfor response, eg. Hide columns */
    postProcessData: function (data) {
        var self = this;
        return self.helper.hideCasesColumn(data, "CAFRequest.CAFStatus.StatusID");
    },
    /* This method adds custom functions used by the template in order to resolve information */
    addCustomHelperFunctions: function (data) {
        return $.extend(data, {
            showButtonA: function (row, actionName) {
                var show = true;
                return show;
            }
        });
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;

        var defer = new $.Deferred();
        self.uniqueId = params.title.replaceAll(' ', "__");
        // Hide the Dummy Webpart loading div
        if ($(params.canvas).find('#onLoadDiv')) {
            $(params.canvas).find('#onLoadDiv').remove();
        }
        var cookieInfo = bizagi.cookie(self.uniqueId)
        if (cookieInfo) {
            params.collapsed = bizagi.util.parseBoolean(cookieInfo);
        }
        else {
            params.collapsed = (typeof params.collapsed != "undefined") ? bizagi.util.parseBoolean(params.collapsed) : false;
        }

        if (self.content && !params.collapsed)
            var $loadingDiv = $("<div class='bz-wp-querycases-header' id='loadingDiv'><img src='/_layouts/proxy/jquery/webparts/desktop/sharepoint/querycases/images/loading.gif' alt='loading..' /><label>" + params.title + "</label></div>").hide().appendTo($(self.content[0])).show("slow");

        // Set webpart properties
        params.view = params.view || "grid";
        //params.collapsed = (typeof params.collapsed != "undefined") ? bizagi.util.parseBoolean(params.collapsed) : false;
        params.title = params.title || "Title";
        params.showViewToggler = (typeof params.showViewToggler != "undefined") ? bizagi.util.parseBoolean(params.showViewToggler) : true;
        params.defaultOrder = params.defaultOrder || "";

        // Parse actions
        if (typeof (params.actions) == "object") {
            params.actions = params.actions;
        } else {
            try {
                params.actions = JSON.parse(params.actions);
            } catch (e) {
                params.actions = [];
            }
        }
        //Add dynamic Filter:
        params = self.addDynamicFilter(params);

        var template = self.getTemplate("querycases");
        var content = self.content = $.tmpl(template, params);
        var view = self.view = $(".bz-wp-querycases-content", content);
        if (params.collapsed == false) {
            $.when(
                self.fetchData(params)
            ).done(function (data) {

                // Normalize data

                self.data = data = self.helper.transformCasesInfo({
                    data: data,
                    imageColumn: params.imageColumn
                });
                self.data = data = self.addCustomHelperFunctions(data);
                data.pageSize = params.pageSize;
                data.pageList = params.pageList;
                $.when(self.postProcessData(data, params.actions, params.view))
                .done(function (data) {
                    self.data = data;

                    //To filter rows in case of Draft or Pending Approval
                    //self.data.rows=self.filterRows(data.rows,params.filter,params.title);

                    // To render content
                    if (params.view == "grid") self.renderGrid(view, params, data);
                    if (params.view == "thumbnails") self.renderThumbnails(view, params, data);

                    // Resolve deferred
                    defer.resolve(content);
                    // Intermediate Loading Div Hide
                    if (self.content && !params.collapsed && typeof (loadingDiv) != 'undefined')
                        $loadingDiv.remove();

                    // For more than 14 pages shows the current item at the end of the visible list
                    if (self.data.page > 14) {
                        var minPage = self.data.page - 14;
                        $(".bz-wp-querycases-pager ul li:not(.pageArrow)", content).each(function (index) {
                            $(this).addClass("hidden");
                            if ($(this).data("page") > minPage && $(this).data("page") <= (minPage + 14)) $(this).removeClass("hidden");
                        });
                    }

                    var pageSizeCombo = $(".bz-wp-querycases-pager select", content);
                    content.delegate(".bz-wp-querycases-pager select", "change", function () {
                        self.params.pageSize = $(this).val() || 5;
                        self.refresh(self.params);
                    });

                    var arrowHeader = $(".bz-wp-querycases-header-arrow", content);
                    arrowHeader.removeClass("bz-state-collapsed");
                    arrowHeader.addClass("bz-state-expanded");
                });

            }).fail(function (msg) {
                var deferError = new $.Deferred();
                self.manageError(msg, deferError);

                deferError.done(function (value) {
                    self.endWaiting();
                    defer.resolve(value);                    
                });
            });
        } else {

            view.hide();
            defer.resolve(content);
            var arrowHeader = $(".bz-wp-querycases-header-arrow", content);
            arrowHeader.removeClass("bz-state-expanded");
            arrowHeader.addClass("bz-state-collapsed");
        }


        self.endWaiting();
        // Configure webpart habdlers
        self.configureHandlers(content);

        return defer.promise();
    },
    getWorkItems: function (idCase) {
        var self = this;
        var defer = new $.Deferred();
        // Loads case workitems
        $.when(self.dataService.getWorkitems({
            idCase: idCase,
            onlyUserWorkItems: true
        }))
        .done(function (data) {
            // Resolve deferred
            defer.resolve(data);
        }).fail(function (msg) {
            self.manageError(msg, defer);
        });
        return defer.promise();
    },
    getEvents: function (idCase) {
        var self = this;
        var defer = new $.Deferred();
        // Loads case workitems
        $.when(self.dataService.getCaseEvents({
            idCase: idCase,
            onlyUserWorkItems: true
        }))
        .done(function (data) {
            // Resolve deferred
            defer.resolve(data);
        }).fail(function (msg) {
            self.manageError(msg, defer);
        });
        return defer.promise();
    },

    /*
    *   Configure general handlers
    */
    configureHandlers: function (content) {
        var self = this;

        var view = $(".bz-wp-querycases-content", content);

        // Collapse / Expand content
        content.delegate(".bz-wp-querycases-header", "click", function () {

            self.params.collapsed = !self.params.collapsed;
            bizagi.cookie(self.uniqueId, self.params.collapsed);  // save in cookie            
            self.params.refreshData = false;
            self.refresh(self.params);
            // toggle style
            var $icon_span = $(this);
            //if (bizagi.cookie(self.uniqueId)) {
            if (self.params.collapsed) {
                $icon_span.removeClass("bz-state-collapsed");
                $icon_span.addClass("bz-state-expanded");
            } else {
                $icon_span.removeClass("bz-state-expanded");
                $icon_span.addClass("bz-state-collapsed");
            }
        });

        // Change view
        content.delegate(".bz-wp-querycases-header-views span", "click", function () {
            if (!self.params.collapsed) {
                if (this.parentElement.parentElement) {
                    this.parentElement.parentElement.click();
                }
            }
            self.params.view = $(this).data("view");
            self.params.refreshData = false;
            self.refresh(self.params);
        });
    },

    /*
    *   Queries the server to get data for the webpart
    */
    fetchData: function (params) {
        var self = this;
        var onlyUserCases = false;
        var active = true;

        if (self.isDraft(params.filter) || self.isPendingForMyApproval(params.title)) {
            onlyUserCases = true;
        }

        if (self.isRejectedCancelled(params.filter)) {
            active = false;
        }

        if (self.isApprovedCAFs(params.title)) {
            active = false;
        }
        var refreshData = params.refreshData;
        if (refreshData == false && self.data != null) {
            params.refreshData = true;
            if (params.page != null && self.data.page == params.page && self.data.pageSize == params.pageSize) return self.data;
        };
        var order = params.order || params.defaultOrder;


        return self.dataService.queryCases({
            // Base params
            idWorkflow: params.idWorkflow,
            taskState: params.taskState,
            idTask: params.idTask,
            filter: params.filter,
            outputxpath: params.outputxpath,
            outputInternalColumns: params.outputInternalColumns,

            // Filter by favorites  only when we are searching all processes and favorites
            onlyFavorites: false,

            // Sort and order parameters
            order: order,
            orderType: (params.orderType || "0"),
            page: (params.page || 1),
            pageSize: (params.pageSize || 10),
            pageList: (params.pageList || [10, 20, 50, 100]),
            onlyUserCases: onlyUserCases,
            active: active

        });
    },

    /*
    *   Render a grid view
    */
    renderGrid: function (view, params, data) {
        var self = this;
        var tempData = data;
        var tempDataCount = tempData.rows.length;
        var incrCount = 0;
        var title = self.title.toLowerCase();
        var columnSIndex;
        var columnAIndex;
        if (tempDataCount > 0) {
            data.columns.push({ displayName: "SCATcheck", name: "SCATcheck", visible: false });
            if (title == "approved cafs" || title == "pending approval" || title == "rejected and cancelled cafs") {

                var sessionHandlerURL = "Proxy/SessionHandler.ashx";
                var query = {};
                query["Action"] = "checkSCAT";
                var i = 0;
                columnSIndex = self.getColumnIndex(tempData, "CAFRequest.AssetInfo.SportsCategory.Description");
                columnAIndex = self.getColumnIndex(tempData, "CAFRequest.AssetInfo.AssetType.Description");
                jQuery.each(tempData.rows, function (i) {
                    if (tempData.rows[i][columnSIndex + 1] != "") {
                        query["scName"] = tempData.rows[i][columnSIndex + 1];

                    }
                    if (tempData.rows[i][columnAIndex + 1] != "") {
                        query["atName"] = tempData.rows[i][columnAIndex + 1];
                    }
                    $.ajax({
                        url: sessionHandlerURL,
                        data: query,
                        type: "GET",
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        dataType: "text",
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert(xhr.status + thrownError);
                        },
                        success: function () {
                            if (typeof (arguments[0]) == "string") {
                                tempData.rows[i].push(arguments[0]);
                                incrCount = incrCount + 1;
                            }

                            if (incrCount == tempDataCount) {
                                var content = self.helper.drawGridView({
                                    template: self.getTemplate("querycases-grid"),
                                    data: tempData,
                                    actions: params.actions,
                                    filters: self.initialFilter,
                                    title: self.title
                                });
                                content.appendTo(view);

                                // Enable handlers
                                self.configureGridHandlers(view);
                            }
                        }
                    });

                });
            }
            else {
                jQuery.each(tempData.rows, function (i) {
                    tempData.rows[i].push("True");
                });
                var content = self.helper.drawGridView({
                    template: self.getTemplate("querycases-grid"),
                    data: tempData,
                    actions: params.actions,
                    filters: self.initialFilter,
                    title: self.title
                });
                content.appendTo(view);

                // Enable handlers
                self.configureGridHandlers(view);
            }
        }
        else {
            var content = self.helper.drawGridView({
                template: self.getTemplate("querycases-grid"),
                data: tempData,
                actions: params.actions,
                filters: self.initialFilter,
                title: self.title
            });
            content.appendTo(view);

            // Enable handlers
            self.configureGridHandlers(view);

        }




    },

    /*
    *   Bind grid handlers in order to add behaviours
    */
    configureGridHandlers: function (view) {
        var self = this;

        // Order by a column
        view.delegate(".bz-wp-querycases-grid thead td", "click", function () {
            var column = $(this);

            self.params.orderType = (column.data("order-type") == 1 || column.data("order-type") == 'desc') ? 0 : 1;
            self.params.order = column.data("column-name");
            self.refresh(self.params);
        });

        // Bind action handlers
        view.delegate(".bz-wp-gridcases-actions-cell button", "click", function () {
            var button = $(this);
            var action = button.data("action");
            var idCase = button.data("case-id");
            var idWorkitem = button.data("workitem-id");

            self.executeAction({
                action: action,
                idCase: idCase,
                idWorkitem: idWorkitem
            });
        });

        // Change page
        view.delegate(".bz-wp-querycases-pager ul li:not(.pageArrow)", "click", function () {
            self.params.page = $(this).data("page");
            self.refresh(self.params);
        });


        // Next pager
        view.delegate(".bz-wp-querycases-pager ul .next", "click", function () {
            if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").last().data("page") < self.data.totalPages) {
                if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").first()) $(this.parentElement).find("li").not(".pageArrow").not(".hidden").first().addClass("hidden");
                if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").last().next()) $(this.parentElement).find("li").not(".pageArrow").not(".hidden").last().next().removeClass("hidden");
            }
        });

        // Previous pager
        view.delegate(".bz-wp-querycases-pager ul .prev", "click", function () {
            if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").first().data("page") > 1) {
                if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").first().prev()) $(this.parentElement).find("li").not(".pageArrow").not(".hidden").first().prev().removeClass("hidden");
                if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").last()) $(this.parentElement).find("li").not(".pageArrow").not(".hidden").last().addClass("hidden");
            }

        });

        // First Pager
        view.delegate(".bz-wp-querycases-pager ul .first", "click", function () {
            // Change page to fist one
            self.params.page = 1;
            self.refresh(self.params);
        });

        // Last Pager
        view.delegate(".bz-wp-querycases-pager ul .last", "click", function () {
            // Change page to fist one
            self.params.page = self.data.totalPages;
            self.refresh(self.params);

        });

        view.delegate(".bz-wp-gridcases-actions-cell-comments button", "click", function () {
            var button = $(this);
            var idCase = button.data("case-id");

            self.handleComments({
                idCase: idCase
            });

        });

    },

    getColumnIndex: function (data, xpath) {
        var self = data;
        var count = -1;
        var found = false;
        $.each(data.columns, function (i, column) {
            if (column.name == xpath && found == false) {
                found = true;
            }
            else {
                if (found == false) {
                    count = count + 1;
                }
            }
        });

        return count;
    },
    /*
    *   Render thumbnails view
    */
    renderThumbnails: function (view, params, data) {
        var self = this;
        var tempData = data;
        var tempDataCount = tempData.rows.length;
        var incrCount = 0;
        var title = self.title.toLowerCase();
        var columnSIndex;
        var columnAIndex;
        data.columns.push({ displayName: "SCATcheck", name: "SCATcheck", visible: false });
        if (title == "approved cafs" || title == "pending approval" || title == "rejected and cancelled cafs") {

            var sessionHandlerURL = "Proxy/SessionHandler.ashx";
            var query = {};
            query["Action"] = "checkSCAT";
            var i = 0;
            columnSIndex = self.getColumnIndex(tempData, "CAFRequest.AssetInfo.SportsCategory.Description");
            columnAIndex = self.getColumnIndex(tempData, "CAFRequest.AssetInfo.AssetType.Description");
            jQuery.each(tempData.rows, function (i) {
                if (tempData.rows[i][columnSIndex + 1] != "") {
                    query["scName"] = tempData.rows[i][columnSIndex + 1];

                }
                if (tempData.rows[i][columnAIndex + 1] != "") {
                    query["atName"] = tempData.rows[i][columnAIndex + 1];
                }

                $.ajax({
                    url: sessionHandlerURL,
                    data: query,
                    type: "GET",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    dataType: "text",
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(xhr.status + thrownError);
                    },
                    success: function () {
                        if (typeof (arguments[0]) == "string") {
                            tempData.rows[i].push(arguments[0]);
                            incrCount = incrCount + 1;
                        }

                        if (incrCount == tempDataCount) {
                            var content = self.helper.drawThumbnailsView({
                                template: self.getTemplate("querycases-thumbnail"),
                                data: tempData,
                                actions: params.actions,
                                filters: self.initialFilter,
                                title: self.title
                            });
                            content.appendTo(view);

                            // Enable handlers
                            self.configureThumbnailsHandlers(view);
                        }
                    }
                });

            });
        }
        else {
            jQuery.each(tempData.rows, function (i) {
                tempData.rows[i].push("True");
            });
            var content = self.helper.drawThumbnailsView({
                template: self.getTemplate("querycases-thumbnail"),
                data: tempData,
                actions: params.actions,
                filters: self.initialFilter,
                title: self.title
            });
            content.appendTo(view);

            // Enable handlers
            self.configureThumbnailsHandlers(view);
        }
    },

    /*
    *   Bind thumbnails handlers in order to add behaviours
    */
    configureThumbnailsHandlers: function (view) {
        var self = this;

        // Show actions on hover
        view.delegate(".bz-wp-querycases-thumbnails-item", "mouseover", function () {
            $(this).find(".bz-wp-querycases-thumbnails-item-actions").show();
        });
        // Hide actions on leave
        view.delegate(".bz-wp-querycases-thumbnails-item", "mouseout", function () {
            $(this).find(".bz-wp-querycases-thumbnails-item-actions").hide();
        });

        // Bind action handlers
        view.delegate(".bz-wp-querycases-thumbnails-item-actions button", "click", function () {
            var button = $(this);
            var action = button.data("action");
            var idCase = button.data("case-id");
            var idWorkitem = button.data("workitem-id");
            self.executeAction({
                action: action,
                idCase: idCase,
                idWorkitem: idWorkitem

            });
        });

        // Change page
        view.delegate(".bz-wp-querycases-pager ul li:not(.pageArrow)", "click", function () {
            self.params.page = $(this).data("page");
            self.refresh(self.params);
        });



        // Next pager
        view.delegate(".bz-wp-querycases-pager ul .next", "click", function () {
            if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").last().data("page") < self.data.totalPages) {
                if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").first()) $(this.parentElement).find("li").not(".pageArrow").not(".hidden").first().addClass("hidden");
                if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").last().next()) $(this.parentElement).find("li").not(".pageArrow").not(".hidden").last().next().removeClass("hidden");
            }


        });

        // Previous pager
        view.delegate(".bz-wp-querycases-pager ul .prev", "click", function () {
            if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").first().data("page") > 1) {
                if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").first().prev()) $(this.parentElement).find("li").not(".pageArrow").not(".hidden").first().prev().removeClass("hidden");
                if ($(this.parentElement).find("li").not(".pageArrow").not(".hidden").last()) $(this.parentElement).find("li").not(".pageArrow").not(".hidden").last().addClass("hidden");
            }

        });

        // First Pager
        view.delegate(".bz-wp-querycases-pager ul .first", "click", function () {
            // Change page to fist one
            self.params.page = 1;
            self.refresh(self.params);
        });





        // Last Pager
        view.delegate(".bz-wp-querycases-pager ul .last", "click", function () {
            // Change page to fist one
            self.params.page = self.data.totalPages;
            self.refresh(self.params);

        });


    },
    showTaskForm: function (params, taskIds) {
        var self = this;
        var idWorkItem = null;
        var idCase = params.idCase;
        //Serach the workitems:
        $.when(
                self.getWorkItems(idCase)
            ).done(function (data) {
                for (var i = 0; i < data.workItems.length; i++) {
                    for (var t = 0; t < taskIds.length; t++) {
                        var idTask = taskIds[t];
                        if (idTask == null || data.workItems[i].idTask == idTask) {
                            idWorkItem = data.workItems[i].idWorkItem;
                            break;
                        }
                    }
                }
                if (idWorkItem && idCase) {
                    //Post is not working, just make a redirection using the querystring
                }
            }
            )
    },
    showEventForm: function (params, idTask) {
        var self = this;
        var idWorkItem = null;
        var idCase = params.idCase;
        //Serach the workitems:
        $.when(
                self.getEvents(idCase)
            ).done(function (data) {
                for (var i = 0; i < data.events.length; i++) {
                    $.each(data.events[i], function (key, eventInfo) {
                        if (idTask == null || eventInfo.idTask == idTask) {
                            idWorkItem = eventInfo.idWorkitem;
                        }
                    }
                   )
                    if (idWorkItem != null) {
                        break;
                    }

                }
                if (idWorkItem && idCase) {
                    //Post is not working, just make a redirection using the querystring
                    //window.location = "RenderCAF.aspx?idCase=" + idCase + "&idWorkitem=" + idWorkItem;
                }
            }
            )
    },

    /*
    *   Executes a preconfigured action
    *   Any action used must be defined here in order to add behaviour
    */
    executeAction: function (params) {
        var self = this;
        if (params.action == "updateCAF") {
            self.showTaskForm(params, [62, 64, 66]);
        }
        else if (params.action == "cancelCAF") {
            self.showEventForm(params, 194);
        }
        else if (params.action == "deleteCAF") {
            self.showEventForm(params, 119);
        }

    }
});
