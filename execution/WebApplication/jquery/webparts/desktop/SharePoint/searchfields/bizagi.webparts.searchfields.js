bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.searchfields", {}, {
    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        var template = self.workportalFacade.getTemplate("searchfields");

        return $.tmpl(template, { outputxpath: params.outputxpath, filter: params.filter });
    },

    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {
        var self = this;
        var content = self.getContent();

        $("#ApplyFiltersButton", content).bind("click", function () {
            var params = {};
            var filter = [];

            if ($(this).attr("data-filter")) {
                filter = $(this).attr("data-filter");
                filter = eval(filter);
            }

            $(".filters").each(function () {
                if ($(this).val()) {
                    var operation = $(this).data("operation") || "LIKE";
                    filter.push({ "xpath": $(this).data("xpath"), "operation": operation, "value": $(this).val() });
                }
            });

            //must be sent as strings not like JSON objects
            params.filter = filter;
            // Publish the event so any other webpart could react to that
            self.publish("ui-bizagi-applyfilter-QEntities", params);
        });

        $("#ClearFiltersButton", content).bind("click", function () {
            var params = {};
            $(".filters").val("");

            //            var outputxpath = "['RadNumber', 'CasCreationDate', 'CasSolutionDate']";

            //            if ($(this).attr("data-outputxpath"))
            //                outputxpath = $(this).attr("data-outputxpath");

            if ($(this).attr("data-filter")) {
                params.filter = $(this).attr("data-filter");
            }

            //must be sent as strings not like JSON objects
            //            params.outputxpath = outputxpath;

            // Publish the event so any other webpart could react to that
            self.publish("ui-bizagi-applyfilter-QEntities", params);
        });

        self.endWaiting();
    }
});
