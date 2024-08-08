
var _reports_AjaxGatewayUrl = "../Ajax/AJAXGateway.aspx";
var _reports_ReportTemplatesDir = "./report-plugin-templates";
var _reports_FlashChartDir = "../../Charts";

var _reports_ExcelExportUrl = "./ExcelExport.aspx";
var _reports_PluginExcelExportUrl = "./ExcelExport.aspx";
var _reports_SaveQueryUrl = "./SaveQuery.aspx";
var _reports_CaseListUrl = "./CaseListWindow.aspx";


//--------------------- Call Ajax ---------------------//

function callAjaxForReports(url, successFunction) {
    $.ajax({
      dataType: "json",
      url: url,
      success: successFunction,
      error : function(jqXHR , sType, objEx){ 
      
                ShowHideLoadingMsg(false);
                
                if(sType == "parsererror")
                    window.alert("Sesion is finished. Login again."); 
                else
                    window.alert("Ajax failure: " +  sType); 
              }
    });
}

function callAjaxMethod(url, successFunction){ 
    $.ajax({
      url: url,
      success: successFunction,
      error : function(errData){ window.alert("Ajax failure: " +  errData); }
    });
}

//--------------------------- Evaluate and show exception message when an error occurs ------------------------//

function BAEval(oValue){
    try{
        return eval(oValue);
    }
    catch(ex){
        window.alert("ERROR evaluating JSON string:\n " + oValue);
        return null;
    }
}

//---------------------------------------------------------------------------------------//
//Converts a date string (with server-given format BA_DATE_FORMAT_MASK) into a "YYYY/MM/DD 00:00:00" formatted string 
//---------------------------------------------------------------------------------------//
function FormatDateString_To_BADateString(sDate){

    //Use server-given date format to parse the date entered in the browser
    var dtmDate = getDateFromFormat(sDate, BA_DATE_FORMAT_MASK);
    var iYear, iMonth, iDate = "";
    
    if (dtmDate == 0) {
        var now = new Date;
        iYear = now.getFullYear().toString();
        // now.getMonth returns months from 0-11, you must add 1 in order to get the real month. 
        iMonth = (now.getMonth()+1).toString();
        iDate = now.getDate().toString();
        // check month and day
        iMonth = (iMonth.length == 1)? "0"+iMonth:iMonth;
        iDate = (iDate.length == 1)?"0"+iDate:iDate;
    } else {
        //Build date string again using a specific format
        iYear = dtmDate.getFullYear().toString() || "";
        iMonth = dtmDate.getMonth() < 9 ? "0" + (1 + dtmDate.getMonth()) : (1 + dtmDate.getMonth()).toString();
        iDate = dtmDate.getDate() < 10 ? "0" + dtmDate.getDate() : dtmDate.getDate().toString();
    }
    
            
    var sFinaldateString = "" + iYear + "/" + iMonth  +  "/" + iDate + " 00:00:00";
    return sFinaldateString;
}


//------------------------------------------------------------------------------------------- 
//Shows a table report in an Excel spreadsheet using "window.open". 
//The report data must be gennerated again in the server, then shown in Excel format 
//-------------------------------------------------------------------------------------------
function SendReportToExcel(sReportName){
    
    var oParams = GetReportParameters();
    
    var url = _reports_ExcelExportUrl + "?ReportId=" + sReportName 
            + "&idWorkflow=" + oParams.workflowId
            + "&idWfClass=" + oParams.wfclassId
            + "&userFilters=" + oParams.userFiltersString
            + "&date=" + new Date()
            + "&idStopwatch=" + oParams.stopwatchId
            + "&idCounter=" + oParams.counterId;


    if(oParams.dateFrom != ""){
        url +=     "&dtmFrom=" + oParams.dateFrom
                +   "&dtmTo=" + oParams.dateTo
    }

    window.open(url, "Bizagi");
}

//---------- Shows or hide a "Loading reports..." message ------------------//
function ShowHideLoadingMsg(bShow){
    var oLoadingDiv = document.getElementById('divLoadingMessage');
    oLoadingDiv.style.display= bShow ? "block" : "none";        
}

