//------------------------------- Constants ----------------------------//
var ReportSetId     = 4;
var _analyticsTask_ProcessIcon_Class = 'process-icon-class';

//----------------------------- Globals ---------------------------------//

var bDiagramLoaded = false;
var bTimeFilterLoaded = false;
var bCombosReady = 0;

jQuery(document).ready(function(){ 
    
    SLC_InitSlicerPanel(); 
    
    if(GetWfListSize() > 0){
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
    $("#ddlWorkflows").selectmenu("destroy");
    $("#ddlWorkflows").selectmenu({
        style: 'dropdown',
        icons: [ {find: "*", icon : _analyticsTask_ProcessIcon_Class} ], 
        width : 270
    });
}

function ExecuteNewSearch(){
    bTimeFilterLoaded = true;
    ShowCycleTime();
    LoadSLDiagram();
}



function ShowCycleTime(){
    ShowTab(0);
}


/*---------------------------------------------
Methods to be called inside the Silverlight control
---------------------------------------------*/

function SLDiagramDetailList(params) {
    var jSONParamms =  BAEval(" (" + params + ")");
    ChartClick(parseInt(jSONParamms.Report), parseInt(jSONParamms.Task), parseInt(jSONParamms.Measure));    
}

function SLDiagramNotifyLoaded(){
    bDiagramLoaded = true;
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

    if(bDiagramLoaded && bTimeFilterLoaded && bCombosReady /* Must wait for time filter and Silverlight ready signals before invoke Configure */)
    {
        var oParams = GetReportParameters();
        
        if(oParams.workflowId.length == 0)
            return 0;
        
        try{
            var slFrame = document.getElementById("iframeSilverlight");
            slFrame.contentWindow.ConfigureForAnalytics(oParams.workflowId, oParams.dateFrom, oParams.dateTo, oParams.userFiltersString);
            return 1;
        }catch(e){
            window.alert("Silverlight error:\n" + e.message);
        }
    }
    return 0;
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

