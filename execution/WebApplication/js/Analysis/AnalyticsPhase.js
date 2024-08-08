var ReportSetId = 5;
var FirstSearch = true;

jQuery(document).ready(function(){ SLC_InitSlicerPanel(); ExecuteNewSearch();});

//DEPL: - Fix to avoid problems with method ShowHideLoadingMsg when cancelling an iframe loading this page
// if the script is not defined yet
ShowHideLoadingMsg = ShowHideLoadingMsg || function() {};


function ExecuteNewSearch(){
	jQuery("#iframeTimeFilter").load(function() {

		ShowHideLoadingMsg(true);

		var oParams = GetReportParameters();

		var url = "../Ajax/AJAXGateway.aspx?action=1616&ReportSetId=" + ReportSetId
			+ "&idWorkflow=" + oParams.workflowId
				+ "&idWfClass=" + oParams.wfclassId
					+ "&userFilters=" + oParams.userFiltersString
						+ "&date=" + new Date();

		if (oParams.dateFrom != "") {
			url += "&dtmFrom=" + oParams.dateFrom
				+ "&dtmTo=" + oParams.dateTo;
		}

		callAjaxURL(url, UpdateProcessCharts);

		if (FirstSearch) {
			FirstSearch = false;
			ShowCycleTime();
		}
	});
}


function UpdateProcessCharts(oResult){
    ShowHideLoadingMsg(false);

    //Get result data
    var oJsonResult = BAEval(" (" + oResult + ")");
    if(oJsonResult.ERROR != null){
        window.alert("Error:\n" + oJsonResult.ERROR);
        return;
    }
    RenderReportFromName(oJsonResult, "His_Ph_CycleTimeSummary", "divSummary");
    RenderReportFromName(oJsonResult, "His_Ph_LevelServices", "divLevelServices");
}


function ShowCycleTime(){
    ShowTab(0);

}

/*-----------------------------------
    Utlis
------------------------------------*/

function ShowTab(tabIndex){
    var arrScreens = new Array();
    arrScreens[0] = document.getElementById("divCycleTime");
    
    var arrButtons = new Array();
    arrButtons[0] = document.getElementById("cellCycleTime");
    
    for(i = 0; i<1; ++i){
      arrScreens[i].style.display   = (i==tabIndex) ? "inline" : "none";
      arrButtons[i].className       = (i==tabIndex) ? "Analysis_NavigationMenuItem_Selected" : "Analysis_NavigationMenuItem";
    }
}



function EditPhases(){
    window.location = "./PhaseDefinition.aspx";
}