//------ Looks for a report inside a given collection, then renders it inside the given div -------//
function RenderReportFromName(oReportResult, sReportName, sContainerDiv){
    for(var iReport= 0; iReport < oReportResult.Results.length; ++iReport){
        var oReport = oReportResult.Results[iReport];  
        if(oReport.ResultName == sReportName)
            RenderReport(oReport, sContainerDiv);
    }
}

//---------- Searchs the given report collection for a specific report id------------------//
function GetReportFromName(oReportResult, sReportName, sContainerDiv){
    for(var iReport= 0; iReport < oReportResult.Results.length; ++iReport){
        var oReport = oReportResult.Results[iReport];  
        if(oReport.ResultName == sReportName)
            return oReport;
    }
}

//---------- Renders a report object inside a div element------------------//
function RenderReport(jSONReportResult, htmlDivId){

    if(jSONReportResult.ResultType == "fusionchart"){
        
        DrawFusionChart(htmlDivId + "_fc", jSONReportResult.xml, jSONReportResult.file, htmlDivId, jSONReportResult.width, jSONReportResult.height);
    }
    else if(jSONReportResult.ResultType == "plugin"){
        ApplyReportPlugin(jSONReportResult, htmlDivId);
    }
    else{ // "html" result type
        var oDiv = document.getElementById(htmlDivId);
        oDiv.innerHTML = jSONReportResult.html;
    }    
}

//---------- Applies a plugin to display a report -------------------//
function ApplyReportPlugin(jSONReportResult, htmlDivId){

    //Plugin configuration
    var pluginOptions = { 
            ReportResult :          jSONReportResult,
            ReportTemplatesDir :    _reports_ReportTemplatesDir,
            FlashChartDir :         _reports_FlashChartDir,
            ReportId :              jSONReportResult.ResultId,
            ReportName :            jSONReportResult.ResultName,
            GlobalParameters :      GetReportParameters(),
            HoursDay :              TryParseInt($("#hidHoursDay").val(), 8)
        };   


    //Apply the correct plugin
    switch(jSONReportResult.ResultName){

        case "His_Sw_CycleTimeSummary":
            $("#" + htmlDivId).BizRep_Sw_CycleTimeSummary(pluginOptions);
            break;

        case "His_Sw_LevelOfService":
            $("#" + htmlDivId).BizRep_Sw_LevelOfService(pluginOptions);
            break;

        case "His_Sw_DurationTrend_Single":
            $("#" + htmlDivId).BizRep_Sw_DurationTrend_Single(pluginOptions);
            break;

        case "His_Sw_ActivationClosingTrend_Single":
            $("#" + htmlDivId).BizRep_Sw_ActivationAndClosingTrend_Single(pluginOptions);
            break;

        case "His_Sw_DurationHistogram_Single":
            $("#" + htmlDivId).BizRep_Sw_DurationHistogram_Single(pluginOptions);
            break;

        case "His_Sw_CycleTimeSummary_Single":
            $("#" + htmlDivId).BizRep_Sw_CycleTimeSummary_Single(pluginOptions);
            break;

        case "His_Sw_LevelOfService_Single":
            $("#" + htmlDivId).BizRep_Sw_LevelOfService_Single(pluginOptions);
            break;

        case "His_Count_Summary":
            $("#" + htmlDivId).BizRep_Count_Summary(pluginOptions);
            break;

        case "His_Count_Summary_Single":
            $("#" + htmlDivId).BizRep_Count_Summary_Single(pluginOptions);
            break;

        case "His_Count_Instances":
            $("#" + htmlDivId).BizRep_Count_Instances(pluginOptions);
            break;

        case "His_Count_ActivationTrend_Single":
            $("#" + htmlDivId).BizRep_Count_ActivationTrend_Single(pluginOptions);
            break;

        case "His_Count_Absolute_Summary":
            $("#" + htmlDivId).BizRep_AbsoluteCount_Summary(pluginOptions);
            break;
        
        case "His_Count_Absolute_Instances":
            $("#" + htmlDivId).BizRep_AbsoluteCount_Instances(pluginOptions);
            break;

        case "His_Count_Absolute_Summary_Single":
            $("#" + htmlDivId).BizRep_AbsoluteCount_Summary_Single(pluginOptions);
            break;

        case "His_Count_Absolute_ActivationTrend_Single":
            $("#" + htmlDivId).BizRep_AbsoluteCount_ActivationTrend_Single(pluginOptions);
            break;

        case "Onl_Res_WorkInProgress":
            $("#" + htmlDivId).BizRep_Onl_Res_WorkInProgress(pluginOptions);
            break;

        case "Onl_Res_WorkInProgressByUser":
            $("#" + htmlDivId).BizRep_Onl_Res_WorkInProgressByUser(pluginOptions);
            break;
            
        default:
            break;
    }    
}

