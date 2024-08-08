//------------------------------- Constants ----------------------------//
var ReportSetId     = 3;
var _analyticsProcess_ProcessIcon_Class = 'process-icon-class';
var _analyticsProcess_AjaxGatewayUrl = "../Ajax/AJAXGateway.aspx";
var _analyticsProcess_AjaxActionCode = "1616";

//----------------------------- Globals ---------------------------------//
var FirstSearch = true;
var bDiagramLoaded = 0;
var bCombosReady = 0;



jQuery(document).ready(function(){ 
    SLC_InitSlicerPanel();
    
    if(GetWfListSize() > 0){
        FillVersionCombo();
        ApplySelectmenuPlugin();
    }
    else{
        $("#divProcessFilterPanel *").hide();
    }

    bCombosReady = 1;
    
    //Refresh reports
    ExecuteNewSearch(); 
});

function GetWfListSize(){
    return $("#ddlWorkflows > option").length;
}

function ApplySelectmenuPlugin(){
    
    $("#ddlWorkflows").addClass(function() {
        var elementID;
        elementID = $(this).attr("id");
        return  elementID
    }).selectmenu("destroy");

    $("#ddlWorkflows").selectmenu({
        open: function() {
            $("ul." + $(this).attr("class")).css({
                visibility: "visible",
                display: "block",
                maxHeight: 250
            });
        },
        style: 'dropdown',
        icons: [ {find: "*", icon : _analyticsProcess_ProcessIcon_Class} ],
        width: 250,
        transferClasses: true,
        close: function(){
            $("ul." + $(this).attr("class")).css("display", "none");
        }
    });

    $("#ddlWfVersions").selectmenu("destroy");
    $("#ddlWfVersions").selectmenu({
        style: 'dropdown'
    });
}


//Fills Workflow version combo, according to the value in WFClass combo
function FillVersionCombo(){
    var objVersionsCombo= document.getElementById("ddlWfVersions");
    
    //Empty version combo.
    for (var i = objVersionsCombo.options.length; i >=0; i--){
        objVersionsCombo.options[i] = null; 
    }
    

    //Fill version combo:
    //The "HidWfVersions" hidden field contains a string with all workflows (idWfClass, idWorkflow, wfVersion) separated by the '|' char.
    //Include in combo only those wfs which have idWfClass equal to current WFClass combo selection
    var curIdWfClass= document.getElementById("ddlWorkflows").value; //WFClass combo
    var sAllWorkflows = document.getElementById("HidWfVersions").value;    
    
    var arrWorkflows= sAllWorkflows.split("|");
    for(var i= 0; i<arrWorkflows.length; ++i){
        var arrOneWorkflow = arrWorkflows[i].split(",");
        var idWfClass   = arrOneWorkflow[0];
        var idWorkflow  = arrOneWorkflow[1];
        var wfVersion   = arrOneWorkflow[2];
        
        if(idWfClass == curIdWfClass){            
            objVersionsCombo.options[objVersionsCombo.options.length] = new Option(wfVersion, idWorkflow); 
        }
    }
    ApplySelectmenuPlugin();
}

//This reloads search parameters and refresh all necessary reports
function ExecuteNewSearch(){

    if(bCombosReady == 0)
        return;
    
    ShowHideLoadingMsg(true);
    
    var oParams = GetReportParameters();

    //Get complete url    
    var url =   _analyticsProcess_AjaxGatewayUrl + "?action=" + _analyticsProcess_AjaxActionCode + "&ReportSetId=" + ReportSetId + "&date=" + new Date()
                + "&idWorkflow=" + oParams.workflowId
                + "&idWfClass=" + oParams.wfclassId
                + "&userFilters=" + oParams.userFiltersString;

    if(oParams.dateFrom != ""){
        url += "&dtmFrom=" + oParams.dateFrom
            + "&dtmTo=" + oParams.dateTo;
    }
    
    callAjaxForReports(url, UpdateProcessCharts);

    if(FirstSearch){
        FirstSearch = false;
        ShowCycleTime();
    }
}



function ShowCycleTime(){
    ShowTab(0);
}

function ShowProcessActivity(){
    ShowTab(1);
}

function ShowProcessActivityRanking(){
    ShowTab(2);
}

function ShowProcessDurationHistogram(){
    ShowTab(3);
}

function ShowPathAnalysis(){
    ShowTab(4);
}

