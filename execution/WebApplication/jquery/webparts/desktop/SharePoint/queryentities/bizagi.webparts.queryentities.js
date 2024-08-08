
/*
*   Name: BizAgi Workportal Query Entities Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.queryentities", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;
        // Call base
        this._super(workportalFacade, dataService, initialParams);
        self.initialParams = initialParams;
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
        // Set listeners
        this.subscribe("ui-bizagi-applyfilter-QEntities", function (e, params) {
            self.initialParams.dynamicFilter = params.filter;
            self.refresh(self.initialParams);
        });
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
              
        var fullFilter = [];
        //Add original filter
        $.each(self.initialFilter, function (key, value) {
            fullFilter.push(value);
        })
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

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        var defer = new $.Deferred();

        // Set webpart properties
        params.view = params.view || "thumbnails";
        params.collapsed = (typeof params.collapsed != "undefined") ? bizagi.util.parseBoolean(params.collapsed) : false;
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

        params = self.addDynamicFilter(params);

        var template = self.getTemplate("queryentities");
        //var template = self.getTemplate("webpart.queryentities.queryentities - grid");
        var content = self.content = $.tmpl(template, params);
        var view = self.view = $(".bz-wp-queryentities-content", content);

        //Add dynamic Filter:


        if (params.collapsed == false) {
            $.when(
                self.fetchData(params)
            ).done(function (data) {
                // To render content
                self.data = data = self.addCustomHelperFunctions(data); 
                if (params.view == "grid") self.renderGrid(view, params, data);
                if (params.view == "thumbnails") self.renderThumbnails(view, params, data);

                // Resolve deferred
                defer.resolve(content);

                // For more than 14 pages shows the current item at the end of the visible list
                if (self.data.page > 14) {
                    var minPage = self.data.page - 14;
                    $(".bz-wp-queryentities-pager ul li:not(.pageArrow)").each(function (index) {
                        $(this).addClass("hidden");
                        if ($(this).data("page") > minPage && $(this).data("page") <= (minPage + 14)) $(this).removeClass("hidden");
                    });
                }

            }).fail(function (msg) {
                self.manageError(msg, defer);
            }); 
        } else {
            view.hide();
            defer.resolve(content);
        }

        // Configure webpart habdlers
        self.configureHandlers(content);

        return defer.promise();
    },

    /*
    *   Configure general handlers
    */
    configureHandlers: function (content) {
        var self = this;

        // Collapse / Expand content
        content.delegate(".bz-wp-queryentities-header-arrow", "click", function () {
            self.params.collapsed = !self.params.collapsed;
            self.params.refreshData = false;
            self.refresh(self.params);
        });

        // Change view
        content.delegate(".bz-wp-queryentities-header-views span", "click", function () {
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
        var refreshData = params.refreshData;
        if (refreshData == false && self.data != null) {
            params.refreshData = true;
            // Next line commented in order to suit Query Entities
            //return self.data;
        };
        var order = params.order || params.defaultOrder;

        return self.dataService.queryEntities({
            // Base params
            idEntity: params.idEntity,
            filter: params.filter,
            outputxpath: params.outputxpath,

            // Sort and order parameters
            order: order,
            orderType: (params.orderType || "0"),
            page: (params.page || 1)
        });
    },

    /*
    *   Render a grid view
    */
    renderGrid: function (view, params, data) {
        var self = this;

        var content = self.helper.drawGridView({
            template: self.getTemplate("queryentities-grid"),
            data: data,
            actions: params.actions
        });

        content.appendTo(view);

        // Enable handlers
        self.configureGridHandlers(view);
    },

    /*
    *   Bind grid handlers in order to add behaviours
    */
    configureGridHandlers: function (view) {
        var self = this;

        // Order by a column
        view.delegate(".bz-wp-queryentities-grid thead td", "click", function () {
            var column = $(this);

            self.params.orderType = (column.data("order-type") == 1 || column.data("order-type") == 'desc') ? 0 : 1;
            self.params.order = column.data("column-name");
            self.refresh(self.params);
        });

        // Bind action handlers
        view.delegate(".bz-wp-gridcases-actions-cell button", "click", function () {
            /*
            var button = $(this);
            var action = button.data("action");
            var idEntity = button.data("entity-id");

            self.executeAction({
            action: action,
            idEntity: idEntity
            });
            */
            var button = $(this);
            var action = button.data("action");
            var idCase = button.data("case-id");

            self.executeAction({
                action: action,
                idCase: idCase
            });
        });

        // Change page
        view.delegate(".bz-wp-queryentities-pager ul li:not(.pageArrow)", "click", function () {
            self.params.page = $(this).data("page");
            self.refresh(self.params);
        });


        // Next pager
        view.delegate(".bz-wp-queryentities-pager ul .next", "click", function () {
            if ($(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):last").data("page") < self.data.totalPages) {
                if ($(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):first")) $(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):first").addClass("hidden");
                if ($(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):last").next()) $(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):last").next().removeClass("hidden");
            }


        });

        // Previous pager
        view.delegate(".bz-wp-queryentities-pager ul .prev", "click", function () {
            if ($(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):first").data("page") > 1) {
                if ($(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):first").prev()) $(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):first").prev().removeClass("hidden");
                if ($(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):last")) $(".bz-wp-queryentities-pager ul li:not(.pageArrow):not(.hidden):last").addClass("hidden");
            }

        });

        // First Pager
        view.delegate(".bz-wp-queryentities-pager ul .first", "click", function () {
            // Change page to fist one
            self.params.page = 1;
            self.refresh(self.params);
        });





        // Last Pager
        view.delegate(".bz-wp-queryentities-pager ul .last", "click", function () {
            // Change page to fist one
            self.params.page = self.data.totalPages;
            self.refresh(self.params);

        });










    },

    /*
    *   Render thumbnails view
    */
    renderThumbnails: function (view, params, data) {
        var self = this;
        var content = self.helper.drawThumbnailsView({
            template: self.getTemplate("queryentities-thumbnail"),
            data: data,
            imageLabelColumn: params.imageLabelColumn,
            actions: params.actions
        });

        content.appendTo(view);

        // Enable handlers
        self.configureThumbnailsHandlers(view);
    },

    /*
    *   Bind thumbnails handlers in order to add behaviours
    */
    configureThumbnailsHandlers: function (view) {
        var self = this;

        // Show actions on hover
        view.delegate(".bz-wp-queryentities-thumbnails-item", "mouseover", function () {
            $(this).find(".bz-wp-queryentities-thumbnails-item-actions").show();
        });
        // Hide actions on leave
        view.delegate(".bz-wp-queryentities-thumbnails-item", "mouseout", function () {
            $(this).find(".bz-wp-queryentities-thumbnails-item-actions").hide();
        });

        // Bind action handlers
        view.delegate(".bz-wp-queryentities-thumbnails-item-actions button", "click", function () {
            var button = $(this);
            var action = button.data("action");
            var idEntity = button.data("entity-id");

            self.executeAction({
                action: action,
                idEntity: idEntity
            });
        });

        // Change page
        view.delegate(".bz-wp-queryentities-pager ul li", "click", function () {
            self.params.page = $(this).data("page");
            self.refresh(self.params);
        });
    },

    /*
    *   Executes a preconfigured action
    *   Any action used must be defined here in order to add behaviour
    */
    executeAction: function (params) {
        alert("executing " + params.action + " : " + params.idEntity);
    }

});