//---------- Renders a chart based on FusionCharts Flash Object ------------------//
function DrawFusionChart(chartId, chartXml, chartFile, divWhere, width, height){
	var aChart = new FusionCharts(chartFile, 'FusionCharts_' + chartId, width, height, '0', '0'); 
	aChart.setDataXML(chartXml);
	aChart.render(divWhere);
}


//---------- Gets an object containing report status ------------------//
function GetReportParameters(){

    var oParameters         = new Object();

    oParameters.wfclassId       = -1;
    oParameters.workflowId      = -1;
    oParameters.counterId       = -1;
    oParameters.stopwatchId     = -1;
    oParameters.dateFrom        = "";
    oParameters.dateTo          = "";
    oParameters.taskId          = -1;
    
    
    //-------- Process combo based reportsets:
    //Find WorkflowID and WFClassId, by checking controls ddlWorkflows and/or ddlWfVersions.
    var wfVersions = document.getElementById("ddlWfVersions");
    var workflows = document.getElementById("ddlWorkflows");
    
    if(wfVersions!= null || workflows != null){

        if (wfVersions != null) {
            //Both parameters are present
            oParameters.wfclassId   = workflows.value;
            oParameters.workflowId  = wfVersions.value;
        } else {
            //Only workflowId  is present
            oParameters.workflowId  = workflows.value;
        }
    }
    
    
    
    
    //-------- Sensor tree based reportsets:
    //Find WorkflowId, counterId and stopwatchId only, by checking current selected node in sensor tree
    if( document.getElementById("divSensorTree") != null ){

        var oSelectedTreeNode   = GetSelectedTreeNode();

        if(oSelectedTreeNode != null){
        
            var oNodeMetadata = jQuery.data(oSelectedTreeNode, "jstree");
            if(oNodeMetadata != null && oNodeMetadata.nodeType != null){
                if(oNodeMetadata.nodeType == "process")
                    oParameters.workflowId = oNodeMetadata.id;
                else if(oNodeMetadata.nodeType == "stopwatch"){
                    oParameters.stopwatchId = oNodeMetadata.id;
                    oParameters.workflowId = oNodeMetadata.workflowId;
                }
                else{
                    oParameters.counterId = oNodeMetadata.id;    
                    oParameters.workflowId = oNodeMetadata.workflowId;
                }
            }
        }
    }

    var taskIdSelected = document.getElementById("selectedTaskId");
    if (taskIdSelected != null)
        oParameters.taskId = taskIdSelected.value;

    //---------- User filters
    oParameters.userFiltersString  = GetEncodedFilterSet_ShortFormat();
    


    //---------- ReportSet identifier
    oParameters.reportSetId        = ReportSetId;



    //---------- History based reports:
    // Get time filters from iframe "iframeTimeFilter"
    var iFrameDateFilter = document.getElementById("iframeTimeFilter"),
        iFrameID = $(iFrameDateFilter).attr("id");

    if(iFrameDateFilter != null){
        oParameters.dateFrom    = FormatDateString_To_BADateString(iFrameDateFilter.contentWindow.sParamDateFrom);
        oParameters.dateTo      = FormatDateString_To_BADateString(iFrameDateFilter.contentWindow.sParamDateTo);
    }

    $(iFrameDateFilter).contents().find("body").addClass(iFrameID);

    return oParameters;
}


