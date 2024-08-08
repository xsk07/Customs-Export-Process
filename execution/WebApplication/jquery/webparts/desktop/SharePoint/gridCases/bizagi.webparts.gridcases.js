
/*
*   Name: BizAgi Workportal GridCases Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.gridcases", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners
        //this.subscribe("ui-bizagi-show-cases", function (e, params) { self.showCases(params); });
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        var defer = new $.Deferred();
        var template = self.workportalFacade.getTemplate("gridcases");

        // Get data
        $.when(self.dataService.getCustomizedColumnsData({
            idWorkflow: params.idWorkflow,
            taskState: "all",
            // Filter by favorites  only when we are searching all processes and favorites
            onlyFavorites: false,
            // Sort and order parameters
            order: params.order,
            orderFieldName: params.orderFieldName,
            orderType: params.orderType,
            page: params.page || 1,
            pageSize: 20
        }))
        .done(function (data) {

            // add data for pager
            data = self.CompleteData(data);
            // Render content
            var content = self.content = $.tmpl(template, data.cases, {
                setFormat: self.formatValue,
                isArray: self.isArray,
                formatCategories: self.formatCategories,
                isDate: self.isDate
            });

            defer.resolve(content);
        }).fail(function (msg) {
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

        // Bind processes click
        $(".ui-bizagi-wp-app-inbox-activity-name", content).click(function () {

            params.idWorkitem = $(this).attr("data-workitem-id");
            params.idCase = $(this).attr("data-case-id");
            params.workportal = params.workportal;
            if (bizagi.sharepointContext) {
                self.helper.displayWebPartPopUpinIFrame("renderComplete", params, function (e, params) { self.showCases(self.params); });
            } else {
                self.helper.displayWebPartPopUp("renderComplete", params, function (e, params) { self.showCases(self.params); });
            }

        });

        // Order by a column
        $("#ui-bizagi-wp-app-inbox-grid-cases thead td", content).click(function () {
            var column = $(this);

            self.params.orderType = (column.data("order-type") == 1 || column.data("order-type") == 'desc') ? 0 : 1;
            self.params.order = column.data("order");
            self.params.orderFieldName = column.data("orderfieldname");
            self.refresh(self.params);
        });

        // Change page
        $(".bz-wp-gridcases-pager ul li:not(.pageArrow)").click(function () {
            self.params.page = $(this).data("page");
            self.refresh(self.params);
        });


        // Next pager
        $(".bz-wp-gridcases-pager ul .next").click(function () {
            if ($(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):last").data("page") < self.data.totalPages) {
                if ($(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):first")) $(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):first").addClass("hidden");
                if ($(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):last").next()) $(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):last").next().removeClass("hidden");
            }


        });

        // Previous pager
        $(".bz-wp-gridcases-pager ul .prev").click(function () {
            if ($(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):first").data("page") > 1) {
                if ($(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):first").prev()) $(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):first").prev().removeClass("hidden");
                if ($(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):last")) $(".bz-wp-gridcases-pager ul li:not(.pageArrow):not(.hidden):last").addClass("hidden");
            }

        });

        // First Pager
        $(".bz-wp-gridcases-pager ul .first").click(function () {
            // Change page to fist one
            self.params.page = 1;
            self.refresh(self.params);
        });





        // Last Pager
        $(".bz-wp-gridcases-pager ul .last").click(function () {
            // Change page to fist one
            self.params.page = self.data.totalPages;
            self.refresh(self.params);

        });

        // Change page
        content.delegate(".bz-wp-gridcases-pager ul li", "click", function () {
            self.params.page = $(this).data("page");
            self.refresh(self.params);
        });

        self.endWaiting();
    },


    /*
    *   Listener to ui-bizagi-show-cases event
    */
    showCases: function (params) {
        this.refresh(params);
    },

    /*
    *   Misc method to format cell values
    */
    formatRequest: function (value) {
        return value;
    },

    /**
    * Misc method to render categories
    */
    formatCategories: function (value) {
        return value;

    },

    isArray: function (value) {
        if (typeof (value) == 'object') {
            return true;
        } else {
            return false;
        }
    },

    isDate: function (value) {
        var state = false;
        try {
            var date = new Date(value);
            if (date.getYear() > 0) {
                state = true;
            }
        } catch (e) {
            state = false;
        }

        return state;
    },
    CompleteData: function (data) {
        // Add paging stuff
        var pages = [];
        for (var i = 1; i <= data.cases.totalPages; i++) {
            pages.push({
                number: i,
                active: (i == data.cases.page)
            });
        }

        $.extend(data.cases, {
            pages: pages
        });


        return data;
    }

});
