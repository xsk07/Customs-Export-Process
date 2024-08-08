//------------------------------- Constants ----------------------------//
var ReportSetId     = 1;
var _bamProcess_ProcessIcon_Class = 'process-icon-class';
var _bamProcess_AjaxGatewayUrl = "../Ajax/AJAXGateway.aspx";
var _bamProcess_AjaxActionCode = "1616";

//----------------------------- Globals ---------------------------------//
var FirstSearch = true;



jQuery(document).ready(function() {
    SLC_InitSlicerPanel();

    if(GetWfListSize() > 0){
        ApplySelectmenuPlugin();
    }
    else{
        $("#divProcessFilterPanel *").hide();
    }
    
    //Refresh reports
    ExecuteNewSearch();
});

function GetWfListSize(){
    return $("#ddlWorkflows > option").length;
}

function ApplySelectmenuPlugin(){
    $("#ddlWorkflows").selectmenu("destroy");
    $("#ddlWorkflows").selectmenu({
        style: 'dropdown',
        icons: [ {find: "*", icon : _bamProcess_ProcessIcon_Class} ],
        width: 250
    });
}


function ExecuteNewSearch(){
    ShowHideLoadingMsg(true);
    
    var oParams = GetReportParameters();

    //Get complete url    
    var url =   _bamProcess_AjaxGatewayUrl + "?action=" + _bamProcess_AjaxActionCode + "&ReportSetId=" + ReportSetId + "&date=" + new Date()
                + "&idWorkflow=" + oParams.workflowId
                + "&idWfClass=" + oParams.wfclassId
                + "&userFilters=" + oParams.userFiltersString;

    if(oParams.dateFrom != ""){
        url +=     "&dtFrom=" + oParams.dateFrom
                +   "&dtTo=" + oParams.dateTo
    }
    
    callAjaxForReports(url, UpdateProcessCharts);

    if(FirstSearch){
        FirstSearch = false;
        ShowLoadAnalysis();        
    }
}


function ShowWorkInProgress(){
    ShowTab(0);    
}

function ShowLoadAnalysis(){
    ShowTab(1);
}

function UpdateProcessCharts(oResult){
    ShowHideLoadingMsg(false);

    //Get result data
    var oJsonResult = oResult;
    if(oJsonResult.ERROR != null){
        window.alert("Error:\n" + oJsonResult.ERROR);
        return;
    }

    GetReportFromName(oJsonResult, "Onl_Wfl_AccompPie").width = 412; 
    GetReportFromName(oJsonResult, "Onl_Wfl_AccompPie").height = 300; 
    RenderReportFromName(oJsonResult, "Onl_Wfl_AccompPie", "divChartAccomplishment");

    GetReportFromName(oJsonResult, "Onl_Wfl_OverdueHistogram").width = 580; 
    GetReportFromName(oJsonResult, "Onl_Wfl_OverdueHistogram").height = 300; 
    RenderReportFromName(oJsonResult, "Onl_Wfl_OverdueHistogram", "divChartHistogram");

    GetReportFromName(oJsonResult, "Onl_Wfl_GeneralAccomplishment").width = 800; 
    GetReportFromName(oJsonResult, "Onl_Wfl_GeneralAccomplishment").height = 400; 
    RenderReportFromName(oJsonResult, "Onl_Wfl_GeneralAccomplishment", "divChartLoadAnalysis");
}


function ShowTab(tabIndex){
    var arrScreens = new Array();
    arrScreens[0] = document.getElementById("divWorkInProgress");
    arrScreens[1] = document.getElementById("divLoadAnalysis");
    
    var arrButtons = new Array();
    arrButtons[0] = document.getElementById("cellWorkInProgress");
    arrButtons[1] = document.getElementById("cellLoadAnalysis");
    
    for(i = 0; i<2; ++i){
      arrScreens[i].style.display   = (i==tabIndex) ? "inline" : "none";
      arrButtons[i].className       = (i==tabIndex) ? "Analysis_NavigationMenuItem_Selected" : "Analysis_NavigationMenuItem";
    }
    
    //Process Filter
    var divProcFilter = document.getElementById("panelFilters");
    divProcFilter.style.display   = (tabIndex==0) ? "block" : "none";
    
}