//---------- Saves the current report status as a user analysis query ------------------//
function SaveQuery(includeWorkflowId) {

    if(!IsQueryAvailable())
        return;
        
    var oParams = GetReportParameters();
    oParams.userFiltersString = GetEncodedFilterSet_LongFormat();
    if (includeWorkflowId) oParams.workflowId = "-1";

    var sUrl            = _reports_SaveQueryUrl + "?ReportSetId=" + oParams.reportSetId                            
                            + "&WorkflowId=" + oParams.workflowId
                            + "&StopwatchId=" + oParams.stopwatchId
                            + "&CounterId=" + oParams.counterId
                            + "&WfClassId=" + oParams.wfclassId
                            + "&TaskId=" + oParams.taskId
                            + "&userFilters=" + oParams.userFiltersString
                            + "&date=" + new Date();

    var arrButtons = [];
    arrButtons[0] = getModalWindowButton(jQuery("#hidMsgOK").val(), "buttonSave_onclick();", true);
    arrButtons[1] = getModalWindowButton(jQuery("#hidMsgCancel").val(), "buttonCancel_onclick();", true);
	openModalWindow(sUrl, 500, 480, arrButtons);
}

// ------------------
// Opens the analysis case/workitem list in a popup window
// Use row-col parameter schemme
// ------------------
function ChartClick(chartReportId, row, col){
    
    var oParams = GetReportParameters();

    var sUrl = _reports_CaseListUrl +  "?analysis=1"
                + "&Row=" + row + "&Col=" + col + "&ReportId=" + chartReportId
                + "&WorkflowId=" + oParams.workflowId       
                + "&idWfClass=" + oParams.wfclassId
                + "&ReportSetId=" + oParams.reportSetId
                + "&StopwatchId=" + oParams.stopwatchId
                + "&CounterId=" + oParams.counterId
                + "&userFilters=" + oParams.userFiltersString
                + "&date=" + new Date(); 
    if(oParams.dateFrom != ""){
        sUrl +=     "&dtFrom=" + oParams.dateFrom
                +   "&dtTo=" + oParams.dateTo
                +   "&history=1";
    }

    var currentUserId = -1;
    if (chartReportId == 33 && _resultTemporal != null) {
        var oResultTable = _resultTemporal.Results[0].resultTable;
        var columnUserId = GetTableColumnIndex(oResultTable, "iduser", false);
        currentUserId = oResultTable.rows[row][columnUserId].value;
    }
    
    if(currentUserId >-1) {
        sUrl    += "&currentUserId=" + currentUserId
                +  "&taskId=" + _curSelectedTask ;
        
    }
    


    var arrButtons = [];
    arrButtons[0] = getModalWindowButton(jQuery("#hidMsgClose").val(), "closeCurrentModalWindow(null);", false);

	openModalWindow(sUrl, 1000, 450, arrButtons, true);

}

// ------------------
// Opens the analysis case/workitem list in a popup window
// Use free parameter schemme
// ------------------

function ShowAnalysisDetailList(oParams, sCaseListUrl){
    if(!sCaseListUrl)
        sCaseListUrl = _reports_CaseListUrl;
        
    var sUrl = sCaseListUrl + "?analysis=1";
    
    jQuery.each(oParams, function(keyName, keyValue) {
                sUrl += "&" + keyName + "=" + keyValue;
    });    

    var arrButtons = [];
    arrButtons[0] = getModalWindowButton(jQuery("#hidMsgClose").val(), "closeCurrentModalWindow(null);", false);

	openModalWindow(sUrl, 1000, 450, arrButtons, true);
}

