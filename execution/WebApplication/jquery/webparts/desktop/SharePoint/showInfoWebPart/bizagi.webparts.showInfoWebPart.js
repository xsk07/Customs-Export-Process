bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.showInfo", {}, {

    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        var defer = new $.Deferred();
        $.when(  
                self.fetchData(params)
            ).done(function (data) {

                var template = self.workportalFacade.getTemplate("showInfo");
                var content = $.tmpl(template, data);

                // Resolve deferred
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
        //var def = new $.Deferred();
        self.endWaiting();
    },
    /*
    *   Queries the server to get data for the webpart
    */
    fetchData: function (params) {
        var self = this;
        return self.dataService.getAssetInfo(params);
    }
});
