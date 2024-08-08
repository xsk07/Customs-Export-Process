var REPORT_FILTER_DETAIL_URL = "FilterWindowNew.aspx";
var REPORT_FILTER_DETAIL_DIALOG_WIDTH = 660;
var REPORT_FILTER_DETAIL_DIALOG_HEIGHT = 455;


function GetUrlForIFrame(wfId, wfcId, repSetId){
    var sUrl = REPORT_FILTER_DETAIL_URL + "?"
                + "idWorkflow=" + wfId 
                + "&idWfClass=" + wfcId
                + "&ReportSetId=" + repSetId;
                
    return sUrl;
}

/*
*   Opens the dialog
*/
function openFilterDetail(wfId, wfcId, repSetId, data) {

    var arrExistingOpenDialogs = jQuery(".filterDlgFrame");

    if (arrExistingOpenDialogs.length > 0)
        return;

    var alreadyOpen = false;

    var doc = this.ownerDocument;

    var filterDialog = jQuery('<div></div>')
        .appendTo("body", doc);
    
    var filterDialogFrame = jQuery('<iframe class=\"filterDlgFrame\"></iframe>')
         .css({width: "100%", height: "100%"})
         //.css("display", "none") 
         .attr("marginWidth", 0) 
         .attr("marginHeight", 0) 
         .attr("frameBorder", 0) 
         .attr("scrolling", "auto") 
         .attr("src", GetUrlForIFrame(wfId, wfcId, repSetId)) 
         .css("display", "none")
         .appendTo(filterDialog);
    
    
    
    
    // Load content
    filterDialogFrame.load(function () {

        var nDimensions = jQuery(filterDialogFrame).callInside(function () { return jQuery(".ui-analysis-report-filter-detail-selectDimension")[0].options.length; });

        if (nDimensions == 0) {
            ShowMessageBox(jQuery("#hidMsgNoDimensions").val());
            jQuery(filterDialogFrame).remove();
            return;
        }

        filterDialogFrame.css("display", "block");

        // Run plugin inside the iframe
        if (data) {
            filterDialogFrame.callInside(function () {
                jQuery(".ui-analysis-report-filter-detail").setAnalysisReportFilter(args.reportFilter);
            }
            , { reportFilter: data });
        }
        filterDialogFrame.callInside(function () {
            jQuery(".ui-analysis-report-filter-detail").runAnalysisReportFilterPlugin();
        });
        if (alreadyOpen) {
            return;
        }
        alreadyOpen = true;

        //Define button callbacks
        function btnSave() {
            var reportFilters = jQuery(".filterDlgFrame").callInside(function () {
                return jQuery(".ui-analysis-report-filter-detail").getAnalysisReportFilter();
            });

            if (reportFilters.values.length == 0)
                return;

            SaveFilter(reportFilters);
            filterDialog.dialog("close");
        }

        function btnCancel() {
            filterDialog.dialog("close");
        }

        //Define buttons
        var sButtons = "  {\"" + jQuery("#hidMsgOK").val() + "\": function(){ btnSave(); } "
                        + ",  \"" + jQuery("#hidMsgCancel").val() + "\": function(){ btnCancel(); } }";

        var oButtons = eval("(" + sButtons + ")");

        // Open dialog
        filterDialog.dialog({
            width: REPORT_FILTER_DETAIL_DIALOG_WIDTH,
            height: REPORT_FILTER_DETAIL_DIALOG_HEIGHT,
            modal: true,
            resizable: false,
            buttons: oButtons,
            close: function (ev, ui) {
                filterDialog.dialog('destroy');
                filterDialog.detach();
            }
        });
    });
}


function SaveFilter(reportFilters){
    parent.SaveFilter(reportFilters);
}