//--------------------------------------------------------------------------------------
//Checks if there is a process, process version or sensor selected to perform a query on it
//--------------------------------------------------------------------------------------
function IsQueryAvailable(){
    var oParams = GetReportParameters();
    if(oParams == null || 
                (oParams.workflowId < 0 || oParams.workflowId == "") 
            &&  (oParams.wfclassId < 0 || oParams.wfclassId == "")
            &&  (oParams.counterId < 0 || oParams.counterId == "")
            &&  (oParams.stopwatchId < 0 || oParams.stopwatchId == ""))
        return false;
    return true;
}


//------------------------------------------------------------------------------
// Uses jQuery to render a popup dialog with and iframe content
// -----
// _currentAnalysisDlg will contain the current open dialog, so that children
// iframes can just call "parent.closeCurrentModalWindow();" in order to 
// close themselves
//------------------------------------------------------------------------------


function openModalWindow(sUrl, dialogWidth, dialogHeight, buttonArray, resizeable){
    
    

    //Instance dialog
    var doc = this.ownerDocument;

    var popupDlg = jQuery('<div></div>')
        .appendTo("body", doc);
    
    _currentModalDialog = popupDlg;
    
    //Create frame
    var popupFrame = jQuery('<iframe class=\'clsPopupDlg\'></iframe>')
         .css({width: "100%", height: "100%"})
         .attr("marginWidth", 0) 
         .attr("marginHeight", 0) 
         .attr("frameBorder", 0) 
         .attr("scrolling", "auto") 
         .attr("src", sUrl) 
         .appendTo(popupDlg);


    //Prepare buttons object 
    var arrButtonsText = [];
    for(var iButton = 0; iButton < buttonArray.length; ++iButton){
        var sFuncText;
        if(buttonArray[iButton].isCallInside)
            sFuncText = "function(){jQuery(\".clsPopupDlg\").callInside( function(){ " + buttonArray[iButton].functionText + "} )}";
        else
            sFuncText = "function(){" + buttonArray[iButton].functionText + "}";
    
        arrButtonsText[iButton] = "\"" + buttonArray[iButton].text + "\" : " + sFuncText;
    }
    
    var sButonsText = "{" + arrButtonsText.join(", ") + "}";
    
    var oButtons = BAEval("(" + sButonsText + ")");

    var isResizeable = (resizeable == true);
    
    // Open dialog
    popupDlg.dialog({
        width: dialogWidth,
        height: dialogHeight,
        title: "Bizagi",
        modal: true,
        resizable: isResizeable,
        buttons: oButtons ,
        close: 
            function (ev, ui) {
                popupDlg.dialog('destroy');
                popupDlg.detach();
                jQuery(".clsPopupDlg").remove();
            }
    });
}


//------------- Gets a button object to be passed when calling openModalWindow ---------//
function getModalWindowButton(sButtonText, sFunctionText, bIsCallInside){
    var oButton = new Object();
    oButton.text = sButtonText;
    oButton.functionText = sFunctionText;
    oButton.isCallInside = bIsCallInside;
    
    return oButton;
}


//------------- Global current dialog ---------//
var _currentAnalysisDlg;


//------------- Close global dialog ---------//
function closeCurrentModalWindow(param){
    jQuery(_currentModalDialog).dialog("close");
}
    
//----------- Calls a function inside the current popup dialog frame -----------//
function CallInternalDialogFunction(oFunction){
    return jQuery(".clsPopupDlg").callInside(oFunction);
}

//------------- Shows a message box using jQuery UI ---------//
function ShowMessageBox(msg){
    var iHeight = 200;
    var iWidth = 350;
    
    var oDialog = jQuery("<div class=\"BAASMsgBox\"><div style=\"overflow: auto; height:100px;\" >" + msg + "</div></div>")
			.dialog({
				autoOpen: false,
				title: "Bizagi",
				width: iWidth,
				height: iHeight,
				modal:true,
				buttons: {
				    "Ok"    : function(){
				                jQuery(this).dialog('close');                
				                jQuery(this).dialog('destroy');
				                jQuery(".BAASMsgBox").remove();                
				              }
				    }
			});

    oDialog.dialog('open');
}


