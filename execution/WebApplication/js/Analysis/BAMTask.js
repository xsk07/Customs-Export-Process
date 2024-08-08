//------------------------------- Constants ----------------------------//
var ReportSetId     = 2;
var _bamTask_ProcessIcon_Class = 'process-icon-class';
var _bamTask_AjaxGatewayUrl = "../Ajax/AJAXGateway.aspx";
var _bamTask_AjaxActionCode = "1616";

//----------------------------- Globals ---------------------------------//
var FirstSearch = true;
var bDiagramLoaded = 0;



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
        icons: [ {find: "*", icon : _bamTask_ProcessIcon_Class} ],
        width: 250
    });
}

function ExecuteNewSearch(){
    ShowHideLoadingMsg(true);

    var oParams = GetReportParameters();

    //Get complete url    
    var url =   _bamTask_AjaxGatewayUrl + "?action=" + _bamTask_AjaxActionCode + "&ReportSetId=" + ReportSetId + "&date=" + new Date()
                + "&idWorkflow=" + oParams.workflowId
                + "&idWfClass=" + oParams.wfclassId
                + "&userFilters=" + oParams.userFiltersString;



    callAjaxForReports(url, UpdateProcessCharts);

    if(FirstSearch){
        FirstSearch = false;
        ShowWorkInProgress();
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
    
    GetReportFromName(oJsonResult, "Onl_Tsk_AccompPie").width = 412; 
    GetReportFromName(oJsonResult, "Onl_Tsk_AccompPie").height = 300; 
    RenderReportFromName(oJsonResult, "Onl_Tsk_AccompPie", "divChartAccomplishment");

    GetReportFromName(oJsonResult, "Onl_Tsk_OverdueHistogram").width = 580; 
    GetReportFromName(oJsonResult, "Onl_Tsk_OverdueHistogram").height = 300; 
    RenderReportFromName(oJsonResult, "Onl_Tsk_OverdueHistogram", "divChartHistogram");

    LoadSLDiagram();
}

/*-----------------------------------
Silverlight methods
------------------------------------*/

function SLDiagramDetailList(params) {
    var jSONParamms =  BAEval(" (" + params + ")");
    ChartClick(parseInt(jSONParamms.Report), parseInt(jSONParamms.Task), parseInt(jSONParamms.Measure));    
}

function SLDiagramNotifyLoaded(){
    bDiagramLoaded = 1;
    LoadSLDiagram();
}

function SLDiagramNotifyChange(params) {
    var jSONParamms = BAEval(" (" + params + ")");

    var oldWorkflowValue = document.getElementById("ddlWorkflows").value;
    
    try{
        document.getElementById("ddlWorkflows").value = parseInt(jSONParamms.WorkflowId);	    
        ApplySelectmenuPlugin();
    }
    catch (ex) {
        //It's possible that a click inside the diagram makes navigate to a forbidden workflow, generating the exception.
        document.getElementById("ddlWorkflows").value = oldWorkflowValue;
        LoadSLDiagram();
    }
}

function LoadSLDiagram(){

    if(bDiagramLoaded == 1 /* Must wait until Silverlight is loaded before invoke Configure */)
    {
        var oParams = GetReportParameters();
        
        if(oParams.workflowId.length == 0)
            return;

        try{
            var slFrame = document.getElementById("iframeSilverlight");
	        slFrame.contentWindow.ConfigureForBAM(oParams.workflowId, oParams.userFiltersString);
	        return 1;
        }catch(e){
            window.alert("Silverlight error:\n" + e.message);
	        return 0;
        }
    }
}


/*-----------------------------------
    Utlis
------------------------------------*/

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
}

