bizagi.workportal.widgets.queries.definition.extend("bizagi.workportal.widgets.queries.defAT", {}, {
    showQueryFormPopup: function (arg) {
        var self = this;
        if (self.currentPopup === "queryform") {
            self.currentPopup = "";
        }
        bizagi.workportal.widgets.queries.definition.prototype.showQueryFormPopup.call(this, arg);
        $(".ui-dialog").addClass("no-close");
        recorder.showStopPanel();
    }
});