//---------- Creates an d/h/m string from the given number of minutes

function GetDurationStringFromMinutes(minutes, hoursDay){
    var arrDuration = GetTimeArrayFromMinutes(minutes, hoursDay);
    var sDuration = arrDuration[0] + "d  " + arrDuration[1] + "h:" + arrDuration[2] + "m";
    return sDuration;
}    

//---------- Creates an array of 3 integter positions (d/h/m) from the given number of minutes

function GetTimeArrayFromMinutes(minutes, hoursDay){
    minutes = TryParseInt(minutes, 0);

    var hoursDay = parseInt(hoursDay);
    var minutesDay = hoursDay * 60;

    var rDays = (minutes / minutesDay) | 0;
    var rHours = ((minutes % minutesDay) / 60) | 0;
    var rMins =  (minutes % 60);
    
    var arr = [rDays, rHours, rMins];
    return arr;
}

//-------- Attemps to parse an int strins, returns the parsed value or the given default value if error

function TryParseInt(str, defaultValue){
    var retValue = defaultValue;
    if(str != null){
        if(jQuery.trim(new String(str)).length > 0){
            if (!isNaN(str)){
                retValue = parseInt(str);
            }
        }
    }     
    return retValue; 
}

//---------------------------------------------------------------
// Implements Excel export for report plugins.
// Inserts the Excel icon inside the given cell element and applies the class iconExportToExcel. 
// The options object must contain all the plugin configuration 
//---------------------------------------------------------------

function ApplyExcelLink(oElement, options){

    var oResultTable    = options.ReportResult.resultTable;
    var iReportId       = options.ReportId;


    //Create Excel icon
    var oExcelLink = $("<div class='iconExportToExcel'></div>");


    //Define click event for the Excel icon
    oExcelLink.click(function(){

        //Create iframe to contain the Excel rendered report
        var oFrame = $("<iframe></iframe>")
                    .attr("src", _reports_PluginExcelExportUrl) 
                    .css("display", "none")
                    .appendTo(oElement);
        
        oFrame.load(function(){

            //Gets the table container on first load
            var oHiddenBuffer_ForTable = oFrame.callInside(
                function(){ 
                    if(document.forms.length > 0)
                        return $(".pluginTableData");
                    else
                        return null;    
                }
            );
            
            //Gets the reportId parameter container on first load
            var oHiddenBuffer_ForReportId = oFrame.callInside(
                function(){ 
                    if(document.forms.length > 0)
                        return $(".pluginReportId");
                    else
                        return null;    
                }
            );

            //Populate containers on firstload only
            if(oHiddenBuffer_ForReportId){
                
                oHiddenBuffer_ForTable.val(JSON.encode(oResultTable));
                oHiddenBuffer_ForReportId.val(iReportId);
                
                oFrame.callInside(function(){
                        if(document.forms.length > 0){
                            document.forms[0].submit();
                        }
                });
            }
        });
        

    });
    oElement.append(oExcelLink);            
}


//---------------------------------------------------------------
// Applies tooltip feature to report headers
// Hides description panel in reports and puts all that text in a tooltip .
// Receives the header DIV element, which should contain "reportTitleBar" and "lblReportDescription" elements.
//---------------------------------------------------------------


function ApplyTooltipDescription(oHeaderElement){

    //Text to show
    var sDescriptionHtml = $("#lblReportDescription", oHeaderElement).html();
    
    //Hide old description DIV
    $("#lblReportDescription", oHeaderElement).hide();
    $("#lblReportDescription", oHeaderElement).remove();
    
    //Create hint icon
    var oHint = $("<div/>").addClass("imgInformationHint").attr("title", sDescriptionHtml).tooltip( {
        track: true, 
        delay: 0, 
        extraClass: "sensorsToolTip", 
        top: 5, 
        left: 40,
        fade: 250 
        }
    );

    //Add hint icon
    $(".reportTitleBar", oHeaderElement).append(oHint);
}