function UpdateProcessCharts(oResult){
    ShowHideLoadingMsg(false);

    //Get result data
    var oJsonResult = oResult;
    if(oJsonResult.ERROR != null){
        window.alert("Error:\n" + oJsonResult.ERROR);
        return;
    }
    
    RenderReportFromName(oJsonResult, "His_Wfl_CycleTimeSummary", "divCycleTSummary");

    GetReportFromName(oJsonResult, "His_Wfl_AccompPie").width = 300; 
    GetReportFromName(oJsonResult, "His_Wfl_AccompPie").height = 250; 
    RenderReportFromName(oJsonResult, "His_Wfl_AccompPie", "divChartAccomplishment");


    GetReportFromName(oJsonResult, "His_Wfl_Duration").width = 300; 
    GetReportFromName(oJsonResult, "His_Wfl_Duration").height = 250; 
    RenderReportFromName(oJsonResult, "His_Wfl_Duration", "divChartDuration");


    GetReportFromName(oJsonResult, "His_Wfl_DurationHistogram").width = 800; 
    GetReportFromName(oJsonResult, "His_Wfl_DurationHistogram").height = 310; 
    RenderReportFromName(oJsonResult, "His_Wfl_DurationHistogram", "divChartHistogram");

    RenderReportFromName(oJsonResult, "His_Wfl_ActivitySummary", "divActivitySummary");

    GetReportFromName(oJsonResult, "His_Wfl_Activity").width = 270; 
    GetReportFromName(oJsonResult, "His_Wfl_Activity").height = 250; 
    RenderReportFromName(oJsonResult, "His_Wfl_Activity", "divChartActivity");

    GetReportFromName(oJsonResult, "His_Wfl_ActivationTrend").width = 470; 
    GetReportFromName(oJsonResult, "His_Wfl_ActivationTrend").height = 250; 
    RenderReportFromName(oJsonResult, "His_Wfl_ActivationTrend", "divChartTrend");

    GetReportFromName(oJsonResult, "His_Wfl_ActivationRank").width = 800; 
    GetReportFromName(oJsonResult, "His_Wfl_ActivationRank").height = 300; 
    RenderReportFromName(oJsonResult, "His_Wfl_ActivationRank", "divChartOpenRank");
    
    LoadSLDiagram();
}


/*-----------------------------------
    Utlis
------------------------------------*/

function ShowTab(tabIndex){
    var arrScreens = new Array();
    arrScreens[0] = document.getElementById("divCycleTime");
    arrScreens[1] = document.getElementById("divProcessActivity");
    arrScreens[2] = document.getElementById("divActivityRanking");
    arrScreens[3] = document.getElementById("divDurationHistogram");
    arrScreens[4] = document.getElementById("divPathAnalysis");
    
    var arrButtons = new Array();
    arrButtons[0] = document.getElementById("cellCycleTime");
    arrButtons[1] = document.getElementById("cellProcessActivity");
    arrButtons[2] = document.getElementById("cellActivityRanking");
    arrButtons[3] = document.getElementById("cellDurationHistogram");
    arrButtons[4] = document.getElementById("cellPathAnalysis");
    
    for(i = 0; i<5; ++i){
      arrScreens[i].style.display   = (i==tabIndex) ? "block" : "none";
      arrButtons[i].className       = (i==tabIndex) ? "Analysis_NavigationMenuItem_Selected" : "Analysis_NavigationMenuItem";
    }
    
    //Process Filter
    var divProcFilter = document.getElementById("divProcessFilterPanel");
    divProcFilter.style.display   = (tabIndex!=2) ? "block" : "none";

}

/*-----------------------------------
Silverlight methods
------------------------------------*/

function SLDiagramNotifyLoaded(){
    bDiagramLoaded = 1;
    LoadSLDiagram();
}

function SLDiagramNotifyChange(params) {
    ApplySelectmenuPlugin();
}

function SLDiagramDetailList(params) {
    var jSONParamms =  BAEval(" (" + params + ")");
    ChartClick(parseInt(jSONParamms.Report), parseInt(jSONParamms.Task), parseInt(jSONParamms.Measure));    
}

function LoadSLDiagram(){

    if(bDiagramLoaded == 1 /* Must wait until Silverlight is loaded before invoke Configure */)
    {
        var oParams = GetReportParameters();
        
        if(oParams.workflowId.length == 0)
            return;

        try{
            var slFrame = document.getElementById("iframeSilverlight");
	        slFrame.contentWindow.ConfigureForPathAnalytics(oParams.workflowId, oParams.dateFrom, oParams.dateTo, oParams.userFiltersString);
	        return 1;
        }catch(e){
            window.alert("Silverlight error:\n" + e.message);
	        return 0;
        }
    }
}
